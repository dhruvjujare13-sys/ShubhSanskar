-- Adds the Google Meet link field and the live whiteboard feature.
-- Run this once in the SQL Editor.

alter table public.students add column if not exists meet_link text not null default '';

create table if not exists public.whiteboard_strokes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  author text not null check (author in ('teacher', 'student')),
  points jsonb not null,
  color text not null default '#4a2545',
  width integer not null default 3,
  created_at timestamptz not null default now()
);
create index if not exists whiteboard_strokes_student_id_idx on public.whiteboard_strokes (student_id);

alter table public.whiteboard_strokes enable row level security;

create policy "whiteboard_select_teacher"
  on public.whiteboard_strokes for select
  using (public.is_teacher());

create policy "whiteboard_insert_teacher"
  on public.whiteboard_strokes for insert
  with check (public.is_teacher());

create policy "whiteboard_delete_teacher"
  on public.whiteboard_strokes for delete
  using (public.is_teacher());
