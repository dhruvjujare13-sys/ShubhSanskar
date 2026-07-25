-- Bright Beginnings Tutoring — database schema + RLS policies
-- Run this once in the Supabase project's SQL Editor (Dashboard > SQL Editor > New query).

-- ---------- Tables ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('teacher', 'parent')) default 'parent',
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  username text not null unique,
  pin_hash text not null,
  subjects text[] not null default '{}',
  age integer,
  grade text not null default '',
  notes text not null default '',
  meet_link text not null default '',
  created_at timestamptz not null default now()
);
create index students_parent_id_idx on public.students (parent_id);

create table public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  subject text not null check (subject in ('hindi', 'marathi', 'math')),
  topic text not null,
  status text not null check (status in ('not_started', 'in_progress', 'mastered')) default 'not_started',
  notes text not null default '',
  updated_at timestamptz not null default now()
);
create index progress_entries_student_id_idx on public.progress_entries (student_id);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  subject text not null check (subject in ('hindi', 'marathi', 'math')),
  title text not null,
  description text not null default '',
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index assignments_student_id_idx on public.assignments (student_id);

create table public.whiteboard_strokes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  author text not null check (author in ('teacher', 'student')),
  points jsonb not null,
  color text not null default '#4a2545',
  width integer not null default 3,
  created_at timestamptz not null default now()
);
create index whiteboard_strokes_student_id_idx on public.whiteboard_strokes (student_id);

-- ---------- Auto-create a profile row whenever someone signs up ----------
-- New signups default to role 'parent'. The teacher's own row is promoted to
-- role = 'teacher' manually, once, after she signs up (see README).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    'parent',
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Helper: is the current user the teacher? ----------
-- SECURITY DEFINER so this query bypasses RLS on profiles (avoids recursive
-- RLS checks when policies below call it).

create or replace function public.is_teacher()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

-- ---------- Row Level Security ----------

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.progress_entries enable row level security;
alter table public.assignments enable row level security;
alter table public.whiteboard_strokes enable row level security;

-- profiles: everyone can see their own row; the teacher can see everyone's.
create policy "profiles_select_own_or_teacher"
  on public.profiles for select
  using (id = auth.uid() or public.is_teacher());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- students: a parent sees/manages only their own children; the teacher sees all.
create policy "students_select_own_or_teacher"
  on public.students for select
  using (parent_id = auth.uid() or public.is_teacher());

create policy "students_insert_own"
  on public.students for insert
  with check (parent_id = auth.uid());

create policy "students_update_own_or_teacher"
  on public.students for update
  using (parent_id = auth.uid() or public.is_teacher());

create policy "students_delete_own_or_teacher"
  on public.students for delete
  using (parent_id = auth.uid() or public.is_teacher());

-- progress_entries: parents can view their own child's progress; only the
-- teacher can create/edit progress (she's the one grading/tracking mastery).
create policy "progress_select_own_or_teacher"
  on public.progress_entries for select
  using (
    public.is_teacher()
    or exists (
      select 1 from public.students s
      where s.id = progress_entries.student_id and s.parent_id = auth.uid()
    )
  );

create policy "progress_write_teacher_only"
  on public.progress_entries for insert
  with check (public.is_teacher());

create policy "progress_update_teacher_only"
  on public.progress_entries for update
  using (public.is_teacher());

-- assignments: same pattern — parents view their own child's; teacher manages all.
-- (Students mark their own assignments complete through a server-side route
-- using the service role key, so no student-facing RLS policy is needed here.)
create policy "assignments_select_own_or_teacher"
  on public.assignments for select
  using (
    public.is_teacher()
    or exists (
      select 1 from public.students s
      where s.id = assignments.student_id and s.parent_id = auth.uid()
    )
  );

create policy "assignments_write_teacher_only"
  on public.assignments for insert
  with check (public.is_teacher());

create policy "assignments_update_teacher_or_owning_family"
  on public.assignments for update
  using (
    public.is_teacher()
    or exists (
      select 1 from public.students s
      where s.id = assignments.student_id and s.parent_id = auth.uid()
    )
  );

-- whiteboard_strokes: teacher-only via the browser client (RLS). The student
-- side goes through a server route using the service-role key instead, since
-- students aren't Supabase Auth users — see app/api/student/whiteboard-stroke.
create policy "whiteboard_select_teacher"
  on public.whiteboard_strokes for select
  using (public.is_teacher());

create policy "whiteboard_insert_teacher"
  on public.whiteboard_strokes for insert
  with check (public.is_teacher());

create policy "whiteboard_delete_teacher"
  on public.whiteboard_strokes for delete
  using (public.is_teacher());
