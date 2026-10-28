const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', e => errs.push(e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
    await p.goto('file://' + __dirname + '/test.html'); await p.waitForTimeout(900);
    const sx = async tag => console.log(w, tag, 'scrollX', await p.evaluate(() => { scrollTo(600, scrollY); const x = scrollX; scrollTo(0, scrollY); return x; }));
    await p.screenshot({ path: __dirname + '/out/' + `h1-${w}.png`, fullPage: true }); await sx('hub');
    // hold to charge the card of the day
    await p.$eval('#daily-card', e => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(300); const card = await p.$('#daily-card'); const bb = await card.boundingBox();
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout(600); await p.mouse.up(); await p.waitForTimeout(200);
    console.log('released early, still closed:', !!(await p.$('#daily-card')));
    await p.mouse.down(); await p.waitForTimeout(2000); await p.mouse.up(); await p.waitForTimeout(1300);
    console.log('daily:', (await p.textContent('#hub-daily')).replace(/\s+/g, ' ').slice(0, 260));
    await p.screenshot({ path: __dirname + '/out/' + `h2-${w}.png`, fullPage: true });
    // library
    await p.click('#rooms [data-room=library]'); await p.waitForTimeout(600);
    console.log('lib cards', await p.$$eval('.lib-card', c => c.length));
    await p.click('[data-lf=cups]'); await p.waitForTimeout(200); console.log('cups', await p.$$eval('.lib-card', c => c.length));
    await p.fill('#lib-q', 'Star'); await p.waitForTimeout(200); await p.click('[data-lf=all]'); console.log('search Star', await p.$$eval('.lib-card span', c => c.map(x => x.textContent).join(',')));
    await p.click('.lib-card >> nth=0'); await p.waitForTimeout(400); console.log('info:', (await p.textContent('#modal-box')).replace(/\s+/g, ' ').slice(0, 200));
    await p.screenshot({ path: __dirname + '/out/' + `l1-${w}.png` }); await p.click('#modal-close');
    await sx('library');
    await p.click('[data-tab=quiz]'); await p.waitForTimeout(300);
    for (let i = 0; i < 12; i++) { await p.click('.q-opt >> nth=0'); await p.waitForTimeout(150); if (i === 0) await p.screenshot({ path: __dirname + '/out/' + `q1-${w}.png`, fullPage: true }); await p.click('#q-next'); await p.waitForTimeout(100); }
    console.log('quiz:', (await p.textContent('.q-title')).replace(/\s+/g, ' '), '|', (await p.textContent('.q-stats')).replace(/\s+/g, ' '));
    await sx('quiz');
    // bond
    await p.click('#rooms [data-room=bond]'); await p.waitForTimeout(400);
    console.log('bond prefilled dob?', await p.inputValue('#bond-a'));
    if (!(await p.inputValue('#bond-a'))) await p.fill('#bond-a', '1995-08-14');
    await p.fill('#bond-b', '1993-03-02'); await p.fill('#bond-w', 'แฟน'); await p.click('[data-rel=love]'); await p.click('#bond-form button[type=submit]'); await p.waitForTimeout(900);
    console.log('bond:', (await p.textContent('#bond-out')).replace(/\s+/g, ' ').slice(0, 700));
    await p.screenshot({ path: __dirname + '/out/' + `b1-${w}.png`, fullPage: true }); await sx('bond');
    // journal with seeded entries (one older than 7 days)
    await p.evaluate(() => {
      const t = Date.now() - 9 * 864e5;
      const h = { t, sp: 'ppf', q: { name: 'อรุณี', dob: '1995-08-14', text: 'งานใหม่จะไปได้ดีไหม', ctx: { subject: 'self', w: '', topic: 'career', type: 'yesno', A: '', B: '' }, roles: [] }, picks: [[17, 0], [52, 1], [3, 0]], ov: 68, code: 'ABCD', r: 9, sh: [40, 0] };
      const h2 = Object.assign({}, h, { t: Date.now() - 2 * 864e5, q: Object.assign({}, h.q, { text: 'เขาคิดยังไงกับฉัน', ctx: Object.assign({}, h.q.ctx, { topic: 'love' }) }), picks: [[17, 0], [36, 0], [6, 1]] });
      localStorage.setItem('astral-tarot-history-v1', JSON.stringify([h2, h]));
    });
    await p.click('#rooms [data-room=hub]'); await p.waitForTimeout(300);
    console.log('hub gate journal:', await p.textContent('.gate[data-room=journal]'), '| nav dot', !!(await p.$('#rooms .dot')));
    await p.click('#rooms [data-room=journal]'); await p.waitForTimeout(400);
    await p.screenshot({ path: __dirname + '/out/' + `j1-${w}.png`, fullPage: true }); await sx('journal');
    console.log('pattern:', (await p.textContent('.j-pattern')).replace(/\s+/g, ' ').slice(0, 400));
    await p.click('.j-sec [data-act=review] >> nth=0'); await p.click('.j-form:not([hidden]) [data-v=part]');
    await p.fill('.j-form:not([hidden]) textarea', 'ได้งานแต่ต้องย้ายแผนก ตอนแรกกลัวมาก สุดท้ายได้เริ่มต้นใหม่');
    await p.click('.j-form:not([hidden]) button[type=submit]'); await p.waitForTimeout(800);
    console.log('reflection:', (await p.textContent('.j-fu')).replace(/\s+/g, ' ').slice(0, 600));
    console.log('nav dot after review', !!(await p.$('#rooms .dot')));
    await p.click('[data-act=del] >> nth=1'); await p.click('[data-act=del] >> nth=1'); await p.waitForTimeout(200);
    console.log('entries after delete', await p.$$eval('.j-entry', e => e.length));
    // shuffle hold-to-charge
    await p.click('#rooms [data-room=ask]'); await p.waitForTimeout(300);
    console.log('ask prefilled:', await p.inputValue('#q-dob'));
    await p.fill('#q-text', 'ควรย้ายงานไหม'); await p.click('#intent button[type=submit]'); await p.waitForTimeout(500);
    await p.$eval('#btn-charge', e => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(300); const cb = await (await p.$('#btn-charge')).boundingBox();
    await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.mouse.down(); await p.waitForTimeout(3500);
    await p.screenshot({ path: __dirname + '/out/' + `s1-${w}.png` });
    await p.mouse.up(); await p.waitForTimeout(1200);
    console.log('riffles after hold', await p.textContent('#riffle-count'), await p.textContent('#rand-pct'));
    await p.click('#music-btn'); await p.waitForTimeout(500); console.log('music', await p.textContent('#music-btn'));
    await p.click('#music-btn'); await p.waitForTimeout(200);
    console.log(w, 'errors', errs);
    await p.close();
  }
  await b.close();
})();
