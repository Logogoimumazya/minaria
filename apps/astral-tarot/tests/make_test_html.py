"""Wrap index.html the way the Artifact host does, for the Playwright tests (writes tests/test.html)."""
import pathlib
HERE = pathlib.Path(__file__).resolve().parent
src = (HERE.parent / "index.html").read_text(encoding="utf-8")
(HERE / "test.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>' + src + "</body></html>", encoding="utf-8")
(HERE / "out").mkdir(exist_ok=True)
print("wrote", HERE / "test.html")
