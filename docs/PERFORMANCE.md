# ประสิทธิภาพการสร้างโลก — อาการค้างตอนเจอ chunk ใหม่

> วัดด้วย `kubejs/server_scripts/gen_bench.js` (เซฟชื่อ `MINARIA_GEN_TEST`) และ Java Flight Recorder
> เครื่องทดสอบ: i5-10500 (6 คอร์ / 12 เธรด), RAM 16 GB, `-Xmx8G`

## 1. อาการ

server ค้างทั้ง tick ทุกครั้งที่ผู้เล่นเข้าพื้นที่ที่ยังไม่เคยสร้าง — เคสที่หนักที่สุดคือ `/tp` (ต้องสร้าง chunk
ปลายทางให้เสร็จก่อน) แต่การเดิน/บินเร็วก็โดนแบบเดียวกัน ก่อนแก้: **วาร์ปครั้งเดียวค้าง 330 วินาที**

## 2. ผลวัด (วินาทีที่ server ค้างต่อการวาร์ป 320 บล็อกไปพื้นที่ใหม่)

| การตั้งค่า | ครั้งที่ 1 | ครั้งที่ 2 | ครั้งที่ 3 |
|---|---|---|---|
| ค่าเดิม (DH 9 threads) | 330 | — | — |
| + Smooth Boot `main` priority 1 → 5 | 274 | 149 | 118 |
| + ปิด ModernFix `worldgen_allocation` | 247 | 57 | — |
| (ทดลอง) ถอด Tectonic | 102 | 22 | 39 |
| Tectonic กลับ + DH 3 threads | 178 | 66 | — |
| + `minaria_perf` cache hashCode | 148 | 77 | 80 |
| **+ `minaria_perf` memo mapAll** | **60** | **43** | **32** |

12 step หลังแก้ทั้งหมด: เฉลี่ย **36 s** ต่อการวาร์ป (22–60 s)

render distance 12 กับ 25 ให้ผลแทบเท่ากัน (188 / 178) — ไม่ใช่ตัวแปรหลักของอาการนี้

## 3. สาเหตุที่พบและแก้แล้ว

1. **กราฟภูมิประเทศถูกเดินซ้ำแบบทวีคูณ** (ตัวหลัก) — `DensityFunction.mapAll` และ `hashCode` ของ record
   เดินกราฟแบบต้นไม้ ทั้งที่กราฟของ Tectonic แชร์กิ่งกันหนัก ทุก NoiseChunk (ทุก chunk + ทุก aquifer) จ่ายราคานี้
   → ม้อดใหม่ **`dev/minaria_perf`**: memo `mapAll` ต่อหนึ่งการเดิน (by identity) + cache hashCode ของโหนด record
   ผลลัพธ์โลกเหมือนเดิม — profile: ส่วนนี้ลดจาก >40% เหลือ ~1.4% ของเวลาสร้างโลก
2. **Smooth Boot ลด priority ของ worker สร้างโลกเป็น 1** (`config/smoothboot.json` `threadPriority.main`) — ตั้งใจ
   ให้ตอนบูตลื่น แต่ pool เดียวกันใช้สร้าง chunk ตลอดเกม → 5
3. **ModernFix `perf.worldgen_allocation`** เขียนทับ `NoiseChunk.wrap` ด้วย map ที่ hash ทุกครั้ง → ปิดใน
   `config/modernfix-mixins.properties`
4. **Distant Horizons 9 threads** แย่ง CPU กับ worker ตัวเดียวของเกม (เครื่อง 6 คอร์) → 3 (ค่าที่เคย commit ไว้)

## 4. สาเหตุที่เหลือ (profile หลังแก้ — สัดส่วนเวลาของ thread สร้างโลก)

| ต้นเหตุ | สัดส่วน | กลไก |
|---|---|---|
| Confluence: `MarbleCaveStructure`, `GraniteCaveStructure`, `ShimmerLakeStructure` | ~17% | `findGenerationPoint` สร้างรูปทรงทรงกลมทีละบล็อกลง HashMap (`LibStructureUtils.ball8`) ทุกจุดที่เป็นผู้สมัคร |
| Malum: `WeepingWellStructure.isSufficientlyFlat` | ~14% | ถามความสูงพื้นซ้ำหลายจุดต่อผู้สมัครหนึ่งจุด |
| aquifer (vanilla + ภูมิประเทศ Tectonic) | ~25% | คำนวณ noise ปกติ แต่แพงเพราะกราฟใหญ่ |
| features/decoration | ~14% | รวมหลายม้อด |

thread อื่นที่แย่ง CPU พร้อมกัน: `MentalChunks-CPU`, DH world gen, `streamsreflowing-sampler`, RoadWeaver (`RW-Worker`)

**ลองแล้ว ไม่ได้ผล — อย่าลองซ้ำ**: ทำ datapack ให้ถ้ำหินอ่อน/แกรนิต (spacing 40→56), ทะเลสาบ Shimmer (50→70)
และ Weeping Well (8→12) เกิดห่างขึ้น ~2 เท่า แล้ววัด 12 step: เฉลี่ย **35.8 s เทียบ 36.4 s** (ต่างน้อยกว่าความแกว่ง
ของการวัด) — งานของโครงสร้างพวกนี้กิน CPU จริงแต่ไม่อยู่บนเส้นทางที่ `/tp` รอ จึงลบ datapack ทิ้ง ไม่ลดเนื้อหาเปล่าๆ

ทางที่เหลือที่น่าจะได้ผลกับการค้าง: **pre-gen ด้วย Chunky** (แผนที่สำเร็จรูปต้องทำอยู่แล้ว) — เมื่อ chunk ถูกสร้าง
ไว้ก่อน ค่าใช้จ่ายทั้งหมดในตารางนี้ย้ายไปอยู่ตอนเตรียมแพ็ก ไม่ใช่ตอนเล่น

## 5. วิธีวัดซ้ำ

```
cp -r "saves/<เซฟไหนก็ได้>" saves/MINARIA_GEN_TEST
python dev/launch_test.py MINARIA_GEN_TEST --real                       # ค่าจริงของแพ็ก
python dev/launch_test.py MINARIA_GEN_TEST --real --jfr=<path>.jfr      # + profile (ปิดเกมแบบปกติเพื่อให้เขียนไฟล์)
jfr print --events jdk.ExecutionSample --stack-depth 200 <path>.jfr > samples.txt
```
ผลออกที่ `kubejs/gen_bench/results.json` ต่อ step: `ticks`, `avgMs`, `maxMs`, `over1s`
