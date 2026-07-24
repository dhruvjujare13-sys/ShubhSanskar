-- Allows a parent to delete their own child, or the teacher to delete any student.
-- Their progress_entries and assignments rows are removed automatically
-- (both reference students with "on delete cascade").
-- Run this once in the SQL Editor.

create policy "students_delete_own_or_teacher"
  on public.students for delete
  using (parent_id = auth.uid() or public.is_teacher());
