// direct API checks against the local worker
const U = "http://localhost:8790/oracle", O = { "Content-Type": "application/json", Origin: "http://localhost:8765" };
const post = (body, headers = O) => fetch(U, { method: "POST", headers, body: JSON.stringify(body) });
let r = await post({ kind: "chat", input: "hi" }, { "Content-Type": "application/json", Origin: "https://evil.example" });
console.log("bad origin", r.status, (await r.json()).code);
r = await post({ kind: "chat", input: [{ role: "user", content: 5 }] }); console.log("bad input", r.status);
r = await fetch(U, { method: "OPTIONS", headers: O }); console.log("preflight", r.status, r.headers.get("access-control-allow-origin"));
r = await post({ kind: "chat", input: [{ role: "user", content: "a" }, { role: "assistant", content: "b" }, { role: "user", content: "c" }] });
console.log("chat", r.status, r.headers.get("x-quota-left"), JSON.stringify(await r.text()));
console.log("stats", await (await fetch("http://localhost:8790/_stats")).text());
for (let i = 0; i < 6; i++) { r = await post({ kind: "reading", input: "x [[ANSWER" }); const t = await r.text(); if (i >= 4) console.log("reading", i + 1, r.status, t.slice(0, 120)); }

// usage log: a reading with its log meta, then a follow-up chat on the same reading code
const meta = { type: "reading", rid: "abc123", question: "เขาจะกลับมาไหม", topic: "love", qtype: "yesno", spread: "yesno", cards: ["The Tower (R) @ ปัจจุบัน"], life_stage: "วัยเริ่มทำงาน", minor: false, lens: "stoic", overall: 41 };
r = await post({ kind: "reading", input: "x [[ANSWER", log: { ...meta, name: "ห้ามเก็บ", dob: "2000-01-01" } }); await r.text();
r = await post({ kind: "chat", input: [{ role: "user", content: "rules" }, { role: "user", content: "ควรทักไปก่อนไหม" }], log: { type: "chat", rid: "abc123", question: "ควรทักไปก่อนไหม" } }); await r.text();
r = await post({ kind: "chat", input: "journal", log: { type: "journal", question: "บันทึกส่วนตัว" } }); await r.text();
const rows = JSON.parse(await (await fetch("http://localhost:8790/_log")).text());
const rd = rows.find(x => x.rid === "abc123" && x.type === "reading"), ch = rows.find(x => x.type === "chat" && x.rid === "abc123"), jr = rows.find(x => x.type === "journal");
console.log("log reading", rd && rd.question, rd && rd.status, rd && rd.model, rd && rd.lens, rd && rd.cards);
console.log("log chat", ch && ch.question, ch && ch.status, ch && (ch.answer || "").slice(0, 20));
console.log("log journal keeps no text", jr && jr.question === null && jr.answer === null);
console.log("log has no name/dob/ip", !JSON.stringify(rows).includes("ห้ามเก็บ") && !JSON.stringify(rows).includes("2000-01-01") && rows.every(x => /^[0-9a-f]{16}$/.test(x.visitor)));
console.log("log quota row", rows.some(x => x.status === "quota_visitor"));
await fetch("http://localhost:8790/_nocap");
r = await post({ kind: "reading", input: "x [[ANSWER" }); console.log("no cap after limit 0", r.status);
