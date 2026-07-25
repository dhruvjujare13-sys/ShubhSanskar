import LetterFlipGame from "@/components/practice/LetterFlipGame";
import CountingGame from "@/components/practice/CountingGame";
import AssignmentList from "@/app/dashboard/student/AssignmentList";
import { SUBJECTS } from "@/lib/types";
import type { Assignment, Subject } from "@/lib/types";

export type StudentDashboardMode = "student" | "teacher-preview" | "parent-preview";

export default function StudentDashboardContent({
  mode,
  enrolledSubjects,
  masteredCountBySubject,
  openAssignments,
  todaysLesson,
}: {
  mode: StudentDashboardMode;
  enrolledSubjects: Subject[];
  masteredCountBySubject: Map<Subject, number>;
  openAssignments: Assignment[];
  todaysLesson: string;
}) {
  const showLetters = enrolledSubjects.includes("hindi") || enrolledSubjects.includes("marathi");
  const showCounting = enrolledSubjects.includes("math");
  const showGames = mode !== "parent-preview";
  const subjectLabels = SUBJECTS.filter((s) => enrolledSubjects.includes(s.value));

  return (
    <>
      <div className="mb-6 rounded-3xl bg-marigold p-6 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Today&apos;s Lesson</p>
        <h1 className="font-heading text-3xl">{todaysLesson}</h1>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {subjectLabels.map(({ value, label }) => (
          <div key={value} className="rounded-2xl bg-white p-4 text-center shadow border-2 border-marigold/20">
            <p className="font-heading font-bold text-plum">{label}</p>
            <p className="mt-1 text-2xl" title={`${masteredCountBySubject.get(value) ?? 0} mastered`}>
              {"⭐".repeat(Math.min(masteredCountBySubject.get(value) ?? 0, 5)) || "☆"}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg border-2 border-grass/30">
        <h2 className="font-heading text-xl text-plum mb-3">
          {mode === "student" ? "Your practice" : "Assigned practice"}
        </h2>
        <AssignmentList assignments={openAssignments} readOnly={mode !== "student"} />
      </div>

      {showGames && showLetters && (
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg border-2 border-teal/30">
          <h2 className="font-heading text-xl text-plum mb-3">Letters game</h2>
          <LetterFlipGame />
        </div>
      )}

      {showGames && showCounting && (
        <div className="rounded-3xl bg-white p-6 shadow-lg border-2 border-sky/30">
          <h2 className="font-heading text-xl text-plum mb-3">Counting game</h2>
          <CountingGame />
        </div>
      )}
    </>
  );
}
