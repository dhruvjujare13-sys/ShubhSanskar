import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/getStudentSession";
import { createAdminClient } from "@/lib/supabase/admin";
import StudentSignOutButton from "@/components/dashboard/StudentSignOutButton";
import Logo from "@/components/Logo";
import LetterFlipGame from "@/components/practice/LetterFlipGame";
import CountingGame from "@/components/practice/CountingGame";
import MasteryCelebration from "@/components/practice/MasteryCelebration";
import AssignmentList from "./AssignmentList";
import { SUBJECTS } from "@/lib/types";
import type { Assignment, ProgressEntry, Student, Subject } from "@/lib/types";
import { getRecentlyMastered } from "@/lib/mastery";

export default async function StudentDashboardPage() {
  const session = await getStudentSession();
  if (!session) redirect("/student-login");

  const supabase = createAdminClient();

  const [{ data: studentRow }, { data: progress }, { data: assignments }] = await Promise.all([
    supabase
      .from("students")
      .select("id, parent_id, full_name, username, subjects, age, grade, notes")
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
  ]);

  if (!studentRow) redirect("/student-login");

  const enrolledSubjects = SUBJECTS.filter((s) => (studentRow.subjects ?? []).includes(s.value));
  const showLetters = enrolledSubjects.some((s) => s.value === "hindi" || s.value === "marathi");
  const showCounting = enrolledSubjects.some((s) => s.value === "math");

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
    "Free practice time — try a game below!";

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
        <div className="mb-6 rounded-3xl bg-marigold p-6 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Today&apos;s Lesson</p>
          <h1 className="font-heading text-3xl">{todaysLesson}</h1>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {enrolledSubjects.map(({ value, label }) => (
            <div key={value} className="rounded-2xl bg-white p-4 text-center shadow border-2 border-marigold/20">
              <p className="font-heading font-bold text-plum">{label}</p>
              <p className="mt-1 text-2xl" title={`${masteredCountBySubject.get(value) ?? 0} mastered`}>
                {"⭐".repeat(Math.min(masteredCountBySubject.get(value) ?? 0, 5)) || "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg border-2 border-grass/30">
          <h2 className="font-heading text-xl text-plum mb-3">Your practice</h2>
          <AssignmentList assignments={openAssignments} />
        </div>

        {showLetters && (
          <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg border-2 border-teal/30">
            <h2 className="font-heading text-xl text-plum mb-3">Letters game</h2>
            <LetterFlipGame />
          </div>
        )}

        {showCounting && (
          <div className="rounded-3xl bg-white p-6 shadow-lg border-2 border-sky/30">
            <h2 className="font-heading text-xl text-plum mb-3">Counting game</h2>
            <CountingGame />
          </div>
        )}
      </main>
    </div>
  );
}
