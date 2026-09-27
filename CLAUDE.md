# Minaria — Minecraft modpack (CurseForge instance)

Repo นี้ใช้วางแผนงานและออกแบบ modpack **Minaria** ให้สมบูรณ์
root ของ repo = โฟลเดอร์ instance บนเครื่องผู้ใช้
`C:\Users\DELL\curseforge\minecraft\Instances\Minaria`

## โครงสร้าง
- `minecraftinstance.json` — manifest ของ CurseForge: เวอร์ชัน MC, mod loader, รายชื่อ mod (แหล่งความจริงของ mod list)
- `config/`, `defaultconfigs/` — config ของ mod
- `kubejs/` (ถ้ามี) — script ปรับ recipe/loot/item; `server_scripts/`, `startup_scripts/`, `client_scripts/`
- `config/ftbquests/` (ถ้ามี) — quest book
- `design/` — เอกสารออกแบบและแผนงาน (เขียนภาษาไทย)
  - `vision.md` — แนวคิด/เป้าหมายของ pack
  - `roadmap.md` — แผนงาน milestone + checklist
  - `systems/` — ออกแบบแต่ละระบบ (progression, economy, mod integration)
  - `decisions/` — บันทึกการตัดสินใจ (เพิ่ม/ตัด mod, เปลี่ยน balance) รูปแบบ `NNNN-ชื่อ.md`
- `tools/instance_summary.py` — สรุป instance (`--mods` เพื่อดูรายชื่อ mod)

## ข้อจำกัดของ cloud session
- Session บน cloud เข้าถึงเครื่องผู้ใช้ไม่ได้ และรันเกม Minecraft ไม่ได้ — เห็นเฉพาะไฟล์ที่ push ขึ้น GitHub
- ไฟล์ `.jar` ของ mod ไม่ได้อยู่ใน repo: อ้างอิงชื่อ mod/เวอร์ชันจาก `minecraftinstance.json`
- เมื่อแก้ config/script ให้บอกผู้ใช้ว่าต้อง `git pull` ในโฟลเดอร์ instance แล้วเปิดเกมทดสอบ

## แนวทางทำงาน
- คุยและเขียนเอกสารเป็นภาษาไทย; ชื่อไฟล์, key ของ config และโค้ดใช้ภาษาอังกฤษ
- ก่อนเสนอ mod ใหม่ ให้เช็กว่ารองรับเวอร์ชัน MC + loader เดียวกับใน `minecraftinstance.json`
- การเปลี่ยนแปลงที่กระทบ balance/progression ให้บันทึกใน `design/decisions/` และอัปเดต `design/roadmap.md`
- ห้ามแก้ `minecraftinstance.json` ด้วยมือ (CurseForge จัดการเอง) — เพิ่ม/ลบ mod ต้องทำผ่าน CurseForge app บนเครื่อง
