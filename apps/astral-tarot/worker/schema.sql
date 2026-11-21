-- usage log of the Astral Tarot oracle (D1). Apply: npx wrangler@4 d1 execute astral-tarot-usage --remote --file schema.sql
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT,                    -- random id kept on the asker's device (localStorage astral-uid)
  name TEXT,                   -- name typed in the form, optional
  ts TEXT NOT NULL,            -- ISO time (UTC)
  day TEXT NOT NULL,           -- day in Thailand (UTC+7)
  visitor TEXT,                -- salted hash of IP, changes daily
  kind TEXT,                   -- reading | chat (quota bucket)
  type TEXT,                   -- reading | chat | journal | bond
  rid TEXT,                    -- reading code: links follow-up chats to their reading
  question TEXT,               -- reading/chat only
  topic TEXT, qtype TEXT, subject TEXT, spread TEXT,
  cards TEXT, shadow TEXT,
  life_stage TEXT, minor INTEGER, lens TEXT, overall INTEGER, rel TEXT,
  model TEXT, status TEXT,     -- ok | empty | rate_limited | unavailable | quota_site | quota_visitor
  ms INTEGER,
  answer TEXT,                 -- reading/chat only
  answer_chars INTEGER,
  ttft INTEGER,                -- ms until the first word reached the asker
  attempts TEXT,               -- each model tried: model[/thinking]:status@seconds
  star INTEGER DEFAULT 0       -- starred in /admin: used as an example for Gemini
);
CREATE INDEX IF NOT EXISTS events_day ON events(day);
CREATE INDEX IF NOT EXISTS events_rid ON events(rid);
CREATE INDEX IF NOT EXISTS events_uid ON events(uid);
