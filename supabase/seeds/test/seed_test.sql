-- Test seed data — fictional members and a sample season
-- Safe to commit: no real personal data

-- ─── Members ────────────────────────────────────────────────────────────────
INSERT INTO members (name, seniority) VALUES
  ('Ana García Test',        '1995-01-01'),
  ('Carlos López Test',      '1998-03-01'),
  ('María Rodríguez Test',   '2000-06-01'),
  ('Pedro Martínez Test',    '2003-09-01'),
  ('Laura Sánchez Test',     '2005-11-01'),
  ('Javier Fernández Test',  '2010-02-01'),
  ('Elena Gómez Test',       '2015-04-01'),
  ('Sergio Torres Test',     '2018-07-01'),
  ('Lucía Navarro Test',     '2020-10-01'),
  ('Pablo Moreno Test',      '2022-01-01');

-- ─── Season ─────────────────────────────────────────────────────────────────
INSERT INTO seasons (year, is_active) VALUES (2099, true);

-- ─── Outings (5 salidas dominicales) ────────────────────────────────────────
INSERT INTO outings (season_id, date, description)
SELECT
  (SELECT id FROM seasons WHERE year = 2099),
  outing_date,
  'Salida test ' || to_char(outing_date, 'DD/MM/YYYY')
FROM (VALUES
  ('2099-01-06'::date),
  ('2099-01-13'::date),
  ('2099-01-20'::date),
  ('2099-01-27'::date),
  ('2099-02-03'::date)
) AS t(outing_date);

-- ─── Attendances ─────────────────────────────────────────────────────────────
WITH test_data(nombre, salidas, asterisco) AS (
  VALUES
    ('Ana García Test',       5, false),
    ('Carlos López Test',     4, false),
    ('María Rodríguez Test',  4, true),
    ('Pedro Martínez Test',   3, false),
    ('Laura Sánchez Test',    3, false),
    ('Javier Fernández Test', 2, false),
    ('Elena Gómez Test',      2, true),
    ('Sergio Torres Test',    1, false),
    ('Lucía Navarro Test',    1, false),
    ('Pablo Moreno Test',     0, false)
),
miembros AS (
  SELECT t.salidas, t.asterisco, m.id AS member_id
  FROM test_data t
  JOIN members m ON m.name = t.nombre
),
salidas_numeradas AS (
  SELECT id AS outing_id, ROW_NUMBER() OVER (ORDER BY date) AS num
  FROM outings
  WHERE season_id = (SELECT id FROM seasons WHERE year = 2099)
)
INSERT INTO attendances (outing_id, member_id, completed)
SELECT
  s.outing_id,
  m.member_id,
  CASE WHEN m.asterisco AND s.num = m.salidas THEN false ELSE true END
FROM miembros m
JOIN salidas_numeradas s ON s.num <= m.salidas;
