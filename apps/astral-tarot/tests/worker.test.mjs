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
