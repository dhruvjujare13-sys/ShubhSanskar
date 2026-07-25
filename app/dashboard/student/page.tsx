import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/getStudentSession";
import { createAdminClient } from "@/lib/supabase/admin";
import StudentSignOutButton from "@/components/dashboard/StudentSignOutButton";
import Logo from "@/components/Logo";
import MasteryCelebration from "@/components/practice/MasteryCelebration";
import StudentDashboardContent from "@/components/dashboard/StudentDashboardContent";
import JoinClassButton from "@/components/JoinClassButton";
import StudentWhiteboardPanel from "@/components/whiteboard/StudentWhiteboardPanel";
import { SUBJECTS } from "@/lib/types";
import type { Assignment, ProgressEntry, Student, Subject, WhiteboardStroke } from "@/lib/types";
import { getRecentlyMastered } from "@/lib/mastery";

export default async function StudentDashboardPage() {
  const session = await getStudentSession();
  if (!session) redirect("/student-login");

  const supabase = createAdminClient();

  const [{ data: studentRow }, { data: progress }, { data: assignments }, { data: strokes }] = await Promise.all([
    supabase
      .from("students")
      .select("id, parent_id, full_name, username, subjects, age, grade, notes, meet_link, math_topics")
      .eq("id", session.studentId)
      .maybeSingle() as unknown as Promise<{ data: Student | null }>,
    supabase
      .from("progress_entries")
      .select("id, student_id, subject, topic, status, notes, updated_at")
      .eq("student_id", session.studentId)
      .order("updated_at", { ascending: false }) as unknown as Promise<{ data: ProgressEntry[] | null }>,
    supabase
      .from("assignments")
      .select("id, student_id, subject, title, description, completed, completed_at, created_at")
      .eq("student_id", session.studentId)
      .order("created_at", { ascending: false }) as unknown as Promise<{ data: Assignment[] | null }>,
    supabase
      .from("whiteboard_strokes")
      .select("id, student_id, author, points, color, width, created_at")
      .eq("student_id", session.studentId)
      .order("created_at", { ascending: true }) as unknown as Promise<{ data: WhiteboardStroke[] | null }>,
  ]);

  if (!studentRow) redirect("/student-login");

  const enrolledSubjects = SUBJECTS.filter((s) => (studentRow.subjects ?? []).includes(s.value)).map(
    (s) => s.value
  );

  const allProgress = progress ?? [];
  const allAssignments = assignments ?? [];
  const openAssignments = allAssignments.filter((a) => !a.completed);

  const latestBySubject = new Map<Subject, ProgressEntry>();
  for (const entry of allProgress) {
    if (!latestBySubject.has(entry.subject)) latestBySubject.set(entry.subject, entry);
  }

  const masteredCountBySubject = new Map<Subject, number>();
  for (const entry of allProgress) {
    if (entry.status === "mastered") {
      masteredCountBySubject.set(entry.subject, (masteredCountBySubject.get(entry.subject) ?? 0) + 1);
    }
  }

  const recentlyMastered = getRecentlyMastered(allProgress);

  const todaysLesson =
    openAssignments[0]?.title ??
    [...latestBySubject.values()].find((p) => p.status === "in_progress")?.topic ??
    "Free practice time! Try a game below.";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky/10 to-sunny">
      <MasteryCelebration recentlyMastered={recentlyMastered} />
      <header className="border-b-4 border-marigold bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden font-semibold text-slate sm:block">Hi, {session.fullName}!</span>
            <StudentSignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {studentRow.meet_link && (
          <div className="mb-6">
            <JoinClassButton meetLink={studentRow.meet_link} />
          </div>
        )}

        <div className="mb-6">
          <StudentWhiteboardPanel studentId={studentRow.id} initialStrokes={strokes ?? []} />
        </div>

        <StudentDashboardContent
          mode="student"
          enrolledSubjects={enrolledSubjects}
          masteredCountBySubject={masteredCountBySubject}
          openAssignments={openAssignments}
          todaysLesson={todaysLesson}
        />
      </main>
    </div>
  );
}
