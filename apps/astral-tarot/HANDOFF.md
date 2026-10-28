# HANDOFF · หอดาราทาโรต์ (Astral Tarot) — 2026-10-28

เอกสารส่งต่องานจาก cloud session ไปทำต่อใน Claude Code บนเครื่อง อ่านไฟล์นี้กับ `README.md` (ตาราง "ห้ามถามซ้ำ" รอบ 1–11) ก่อนเริ่มงาน

## ดึงงานลงเครื่อง
```bash
git clone https://github.com/Logogoimumazya/minaria.git   # หรือ git fetch ถ้ามี repo อยู่แล้ว
cd minaria
git checkout claude/exciting-babbage-llebqn
```
- งานทั้งหมดอยู่ใน branch `claude/exciting-babbage-llebqn` ยังไม่ได้ merge เข้า branch หลัก `claude/cloud-session-setup-btn8do`
- PR: https://github.com/Logogoimumazya/minaria/pull/1 (draft, CI ผ่าน)
- repo นี้เป็นโฟลเดอร์ instance ของ Minecraft modpack ด้วย ส่วนหอดาราอยู่แยกใน `apps/astral-tarot/` ทั้งหมด ไม่แตะไฟล์ modpack

## ตอนนี้อยู่ตรงไหน
| ที่ | สถานะ |
|---|---|
| เว็บสาธารณะ | https://logogoimumazya.github.io/minaria/ ใช้งานได้ deploy อัตโนมัติเมื่อ push ไฟล์ใน `apps/astral-tarot/` |
| claude.ai Artifact | https://claude.ai/artifact/F2zo231PiNQsMbN2ZWBn7u (เวอร์ชัน 11, capability `sample` + `downloads`) ใช้ Claude เขียนคำทำนายสด อัปเดตได้จาก session ที่มี Artifact tool เท่านั้น |
| Gemini บนเว็บสาธารณะ | โค้ดเสร็จและทดสอบกับ Gemini จำลองแล้ว **ยังไม่ได้ใช้งานจริง**: รอเจ้าของ repo ทำ 5 ขั้นใน `worker/README.md` (Gemini key, Cloudflare token/account id เป็น GitHub secrets, ตั้ง variable `ORACLE_URL`) |

## โครงไฟล์
- `index.html` — ทั้งแอปอยู่ไฟล์เดียว (~4,700 บรรทัด) เขียนแบบ Artifact: ไม่มี `<!doctype>`/`<head>` เพราะ host ใส่ให้ อย่าเพิ่มเอง
- `build_site.py` — ห่อ `index.html` เป็นเว็บเต็ม (head, meta, icon) และฉีด `window.ASTRAL_ORACLE_URL` จาก env `ORACLE_URL`
- `worker/` — Cloudflare Worker ตัวกลางเรียก Gemini (`worker.js`, `wrangler.toml`, `README.md` ขั้นตั้งค่า)
- `.github/workflows/astral-tarot-pages.yml` — build + deploy GitHub Pages
- `.github/workflows/astral-tarot-oracle.yml` — deploy Worker (ข้ามเองถ้ายังไม่มี secrets)
- `tests/` — Playwright + ทดสอบ Worker (ดูด้านล่าง)
- `README.md` — การตัดสินใจทุกรอบ + คำอธิบายระบบ

### แผนที่ใน `index.html` (ค้นด้วยหัวข้อ `/* ===`)
- DATA: ไพ่ 78 ใบ (`MAJOR`, `MINOR`, `DECK`), `SPREADS`, เลขศาสตร์, `THAI_DAYS`
- UTIL: `store()` (localStorage), `REDUCED`/`QUALITY` (motion + คุณภาพภาพ, ผู้ใช้เลือกทับค่าระบบได้)
- SOUND / Music (WebAudio), Sky / FX / Neb (WebGL เนบิวลา), Grade / Cam / Director (สี + กล้อง)
- STAGES: ask → shuffle → pick → reveal → reading (`goStage`)
- QUESTION ENGINE: `analyzeQ`, `resolveSpread`, `answerFor`
- DEEP READING: ธาตุ (`dignity`), `COMBOS`, `findTrend`, `findJourney`, ไพ่เงา
- psyche / ช่วงชีวิต: `ARCHETYPE`, `psyche()`, `ROLES`, `LIFE_STAGES`, `lifeContext`
- THE ORACLE: `getSample()` (Claude ใน claude.ai → Gemini ผ่าน Worker → null), `ORACLE_RULES`, `buildOraclePrompt`, `houseChronicle` (ตำราสำรอง), `Chron`, `Chat`
- THE OBSERVATORY (รอบ 9): หอดารา/ดวงจันทร์/ไพ่ประจำวัน, สมุดดวง, คลังไพ่ + ควิซ, ดวงคู่, Music, การ์ด PNG
- ART DIRECTION (รอบ 10): astrolabe, กลุ่มดาว, ไพ่ลอย, กรอบทอง, ฉากเปิด, เมนูภาพ, `?debug`
- WIRING: ผูก event ทั้งหมด เริ่มที่ `goRoom("hub")`

## กติกาที่ตกลงกับผู้ใช้แล้ว (ย่อ — ฉบับเต็มใน README)
- ชื่อไพ่ใช้ภาษาอังกฤษเสมอ ไม่แปล
- คำทำนายเป็นภาษาไทย น้ำเสียงนักปรึกษา เหตุผลจากข้างในใจ **ห้ามอ้างทฤษฎี/ชื่อนักจิตวิทยา/ศัพท์เฉพาะ**
- ไพ่คือกระจก + แนวโน้ม ไม่ใช่คำพิพากษา
- ปรับโทนตามช่วงชีวิต/บทบาท ไม่พูดตัวเลขอายุ ต่ำกว่า 18 ปีอ่อนโยนและปลอดภัยขึ้น
- ทำงานแบบ game producer: สัมภาษณ์ผู้ใช้ 3–4 ข้อพร้อมเสนอไอเดียก่อนลงมือทุกครั้ง แล้วบันทึกคำตอบลงตารางใน README

## ทดสอบ
ต้องมี Node 18+ และ Playwright (`npm i -D playwright && npx playwright install chromium`)
```bash
cd apps/astral-tarot/tests
python3 make_test_html.py         # สร้าง tests/test.html จาก index.html (ทำทุกครั้งหลังแก้)
node visuals.test.js              # ฉากเปิด, หอดาราจอกว้าง, โหมดลดการเคลื่อนไหว, มือถือ
node rooms.test.js                # ไพ่ประจำวัน, คลังไพ่/ควิซ, ดวงคู่, สมุดดวง, ชาร์จพลังสับไพ่
node ritual.test.js               # พิธีเปิดไพ่เต็มรอบ 3 โหมด (Claude จำลอง / ไม่มี AI / ไม่อนุญาต) + การ์ด PNG
```
ทดสอบ Worker + Gemini จำลอง:
```bash
node worker-local.mjs &           # Worker บน :8790 พร้อม Gemini ปลอม
node worker.test.mjs              # origin, input, quota 5 ครั้ง
ORACLE_URL=http://localhost:8790 python3 ../build_site.py site && python3 -m http.server 8765 --directory site &
node gemini.e2e.js                # เว็บที่ build จริงเรียก Worker ครบวง
```
ภาพหน้าจอจากการทดสอบอยู่ใน `tests/out/` ทุกสคริปต์ต้องจบด้วย `errors []`

## งานค้าง / ไอเดียถัดไป
1. **ใช้ Gemini จริง**: ทำ 5 ขั้นใน `worker/README.md` แล้วลองดูดวงบนเว็บจริง ตรวจว่า `gemini-flash-latest` ใช้ได้กับบัญชีฟรี ถ้า Google ตอบ 404 ให้เปลี่ยน `GEMINI_MODEL` ใน `wrangler.toml`
2. ตรวจคุณภาพคำทำนายที่ Gemini เขียนเทียบกับกติกา (ชื่อไพ่อังกฤษ, ไม่มีชื่อทฤษฎี, แท็ก `[[ANSWER|n]]` ฯลฯ ครบ) ถ้าหลุดบ่อยให้ปรับ `ORACLE_RULES`
3. merge PR #1 เข้า branch หลัก (ต้องเปิดกฎ environment `github-pages` ถ้าจะ deploy จาก branch อื่น)
4. บนการ์ด PNG คำตอบใช้คำตอบที่ระบบคำนวณ ยังไม่ใช้บรรทัดแรกที่ AI เขียน
5. ห้องดวงคู่: ใส่วันเกิดในฟอร์มดวงคู่ครั้งแรกแล้ว ส่วน "ไพ่ประจำชีวิตของคุณ" ด้านบนยังไม่รีเฟรชจนกว่าจะออกแล้วเข้าห้องใหม่
6. หลังแก้ `index.html` ถ้าต้องการอัปเดต Artifact ใน claude.ai ต้องทำจาก session ที่มี Artifact tool (Claude Code บนเครื่องอาจไม่มี) เว็บ GitHub Pages อัปเดตเองเมื่อ push
