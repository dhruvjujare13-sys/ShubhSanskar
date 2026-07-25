-- Lets parents pick which math topics actually apply to their child
-- (Algebra 1, Geometry, homework help, etc.) instead of every math student
-- being shown the same beginner-level curriculum regardless of age.
-- Run this once in the SQL Editor.

alter table public.students add column if not exists math_topics text[] not null default '{}';
