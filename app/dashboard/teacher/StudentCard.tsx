"use client";

import { useState } from "react";
import Link from "next/link";
import { logProgress, addAssignment, deleteStudent, setMeetLink } from "@/lib/actions/teacher";
import { SUBJECTS, STATUSES } from "@/lib/types";
import type { Assignment, Profile, ProgressEntry, Student, Subject } from "@/lib/types";
import { CURRICULUM } from "@/data/curriculum";
import ConfirmDeleteForm from "@/components/dashboard/ConfirmDeleteForm";
import JoinClassButton from "@/components/JoinClassButton";

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-slate/20 text-slate",
  in_progress: "bg-sky/20 text-sky",
  mastered: "bg-grass/20 text-grass",
};

export default function StudentCard({
  student,
  parent,
  progress,
  assignments,
}: {
  student: Student;
  parent?: Profile;
  progress: ProgressEntry[];
  assignments: Assignment[];
}) {
  const [openSubject, setOpenSubject] = useState<Subject | null>(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingMeetLink, setEditingMeetLink] = useState(false);

  const enrolledSubjects = SUBJECTS.filter((s) => (student.subjects ?? []).includes(s.value));

  const latestBySubject = new Map<Subject, ProgressEntry>();
  for (const entry of progress) {
    if (!latestBySubject.has(entry.subject)) latestBySubject.set(entry.subject, entry);
  }
  const openAssignments = assignments.filter((a) => !a.completed);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg border-2 border-marigold/30">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-heading text-2xl text-plum">{student.full_name}</h2>
          <p className="text-sm text-slate">
            @{student.username}
            {student.age ? ` · Age ${student.age}` : ""}
            {student.grade ? ` · ${student.grade}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {parent && (
            <p className="text-sm text-slate">
              Parent: {parent.full_name} {parent.phone && `· ${parent.phone}`}
            </p>
          )}
          <Link
            href={`/dashboard/teacher/students/${student.id}`}
            className="text-xs font-semibold text-teal underline"
          >
            Live Session
          </Link>
          <ConfirmDeleteForm
            action={deleteStudent}
            hiddenFields={{ studentId: student.id }}
            confirmMessage={`Remove ${student.full_name}? This deletes their login and all their progress, and can't be undone.`}
            label="Remove"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <JoinClassButton meetLink={student.meet_link} />
        <button
          type="button"
          onClick={() => setEditingMeetLink((v) => !v)}
          className="text-xs font-semibold text-teal underline"
        >
          {editingMeetLink ? "Cancel" : student.meet_link ? "Edit Meet link" : "Add Google Meet link"}
        </button>
      </div>

      {editingMeetLink && (
        <form
          action={async (formData) => {
            await setMeetLink(formData);
            setEditingMeetLink(false);
          }}
          className="mb-4 flex flex-wrap gap-2"
        >
          <input type="hidden" name="studentId" value={student.id} />
          <input
            name="meetLink"
            type="url"
            defaultValue={student.meet_link}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            className="min-w-0 flex-1 rounded-lg border border-marigold/40 px-2 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-teal px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-dark"
          >
            Save
          </button>
        </form>
      )}

      {student.notes && (
        <p className="mb-4 rounded-xl bg-sunny/50 px-3 py-2 text-sm text-slate">
          <span className="font-semibold text-plum">Notes: </span>
          {student.notes}
        </p>
      )}

      {enrolledSubjects.length === 0 ? (
        <p className="text-sm text-slate">No subjects selected for this student yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {enrolledSubjects.map(({ value, label }) => {
            const latest = latestBySubject.get(value);
            const topicOptions =
              value === "math" && student.math_topics?.length ? student.math_topics : CURRICULUM[value];
            return (
              <div key={value} className="rounded-2xl border-2 border-sunny bg-sunny/40 p-3">
                <div className="mb-2 flex items-center justify-between">
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
                <button
                  type="button"
                  onClick={() => setOpenSubject(openSubject === value ? null : value)}
                  className="text-xs font-semibold text-teal underline"
                >
                  {openSubject === value ? "Cancel" : "Log progress"}
                </button>

                {openSubject === value && (
                  <form
                    action={async (formData) => {
                      await logProgress(formData);
                      setOpenSubject(null);
                    }}
                    className="mt-3 space-y-2"
                  >
                    <input type="hidden" name="studentId" value={student.id} />
                    <input type="hidden" name="subject" value={value} />
                    <select name="topic" required className="w-full rounded-lg border border-marigold/40 px-2 py-1 text-sm">
                      <option value="">Curriculum stage…</option>
                      {topicOptions.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                    <select name="status" className="w-full rounded-lg border border-marigold/40 px-2 py-1 text-sm">
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="notes"
                      placeholder="Notes (optional)"
                      className="w-full rounded-lg border border-marigold/40 px-2 py-1 text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-teal py-1.5 text-sm font-semibold text-white hover:bg-teal-dark"
                    >
                      Save
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-heading font-bold text-plum">Assignments</h3>
          {enrolledSubjects.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAssignmentForm((v) => !v)}
              className="text-xs font-semibold text-teal underline"
            >
              {showAssignmentForm ? "Cancel" : "+ Add assignment"}
            </button>
          )}
        </div>

        {openAssignments.length === 0 ? (
          <p className="text-sm text-slate">No open assignments.</p>
        ) : (
          <ul className="space-y-1">
            {openAssignments.map((a) => (
              <li key={a.id} className="rounded-lg bg-sunny/50 px-3 py-2 text-sm">
                <span className="font-semibold text-plum">{a.title}</span>{" "}
                <span className="text-slate">({SUBJECTS.find((s) => s.value === a.subject)?.label})</span>
                {a.description && <p className="text-slate">{a.description}</p>}
              </li>
            ))}
          </ul>
        )}

        {showAssignmentForm && (
          <form
            action={async (formData) => {
              await addAssignment(formData);
              setShowAssignmentForm(false);
            }}
            className="mt-3 space-y-2 rounded-xl border-2 border-marigold/30 p-3"
          >
            <input type="hidden" name="studentId" value={student.id} />
            <select name="subject" className="w-full rounded-lg border border-marigold/40 px-2 py-1 text-sm">
              {enrolledSubjects.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <input
              name="title"
              required
              placeholder="Assignment title"
              className="w-full rounded-lg border border-marigold/40 px-2 py-1 text-sm"
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              className="w-full rounded-lg border border-marigold/40 px-2 py-1 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-marigold py-1.5 text-sm font-semibold text-white hover:bg-marigold-dark"
            >
              Assign
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
