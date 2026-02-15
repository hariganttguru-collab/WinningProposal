-- Enable Realtime for these tables
-- Run this in the Supabase SQL Editor

-- 1. Create Lobbies Table
CREATE TABLE IF NOT EXISTS lobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  admin_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, in-progress, completed
  simulation_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Players Table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lobby_id UUID REFERENCES lobbies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- admin, user
  is_ready BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  bid_data JSONB,
  UNIQUE(lobby_id, user_id)
);

-- 3. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE lobbies;
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- 4. Set up RLS (optional for demo, but good practice)
-- For now, we'll keep it simple and assume everyone can read/write to active lobbies by code.
-- In a production app, you'd add more restrictive RLS rules.
ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write to lobbies" ON lobbies FOR ALL USING (true);
CREATE POLICY "Allow public read/write to players" ON players FOR ALL USING (true);
