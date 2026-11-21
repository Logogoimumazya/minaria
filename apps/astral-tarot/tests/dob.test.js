// the birth-date wheel: mouse wheel, clicking a row, keyboard, era switch, touch scrolling, and the value it writes back
const { chromium } = require('playwright');
const val = p => p.evaluate(() => document.getElementById('q-dob').value);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  // desktop with a mouse
  let p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
  await p.goto('file://' + __dirname + '/test.html'); await p.waitForTimeout(900);
  console.log('first room is ask:', await p.$eval('#stage-ask', e => !e.hidden), '| strip:', (await p.textContent('#sky-strip')).trim());
  console.log('field:', (await p.textContent('#q-dob-btn')).trim());
  await p.click('#q-dob-btn'); await p.waitForTimeout(400);
  await p.screenshot({ path: __dirname + '/out/dob-desktop-open.png' });
  // year: three wheel notches down = three years earlier
  const yb = await (await p.$('#w-y')).boundingBox();
  await p.mouse.move(yb.x + yb.width / 2, yb.y + yb.height / 2);
  for (let i = 0; i < 3; i++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(150); }
  await p.waitForTimeout(500);
  // month: click the row just below the centre (one month later)
  const mb = await (await p.$('#w-m')).boundingBox();
  await p.mouse.click(mb.x + mb.width / 2, mb.y + 100 + 40); await p.waitForTimeout(600);
  // day: keyboard
  await p.focus('#w-d'); for (let i = 0; i < 13; i++) await p.keyboard.press('ArrowDown');
  await p.waitForTimeout(700);
  console.log('preview:', (await p.textContent('#dob-pre')).trim());
  await p.click('[data-era=ce]'); await p.waitForTimeout(200);
  console.log('preview CE:', (await p.textContent('#dob-pre')).trim());
  await p.screenshot({ path: __dirname + '/out/dob-desktop-picked.png' });
  await p.click('#dob-ok'); await p.waitForTimeout(200);
  console.log('value:', await val(p), '| field:', (await p.textContent('#q-dob-btn')).trim());
  // reopening keeps the date; 31 is greyed out in February and the day clamps
  await p.click('#q-dob-btn'); await p.waitForTimeout(300);
  await p.focus('#w-d'); await p.keyboard.press('End'); await p.waitForTimeout(500);
  console.log('m idx before', await p.evaluate(() => DOB.m.i));
  await p.focus('#w-m'); await p.keyboard.press('Home'); await p.waitForTimeout(400); console.log('m after home', await p.evaluate(() => DOB.m.i)); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(900); console.log('m after down', await p.evaluate(() => DOB.m.i));
  console.log('feb preview:', (await p.textContent('#dob-pre')).trim(), '| off days:', await p.$$eval('#w-d .w-item.off', n => n.map(x => x.textContent).join(',')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  console.log('escape keeps value:', await val(p), '| sheet hidden:', await p.$eval('#dob-sheet', e => e.hidden));
  // writing .value from code repaints the field
  await p.evaluate(() => { document.getElementById('q-dob').value = '2001-12-25'; });
  console.log('set from code:', (await p.textContent('#q-dob-btn')).trim());
  console.log('desktop errors', errs); await p.close();
  // phone with touch: native scrolling of the wheel
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  p = await ctx.newPage(); const errs2 = []; p.on('pageerror', e => errs2.push(e.stack));
  await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
  await p.goto('file://' + __dirname + '/test.html'); await p.waitForTimeout(900);
  await p.screenshot({ path: __dirname + '/out/dob-phone-ask.png' });
  await p.tap('#q-dob-btn'); await p.waitForTimeout(400);
  await p.$eval('#w-y', e => e.scrollTo({ top: e.scrollTop + 40 * 5 })); await p.waitForTimeout(700);
  await p.$eval('#w-m', e => e.scrollTo({ top: 40 * 7 })); await p.waitForTimeout(700);
  await p.screenshot({ path: __dirname + '/out/dob-phone-open.png' });
  await p.tap('#dob-ok'); await p.waitForTimeout(200);
  console.log('phone value:', await val(p), '| field:', (await p.textContent('#q-dob-btn')).trim());
  console.log('phone scrollX', await p.evaluate(() => { scrollTo(500, 0); return scrollX; }), 'errors', errs2);
  await b.close();
})();
