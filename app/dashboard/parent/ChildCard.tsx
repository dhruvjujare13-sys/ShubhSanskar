"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SUBJECTS, STATUSES } from "@/lib/types";
import type { ActionState } from "@/lib/actions/auth";
import type { Assignment, ProgressEntry, Student, Subject } from "@/lib/types";
import { CURRICULUM } from "@/data/curriculum";
import { updateChild, deleteChild } from "@/lib/actions/parent";
import ConfirmDeleteForm from "@/components/dashboard/ConfirmDeleteForm";
import JoinClassButton from "@/components/JoinClassButton";

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-slate/20 text-slate",
  in_progress: "bg-sky/20 text-sky",
  mastered: "bg-grass/20 text-grass",
};

export default function ChildCard({
  student,
  progress,
  assignments,
}: {
  student: Student;
  progress: ProgressEntry[];
  assignments: Assignment[];
}) {
  const [editing, setEditing] = useState(false);
  const enrolledSubjects = SUBJECTS.filter((s) => (student.subjects ?? []).includes(s.value));

  const latestBySubject = new Map<Subject, ProgressEntry>();
  const statusByTopic = new Map<string, string>();
  for (const entry of progress) {
    if (!latestBySubject.has(entry.subject)) latestBySubject.set(entry.subject, entry);
    const key = `${entry.subject}:${entry.topic}`;
    if (!statusByTopic.has(key)) statusByTopic.set(key, entry.status);
  }
  const openAssignments = assignments.filter((a) => !a.completed);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg border-2 border-marigold/30">
      <div className="mb-1 flex items-start justify-between gap-2">
        <h2 className="font-heading text-2xl text-plum">{student.full_name}</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-xs font-semibold text-teal underline"
          >
            {editing ? "Cancel" : "Edit details"}
          </button>
          <Link
            href={`/dashboard/parent/students/${student.id}`}
            className="text-xs font-semibold text-teal underline"
          >
            View Dashboard
          </Link>
          <ConfirmDeleteForm
            action={deleteChild}
            hiddenFields={{ studentId: student.id }}
            confirmMessage={`Remove ${student.full_name}? This deletes their login and all their progress, and can't be undone.`}
            label="Remove"
          />
        </div>
      </div>
      <p className="mb-3 text-sm text-slate">
        Username: <span className="font-semibold">{student.username}</span> · PIN was set when you added them
        {student.age ? ` · Age ${student.age}` : ""}
        {student.grade ? ` · ${student.grade}` : ""}
      </p>

      {student.meet_link && (
        <div className="mb-4">
          <JoinClassButton meetLink={student.meet_link} />
        </div>
      )}

      {editing ? (
        <EditChildForm student={student} onSaved={() => setEditing(false)} />
      ) : (
        <>
          {enrolledSubjects.length === 0 ? (
            <p className="text-sm text-slate">
              No subjects selected yet. Click &quot;Edit details&quot; above to add them.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {enrolledSubjects.map(({ value, label }) => {
                const latest = latestBySubject.get(value);
                return (
                  <div key={value} className="rounded-2xl border-2 border-sunny bg-sunny/40 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-heading font-bold text-plum">{label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          STATUS_COLORS[latest?.status ?? "not_started"]
                        }`}
                      >
                        {latest ? STATUSES.find((s) => s.value === latest.status)?.label : "Not started"}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-slate">{latest ? latest.topic : "No progress logged yet"}</p>

                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate">
                      What they&apos;ll learn
                    </p>
                    <ol className="space-y-0.5 text-xs text-slate">
                      {CURRICULUM[value].map((stage) => {
                        const status = statusByTopic.get(`${value}:${stage}`);
                        return (
                          <li
                            key={stage}
                            className={
                              status === "mastered" ? "text-grass" : status === "in_progress" ? "font-semibold text-plum" : ""
                            }
                          >
                            {status === "mastered" ? "✓ " : "• "}
                            {stage}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}

          {openAssignments.length > 0 && (
            <div className="mt-4">
              <h3 className="font-heading font-bold text-plum mb-1">Assigned practice</h3>
              <ul className="space-y-1">
                {openAssignments.map((a) => (
                  <li key={a.id} className="rounded-lg bg-sunny/50 px-3 py-2 text-sm">
                    <span className="font-semibold text-plum">{a.title}</span>{" "}
                    <span className="text-slate">({SUBJECTS.find((s) => s.value === a.subject)?.label})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EditChildForm({ student, onSaved }: { student: Student; onSaved: () => void }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, formData) => {
    const result = await updateChild(prev, formData);
    if (!result) {
      onSaved();
      router.refresh();
    }
    return result;
  }, null);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="studentId" value={student.id} />
      <input
        name="fullName"
        required
        defaultValue={student.full_name}
        placeholder="First and last name"
        className="rounded-xl border-2 border-teal/40 px-3 py-2"
      />
      <input
        name="age"
        type="number"
        min={1}
        max={100}
        defaultValue={student.age ?? ""}
        placeholder="Age"
        className="rounded-xl border-2 border-teal/40 px-3 py-2"
      />
      <input
        name="grade"
        defaultValue={student.grade}
        placeholder="Grade / level (e.g. 2nd grade, Adult)"
        className="rounded-xl border-2 border-teal/40 px-3 py-2 sm:col-span-2"
      />

      <fieldset className="sm:col-span-2">
        <legend className="mb-1 text-sm font-semibold text-plum">What will they be learning?</legend>
        <div className="flex flex-wrap gap-4">
          {SUBJECTS.map((s) => (
            <label key={s.value} className="flex items-center gap-2 text-sm text-slate">
              <input
                type="checkbox"
                name="subjects"
                value={s.value}
                defaultChecked={(student.subjects ?? []).includes(s.value)}
                className="h-4 w-4 accent-teal"
              />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <textarea
        name="notes"
        defaultValue={student.notes}
        placeholder="Anything Shubhada should know? Prior experience, goals, etc. (optional)"
        className="rounded-xl border-2 border-teal/40 px-3 py-2 sm:col-span-2"
      />

      {state?.error && (
        <p className="sm:col-span-2 rounded-xl bg-blush px-4 py-2 text-sm text-plum">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 rounded-xl bg-teal py-2.5 font-heading font-bold text-white hover:bg-teal-dark disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
