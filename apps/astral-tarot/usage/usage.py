r"""Usage log of the Astral Tarot oracle: pull it from D1 into a local SQLite file and summarise it.

  python usage.py pull            # copy new rows from D1 (needs `wrangler login`)
  python usage.py report          # write report.md next to the database and print the summary
  python usage.py sql "SELECT ..." # ad-hoc query on the local copy

The local copy lives OUTSIDE the repo (the repo is public and these are real people's questions):
default D:\astral-tarot-data\usage.db, or set ASTRAL_USAGE_DB.
"""
import json, os, re, sqlite3, subprocess, sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
WORKER = HERE.parent / "worker"
DB_NAME = "astral-tarot-usage"
LOCAL = Path(os.environ.get("ASTRAL_USAGE_DB", r"D:\astral-tarot-data\usage.db"))
COLS = ["id", "ts", "day", "visitor", "kind", "type", "rid", "question", "topic", "qtype", "subject", "spread", "cards", "shadow",
        "life_stage", "minor", "lens", "overall", "rel", "model", "status", "ms", "answer", "answer_chars"]


def local():
    LOCAL.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(LOCAL)
    con.executescript((WORKER / "schema.sql").read_text(encoding="utf-8").replace("AUTOINCREMENT", ""))
    return con


def d1(sql):
    cmd = f'npx --yes wrangler@4 d1 execute {DB_NAME} --remote --json --command "{sql}"'
    out = subprocess.run(cmd, shell=True, cwd=WORKER, capture_output=True, text=True, encoding="utf-8").stdout
    start = out.find("[")
    if start < 0:
        sys.exit("wrangler did not return JSON (logged in? `npx wrangler@4 login`):\n" + out[-800:])
    return json.loads(out[start:])[0]["results"]


def pull():
    con = local()
    last = con.execute("SELECT COALESCE(MAX(id), 0) FROM events").fetchone()[0]
    total = 0
    while True:
        rows = d1(f"SELECT * FROM events WHERE id > {last} ORDER BY id LIMIT 200")
        if not rows:
            break
        con.executemany(f"INSERT OR REPLACE INTO events ({','.join(COLS)}) VALUES ({','.join('?' * len(COLS))})",
                        [[r.get(c) for c in COLS] for r in rows])
        con.commit()
        last, total = rows[-1]["id"], total + len(rows)
    print(f"pulled {total} new rows -> {LOCAL} (last id {last})")


def lang_rules():
    for line in (HERE / "lang_watch.txt").read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#"):
            lvl, phrase = line.split("|", 1)
            yield int(lvl), phrase


def lang_hits(text):
    """Book-style check of one answer: banned phrases, dashes, commas between clauses."""
    hits = Counter()
    for lvl, p in lang_rules():
        n = text.count(p)
        if (lvl == 1 and n) or (lvl == 2 and n > 2):
            hits[p] += n
    for p in ("—", "–"):
        if p in text:
            hits[f"ขีดยาว {p}"] += text.count(p)
    commas = len(re.findall(r"(?<![0-9]),(?![0-9])", text))
    if commas > 2:
        hits["จุลภาค"] += commas
    return hits


def table(title, rows, head):
    out = [f"\n### {title}\n", "| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    out += ["| " + " | ".join(str(c if c is not None else "–").replace("|", "/").replace("\n", " ") for c in r) + " |" for r in rows]
    return out


def report():
    con = local()
    q = lambda s, *a: con.execute(s, a).fetchall()
    n = q("SELECT COUNT(*), COUNT(DISTINCT visitor || day), MIN(day), MAX(day) FROM events")[0]
    md = [f"# รายงานการใช้งานหอดาราทาโรต์\n", f"ข้อมูล {n[0]} ครั้ง ผู้ใช้ราว {n[1]} คน-วัน ช่วง {n[2]} ถึง {n[3]} (ไฟล์ {LOCAL})"]
    md += table("ต่อวัน", q("SELECT day, COUNT(*), SUM(type='reading'), SUM(type='chat'), COUNT(DISTINCT visitor) FROM events GROUP BY day ORDER BY day DESC LIMIT 30"),
                ["วัน", "ทั้งหมด", "คำทำนาย", "ถามต่อ", "ผู้ใช้"])
    for col, title in [("type", "ชนิดคำขอ"), ("topic", "หัวข้อ"), ("qtype", "แบบคำถาม"), ("spread", "แบบการวาง"), ("lens", "เลนส์ปรัชญา"),
                       ("life_stage", "ช่วงชีวิต"), ("status", "ผลลัพธ์"), ("model", "รุ่น Gemini")]:
        md += table(title, q(f"SELECT {col}, COUNT(*), ROUND(AVG(ms)/1000.0, 1) FROM events GROUP BY {col} ORDER BY 2 DESC"), [col, "ครั้ง", "วินาทีเฉลี่ย"])
    md += table("ผู้ถามต่ำกว่า 18 ปี", q("SELECT SUM(minor), COUNT(*) FROM events WHERE type='reading'"), ["minor", "จากคำทำนาย"])
    md += table("คำถามล่าสุด 40 ข้อ", q("SELECT day, topic, qtype, spread, question FROM events WHERE type='reading' AND question <> '' ORDER BY id DESC LIMIT 40"),
                ["วัน", "หัวข้อ", "แบบ", "การวาง", "คำถาม"])
    md += table("ถามต่อล่าสุด 40 ข้อ", q("SELECT e.day, r.question, e.question FROM events e LEFT JOIN events r ON r.rid = e.rid AND r.type='reading' WHERE e.type='chat' ORDER BY e.id DESC LIMIT 40"),
                ["วัน", "คำถามหลัก", "ถามต่อ"])
    # Thai has no spaces between words, so whole questions are counted: the suggested follow-ups show up here when people tap them
    md += table("คำถามต่อที่ซ้ำกันบ่อย", q("SELECT question, COUNT(*) FROM events WHERE type='chat' GROUP BY question HAVING COUNT(*) > 1 ORDER BY 2 DESC LIMIT 25"), ["คำถาม", "ครั้ง"])
    # language: the book's checklist run over every answer the oracle actually gave
    answers = q("SELECT id, type, answer FROM events WHERE status='ok' AND answer IS NOT NULL")
    total, worst, perfect = Counter(), [], 0
    for i, t, a in answers:
        h = lang_hits(a)
        total.update(h)
        perfect += not h
        if h:
            worst.append((sum(h.values()), i, t, ", ".join(f"{k}×{v}" for k, v in h.most_common(5))))
    md.append(f"\n### ภาษาของคำตอบ (กฎจากคู่มือสำนวนของหนังสือ)\n\nคำตอบที่สำเร็จ {len(answers)} ชิ้น ผ่านทุกข้อ {perfect} ชิ้น")
    md += table("อาการที่พบบ่อย", total.most_common(20), ["อาการ", "ครั้งรวม"])
    md += table("คำตอบที่พลาดมากที่สุด (ดูเต็มด้วย: python usage.py sql \"SELECT answer FROM events WHERE id=N\")", sorted(worst, reverse=True)[:15],
                ["จุด", "id", "ชนิด", "อาการ"])
    text = "\n".join(md) + "\n"
    (LOCAL.parent / "report.md").write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    cmd = sys.argv[1] if len(sys.argv) > 1 else "report"
    if cmd == "pull":
        pull()
    elif cmd == "report":
        report()
    elif cmd == "sql":
        for row in local().execute(sys.argv[2]):
            print(row)
    else:
        print(__doc__)
