# Epic Fight ใน Minaria — สเปกจากการสัมภาษณ์ 2026-09-27

ผู้ใช้ขอ: ใช้ Epic Fight (EF) เป็นระบบต่อสู้ **ท่าทางปกติยังเป็น FA+Player / Fresh Animations** พอต่อสู้จึงเป็นท่า EF
ทั้งกับผู้เล่นและกับ mob/NPC ทุกตัวที่ถืออาวุธ · ทดสอบในโปรไฟล์แยกที่มีเฉพาะม้อดที่ต้องใช้ เพื่อไม่ให้แลค
งานนี้เป็นข้อยกเว้นของ "หยุดทำระบบใหม่" ใน [`PLAN.md`](PLAN.md) เพราะผู้ใช้สั่งตรง และเป็นการตรวจเนื้อหาของเฟส 1

## 1. คำตอบของผู้ใช้ (ห้ามถามซ้ำ)

| เรื่อง | ตัดสิน |
|---|---|
| ชุด Better Combat (Better Combat, Better Mob Combat, Mob Player Animator, `mob_combat_sync`, emf_compat_better_combat) | **ถอดทั้งชุดในโปรไฟล์ทดสอบ ใช้ EF อย่างเดียว** · โปรไฟล์ Minaria เดิมเก็บชุดเดิมไว้เป็นสำรอง |
| ความครอบคลุม | **ละเอียดทุกม้อด:** อาวุธ เครื่องมือ บอส และ entity ทุกตัวในทุกม้อดต้องถูกตรวจ |
| ผู้เล่นสลับโหมด | **อัตโนมัติ** เข้าโหมด Battle เมื่อมีศัตรูเล็งหรือโดนตีหรือเราโจมตี กลับเป็นท่าปกติหลังพ้นการต่อสู้ |
| mob ตอนปกติ | **ท่า FA ตอนไม่มีเป้า ท่า EF ตอนมีเป้า** |
| รอยต่อท่า FA ↔ EF | **ต้องเนียน มีช่วงเปลี่ยนท่า** ห้ามกระตุก |
| entity รอบแรก | ทหารและพลธนู Valarian · ชาวบ้านและยาม MCA · มอน vanilla ถืออาวุธ · มอนของม้อด (Confluence, Iron's, Cataclysm, ...) |
| อาวุธที่ไม่ใช่การเหวี่ยง (โยโย่ บูมเมอแรง แส้ คทา คัมภีร์ ธนู ปืน) | **ตัดสินทีละชิ้นจากหน้ารวม** |
| ระบบ EF ที่เปิด | **หลบ/กลิ้ง · ป้องกันและปัด · ท่าพิเศษประจำอาวุธ** · ไม่เปิดสกิลทรีและสกิลบุ๊ก |
| ได้สกิลมายังไง | **มีตั้งแต่เริ่ม** (หลบ ป้องกัน ปัด) |
| บอส | **ไม่เซ ยกเว้นโดนปัดสำเร็จ** |
| addon ของ EF | **ผมคัดตามม้อดที่มีในแพ็ก แล้วเสนอเป็นหน้าเดียว** ให้ผู้ใช้กดเลือก |
| ทหาร Valarian | **แยกสไตล์การต่อสู้ต่อรัฐ** |
| โปรไฟล์ | **มีเฉพาะม้อดที่มีอาวุธ เครื่องมือ mob หรือบอส พร้อมไลบรารีที่ต้องใช้** ตัดม้อดสร้างโลก structure Distant Horizons Create ของตกแต่ง · **ผมคัดลอกโฟลเดอร์ให้** |
| โลกทดสอบ | **โลกแบนใหม่ + ลานสู้** |
| กล้อง | **กล้อง TPS ของ EF** ถอด Shoulder Surfing ในโปรไฟล์ทดสอบ |
| เกณฑ์ผ่าน | **ผมตรวจด้วยภาพและการทดสอบอัตโนมัติจนเป็นศูนย์ แล้วผู้ใช้เล่นลอง ผู้ใช้รับแล้วค่อยย้ายเข้าโปรไฟล์ Minaria** |

## 2. ข้อเท็จจริงจาก jar (EF 20.14.17, อ่าน 2026-09-27)

- ผู้ใช้ใส่ `epic-fight-20.14.17` และ `epictweaks-1.1.1` ไว้ในโปรไฟล์ Minaria เมื่อ 2026-09-27 20:51 แต่ยังไม่เคยเปิดเกมกับมัน (ยังไม่มี config)
- **ผู้เล่น:** มีโหมด Mining/Battle + ตัวเลือก client "Player Vanilla Model: ON" (ในโหมด Mining ใช้โมเดลปกติ → FA+Player ทำงานได้)
  · gamerule `initialMode`, `canSwitchPlayerMode`, `keepSkills`, `stiffComboAttacks`, `globalStun`, `noMobsInBossfight` · มี `PlayerModeCommand`
- **สกิล:** ให้ด้วย `/epicfight skill add` · dodge = `roll`/`step` · guard = `guard`/`parrying` (การ์ดใช้ stamina ของ EF เอง
  แถบ stamina จึงยังมีอยู่ แม้ไม่เปิดสกิลทรี)
- **บอส:** มีเอฟเฟกต์ `stun_immunity` และ attribute `stun_armor` → ทำให้บอสไม่เซได้ด้วยข้อมูล ส่วนข้อยกเว้นเรื่องปัดต้องเขียนโค้ด
- **ข้อมูลอาวุธและ mob:** EF อ่าน `data/<ns>/capabilities/` (มีของ vanilla 60 ไฟล์ ของ EF 53 ไฟล์) → อาวุธและ mob ของม้อดอื่นเพิ่มได้ด้วย datapack
- **mob ต่างจากผู้เล่น:** EF วาดโมเดลของตัวเองให้ mob ที่ถูก patch ตลอดเวลา การสลับไปใช้ FA ตอนไม่มีเป้าต้องเขียนเพิ่ม (ข้อ 3.4)

## 2b. สถานะโปรไฟล์ทดสอบ (2026-09-27)

- `Instances/Minaria EF Test` สร้างครบด้วยคำสั่งเดียว `dev/combat/make_profile.py --apply` (ม้อด resource pack config ค่า EF
  console และโลก EF Arena) · 226 ม้อด: แพ็กหลักทั้งหมดยกเว้นสิ่งที่ไม่เกี่ยวกับการต่อสู้หรือหน้าตา (สร้างโลก structure ต้นไม้ ใบไม้
  หญ้า ท้องฟ้า เมฆ ฝน ที่เก็บของ Create Distant Horizons) ยกเว้นชุด Better Combat และ Shoulder Surfing + 46 ม้อดจาก Nightfall
  · resource pack ครบตามแพ็กหลัก 26 ชุด + ของ Nightfall 8 ชุด (Mandala อยู่ในรายการ incompatible แบบเดียวกับ Nightfall)
  · config ของม้อดที่ยกมาจาก Nightfall ใช้ค่าของ Nightfall เป็นจุดตั้งต้นในการประเมิน (ห้ามใช้ในแพ็กที่แจก)
  · มี Connector เพื่อให้ม้อด Fabric ด้านหน้าตาของแพ็กหลักทำงานเหมือนเกมจริง (ไม่ใช่เพื่อแก้ registry แล้ว)
  · เข้าโลกได้ใน ~2 นาที (116 วินาทีถึงเมนู) · ได้สกิล roll และ parrying ตอนเข้าโลก · gamerule ของ EF อยู่ใน level.dat
- **กับดัก:** ถ้าเปิดเกมแล้วม้อดพังกลางทาง เกมจะตัด pack ที่มากับม้อด (Terraria ของ Confluence, punchy, Moonlight ฯลฯ) ออกจาก
  `options.txt` ทันที → หลังแก้แล้วรัน `make_profile.py --packs` ก่อนเปิดใหม่ · ม้อดที่พึ่งกันแบบไม่ประกาศ (effectual → tlib)
  สแกนหาไม่เจอ ต้องดูจาก "Failed to create mod instance" ใน log
- EF ในโปรไฟล์ Minaria ปิดเป็น `.disabled` · tag git `pre-epicfight` = ก่อนเริ่มงานนี้
- **แก้แล้วที่ต้นเหตุ (compat ใน `minaria_perf`, `PortlibRegistryAccessMixin`):** ตอนโหลด config EF เรียก `getDefaultInstance()`
  ของทุกไอเทม → gel ของ Confluence เขียน NBT ผ่าน portlib → `PortEnvironment.registryAccess()` ยังไม่มีโลกจึงสร้าง
  `ClientRegistryLayer.createRegistryAccess()` ซึ่ง `freeze()` registry ตัวจริงของเกม → yungsapi, cataclysm, curios, epicfight
  ลงทะเบียนใน common setup ไม่ได้ ("Registry is already frozen") · ตอนนี้ทางนั้นคืนมุมมองอ่านอย่างเดียวของ registry เดิมแทน ไม่ freeze
  · พิสูจน์ด้วย probe mixin บน `MappedRegistry.freeze` · โปรไฟล์ทดสอบโหลดสะอาด **ไม่ต้องมี Connector** (76 วินาที)
- error "Datapack animation reading failed" 93 บรรทัดมากับ EFN (Nightfall เองก็มี 94) ไม่ใช่ของเรา

## 3. งาน

### 3.1 โปรไฟล์ `Instances/Minaria EF Test`
1. สแกน jar ทุกตัว: มีอาวุธหรือเครื่องมือไหม (คลาสที่สืบจาก `SwordItem`, `DiggerItem`, `TieredItem`, `ProjectileWeaponItem`, `TridentItem`
   หรือ item ที่มี attack damage), มี entity หรือบอสไหม, ต้องพึ่งอะไร (`mods.toml` แบบบังคับ) → `dev/combat/mod_scan.json`
2. คัด: ม้อดที่มีอาวุธ เครื่องมือ mob หรือบอส + ไลบรารีที่ต้องใช้ + EF + EMF/ETF + resource pack ของ FA
   ตัด: ชุด Better Combat, Shoulder Surfing, ม้อดสร้างโลกและ structure, Distant Horizons, Create, ของตกแต่ง, shader
3. คัดลอกโฟลเดอร์ (mods ที่คัด, config, resourcepacks ของ FA, options) → แก้ชื่อใน `minecraftinstance.json` → เปิด CurseForge ใหม่
4. **สำรอง:** โปรไฟล์ Minaria เดิมไม่ถูกแตะ ยกเว้นปิด jar ของ EF สองตัวเป็น `.disabled` จนกว่าจะรับงาน (ไม่ให้ EF ชนกับ Better Combat ในเซฟจริง)
   · เพิ่ม tag git `pre-epicfight` ก่อนเริ่ม

### 3.2 ตั้งค่า EF
- gamerule: `initialMode 0` (เริ่มโหมดปกติ), `keepSkills true`, `canSwitchPlayerMode true`
- ผู้เล่นใหม่ได้ `roll`, `guard`, `parrying` ตอนเข้าโลกครั้งแรก
- client: Player Vanilla Model ON, TPS camera, ไม่มีสกิลทรีและสกิลบุ๊กในสูตรคราฟต์และ loot

### 3.3 ตารางอาวุธ (หน้ารวมให้ผู้ใช้ตัดสินทีละชิ้น)
- item ทุกชิ้นที่เป็นอาวุธหรือเครื่องมือในโปรไฟล์ → หมวด EF ที่เสนอ (sword, longsword, greatsword, spear, axe, tachi, dagger, fist, bow, crossbow,
  "ไม่ใช่ EF: ใช้แบบเดิม") พร้อมเหตุผล
- ผู้ใช้กดเปลี่ยนในหน้า → สคริปต์เขียนเป็น datapack `capabilities`

### 3.4 โค้ด (ม้อดใหม่ `minaria_combat` เพราะไม่เข้ากับม้อดที่มีอยู่ตัวไหน)
| ส่วน | ทำอะไร |
|---|---|
| โหมดผู้เล่นอัตโนมัติ | ศัตรูเล็งเรา/เราโดนตี/เราโจมตี → Battle · พ้นการต่อสู้ N วินาที → Mining (โมเดลปกติ = FA+Player) |
| mob FA ↔ EF | ไม่มีเป้า: ปล่อยให้ vanilla/EMF วาด (ท่า FA) · มีเป้า: ให้ EF วาด · ช่วงเปลี่ยนท่า: สลับตอนท่าตรงกัน หรือเล่นท่าชักอาวุธของ EF คั่น |
| บอส | ใส่ stun immunity ให้ entity ในรายการบอส · ปัดสำเร็จยกเว้นให้เซหนึ่งครั้ง |
| ทหาร Valarian ต่อรัฐ | ชุดอาวุธต่อรัฐ + หมวดท่า EF ต่อชุด (ร่างเสนอผู้ใช้: วาลาเรียดาบโล่อัศวิน, Rzhia ขวานค้อนหนัก, ออรัมหอก, ศาสนจักรดาบยาว, ออสทรัมดาบกับหอกทหารเก่า, แดนเสรีปนกัน) |

### 3.5 mob patch
- VC ทหาร/พลธนู และ MCA ยาม/ชาวบ้าน: ตรวจ addon ที่มี (EpicFight-MCA) ก่อน ไม่มีค่อยเขียน datapack `capabilities` เอง
- มอนของม้อด: ตัว humanoid ได้ patch · GeckoLib/โมเดลพิเศษ (บอส Cataclysm ส่วนใหญ่) ไม่ใช้ท่า EF แต่ยังโดนกติกาบอส

### 3.6 ทดสอบ
- โลกแบน + ลานสู้ สร้างด้วยคำสั่ง · entity ทุกชนิดในตารางเรียงกัน
- ต่อ entity: ภาพยืน (FA) → มีเป้า (EF) → กลับ (FA) รวมเป็น grid · log จำนวนครั้งที่เปลี่ยนท่าโดยไม่มีช่วงเปลี่ยน = 0
- ต่ออาวุธ: ให้ของ → ตรวจว่า EF อ่าน capability ตามที่ผู้ใช้เลือก → ใช้ได้ไม่ error
- ภาพจากหน้าต่างเกมเท่านั้น และไม่ส่ง input ตอนผู้ใช้เล่น (memory in-game-testing-etiquette)

## 4. ลำดับ
1. สแกน jar + คัดม้อด → รายชื่อให้ผู้ใช้ดู
2. สร้างโปรไฟล์ + โลกทดสอบ + ตั้งค่า EF → เปิดเกมได้โดยไม่ crash
3. หน้ารวม addon + หน้ารวมอาวุธ (ผู้ใช้เลือกรอบเดียว)
4. `minaria_combat`: โหมดผู้เล่นอัตโนมัติ → กติกาบอส → mob FA ↔ EF → สไตล์ทหารต่อรัฐ
5. ทดสอบครบ → ผู้ใช้เล่นลอง → ย้ายเข้าโปรไฟล์ Minaria

---

## 5. รอบ 2 (2026-09-27): ผู้ใช้เล่นแล้วเจอ → วิเคราะห์ → สัมภาษณ์ → แผน

### 5.1 ผู้ใช้รายงาน
ท่าโจมตีซ้ำและน่าเบื่อ · ดาบต่างประเภทต่างขนาดได้ท่าเดียวกัน · ของหลายชิ้นใช้ไม่ได้ · projectile ของอาวุธ Confluence ไม่ออก ·
NPC/mob ไม่เข้ากัน ทหาร Valarian ไม่มีท่า เดินชนแทน · ตำแหน่งถืออาวุธผิดธรรมชาติ

### 5.2 ต้นเหตุ (อ่านจาก jar และ log)
| อาการ | ต้นเหตุ | แก้ที่ |
|---|---|---|
| ดาบทุกเล่มท่าเดียวกัน | EF อ่านท่าจาก `data/<ม้อด>/capabilities/weapons/<ไอเทม>.json` · Confluence, Valarian, Iron's, Goety, Malum, Aquamirae ไม่มีไฟล์นี้ → EF เดาจากชื่อ (`item_keyword`: `.*_sword` → sword ฯลฯ) หรือคลาส → ได้ `epicfight:sword` เกือบหมด | datapack capabilities รายชิ้น |
| ท่าที่มีให้เลือก | 76 weapon type ในโปรไฟล์ (EF 15 แบบพื้นฐาน, EFN 18, WoM 17, Epic Fight Extra 5, Falchion, Pike, P1nero×Cataclysm 12, ฯลฯ) · หลายหมวดมีแบบเดียว (ขวาน ค้อน มีด) | ตาราง + ม้อดอาวุธที่มากับท่า |
| projectile Confluence ไม่ออก | Confluence เช็กปุ่มโจมตีใน client tick (`GameClientEvents.clientTick$Post` → `SwordProjectileInputHandler.handle` → `SwordProjectilePacketC2S`) · โหมด Battle ของ EF ยึดปุ่มโจมตี Confluence จึงไม่เห็น | `minaria_combat`: ยิงตอนท่าฟันของ EF เริ่ม |
| ของหลายชิ้นใช้ไม่ได้ | ของที่เป็นคลาสดาบได้ capability ดาบ → ปุ่มขวากลายเป็นการ์ด → โยโย่ ฟเลล ปืน คทา การร่ายของ Iron's ถูกกิน | capability ที่ไม่มีการ์ดสำหรับของที่มีการใช้ |
| ทหาร Valarian เดินชน | ไม่มี EF mob patch → โจมตีแบบ vanilla ไม่มีท่า · EF อ่าน `data/<ns>/epicfight_mobpatch/<entity>.json` (model, armature, renderer, preset, humanoid_weapon_motions, combat_behavior, weapon_categories, faction, stun_armor, chasing_speed) · ไม่มีใครทำให้ Valarian/MCA | mob patch เขียนเอง |
| ตำแหน่งถือผิด | EF วาดของที่ข้อต่อ Tool_R/Tool_L · แก้รายชิ้นด้วย `assets/<ns>/item_skins/<ไอเทม>.json` (`transforms.mainhand/offhand` translation/rotation/scale + `trail`) | resource pack ของเรา |
| log | เกราะ GeckoLib ของ Confluence แปลงเป็นโมเดล EF ไม่ได้ (`HumanoidModelBaker.bakeArmor` NPE, เช่น palladium_mask) · AsyncParticles ชนอนุภาค Lodestone (Malum) และ trail ของ EF · texture เกราะหาย (Malum spirit_hunter, netherite overlay) | ข้อ 5.4 |

### 5.3 คำตอบผู้ใช้ (ห้ามถามซ้ำ)
| เรื่อง | ตัดสิน |
|---|---|
| หลักแจกท่า | **ตามรูปทรงและขนาด** (ดาบสั้น/ดาบ/ดาบยาว/ดาบใหญ่/คาตานะ/หอก/ขวาน/ค้อน/มีด ฯลฯ) ทุกชิ้นในหมวดเดียวกันไปทางเดียวกัน **+ ท่าเฉพาะให้อาวุธระดับตำนาน** |
| ระดับตำนาน | อาวุธดรอปจากบอส · อาวุธขั้นสุดท้ายที่คราฟต์ · อาวุธประจำรัฐและสำนัก · อาวุธเวทระดับสูง |
| ความสามารถ Terraria | **คงไว้ ผูกกับท่า EF** (ดาบยิงลำแสงตอนท่าฟันจริง, โยโย่ ปืน คทา ใช้ปุ่มขวาแบบเดิม) |
| ปุ่มขวา | **อาวุธประชิด = การ์ด/ปัด · ของที่มีการใช้ = ใช้ของ** · โล่การ์ดเสมอ |
| ม้อดท่าเพิ่ม | **หาเลยตอนนี้** และ **รับม้อดอาวุธที่มาพร้อมท่าได้** (ต้องผูกรัฐและองค์ตามเฟส 1 ของ PLAN) |
| NPC/mob | อาการหลักที่เห็น: **ไม่มีท่าโจมตี เดินชนแทน** · ให้ท่าเหมือนผู้เล่นตามอาวุธที่ถือ |
| MCA | **เขียน mob patch เองทั้งหมด** (ไม่ใช้ addon) |
| ตำแหน่งถือ | **ผมถ่ายภาพทุกชิ้นอัตโนมัติ แก้เองจนดูดี แล้วส่งภาพรวมให้ตรวจรอบเดียว** |
| AsyncParticles | **กันอนุภาคที่ชนออกจาก Async ก่อน ไม่ได้ค่อยถอด** |
| ลำดับ | **บั๊กก่อน → ท่า → ตำแหน่งถือ** |

### 5.4 แผน
**ขั้น 0 — รายการอาวุธทั้งหมด (เครื่องทำ):** สคริปต์ KubeJS ฝั่ง server ไล่ทุกไอเทมในเกม → id, คลาส, มีการใช้ปุ่มขวาไหม (use duration/animation),
ดาเมจ ความเร็ว ระยะ, capability ที่ EF ให้ตอนนี้ → `dev/combat/weapons.json` · เป็นฐานของทุกขั้นถัดไปและของหน้ารวม

**ขั้น 1 — บั๊ก**
1. ปุ่มขวา: ของที่มีการใช้ (ใช้ `getUseDuration > 0` หรือมี use action) → capability ที่ไม่มีการ์ด หรือไม่ให้ EF จับเลย · อาวุธประชิดคงการ์ด
2. projectile Confluence: `minaria_combat` ฟังจังหวะท่าฟันของ EF ฝั่ง server แล้วเรียกตรรกะเดียวกับ `SwordProjectilePacketC2S` (ไม่ต้องให้ client กดปุ่ม)
3. mob patch ทหาร/พลธนู Valarian และชาวบ้าน/ยาม MCA: preset humanoid + ท่าตามหมวดอาวุธชุดเดียวกับผู้เล่น · แก้เรื่องชั้นเสื้อผ้า MCA (renderer)
4. เกราะ GeckoLib ของ Confluence บนโมเดล EF · AsyncParticles กันอนุภาค Lodestone และ trail ของ EF · texture เกราะที่หาย
5. ทดสอบ: ลานสู้ + `/court combat` แบบคู่ · ภาพต่อคู่ · ตัวเลขโดน/ท่าที่วาด

**ขั้น 2 — ท่า**
1. ตารางหมวดอาวุธ × ท่าที่มี → หมวดไหนขาด
2. หาม้อดท่าและม้อดอาวุธที่มาพร้อมท่า (Forge 1.20.1, EF 20.14) อ่าน jar ก่อนเสนอ → หน้ารวมให้ผู้ใช้เลือก
3. แจก capability ทุกชิ้นตามรูปทรงและขนาด (สคริปต์จาก weapons.json) + ท่าเฉพาะอาวุธระดับตำนาน → datapack ของเรา
4. ทหาร Valarian ต่อรัฐใช้ชุดท่าเดียวกัน (EPIC_FIGHT 3.4)

**ขั้น 3 — ตำแหน่งถือและแสงตามดาบ**
หุ่นถืออาวุธทีละชิ้นในลานทดสอบ → ถ่ายท่ายืนและท่าฟัน → ปรับ `item_skins` จนไม่ลอยไม่ทะลุมือ → ภาพรวมให้ผู้ใช้ตรวจรอบเดียว

### 5.5 ความคืบหน้า (2026-09-27 ดึก)
| งาน | สถานะ |
|---|---|
| ขั้น 0 รายการอาวุธ | ✅ `dev/combat/weapons.json` 2,305 ชิ้น (`/kubejs custom_command weapons_dump`) |
| mob patch ทหาร Valarian | ✅ `minaria_combat` `NpcFighterPatch` (HumanoidMobPatch: ท่าตามหมวดอาวุธชุดเดียวกับผู้เล่น) · เห็นในเกมแล้ว ทหารฟันด้วยท่าดาบของ EF ดาเมจเข้าทั้งสองทาง · พลธนูคง AI ยิงของตัวเอง |
| MCA บนโมเดล EF | ✅ เห็นในเกมแล้ว เสื้อผ้า ผม หน้า ครบ (`McaLayer` + `VillagerLayerMixin` ให้ MCA วาดเองลงบน mesh ของ EF, polygon offset ต่อชั้น, แกะ `MainModelLayer` ของ mca_emf_bridge) |
| MCA ยามต่อสู้ | 🟡 ส่งเป้าจาก Brain ให้ EF แล้ว · ยังไม่ได้ลองกับยาม MCA ตัวจริง (`court_staff guard` ไม่ใช่อาชีพยามของ MCA) |
| lmft ในโปรไฟล์ทดสอบ | ✅ ไม่มีแล้ว tag วนระหว่าง portlib กับ Connector 143 ตัวพัง (MCA เดินหาทางแล้ว crash) |
| ถัดไป | ปุ่มขวา 131 ชิ้น · projectile Confluence · ยาม MCA จริง · เกราะ GeckoLib · AsyncParticles · ดาบลอยกลางจอ (HUD ตัวไหน) |

### 5.6 จากภาพของผู้ใช้ (2026-09-28 00:04–00:38) — ต้นเหตุและสถานะ
| อาการ | ต้นเหตุ | แก้ | สถานะ |
|---|---|---|---|
| ทหาร/พลธนู Valarian ตัวแยกท่อน ท่อนบนลอย | เกราะ MCreator ของ Valarian ตั้ง initial pose ใต้ root `ARMOR` y24 (หัว/ตัว -24, แขน -22, ขา -12) · vanilla ใช้ท่าจาก setupAnim แต่ EF bake จาก initial pose → เกราะสูงไป 24px | `ArmorInitialPoseMixin` ตั้ง rest pose มาตรฐานก่อน EF bake (เกราะ vanilla ค่าเท่าเดิม) | build แล้ว **ยังไม่ได้ดูในเกม** |
| ฟันดาบซ้อนกันสองชั้น (มีเสี้ยวสีเทา) | ทุก hit ของ EF จบที่ `Player.attack` ของ vanilla → ดาบทำ sweep ของ vanilla ซ้ำ (อนุภาค `sweep_attack` + โดนรอบสอง, ดาบ Confluence ขยายพื้นที่ sweep เอง) | `NoSweepInBattleMixin` ปิด sweep เฉพาะโหมด Battle ของ EF | build แล้ว **ยังไม่ได้ดูในเกม** |
| เครื่องประดับ (Curios เช่นรองเท้าสีรุ้งของ Confluence) ไม่ขยับตามท่า | EF มี `CuriosCompat`: renderer แบบ `HumanoidRender` ถูก bake เป็น mesh · ตัวอื่น (GeckoLib/renderer เฉพาะ) ตกไปทาง fallback ที่วาดทั้งชั้นแข็งติดข้อต่อ Root → ไม่ตามแขนขา | ต้องดูว่า accessory ของ Confluence ใช้ renderer แบบไหน แล้วทำ `EpicFightCurioRenderer` ให้ หรือ bake แบบเดียวกับเกราะ | วิเคราะห์ถึง `CuriosCompat` แล้ว ยังไม่แก้ |
| log รอบเล่น | Sound Physics OpenAL error 54 ครั้ง · texture เกราะหาย (neutral_armor_2, netherite overlay) · Entity Culling อ่านบล็อกพลาด 1 ครั้ง | — | จดไว้ |

### 5.7 รอบ 2026-09-28 เช้า — ทหารตัวซ้อน / คลิกขวา
- **คำสั่งสลับโหมด EF** (อ่านจาก `PlayerModeCommand`): `/epicfight mode vanilla <ผู้เล่น>` หรือ `/epicfight mode epicfight <ผู้เล่น>` · ชื่อโหมดมาก่อนเป้าหมาย
- **ผู้ใช้เห็น "ชาวบ้าน MCA ทั้งตัว ซ้อนในทหาร ค้างหลังปิดหน้าจอ และซ้อนตั้งแต่เกิด"** กับ jar ก่อน 01:42 → ต้นเหตุคือ court วาดหุ่น MCA แทนตัวจริงและวิญญาณ MCA ถูก EF วาด · jar ปัจจุบัน (MannequinLayer + McaLayer ข้ามตัวที่ invisible) **ทดสอบใน EF Lab แล้วเป็นตัวเดียว** ทั้งใส่/ไม่ใส่เกราะ ก่อน/หลังเปิดหน้าจอ MCA
- **ป้ายชื่อของวิญญาณยังโผล่เหนือหัวหลังคลิก** → `ClientCourt.onRenderSoul` ยกเลิกการวาดวิญญาณที่ priority HIGHEST (ก่อน EF และ minaria_combat) · build + ลงทั้งสองโปรไฟล์แล้ว **ยังไม่ได้เห็นในเกม** (คลิกขวาอัตโนมัติไม่ติด เพราะทหารที่ `/summon` แบบไม่มี NBT เป็นศัตรูกับ Tester ทันที → court ไม่ให้คุย)
- **ทหารที่เกิดพร้อม `NoAI` ถูกวาดจม/ขาสั้น** (`/summon ... {NoAI:1b}` ข้าม `finalizeSpawn`) · เสกปกติแล้วค่อยตั้ง NoAI = ปกติ · court test (create + finalizeSpawn) = ปกติ · ปิด `mca_ragdoll_fix` ไม่เกี่ยว · ต้นเหตุยังไม่รู้ · court ไม่ได้ตั้ง NoAI ให้คนประจำอาคาร (มีแค่ lord ใน `/court test`) จึงน่าจะเจอแค่ในการทดสอบ แต่ต้องยืนยันกับทหารที่โหลดจากเซฟ
- **Saint's Dragons** อ่านไฟล์บทสนทนาของ `mcaconversations` แล้ว error ("Failed to parse dialogue file") ตอนโหลด
- เสกทหารทดสอบต้องใส่เกราะ + อาวุธเสมอ (ผู้ใช้สั่ง) · ชุดที่ใช้: `kettle_helm_helmet` + `chainmail_armor_*` + `valarian_sword` / `nasal_helm_helmet` + `leather_armor_*` + `soldiers_spear`
