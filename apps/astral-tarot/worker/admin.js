/* Admin monitor for the Astral Tarot usage log: /admin (page) and /admin/api/* (JSON).
   Closed unless the secret ADMIN_PASSWORD is set; every request needs HTTP Basic auth with that password
   (any user name). Everything people typed is rendered with textContent on the page, never as HTML. */

const enc = new TextEncoder();
async function sameSecret(a, b) {
  const [x, y] = await Promise.all([a, b].map(v => crypto.subtle.digest("SHA-256", enc.encode(v))));
  const p = new Uint8Array(x), q = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < p.length; i++) d |= p[i] ^ q[i];
  return d === 0;
}
async function authorized(req, env) {
  const h = req.headers.get("Authorization") || "";
  if (!h.startsWith("Basic ")) return false;
  let pass = "";
  try { pass = atob(h.slice(6)).split(":").slice(1).join(":"); } catch (e) { return false; }
  return sameSecret(pass, env.ADMIN_PASSWORD);
}
const SEC = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "X-Frame-Options": "DENY", "Referrer-Policy": "no-referrer" };
const out = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...SEC, "Content-Type": "application/json; charset=utf-8" } });
const PERSON = "COALESCE(uid, 'v:' || visitor)";

export async function adminRoute(req, env) {
  if (!env.ADMIN_PASSWORD || !env.DB) return new Response("not found", { status: 404 });
  if (!(await authorized(req, env))) return new Response("ต้องใส่รหัสผ่านผู้ดูแล", { status: 401, headers: { ...SEC, "WWW-Authenticate": 'Basic realm="Astral Tarot admin", charset="UTF-8"' } });
  const url = new URL(req.url), p = url.pathname, a = url.searchParams;
  const all = (sql, ...v) => env.DB.prepare(sql).bind(...v).all().then(r => r.results);
  if (p === "/admin" || p === "/admin/") return new Response(PAGE, { headers: { ...SEC, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src data:" } });

  if (p === "/admin/api/summary") {
    const today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
    const [t] = await all(`SELECT COUNT(*) n, SUM(type='reading') readings, SUM(type='chat') chats, COUNT(DISTINCT ${PERSON}) people,
      ROUND(AVG(CASE WHEN status='ok' THEN ms END)/1000.0,1) wait, SUM(status<>'ok') errors FROM events WHERE day=?`, today);
    const [total] = await all(`SELECT COUNT(*) n, COUNT(DISTINCT ${PERSON}) people FROM events`);
    const days = await all(`SELECT day, COUNT(*) n, SUM(type='reading') readings, COUNT(DISTINCT ${PERSON}) people FROM events GROUP BY day ORDER BY day DESC LIMIT 14`);
    const by = col => all(`SELECT ${col} k, COUNT(*) n FROM events WHERE day >= date(?, '-6 days') AND ${col} IS NOT NULL GROUP BY ${col} ORDER BY n DESC LIMIT 12`, today);
    const [topics, spreads, lenses, status, models] = await Promise.all(["topic", "spread", "lens", "status", "model"].map(by));
    return out({ today, t, total, days, topics, spreads, lenses, status, models });
  }
  if (p === "/admin/api/people") {
    const q = `%${(a.get("q") || "").slice(0, 60)}%`;
    /* the name shown is the one typed most recently on that device */
    return out(await all(`SELECT ${PERSON} pid, (SELECT e2.name FROM events e2 WHERE COALESCE(e2.uid, 'v:' || e2.visitor) = COALESCE(ev.uid, 'v:' || ev.visitor) AND e2.name IS NOT NULL ORDER BY e2.id DESC LIMIT 1) name, COUNT(*) n, SUM(type='reading') readings, SUM(type='chat') chats,
      MIN(ts) first, MAX(ts) last, GROUP_CONCAT(DISTINCT topic) topics, MAX(minor) minor
      FROM events ev GROUP BY pid HAVING COALESCE(MAX(name),'') LIKE ?1 OR pid LIKE ?1 OR SUM(question LIKE ?1) > 0
      ORDER BY last DESC LIMIT 200`, q));
  }
  if (p === "/admin/api/events") {
    const pid = a.get("pid"), q = a.get("q"), before = Number(a.get("before")) || 1e15, after = Number(a.get("after")) || 0;
    const where = ["id < ?", "id > ?"], v = [before, after];
    if (pid) { where.push(`${PERSON} = ?`); v.push(pid); }
    if (q) { where.push("(question LIKE ? OR answer LIKE ? OR name LIKE ?)"); v.push(`%${q}%`, `%${q}%`, `%${q}%`); }
    return out(await all(`SELECT id, ts, ${PERSON} pid, name, type, rid, question, topic, qtype, subject, spread, cards, shadow, life_stage, minor, lens,
      overall, rel, model, status, ms, answer FROM events WHERE ${where.join(" AND ")} ORDER BY id DESC LIMIT 60`, ...v));
  }
  return out({ code: "not_found" }, 404);
}

const PAGE = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>หอดารา · ผู้ดูแล</title>
<style>
:root{--bg:#0b0d1f;--panel:#141833;--line:#2a2f57;--ink:#ece6d4;--mist:#9d98bf;--gold:#e8c46a;--good:#8fe3b0;--bad:#f08a9b;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.6 "Noto Sans Thai","Segoe UI",system-ui,sans-serif}
header{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:2}
h1{font-size:17px;margin:0;color:var(--gold)}.live{font-size:12px;color:var(--mist)}.live i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--good);margin-right:6px;animation:p 2s infinite}
@keyframes p{50%{opacity:.3}}input{font:inherit;color:var(--ink);background:#0e1129;border:1px solid var(--line);border-radius:8px;padding:6px 10px;min-width:0}
header input{margin-left:auto;width:min(320px,100%)}main{padding:16px;display:grid;gap:16px;max-width:1400px;margin:0 auto}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}.tile{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px 12px}
.tile b{display:block;font-size:24px;color:var(--gold);font-variant-numeric:tabular-nums}.tile span{color:var(--mist);font-size:12px}
.cols{display:grid;grid-template-columns:minmax(260px,340px) minmax(0,1fr);gap:16px;align-items:start}@media(max-width:820px){.cols{grid-template-columns:1fr}}
.box{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}.box h2{font-size:14px;margin:0 0 8px;color:var(--gold)}
.people{max-height:70vh;overflow:auto;display:grid;gap:4px}.person{all:unset;cursor:pointer;display:block;padding:8px 10px;border-radius:8px;border:1px solid transparent}
.person:hover,.person.on{border-color:var(--line);background:#1b2044}.person b{display:block}.person small{color:var(--mist)}
.feed{display:grid;gap:10px}.ev{border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:#10142d}
.ev .meta{display:flex;flex-wrap:wrap;gap:6px 10px;color:var(--mist);font-size:12px}.ev .meta .who{color:var(--ink);font-weight:600;cursor:pointer}
.tag{border:1px solid var(--line);border-radius:99px;padding:0 8px}.tag.reading{color:var(--gold)}.tag.bad{color:var(--bad)}
.q{font-size:15px;margin:6px 0 2px}.cards{color:var(--mist);font-size:12.5px}details{margin-top:6px}summary{cursor:pointer;color:var(--gold);font-size:13px}
.ans{white-space:pre-wrap;margin:8px 0 0;padding:10px;border-radius:8px;background:#0b0e24;max-height:420px;overflow:auto}
.bars{display:grid;gap:4px;font-size:12.5px}.bar{display:grid;grid-template-columns:110px 1fr 36px;gap:8px;align-items:center}.bar i{height:8px;border-radius:99px;background:var(--gold);display:block}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}button.more{font:inherit;color:var(--gold);background:none;border:1px solid var(--line);border-radius:8px;padding:6px 12px;cursor:pointer}
.empty{color:var(--mist)}
</style></head><body>
<header><h1>หอดาราทาโรต์ · ผู้ดูแล</h1><span class="live"><i></i><span id="upd">กำลังโหลด…</span></span><input id="search" type="search" placeholder="ค้นชื่อ คำถาม หรือคำตอบ"></header>
<main>
  <section class="tiles" id="tiles"></section>
  <section class="cols">
    <div class="box"><h2>ผู้ใช้ <small id="pc" class="empty"></small></h2><div class="people" id="people"></div></div>
    <div class="box"><h2 id="feed-h">ล่าสุด</h2><div class="feed" id="feed"></div><p><button class="more" id="more" hidden>โหลดเพิ่ม</button></p></div>
  </section>
  <section class="grid3" id="charts"></section>
</main>
<script>
const $ = s => document.querySelector(s);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const TYPE = { reading: "เปิดไพ่", chat: "ถามต่อ", journal: "สมุดดวง", bond: "ดวงคู่" };
const TOPIC = { general: "ทั่วไป", love: "ความรัก", career: "การงาน", study: "การเรียน", money: "การเงิน", health: "สุขภาพ", family: "ครอบครัว" };
const STATUS = { ok: "สำเร็จ", empty: "คำตอบว่าง", rate_limited: "คิวแน่น", unavailable: "AI ตอบไม่ได้", quota_site: "โควตาทั้งเว็บหมด", quota_visitor: "โควตารายคนหมด" };
const th = ts => new Date(ts).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const api = (p, q = {}) => fetch("/admin/api/" + p + "?" + new URLSearchParams(q)).then(r => { if (!r.ok) throw r.status; return r.json(); });
const S = { pid: null, q: "", top: 0, oldest: 0 };

function tile(v, label) { const t = el("div", "tile"); t.append(el("b", "", v ?? 0), el("span", "", label)); return t; }
function bars(title, rows, map = {}) {
  const b = el("div", "box"); b.append(el("h2", "", title));
  const w = el("div", "bars"), max = Math.max(1, ...rows.map(r => r.n));
  if (!rows.length) w.append(el("span", "empty", "ยังไม่มีข้อมูล"));
  for (const r of rows) { const row = el("div", "bar"), i = el("i"); i.style.width = (r.n / max * 100) + "%"; const bx = el("span"); bx.append(i); row.append(el("span", "", map[r.k] || r.k), bx, el("span", "", r.n)); w.append(row); }
  b.append(w); return b;
}
async function summary() {
  const s = await api("summary");
  $("#tiles").replaceChildren(tile(s.t.readings, "เปิดไพ่วันนี้"), tile(s.t.chats, "ถามต่อวันนี้"), tile(s.t.people, "ผู้ใช้วันนี้"),
    tile(s.t.wait != null ? s.t.wait + " วิ" : "–", "รอคำตอบเฉลี่ยวันนี้"), tile(s.t.errors, "ตอบไม่สำเร็จวันนี้"), tile(s.total.people, "ผู้ใช้ทั้งหมด"), tile(s.total.n, "คำขอทั้งหมด"));
  $("#charts").replaceChildren(bars("14 วันล่าสุด (คำขอ)", s.days.map(d => ({ k: d.day, n: d.n }))), bars("หัวข้อ 7 วัน", s.topics, TOPIC),
    bars("แบบการวาง 7 วัน", s.spreads), bars("เลนส์ปรัชญา 7 วัน", s.lenses), bars("ผลลัพธ์ 7 วัน", s.status, STATUS), bars("รุ่น Gemini 7 วัน", s.models));
}
async function people() {
  const list = await api("people", { q: S.q });
  $("#pc").textContent = list.length + " คน";
  const box = $("#people"); box.replaceChildren();
  const all = el("button", "person" + (S.pid ? "" : " on")); all.append(el("b", "", "ทุกคน · ล่าสุด")); all.onclick = () => pick(null); box.append(all);
  for (const p of list) {
    const b = el("button", "person" + (S.pid === p.pid ? " on" : ""));
    b.append(el("b", "", (p.name || "ไม่ได้กรอกชื่อ") + (p.minor ? " · ต่ำกว่า 18" : "")),
      el("small", "", \`เปิดไพ่ \${p.readings} · ถามต่อ \${p.chats} · ล่าสุด \${th(p.last)}\`), el("br"),
      el("small", "", (p.topics || "").split(",").filter(Boolean).map(t => TOPIC[t] || t).join(" ") + " · " + p.pid.slice(0, 10)));
    b.onclick = () => pick(p.pid, p.name); box.append(b);
  }
}
function card(e) {
  const d = el("article", "ev"), m = el("div", "meta");
  const who = el("span", "who", e.name || "ไม่ได้กรอกชื่อ"); who.onclick = () => pick(e.pid, e.name);
  m.append(who, el("span", "tag " + e.type, TYPE[e.type] || e.type), el("span", "", th(e.ts)));
  if (e.topic) m.append(el("span", "", TOPIC[e.topic] || e.topic));
  if (e.spread) m.append(el("span", "", e.spread));
  if (e.lens && e.lens !== "none") m.append(el("span", "", "เลนส์ " + e.lens));
  if (e.life_stage) m.append(el("span", "", e.life_stage));
  if (e.minor) m.append(el("span", "tag bad", "ต่ำกว่า 18"));
  m.append(el("span", e.status === "ok" ? "" : "tag bad", (STATUS[e.status] || e.status) + (e.ms ? \` · \${(e.ms / 1000).toFixed(1)} วิ\` : "") + (e.model ? " · " + e.model : "")));
  d.append(m);
  if (e.question) d.append(el("div", "q", e.question)); else if (e.type === "reading") d.append(el("div", "q empty", "(ไม่ได้ตั้งคำถาม อ่านภาพรวม)"));
  if (e.cards) d.append(el("div", "cards", e.cards + (e.shadow ? " · ไพ่เงา " + e.shadow : "")));
  if (e.answer) { const det = el("details"); det.append(el("summary", "", "ดูคำตอบของหมอ"), el("div", "ans", e.answer)); d.append(det); }
  return d;
}
async function feed(reset) {
  const q = { q: S.q }; if (S.pid) q.pid = S.pid;
  if (reset) { const rows = await api("events", q); $("#feed").replaceChildren(...(rows.length ? rows.map(card) : [el("p", "empty", "ยังไม่มีข้อมูล")])); S.top = rows[0]?.id || 0; S.oldest = rows.at(-1)?.id || 0; $("#more").hidden = rows.length < 60; return; }
  const rows = await api("events", { ...q, after: S.top });
  if (rows.length) { $("#feed").querySelector(".empty")?.remove(); $("#feed").prepend(...rows.map(card)); S.top = rows[0].id; }
}
$("#more").onclick = async () => { const q = { q: S.q, before: S.oldest }; if (S.pid) q.pid = S.pid; const rows = await api("events", q); $("#feed").append(...rows.map(card)); if (rows.length) S.oldest = rows.at(-1).id; $("#more").hidden = rows.length < 60; };
function pick(pid, name) { S.pid = pid; $("#feed-h").textContent = pid ? "ประวัติของ " + (name || "ผู้ใช้ไม่ระบุชื่อ") : "ล่าสุด"; people(); feed(true); }
let t; $("#search").oninput = e => { clearTimeout(t); t = setTimeout(() => { S.q = e.target.value.trim(); people(); feed(true); }, 350); };
async function tick(first) {
  try { await Promise.all([summary(), first ? feed(true) : feed(false), people()]); $("#upd").textContent = "อัปเดตล่าสุด " + new Date().toLocaleTimeString("th-TH"); }
  catch (e) { $("#upd").textContent = "โหลดไม่สำเร็จ (" + e + ") จะลองใหม่"; }
}
tick(true); setInterval(() => { if (!document.hidden) tick(false); }, 15000);
</script></body></html>`;
