import http from "node:http";
import worker, { Quota } from "../worker/worker.js";
const FAKE = process.env.FAKE || "";
const realFetch = globalThis.fetch;
let geminiCalls = 0, lastBody = null, tried = [];
globalThis.fetch = async (url, init) => {
  if (String(url).includes("generativelanguage")) {
    const model = String(url).match(/models\/([^:]+)/)[1]; tried.push(model);
    if (model === "busy") return new Response("overloaded", { status: 503 });
    geminiCalls++; lastBody = JSON.parse(init.body);
    if (process.env.GEMINI_DOWN) return new Response("down", { status: 500 });
    const text = lastBody.contents.length > 1 || !lastBody.contents[0].parts[0].text.includes("[[ANSWER") ? "ควรรอให้เขาพร้อมก่อน แล้วค่อยเริ่มบทสนทนาแบบเบาๆ" : FAKE;
    const chunks = text.match(/[\s\S]{1,80}/g) || [];
    const stream = new ReadableStream({ async start(c) {
      c.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: "thinking...", thought: true }] } }] })}\r\n\r\n`));
      for (const ch of chunks) { await new Promise(r => setTimeout(r, 15)); c.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: ch }] } }] })}\r\n\r\n`)); }
      c.close(); } });
    return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
  }
  return realFetch(url, init);
};
const objs = {};
const mkStorage = () => { const m = new Map(); return { get: async k => m.get(k), put: async (k, v) => m.set(k, v), delete: async k => m.delete(k), list: async () => new Map(m) }; };
const env = {
  ALLOWED_ORIGINS: "http://localhost:8765", GEMINI_API_KEY: "test", GEMINI_MODEL: "busy, ok", READING_LIMIT: "5", CHAT_LIMIT: "20", DAILY_CAP: "1000",
  QUOTA: { idFromName: n => n, get: n => ({ fetch: (u, i) => (objs[n] ||= new Quota({ storage: mkStorage() })).fetch(new Request(u, i)) }) }
};
http.createServer(async (req, res) => {
  if (req.url === "/_stats") { res.end(JSON.stringify({ geminiCalls, system: lastBody && lastBody.systemInstruction.parts[0].text.slice(0, 40), roles: lastBody && lastBody.contents.map(c => c.role), tried: tried.slice(-2) })); return; }
  const chunks = []; for await (const c of req) chunks.push(c);
  const r = new Request("http://localhost:8790" + req.url, { method: req.method, headers: req.headers, body: ["GET", "HEAD", "OPTIONS"].includes(req.method) ? undefined : Buffer.concat(chunks) });
  const out = await worker.fetch(r, env);
  res.writeHead(out.status, Object.fromEntries(out.headers));
  if (out.body) for await (const c of out.body) res.write(c);
  res.end();
}).listen(8790, () => console.log("worker on 8790"));
