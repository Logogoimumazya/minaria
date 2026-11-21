const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1366, height: 800 } });
  let body = null;
  await p.route("**/oracle", r => { body = r.request().postData(); r.abort(); });
  await p.goto("https://astral-tarot.pages.dev/?debug=0", { waitUntil: "networkidle" });
  console.log("whoAmI in page:", await p.evaluate(() => typeof whoAmI));
  await p.fill("#q-name", "ทดสอบสด"); await p.fill("#q-text", "ทดสอบ"); 
  await p.evaluate(() => whoAmI && console.log(JSON.stringify(whoAmI())));
  console.log("who:", await p.evaluate(() => JSON.stringify(whoAmI())));
  await b.close();
})();
