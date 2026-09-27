# Fresh Animations ให้ humanoid ทุกตัว (แผนระบบ)

ผู้ใช้ขอเมื่อ 2026-09-25: humanoid ตัวไหนที่ยังไม่ได้ใช้ Fresh Animations (FA) หรือ FA+Player ให้ทำ compat ให้ครบ
ตอนนี้เห็นชัดว่าตัวที่ขยับแบบ FA กับตัวที่ยังขยับแบบเดิมอยู่ข้างกัน แล้วขัดตา

## 1. ที่มีอยู่ตอนนี้ (ตรวจจาก jar และ config แล้ว)

- **Entity Model Features 3.3.9** (EMF) เป็นตัววาดโมเดลแบบ OptiFine CEM
  - หาไฟล์ `.jem` ที่ `assets/<namespace>/optifine/cem/` และ `assets/<namespace>/emf/cem/`
  - รองรับ namespace ของ mod อื่น (มี `assertNamespaceAndCreateDeprecatedModdedFileName` ใน `EMFModel_ID`)
  - พิมพ์ไฟล์ `.jem` ตัวอย่างของโมเดลใดๆ ออกมาได้ (`EMFModelMappings`, "creating example .jem file") ทำให้รู้ชื่อชิ้นส่วนของโมเดล mod อื่นโดยไม่ต้องเดา
- **Fresh Animations 1.10.4** มี `.jem` 173 ไฟล์ เป็นของ vanilla ทั้งหมด เช่น zombie, villager, pillager, vindicator, piglin
- **FA+Player** มีอนิเมชันผู้เล่น (`a_player_variables.jpm`) และชุด extension อื่นๆ
- **Mob Player Animator:** config `emf_force_vanilla_models` บังคับให้ทหาร Valarian และชาวบ้าน MCA ใช้โมเดลปกติแทน EMF
  ตั้งไว้เพื่อให้ท่าโจมตีของ Better Combat แสดงได้ ผลคือตัวพวกนี้ไม่มีท่าทางแบบ FA เลย
  MPA มีระบบหยุดอนิเมชันของ EMF ชั่วคราวระหว่างท่าโจมตีอยู่แล้ว (`is_emf_animation_halt_enabled`) จึงไม่จำเป็นต้องบังคับแบบนั้น

## 2. หลักการ

humanoid ทุกตัวต้องได้สองอย่างพร้อมกัน:
1. **ท่าทางปกติแบบ FA** ได้แก่ ยืน เดิน วิ่ง หันหัว และหายใจ จาก EMF
2. **ท่าโจมตีของ Better Combat** จาก MPA ซึ่งหยุด EMF ไว้ชั่วคราวระหว่างเหวี่ยง แล้วปล่อยให้ EMF ทำงานต่อ

ไม่มีตัวไหนที่มีแค่อย่างใดอย่างหนึ่ง

## 3. วิธีทำ: resource pack `Minaria FA Compat` ที่สร้างด้วยสคริปต์

1. **สำรวจ:** เปิด EMF debug export หนึ่งครั้ง แล้วเดินผ่าน entity ทุกชนิดในโลกทดสอบ (ใช้คำสั่ง summon ทีละตัว) EMF จะพิมพ์ `.jem`
   ตัวอย่างพร้อมชื่อชิ้นส่วนของทุกโมเดล จากนั้นสคริปต์คัดเฉพาะโมเดล humanoid (มีครบ head, body, แขนสองข้าง, ขาสองข้าง)
2. **จัดกลุ่มตามโครงโมเดล:**
   - **ก. โมเดล humanoid มาตรฐาน** (ชื่อชิ้นส่วนเหมือน vanilla) เช่น ซอมบี้หรือโครงกระดูกของ mod อื่น
     → คัดลอก jem ของ FA ตัวที่ใกล้เคียง (zombie, skeleton, player) ไปวางใต้ namespace ของ mod นั้น
   - **ข. โมเดลแบบผู้เล่น** (มีแขนเสื้อ, กางเกง, jacket) เช่น ทหารและพลธนู Valarian, ชาวบ้าน MCA
     → ใช้ jem แบบผู้เล่นของ FA+Player แล้วผูกชิ้นส่วนเสริม (jacket, sleeves, pants) ให้ขยับตามแขนขา
   - **ค. โมเดลที่มีอนิเมชันของตัวเอง** (MCreator keyframe, GeckoLib)
     → ยังไม่ใส่ FA ใส่แค่ท่าโจมตีด้วย mixin แบบที่ทำกับ Valarian แล้วจดไว้ในตาราง
3. **ตาราง mapping** อยู่ในไฟล์ `dev/packs/fa_compat.json` ระบุ entity, โมเดลต้นทางของ FA และชื่อชิ้นส่วนที่ต้องแปลง
   สคริปต์ `dev/packs/make_fa_compat.py` อ่านตารางนี้แล้วสร้าง pack โดยไม่มีไฟล์ของ FA ติดอยู่ในรีโป
   (pack ของ FA มีลิขสิทธิ์ สคริปต์จึงอ่านจาก zip ในเครื่องผู้ใช้แล้วสร้าง pack ในเครื่องเท่านั้น)
4. **เอาออกจาก `emf_force_vanilla_models`** เฉพาะตัวที่มี jem แล้ว

## 4. ตรวจผล

- **log ของ EMF:** ทุก jem ในตารางต้องขึ้น ".jem read success"
- **ภาพในเกม:** ใช้เซฟทดสอบ วาง entity ทุกตัวในตารางเรียงกัน
  - เงื่อนไขท้องฟ้า: `time set noon`, `weather clear`, `simpleclouds clouds clear all`
  - ถ่ายสามช่วงต่อตัว: ยืน, เดิน, โจมตี (ใช้ `/court combat` แบบคู่เดียว)
  - ถ่ายเฉพาะหน้าต่างเกม รวมเป็นภาพ grid ภาพเดียว
- **เกณฑ์ผ่าน:** ทุกตัวขยับแบบ FA ตอนยืนและเดิน และเหวี่ยงอาวุธให้เห็นตอนโจมตี

## 5. ลำดับทำ

1. แก้ท่าโจมตีที่ไม่ขึ้นก่อน (`NPC_COMBAT.md` ข้อที่เหลือ) เพราะ FA ต้องหยุดให้ท่าโจมตีได้
2. สำรวจโมเดลด้วย EMF export
3. ทำตาราง mapping และสคริปต์สร้าง pack โดยเริ่มจากกลุ่ม ข. (Valarian, MCA) ซึ่งเห็นบ่อยที่สุด
4. ถ่ายภาพ grid ตรวจทีละกลุ่ม
