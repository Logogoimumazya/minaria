# บาลานซ์บอส — สเกลเดียวทั้งแพ็ก

> อ้างอิง [`MINARIA_BIBLE.md`](MINARIA_BIBLE.md) หัวข้อ 5 (ประเภท/องก์) และ 9 (หลักบาลานซ์)
> ตัวเลขทุกตัวในนี้ **วัดจากเกมจริง** ด้วย `kubejs/server_scripts/balance_test.js` เว้นแต่ระบุ

## 1. เลือกสเกลของ Confluence เป็นแกน — ไม่ใช่ทางเลือก แต่เป็นข้อบังคับ

Confluence (Terraria) ให้ปรับได้แค่ค่าของ **บอส** (`bossAttributesMultiplierHealth/Damage` ใน
`confluence-common.toml`) — **ดาเมจอาวุธ hardcode อยู่ในโค้ด** ปรับไม่ได้:

| ช่วง | อาวุธประชิด Confluence (วัดจาก attribute) | เทียบ vanilla |
|---|---|---|
| ต้นเกม | copper broadsword 5, platinum broadsword 8 | ดาบเหล็ก 6 |
| ก่อน hardmode ปลาย | lights_bane 11, muramasa 15 | ดาบ netherite 8 |
| hardmode | adamantite/titanium sword 36, breaker blade 37 | — |
| ปลายเกม | hamaxe ธาตุ 60, the_axe 72 | — |

ดังนั้นบอสจากม้อดอื่นต้อง **ขึ้นมาหา** สเกลของ Confluence ไม่งั้นอาวุธ hardmode ตีตายใน 5–10 ที

## 2. เส้นอ้างอิง: บอส Confluence 1.2.5 (ค่าเริ่มต้น, Normal)

| บอส | HP | เกราะ | ดาเมจต่อทีสูงสุด | องก์ |
|---|---|---|---|---|
| King Slime | 728 | 10 | 16.5 | 0 |
| Eye of Cthulhu | 728 | 12 | 6 (+ลูกน้อง) | I |
| Brain of Cthulhu | 552 (+neuron) | 14 | 9 | I |
| Eater of Worlds | 54 ต่อปล้อง | 4 | 11.5 | I |
| Queen Bee | 1237 | 8 | 14 | I |
| Skeletron | 2288 | 10 | 18.2 | I |
| Deerclops | 3094 | 10 | 10 | I |
| Wall of Flesh | 3096 | 6 | ไม่ได้วัด¹ | II |
| Retinazer / Spazmatism | 7800 / 8970 | 10 | ไม่ได้วัด¹ | II |
| Skeletron Prime | 10920 | 6 | 21 | II |
| The Destroyer | 23333 | 2 | 66 | II |
| Plantera | 10920 | 36 | 28 | III |
| Lunatic Cultist | 700 | 8 | 20 | IV |

¹ ไม่เข้าตีภายใน 20 วินาทีบนสนามทดสอบบนฟ้า — WoF ต้องการโลกล่าง, Twins น่าจะรอเงื่อนไขอื่น

**ช่วงเป้าหมายต่อองก์**: องก์ I ≈ 1,000–3,000 HP / 10–18 ต่อที · องก์ II ≈ 8,000–11,000 HP / 20–30 ต่อที

## 3. บอสม้อดอื่น — ค่าเดิม → ค่าที่ตั้ง (รอบแรก)

| บอส | ประเภท (bible) | องก์ | HP เดิม | HP ใหม่ | ดาเมจ | ตั้งที่ |
|---|---|---|---|---|---|---|
| BOMD Night Lich | มนุษย์ | I | 300 | 2000 | เดิม (missile 9) | `bosses_of_mass_destruction.json5` |
| BOMD Void Blossom | บรรพกาล | I | 350 | 2400 | เดิม 12 | 〃 |
| BOMD Gauntlet | จักรกลสงคราม | II | 250 | 9000 | 16 → 24 | 〃 |
| BOMD Obsidilith | บรรพกาล | II | 300 | 10000 | 16 → 24 | 〃 |
| Mowzie Frostmaw | บรรพกาล | I | 250 | ×8 = 2000 | เดิม | `mowziesmobs-common.toml` |
| Mowzie Umvuthi | เผ่าผู้เหลื่อม | I | 150 | ×10 = 1500 | เดิม | 〃 |
| Mowzie Ferrous Wroughtnaut | จักรกลสงคราม | I | 40 | ×20 = 800 | เดิม (ทีละ 30–45) ² | 〃 |
| Mowzie Sculptor | (บททดสอบ) | I | 140 | ×8 = 1120 | เดิม | 〃 |
| Alex's Mobs Void Worm | สิ่งแปลกปลอม | II | 160 | 8000 ³ | เดิม | `kubejs/server_scripts/boss_scaling.js` |
| Cataclysm Ignis | บรรพกาล | II | 450 | ×20 = 9000 | ×1.3 | `cataclysm-common.toml` |
| Cataclysm Ender Guardian | บรรพกาล | II | 333 | ×27 = 8991 | ×1.3 | 〃 |
| Cataclysm Netherite Monstrosity | จักรกลสงคราม | III | 600 | ×20 = 12000 | ×1.2 | 〃 |
| Cataclysm The Harbinger | จักรกลสงคราม | III | 390 | ×30 = 11700 | ×1.3 | 〃 |
| Cataclysm The Leviathan | บรรพกาล | III | 400 | ×30 = 12000 | ×1.3 | 〃 |
| Cataclysm Ancient Remnant | บรรพกาล | III | 450 | ×30 = 13500 | ×1.2 | 〃 |
| Cataclysm Maledictus | ผู้มาจากต่างโลกคนก่อน | III | 420 | ×30 = 12600 | ×1.4 | 〃 |
| Cataclysm Scylla | บรรพกาล | III | 390 | ×30 = 11700 | ×1.3 | 〃 |
| Iron's Dead King | มนุษย์ (ราชาอมตะแห่งออสทรัม) | II | 500 | 9000 ³ | เดิม | `boss_scaling.js` |
| Iron's Tyros (`fire_boss`) | มนุษย์ | II | 1000 | 9000 ³ | เดิม | 〃 |
| Aquamirae Captain Cornelia | สิ่งแปลกปลอม | I–II | 20 ⁴ | 2500 ³ | เดิม | 〃 |
| Aquamirae Maze Mother | สิ่งแปลกปลอม | I–II | 20 ⁴ | 3000 ³ | เดิม | 〃 |
| Goety Vizier | มนุษย์ (นักเวทนอกรีต) | I | 300 | 2000 | เดิม ⁵ | `goety/goety-attributes.toml` |
| Goety Skull Lord | มนุษย์ | I | 150 | 1500 | เดิม | 〃 |
| Goety Ender Keeper | สิ่งแปลกปลอม | II | 320 | 9000 | เดิม ⁵ | 〃 |
| Goety Apostle | มนุษย์ (นักบวชศาสนจักรที่ตกนรก) | II | 320 | 10000 | เดิม | 〃 |

ทุกค่าในตารางนี้ **ยืนยันแล้วในเกม** (balance test รอบ 7–11, 2026-09-24)

**ปัญหา (พบ 2026-09-26):** บอส Cataclysm มีเพดาน `damage_cap`/`dps_cap` ที่เราไม่ได้ขยับตอนคูณเลือด ดาเมจต่อเนื่องจริง
ไม่เกิน `dps_cap` ต่อวินาที (ตรวจจาก bytecode) → ต้องตีอย่างน้อย 10–16 นาทีต่อตัว ดู [`CATACLYSM.md`](CATACLYSM.md) ข้อ 3.1

**แก้ชั่วคราว (2026-09-26):** ตั้งเพดานให้เวลาฆ่าขั้นต่ำ (ตีเต็มเพดานตลอด) ≈ 3 นาทีสำหรับองก์ II, ≈ 4 นาทีสำหรับองก์ III
และยก `range_cap` 12–18 → 24 ให้เวทและปืนยิงเข้าจากระยะกลางได้ (ดาเมจเป็น 0 ที่ 36 บล็อก) ค่าจริงรอ DPS ผู้เล่น (CATACLYSM H2)

| บอส | HP | `dps_cap` เดิม → ใหม่ | `damage_cap` เดิม → ใหม่ | ขั้นต่ำ |
|---|---|---|---|---|
| Ignis, Ender Guardian | 9,000 | 14 / 13 → 50 | 20 / 22 → 45 | 3.0 นาที |
| Monstrosity, Harbinger, Leviathan, Scylla | 11,700–12,000 | 13–20 → 50 | 20–25 → 60 | 3.9–4.0 นาที |
| Ancient Remnant | 13,500 | 14 → 56 | 21 → 60 | 4.0 นาที |
| Maledictus | 12,600 | 13 → 53 | 20 → 60 | 4.0 นาที |

² Wroughtnaut โดนดาเมจได้เฉพาะจากด้านหลังโดยการออกแบบ HP ต่ำกว่าเพื่อนจึงตั้งใจ แต่ตีทีละ 30–45 = ฆ่าผู้เล่น
เลือด 20 ในทีเดียว — ยอมไว้ก่อน เพราะยังไม่รู้ว่าผู้เล่น Confluence มีเลือดเท่าไรในองก์ I (ดูหัวข้อ 5)

³ ตั้งผ่าน `boss_scaling.js` เพราะ config ของม้อดเองไม่มีผลกับบอสที่ `/summon`: Iron's `additionalHealth`
(serverconfig) ไม่ขยับ, `voidWormMaxHealth` ไม่ขยับ — config พวกนั้นจึงถูกคืนเป็นค่าเริ่มต้น สคริปต์ตั้งเป็น
ค่าสัมบูรณ์ (ไม่ใช่ตัวคูณ) ถ้าม้อดใส่ค่าของมันเองตอนเรียกผ่านพิธี/ไอเท็ม ผลรวมจะยังเท่าเดิม ไม่ซ้อนกัน
**ยังไม่ได้ทดสอบ** ว่าการเรียกบอสแบบในเกมจริง (Dead King จากศพในสุสาน, Cornelia จากไอเท็ม) ได้ค่าเดียวกัน

⁴ 20 คือค่าตั้งต้นของ attribute — บอส Aquamirae ได้ค่าจริงเฉพาะเมื่อเรียกผ่านกลไกของม้อด ค่าจริงไม่ทราบ

⁵ Goety จำกัด **ดาเมจที่บอสรับได้ต่อที** (`*DamageCap`) Vizier คงไว้ 20 เพราะอยู่องก์ I (อาวุธ 8–15 ไม่ถึงเพดาน)
Ender Keeper ยกเป็น 60 — ถ้าเพดาน 20 กับ HP 9000 ผู้เล่นต้องตีอย่างน้อย 450 ที

Eidolon: Repraised ไม่มีบอสจริง (Giant Skeleton / Necromancer เป็นมอน elite) — ไม่ได้ปรับ

Cataclysm มีท่าที่ตีเป็น **% ของเลือดสูงสุดผู้เล่น** (`*_hp_damage` 5–10% ต่อที ใน `cataclysm-common.toml`)
ท่าพวกนี้จะแรงขึ้นเองตามเลือดผู้เล่น ไม่ต้องสเกลตาม

## 4. วิธีวัดซ้ำ

```
python dev/launch_test.py MINARIA_BALANCE_TEST     # รันเบื้องหลัง — มันรอจนเกมปิด
```
- ต้องมีเซฟชื่อ `saves/MINARIA_BALANCE_TEST` (ก๊อปจากเซฟไหนก็ได้ — สคริปต์ทำงานเฉพาะในเซฟชื่อนี้)
- วัดเฉพาะบางตัว: เขียน `kubejs/balance_test/bosses.json` เป็น `{ "bosses": ["mod:id", ...] }` —
  ไม่มีไฟล์นี้ = วัดทุกตัวใน `BOSSES` ของสคริปต์
- ผลออกที่ `kubejs/balance_test/results.json` — `maxHit` คือค่าที่ใช้ได้, `hits` นับเกินจริง
  (ดาเมจถูกยกเลิกทุกที ผู้เล่นจึงไม่มีช่วงอมตะหลังโดนตี)
- launcher ตั้งค่าเบาชั่วคราวระหว่างรัน แล้วคืนค่าเดิมตอนปิด (`TEST_OVERRIDES` ใน `dev/launch_test.py`):
  ไม่ pause เมื่อหน้าต่างไม่โฟกัส, render 6 / simulation 5, ปิด Distant Horizons generation; สคริปต์ปิด
  `doMobSpawning` ทันทีที่เข้าโลก — ก่อนหน้านี้รอบหนึ่งค้าง 4 นาทีเพราะ natural spawner และ RoadWeaver
  (`StructureAvoidanceService`) บังคับโหลด chunk บน server thread แข่งกับ DH หลังตั้งค่าเบา: เข้าโลกถึงบอสแรก 53 วินาที
- ผู้เล่นทดสอบใช้เลือด vanilla 20 เสมอ — ยืนยันแล้วว่า Confluence **ไม่** สเกล HP บอสตามเลือดผู้เล่น
  (King Slime 728 ทั้งตอนผู้เล่นเลือด 400 และ 20)

## 5. ยังไม่รู้ / ต้องทำต่อ

- **เลือดผู้เล่นตามองก์** — Confluence มี life crystal ไหม เพิ่มทีละเท่าไร ยังไม่ได้วัด ตัวเลขดาเมจ
  ของบอสทุกตัวต้องเทียบกับค่านี้
- DPS จริงของผู้เล่น — ตารางหัวข้อ 1 เป็นดาเมจต่อที ยังไม่รวมความเร็วโจมตี, อาวุธยิง/เวท, ความสามารถพิเศษ
- ความรู้สึกตอนสู้ (ท่า, ความยาก) — ต้องให้คนเล่นจริง ตัวเลขบอกไม่ได้
- บอสที่ไม่เข้าตีในสนามทดสอบ (วัดดาเมจไม่ได้): Wall of Flesh, Twins, Frostmaw, Sculptor, Harbinger, Ancient
  Remnant, Scylla — ส่วนใหญ่ต้องการสภาพแวดล้อมของตัวเอง (โลกล่าง, น้ำ, สนามของมัน) หรือต้องถูกปลุกก่อน
- การเรียกบอสผ่านกลไกจริงของม้อด (ไม่ใช่ `/summon`) ยังไม่ได้ทดสอบเลยสักตัว
- **เกมจริงค้างตอนสร้าง chunk ใหม่** (ไม่ใช่แค่ในเทส): server thread รอ chunk จาก natural spawner และ RoadWeaver
  ขณะ DH ใช้ `numberOfThreads = 9` generate อยู่ — ต้องแก้ก่อนปล่อยแพ็ก (pre-gen ด้วย Chunky, ลด thread ของ DH)
