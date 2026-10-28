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
| เว็บสาธารณะ | **https://astral-tarot.pages.dev** (Cloudflare Pages, ย้ายมา 2026-10-28) · ลิงก์เก่า https://logogoimumazya.github.io/minaria/ ส่งต่อมาที่ใหม่อัตโนมัติ (variable `SITE_URL` ทำให้ workflow GitHub Pages build หน้า redirect แทน) · **push แล้วเว็บใหม่ไม่อัปเดตเอง** ต้อง deploy จากเครื่อง: `ORACLE_URL=https://astral-tarot-oracle.thanakthanakritmax2559.workers.dev python build_site.py <โฟลเดอร์นอก repo>/site` แล้วในโฟลเดอร์นั้น `npx wrangler@4 pages deploy site --project-name astral-tarot --branch main` (รันในโฟลเดอร์ที่ไม่มี `wrangler.toml` และห้ามใส่ `--force` อีก) |
| claude.ai Artifact | https://claude.ai/artifact/F2zo231PiNQsMbN2ZWBn7u (เวอร์ชัน 11, capability `sample` + `downloads`) ใช้ Claude เขียนคำทำนายสด อัปเดตได้จาก session ที่มี Artifact tool เท่านั้น |
| Gemini บนเว็บสาธารณะ | **ใช้งานจริงแล้ว** (2026-10-28) Worker: https://astral-tarot-oracle.thanakthanakritmax2559.workers.dev (บัญชี Cloudflare ของผู้ใช้ deploy จากเครื่องด้วย `npx wrangler deploy` หลัง `wrangler login`) · key อยู่ใน Worker secret + GitHub secret `GEMINI_API_KEY` · variable `ORACLE_URL` ตั้งแล้ว · ยังไม่มี `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` ใน GitHub ดังนั้น workflow Worker ยังข้ามเอง แก้ `worker/` แล้วต้อง deploy จากเครื่อง |

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
- BIRTH-DATE WHEEL (รอบ 12): `input[data-dob]` ซ่อนค่า ISO ไว้ + ปุ่มเปิดวงล้อ (`mountDob`, `Wheel`, `openDob`) ตั้ง `.value` จากโค้ดได้ตามปกติ
- WIRING: ผูก event ทั้งหมด เริ่มที่ `goRoom("ask")`

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
node bond.test.js                 # ห้องดวงคู่: แผงไพ่ประจำชีวิตรีเฟรช + ผู้ถามต่ำกว่า 18 ปีไม่มีตัวเลือกคู่รัก
node maker.test.js                # ป้ายผู้สร้าง IG + คิวอาร์พร้อมเพย์ รูปที่บันทึกต้องสแกนได้ payload เดิม (ต้องมี jsqr + pngjs)
node perf-rooms.bench.js "" run 4  # วัด fps/เวลา main thread ต่อห้อง (4 = CPU ช้าลง 4 เท่า ~ มือถือกลางๆ) ต้องใช้ GPU จริง
node perf-ritual.bench.js "" 4 390 844 3   # วัด fps ทุกขั้นพิธี บนจอมือถือ
node dob.test.js                  # วงล้อวันเกิด: เมาส์ คลิก คีย์บอร์ด พ.ศ./ค.ศ. ก.พ. 28 วัน มือถือ
```
ทดสอบ Worker + Gemini จำลอง:
```bash
node worker-local.mjs &           # Worker บน :8790 พร้อม Gemini ปลอม
node worker.test.mjs              # origin, input, quota 5 ครั้ง
ORACLE_URL=http://localhost:8790 python3 ../build_site.py site && python3 -m http.server 8765 --directory site &
node gemini.e2e.js                # เว็บที่ build จริงเรียก Worker ครบวง
```
ภาพหน้าจอจากการทดสอบอยู่ใน `tests/out/` ทุกสคริปต์ต้องจบด้วย `errors []`

## กติกาความลื่น (2026-10-28 · วัดก่อนแก้ทุกครั้ง)
ผลรอบนี้ (CPU ปกติ ก่อน → หลัง): ห้องคลังไพ่ 20 → 59 fps · กางพัด 78 ใบ 23 → 58 · เลือกไพ่ 18 → 56 · เลื่อนคำทำนาย 32 → 50 · มือถือ CPU ช้า 4 เท่า: คลังไพ่ 21 → 53 · ภาพเหมือนเดิมทุกพิกเซล (ตรวจด้วยการเทียบพิกเซลแล้ว ต่างไม่เกิน 2/255)
- **ห้ามเขียน CSS variable บน `:root`/`body` ทุกเฟรม** ทำให้ทั้งหน้าคำนวณ style ใหม่ (สาเหตุหลักที่เคยกระตุก ~300 ms ต่อวินาที) parallax ใช้ `PARALLAX` + `applyParallax()` ใส่ `translate` ตรงที่ชั้นนั้นๆ ถ้าเพิ่มชั้น parallax ใหม่ให้เพิ่มในตาราง `PARALLAX`
- canvas: ห้ามสร้างสตริง `rgba(...)` ต่อจุดต่อเฟรม ตั้งสีครั้งเดียวแล้วเปลี่ยน `globalAlpha` · ตั้ง `ctx.font` ใน resize ไม่ใช่ทุกเฟรม
- งานที่อัปเดตถี่ (การพิมพ์คำทำนาย `Chron`) ให้แก้เฉพาะส่วนที่เปลี่ยน ไม่ `innerHTML` ทั้งก้อน
- animation ใช้ `transform`/`opacity` ให้ compositor ทำเอง หลีกเลี่ยง `background-position`, custom property (`--ang`), `box-shadow` ที่วนไม่หยุด
- **Android (รอบวิดีโอผู้ใช้ 2026-10-28)**: เลื่อนจอแล้วเห็นพื้นที่ว่าง/ดำ (checkerboard) เพราะ raster ไม่ทัน iOS ไม่ค่อยเป็น · ตัวการหลัก: วงแหวนวงเวทหมุนด้วย `<g>` ใน SVG ทำให้วาดใหม่ทั้งวงทุกเฟรม (raster 207 → 4 ms/วินาที หลังแยกเป็น `<svg>` ซ้อนกัน 3 ชั้นใน `div.circle` ให้ compositor หมุน) · ห้ามหมุน/ขยับ `<g>` ใน SVG แบบวนไม่หยุด ให้ทำบน `<svg>` ทั้งตัวแทน
- เปลี่ยนห้อง: ถ้ามี dip ดำ ให้ `scrollTo` แบบทันที ไม่ smooth (smooth เลื่อนผ่านหน้ายาวทั้งหน้าบนมือถือทำให้จอดำ >1 วินาที)
- ยังไม่ได้วัดบนเครื่อง Android จริง: GPU ของเครื่องทดสอบ (GTX 1650) แรงเกินจะเห็นปัญหา fill-rate · หน้าหนึ่งมีชั้นเต็มจอ ~12 ชั้น (เนบิวลา ดาว กลุ่มดาว fx tint vignette keylight aurora rays astrolabe) ถ้ายังกระตุกบน Android ให้ผู้ใช้เปิด `?debug` แล้วส่ง FPS/GPU มาก่อนตัดสินใจลด
- ที่ยังหนักบนมือถือช้า: เลื่อนหน้าคำทำนายยาว (~28 fps ที่ CPU ช้า 4 เท่า) เป็นต้นทุนการวาดเนื้อหาเอง ลดต่อได้ต้องแลกกับภาพ (ผู้ใช้สั่งไม่ให้ลดคุณภาพ) · ลองแล้วไม่ช่วย: `content-visibility`, ปิด backdrop-filter, ปิดแสงวิ่งรอบแผง, ปิดวงแหวน SVG

## งานค้าง / ไอเดียถัดไป
1. ~~ใช้ Gemini จริง~~ **เสร็จ 2026-10-28**: `gemini-2.5-flash` ปิดรับผู้ใช้ใหม่ (404) · `gemini-flash-latest` (3.8) คนใช้เยอะ ตอบ 503 หลังรอ 20–40 วิ · `gemini-3.5-flash` ตอบภาษาไทยดีใน ~6 วิ → Worker ลองรายชื่อรุ่นตามลำดับ (`GEMINI_MODEL` คั่นจุลภาค ต่อรุ่นถัดไปเมื่อ 404/429/500/503) · ทดสอบเต็มรอบบนเว็บจริงผ่าน: ป้าย "Gemini เขียนคำทำนายนี้สด" 6 บท ถามต่อได้ `errors []`
   - บนเครื่องผู้ใช้: Python 3.12 อยู่ที่ `%LOCALAPPDATA%\Programs\Python\Python312\python.exe` (ไม่อยู่ใน PATH ของ bash) · Playwright ติดตั้งนอก repo ใช้ผ่าน `NODE_PATH` · ติดตั้ง plugin `cloudflare@cloudflare` ของ Claude Code แล้ว
2. ตรวจคุณภาพคำทำนายที่ Gemini เขียน: **ตัวอย่างแรก (ใช่หรือไม่ 3 ใบ) ผ่าน** แท็กครบ 7 ชนิด ชื่อไพ่อังกฤษทั้งหมด ไม่มีชื่อทฤษฎี น้ำเสียงนักปรึกษา แยกในมือ/นอกมือ · พบคำผิด 1 จุด ("ไพร่") · ยังต้องเก็บตัวอย่างเพิ่มหลายแบบการวาง (เซลติก 10 ใบ, 12 เดือน, ผู้ถามต่ำกว่า 18 ปี) ก่อนตัดสินว่าต้องปรับ `ORACLE_RULES` ไหม
3. merge PR #1 เข้า branch หลัก (ต้องเปิดกฎ environment `github-pages` ถ้าจะ deploy จาก branch อื่น)
4. ~~การ์ด PNG ใช้คำตอบของ AI~~ **เสร็จ 2026-10-28**: บรรทัดแรกของ AI เป็นการรับรู้ความรู้สึก ไม่ใช่คำตอบ จึงให้ `ORACLE_RULES` สั่งทำตัวหนา **...** ครั้งเดียวที่วลีคำตอบตรงๆ (≤15 คำ) แล้ว `answerLineOf()` หยิบวลีนั้นขึ้นการ์ด ถ้าไม่มีตัวหนาใช้คำตอบที่ระบบคำนวณ (ตำราหอดาราทำตัวหนาที่คำตอบอยู่แล้ว)
5. ~~ไพ่ประจำชีวิตในห้องดวงคู่ไม่รีเฟรช~~ **เสร็จ 2026-10-28**: แผงบนแยกเป็น `bondMine()` วาดใหม่ทันทีเมื่อวันเกิดแรกมาจากฟอร์มดวงคู่ · ถ้าวันเกิดนั้นต่ำกว่า 18 ปี ปุ่ม "คู่รัก" หายและสลับเป็นเพื่อนทันที (ก่อนหน้านี้หลุดกติกา) · ทดสอบใน `tests/bond.test.js`
6. หลังแก้ `index.html` ถ้าต้องการอัปเดต Artifact ใน claude.ai ต้องทำจาก session ที่มี Artifact tool (Claude Code บนเครื่องอาจไม่มี) เว็บ GitHub Pages อัปเดตเองเมื่อ push
7. **ป้ายผู้สร้าง (2026-10-28)**: footer `#maker` มีลิงก์ IG และคิวอาร์พร้อมเพย์วาดเป็น SVG จาก payload ที่ถอดจากรูปของเจ้าของ (`00020101021229370016A000000677010111011300668015628185…6304 1974` เบอร์มือถือ ไม่ระบุยอด) · **ยังค้าง: รูปโปรไฟล์ IG** Instagram ไม่ให้ดึงรูปโดยไม่ login ตอนนี้ใช้ดาว ✦ แทน รอผู้ใช้ส่งไฟล์รูป แล้วใส่เป็น `<img>` ใน `.ig-ring` (ย่อเหลือ ~160px เป็น data URI)
