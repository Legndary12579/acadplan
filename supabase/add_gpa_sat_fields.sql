-- Run this in Supabase → SQL Editor to add support for weighted GPA
-- and SAT superscore. Existing columns (gpa, sat_score, location) are
-- kept as-is — gpa now stores the unweighted GPA, location stores the
-- ZIP code — so no data is lost, this just adds two new columns.

alter table student_plans
  add column if not exists gpa_weighted text,
  add column if not exists sat_superscore text;
