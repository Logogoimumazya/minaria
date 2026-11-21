// admin monitor page in a real browser: needs worker-local.mjs running with ADMIN_PASSWORD=test-pass and worker.test.mjs run once
const { chromium } = require("playwright");
(async () => {
  const errors = [], b = await chromium.launch();
  for (const [w, h] of [[1366, 800], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, httpCredentials: { username: "admin", password: "test-pass" } });
    p.on("pageerror", e => errors.push(String(e))); p.on("dialog", d => { errors.push("dialog " + d.message()); d.dismiss(); });
    await p.goto("http://localhost:8790/admin"); await p.waitForSelector(".ev");
    const names = await p.$$eval(".person b", n => n.map(x => x.textContent));
    const xss = await p.$$eval(".ev .q", n => n.map(x => x.textContent).find(t => t.includes("<img")));
    await p.click("text=อรุณี"); await p.waitForFunction(() => [...document.querySelectorAll(".ev .who")].every(x => x.textContent === "อรุณี"));
    const feedN = await p.$$eval(".ev", n => n.length);
    await p.fill("#search", "งานใหม่"); await p.waitForTimeout(900);
    const found = await p.$$eval(".ev .q", n => n.length);
    const scrollX = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await p.screenshot({ path: `out/admin-${w}.png`, fullPage: false });
    console.log(w, "people:", names.slice(0, 3).join(" / "), "| xss as text:", !!xss, "| person feed", feedN, "| search", found, "| scrollX", scrollX);
    await p.close();
  }
  await b.close(); console.log("errors", errors);
})();
