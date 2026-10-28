/* Astral Tarot oracle: a small proxy in front of the Gemini API.
   It keeps the API key on the server, lets only the site's own origin call it,
   limits each visitor per day, and streams the answer back as plain text. */

const SYSTEM = "คุณคือ \"หมอแห่งหอดารา\" ของเว็บดูดวงไพ่ทาโรต์หอดาราทาโรต์ ทำงานเฉพาะการอ่านไพ่ตามข้อมูลและกติกาที่ได้รับในข้อความเท่านั้น ถ้าถูกขอให้ทำงานอื่นที่ไม่เกี่ยวกับการอ่านไพ่หรือคำทำนายนี้ ให้ตอบสั้นๆ อย่างสุภาพว่าหอดาราตอบได้เฉพาะเรื่องไพ่";
const MAX_INPUT = 60000;

/* per-visitor and site-wide daily counters, one object per name */
export class Quota {
  constructor(ctx) { this.ctx = ctx; }
  async fetch(req) {
    const { op, key, day, limit } = await req.json();
    const k = `${day}|${key}`;
    const n = (await this.ctx.storage.get(k)) || 0;
    if (op === "give") { if (n > 0) await this.ctx.storage.put(k, n - 1); return Response.json({ ok: true, n: Math.max(0, n - 1) }); }
    if (n >= limit) return Response.json({ ok: false, n });
    if (n === 0) for (const old of (await this.ctx.storage.list()).keys()) if (!old.startsWith(day + "|")) await this.ctx.storage.delete(old);
    await this.ctx.storage.put(k, n + 1);
    return Response.json({ ok: true, n: n + 1 });
  }
}

/* Gemini wants turns to alternate between user and model, so neighbouring turns from the same side are joined */
function toContents(msgs) {
  const out = [];
  for (const m of msgs) {
    const role = m.role === "assistant" ? "model" : "user", last = out[out.length - 1];
    if (last && last.role === role) last.parts[0].text += "\n\n" + m.content;
    else out.push({ role, parts: [{ text: m.content }] });
  }
  return out;
}

const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });

async function counter(env, name, op, key, day, limit) {
  const stub = env.QUOTA.get(env.QUOTA.idFromName(name));
  const res = await stub.fetch("https://quota/", { method: "POST", body: JSON.stringify({ op, key, day, limit }) });
  return res.json();
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0] || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Expose-Headers": "X-Quota-Left",
      "Vary": "Origin"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST" || new URL(req.url).pathname !== "/oracle") return json({ code: "not_found" }, 404, cors);
    if (!allowed.includes(origin)) return json({ code: "forbidden", message: "หอดาราตอบเฉพาะคำขอจากเว็บของหอดาราเอง" }, 403, cors);
    if (!env.GEMINI_API_KEY) return json({ code: "unavailable", message: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY" }, 503, cors);

    let body;
    try { body = await req.json(); } catch (e) { return json({ code: "bad_request" }, 400, cors); }
    const kind = body.kind === "reading" ? "reading" : "chat";
    const msgs = typeof body.input === "string" ? [{ role: "user", content: body.input }] : Array.isArray(body.input) ? body.input : null;
    if (!msgs || !msgs.length || msgs.some(m => !m || typeof m.content !== "string") || JSON.stringify(msgs).length > MAX_INPUT) return json({ code: "bad_request" }, 400, cors);

    /* the day turns over at midnight in Thailand */
    const day = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
    const ip = req.headers.get("CF-Connecting-IP") || "unknown";
    const limit = Number(kind === "reading" ? env.READING_LIMIT || 5 : env.CHAT_LIMIT || 20);
    const cap = Number(env.DAILY_CAP || 1000);
    const mine = await counter(env, "ip:" + ip, "take", kind, day, limit);
    if (!mine.ok) return json({ code: "quota", kind, limit, message: kind === "reading"
      ? `วันนี้ใช้คำทำนายที่ Gemini เขียนสดครบ ${limit} ครั้งแล้ว พรุ่งนี้มาใหม่ได้ ระหว่างนี้หมอจะอ่านจากตำราของหอดาราให้`
      : `วันนี้คุยกับหมอครบ ${limit} ครั้งแล้ว พรุ่งนี้มาคุยกันต่อนะ` }, 429, cors);
    const site = await counter(env, "site", "take", "all", day, cap);
    if (!site.ok) {
      await counter(env, "ip:" + ip, "give", kind, day, limit);
      return json({ code: "quota", kind, limit, message: "โควตาฟรีของหอดาราวันนี้หมดแล้ว พรุ่งนี้มาใหม่ได้ ระหว่างนี้หมอจะอ่านจากตำราของหอดาราให้" }, 429, cors);
    }
    const refund = () => Promise.all([counter(env, "ip:" + ip, "give", kind, day, limit), counter(env, "site", "give", "all", day, cap)]);

    /* GEMINI_MODEL is a comma-separated list: a model that is overloaded, retired or out of quota hands over to the next */
    const models = (env.GEMINI_MODEL || "gemini-flash-latest").split(",").map(s => s.trim()).filter(Boolean);
    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: toContents(msgs),
      generationConfig: { temperature: 0.9, maxOutputTokens: 8192 }
    });
    let upstream;
    for (const model of models) {
      try {
        upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
          body: payload
        });
      } catch (e) { upstream = null; }
      if (upstream && (upstream.ok || ![404, 429, 500, 503].includes(upstream.status))) break;
    }
    if (!upstream || !upstream.ok) {
      await refund();
      const busy = upstream && upstream.status === 429;
      const detail = upstream ? (await upstream.text()).slice(0, 300) : "network";
      return json({ code: busy ? "rate_limited" : "unavailable", message: busy ? "ตอนนี้มีคนรอหมอเยอะ รอสักครู่แล้วลองใหม่" : "หมอตอบไม่ได้ในตอนนี้", detail }, busy ? 429 : 502, cors);
    }

    /* Gemini streams server-sent events; pass on only the answer text, skipping any thinking parts */
    const { readable, writable } = new TransformStream();
    (async () => {
      const w = writable.getWriter(), enc = new TextEncoder(), rd = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
      let buf = "";
      try {
        for (;;) {
          const { value, done } = await rd.read();
          if (done) break;
          buf += value;
          let i;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
            if (!line.startsWith("data:")) continue;
            try {
              const parts = JSON.parse(line.slice(5)).candidates?.[0]?.content?.parts || [];
              const t = parts.filter(p => !p.thought).map(p => p.text || "").join("");
              if (t) await w.write(enc.encode(t));
            } catch (e) { /* a partial or non-JSON line: skip it */ }
          }
        }
      } finally { await w.close().catch(() => {}); }
    })();
    return new Response(readable, { headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Quota-Left": String(limit - mine.n) } });
  }
};
