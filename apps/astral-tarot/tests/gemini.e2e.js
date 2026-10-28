const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(800);
  await p.click('#rooms [data-room=ask]'); await p.waitForTimeout(300);
  console.log('ai note visible', await p.$eval('#ai-note', e => !e.hidden));
  await p.fill('#q-text', 'แฟนจะกลับมาไหม'); await p.click('label[for=sp-yesno]');
  await p.click('#intent button[type=submit]'); await p.waitForTimeout(400);
  await p.click('#btn-riffle-many');
  await p.waitForFunction(() => !document.querySelector('#btn-cut').disabled, null, { timeout: 90000 });
  await p.click('#btn-cut'); await p.waitForSelector('.pile-btn'); await p.click('.pile-btn >> nth=1');
  await p.waitForSelector('#stage-pick:not([hidden])'); await p.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) { await p.click(`#fan .card:not(.taken) >> nth=${3 + i * 5}`, { force: true }); await p.waitForTimeout(250); }
  await p.waitForSelector('#stage-reveal:not([hidden])'); await p.waitForTimeout(1500);
  await p.click('#btn-reveal-all');
  await p.waitForSelector('#reading:not([hidden])', { timeout: 60000 });
  await p.waitForFunction(() => document.querySelector('#chron-nav') && !document.querySelector('#chron-nav').hidden && !document.querySelector('.caret'), null, { timeout: 60000 });
  console.log('status:', await p.textContent('#chron-status'), '| tabs:', await p.$$eval('.ctab', t => t.length), '| retry label', await p.textContent('#chron-retry'));
  await p.click('.sug >> nth=0'); await p.waitForTimeout(2500);
  console.log('chat:', await p.$$eval('.bub', b => b.map(x => x.textContent).join(' || ')));
  console.log('stats', await (await fetch('http://localhost:8790/_stats')).text());
  console.log('errors', errs);
  await b.close();
})();
