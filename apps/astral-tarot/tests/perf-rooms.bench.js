// performance check: frame times and main-thread time per room while the pointer moves, on the real GPU
// usage: node perf-rooms.bench.js [html file, default test.html] [label] [cpu slowdown, 4 ~ a mid-range phone]
const { chromium } = require('playwright');
const FILE = process.argv[2] || __dirname + '/test.html', LABEL = process.argv[3] || 'run', THR = +(process.argv[4] || 1);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.addInitScript(() => { sessionStorage.setItem('astral-tarot-intro', '1'); localStorage.setItem('astral-tarot-profile-v1', JSON.stringify({ dob: '1995-08-14' })); });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Performance.enable');
  if (THR > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: THR });
  await p.goto('file://' + FILE); await p.waitForTimeout(2500);
  const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  const rooms = [['ask', null], ['hub', '#rooms [data-room=hub]'], ['library', '#rooms [data-room=library]'], ['journal', '#rooms [data-room=journal]']];
  const out = [];
  for (const [name, sel] of rooms) {
    if (sel) { await p.click(sel); await p.waitForTimeout(1800); }
    await p.evaluate(() => { window.__ft = []; let l = performance.now(); const f = t => { window.__ft.push(t - l); l = t; if (window.__ft.length < 100000) requestAnimationFrame(f); }; requestAnimationFrame(f); });
    const m0 = await metrics();
    const t0 = Date.now(); let k = 0;
    while (Date.now() - t0 < 5000) { k++; await p.mouse.move(960 + Math.sin(k / 6) * 700, 540 + Math.cos(k / 9) * 380); await p.waitForTimeout(16); }
    if (name === 'ask' || name === 'library') { await p.mouse.wheel(0, 600); await p.waitForTimeout(600); await p.mouse.wheel(0, -600); await p.waitForTimeout(600); }
    const m1 = await metrics();
    const ft = await p.evaluate(() => window.__ft.slice(2)); await p.evaluate(() => { window.__ft.length = 1e9; });
    ft.sort((a, b) => a - b); const q = x => ft[Math.floor(ft.length * x)].toFixed(1);
    const sec = (m1.Timestamp - m0.Timestamp), per = k => ((m1[k] - m0[k]) / sec * 1000).toFixed(0);
    out.push({ room: name, fps: (ft.length / sec).toFixed(0), p50: q(.5), p95: q(.95), p99: q(.99), jank: (ft.filter(x => x > 20).length / ft.length * 100).toFixed(1) + '%',
      'style ms/s': per('RecalcStyleDuration'), 'layout ms/s': per('LayoutDuration'), 'script ms/s': per('ScriptDuration'), 'task ms/s': per('TaskDuration') });
  }
  console.log(LABEL + (THR > 1 ? ` (CPU ${THR}x slower)` : ''));
  console.table(out);
  await b.close();
})();
