-- 2026-11-21: speed diagnostics and starred examples. Apply once: npx wrangler@4 d1 execute astral-tarot-usage --remote --file migrate_0003_speed_star.sql
ALTER TABLE events ADD COLUMN ttft INTEGER;
ALTER TABLE events ADD COLUMN attempts TEXT;
ALTER TABLE events ADD COLUMN star INTEGER DEFAULT 0;
