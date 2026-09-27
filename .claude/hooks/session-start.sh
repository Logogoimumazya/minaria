#!/bin/bash
# SessionStart hook: ใส่สรุปสถานะ instance Minaria ลงใน context ตอนเริ่ม session
set -euo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"
python3 tools/instance_summary.py || true
