import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StudentCard from "./StudentCard";
import type { Assignment, Profile, ProgressEntry, Student } from "@/lib/types";

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone")
    .eq("id", user.id)
    .maybeSingle<Profile>();
  if (profile?.role !== "teacher") redirect("/dashboard/parent");

  const [studentsRes, parentsRes, progressRes, assignmentsRes] = await Promise.all([
    supabase
      .from("students")
      .select("id, parent_id, full_name, username, subjects, age, grade, notes, meet_link")
      .order("full_name"),
    supabase.from("profiles").select("id, role, full_name, phone").eq("role", "parent"),
    supabase
      .from("progress_entries")
      .select("id, student_id, subject, topic, status, notes, updated_at")
      .order("updated_at", { ascending: false }),
    supabase
      .from("assignments")
      .select("id, student_id, subject, title, description, completed, completed_at, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const students = studentsRes.data as Student[] | null;
  const parents = parentsRes.data as Profile[] | null;
  const progress = progressRes.data as ProgressEntry[] | null;
  const assignments = assignmentsRes.data as Assignment[] | null;

  const parentsById = new Map((parents ?? []).map((p) => [p.id, p]));

  return (
    <div className="flex min-h-screen flex-col bg-sunny">
      <DashboardHeader roleLabel="Teacher" personName={profile.full_name || "Shubhada"} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="font-heading text-3xl text-plum mb-2">Your students</h1>
        <p className="text-slate mb-6">
          {students?.length ?? 0} student{(students?.length ?? 0) === 1 ? "" : "s"} across{" "}
          {parentsById.size} famil{parentsById.size === 1 ? "y" : "ies"}.
        </p>

        {(!students || students.length === 0) && (
          <p className="rounded-2xl bg-white p-6 text-slate shadow border-2 border-marigold/30">
            No students yet. Once a parent signs up and adds their child, they&apos;ll show up here.
          </p>
        )}

        <div className="grid gap-6">
          {students?.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              parent={parentsById.get(student.parent_id)}
              progress={(progress ?? []).filter((p) => p.student_id === student.id)}
              assignments={(assignments ?? []).filter((a) => a.student_id === student.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
