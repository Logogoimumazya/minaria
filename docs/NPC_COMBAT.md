# NPC และการต่อสู้: วิเคราะห์ปัญหาและแผนแก้แบบเป็นระบบ

เริ่ม 2026-09-25 ผู้ใช้รายงานปัญหาสามข้อ:
1. NPC หลายตัวที่ผูกกับ Valarian Conquest พัง
2. ทหาร Valarian ทำดาเมจได้แค่กับผู้เล่น entity อื่นไม่เสียเลือดเลย
3. mob ที่ควรใช้ท่าโจมตีของ Better Combat ไม่แสดงท่าอะไรเลย

**เป้าหมาย:** ทุกระบบที่ผูกกันทำงานครบในเกมจริง ไม่ใช่แค่ใน mod ของเรา และมีชุดทดสอบที่ยืนยันได้ในคำสั่งเดียว

## 1. ของที่ต่อกันอยู่ (ห่วงโซ่)

```
Valarian Conquest (ทหาร, พลธนู, ชาวเมือง: MCreator, SoldierEntity extends Monster)
  ├─ minaria_court (ของเรา): ทหาร VC เป็นคน MCA, ชาวเมือง VC เป็นชาวบ้าน MCA, VcCombatFix ตั้ง ATTACK_DAMAGE
  ├─ valarian_compat (ของเรา): worldgen ของเมืองหลวง
  ├─ Better Combat 1.9.0: ท่าโจมตีและ hitbox ของอาวุธ (อาวุธ VC ประกาศ parent เป็น bettercombat:sword)
  ├─ Better Mob Combat 1.3.0: ให้ mob ใช้ระบบ Better Combat (เลือกเป้า, ความสัมพันธ์, จังหวะเหวี่ยง)
  ├─ Mob Player Animator 1.3.3: วาดท่าของ Player Animator บนโมเดล humanoid ของ mob
  ├─ mob_combat_sync (ของเรา): ส่งท่าโจมตีจาก server ไป client และ re-apply ท่าเมื่อ MPA พลาด
  └─ MCA: ชาวบ้าน ยาม ความสัมพันธ์
```

## 2. สิ่งที่ตรวจจาก bytecode และ log แล้ว (ข้อเท็จจริง)

| ข้อ | พบ | ที่มา |
|---|---|---|
| A | `SoldierEntity` ไม่ override `doHurtTarget` ใช้ `MeleeAttackGoal` ปกติ (ระยะ² 3.61) ความเสียหายจึงมาจาก attribute ATTACK_DAMAGE | javap SoldierEntity, SoldierEntity$2 |
| B | ATTACK_DAMAGE ของ VC เป็น 0 ตั้งแต่ต้น และ `VcCombatFix` ตั้งเป็น 5 แล้ว (log ยืนยันว่าทำงาน) แต่ผู้ใช้ยังเห็นว่าไม่มีดาเมจ แปลว่ามีตัวอื่นขวางอีก | log `[minaria_court] Valarian humanoids ship with ATTACK_DAMAGE 0` |
| C | Better Mob Combat ใส่ "เป้าที่กำลังล็อก" เข้ารายการโดนเสมอ ส่วนเป้าอื่นในวงเหวี่ยงต้องมีความสัมพันธ์ HOSTILE และการเช็กชนิดเดียวกัน (`mobs_check_for_same_entity_type`) กับ mob type เดียวกัน (`mobs_check_for_same_mob_type`) ทำให้ทหาร VC ต่างแคว้นเป็น "พวกเดียวกัน" (entity type เดียวกัน) และทุกอย่างที่เป็น MobType UNDEFINED (ชาวบ้าน, สัตว์, ทหาร VC เอง) เป็นพวกเดียวกันในวงเหวี่ยง | javap MobTargetFinder, `config/bettermobcombat/server.json5` |
| D | โมเดลของทหาร VC (`SoldierRenderer$AnimatedModel`, HumanoidModel) เรียก `super.setupAnim` ก่อน แล้วเล่นอนิเมชัน MCreator (HierarchicalModel) **ทับ** ทีหลัง ท่าที่ Mob Player Animator และ mod ของเราตั้งไว้ตอนจบ `HumanoidModel.setupAnim` จึงถูกเขียนทับทุกเฟรม | javap AnimatedModel.m_6973_ |
| E | client ได้รับแพ็กเก็ตท่าโจมตีของทหาร VC จริง (`attack packet ... animatable=true`) แต่ไม่มี log ผลการวาดท่าจาก `MobAttackPose.end` เลยสักครั้ง | logs 2026-09-25 |

## 3. สมมติฐานที่ต้องพิสูจน์ในเกม (ยังไม่ยืนยัน)

- **H1** ดาเมจต่อ entity อื่นถูกยกเลิกกลางทาง (event ถูก cancel หรือ damage ถูกลดเหลือ 0) โดย mod ใด mod หนึ่ง
  ตัวที่สงสัยคือ MCA (ชาวบ้านและยามมีภูมิคุ้มกันบางอย่าง), Better Mob Combat (processAttack), และ Valarian เอง
  (ระบบทีมและแคว้นใน persistent data)
- **H2** `MobAttackPose.end` ไม่ถูกเรียก หรือออกก่อนเพราะ `applier.isActive()` เป็น false ในเฟรมที่วาด
- **H3** mob ตัวอื่นที่ไม่ใช่ VC (ซอมบี้ถือดาบ, ชาวบ้าน MCA ยาม) ท่าหายเพราะ Mob Player Animator ไม่ได้ติดกับโมเดลของมัน
  (EMF หรือ ETF เปลี่ยนโมเดล, MCA ใช้โมเดลของตัวเอง)

## 4. วิธีตรวจ: ชุดทดสอบ `/court combat`

เพิ่มใน `minaria_court` ต่อจาก `/court test` ที่มีอยู่ ใช้คำสั่งเดียว ผลเป็น PASS/FAIL ใน chat และ log

1. สร้างลานปิดล้อมข้างผู้เล่น แล้ววางคู่ทดสอบห่างกันคู่ละ 20 บล็อก:
   - ทหาร VC ↔ ซอมบี้
   - ทหาร VC ↔ pillager
   - ทหาร VC แคว้น A ↔ แคว้น B
   - ทหาร VC ↔ ชาวบ้าน MCA ที่เป็นศัตรู
   - ยาม MCA ↔ ซอมบี้
   - ซอมบี้ถือดาบ ↔ ชาวบ้าน vanilla
   - พลธนู VC ↔ ซอมบี้
2. บังคับเป้าด้วย `setTarget` ทั้งสองฝั่ง ให้สู้กัน 30 วินาที
3. ดัก `LivingAttackEvent`, `LivingHurtEvent`, `LivingDamageEvent` สองจุด: priority HIGHEST (เห็นก่อนใคร) และ LOWEST
   แบบ `receiveCanceled` (เห็นหลังทุกคน) ถ้าจุดแรกเห็นแต่จุดหลังถูก cancel หรือดาเมจเหลือ 0 → รู้ว่ามี mod ตัวกลางกินไป
   และบันทึกชื่อ listener ที่ cancel จาก bus
4. ฝั่ง client: นับแพ็กเก็ตท่าโจมตีที่ได้รับ เทียบกับจำนวนเฟรมที่ท่าถูกวาดจริงต่อชนิด mob (log ใน `MobAttackPose`
   ทุกทางออก ไม่ใช่เฉพาะทางที่สำเร็จ)
5. สรุปเป็นตารางต่อคู่: เหวี่ยงกี่ครั้ง, โดนกี่ครั้ง, ดาเมจรวม, ถูกใคร cancel, ท่าถูกวาดกี่เฟรม

## 5. แผนแก้ (ทำหลังได้ผลทดสอบ ตามข้อที่พิสูจน์ได้)

| ปัญหา | แก้ | ที่ไหน |
|---|---|---|
| ทหาร VC ต่างแคว้นเป็นพวกเดียวกันใน BMC (C) | ปิด `mobs_check_for_same_entity_type` และ `mobs_check_for_same_mob_type` แล้วใช้ `mob_relations` ของ `valarian_conquest:soldier` และ `archer` กำหนดเอง: ทหารแคว้นเดียวกัน FRIENDLY, ชาวบ้าน NEUTRAL (โดนเฉพาะตอนเล็ง) · แคว้นต่างกันต้องใช้ข้อมูลแคว้นจาก persistent data ซึ่ง config ของ BMC ทำไม่ได้ จึงต้องเติม hook ใน minaria_court | config + minaria_court |
| ดาเมจถูกกินกลางทาง (H1) | แก้ที่ต้นเหตุตามผลทดสอบ ถ้าเป็น MCA ให้กำหนดว่าทหาร VC เป็นศัตรูที่ทำร้ายได้ | ตามผล |
| ท่าโจมตีถูก MCreator เขียนทับ (D) | mixin ที่ TAIL ของ `SoldierRenderer$AnimatedModel.setupAnim(SoldierEntity,…)` และของพลธนู ให้วางท่าของ Player Animator ซ้ำ **หลัง** อนิเมชัน MCreator แล้ว copy แขนเสื้อตามแขนใหม่ | mob_combat_sync |
| mob อื่นไม่มีท่า (H2, H3) | ตามผลทดสอบ | mob_combat_sync |
| NPC ผูก VC พัง | รายการอาการจากผู้ใช้ + `/court test` (มีอยู่แล้ว) ขยายให้ครอบทุกทางที่ minaria_court แปลง | minaria_court |

## 6. กฎกันพังซ้ำ

- ทุก mod ของเราต้องมีคำสั่งทดสอบในเกม (`/court test`, `/court combat`) และต้องรันผ่านก่อน commit ที่แตะระบบนั้น
- ทุก `@Inject` ใช้ `require = 1` ในโหมด dev เพื่อให้รู้ทันทีเมื่อ mixin ไม่ติด (ตอนนี้ใช้ `require = 0` ซึ่งเงียบเวลาพลาด)
- สิ่งที่อ้างเกี่ยวกับภายใน mod อื่นต้องตรวจจาก jar ก่อนเขียนโค้ด (memory: minaria-jar-verification)

## 7. ผลทดสอบ `/court combat` (2026-09-25, เซฟ Minaria W3 test)

**รอบแรก (ก่อนแก้):** ทุกคู่ที่มีทหาร VC กับมอนสเตอร์ ดาเมจเป็น 0 เพราะ `LivingAttackEvent` ถูกยกเลิกทุกครั้ง
- soldier → zombie: ยกเลิก 22/22
- soldier → pillager: ยกเลิก 29/29
- soldier ↔ soldier ต่างแคว้น: ยกเลิก 29/29
- zombie → soldier: ยกเลิก 22/22
- soldier → villager: โดน 5/5 ตรงกับที่ผู้ใช้เห็นว่าทหารตีได้แค่ผู้เล่นกับชาวบ้าน

**ต้นเหตุ (ยืนยันจาก bytecode):** Confluence ใช้กฎของ Terraria ที่ศัตรูไม่ทำร้ายกันเอง
(`org.confluence.mod.common.entity.EnemyDamageRules.blocks`) กฎนี้ยกเลิกการโจมตีเมื่อทั้งสองฝ่ายเป็น `Enemy`
หรืออยู่ใน MobCategory MONSTER ทหาร VC ลงทะเบียนเป็น Monster จึงโดนกฎนี้ไปด้วย ส่วน `VcCombatFix` (ตั้ง ATTACK_DAMAGE)
ถูกต้องแต่ยังไม่พอ

**แก้:** mixin `ConfluenceEnemyRulesMixin` ใน minaria_court ให้ `isEnemy` คืนค่า false สำหรับทหารและพลธนูของ VC

**รอบสอง (หลังแก้):** ทุกคู่โดนจริง
- soldier → zombie 18.7, soldier → pillager 25, soldier ↔ soldier 15 และ 20
- zombie → soldier 6, pillager → soldier 4, zombie → archer 20

**ยังเหลือ:**
- พลธนูไม่ยิงเลยในเวลา 30 วินาที (0 ครั้ง) ต้องทดสอบแยก
- ท่าโจมตี: client ได้รับแพ็กเก็ตท่าของ BMC แต่ใน frame ที่ render ตัว `AnimationApplier` ของ mob ไม่ active
  (ซอมบี้: `applier active=false`) แปลว่าท่าที่ BMC สั่งผ่าน `PlayerAttackAnimatable.playAttackAnimation`
  ไม่ได้เข้าไปอยู่ใน animation stack ที่ Mob Player Animator ใช้วาด กำลังตรวจว่าเป็นเพราะ Better Combat 1.9.0
  ใหม่กว่าที่ BMC 1.3.0 รองรับหรือไม่ (BMC ไม่ได้ระบุช่วงเวอร์ชันของ Better Combat ไว้)

## 8. ท่าโจมตีไม่แสดง: พบต้นเหตุและแก้แล้ว (2026-09-25)

**อาการ:** ผู้ใช้เห็นแค่แสงเหวี่ยงของอาวุธ แต่ตัว mob ไม่ขยับ

**ต้นเหตุ:** Better Mob Combat 1.3.0 เรียก `CompatibilityFlags.firstPersonRender()` ของ Better Combat ตอนเริ่มท่าโจมตีทุกครั้ง
(ในเมธอด `playAttackAnimation` ที่ BMC ผสานเข้าไปใน `Mob`) แต่ Better Combat 1.9.0 เอาเมธอดนี้ออกไปแล้ว
การเรียกทุกครั้งจึงเกิด `NoSuchMethodError` แล้วคิวงานของ client กลืน error ไปเงียบๆ ท่าโจมตีจึงไม่เคยเข้า animation stack
แต่แสงเหวี่ยงยังขึ้น เพราะมาจากคนละส่วน

**วิธีหา:** ในจุดที่รับแพ็กเก็ต สั่ง `playAttackAnimation` เองภายใน try แล้วบันทึก stack trace ออกมา

**แก้:** `BmcFirstPersonFlagMixin` ใน mob_combat_sync ใช้ `@Redirect` แทนการเรียกเมธอดที่หายไป ให้คืนค่า false
(ค่านี้ใช้แค่เลือกมุมมองบุคคลที่หนึ่ง ซึ่งไม่มีความหมายกับ mob) mixin ตั้ง priority 1500 ให้ทำงานหลัง BMC ผสานเมธอดแล้ว

**ผล:** หลังแก้ไม่มี error อีก และ trace แสดง `applier active=true` ทั้งซอมบี้และทหาร VC
- ซอมบี้: Mob Player Animator วาดท่าเอง
- ทหาร VC: mob_combat_sync วาดท่าซ้ำหลังอนิเมชัน MCreator (log ขึ้น "overwrite: swing drawn over the model's own animation")

**ยังต้องทำ:** ยืนยันด้วยภาพระยะใกล้ รอบนี้ถ่ายได้ไม่ชัดเพราะผู้ใช้กลับมาใช้เกมระหว่างถ่าย

**ผลจากผู้ใช้ (ภาพ 19:56):**
- ซอมบี้มีท่าฟันแล้ว
- ทหาร VC ยังไม่ฟัน ดูเหมือนแค่ชนกัน และตัวงอไปข้างหน้าทั้งตัว

**สาเหตุ:** การวาดท่าซ้ำทับอนิเมชัน MCreator ทำให้ท่าถูกใส่สองชั้น

**แก้:** เปลี่ยนเป็นข้ามอนิเมชัน MCreator ในเฟรมที่มีท่าของ Player Animator เล่นอยู่
(`VcSoldierModelMixin` redirect การเรียก `HierarchicalModel.setupAnim`) ท่าที่ MPA วางไว้จึงคงอยู่
แล้วโค้ดของโมเดลก็ copy แขนเสื้อกับกางเกงตามแขนขาต่อเองตามปกติ
ส่วนพลธนู VC ไม่มีอนิเมชัน MCreator (เรียก super ตอนท้าย) จึงไม่ต้องแก้

**ตีโดนบ้างไม่โดนบ้าง:** Valarian มี `ShieldBlockNegateDamageProcedure` ยกเลิกการโจมตีทั้งหมดที่เข้าทหารระหว่างยกโล่
(ตรวจจาก bytecode แล้ว) ระบบนี้ตั้งใจให้เป็นแบบนั้น แต่ถ้ายกโล่บ่อยเกินไปจะดูเหมือนตีไม่เข้า
ต้องวัดจาก `/court combat 2` ว่าถูกกันกี่ครั้งต่อการเหวี่ยง ก่อนตัดสินใจปรับ

## 9. ทหารยังไม่ฟัน: ต้นเหตุจริงอยู่ใน minaria_court (2026-09-25 คืน)

**อาการ (วิดีโอผู้ใช้ 20:12 และ 20:25):** หลังแก้ข้อ 8 แล้ว ทหารยังถือดาบชี้ไปข้างหน้าค้าง มีแค่แสงเหวี่ยง แต่ดาเมจเข้า

**วิธีหา:** วัดมุมแขนทุกเฟรมใน setupAnim ของโมเดลทหาร VC ผลคือ ทหารที่ต่อสู้อยู่ไม่ผ่านโมเดลนี้เลย
- `ClientCourt.onRender` ยกเลิกการวาดตัวทหาร VC แล้ววาด `Mannequin` แทน (ชาวบ้าน MCA ฝั่ง client ที่สวมชุดและท่าทางของตัวจริง)
  ทหารทุกตัวได้ตัวตน MCA ตอนผู้เล่นเริ่มเห็น (`Souls.onStartTracking`) จึงถูกวาดเป็นหุ่นเกือบทั้งหมด
- Better Mob Combat เล่นท่าฟันบน animation stack ของ **ตัวทหาร** ส่วน Mob Player Animator วางท่าจาก stack ของ **ตัวที่กำลังวาด**
  คือหุ่น ซึ่งมี stack ว่างของตัวเอง ท่าฟันจึงไม่เคยถูกวาด ส่วนแสงเหวี่ยงมาจากตัวทหารโดยตรงจึงยังขึ้น
- ข้อ 8 ถูกต้องแต่แก้ได้เฉพาะทหารที่ไม่มีตัวตน MCA

**แก้:** `Mannequin` implements `IAnimatedPlayer` แล้วคืน stack และ applier ของตัวทหารที่มันแทน
หุ่นไม่ได้อยู่ในโลกจึงไม่ถูก tick ซ้ำ stack เดินตามตัวทหารตัวเดียว

**ผลทดสอบ** (`/court combat weapons <0-4>` เซฟ W3 test ถ่ายระยะ 6 บล็อก):

| คู่ | อาวุธ | ผล |
|---|---|---|
| 0 | Valarian sword vs Burgundian sword | ฟันแนวนอนซ้าย/ขวา มีรอยดาบ ดาเมจเข้าทั้งสองฝั่ง |
| 1 | Bohemian soldiers_spear vs Templar soldiers_halberd | หอกแทงตรง ง้าวเหวี่ยง |
| 2 | Orleanian light_axe vs Hospitaller heavy_axe | เหวี่ยงขวานมีรอย |
| 3 | Visgothian common_spear vs Barathian sword | แทงหอก ฟันดาบ |
| 4 | Bohemian sword vs Templar sword | ฟันแนวนอนเต็มแขน |

**เครื่องมือใหม่:** `/court combat weapons [คู่]` ทหาร VC สองฝ่ายสวมชุดแคว้นต่างกัน ถืออาวุธตามคู่ ในคอกกำแพง barrier (มองทะลุ)
ถ้าระบุคู่ จะวางคอกห่างไป 6 บล็อกให้มองด้านข้าง

**ที่เห็นแต่ยังไม่แก้:**
- ผมของ MCA ทะลุหมวกเหล็ก (ทหารผมดำ/แดงในคู่ 2–3) มาจาก layer ผมของ MCA วาดทับหมวก
- ตัวนับ `swings` ของ `/court combat` เป็น 0 เสมอ เพราะ BMC ไม่ตั้ง `swinging` ของ vanilla ต้องนับจากแพ็กเก็ตแทน

## 10. ทหารเหลือแต่เกราะ ตัวล่องหน (2026-09-26)

**อาการ (ผู้ใช้):** ท่าฟันขึ้นแล้ว แต่ทหาร VC ไม่ถูกวาดเป็นคน MCA อีก เห็นแต่เกราะลอยอยู่บนตัวที่มองไม่เห็น

**ต้นเหตุ (log `could not dress a VC body as its MCA identity`):** ข้อ 9 ให้ `Mannequin` ตอบ `getAnimationStack()`
ด้วย field ของตัวเอง แต่ Better Mob Combat มี hook ท้าย constructor ของ `Mob` (`MobMixin_AttackAnimation.post_init`,
javap แล้ว) ที่เรียก `getAnimationStack()` แล้ว `addAnimLayer` ทันที ตอนนั้น `super()` ยังไม่จบ field initialiser
ของ `Mannequin` จึงยังไม่ทำงาน ได้ `null` แล้ว NPE หุ่นทุกตัวสร้างไม่สำเร็จ ทหารเลยถูกวาดด้วย renderer ของ VC เอง
ซึ่งใช้ผิวที่ `VcOutfits` ลบหัวและผิวหนังออกแล้ว เหลือแต่ชุดกับเกราะ

**แก้:** stack และ applier ของหุ่นสร้างตอนถูกถามครั้งแรก และไม่มี field initialiser (ค่าที่ตั้งระหว่าง `super()` จึงไม่ถูกทับ)

**ผล (เซฟ W3 test):** `/court test` ผ่าน server 17/17 และ client ครบ ไม่มี error หุ่นใน log ·
ทหารที่ `/summon` ทั้งไม่มีเกราะและสวมเกราะ Burgundian เต็มชุด ถูกวาดเป็นคน MCA มีหน้า ผม สีผิว และชื่อ
(ภาพ `D:/Minaria/world/shots/mannequin/close.png`, `armoured.png`)

**กันซ้ำ:** `/court test` ข้อ "walker is drawn as its MCA person" จับกรณีนี้ได้ ต้องรันทุกครั้งที่แตะ `Mannequin`
