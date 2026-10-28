const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  // 1) wide desktop, full motion: intro then hub
  let p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  let errs = []; p.on('pageerror', e => errs.push(e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/test.html#debug'); await p.waitForTimeout(700);
  await p.screenshot({ path: __dirname + '/out/' + 'i1.png' });
  await p.waitForTimeout(1500); await p.screenshot({ path: __dirname + '/out/' + 'i2.png' });
  await p.waitForTimeout(2500);
  console.log('intro gone', !(await p.$('.intro-scene')), 'motion ask', !!(await p.$('.motion-ask')));
  await p.mouse.move(300, 300); await p.waitForTimeout(4000);
  await p.screenshot({ path: __dirname + '/out/' + 'w1.png' });
  console.log('debug:', await p.textContent('.debug'));
  console.log('floaters', await p.$$eval('.floater', f => f.length));
  await p.click('#rooms [data-room=library]'); await p.waitForTimeout(1500); await p.screenshot({ path: __dirname + '/out/' + 'w2.png' });
  await p.click('#gfx-btn'); await p.waitForTimeout(300); await p.screenshot({ path: __dirname + '/out/' + 'w3.png', clip: { x: 1100, y: 0, width: 820, height: 500 } });
  console.log('errors', errs); await p.close();
  // 2) OS reduced motion: prompt appears, choosing full reloads into full motion
  const ctx = await b.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  p = await ctx.newPage(); errs = []; p.on('pageerror', e => errs.push(e.stack));
  await p.goto('file://' + __dirname + '/test.html#debug'); await p.waitForTimeout(1600);
  console.log('reduce: ask shown', !!(await p.$('.motion-ask')), 'class', await p.evaluate(() => document.documentElement.className));
  await p.screenshot({ path: __dirname + '/out/' + 'm1.png' });
  await p.click('.motion-ask [data-m=full]'); await p.waitForTimeout(2500);
  console.log('after full: class', await p.evaluate(() => document.documentElement.className), 'ask', !!(await p.$('.motion-ask')));
  await p.waitForTimeout(1200); console.log('debug:', await p.textContent('.debug'));
  console.log('errors', errs);
  // 3) phone
  const p3 = await b.newPage({ viewport: { width: 390, height: 844 } }); errs = []; p3.on('pageerror', e => errs.push(e.stack));
  await p3.goto('file://' + __dirname + '/test.html'); await p3.waitForTimeout(4500);
  await p3.screenshot({ path: __dirname + '/out/' + 'ph1.png' });
  console.log('phone scrollX', await p3.evaluate(() => { scrollTo(500, 0); return scrollX; }), 'errors', errs);
  await b.close();
})();
