# NightfallCraft: The Casket of Reveries — ต้นแบบที่เอามาเทียบและเติมให้ Minaria

สัมภาษณ์ 2026-09-27 · แพ็กอยู่ที่ `Instances/NightfallCraft - The Casket of Reveries` (CurseForge 1354886, forge 47.4.4, 216 ม้อด)
แพ็กนี้สร้างบน **Epic Fight 20.14.17 ตัวเดียวกับเรา** จึงเป็นต้นแบบตรงของงาน [`EPIC_FIGHT.md`](EPIC_FIGHT.md)

## 1. คำตอบของผู้ใช้ (ห้ามถามซ้ำ)

| เรื่อง | ตัดสิน |
|---|---|
| หมวดที่เอามา | ระบบนิเวศ EF · UI/UX ทั้งชุด · บอสและห้องบอส · ระบบอื่น **ต้องปรับให้เข้ากับเราเอง** |
| หน้าเมนูและ UI | **ทำของ Minaria เองในแนวเดียวกัน** (โครง FancyMenu แบบเขา แต่ภาพ โลโก้ และสีเป็นของเรา: ม่าน ทวีป กรมท่า-ทอง) |
| ท่าปกติ | **ยึดที่ตัดสินแล้ว:** FA ตอนปกติ EF ตอนสู้ (Nightfall ใช้ EF ตลอด เราไม่ทำตาม) · เอาชุดท่าต่อสู้ของเขามาใช้ตอนสู้เท่านั้น |
| ลงที่ไหน | **โปรไฟล์ EF Test ก่อน** ผ่านแล้วย้ายพร้อม EF |
| บอส | **ผ่านกฎ bible ข้อ 5 ทีละตัว** ผมเสนอประเภท องก์ เทียร์ ทิศหรือรัฐ · ตัวที่ใส่ไม่ลงให้ตัด |
| UI/UX ที่เอา | tooltip + กรอบไอเทม + GUI สีเข้ม · HUD ต่อสู้ + ล็อกเป้า · หน้าตาย + kill cam + ฉากเปิดบอส · ธีมเควส + บทสนทนา |
| ผู้เล่น | **คนเดียวเป็นหลัก เล่นกับเพื่อนได้** → บอสปรับตามจำนวนผู้เล่น |
| อาวุธและชุดท่า | **ผูกกับรัฐและองค์** · ใช้เป็นอาวุธประจำสไตล์ทหารต่อรัฐด้วย · ตัวไหนไม่เข้าธีมตัด |
| ระบบอื่น | เครื่องประดับ (Artifacts, Unique Accessories) · ปิดความหิว (Hunger Strike) · attribute (Apothic Attributes) · พิธีเรียกบอส (Summoning Rituals) — ทั้งหมดต้องปรับให้เข้ากับเรา |
| ม้อดสร้างโลก | **จดไว้เป็นตัวเลือกของดินแดนสะท้อน** ตัดสินตอนทำ echoes |
| ม้อดความเร็ว | **ลองทีละตัวในโปรไฟล์ทดสอบ วัด FPS ก่อน/หลัง** เก็บเฉพาะตัวที่เร็วขึ้นจริงและไม่พัง |
| shader | **ไม่ใส่** รอบทดสอบเน้นความลื่น |

**ข้อห้าม:** ม้อดของทีม TCR (`tcr_bosses`, `tcrcore`, `tcrmeshes`, `tcrmodfilter`), EFN และ EFN-Enhance เป็น All Rights Reserved
แต่อยู่บน CurseForge จึงอ้างใน manifest ได้ถ้าผู้สร้างเปิดสิทธิ์ modpack (ต้องตรวจก่อนแจก) · **ภาพเมนู โลโก้ เควส และ config ของ Nightfall
ห้ามคัดลอกไปใส่แพ็กเรา** ใช้ดูเป็นแนวทางเท่านั้น

## 2. เทียบระบบ: ของเขา → ของเรา → ทำอะไร

| หมวด | Nightfall | Minaria ตอนนี้ | ทำอะไร |
|---|---|---|---|
| **ท่าต่อสู้ผู้เล่น** | EF + EpicFight Nightfall (EFN) + Nightfall Enhance, Avalon, Invincible Lib, Epic Fight Extra | Better Combat (กำลังเปลี่ยน) | ลองชุด EFN ในโปรไฟล์ทดสอบ **ท่าตอนสู้เท่านั้น** |
| AI ของ mob แบบ EF | Combat Evolution (ไลบรารี AI ท่าต่อสู้ mob) | Better Mob Combat + `mob_combat_sync` | ใช้ Combat Evolution เป็นฐานของทหาร VC ต่อรัฐ (EPIC_FIGHT 3.4) |
| ล็อกเป้า | Better Lock-on | ไม่มี | ใส่ |
| หลบ/ปัดแล้วได้รางวัล | Dodge Parry Reward | ไม่มี | ใส่ · เข้ากับ bullet hell |
| บอส Cataclysm กับ EF | P1nero's Epic × Cataclysm (ต้องใช้ EFN) | ไม่มี compat | ใส่ · ตรวจกับเพดานดาเมจใน BALANCE และกติกา "บอสไม่เซ ยกเว้นโดนปัด" |
| เวท Iron's กับ EF | Epic Fight Skill - Iron's Spells (`efs_iss`) | ไม่มี | ใส่ |
| อาวุธ | Weapons of Miracles, Epic Knights, P1nero's Epic Bow, Guandao moveset, Indestructible | อาวุธ VC, Confluence, Iron's | ใส่ในโปรไฟล์ทดสอบ แล้วผูกรัฐและองค์ในตารางอาวุธ (EPIC_FIGHT 3.3) |
| บินบนดาบ | Sword Soaring | — | **ไม่ใส่ในรอบแรก** แนวเซียน ต้องผ่าน lore ก่อน |
| สกิลทรี | EF Skill Tree | — | **ไม่ใส่** (ผู้ใช้ตัดสินแล้วใน EPIC_FIGHT) · จึงไม่ใช้ `tcrcore` ที่ต้องพึ่งมัน |
| **บอส** | TCR Bosses, Leonidas, Arachne, Wraithon, Mimic, Super Golem, Super Warden, BOMD | Cataclysm, Confluence, BOMD, Block Factory, Mowzie | ใส่ในโปรไฟล์ทดสอบ → ตาราง bible 5 (ข้อ 3) |
| ห้องบอส | Cataclysm Dimensions | แผน 8 ทิศ = 8 ห้อง (BLUEPRINT 6) | ใส่ · เป็นฐานของห้องใน 8 ทิศ |
| ฉากเปิดบอส | Cinematic Cataclysm | ไม่มี | ใส่ |
| บอสหลายผู้เล่น | Multiplayer Boss Attribute Modifier | ไม่มี | ใส่ (เล่นกับเพื่อนได้) |
| **เมนูหลัก** | FancyMenu: ภาพพิกเซลเต็มจอ ตัวอักษรโกธิก ปุ่มน้อย ไอคอนมุมล่าง | FancyMenu (ยังไม่ได้ออกแบบ) | ทำของ Minaria เอง (ข้อ 4) |
| หน้าโหลด | Drippy Loading Screen + layout ของเขา | Drippy (ค่าเดิม) | ทำของเราในชุดเดียวกับเมนู |
| tooltip/กรอบไอเทม | Legendary Tooltips + Eclectic Trove, Item Borders | Obscure Tooltips | เทียบกันในเกม เลือกตัวเดียว · สีตามระดับของ (tier) |
| GUI ทั้งเกม | Mandala's GUI Dark mode | GUI ปกติ | ใส่ แล้วปรับสีให้เข้ากับ The System |
| HUD ต่อสู้ | Ares-HUD | แถบของ EF เอง + Confluence | ใส่ · ห้ามทับหน้าต่าง The System และ NOTICE |
| หน้าตาย | You Died | หน้าตายปกติ | ใส่ |
| kill cam | Kill-Cam | ไม่มี | ใส่ · เฉพาะตอนฆ่าบอส |
| ชื่อพื้นที่ | Traveler's Titles | NOTICE "Entered" ของ The System | **เทียบก่อน** ของเราผูกกับรัฐและระดับอันตรายแล้ว อาจเอาแค่แนวภาพ |
| ธีมเควส | Our Story FTB Theme | FTB Quests ปกติ + หน้า QUESTS ใน The System | ใส่ธีม แล้วปรับให้เข้ากับ The System |
| บทสนทนา NPC | P1nero's Dialogue Lib | dialog ของ The System + MCA | เทียบ UX แล้วเอาแนวที่ดีมาใส่ dialog ของเรา |
| คีย์ลัด | Visual Keybinder | Controlling | ใส่ (EF เพิ่มปุ่มเยอะ) |
| เครื่องประดับ | Artifacts, Unique Accessories, Radiant Gear | ของ Confluence (ช่องของ Confluence เอง) | ใส่ในโปรไฟล์ทดสอบ · ต้องตัดตัวที่ซ้ำกับ Confluence · ผูกองค์ |
| attribute | Apothic Attributes | AttributeFix | ใส่ · แสดงค่าในหน้า STATUS ของ The System |
| ความหิว | Hunger Strike | แถบหิวปกติ | ใส่ (ตรงกับ "ไม่มีระบบจำลองชีวิต") · เช็กกับ Farmer's Delight ว่าอาหารยังมีค่า |
| เรียกบอสซ้ำ | Summoning Rituals | ไอเทมเรียกของ Confluence | ใส่ · สูตรพิธีเขียนเองตามองก์ |
| เควส | บทนำ → อาวุธพื้นฐาน → อาวุธ → อุปกรณ์ → ของสำคัญ → เทพและปีศาจ → วัฏสงสาร | องก์ 0–IV ตาม bible | ใช้เป็นแนวของบทสอนระบบ (อาวุธ อุปกรณ์) ในเฟส 3 |
| ม้อดสร้างโลก | Aether, BWG, OTBWG, When Dungeons Arise, Towns and Towers, Battle Towers, Lost Castle, ATi | ทวีปสร้างเอง | ตัวเลือกของดินแดนสะท้อน (เฟส 5) |
| ความเร็ว | Accelerated Rendering, Flerovium, Gnetum, FastEvent, Mixin Booster, lazyyyyy, Preloading Tricks, spark | Embeddium, ModernFix, FerriteCore, ... | ลองทีละตัว วัด FPS (ข้อ 5) |
| shader | Oculus + BSL/Complementary/Solas/MakeUp | ไม่มี | ไม่ใส่ |

## 3. บอสที่ต้องผ่าน bible ข้อ 5 (ร่าง ผมเสนอหลังเห็นในเกม)

แต่ละตัวต้องได้: ประเภท (บรรพกาล / สิ่งแปลกปลอม / ของโลกนี้) · องก์ · เทียร์ T0–T5 (BLUEPRINT 7) · ที่อยู่ (รัฐบนทวีป หรือวงและทิศ) · เหตุผลใน lore
ตัวที่ต้องประเมิน: บอสใน `tcr_bosses`, Leonidas, Arachne, Wraithon, Mimic, Super Golem, Super Warden
วิธี: เสกในลานทดสอบ ดูท่าและความยาก จดท่าที่บอกล่วงหน้าไม่ได้ (ขัดกฎความยุติธรรม) แล้วเสนอเป็นหน้าเดียว

## 4. หน้าเมนูของ Minaria (แนวทาง)

- โครงเดียวกับ Nightfall: ภาพเต็มจอหนึ่งภาพ ชื่อแพ็กตัวใหญ่ตรงกลาง ปุ่มหลักสองสามปุ่ม ไอคอนเล็กมุมล่าง ไม่มีปุ่มเกะกะ
- เนื้อหาของเรา: ม่านที่แตกเหนือทวีป เมืองหลวงไกลๆ สีกรมท่ากับทอง ตัวอักษรเดียวกับ The System · ปุ่ม **New Journey** (BLUEPRINT 9) อยู่ตรงนี้ตอนเฟส 6
- หน้าโหลดและหน้าต่างทั้งหมดใช้ชุดสีเดียวกัน
- ภาพต้องเป็นของเราเอง (วาดหรือถ่ายจากโลกของเรา) ห้ามใช้ภาพของ Nightfall

## 5. ลำดับทำ (เข้าคิวงาน EF)

1. คัดลอกม้อดจากข้อ 2 (ที่เขียนว่า "ใส่") จากโฟลเดอร์ Nightfall เข้าโปรไฟล์ EF Test พร้อม dependency · ไม่เอา tcrcore, Skill Tree, Sword Soaring, shader
2. เปิดเกมโปรไฟล์ทดสอบจนไม่ crash
3. วัด FPS ฐาน แล้วลองม้อดความเร็วทีละตัว
4. บอส → ตาราง bible 5 · อาวุธ → ตารางอาวุธ (EPIC_FIGHT 3.3) · เครื่องประดับ → ตัดตัวซ้ำกับ Confluence
5. UI: tooltip, GUI สีเข้ม, HUD, หน้าตาย, kill cam, ธีมเควส ดูในเกมแล้วปรับสี · หน้าเมนูของ Minaria ทำหลังสุด
