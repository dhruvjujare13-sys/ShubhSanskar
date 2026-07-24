-- Adds subject enrollment + intake info (age, grade, notes) to students.
-- Run this once in the SQL Editor if your project already ran the original schema.sql.

alter table public.students
  add column if not exists subjects text[] not null default '{}',
  add column if not exists age integer,
  add column if not exists grade text not null default '',
  add column if not exists notes text not null default '';
