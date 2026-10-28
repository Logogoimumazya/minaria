// performance check: frame times through each phase of a full reading (house book, no AI), on the real GPU
// usage: node perf-ritual.bench.js [html file] [cpu slowdown] [width] [height] [device pixel ratio]
const { chromium } = require('playwright');
const [FILE = __dirname + '/test.html', THR = 1, VW = 1920, VH = 1080, DPR = 1] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
  const p = await b.newPage({ viewport: { width: +VW, height: +VH }, deviceScaleFactor: +DPR });
  await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
  const cdp = await p.context().newCDPSession(p); if (+THR > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: +THR });
  await p.goto('file://' + FILE); await p.waitForTimeout(2000);
  await p.evaluate(() => { window.__ft = []; let l = performance.now(); const f = t => { window.__ft.push(t - l); l = t; requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const rows = [];
  const phase = async (name, fn) => { await p.evaluate(() => { window.__ft.length = 0; }); const t0 = Date.now(); await fn(); const sec = (Date.now() - t0) / 1000; const ft = await p.evaluate(() => window.__ft.slice(1)); ft.sort((a, b) => a - b); rows.push({ phase: name, sec: sec.toFixed(1), fps: Math.round(ft.length / sec), p95: ft[Math.floor(ft.length * .95)].toFixed(0) + 'ms', worst: ft[ft.length - 1].toFixed(0) + 'ms', 'jank %': Math.round(ft.filter(x => x > 20).length / ft.length * 100) }); };
  await p.fill('#q-text', 'งานใหม่จะดีไหม'); await p.click('label[for=sp-celtic]');
  await phase('start → shuffle', async () => { await p.click('#intent button[type=submit]'); await p.waitForTimeout(1500); });
  await phase('riffle ×10', async () => { await p.click('#btn-riffle-many'); await p.waitForFunction(() => !document.querySelector('#btn-cut').disabled, null, { timeout: 120000 }); });
  await phase('cut + fan out 78', async () => { await p.click('#btn-cut'); await p.waitForSelector('.pile-btn'); await p.click('.pile-btn >> nth=1'); await p.waitForSelector('#stage-pick:not([hidden])'); await p.waitForTimeout(2500); });
  await phase('pick 10 cards', async () => { for (let i = 0; i < 10; i++) { await p.click(`#fan .card:not(.taken) >> nth=${3 + i * 4}`, { force: true }); await p.waitForTimeout(300); } await p.waitForSelector('#stage-reveal:not([hidden])'); await p.waitForTimeout(1500); });
  await phase('reveal all + shadow', async () => { await p.click('#btn-reveal-all'); await p.waitForSelector('#shadow-slot:not([hidden])', { timeout: 90000 }); await p.waitForTimeout(2500); });
  await phase('wait for typing to finish', async () => { await p.waitForFunction(() => document.querySelector('#chron-nav') && !document.querySelector('#chron-nav').hidden && !document.querySelector('.caret'), null, { timeout: 120000 }); });
  await phase('reading scroll', async () => { for (let i = 0; i < 25; i++) { await p.mouse.wheel(0, 260); await p.waitForTimeout(110); } for (let i = 0; i < 25; i++) { await p.mouse.wheel(0, -260); await p.waitForTimeout(110); } });
  console.table(rows); await b.close();
})();
