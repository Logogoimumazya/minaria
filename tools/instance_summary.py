#!/usr/bin/env python3
"""สรุปข้อมูล instance Minaria จาก minecraftinstance.json ของ CurseForge.

ใช้:  python3 tools/instance_summary.py          # สรุปสั้น
      python3 tools/instance_summary.py --mods   # พร้อมรายชื่อ mod ทั้งหมด
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INSTANCE = ROOT / "minecraftinstance.json"


def main() -> int:
    if not INSTANCE.exists():
        print("Minaria: ยังไม่มี minecraftinstance.json ใน repo — "
              "ยังไม่ได้ sync ไฟล์จาก instance บนเครื่อง (ดู README.md)")
        return 0

    data = json.loads(INSTANCE.read_text(encoding="utf-8-sig"))
    loader = (data.get("baseModLoader") or {}).get("name", "unknown")
    version = data.get("gameVersion", "unknown")
    addons = data.get("installedAddons") or []
    names = sorted(a.get("name", "?") for a in addons)

    print(f"Minaria: Minecraft {version}, loader {loader}, {len(names)} mods")
    for folder in ("config", "defaultconfigs", "kubejs", "scripts", "design"):
        path = ROOT / folder
        if path.is_dir():
            count = sum(1 for p in path.rglob("*") if p.is_file())
            print(f"  {folder}/: {count} files")

    if "--mods" in sys.argv:
        for name in names:
            print(f"  - {name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
