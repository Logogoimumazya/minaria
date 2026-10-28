// the bond room's own birth cards follow a birth date first given in the bond form, and an under-18 date drops the love option
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  for (const [dob, label] of [['1995-08-14', 'adult'], ['2012-05-01', 'minor']]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
    await p.goto('file://' + __dirname + '/test.html'); await p.waitForTimeout(600);
    await p.click('#rooms [data-room=bond]'); await p.waitForTimeout(400);
    const before = await p.$$eval('#bond-mine .bond-me', e => e.length);
    await p.evaluate(d => { document.getElementById('bond-a').value = d; document.getElementById('bond-b').value = '1993-03-02'; }, dob);
    await p.click('#bond-form button[type=submit]'); await p.waitForTimeout(900);
    const cards = await p.$$eval('#bond-mine .bond-me h4', h => h.map(x => x.textContent));
    const love = await p.$$eval('#bond-form [data-rel=love]', e => e.length);
    const pressed = await p.$$eval('#bond-form [aria-pressed=true]', e => e.map(x => x.dataset.rel));
    console.log(label, '| before', before, '| after', cards.join(', '), '| love option', love, '| pressed', pressed.join(), '| out', (await p.textContent('#bond-out')).trim().length > 0);
    await p.screenshot({ path: __dirname + '/out/' + `bond-${label}.png`, fullPage: true });
    console.log(label, 'errors', errs);
    await p.close();
  }
  await b.close();
})();
