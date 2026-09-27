# ลำดับชั้นถิ่นฐานและโครงข่ายถนน (Minaria / Confluence Kingdoms)

เอกสารนี้แทนหัวข้อ 03–05 ของพิมพ์เขียว "เมืองหลวงและวงแหวนศักดินา" ทุกตัวเลขในที่นี้
อ่านจากไฟล์จริงในอินสแตนซ์นี้ ไม่ใช่ค่าดีฟอลต์ของมอด

สถานะ: **R0–R4 ลงไฟล์แล้ว, ตรวจในเกมรอบแรกแล้วเจอของจริงสองข้อ** (22 ก.ย. 2026)
ดูหัวข้อ 0c สำหรับแผนงานรอบถัดไป

---

## 0. สามข้อที่เอกสารนี้เขียนผิด — แก้แล้วตอนลงมือ

เปิด jar อ่านจริงตอนจะแก้ไฟล์ แล้วพบว่าข้อสรุปเดิมสามข้อไม่ตรงกับของจริง

**0.1 CTOV ไม่ได้ใช้มิกซ์อิน** — `[forge]ctov-3.4.14.jar` มีคลาสทั้งหมด **3 คลาส
รวมกันราว 1.5 KB** และ `*.mixins.json` ทั้งสองไฟล์มีลิสต์ว่างเปล่า มันเป็นดาต้าแพ็กล้วน
การฉีดหมู่บ้านมาจากไฟล์เดียว:

```
data/ctov/lithostitched/worldgen_modifier/ctov/village.json
  → lithostitched:add_structure_set_entries → minecraft:villages
  → 63 รายการ (21 ต่อชั้น ไม่รวม underground) weight 1 ทุกตัว
```

ผลที่ตามมาสองข้อ: คำถาม "มิกซ์อินมาก่อนหรือหลัง lithostitched" **ตกไป** ไม่ต้องตรวจในเกม —
เรา override ไฟล์นั้นด้วย `lithostitched:no_op` ตรง ๆ ได้เลย · และน้ำหนัก 8 / 5 / 2 ใน
`config/ctov-common.toml` **ไม่เคยมีผล** เพราะไม่มีโค้ดอ่านมัน ทั้งสามชั้นเป็น weight 1 เท่ากันมาตลอด
(หัวข้อ 1.4 ของเอกสารนี้จึงผิด — ไฟล์คอนฟิกนั้นเป็นของตกค้างจาก CTOV รุ่นเก่า)

**0.2 cristellib เขียนทับ spacing ของ structure set ตอนรันไทม์** — เอกสารนี้อ่าน
`spacing 44 / separation 22` จาก `minecraft/worldgen/structure_set/villages.json` แล้วคำนวณต่อ
แต่ค่านั้นไม่ใช่ค่าที่เกมใช้ `config/cristellib/` มีสองไฟล์ที่อ้าง `villages` ชุดเดียวกัน
และไม่ตรงกันเอง:

| ไฟล์ | spacing / separation | ระยะต่ำสุดจริง |
|---|---|---|
| `cristellib/minecraftP.json5` | **34 / 8** | **128 บล็อก** |
| `cristellib/natures_spirit/structure_placement_config.json5` | 44 / 22 | 352 บล็อก |
| ดาต้าแพ็กของเรา | 44 / 22 | 352 บล็อก |

หมู่บ้านกว้าง 232 บล็อกที่ห่างกันขั้นต่ำ **128 บล็อก** — นี่คือต้นเหตุของหมู่บ้านครึ่ง ๆ กลาง ๆ
ที่เห็นในเกม ไม่ใช่ 704 บล็อกตามที่เอกสารนี้คำนวณไว้ ตอนนี้ตั้งทั้งสามไฟล์เป็น 40 / 20 ตรงกันแล้ว

**0.3 นครหลวงคือตัวที่พังหนักที่สุด ไม่ใช่ CTOV** — `kingdoms:capital_*` และ `ward_*`
ใช้พูล `revampedvillages:start` ของ lukis-grand-capitals ซึ่งผู้เขียนตั้งไว้ที่
`size 5 · mdfc 80 · use_expansion_hack false · beard_thin` แต่ของเราตั้ง
`size 11 / 9 · mdfc 116 · expansion hack เปิด · beard_box`

`max_distance_from_center` คือ**เพดานตัดทิ้ง** ไม่ใช่เป้าหมาย — ชิ้นที่ขยายพ้น 116 บล็อกถูกทิ้งเงียบ ๆ
size 11 บนพูลที่ออกแบบมาเพื่อ 5 แปลว่าครึ่งนอกของนครหลวงถูกตัดทิ้งทุกครั้ง
และ `project_start_to_heightmap: WORLD_SURFACE` นับยอดไม้ด้วย ชิ้นเริ่มต้นจึงลงบนเรือนยอดได้

> **แก้ไขภายหลัง — 116 ไม่ใช่ตัวเลขมั่ว มันคือเพดานตามกฎของวานิลลา**
> `JigsawStructure.verifyRange` บังคับว่า
> `max_distance_from_center + (terrain_adaptation ไม่ใช่ none ? 12 : 0) ≤ 128`
> แปลว่าถ้าใช้ beard ชนิดใดก็ตาม ค่าสูงสุดที่ใส่ได้คือ **116** พอดี
> ผมดัน capital ขึ้นเป็น 128 ตอนแรกแล้วเกมพังตอนสร้างโลก:
> `Failed to load registries` → `Structure size including terrain adaptation must not exceed 128`
> — ตอนนี้ capital กลับมาเป็น `size 7 / mdfc 116` ซึ่งยังกว้างกว่าพูลของ lukis (80) อยู่ 36 บล็อก

**0.4 หมวดสปอว์นของทหาร — ตอบแล้วจาก jar** (คำถามค้างข้อที่สองของพิมพ์เขียว)
`ValarianConquestModEntities.class` อ้างถึง `MobCategory` แค่สองค่า: **MONSTER** กับ **MISC**
ไม่มี `CREATURE` เลย แปลว่า `soldier` / `archer` / `male_citizen` / `female_citizen` / `troll`
อยู่หมวด **monster** ทั้งหมด ทหารจึงต้องใส่ใน `spawn_overrides.monster`
ใส่ใน `creature` แล้วจะไม่เกิดเลยและ log ไม่บ่น — ตรงกับที่พิมพ์เขียวเตือนไว้

ผลพลอยได้: การ override `monster` **แทนที่**พูลม็อบศัตรูวานิลลาในกล่อง ไม่ใช่เพิ่มเข้าไป
ใส่ทหารลงไปจึงได้สองอย่างพร้อมกัน — มีกองรักษาการณ์ และไม่มีซอมบี้ในลานปราสาท

**0.5 `valarian_conquest:crossbowman` ไม่มีอยู่จริง** — มีใน `en_us.json` แต่ไม่ได้ลงทะเบียนใน
entity registry (มีแค่ archer, soldier, male_citizen, female_citizen, troll)
พิมพ์เขียวเสนอให้ใส่ crossbowman ในรายชื่อทหาร — ถ้าใส่ไปมันจะเป็นรายการตายเงียบ ๆ

**0.6 id ตายในแท็กอีกสองตัว** — `valarian_conquest:bohemian_castle` (jar มีแต่ `bohemian_outpost`)
และ `nova_structures:village_birch` (dungeons-and-taverns 3.0.3.f ไม่มีไฟล์นี้)
ทั้งคู่ตั้ง `required: false` จึงหายเงียบ ๆ ไม่มี error — ถอนออกแล้วทั้งสองตัว

**0.7 ไม่มี structure ตัวไหนถูกวางซ้ำสองชุด** — ไล่ structure set ทั้ง 86 ชุด
จากทั้ง jar และดาต้าแพ็ก ผลคือ 0 รายการซ้ำ ข้อกังวลเรื่อง duplicate pool query ไม่มีจริงในแพ็กนี้

---

## 0b. หลัง merge Valarian x MCA — R4 รอบแรกเขียนผิด แก้แล้ว

`minaria_court` เปลี่ยนโจทย์ทั้งหมด หลักการของมัน (เดิมอยู่หัวไฟล์ `valarian_mca_merge.js` ที่ลบไปแล้ว งานนี้อยู่ใน `Citizens.java`):
**"ปราสาทเก็บกำแพง ทหาร และเครื่องล้อมเมืองไว้ แต่*คน*ข้างในเป็น MCA villager"**

- `soldier` / `archer` → เก็บร่าง VC ไว้ ได้ "วิญญาณ" MCA (identity เก็บเป็น villager NBT
  ใน ForgeData ของร่าง) อาชีพเป็น `GUARD` / `ARCHER` / `LORD` ถ้าใส่ `lord_coronet_helmet`
- `male_citizen` / `female_citizen` → `Citizens.convert` แปลงเป็น MCA villager จริง
  โดยรักษาเพศ ชุด VC ทีม เจ้าของ และเทรดไว้ (จงใจไม่ใช้ `moddedVillagerWhitelist` ของ MCA
  เพราะมันสุ่มเพศใหม่และทิ้งชุดกับทีม)

**0b.1 ทุกชั้นมีประชากรติดมากับ NBT อยู่แล้ว** — ไม่ต้องใช้ `spawn_overrides` เติมคน

| structure | entity ที่ฝังใน nbt |
|---|---|
| `valarian_castle` | soldier ×19 · archer ×8 · citizen ×8 · horse ×2 |
| `templar_castle` | soldier ×30 · archer ×8 · citizen ×6 |
| lukis (นครหลวง/นคร) | villager กระจายใน 72 ชิ้น รวม 262 ตัว |
| grim keeps | รวม 1,960 ตัวใน 141 ไฟล์ |

**0b.2 `creature` override เป็นอันตราย — ถอนออกแล้ว** การ override หมวดหนึ่งคือการ
**แทนที่**รายชื่อม็อบของหมวดนั้น ไม่ใช่เพิ่มเข้าไป `creature → [villager]` จึงลบวัว แกะ หมู
ออกจากกล่องทั้งหมด — นครหลวงกว้าง 256 บล็อกที่ไม่มีปศุสัตว์เลย
และ MCA villager ไม่ despawn ทุกครั้งที่ผู้เล่นกลับมาเยือนจะมี villager ถาวรเพิ่มขึ้นเรื่อย ๆ ไม่มีเพดาน

**0b.3 grim keeps ไม่ใช่ปราสาทที่มีคนอยู่ — มันคือซาก** R4 รอบแรกจัดกลุ่ม 18 ตัวเป็น
"ปราสาทมีคนอยู่" จาก*ชื่อ* แต่ NBT บอกอีกอย่าง:

```
glacierfall_keep   stray ×10 · vindicator ×10 · pillager ×9
whitewarden_keep   stray ×33 · skeleton ×10 · zombie ×7
long_pine_cabin    vindicator ×3 · pillager ×3
travelers_lodge    wandering_trader ×1   ← ตัวเดียวที่สงบจริง
```

ใส่ MCA villager กับทหาร VC ลงไปในป้อมของ illager แปลว่ากองรักษาการณ์จะตีชาวบ้าน
(Souls.java บันทึกไว้เอง: ทหาร VC ตี villager ที่มีทีม) และ vindicator ตีทั้งสองฝ่าย
— ถอน override ออกจากทั้ง 18 ไฟล์แล้ว คืนเป็นซากตามเดิม

**0b.4 ที่เหลือไว้: 17 ไฟล์ หมวด `monster` อย่างเดียว** — นครหลวง 5 · นคร 5 · ปราสาท VC 7
กองรักษาการณ์เกิดใหม่ได้เอง (ของใน NBT ตายแล้วตายเลย) และเพราะ override หมวด monster
คือการแทนที่พูลศัตรู ลานปราสาทจึงไม่มีซอมบี้ไปพร้อมกัน — ได้สองอย่างจากรายการเดียว

**0b.5 `guardsTargetEntities` ไม่รู้จักม็อบ Valarian เลย** — 23 รายการเป็นม็อบวานิลลาล้วน
ทั้งที่ยาม MCA ใส่เกราะ Valarian อยู่แล้ว (`guardEquipment` / `archerEquipment` ถูกเขียนใหม่ตอน merge)
`valarian_conquest:troll` เป็น MONSTER ตัวเดียวของมอด — เพิ่มเข้าไปที่ priority 4 เท่า vindicator

---

## 0c. หลังพอร์ต — "เมืองไม่เป็นวงแหวน ถนนหายไปหมด" ไล่จากไฟล์จริงอีกรอบ

ผู้เล่นรายงานหลังลง R0–R4 ว่าเมืองไม่เป็นวงแหวนและถนนที่ตั้งใจลดความยุ่งเหยิงหายไปหมด
ไล่ของจริงสามจุด — คอนฟิกที่ประกาศไว้, เวิลด์ที่ทดสอบ, ข้อมูลถนนที่บันทึกจริงในเซฟ —
พบว่ามีทั้งสิ่งที่เป็นบั๊กจริง สิ่งที่ยังไม่เคยถูกสร้าง และสิ่งที่เป็นการเทียบกับเวิลด์คนละใบ

**0c.1 คอนฟิกที่มีอยู่ตอนนี้ไม่ได้ถูกรีเวิร์ต — R0–R3 ยังอยู่ครบ**

ไล่อ่านไฟล์ที่ใช้งานจริงในดาต้าแพ็ก (ไม่ใช่ประวัติ git): `road_nodes.json` ยังเป็น
`replace: true` เหลือสามแท็ก, `roadweaver.json` ยังเป็น `SNAP_BRANCH`, ทั้งเจ็ด structure set
ใน `kingdoms/worldgen/structure_set/` มี spacing/separation/salt ตามตารางในหัวข้อ 3.3
เกือบทุกตัว (ยกเว้นสองไฟล์ในข้อ 0c.3) การพอร์ต MCA×Valarian ไม่ได้แตะไฟล์ worldgen เหล่านี้เลย —
`git show --stat` ของ merge commit มีแต่โค้ด Java กับสอง kubejs script ไม่มีไฟล์ใน
`moonlight-global-datapacks/` ปนมา

**0c.2 นครหลวงไม่เคยเป็นวงแหวนจริง — หัวข้อ 4 ยังเป็นแค่ข้อเสนอ ไม่ใช่ของที่ลงแล้ว**

นี่คือสาเหตุตรงของ "เมืองไม่เป็นวงแหวน" — ไม่ใช่บั๊ก แต่เป็นงานที่ค้างอยู่
`kingdoms/worldgen/structure/capital_plains.json` (และอีกสี่ไบโอม) ยังใช้
`start_pool: revampedvillages:start` ตัวเดียวเหมือนเดิม ไม่มีไฟล์ nbt แกนปราสาทใหม่
ตามทาง A ของหัวข้อ 4.3 และค้นทั้ง `dev/valarian_compat` แล้วไม่มีคลาสไหนลงทะเบียน
`StructurePlacement` ชนิด satellite ตามทาง B เลยสักบรรทัด — ทั้งสองทางที่เอกสารเสนอไว้
ยังไม่มีทางไหนถูกสร้างจริง นครหลวงตอนนี้จึงยังเป็นจุดเดียว ไม่ใช่ปราสาท+หมู่บ้านล้อมรอบ

**0c.3 บั๊กจริงที่เจอและแก้แล้วรอบนี้ — `wards.json` กับ `aegis.json` ไม่มี exclusion_zone**

ทุก structure set ระดับรองของนครหลวง (`towns`, `villages`, `hamlets`, `fiefs`, `undercroft`)
มี `exclusion_zone` ผลักตัวเองออกจาก `kingdoms:capitals` ยกเว้นสองตัว — `wards.json` (ชั้นนคร
ซึ่งเป็นโหนดถนนด้วย) และ `aegis.json` — ทั้งคู่ไม่มีเลย นครสามารถเกิดทับหรือติดขอบนครหลวงได้
ซึ่งพัง topology ของถนนเฉพาะจุด (โหนดสองจุดที่ระยะห่างเกือบศูนย์ทำให้ SNAP_BRANCH ต่อ
ทางแยกประหลาดหรือทับเส้นเดิม) เพิ่ม `exclusion_zone` แบบเดียวกับ `towns.json` ให้ทั้งสองไฟล์แล้ว
(`wards` → 12 chunk, `aegis` → 10 chunk จาก `kingdoms:capitals`)

**0c.4 เวิลด์ที่ทดสอบน่าจะเป็นเวิลด์เก่าก่อนแก้ ไม่ใช่เวิลด์ใหม่**

`saves/` มีสองเวิลด์ ไล่เวลาสร้างเทียบกับคอมมิตที่แก้:

| เวิลด์ | สร้างเมื่อ | เทียบกับคอมมิตแก้ไข (01:09–01:40 น. 22 ก.ย.) | ไฟล์ถนนที่บันทึกจริง |
|---|---|---|---|
| `New World` | **21 ก.ย. 23:35 น.** | **ก่อนแก้ทุกคอมมิต** | 329 ไฟล์ .nbt |
| `TESAT` | **22 ก.ย. 01:42 น.** | หลังแก้ (ห่างคอมมิตสุดท้าย 2 นาที) | 9 ไฟล์ .nbt |

`New World` ถูกสร้างจากคอนฟิกเก่า (DELAUNAY, 145 โหนด, spacing ที่ยังไม่ตรงกันสามไฟล์)
ก่อนที่คอมมิต `4ac1b39`–`6fcfe26` จะแก้อะไรเลยสักอย่าง — 329 ไฟล์ถนนที่มันบันทึกไว้คือตาข่ายเก่า
และ **Minecraft ไม่รีเจนชังก์ที่โหลดไปแล้ว** ต่อให้แก้ดาต้าแพ็กภายหลัง ตาข่ายเก่าก็ยังฝังอยู่ในเซฟนั้น
ถ้ารอบทดสอบที่บอกว่า "ถนนหายไปหมด" เล่นบน `New World` นั่นคือการเทียบสภาพเก่ากับสภาพเก่า
ไม่ใช่หลักฐานว่าคอนฟิกใหม่พัง

`TESAT` คือเวิลด์ที่สร้างหลังคอมมิตสุดท้าย และมีไฟล์ถนนบันทึกจริง 9 ไฟล์ (ใหญ่สุด ~400 KB)
— ถนนไม่ได้หายไปศูนย์ แต่บางกว่าของเก่ามากเพราะ `SNAP_BRANCH` + โหนดที่ตัดจาก 145 เหลือ 3 ชั้น
ทำงานตามที่ตั้งใจ ปัญหาคือ **นครหลวงห่างกัน spacing 128 chunk = ~2,048 บล็อก** เล่นใกล้จุดเกิด
ไม่กี่ร้อยบล็อกจะเห็นนครหลวงแค่แห่งเดียวกับถนนสั้น ๆ ไม่กี่สาย ซึ่งดูเหมือน "ถนนหายไป" ทั้งที่
เป็นความบางที่ตั้งใจไว้ ไม่ใช่ของพัง — ต้อง pre-gen ให้ไกลพอก่อนตัดสิน

**0c.5 แผนงานรอบถัดไป**

1. **อย่าทดสอบต่อบน `New World`** — เกิดก่อนแก้ทุกคอมมิต ถือเป็นเวิลด์อ้างอิง "ก่อนแก้" เท่านั้น
   ทดสอบทุกอย่างบนเวิลด์ใหม่จากนี้ไป
2. **pre-gen รัศมีอย่างน้อย 2,200–2,500 บล็อกจากจุดเกิดด้วย Chunky ก่อนตัดสินผล** —
   น้อยกว่านี้จะเห็นนครหลวงได้ไม่ถึงสองแห่ง ไม่มีทางเห็นถนนเชื่อมระหว่างนครหลวงเลย
3. **สร้างวงแหวนนครหลวงจริง** — เลือกทาง A หรือ B จากหัวข้อ 4.3 แล้วลงมือทำ
   (ตอนนี้ยังเป็นข้อเสนอเฉย ๆ นี่คืองานเดียวที่ตอบ "เมืองไม่เป็นวงแหวน" ได้ตรง ๆ)
4. **ยืนยันว่า exclusion_zone ใหม่บน `wards`/`aegis` ไม่ชนกับ salt ของชุดอื่น** เกิดโลกใหม่แล้วเช็ค
5. ทำ checklist การตรวจของ R0–R4 ในหัวข้อ 6 ซ้ำอีกรอบ **บนเวิลด์ที่ pre-gen แล้วเท่านั้น**
   — ระยะจาก Explorer's Compass, แผนที่ในตัว Roadweaver เอง (`data/roadweaver/map/*.png`
   มีอยู่แล้วใน TESAT พิสูจน์ว่ามันเรนเดอร์จริง), MCA Blueprint บนนครหลวง

---

## 0d. T1 ลงมือแล้ว (ทาง A) — T2/T3 ยังไม่ได้ตรวจในเกม

เซสชันนี้ทำ T1 จากหัวข้อ 4.3 จริง เลือก **ทาง A** (datapack ล้วน ตามที่ข้อเสนอแนะไว้)

**สิ่งที่ตรวจยืนยันจากไฟล์จริงก่อนลงมือ** (ที่หัวข้อ 4.3 บอกว่ายังไม่เคยตรวจ):
- เปิด `ctov:structures/village/plains/town_center.nbt` ด้วย parser NBT ที่เขียนเอง
  (gzip + big-endian NBT ตามสเปก ไม่พึ่งไลบรารีนอก) พบ jigsaw **8 บล็อก ไม่ใช่ 15**
  ตามที่เอกสารเดิมเดา ตัวที่ชี้ถนนจริงมี 4 บล็อก: `name: minecraft:empty`,
  `target: minecraft:street`, `pool: ctov:village/plains/roads`, `joint: rollable`,
  `final_state: minecraft:air` — ตรวจซ้ำกับ desert/savanna/snowy_igloo/taiga แล้ว
  รูปแบบเดียวกันทุกไบโอม ต่างแค่ `pool` เป็น `ctov:village/<biome>/roads`
- `valarian_castle.nbt` ขนาด 72×40×80 ไม่มี jigsaw จริงตามที่เอกสารว่าไว้ (ตรวจ palette
  ทั้ง 291 ช่องแล้ว)
- ไล่ block data หาช่องเปิดจริงในกำแพงรอบปราสาท (เพราะไม่มีเรนเดอร์ 3D ให้ดู ต้องแกะจาก
  raw block grid) พบว่าปราสาทมี **ทางเข้าจริงจุดเดียว** — ไม่ใช่ 4-6 ประตูรอบด้านตามที่หัวข้อ
  4.3 คาดไว้ — เป็นสะพาน/อาคารประตูด้านทิศใต้ (`z≈59–77`) ปลายเป็นลานหิน/ดิน กว้าง 7 บล็อก
  ที่ `x≈31–37, z≈77` แล้วจบเป็นพื้นที่ว่างจริง (ไม่มีพื้นต่อ ไม่มีกำแพง) — จุดนี้เท่านั้นที่ยืนยันได้
  ว่าไม่ใช่การเจาะกำแพงทึบ

**สิ่งที่ทำ:**
1. ใส่ `minecraft:jigsaw` 2 บล็อกที่ `(32,2,77)` และ `(36,2,77)` orientation `south_up`
   ชี้ pool ถนนของแต่ละไบโอม (verified round-trip ด้วย parser เดียวกัน + `gzip -t`
   ผ่านทุกไฟล์) — สร้างเป็น **5 ไฟล์แยกกัน** เพราะ pool ถนนถูก bake เข้าไปในตัว nbt เอง
   (ไม่ได้ใช้ `pool_aliases` เพราะหา schema จริงในแพ็กนี้มายืนยันไม่ได้ ไม่อยากเดา):
   `data/kingdoms/structures/castle_valarian_hub_{plains,desert,savanna,snowy,taiga}.nbt`
2. Template pool ใหม่ `kingdoms:capital_hub{,_desert,_savanna,_snowy,_taiga}` — ชิ้นเดียว
   `single_pool_element` แบบ `rigid` ชี้ไฟล์ข้างบน
3. `capital_{plains,desert,savanna,snowy,taiga}.json` เปลี่ยน `start_pool` จาก
   `revampedvillages:...` เป็น `kingdoms:capital_hub...` ตามคู่ไบโอม — **backup ค่าเดิมไว้ที่
   `docs/backups/capital_start_pool_2026-09-22/`** ก่อนแก้ตามที่หัวข้อ 4.3 กำชับ
4. ยืนยันว่า `ctov:village/<biome>/roads` มีอยู่จริงเป็น template pool ในแต่ละไบโอม (ไม่ใช่แค่
   ชื่อที่ปรากฏใน nbt) — เจอครบทั้ง 5 ไฟล์ในแจ็กแพ็ก ctov

**สิ่งที่ยังไม่รู้ / ยังไม่ตรวจ (T2/T3 ของ archive/NEXT_SESSION_TASKS_2026-09-22.md แผนเก่าก่อนมีทวีป):**
- ไม่เคยเปิดเกมดูผลจริง — ปราสาททั้ง 5 ไบโอมยังใช้ตัวอาคารเดียวกัน (`valarian_castle.nbt`
  เดิม) ต่างกันแค่ pool ถนนที่ต่อออกไป ดังนั้นปราสาทในทะเลทราย/หิมะ/สะวันนาจะยังหน้าตา
  เหมือนปราสาทที่ราบ — ถ้าต้องการสกินต่างกันต่อไบโอมต้องทำต่อ
  (ไม่มีในสโคปที่เอกสารนี้ขอ)
- เพราะพบว่าปราสาทมีทางเข้าจุดเดียว ผลลัพธ์ที่คาดคือถนน/หมู่บ้านแผ่ออกทาง **ทิศใต้ทางเดียว**
  ไม่ใช่วงล้อมรอบทิศตามผังในหัวข้อ 4.2 — ตรงกับความเสี่ยงที่หัวข้อ 4.3 เตือนไว้แล้ว
  ("ได้เมืองผืนเดียวต่อเนื่อง") แต่คราวนี้ทิศทางยังเบ้ไปทางเดียวด้วย ไม่ใช่กระจายรอบตัว
- ต้องทำ T2 (pre-gen โลกใหม่ ≥2,200–2,500 บล็อกจากจุดเกิด) ก่อนถึงจะเห็นผลจริง — ยังไม่ทำ
- ต้องทำ T3 (ยืนยัน exclusion_zone 12/10 chunk) — ยังไม่ทำ
- ถ้าผลจริงดูแย่ (ถนนวิ่งเข้ากำแพงทึบ, ปราสาทลอย, หมู่บ้านซ้อนปราสาท) ให้ย้อนกลับด้วยไฟล์ backup
  แล้วพิจารณาทาง B แทน

---

## 0e. ทาง B ลงจริงแล้ว — `valarian_compat:capital_cluster` (และสิ่งที่บรีฟเขียนผิด)

เซสชันนี้ทำ **ทาง B** ของหัวข้อ 4.3 จนคอมไพล์ผ่านและลงไฟล์แล้ว พร้อมกับตรวจบรีฟที่สั่งงานมา
ทีละข้อกับ jar จริง ผลคือ **หลายข้อในบรีฟไม่ตรงกับของจริง** บันทึกไว้เพื่อไม่ให้เซสชันหน้าทำซ้ำ

### 0e.1 สิ่งที่บรีฟสั่ง แต่ตรวจแล้วผิด / ทำไปแล้ว / ไม่จำเป็น

| บรีฟสั่ง | ของจริง |
|---|---|
| ตั้ง `planning.planningAlgorithm = DELAUNAYSNAP_BRANCH` | **ค่านี้ไม่มีอยู่จริง** enum `PlanningConfig$PlanningAlgorithm` มีแค่ `KNN, DELAUNAY, RNG, MST, SNAP_BRANCH` ค่าที่สั่งคือสองค่าต่อกัน ถ้าเขียนลงไปจะ parse ไม่ผ่านแล้วตกกลับเป็นค่า default — **ของเดิมตั้ง `SNAP_BRANCH` ไว้ถูกแล้ว อย่าแก้** |
| ตั้ง `predictRadiusChunks=160`, `initialPlanRadiusChunks=160`, `roadsideVillage.spawnChance=0.28`, `maxVillagesPerRoad=4` | **ตั้งครบทุกค่าแล้ว** ใน `config/roadweaver/roadweaver.json` ตั้งแต่ก่อนเซสชันนี้ (ตรวจ clamp ใน `sanitize()` แล้วด้วย: initialPlan สูงสุด 2048, predict สูงสุด 1024 → 160 ไม่โดน clamp) |
| ทำ tag `road_nodes.json` ให้เหลือ S0/S1/S2 | **ทำแล้ว** อยู่ที่ `global_packs/required_data/prototax_realms/data/kingdoms/tags/worldgen/structure/road_nodes.json` (ไม่ใช่ใน confluence_kingdoms) มี `capital/city/town` + `"replace": true` ครบ และ `#kingdoms:town` เป็น `ctov:large` ล้วนจริง |
| Mixin เข้า MCA `ServerSettlementManager` / `VillagerRegistry` เพื่อรวม settlement ID | **สองคลาสนี้ไม่มีอยู่ใน jar** ของจริงคือ `net.conczin.mca.server.world.data.VillageManager` — และ **ไม่ต้อง Mixin เลย**: `Village.MERGE_MARGIN = 64` กับ `maxBuildingRadius = 512` (ตั้งไว้แล้วใน `config/mca.json`) ทำให้ปราสาท + ดาวเทียมที่ระยะ 136–200 บล็อก ถูกนับเป็นหมู่บ้านเดียวอยู่แล้วโดยตัวมันเอง ตรงกับที่หัวข้อ 4.1 เขียนไว้ การไป Mixin `commitBuilding`/`merge` มีแต่เพิ่มความเสี่ยง crash โดยไม่ได้อะไรเพิ่ม |
| Audit salt ให้ไม่ซ้ำ | ตรวจแล้ว 14 structure set ในทุก datapack tree — **ไม่มี salt ซ้ำเลย** |
| ชื่อปราสาท grim (`glacierfall_keep`, `whitewarden_keep`, `snowgrave_citadel`, `decrown_monolith`) | **มีจริงทั้งสี่ตัว** ส่วนนี้ของบรีฟถูก |

### 0e.2 สิ่งที่ทำจริง — custom `StructurePlacement`

**ไม่ได้ใช้ Mixin และไม่ได้แตะ `ChunkGenerator` เลย** ตรงข้ามกับที่บรีฟสั่ง
("hook `ChunkGenerator#tryGenerateStructure`", "inject into generation queues") เพราะไม่จำเป็น:
วานิลลาถาม `StructurePlacement#isPlacementChunk` ของทุก set อยู่แล้วทีละชังก์ และ
`RandomSpreadStructurePlacement#getPotentialStructureChunk(long, int, int)` เป็น public +
deterministic + ไม่มี side effect → คำนวณตำแหน่ง anchor ของนครหลวงย้อนกลับจาก seed ได้ตรง ๆ
แล้วแค่ตอบ "ใช่" ตรงชังก์ที่เป็นวงแหวน

- **Registry key ใหม่**: `valarian_compat:capital_cluster`
  (ลงทะเบียนที่ `Registries.STRUCTURE_PLACEMENT` ผ่าน `DeferredRegister` ใน `VcWorldgen`)
- **คลาส**: `dev/valarian_compat/src/main/java/com/prototax/valariancompat/worldgen/CapitalClusterPlacement.java`
- **structure set ใหม่**: `kingdoms:capital_satellites` (salt `775311833`, ยืนยันแล้วว่าไม่ซ้ำ)
  ใช้ structure เดียวกับ `kingdoms:villages` (ctov:medium 21 ตัว)

```json
"placement": {
  "type": "valarian_compat:capital_cluster",
  "salt": 775311833,
  "anchor_set": "kingdoms:capitals",
  "ring": { "min_count": 3, "max_count": 5,
            "min_radius_chunks": 9, "max_radius_chunks": 12, "jitter": 0.6 }
}
```

**ทำไมต้องเป็น set แยก ไม่ใช่แก้ `kingdoms:villages`**: ทุก set ระดับหมู่บ้านมี
`exclusion_zone` ต่อ `kingdoms:capitals` อยู่แล้ว (villages 10, towns 12, wards 12, fiefs 14,
undercroft 16 chunk) ซึ่งกินทับย่าน 9–12 chunk ที่วงแหวนต้องไปอยู่พอดี — ถ้าไปแก้ set เดิม
หมู่บ้านสุ่มจะเข้ามาเบียดนครหลวงด้วย แยก set ทำให้ **ดาวเทียมที่ตั้งใจวาง** เข้าใกล้ได้
ส่วน **หมู่บ้านสุ่ม** ยังโดนกันออกเหมือนเดิม

**ตรวจแล้ว (static)**:
- `./gradlew build --offline` ผ่าน จาก `dev/valarian_compat` → jar ลง `mods/` แล้ว
- จำลองเลขวงแหวนด้วยสคริปต์ 4,000 anchor: count กระจาย 3/4/5 เท่า ๆ กัน,
  ระยะ **136–200 บล็อก** (8.49–12.53 chunk), ไม่มีดาวเทียมสองตัวชนชังก์เดียวกันเลย
- **ยังไม่ได้ตรวจในเกม** — ดู 0e.4

### 0e.3 grim: ทำไปบางส่วน

`glacierfall_keep`, `glacierfall_keep_plains`, `whitewarden_keep` ได้
`"monster": { "bounding_box": "full", "spawns": [] }` แล้ว (รูปแบบเดียวกับที่ `capital_*.json`
ใช้อยู่) — เดิมทั้งปราสาทมีคนอยู่และดันเจี้ยนเป็น `"spawn_overrides": {}` เหมือนกันหมด

**ยังไม่ทำ**: ฝั่งดันเจี้ยน (ย้าย `snowgrave_citadel`/`decrown_monolith` ออกจาก tag ไป
`#kingdoms:undercroft` + exclusion ≥20 chunk) และการเติม villager/citizen เข้า `spawn_overrides`
เพราะบรีฟระบุชื่อมาแค่ 4 ตัวจาก 39 ไฟล์ override ที่มีอยู่ — ต้องให้คนตัดสินว่าอีก 35 ตัว
ตัวไหนคือ "มีคนอยู่" ตัวไหนคือ "ดันเจี้ยน" ก่อน ไม่เดาเอง

### 0e.4 ยังไม่ได้ทำ / ยังไม่รู้

- **ยังไม่เคยเปิดเกม** — ทุกอย่างข้างบนคือ compile + ตรวจไฟล์ + จำลองเลขเท่านั้น
  ยังต้อง pre-gen โลกใหม่แล้ว `/locate structure #kingdoms:capital` ตามเกณฑ์ T2 เดิม
- **ความเสี่ยงที่ต้องรู้**: ถ้า `valarian_compat` โหลดไม่ขึ้น structure set
  `kingdoms:capital_satellites` จะอ้าง placement type ที่ไม่มีอยู่ → datapack พังทั้งชุด
  ถ้าเจออาการนั้นให้ลบไฟล์ `capital_satellites.json` ออกก่อนเป็นอันดับแรก
- **§2.2 ของบรีฟ (Mixin เข้า Roadweaver ทำ node weighting + ring road) ยังไม่ได้ทำ** และ
  **ขัดกับหัวข้อ 4.2 ของเอกสารนี้เอง** ซึ่งตั้งใจให้คลัสเตอร์เป็น *โหนดถนนจุดเดียว*
  ("Roadweaver จะลากถนนมาที่กลุ่ม ไม่ใช่ลากถนนระหว่างหมู่บ้านในกลุ่มกันเอง") ขณะที่บรีฟสั่งให้
  ลากถนนวงในระหว่างปราสาทกับดาวเทียม — ต้องเลือกอย่างใดอย่างหนึ่งก่อนลงมือ
  (คลาสที่เกี่ยวข้องถ้าจะทำ: `net.shiroha233.roadweaver.planning.NetworkPlanner`,
  `NetworkPlannerFactory`, `RoadPlanningService`, `planning/impl/SnapBranchPlanner`)
  และ `dev/valarian_compat` ตอนนี้ **ยังไม่มี Mixin infrastructure เลย** ต้องเพิ่ม
  mixin config + dependency ก่อน

---

## 1. ทำไมถนนถึงมั่ว — สาเหตุที่วัดได้สี่ข้อ

### 1.1 ทุกอย่างในโลกเป็น "จุดต่อถนน"

`config/roadweaver/roadweaver.json` ตั้ง `structureWhitelist: ["#kingdoms:road_nodes"]`
และไล่ตามแท็กไปจะได้:

```
#kingdoms:road_nodes
  └─ #minecraft:village          ← 145 structure
  └─ #kingdoms:valarian_holdings ← 17 structure (ซ้ำกับข้างบนเกือบหมด)
```

`#minecraft:village` ในแพ็กนี้ไม่ได้มีแค่หมู่บ้าน มันมีหอคอยเดี่ยว ค่ายโจร ซากปรักหักพัง
ป้อมชายแดน ปราสาทดันเจี้ยน และหมู่บ้านทั้งสามขนาดของ CTOV รวมกันหมด
เช่น `grim_kingdoms:north_spur_tower` (หอคอยเดี่ยว) กับ `valarian_conquest:bandit_ruins`
ก็เป็นจุดต่อถนนเท่ากับเมืองหลวง

### 1.2 อัลกอริทึมวางผังเป็นแบบที่หนาแน่นที่สุด

`planning.planningAlgorithm` = `DELAUNAY` คำอธิบายของมอดเองบอกตรง ๆ ว่า

> Delaunay = more uniform but **denser mesh** … Snap-Branch = sparse trunk +
> point-to-line snapping branches (T-junction style)

Delaunay triangulation ให้ทุกโหนดมีเส้นเชื่อมราว 6 เส้นโดยนิยาม เอาโหนด 145 ชนิด
กระจายทุก ~700 บล็อกมาใส่ ผลคือตาข่ายถนน ไม่ใช่โครงข่ายเมือง

ค่าที่ใช้ได้จริงในไฟล์คอนฟิก (อ่านจาก `PlanningConfig$PlanningAlgorithm`):
`DELAUNAY`, `KNN`, `RNG`, `MST`, `SNAP_BRANCH`

### 1.3 หมู่บ้านทั้งสามขนาดมีขนาดเท่ากันหมด

`moonlight-global-datapacks/confluence_kingdoms/data/ctov/worldgen/structure/{large,medium,small}/`
มี 66 ไฟล์ และทั้ง 66 ไฟล์ตั้งค่าเหมือนกันเป๊ะ:

| | size | max_distance_from_center | start_pool |
|---|---|---|---|
| ค่าของมอด (large / medium / small) | 6 / 5 / 4 | 80 | `ctov:village/<biome>/town_centers` |
| **ค่าในแพ็กนี้ ทั้งสามชั้น** | **7** | **116** | เหมือนกัน |

แปลว่าคำว่า large / medium / small ในแพ็กนี้ไม่มีความหมาย ทุกหมู่บ้านกว้าง 232 บล็อกเท่ากัน

### 1.4 ทุกหมู่บ้านอยู่ใน structure set เดียว

CTOV ไม่มี structure set ของตัวเองเลย (ในไฟล์ jar มีแค่ `underground_village.txt` ที่ปิดอยู่)
มันฉีดรายการเข้า `minecraft:villages` ตอนรันไทม์ผ่านมิกซ์อิน โดยใช้น้ำหนักจาก
`config/ctov-common.toml`:

```
smallVillageWeight  = 2    (ดีฟอลต์ของมอด 10)
mediumVillageWeight = 5    (ดีฟอลต์ 4)
largeVillageWeight  = 8    (ดีฟอลต์ 1)
```

คือกลับด้านกับดีฟอลต์ — ชั้นที่ใหญ่ที่สุดกลายเป็นชั้นที่พบบ่อยที่สุด
และ `minecraft/worldgen/structure_set/villages.json` ของเราตั้ง `spacing 44 / separation 22`
= หมู่บ้านขนาด 232 บล็อกหนึ่งแห่งทุก ~704 บล็อก ซ้อนขอบกันแทบตลอด

**สรุป: ถนนไม่ได้มั่ว ถนนทำตามที่ถูกบอกอย่างถูกต้องแล้ว สิ่งที่มั่วคือรายชื่อโหนด**

---

## 2. บันไดขนาด และการตั้งชื่อใหม่

กฎเดียว: **ชื่อบอกขนาด ขนาดบอกระยะห่าง ระยะห่างบอกว่าถนนจะยาวแค่ไหน**

### 2.1 ชั้นถิ่นฐาน (settlement) — เป็นจุดต่อถนนได้

| ชั้น | id ใหม่ | id เดิม | size / mdfc | ความกว้างสูงสุด | โหนด |
|---|---|---|---|---|---|
| S0 นครหลวง | `kingdoms:capital_<biome>` | เดิม | 11 / 116 | 232 + ปราสาท | ใช่ |
| S1 นคร | `kingdoms:city_<biome>` | `kingdoms:ward_<biome>` | 9 / 100 | 200 | ใช่ |
| S2 เมือง | `ctov:large/village_*` | เดิม | **6 / 80** | 160 | ใช่ |
| S3 หมู่บ้าน | `ctov:medium/village_*` | เดิม | **5 / 72** | 144 | ไม่ |
| S4 หมู่บ้านเล็ก | `ctov:small/village_*` | เดิม | **4 / 64** | 128 | ไม่ |

id ของ CTOV เปลี่ยนไม่ได้ เพราะมิกซ์อินของมอดอ้างถึงมันตรง ๆ — แต่ค่า size/mdfc
ในไฟล์ที่เรา override นั้นเปลี่ยนได้ และนั่นคือสิ่งที่ทำให้ชื่อ large/medium/small
กลับมามีความหมาย

### 2.2 ชั้นที่พักอาศัยของขุนนาง (hold) — ไม่เป็นจุดต่อถนน

ตั้งชื่อตามด้านกว้างจริงที่วัดจาก `size` ใน nbt:

| ชื่อใหม่ | ของเดิม | ขนาดจริง (กว้าง × ลึก) | ชั้น |
|---|---|---|---|
| `kingdoms:citadel_barathian` | `valarian_conquest:barathian_castle` | 124 × 96 | ป้อมนคร |
| `kingdoms:citadel_orleanian` | `orleanian_castle` | 111 × 112 | ป้อมนคร |
| `kingdoms:castle_templar` | `templar_castle` | 80 × 80 | ปราสาท |
| `kingdoms:castle_valarian` | `valarian_castle` | 72 × 80 | ปราสาท |
| `kingdoms:castle_visgothian` | `visgothian_castle` | 69 × 58 | ปราสาท |
| `kingdoms:castle_hospitaller` | `hospitaller_castle` | 64 × 55 | ปราสาท |
| `kingdoms:manor_aegis` | `aegis_castle` | 35 × 36 | คฤหาสน์ |
| `kingdoms:manor_burgundian` | `burgundian_castle` | 33 × 32 | คฤหาสน์ |
| `kingdoms:fort_aegis` | `aegis_fort` | 27 × 34 | ป้อม |
| `kingdoms:tower_aegis` | `aegis_outpost` | 11 × 11 | หอคอย |
| `kingdoms:camp_aegis` | `aegis_camp` | 12 × 12 | ค่าย |

จุดที่ผิดชัดที่สุดตอนนี้: `fiefs.json` ใส่ปราสาททั้งเจ็ดด้วย `weight: 1` เท่ากันหมด
ทั้งที่ `barathian_castle` กว้าง 124 บล็อก ส่วน `burgundian_castle` กว้าง 33 บล็อก
— ต่างกัน 11 เท่าเมื่อคิดเป็นพื้นที่ และ `aegis_outpost` ขนาด 11×11 ก็ไม่ใช่ outpost
มันคือหอคอยเดี่ยว

วิธีเปลี่ยนชื่อโดยไม่พังของเดิม: สร้าง structure ใหม่ในเนมสเปซ `kingdoms:` ที่ชี้ไป
template pool เดิม แล้วถอนรายการเก่าออกจาก placement ด้วย
`lithostitched:remove_structure_set_entries` (มีอยู่ใน lithostitched 1.4.11)

---

## 3. ชุดเชื่อม — โครงข่ายถนนแบบมีลำดับชั้น

Roadweaver มีกราฟเดียว ไม่มีแนวคิดเรื่อง "ถนนสายหลัก/สายรอง" ในตัว
ลำดับชั้นจึงต้องมาจากสองอย่าง: **ใครได้เป็นโหนด** กับ **อัลกอริทึมวางผัง**

### 3.1 แท็กโหนดใหม่

```jsonc
// kingdoms/tags/worldgen/structure/road_nodes.json
{
  "replace": true,
  "values": [
    "#kingdoms:capital",   // S0
    "#kingdoms:city",      // S1  (เปลี่ยนชื่อจาก town.json เดิม)
    "#kingdoms:town"       // S2  = ctov:large เท่านั้น
  ]
}
```

หลุดออกจากแท็กทั้งหมด: `ctov:medium`, `ctov:small`, หอคอย/ป้อม/ค่าย/ซากทุกชนิด
ของ grim_kingdoms, outpost และ bandit ทุกตัวของ valarian_conquest, ปราสาทดันเจี้ยน

หมู่บ้าน S3/S4 ไม่ถูกทิ้งเป็นเกาะ — `roadsideVillage` ที่เปิดอยู่แล้วจะสร้างกลุ่มบ้าน
ริมถนนสายหลักให้เอง และ S3/S4 ที่เกิดใกล้ถนนจะถูกถนนวิ่งผ่านอยู่ดีเพราะ
`otherStructureRoadOffset` 40

### 3.2 คอนฟิก Roadweaver

| คีย์ | เดิม | ใหม่ | เหตุผล |
|---|---|---|---|
| `planning.planningAlgorithm` | `DELAUNAY` | **`SNAP_BRANCH`** | ได้โครงถนนสายหลักที่เบาบาง แล้วเมืองเล็กเข้าเป็นสามแยก แทนที่จะได้ตาข่าย |
| `structurePrediction.predictRadiusChunks` | 192 | 160 | โหนดน้อยลงแล้ว ไม่ต้องมองไกลเท่าเดิม |
| `planning.initialPlanRadiusChunks` | 128 | 160 | ให้ผังตั้งต้นครอบเมืองหลวงที่ห่างกัน 2,048 บล็อก |
| `roadsideVillage.spawnChance` | 0.45 | 0.28 | ลดบ้านริมถนนที่ไปเพิ่มความรกให้กราฟ |
| `roadsideVillage.maxVillagesPerRoad` | 8 | 4 | เท่ากัน |
| `bridge.maxLengthBlocks` | 160 | 160 | คงเดิม ถนนสายยาวต้องข้ามน้ำได้ |

ถ้า `SNAP_BRANCH` ยังหนาไป ลำดับความเบาบางคือ
`MST` < `SNAP_BRANCH` ≈ `RNG` < `KNN` < `DELAUNAY`
(`MST` ให้ต้นไม้ล้วน — เชื่อมถึงกันหมดแต่ไม่มีทางเลี่ยง ไม่เหมาะกับคาราวานที่ต้องหลบด่านปล้น)

### 3.3 ตารางระยะห่าง

กฎ: `spacing × 16` ต้องไม่น้อยกว่า **4 เท่า** ของความกว้างสูงสุดของชั้นนั้น
ไม่งั้นถิ่นฐานจะซ้อนขอบกันและถนนจะสั้นจนไม่เป็นถนน

| ชั้น | structure set | spacing / separation | ระยะเฉลี่ย | salt | exclusion_zone |
|---|---|---|---|---|---|
| S0 นครหลวง | `kingdoms:capitals` | 128 / 96 | ~2,048 | 775311207 | — |
| S1 นคร | `kingdoms:cities` | 80 / 52 | ~1,280 | 775311309 | capitals 12 chunk |
| S2 เมือง | `kingdoms:towns` | 48 / 26 | ~768 | 775311411 | capitals 14, cities 7 |
| S3 หมู่บ้าน | `kingdoms:villages` | 32 / 16 | ~512 | 775311513 | capitals 10, towns 4 |
| S4 หมู่บ้านเล็ก | `kingdoms:hamlets` | 22 / 10 | ~352 | 775311615 | villages 3 |
| ป้อมนคร | `kingdoms:citadels` | 96 / 64 | ~1,536 | 775311717 | capitals 16, cities 10 |
| ปราสาท | `kingdoms:castles` | 64 / 40 | ~1,024 | 775311819 | capitals 14, citadels 10 |
| คฤหาสน์ | `kingdoms:manors` | 40 / 22 | ~640 | 775311921 | castles 6 |
| หอคอย/ป้อม/ค่าย | `kingdoms:watch` | 28 / 14 | ~448 | 775312023 | — |
| ดันเจี้ยน | `kingdoms:undercroft` | 60 / 34 | ~960 | 775311741 | capitals 20, cities 12 |

salt ทุกค่าต้องไม่ซ้ำกัน — เคยมีรายงาน salt ชนกันในแพ็กนี้มาแล้วหนึ่งรอบ
และผลคือถิ่นฐานสองชั้นเกิดทับกันทุกครั้ง

### 3.4 สิ่งที่ต้องทำเพิ่มเพื่อให้ตารางข้างบนมีผลจริง

CTOV ฉีดหมู่บ้านทั้ง 66 ตัวเข้า `minecraft:villages` ตอนรันไทม์ ถ้าไม่ถอนออก
ตารางข้างบนจะเป็นแค่กระดาษ — หมู่บ้านจะยังเกิดตาม `minecraft:villages` (44/22) เหมือนเดิม

```jsonc
// kingdoms/lithostitched/worldgen_modifier/unbundle_ctov_villages.json
{
  "type": "lithostitched:remove_structure_set_entries",
  "structure_sets": "minecraft:villages",
  "structures": "#kingdoms:ctov_all"
}
```

**ข้อนี้ต้องตรวจในเกม** ว่ามิกซ์อินของ CTOV ทำงานก่อนหรือหลังเฟสของ lithostitched
ถ้า lithostitched มาก่อน การถอนจะไม่มีผล ทางสำรองคือปิด
`generatesmallVillage` / `generatemediumVillage` / `generatelargeVillage`
ใน `config/ctov-common.toml` ทั้งสามตัว แล้ววางเองทั้งหมดผ่าน set ของเรา

---

## 4. เมืองหลวง: ปราสาท Valarian เป็นแกน หมู่บ้านล้อมรอบ

### 4.1 กลไกที่ทำให้มันเป็น "เมืองเดียว"

`config/mca.json` ตั้ง `maxBuildingRadius = 512` และ
`minimumBuildingsToBeConsideredAVillage = 5` กับ `enableAutoScanByDefault = true`

แปลว่า **อาคารทุกหลังในรัศมี 512 บล็อกจากศูนย์กลางเดียวกันจะถูก MCA นับเป็นหมู่บ้านเดียว**
โดยไม่สนว่ามาจาก structure คนละตัวกี่ตัว นี่คือสิ่งที่ทำให้คลัสเตอร์ทำงาน:
ปราสาทหนึ่งหลัง + หมู่บ้าน 3–5 แห่งที่อยู่ในรัศมีนั้น = เมืองหลวงหนึ่งเมืองในสายตาเกม
มีสำมะโน มีภาษี มีทหารยาม เป็นก้อนเดียว

### 4.2 ผังที่เสนอ

```
                    หมู่บ้านช่างฝีมือ
                          ▲ 160
                          │
  หมู่บ้านตลาด ◄── 170 ──[ปราสาท Valarian]── 150 ──► หมู่บ้านทหาร
                          │        72 × 80
                          ▼ 180
                    หมู่บ้านชาวนา

  รัศมีคลัสเตอร์ ≤ 200 บล็อก · ขอบเขตเดียวของ MCA ที่ 512 · ไม่มีหมู่บ้านไหนหลุด
```

- แกนกลาง: `kingdoms:castle_valarian` (72 × 80, `size 1`, `mdfc 80` — ชิ้นเดียวแข็ง ไม่มี jigsaw)
- วงล้อม: CTOV `medium` 3–5 แห่ง ที่รัศมี 150–200 บล็อกจากศูนย์กลางปราสาท
- ทุกอย่างอยู่ใน `#kingdoms:capital` → เป็นโหนดถนนหนึ่งจุด ไม่ใช่หกจุด
  (Roadweaver จะลากถนนมาที่กลุ่ม ไม่ใช่ลากถนนระหว่างหมู่บ้านในกลุ่มกันเอง)

### 4.3 ทำยังไงให้มันเกิดพร้อมกันเป็นกลุ่ม — สองทาง

ข้อเท็จจริงที่ปิดทางง่าย ๆ ไว้: **ไฟล์ nbt ทั้ง 32 ตัวของ valarian_conquest ไม่มี jigsaw block
แม้แต่บล็อกเดียว** (ตรวจแล้วทุกไฟล์) ปราสาทจึงต่อ jigsaw ออกไปเป็นหมู่บ้านไม่ได้
และวานิลลาไม่มีกลไก "ดึงดูด" ให้ structure set หนึ่งไปเกิดใกล้อีกชุดหนึ่ง
(มีแต่ `exclusion_zone` ที่ผลักออก) ส่วน lithostitched 1.4.11 ก็ไม่ได้ลงทะเบียน
structure placement แบบใหม่ไว้ให้

**ทาง A — datapack ล้วน (เริ่มได้ทันที)**

ทำ nbt แกนกลางใหม่หนึ่งไฟล์: เอา `valarian_castle.nbt` มาแล้วใส่ `minecraft:jigsaw`
รอบขอบ 4–6 บล็อก ชี้ไปที่ pool ถนนของ CTOV (`ctov:village/<biome>/roads` —
ชิ้น `town_center.nbt` ของ plains มี jigsaw 15 บล็อกที่ชี้ pool นี้อยู่แล้ว)
จากนั้น `kingdoms:capital_<biome>` เปลี่ยน `start_pool` มาเป็นชิ้นนี้

- ได้: ปราสาทอยู่กลาง ถนนแผ่ออกจากประตู เขตบ้านต่อยาวออกไปตาม jigsaw
- เสีย: ได้เมืองผืนเดียวต่อเนื่อง ไม่ใช่หมู่บ้าน 3–5 กลุ่มที่แยกกันจริง
  (แก้ได้บางส่วนด้วยชิ้น "ทางเข้า" คั่นกลางเพื่อเว้นช่องทุ่ง)
- สร้างไฟล์ nbt นี้ด้วยสคริปต์ได้ ไม่ต้องเข้าเกมไปสร้างเอง

**ทาง B — เพิ่มโค้ดใน `dev/valarian_compat` (ได้ผังที่ขอเป๊ะ)**

ลงทะเบียน `StructurePlacement` ชนิดใหม่ `kingdoms:satellite` ที่รับพารามิเตอร์
`anchor_set` (ชุดของนครหลวง), `ring_radius_chunks`, `count`, `jitter`
แล้วคืนตำแหน่งเป็นวงรอบตำแหน่งของ anchor

- ได้: หมู่บ้าน 3–5 แห่งแยกกันจริง ที่รัศมีและจำนวนที่กำหนดเอง ตรงตามที่ขอทุกข้อ
- เสีย: ~120 บรรทัด และต้องคอมไพล์ (มอดใน `dev/` สี่ตัวสร้างได้อยู่แล้ว)

**ข้อเสนอ: ทำ A ก่อนเพื่อให้เห็นภาพในเกมรอบนี้ แล้วค่อยทำ B เมื่อยืนยันว่าผังใช่**

---

## 5. ปราสาท Grim: แยกปราสาทที่มีคนอยู่ ออกจากปราสาทดันเจี้ยน

ปราสาทของ grim_kingdoms เป็น jigsaw จริง (`size 7`, `mdfc 80`, ชิ้นละ 48×48)
ต่างจากของ valarian ที่เป็นก้อนเดียว จึงขยาย/ผสมชิ้นได้ และรองรับ `spawn_overrides` ได้เต็ม

### 5.1 กลไกการใส่คน

`config/mca.json` ตั้ง `overwriteOriginalVillagers = true` และ
`allowedSpawnReasons = ['natural', 'structure']`
→ **วิลเลเจอร์วานิลลาที่เกิดจาก `spawn_overrides` ของ structure จะกลายเป็น MCA villager ทันที**
และจะได้ชุดยามตาม `guardEquipment` ที่ตั้งไว้ (ซึ่งเป็นของ valarian_conquest อยู่แล้ว)
โดย `guardSpawnFraction = 0.15`

```jsonc
// ใส่ในไฟล์ structure ของปราสาทที่ "มีคนอยู่"
"spawn_overrides": {
  "creature": {
    "bounding_box": "full",
    "spawns": [
      { "type": "minecraft:villager",                  "weight": 6, "minCount": 2, "maxCount": 4 },
      { "type": "valarian_conquest:male_citizen",      "weight": 3, "minCount": 1, "maxCount": 2 },
      { "type": "valarian_conquest:female_citizen",    "weight": 3, "minCount": 1, "maxCount": 2 }
    ]
  },
  "monster": { "bounding_box": "full", "spawns": [] }
}
```

ทหารประจำปราสาท (`valarian_conquest:soldier`, `archer`, `crossbowman`) ใส่เพิ่มได้
แต่ต้องดูก่อนว่ามอดลงทะเบียนไว้ในหมวด `creature` หรือ `monster` — **ตรวจในเกมด้วย
`/summon` แล้วดู log หมวดสปอว์น ก่อนใส่ลงไฟล์** ใส่ผิดหมวดแล้วมันจะไม่เกิดเลย

`"monster": { "spawns": [] }` เป็นตัวสำคัญ: มันปิดการเกิดม็อบศัตรูในกล่องของ structure
ปราสาทที่มีคนอยู่จึงไม่มีซอมบี้โผล่กลางลานในคืนแรก

### 5.2 การแบ่งสองกลุ่ม

| กลุ่ม | โครงสร้าง | เป็นโหนดถนน | spawn |
|---|---|---|---|
| **ปราสาทมีคนอยู่** | `glacierfall_keep`, `whitewarden_keep`, `grain_sack_keep`, `grain_sack_fort`, `chill_hallmanor`, `chillhall_plains_refuge`, `silentgale_citadel`, `winterhold_citadel`, `glimmervault_fortress`, `frostbloom_bastion`, `shardspire_castle`, `zweiberg`, `travelers_lodge`, `long_pine_cabin` | ไม่ (แต่ถนนวิ่งผ่านได้) | MCA + valarian citizen + ยาม |
| **ปราสาทดันเจี้ยน** | `snowgrave_citadel`, `decrown_monolith`, `decrown_monolith_taiga`, `weathered_colosseum`, `meadow_ruin`, `meadow_flower_ruin`, `eldermoor`, `frozen_onion_fort` | **ไม่เด็ดขาด** | monster เต็ม, ไม่มี villager |
| **หอคอย/ค่าย** | `*_spur_tower`, `tor_tower`, `gnome_tall_tower`, `blackridge_watch`, `river_bend_watch`, `sandfell_outpost`, `stonyfell_outpost` | ไม่ | ตามเดิม |

ทั้งสามกลุ่มออกจาก `#minecraft:village` และ `#kingdoms:road_nodes` ทั้งหมด
กลุ่มดันเจี้ยนย้ายไป `kingdoms:undercroft` ที่มี `exclusion_zone` ห่างจากนครหลวง 20 chunk
— ดันเจี้ยนไม่ควรอยู่ข้างประตูเมืองหลวง

---

## 6. ไฟล์ที่ต้องแก้ และลำดับงาน

### R0 — หยุดเลือดก่อน (แก้สองไฟล์ เห็นผลทันที)

1. `kingdoms/tags/worldgen/structure/road_nodes.json` → `"replace": true` + สามแท็กตามข้อ 3.1
2. `config/roadweaver/roadweaver.json` → `planningAlgorithm: "SNAP_BRANCH"`

ตรวจ: สร้างโลกใหม่ · pre-gen รัศมี 2,000 บล็อกด้วย Chunky · เปิดแผนที่ Xaero
ถนนต้องเป็นสายยาวไม่กี่สาย ไม่ใช่ตาข่าย

### R1 — คืนความหมายให้ขนาด

3. 66 ไฟล์ใน `ctov/worldgen/structure/{large,medium,small}/` → size 6/5/4, mdfc 80/72/64
4. `minecraft/worldgen/structure_set/villages.json` → เหลือแค่วานิลลา + natures_spirit
5. สร้าง `kingdoms:towns` / `kingdoms:villages` / `kingdoms:hamlets` ตามตาราง 3.3
6. `kingdoms/lithostitched/worldgen_modifier/unbundle_ctov_villages.json`

ตรวจ: Explorer's Compass หาแต่ละชั้น ระยะที่วัดได้ต้องตรงกับ spacing ในตาราง

### R2 — เปลี่ยนชื่อตามขนาด

7. structure ใหม่ในเนมสเปซ `kingdoms:` ตามตาราง 2.2 + `remove_structure_set_entries` ของเดิม
8. `kingdoms:ward_*` → `kingdoms:city_*`, `tags/.../town.json` → `city.json`
9. แยก `fiefs.json` เป็น `citadels` / `castles` / `manors` / `watch` ตามขนาดจริง

### R3 — เมืองหลวง

10. สร้าง nbt แกนปราสาท (ทาง A) หรือ `kingdoms:satellite` placement (ทาง B)
11. `kingdoms:capital_*` ใช้ start pool ใหม่

ตรวจ: ยืนกลางเมืองหลวง เปิด MCA Blueprint ต้องเห็นอาคารของทั้งกลุ่มอยู่ในหมู่บ้านเดียว

### R4 — ประชากรในปราสาท Grim

12. `spawn_overrides` ตามข้อ 5.1 ใส่ 14 ไฟล์ของกลุ่ม "มีคนอยู่"
13. กลุ่มดันเจี้ยนย้ายเข้า `kingdoms:undercroft` และออกจากทุกแท็กหมู่บ้าน

ตรวจ: เดินเข้าปราสาทกลุ่มแรกตอนกลางวัน ต้องเจอ MCA villager · กลุ่มที่สองต้องไม่มี

---

## 7. สิ่งที่ยังต้องยืนยันในเกม

1. ลำดับเฟสระหว่างมิกซ์อินของ CTOV กับ `remove_structure_set_entries` ของ lithostitched (ข้อ 3.4)
2. หมวดสปอว์น (`creature` / `monster`) ของ `valarian_conquest:soldier`, `archer`, `crossbowman` (ข้อ 5.1)
3. ชื่อ `name` / `target` ของ jigsaw block ในชิ้นถนนของ CTOV แต่ละไบโอม — ต้องตรงกัน
   ไม่งั้นปราสาทแกนกลางจะต่อหมู่บ้านไม่ติด (ข้อ 4.3 ทาง A)
4. ค่า TPS หลัง pre-gen เมื่อนครหลวงมีอาคารของ 4–6 structure รวมกันในกราฟ POI เดียว
