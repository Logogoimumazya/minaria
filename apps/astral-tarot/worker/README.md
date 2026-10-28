# หอดาราทาโรต์ · ตัวกลางเชื่อม Gemini (Cloudflare Worker)

เว็บสาธารณะ (GitHub Pages) เรียก Gemini ผ่าน Worker ตัวนี้ เพื่อไม่ให้ API key อยู่ในหน้าเว็บ
Worker จะรับเฉพาะคำขอจากเว็บของหอดารา จำกัดการใช้ต่อคนต่อวัน และส่งคำตอบกลับแบบไหลทีละส่วน

- คำทำนายหลัก: วันละ 5 ครั้งต่อคน (`READING_LIMIT`)
- ถามต่อ, สะท้อนบทเรียนในสมุดดวง, เล่าดวงคู่: รวมกันวันละ 20 ครั้งต่อคน (`CHAT_LIMIT`)
- ทั้งเว็บรวมกันไม่เกินวันละ 1000 ครั้ง (`DAILY_CAP`) เพื่อไม่ให้เกินโควตาฟรีของ Google
- เกินโควตาแล้ว เว็บจะใช้ตำราของหอดาราแทนให้เอง
- วันใหม่เริ่มตอนเที่ยงคืนเวลาไทย

## ตั้งค่าครั้งแรก (ทำครั้งเดียว ประมาณ 10 นาที)

1. **สร้าง Gemini API key (ฟรี)**
   เข้า https://aistudio.google.com/apikey → Create API key → คัดลอกเก็บไว้
2. **สมัคร Cloudflare (ฟรี)** ที่ https://dash.cloudflare.com/sign-up
   - Account ID: อยู่ในหน้า Workers & Pages ด้านขวา (หรือ URL หลัง `dash.cloudflare.com/`)
   - API token: My Profile → API Tokens → Create Token → เลือกเทมเพลต **Edit Cloudflare Workers** → Create → คัดลอก
   - ครั้งแรกให้เข้าหน้า Workers & Pages หนึ่งครั้ง เพื่อเลือกชื่อ subdomain `*.workers.dev`
3. **ใส่ secret ใน GitHub**: https://github.com/Logogoimumazya/minaria/settings/secrets/actions → New repository secret ทีละตัว
   - `GEMINI_API_KEY` = key จากข้อ 1
   - `CLOUDFLARE_API_TOKEN` = token จากข้อ 2
   - `CLOUDFLARE_ACCOUNT_ID` = Account ID จากข้อ 2
4. **Deploy Worker**: https://github.com/Logogoimumazya/minaria/actions → "Deploy Astral Tarot oracle (Cloudflare Worker)" → Run workflow
   เมื่อเสร็จ จะได้ URL ประมาณ `https://astral-tarot-oracle.<ชื่อของคุณ>.workers.dev` (ดูได้ใน log ขั้น wrangler หรือในหน้า Cloudflare)
5. **บอกเว็บให้ใช้ Worker**: https://github.com/Logogoimumazya/minaria/settings/variables/actions → New repository variable
   - ชื่อ `ORACLE_URL` ค่า = URL จากข้อ 4 (ไม่ต้องมี `/` ท้าย)
6. **Deploy เว็บใหม่**: Actions → "Deploy Astral Tarot to GitHub Pages" → Run workflow

เปิด https://astral-tarot.pages.dev แล้วลองดูดวง ป้ายสถานะจะขึ้นว่า "✦ Gemini เขียนคำทำนายนี้สด"

## ปรับค่า
แก้ใน `wrangler.toml` แล้ว push (workflow จะ deploy ให้เอง)
- `GEMINI_MODEL`: รายชื่อรุ่นคั่นด้วยจุลภาค ลองตามลำดับ ถ้ารุ่นแรกคนใช้เยอะ (503) ถูกปลด (404) หรือโควตาหมด (429) จะต่อรุ่นถัดไปเอง ค่าเริ่มต้น `gemini-3.5-flash,gemini-flash-latest,gemini-flash-lite-latest` (ทดสอบ 2026-10-28: 3.5 ตอบใน ~6 วินาที ส่วน `gemini-flash-latest` = 3.8 ตอบ 503 หลังรอ 20–40 วินาที · `gemini-2.5-flash` ปิดรับผู้ใช้ใหม่แล้ว)
- `READING_LIMIT`, `CHAT_LIMIT`, `DAILY_CAP`: จำนวนครั้งตามด้านบน
- `ALLOWED_ORIGINS`: เว็บที่เรียกได้ ตอนนี้คือ `https://astral-tarot.pages.dev` และลิงก์เก่าบน GitHub Pages ถ้าใช้โดเมนของตัวเองให้เพิ่มคั่นด้วยจุลภาค

## ข้อควรรู้
- บริการฟรีของ Gemini อนุญาตให้ Google นำข้อความไปใช้ปรับปรุงบริการ เว็บจึงมีข้อความเตือนผู้ใช้ไว้ใต้ปุ่มเริ่มพิธี
- โควตาฟรีจริงของ Google ขึ้นกับบัญชีและรุ่น ดูได้ที่ https://aistudio.google.com/usage
- ตัวเลขนับต่อ IP: คนที่ใช้เน็ตวงเดียวกันจะนับรวมกัน
