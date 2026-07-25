import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import JoinClassButton from "@/components/JoinClassButton";
import StudentDashboardContent from "@/components/dashboard/StudentDashboardContent";
import { SUBJECTS } from "@/lib/types";
import type { Assignment, Profile, ProgressEntry, Student, Subject } from "@/lib/types";

export default async function ParentStudentViewPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
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
  if (profile?.role === "teacher") redirect("/dashboard/teacher");

  // RLS already restricts students to parent_id = auth.uid() (or teacher),
  // but this route is parent-only, so the .eq("parent_id", ...) below also
  // guards against a parent guessing another family's student id.
  const { data: student } = (await supabase
    .from("students")
    .select("id, parent_id, full_name, username, subjects, age, grade, notes, meet_link")
    .eq("id", studentId)
    .eq("parent_id", user.id)
    .maybeSingle()) as { data: Student | null };

  if (!student) notFound();

  const [progressRes, assignmentsRes] = await Promise.all([
    supabase
      .from("progress_entries")
      .select("id, student_id, subject, topic, status, notes, updated_at")
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("assignments")
      .select("id, student_id, subject, title, description, completed, completed_at, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false }),
  ]);

  const progress = (progressRes.data ?? []) as ProgressEntry[];
  const assignments = (assignmentsRes.data ?? []) as Assignment[];

  const enrolledSubjects = SUBJECTS.filter((s) => (student.subjects ?? []).includes(s.value)).map((s) => s.value);
  const openAssignments = assignments.filter((a) => !a.completed);

  const latestBySubject = new Map<Subject, ProgressEntry>();
  const masteredCountBySubject = new Map<Subject, number>();
  for (const entry of progress) {
    if (!latestBySubject.has(entry.subject)) latestBySubject.set(entry.subject, entry);
    if (entry.status === "mastered") {
      masteredCountBySubject.set(entry.subject, (masteredCountBySubject.get(entry.subject) ?? 0) + 1);
    }
  }

  const todaysLesson =
    openAssignments[0]?.title ??
    [...latestBySubject.values()].find((p) => p.status === "in_progress")?.topic ??
    "Free practice time!";

  return (
    <div className="flex min-h-screen flex-col bg-sunny">
      <DashboardHeader roleLabel="Parent" personName={profile?.full_name || "there"} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Link href="/dashboard/parent" className="text-sm font-semibold text-teal underline">
          &larr; Back to your children
        </Link>

        <div className="mt-2 mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-3xl text-plum">{student.full_name}&apos;s Dashboard</h1>
          <JoinClassButton meetLink={student.meet_link} />
        </div>

        <p className="mb-6 text-sm text-slate">
          This is a read-only view of what {student.full_name} sees on their own dashboard.
        </p>

        <StudentDashboardContent
          mode="parent-preview"
          enrolledSubjects={enrolledSubjects}
          masteredCountBySubject={masteredCountBySubject}
          openAssignments={openAssignments}
          todaysLesson={todaysLesson}
        />
      </main>
    </div>
  );
}
