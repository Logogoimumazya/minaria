const { chromium } = require('playwright');
const FAKE = `[[ANSWER|2]]
คำตอบของหมอคือ **ใช่ ถ้าคุณให้เวลาเขาอีกสักพัก** แฟนของคุณยังมีใจ แต่ต้องการเวลาให้แผลเก่าสมานก่อน

[[JOURNEY|1,2,3]]
ไพ่ใบแรกเล่าถึงสิ่งที่ค้างอยู่ในใจของแฟน ส่วนใบกลางคือหัวใจของคำตอบ

ใบสุดท้ายบอกว่าแรงขวางเบาบางกว่าที่คิด
[[DIALOGUE|1,2]]
ไพ่ใบที่หนึ่งกับสองเป็นธาตุที่หนุนกัน ความหมายจึงชัดขึ้น
[[SHADOW]]
ไพ่เงาบอกว่ายังมีความกลัวการถูกทิ้งซ่อนอยู่
[[ADVICE|2]]
ให้เวลาและพูดตรงๆ เมื่อจังหวะเหมาะ
[[POEM]]
แสงดาวยังรอปลายฟ้า
หัวใจที่ล้ามาพักพิง
คำที่จริงใจคือสิ่งจริง
ทุกสิ่งจะนิ่งงามเมื่อถึงยาม
[[ASK]]
ควรทักเขาก่อนไหม
เขาจะกลับมาเมื่อไหร่
ฉันต้องเปลี่ยนอะไรในตัวเอง`;
const init = ({ mode, FAKE }) => {
  if (mode === 'none') return;
  window.__calls = [];
  const sample = (input, opts = {}) => new Promise((res, rej) => {
    window.__calls.push(typeof input === 'string' ? input : input.map(t => t.role + ':' + t.content.slice(0, 40)));
    if (mode === 'denied') return setTimeout(() => rej({ code: 'not_granted', message: 'no' }), 300);
    const text = typeof input === 'string' ? FAKE : 'ควรรอให้เขาพร้อมก่อน แล้วค่อยเริ่มบทสนทนาแบบเบาๆ';
    let k = 0;
    setTimeout(function tick() {
      if (opts.signal && opts.signal.aborted) return rej({ code: 'cancelled', message: 'x', text: text.slice(0, k) });
      k = Math.min(text.length, k + 60); opts.onText && opts.onText({ text: text.slice(0, k), delta: '' });
      if (k < text.length) setTimeout(tick, 40); else res({ text, truncated: false, modelTierApplied: 'default' });
    }, 900);
  });
  window.claude = { use: async name => name === 'sample' ? sample : null };
};
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  for (const [mode, w, h, sp] of [['claude', 1280, 900, 'yesno'], ['none', 390, 844, 'celtic'], ['denied', 1280, 900, 'ppf']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript(init, { mode, FAKE });
    const errs = []; p.on('pageerror', e => errs.push(e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
    await p.goto('file://' + __dirname + '/test.html'); await p.waitForTimeout(600); await p.click('#rooms [data-room=ask]'); await p.waitForTimeout(300);
    await p.fill('#q-name', 'อรุณี'); await p.evaluate(() => { document.getElementById('q-dob').value = '1995-08-14'; }); await p.fill('#q-text', 'แฟนจะกลับมาไหม'); await p.click('#roles .role >> nth=1'); await p.waitForTimeout(400);
    await p.click(`label[for=sp-${sp}]`);
    await p.click('#intent button[type=submit]'); await p.waitForTimeout(400);
    await p.click('#btn-riffle-many');
    await p.waitForFunction(() => !document.querySelector('#btn-cut').disabled, null, { timeout: 60000 });
    await p.click('#btn-cut'); await p.waitForSelector('.pile-btn'); await p.click('.pile-btn >> nth=1');
    await p.waitForSelector('#stage-pick:not([hidden])'); await p.waitForTimeout(1500);
    const n = await p.$$eval('#slots .slot', s => s.length);
    for (let i = 0; i < n; i++) { await p.click(`#fan .card:not(.taken) >> nth=${3 + i * 5}`, { force: true }); await p.waitForTimeout(220); }
    await p.waitForSelector('#stage-reveal:not([hidden])'); await p.waitForTimeout(1500);
    await p.click('#btn-reveal-all');
    await p.waitForSelector('#shadow-slot:not([hidden])', { timeout: 30000 }); await p.waitForTimeout(1600);
    await p.screenshot({ path: __dirname + '/out/' + `o1-${mode}.png` });
    await p.waitForSelector('#reading:not([hidden])', { timeout: 30000 });
    await p.waitForTimeout(700);
    await p.$eval('#chron', e => e.scrollIntoView()); await p.waitForTimeout(300);
    await p.screenshot({ path: __dirname + '/out/' + `o2-${mode}.png` });
    await p.waitForFunction(() => document.querySelector('#chron-nav') && !document.querySelector('#chron-nav').hidden && !document.querySelector('.caret'), null, { timeout: 30000 });
    await p.waitForTimeout(500);
    console.log('==', mode, 'status:', await p.textContent('#chron-status'), '| tabs:', await p.$$eval('.ctab', t => t.map(x => x.textContent).join(' / ')));
    console.log('askmore visible:', await p.$eval('#askmore', e => !e.hidden), '| sugs:', await p.$$eval('.sug', t => t.map(x => x.textContent).join(' / ')));
    await p.screenshot({ path: __dirname + '/out/' + `o3-${mode}.png` });
    await p.click('.ctab >> nth=1'); await p.waitForTimeout(500);
    console.log('chapter 2:', (await p.textContent('.ch-body')).slice(0, 260));
    if (mode === 'claude') {
      await p.click('.sug >> nth=0'); await p.waitForTimeout(2600);
      console.log('chat:', await p.$$eval('.bub', b => b.map(x => x.textContent).join(' || ')));
      const calls = await p.evaluate(() => window.__calls);
      console.log('prompt chars', calls[0].length, '| chat turns', JSON.stringify(calls[1]).slice(0, 160));
    }
    await p.click('#btn-png'); await p.waitForSelector('.share-prev img', { timeout: 20000 }); await p.waitForTimeout(800); await p.screenshot({ path: __dirname + '/out/' + `png-${mode}.png` }); console.log('png size', await p.$eval('.share-prev img', i => i.naturalWidth + 'x' + i.naturalHeight)); const b64 = await p.$eval('.share-prev img', async i => { const r = await fetch(i.src); const bl = await r.blob(); return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result.split(',')[1]); fr.readAsDataURL(bl); }); }); require('fs').writeFileSync(__dirname + '/out/' + `card-${mode}.png`, Buffer.from(b64, 'base64')); await p.click('#modal-close');
    await p.$eval('.starmap', e => e.scrollIntoView()); await p.waitForTimeout(300);
    await p.screenshot({ path: __dirname + '/out/' + `o4-${mode}.png` });
    console.log('links drawn:', await p.$$eval('#board .lnk', l => l.length), '| combos:', await p.$$eval('.combo', c => c.length));
    // reopen from history keeps the chronicle
    await p.click('#btn-again'); await p.waitForTimeout(400);
    await p.click('#history summary'); await p.click('#history-list button >> nth=0');
    await p.waitForSelector('#reading:not([hidden])'); await p.waitForTimeout(800);
    console.log('reopened status:', await p.textContent('#chron-status'), '| shadow visible', await p.$eval('#shadow-slot', e => !e.hidden));
    console.log('canScrollX', await p.evaluate(() => { scrollTo(500, scrollY); const x = scrollX; scrollTo(0, scrollY); return x; }), 'errors', errs);
    await p.close();
  }
  await b.close();
})();
