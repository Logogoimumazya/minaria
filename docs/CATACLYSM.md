# Cataclysm เป็นแกนของบรรพกาล — วิเคราะห์ม้อด ม้อดเสริม สเกล และการบ้าน

เขียน 2026-09-26 · อ้างอิง [`MINARIA_BIBLE.md`](MINARIA_BIBLE.md) หัวข้อ 5, 7, 9 · [`BALANCE.md`](BALANCE.md) · [`MOD_SHORTLIST.md`](MOD_SHORTLIST.md)
ข้อเท็จจริงเรื่องม้อดทุกข้อในนี้ตรวจจาก jar (L_Ender's Cataclysm 3.31 ที่ติดตั้งอยู่ และ jar ของม้อดเสริมที่โหลดมาเปิดดู
ใน scratchpad) ข้อที่ยังไม่ได้ลองในเกมเขียนว่า "ยังไม่ได้ทดสอบ" ไว้ทุกที่

## 1. สรุป

1. **Cataclysm 3.31 ติดตั้งอยู่แล้ว** (ชุด 2 ของ MOD_SHORTLIST) มีบอสใหญ่ 8 ตัว มินิบอส 8 ตัว ดันเจี้ยน 8 แห่ง
   และกลไกที่ bible ต้องการอยู่แล้ว คือฆ่าบอสแล้วโลกเปลี่ยน จึงเหมาะเป็นแกนของบรรพกาลมากกว่าบอส Terraria
2. **ค่าที่ตั้งไว้ตอนนี้ทำให้บอส Cataclysm สู้แทบไม่ได้** (บั๊กของเรา ข้อ 3.1) บอสแต่ละตัวมีเพดานดาเมจต่อวินาที
   13–20 เมื่อคูณเลือด ×20–30 ไว้ ต้องตีอย่างน้อย **10–16 นาทีต่อตัว** ไม่ว่าอาวุธจะแรงแค่ไหน
3. **ไม่มีดันเจี้ยน Cataclysm บนทวีปเลย** เพราะ WorldPainter เขียน chunk หลังขั้นวาง structure (ปัญหาเดียวกับ G5)
   ทางแก้ที่ตรงกับ lore ที่สุดคือ Cataclysm Dimension (ข้อ 5.2)
4. ม้อดเสริมใน CurseForge (Forge 1.20.1) มี 89 ตัว **ควรใส่ 3 ตัว ใส่ได้หลังปรับ 5 ตัว รอเงื่อนไข 5 ตัว ที่เหลือไม่ควรใส่**
   (ข้อ 6) ตัวที่น่าใส่ที่สุดอย่าง Cataclysm: Spellbooks ยัง**ใช้กับ 3.31 ไม่ได้** (อ้างคลาสที่ 3.31 ลบไปแล้ว 5 คลาส)

## 2. Cataclysm 3.31 มีอะไร (ตรวจจาก jar)

### 2.1 บอส ดันเจี้ยน และที่เกิดตามปกติ

| บอส | ดันเจี้ยน | เกิดตามปกติที่ | วิธีเริ่มสู้ | มินิบอส/ลูกน้อง | ของที่ได้ |
|---|---|---|---|---|---|
| Netherite Monstrosity | Soul Forge (`soul_black_smith`) | Nether ทุกไบโอม | เจอในห้อง | Netherite Ministrosity | Monstrous Helm, Infernal Forge |
| Ignis | Burning Arena | `nether_wastes` | Altar of Fire + Burning Ashes | Ignited Revenant, Ignited Berserker | Ignitium, The Incinerator, Bulwark of the Flame |
| Ender Guardian | Ruined Citadel | End highlands/midlands | เจอในห้อง | Ender Golem, Endermaptera | Void Core, Gauntlet of Guard |
| The Harbinger | Ancient Factory | ใต้ดิน (`#forge:is_underground`, y −30) | ปลุกด้วย Nether Star | The Prowler, The Watcher | Witherite, Wither Assault Shoulder Weapon, Laser Gatling |
| Ancient Remnant | Cursed Pyramid | `desert` | ขุดทรายน่าสงสัยในพีระมิด | Koboleton, Kobolediator, Wadjet | Ancient Metal, Wrath of the Desert, Sandstorm in a Bottle |
| The Leviathan | Sunken City | deep ocean ทุกแบบ | Altar of Abyss + Abyssal Sacrifice | Deepling ทุกแบบ, Coralssus | Tidal Claws, Abyssal Egg |
| Maledictus | Frosted Prison | `snowy_plains` | Strange Key เปิด Door of Seal | Draugr, Aptrgangr, Royal/Elite Draugr | Cursium, Soul Render, The Annihilator, Cursed Bow |
| Scylla ("Storm Empress") | Acropolis (ลอยที่ y 200) | `warm_ocean` | เจอในห้อง | Clawdian, Hippocamtus, Cindaria, Urchinkin | Lacrima, Essence of the Storm → Astrape, Ceraunus |

ดันเจี้ยนเล็กอีก 6 แบบ: Amethyst Nest (lush caves), abandoned spire/temple/village (หิมะ), desert site/occupied village (ทะเลทราย)
ทุกดันเจี้ยนมี "Eye of ..." ของมันเอง (คราฟต์จาก ender eye + ของเฉพาะ) ใช้ชี้ทางแบบ ender eye

`Nameless Sorcerer (W.I.P)` มีชื่อใน jar แล้วแต่ยังเป็นงานค้างของผู้สร้างม้อด ห้ามวางแผนพึ่ง

### 2.2 กลไกที่ bible ต้องการ มีอยู่แล้วในม้อด

- **ฆ่าบอสแล้วโลกเปลี่ยน:** ข้อความใน jar เช่น "Within Nether Fortresses, Ignited Beserkers have awakend..." (หลัง Ignis)
  และ "The Abyss gazes into you, Coral Golems will now appear in the ocean..." (หลัง Leviathan) — ตรงกับ bible 5.1
  "ฆ่าบรรพกาล = ม่านบางลง ศัตรูใหม่" (ยังไม่ได้ทดสอบว่าทำงานในเซฟของเรา)
- **สายของต่อกันเป็นลำดับ:** Ignitium/Cursium เป็น smithing upgrade จาก netherite · Weapon Fusion บน Mechanical Fusion
  Anvil รวมอาวุธบอสสองตัวเป็นตัวที่แรงกว่า (Gauntlet of Bulwark = Gauntlet of Guard + Bulwark of the Flame ฯลฯ)
- **advancement ครบทุกบอสและทุกดันเจี้ยน** (`kill_*`, `find_*`) ใช้เป็นเงื่อนไขเควส FTB ได้ทันที
- **config ปรับได้เกือบทุกอย่าง** ต่างจาก Confluence: ดาเมจอาวุธทุกชิ้น, ดาเมจท่าพิเศษบางท่า, เลือด/ดาเมจบอส,
  เพดานดาเมจ, ระยะ, การฟื้นเลือด, การเกิดใหม่ (`respawner`), การพังบล็อก (`block_break_*`, `ignore_mobgriefing`)
- Better Combat ในตัวม้อดมีแค่ 10 อาวุธ (`data/cataclysm/weapon_attributes`) ที่เหลือฟันแบบ vanilla

## 3. ปัญหาที่เจอในของเดิม

### 3.1 เพดานดาเมจทำให้บอสยืดเป็นสิบนาที (บั๊ก ต้องแก้ก่อนใครได้สู้)

ตรวจจาก bytecode `IABoss_monster` และ `LLibrary_Boss_Monster`: ทุกครั้งที่โดนตี ดาเมจถูกตัดเหลือไม่เกิน `damage_cap`
แล้วเข้า "ถัง" ที่จุได้เท่า `damage_cap` ถังระบายออก `dps_cap / 20` ต่อ tick คือ **ดาเมจที่ทำได้จริงต่อเนื่องไม่เกิน
`dps_cap` ต่อวินาที** ไม่ว่าผู้เล่นตีแรงแค่ไหน

| บอส | HP ที่ตั้ง | damage_cap | dps_cap | เวลาฆ่าขั้นต่ำ (ตีเต็มเพดานตลอด) |
|---|---|---|---|---|
| Netherite Monstrosity | 12,000 | 25 | 20 | 10.0 นาที |
| Ignis | 9,000 | 20 | 14 | 10.7 นาที |
| Ender Guardian | 8,991 | 22 | 13 | 11.5 นาที |
| Leviathan | 12,000 | 20 | 15 | 13.3 นาที |
| Harbinger | 11,700 | 22 | 14 | 13.9 นาที |
| Scylla | 11,700 | 21 | 13 | 15.0 นาที |
| Ancient Remnant | 13,500 | 21 | 14 | 16.1 นาที |
| Maledictus | 12,600 | 20 | 13 | 16.2 นาที |

ตอนคูณเลือด (BALANCE ข้อ 3) เราไม่ได้ขยับเพดาน อีกผลหนึ่ง: อาวุธ hardmode ของ Confluence (36–72 ต่อที) ถูกตัดเหลือ ~20
ต่อที **อาวุธทุกชิ้นตั้งแต่ปลายองก์ I แรงเท่ากันเมื่อสู้บรรพกาล** ความก้าวหน้าของของหายไป

### 3.2 ระยะตัดดาเมจ — สายเวทและปืนเสียเปรียบ

จาก bytecode เดียวกัน: ถ้าผู้โจมตีอยู่ไกลกว่า `range_cap` (12–18 บล็อก) ดาเมจลดลงเรื่อยๆ และเป็น **0 ที่ 1.5 เท่าของระยะ**
เวท Iron's/Goety และปืน Scorched Guns ที่ยิงจากไกลจะไม่เข้าเลย ต้องตัดสินว่าจะให้สายยิงไกลสู้บรรพกาลได้จากระยะเท่าไร

### 3.3 สองสเกลชนกัน

- Confluence: ดาเมจอาวุธ **hardcode** ปรับไม่ได้ (BALANCE ข้อ 1) ต้นเกม 5–8, hardmode 36–37, ปลายเกม 60–72
- อาวุธ Cataclysm: 8–16 ต่อที (`cataclysm-common.toml`) — ของจากบอสองก์ III อ่อนกว่าดาบ hardmode ธรรมดาครึ่งหนึ่ง
- เกราะ Ignitium/Cursium เป็นขั้นต่อจาก netherite (สเกล vanilla) ยังไม่ได้เทียบกับเกราะ Confluence
- มินิบอส Cataclysm ทุกตัวยังเป็น HP ×1.0 (vanilla) — อาวุธ hardmode ตีตายในไม่กี่ที

### 3.4 ไม่มีดันเจี้ยน Cataclysm บนทวีป

เหมือนที่ GAMEPLAY ข้อ 3 เจอกับ Confluence: สแกนเซฟแล้วไม่มี structure บนทวีป ดันเจี้ยน Cataclysm จึงมีแค่ในดินแดนสะท้อน
และ Nether/End "Eye of ..." ทุกดวงจะชี้ออกนอกทวีป · Mowzie's Mobs มีปัญหาเดียวกัน

## 4. ข้อเสนอ lore บรรพกาลใหม่ (ร่าง รอผู้ใช้ตัดสิน)

แนวคิด: **บรรพกาลคือบอสใหญ่ของ Cataclysm** แต่ละตัวถือม่านไว้ชั้นหนึ่ง และเฝ้า **ห้องหลังม่าน** ของตัวเอง
(มิติเล็กที่ Cataclysm Dimension สร้างให้ ข้อ 5.2) ประตูของแต่ละห้องอยู่บนทวีปในที่ที่เนื้อเรื่องต้องการ
ฆ่าแล้วห้องนั้นยุบลงมาซ้อนกับโลก → กลไก "โลกเปลี่ยน" ของ Cataclysm เองคือหลักฐานว่าม่านบางลง
บอส Terraria ไม่ใช่เสาค้ำม่านอีกต่อไป แต่เป็นสิ่งที่ทะลักมาจากรอยรั่ว

### 4.1 บรรพกาล (หกตัว)

| บรรพกาล | ชั้นที่ถือ | ห้องหลังม่าน (มิติ) | ประตูบนทวีป (ข้อเสนอ) | องก์ | หมายเหตุ lore |
|---|---|---|---|---|---|
| Ancient Remnant | ผืนดินและความแห้ง | Pharaoh's Bane | ซากเมืองในทะเลทรายเงาฝน (−759, 1807) | I ปลาย | ตัวที่เก่าที่สุด ซากเมืองยุครุ่งโรจน์สร้างบนหลังมัน |
| Ignis | ไฟ | Inferno's Maw | ภูเขาไฟ Liria (3664, 3760) | II | อัศวินไฟ ออรัมขุดความร้อนของมันมาเดินเครื่องไอน้ำ |
| The Leviathan | ห้วงลึก | Abyssal Depths | ร่องน้ำลึกนอกฝั่ง (ต้องเลือกจุด) | III | Deepling คือคนที่ม่านกลืนไป |
| Scylla | พายุ | Sanctum Fallen | เกาะในทะเลอุ่น (ต้องเลือกจุด) | III | "จักรพรรดินีพายุ" เทพของเผ่าผู้เหลื่อมฝั่งทะเล คู่กับ Plantera ฝั่งป่า |
| Maledictus | ความตายที่ไม่ยอมตาย | Eternal Frosthold | เขาหิมะเหนือสุดของวาลาเรีย | III | **ผู้มาจากต่างโลกคนก่อน** ที่กลายเป็นกำแพง (twist 6.2 เต็มรูป Skeletron เป็นแค่เบาะแสแรก) |
| Ender Guardian | ขอบของม่าน | Bastion of the Lost | ใจกลาง The Wound | IV | ด่านสุดท้ายก่อน "อีกฝั่ง" ฆ่าแล้วทางสู่จอมปีศาจเปิด |

### 4.2 จักรกลสงคราม (สองตัว — หอจดหมายเหตุสร้างในมหาสงครามสมอ)

| จักรกล | ห้อง (มิติ) | ประตู | องก์ | ผูกกับระบบ |
|---|---|---|---|---|
| Netherite Monstrosity | Soulforge Anvil | ใต้ปล่องควัน Lutesk | I–II | เตาหลอมวิญญาณ = Malum (ศาสตร์ต้องห้ามของหอจดหมายเหตุ bible 4.9) |
| The Harbinger | Forge of Aeons | ใต้เกาะกลาง The Wound (จักรกลเจาะร่างบรรพกาล) | II | ปลุกด้วย Nether Star · ฆ่าแล้วปลดล็อก Create ขั้นสูง (G8) |

### 4.3 มินิบอส = ผู้เฝ้าประตู

Kobolediator, Wadjet, Aptrgangr, Ignited Revenant, Ender Golem, Coralssus, Clawdian, Prowler/Watcher
เป็นสัญญาของสมาคมนักล่า ("เคลียร์ประตู") ก่อนเข้าห้องของบรรพกาล ให้ผู้เล่นได้ลองท่าของธาตุนั้นก่อนเจอตัวใหญ่

### 4.4 บอส Confluence ย้ายไปอยู่ไหน

| บอส | เดิม | ใหม่ |
|---|---|---|
| Eye of Cthulhu, EoW/BoC, Queen Bee | บรรพกาลชั้นนอก | สิ่งแปลกปลอม — อวัยวะ/ลูกหลานของสิ่งที่ทะลักผ่านรอยรั่ว (องก์ 0–I) |
| Skeletron | บรรพกาลผู้คุม | คงเดิม: เบาะแสแรกของผู้มาจากต่างโลกคนก่อน |
| Wall of Flesh | กำแพงใหญ่ | **ต้องตัดสิน** — Confluence บังคับให้เป็นตัวเปิด hardmode (hardcode) เสนอ: "ผนึกเนื้อ" ที่ศาสนจักรสร้างทับรอยรั่วใหญ่ ไม่ใช่บรรพกาล |
| Plantera | บรรพกาลชั้นใน | **ต้องตัดสิน** — คงเป็นเทพป่าของเอลฟ์ (บรรพกาลตัวที่เจ็ด) หรือลดเป็นผู้เฝ้าป่า |
| Twins/Destroyer/Prime | จักรกลสงคราม | คงเดิม อยู่ชั้นเดียวกับ Monstrosity/Harbinger |
| Lunatic Cultist | มนุษย์ | คงเดิม |

## 5. สเกลใหม่

### 5.1 หลัก

แกนยังต้องเป็น Confluence เพราะมันเป็นตัวเดียวที่ปรับอาวุธไม่ได้ ที่เปลี่ยนคือ **ตั้งเป้าเป็นเวลาฆ่า** แทนการคูณเลือดลอยๆ
แล้วคำนวณค่าอื่นย้อนกลับ:

- เวลาฆ่าเป้าหมาย: องก์ I 2–4 นาที · II 4–6 · III 6–8 · IV 8–12 (บรรพกาลนานกว่าบอสทั่วไปในองก์เดียวกัน)
- `HP = DPS ของผู้เล่นในองก์นั้น × เวลาเป้าหมาย`
- `dps_cap ≈ 1.5 × DPS ขององก์นั้น` — ผู้เล่นเก่งยังเร็วขึ้นได้ แต่ของโกงจากองก์หลังไม่ข้ามเส้น (bible 9)
- `damage_cap ≈ 1.2 × ดาเมจต่อทีสูงสุดของอาวุธองก์นั้น`
- ของที่บรรพกาลดรอปต้องแรงกว่าอาวุธ Confluence ขององก์เดียวกันเล็กน้อย: ยก `attack_damage` ใน `cataclysm-common.toml`
  ประมาณ ×3–4 และท่าพิเศษผ่าน Incinerator's Try Hard (ข้อ 6.2)

ตัวอย่าง (ยังไม่ได้ทดสอบ ตัวเลขจริงรอ DPS ที่วัดได้): Ignis องก์ II ถ้าผู้เล่นทำได้ ~35 ต่อวินาทีด้วยอาวุธ hardmode ต้น
เป้า 5 นาที → HP ~10,500, dps_cap ~50, damage_cap ~45 (ตอนนี้ 14 และ 20)

### 5.2 ที่อยู่ของบรรพกาล — Cataclysm Dimension (แนะนำ)

ตรวจจาก jar 1.6.2: สร้างมิติ 8 มิติ (Pharaoh's Bane, Inferno's Maw, Abyssal Depths, Sanctum Fallen, Eternal Frosthold,
Bastion of the Lost, Forge of Aeons, Soulforge Anvil) แต่ละมิติมีดันเจี้ยนตัวจริงหนึ่งแห่งที่ (0, 0) เกิดแบบ worldgen ปกติ
(structure start ถูกบันทึก → advancement, Eye, cutscene ทำงานตามที่ม้อดออกแบบ) config: `enable_teleport_eye`,
`keep_structures_in_original_dimensions`, `reset_dimension_if_no_player` (รีเซ็ตห้องเมื่อไม่มีคน = สู้ซ้ำได้),
`disable_respawn`

ทำไมดีกว่า `/place structure` ลงทวีป: ไม่ต้องหาที่ว่างขนาดดันเจี้ยน (Sunken City, Acropolis ใหญ่มาก) บนแผนที่ที่เต็มแล้ว
บอสที่พังบล็อก (Ender Guardian พัง 15×2×15) อยู่ห่างเมือง และเรื่อง "ห้องหลังม่าน" ได้มาฟรี
**ต้องปรับ:** ปิด `enable_teleport_eye` แล้วทำประตูของเราเองบนทวีป (บล็อก/NPC + หน้าต่าง System บอกว่าข้างหลังคือใคร
ตามกฎ UI) · ตัดสินว่าจะเก็บดันเจี้ยนเดิมในดินแดนสะท้อนไว้ด้วยไหม · ตั้ง Distant Horizons ในมิติใหม่

## 6. ม้อดเสริม 89 ตัว — คัดทีละกลุ่ม

เงื่อนไขที่ใช้คัด: เข้ากับ lore, ไม่ชนกับ Better Combat, ไม่ลากม้อดใหญ่ที่เราไม่มีเข้ามา, ไม่ทำลายระบบที่มีแล้ว
(เมือง ธนาคาร การผูกขาดเทคโนโลยี), ทำงานกับ Cataclysm **3.31** (ตรวจว่าคลาสที่อ้างมีอยู่จริงใน jar), ยังอัปเดต

### 6.1 ใส่ได้ (ตรวจแล้ว)

| ม้อด | เวอร์ชัน | ทำไม | ต้องทำอะไรด้วย |
|---|---|---|---|
| **Cataclysm & BetterCombat – Compatibility** (rymusov) | 1.0.2 (2025-12) | มีท่าให้อาวุธ 22 ชิ้น (ในตัวม้อดมี 10) รวมถุงมือทั้งสาม, Soul Render, Annihilator, Immolator, Meat Shredder, Khopesh, Black Steel, Ancient Spear · เขียนทับไฟล์เดิมใน `data/cataclysm/weapon_attributes` | ตรวจระยะโจมตีหลังยกดาเมจ · **ไม่ใส่** Cataclysmic Combat (2024-11 เก่ากว่าอาวุธครึ่งหนึ่ง และจะซ้อนกัน) |
| **Goety Cataclysm** | 1.20-1.9.1 (2026-08) | คนทำคือผู้สร้าง Goety เอง · คลาส Cataclysm ที่อ้าง 136 ตัวมีครบใน 3.31 · ใช้ม้อดที่มีแล้วทั้งหมด (Goety, Curios, Patchouli, LionfishAPI) · เวทจากพลังบรรพกาล = เวทของลัทธิ (bible 4.9) | บาลานซ์เวทใหม่หลังตั้งเพดานใหม่ |
| **Mowzie's Cataclysm** | 1.2.1 (2026-09) | เพิ่ม Eye 4 ดวงให้บอส Mowzie (Wrought, Sunbird, Frost, Sculptor) ใช้ระบบเดียวกับ Cataclysm ขนาด 29 KB | Eye ชี้ structure ตามธรรมชาติ = นอกทวีป ใช้ได้เมื่อยอมให้บอส Mowzie อยู่ในดินแดนสะท้อน |

### 6.2 ใส่ได้เมื่อปรับแล้ว

| ม้อด | เวอร์ชัน | ได้อะไร | ต้องปรับ / ความเสี่ยง |
|---|---|---|---|
| **Cataclysm Dimension** (P1nero) | 1.6.2 | ห้องหลังม่าน (ข้อ 5.2) | ปิดทาง Eye ใช้ประตูของเรา · ทดสอบรีเซ็ตมิติ · DH |
| **Cinematic Cataclysm** + FDLib | 1.0.1 | ฉากเปิดตัวก่อนสู้ Scylla, Maledictus, Leviathan, Remnant, Ignis — ให้บรรพกาลรู้สึกเป็นตำนาน | ออกก่อน 3.31 (คลาสที่อ้างมีครบ แต่ผู้ทำเตือนว่าพึ่งโค้ดภายใน **ต้องลองในเกม**) · ต้องใส่ 5 entity ลง whitelist ของ EntityCulling · ใช้ได้เฉพาะในดันเจี้ยนของ Cataclysm |
| **GTBC's Cataclysmic Boss UI** | 1.0.3 | หน้าจอข้อมูลบอสก่อนสู้ (lore ท่า คำแนะนำ ของรางวัล) — ตรงกับกฎ "ทุกระบบมีหน้าต่าง System" | สไตล์ของมันเองไม่ตรง DESIGN 1b · ข้อความ lore เป็นของ Cataclysm (สัญญาอนุญาตให้แก้ lang ได้ → เขียนเป็น lore ของ Minaria) · ช่องของรางวัลโชว์ loot เดิม จะผิดเมื่อเราแก้ loot · ทางเลือก: ทำ "Ancient Codex" เองใน `minaria_court` |
| **Incinerator's Try Hard** | 1.0.6 | ปรับดาเมจท่าพิเศษของ Incinerator, Immolator, Tidal Claws, Gauntlet of Bulwark, Bloom Stone Pauldrons ที่ config หลักปรับไม่ได้ | ใส่ก็ต่อเมื่อยกสเกลอาวุธ (ข้อ 5.1) ไม่งั้นไม่มีประโยชน์ |
| **L_Ender's Cataclysm Delight** | 1.0.10b | อาหารจากมอนและบอส 50+ อย่าง เข้ากับ Farmer's Delight ที่มี | มี "ระบบค่าสถานะถาวรจากการกิน" = พลังที่ไม่มีราคา ต้องดู config ว่าจำกัดได้ไหมก่อน |

### 6.3 รอเงื่อนไข — อย่าเพิ่งใส่

| ม้อด | ติดอะไร |
|---|---|
| **Cataclysm: Spellbooks** 1.2.9 | เข้ากับ lore มาก (สำนักเวทใหม่ Abyssal กับ Technomancy, 65 เวท) แต่ **อ้างคลาส 5 ตัวที่ 3.31 ลบไปแล้ว** (`RingParticle$RingData`, `LightTrailParticle$OrbData`, `StormParticle$OrbData`, `TrackLightningParticle$OrbData`, `Ancient_Remnant_Rework_Renderer`) → crash ตอนร่ายบางเวท/ใส่เกราะบางชุด รอเวอร์ชันที่รองรับ 3.31 (ต้องใช้ AzureLib เพิ่ม) |
| **Integrated Cataclysm** | ดันเจี้ยนละเอียดขึ้นมาก ตรงกับมาตรฐาน KL แต่ **บังคับ Quark** (ไม่มีในแพ็ก ม้อดใหญ่) และแก้สูตรของ Cataclysm ให้ใช้ Create · ใช้กับ Cataclysm Dimension ต้องมีแพตช์อีกตัว (ออก 2026-09 ยอด 924) · ดูใหม่หลังตัดสินข้อ 5.2 |
| **T.O Magic 'n Extras** | อัปเดตล่าสุด 2026-01 และมีม้อดแยกอย่างน้อยสามตัวที่ทำมาแก้ crash ระหว่างมันกับ Cataclysm 3.31 = สัญญาณว่าพัง |
| **Armory of Remnants**, **Somake Spells** | ของปลายเกมสาย Iron's + Cataclysm · ดูหลังตั้งสเกลใหม่ ไม่งั้นพลังพุ่งข้ามองก์ |
| **Eternal Hunts** | ต้องมี Born in Chaos (อยู่ในรายชื่อคัดของเรา ข้อ C) · เวอร์ชัน 0.1.0 ยอด 7.8K ยังใหม่มาก |

### 6.4 ไม่ใส่

| กลุ่ม | ม้อด | เหตุผล |
|---|---|---|
| ต้องใช้ Epic Fight | WoC: Remastered, P1nero's Epic X Cataclysm, Epic Fight & L Ender's Cataclysm, Merlin's Epic Boss (+MEB patch), Cataclysmic Arsenal, Cataclysm epicfight stun compat, Epic Fight Compat Suite | ชนกับ Better Combat (ตัดสินแล้วใน MOD_SHORTLIST F) — ถ้าจะเปลี่ยนระบบต่อสู้ทั้งแพ็กเป็นอีกเรื่องใหญ่ |
| ลากม้อดใหญ่ที่ไม่มีเข้ามา | Lightning & Cataclysm (Ice and Fire), Cataclysm x YUNG's, Deeper and Darker ×3, Cataclysm's Rise (Bosses' Rise), Simply Swords/Spartan Weaponry: Cataclysm, Tinkers' Cataclysm, TIC of Cataclysm, Apotheosis ×5, EMC/ProjectE ×2, PMMO, Cataclysmic Origins, EC (Expanded Combat), Graves, BetterArcheology, FallingTree, Croparium, Black Gold Alliance, hot iron, Aspects (Dawn of the Spell), Daily Boss x | ใส่ addon ไม่ใช่เหตุผลพอจะลากทั้งม้อดเข้ามา |
| ทำลายระบบหรือ lore | Create: Cataclysm | คราฟต์ creative motor และ creative blaze cake ได้ → พลังงานไม่จำกัด ทำลายการผูกขาดเทคโนโลยีของหอจดหมายเหตุ (G8) |
| | Cataclysm Summons, boss locator X, SMS Spirit Mediumship, Amethyst crab summon ×2 | เรียกบอส/หาพิกัดได้ง่าย ข้ามประตูและเควส · Cataclysm มี `respawner` ในตัวแล้ว |
| | Loot Integrations (Cataclysm / IDAS) | ยัด "ของม้อด" ลงหีบอัตโนมัติโดยไม่รู้เรื่ององก์ → ของ hardmode หลุดมาต้นเกม เราเขียน loot table เอง |
| | Natural Disasters: Cataclysm | ภัยพิบัติทำลายพื้นที่ = ทำลายเมืองที่สร้างด้วยมือ |
| คุณภาพ/ซ้ำซ้อน | Cataclysm Weaponery (2024), Cataclysm Tools, Aslan's Cataclysm (2024), Cataclysm Reinforcement, Cataclysm Curios Edited, Cataclysm Extra Building Blocks, SGI-Cataclysm, Cataclysm Primed Soul (WIP), Behemoths Cataclysm, Cataclysm - Ametyst crab temple | ชุดเครื่องมือทั่วไปที่เจือจางเทียร์ · สิ่งที่ config หรือตัวม้อดทำอยู่แล้ว · ยอดต่ำมาก/ยังเป็นงานค้าง · structure ธรรมชาติที่ไม่ช่วยบนทวีป |
| แค่ชื่อพ้อง / MCreator / ของแพ็กอื่น | Xenos Cataclysm (ผู้ทำเลิกเองและขอให้ไม่โหลด), Avzerixs cataclysms ("not balanced at all"), Cataclysms และ Darkness and Cataclysms (TheOman), Cataclysmic Creepers, Cataclysmcraft, Cataclysmic, Cataclysm Era, Originfall, Edge Of Realities, Shadow Cataclysm, Cataclysm Awaits, CPTTE, Dimension: Corrosion Crystal, fix ของ T.O Magic ×4 | ไม่เกี่ยวกับ L_Ender's Cataclysm หรือเป็นแกนของแพ็กคนอื่น |

## 7. การบ้าน — ของเดิมที่ต้องตรวจหรือยังขาด

เรียงตามว่าอะไรต้องทำก่อน

| # | งาน | อยู่ที่ | ทำไม |
|---|---|---|---|
| H1 | **แก้เพดานดาเมจ** ตามสเกลใหม่ (5.1) | `config/cataclysm-common.toml` `cap_config` | ข้อ 3.1 — ตอนนี้ขั้นต่ำ 10–16 นาทีต่อตัว |
| H2 | วัด **เลือดผู้เล่นตามองก์** และ **DPS จริง** ของอาวุธ Confluence แต่ละขั้น | `balance_test.js` | ค้างมาจาก BALANCE ข้อ 5 · สูตร 5.1 ต้องใช้ |
| H3 | ตั้ง `range_cap` ใหม่ให้สายเวท/ปืน | toml | ข้อ 3.2 |
| H4 | ยกอาวุธ/เกราะ Cataclysm เข้าเทียร์องก์ · สเกล HP มินิบอส | toml + `boss_scaling.js` | ข้อ 3.3 |
| H5 | วัดบอสที่ยังไม่เคยวัด (Harbinger, Remnant, Scylla ไม่เข้าตีในสนามทดสอบ) ในดันเจี้ยนจริง | BALANCE ข้อ 5 | ตัวเลขดาเมจของบอสยังไม่ครบ |
| H6 | เลือกที่อยู่บรรพกาล (5.2) แล้วลองใน "Minaria W3 test": มิติ, ประตู, Eye, advancement `find_*`, cutscene | เซฟทดสอบ | ข้อ 3.4 · ยังไม่รู้ว่า `/place structure` บันทึก structure start ไหม (ถ้าไม่ `/locate`, Eye, advancement จะไม่เห็น) |
| H7 | **ทางไป Nether/End** บนทวีป: Eye ต้องใช้ blaze powder, netherite scrap, shulker shell, ender eye | worldgen / เควส | ทวีปไม่มี stronghold (WorldPainter) — ยังไม่รู้ว่าผู้เล่นไป End ได้อย่างไร |
| H8 | ย้ายที่บอสใน bible 5.4 ที่ชนกัน: ภูเขาไฟ Liria (Queen Bee → Ignis), ทะเลทรายเงาฝน (Crimson + Remnant), เขาหิมะเหนือ (Deerclops + Maledictus) | bible 5.4 | หนึ่งที่ต่อหนึ่งเรื่อง |
| H9 | อัปเดต `minaria_factions.js`: ประเภทบอสตาม lore ใหม่, ชื่อเสียงเมื่อฆ่าบอส Cataclysm (ตอนนี้มีแค่ของ Confluence), เพิ่มมินิบอส | KubeJS | ฆ่าบรรพกาลต้องขยับศาสนจักร/เอลฟ์ |
| H10 | loot table ของบอสและหีบ Cataclysm ตามองก์ · ใส่เหรียญ Confluence | datapack | ของต้องไม่ข้ามองก์ (bible 9) |
| H11 | บทเควส FTB ของบรรพกาล ใช้ advancement `kill_*`/`find_*` | `build_minaria_quests.py` | องก์ I–IV ยังไม่มีบอส Cataclysm เลย |
| H12 | หน้าต่าง System: ประตูห้องหลังม่าน + "Ancient Codex" (หรือ GTBC ที่แก้ lang) | `minaria_court` | กฎ UI ของโปรเจกต์ |
| H13 | ตรวจว่ากลไก "ฆ่าแล้วโลกเปลี่ยน" ของ Cataclysm ทำงานในเซฟเรา และผูกกับ "ม่านบาง" | เซฟทดสอบ | เป็นหลักฐานในเกมของ lore ข้อ 4 |
| H14 | ประสิทธิภาพ: DH ในมิติใหม่ 8 มิติ, particle ของบอส | PERFORMANCE | เกมค้างตอนสร้าง chunk มีอยู่แล้ว (BALANCE ข้อ 5) |
| H15 | แก้ bible ข้อ 5, 7, 8, 10 · GAMEPLAY ข้อ 3, 5 · BALANCE ข้อ 3 · MOD_SHORTLIST ให้ตรงกับที่ตัดสิน | docs | หลังผู้ใช้ตอบข้อ 8 |

## 8. ต้องให้ผู้ใช้ตัดสิน

> **ตัดสินแล้ว 2026-09-26** ([`BLUEPRINT.md`](BLUEPRINT.md) ข้อ 1, 6, 7): ข้อ 1 รับ · ข้อ 2 WoF = ผนึกเนื้อ, Plantera = บรรพกาลตัวที่เจ็ด ·
> ข้อ 3 ห้องหลังม่าน ประตูอยู่ปลายทิศในดินแดนสะท้อน (8 ทิศ 8 ห้อง) · ข้อ 4 สั้นลงตามเทียร์ bullet hell · ข้อ 5 ยังเปิด

1. รับรายชื่อบรรพกาลข้อ 4.1–4.2 ไหม (Cataclysm เป็นบรรพกาล บอส Terraria ลดลงเป็นสิ่งแปลกปลอม)
2. Wall of Flesh และ Plantera เป็นอะไรในเรื่องใหม่ (ข้อ 4.4)
3. บรรพกาลอยู่ในห้องหลังม่าน (Cataclysm Dimension, แนะนำ) หรือวางลงทวีปตรงๆ หรือทั้งสองแบบ
4. เวลาฆ่าเป้าหมายต่อองก์ (ข้อ 5.1) ยาว/สั้นกว่านี้ไหม
5. หน้าจอข้อมูลบอส: ใช้ GTBC แล้วแก้ข้อความ หรือทำของเราเองในสไตล์เดียวกับ Realm Ledger
