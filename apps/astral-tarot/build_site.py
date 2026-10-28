"""Build the public website for Astral Tarot.

index.html is written for the claude.ai Artifact host, which supplies the
<!doctype>, <head> and <body> wrapper. This script adds that wrapper so the
same page runs as a plain static site (GitHub Pages), moving the title, meta
and font links into <head> and adding a description, theme colour and icon.

If ORACLE_URL is set (the Cloudflare Worker in worker/), the page is told to
ask Gemini through it; otherwise readings come from the house book only.

If REDIRECT_TO is set, the build is instead a small page that sends visitors on
to that address, keeping the query and hash. GitHub Pages uses this since the
site moved to Cloudflare Pages.

Usage: python3 apps/astral-tarot/build_site.py [out_dir]   (default: site/)
"""
import json
import os
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site")
ORACLE_URL = os.environ.get("ORACLE_URL", "").strip().rstrip("/")
REDIRECT_TO = os.environ.get("REDIRECT_TO", "").strip().rstrip("/")

DESCRIPTION = "หอดาราทาโรต์ ดูดวงไพ่ทาโรต์ 78 ใบ สับไพ่จริง อ่านคำทำนายตรงคำถาม ไพ่ประจำวันกับดวงจันทร์ สมุดดวง คลังไพ่ และดวงคู่"
ICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-12 -12 24 24'%3E"
        "%3Crect x='-12' y='-12' width='24' height='24' rx='5' fill='%23070814'/%3E"
        "%3Cpath d='M0-9L2-2 9 0 2 2 0 9-2 2-9 0-2-2Z' fill='%23e8c46a'/%3E%3C/svg%3E")


def build_redirect() -> pathlib.Path:
    to = json.dumps(REDIRECT_TO + "/")
    html = "\n".join([
        "<!doctype html>",
        '<html lang="th">',
        "<head>",
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        "<title>หอดาราทาโรต์ย้ายบ้านแล้ว</title>",
        f'<link rel="canonical" href="{REDIRECT_TO}/">',
        f'<meta http-equiv="refresh" content="0; url={REDIRECT_TO}/">',
        f"<script>location.replace({to} + location.search + location.hash);</script>",
        "<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070814;color:#e8c46a;font:18px serif;text-align:center}a{color:#fff0c2}</style>",
        "</head>",
        f'<body><p>หอดาราทาโรต์ย้ายไปที่<br><a href="{REDIRECT_TO}/">{REDIRECT_TO.split("//")[-1]}</a></p></body>',
        "</html>",
        "",
    ])
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(html, encoding="utf-8")
    (OUT / ".nojekyll").write_text("", encoding="utf-8")
    return OUT / "index.html"


def build() -> pathlib.Path:
    src = (HERE / "index.html").read_text(encoding="utf-8")
    style_at = src.index("<style>")
    head_part, body_part = src[:style_at], src[style_at:]
    head_part = re.sub(r'<meta name="claude:[^"]*"[^>]*>\n?', "", head_part)
    head = "\n".join([
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
        f'<meta name="description" content="{DESCRIPTION}">',
        '<meta name="theme-color" content="#070814">',
        '<meta property="og:title" content="หอดาราทาโรต์">',
        f'<meta property="og:description" content="{DESCRIPTION}">',
        '<meta property="og:type" content="website">',
        f'<link rel="icon" href="{ICON}">',
        # the same small reset the Artifact host puts in front of the page
        "<style>body{margin:0}[hidden]{display:none!important}</style>",
        *([f"<script>window.ASTRAL_ORACLE_URL = {json.dumps(ORACLE_URL)};</script>"] if ORACLE_URL else []),
        head_part.strip(),
    ])
    html = f"<!doctype html>\n<html lang=\"th\">\n<head>\n{head}\n</head>\n<body>\n{body_part}\n</body>\n</html>\n"
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(html, encoding="utf-8")
    (OUT / ".nojekyll").write_text("", encoding="utf-8")
    return OUT / "index.html"


if __name__ == "__main__":
    print(f"built {build_redirect() if REDIRECT_TO else build()}")
