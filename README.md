# Minaria

Modpack Minecraft (CurseForge) — repo สำหรับวางแผนงาน ออกแบบระบบ และเก็บ config/script ของ pack

## Sync กับ instance บนเครื่อง (ทำครั้งแรกครั้งเดียว)

เปิด Git Bash / PowerShell แล้วรัน:

```bash
cd "C:/Users/DELL/curseforge/minecraft/Instances/Minaria"
git init -b main
git remote add origin https://github.com/Logogoimumazya/minaria.git
git fetch origin
git checkout -t origin/main     # ดึง .gitignore, CLAUDE.md, design/ ลงมา
git add -A
git commit -m "Import Minaria instance config"
git push -u origin main
```

`.gitignore` จะกันไฟล์ใหญ่และไฟล์ส่วนตัวไว้ให้แล้ว (mods/*.jar, saves, logs, options.txt ฯลฯ)
รายชื่อ mod ติดตามผ่าน `minecraftinstance.json`

## Workflow ประจำวัน

1. แก้ไข/ติดตั้ง mod บนเครื่อง → `git add -A && git commit && git push`
2. ใน Claude Code (cloud) วางแผน/แก้ config/script/เอกสารออกแบบ → Claude push ขึ้น branch + เปิด PR
3. Merge PR → บนเครื่อง `git pull` → เปิดเกมทดสอบ

## เอกสารออกแบบ

- [design/vision.md](design/vision.md) — แนวคิดของ pack
- [design/roadmap.md](design/roadmap.md) — แผนงาน
- [design/systems/](design/systems/) — ออกแบบแต่ละระบบ
- [design/decisions/](design/decisions/) — บันทึกการตัดสินใจ
