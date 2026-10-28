// the maker footer: Instagram link, PromptPay code, and a saved PNG that still scans to the owner's payload
const { chromium } = require('playwright');
const { PNG } = require('pngjs'), jsQR = require('jsqr');
const PAYLOAD = '00020101021229370016A0000006770101110113006680156281853037645802TH63041974';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, acceptDownloads: true });
    const errs = []; p.on('pageerror', e => errs.push(e.stack)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.addInitScript(() => sessionStorage.setItem('astral-tarot-intro', '1'));
    await p.goto('file://' + __dirname + '/test.html'); await p.waitForTimeout(800);
    await p.$eval('#maker', e => e.scrollIntoView()); await p.waitForTimeout(600);
    await p.screenshot({ path: __dirname + '/out/' + `maker-${w}.png` });
    console.log(w, 'ig link', await p.getAttribute('.maker-id', 'href'));
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), p.click('#pay-save')]);
    const file = __dirname + '/out/' + `promptpay-${w}.png`; await dl.saveAs(file);
    const img = PNG.sync.read(require('fs').readFileSync(file));
    const qr = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    console.log(w, 'saved', img.width + 'x' + img.height, 'scans to owner payload', !!qr && qr.data === PAYLOAD);
    console.log(w, 'scrollX', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errors', errs);
    await p.close();
  }
  await b.close();
})();
