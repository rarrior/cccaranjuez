-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  seniority DATE NOT NULL,  -- primer dia del mes de alta (ej: 2020-03-01)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seasons table
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Outings table
CREATE TABLE outings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Attendances table
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outing_id UUID REFERENCES outings(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(outing_id, member_id)
);

-- Classification view
CREATE OR REPLACE VIEW classification AS
SELECT
  m.id,
  m.name,
  m.seniority,
  COUNT(a.id)::integer * 3 AS points,
  BOOL_OR(NOT a.completed) AS has_asterisk,
  COUNT(a.id) FILTER (WHERE NOT a.completed)::integer AS asterisk_count,
  s.year
FROM members m
JOIN attendances a ON a.member_id = m.id
JOIN outings o ON o.id = a.outing_id
JOIN seasons s ON s.id = o.season_id
WHERE s.is_active = true
GROUP BY m.id, m.name, m.seniority, s.year
ORDER BY points DESC, asterisk_count ASC, m.seniority ASC, m.name ASC;

-- Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE outings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public read seasons" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read outings" ON outings FOR SELECT USING (true);
CREATE POLICY "Public read attendances" ON attendances FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Auth insert members" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update members" ON members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete members" ON members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert seasons" ON seasons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update seasons" ON seasons FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete seasons" ON seasons FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert outings" ON outings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update outings" ON outings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete outings" ON outings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert attendances" ON attendances FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update attendances" ON attendances FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete attendances" ON attendances FOR DELETE USING (auth.role() = 'authenticated');
