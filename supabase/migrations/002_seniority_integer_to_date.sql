-- Migrate seniority from INTEGER (year only) to DATE (first day of month)

-- Drop view that depends on seniority column
DROP VIEW IF EXISTS classification;

-- Alter column type
ALTER TABLE members
  ALTER COLUMN seniority TYPE DATE
  USING make_date(seniority, 1, 1);

-- Recreate classification view
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
