-- 2026-11-21: who asked (admin monitor). Apply once: npx wrangler@4 d1 execute astral-tarot-usage --remote --file migrate_0002_uid_name.sql
ALTER TABLE events ADD COLUMN uid TEXT;
ALTER TABLE events ADD COLUMN name TEXT;
CREATE INDEX IF NOT EXISTS events_uid ON events(uid);
