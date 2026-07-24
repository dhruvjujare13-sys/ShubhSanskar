"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Assignment } from "@/lib/types";
import { SUBJECTS } from "@/lib/types";

export default function AssignmentList({ assignments }: { assignments: Assignment[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function complete(id: string) {
    setPendingId(id);
    await fetch("/api/student/complete-assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId: id }),
    });
    setPendingId(null);
    router.refresh();
  }

  if (assignments.length === 0) {
    return <p className="text-sm text-slate">No practice assigned right now — great job staying caught up!</p>;
  }

  return (
    <ul className="space-y-2">
      {assignments.map((a) => (
        <li key={a.id} className="flex items-center justify-between rounded-xl bg-sunny/60 px-4 py-3">
          <div>
            <p className="font-semibold text-plum">{a.title}</p>
            <p className="text-xs text-slate">{SUBJECTS.find((s) => s.value === a.subject)?.label}</p>
          </div>
          <button
            type="button"
            disabled={pendingId === a.id}
            onClick={() => complete(a.id)}
            className="rounded-full bg-grass px-4 py-1.5 text-sm font-heading font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {pendingId === a.id ? "…" : "Done!"}
          </button>
        </li>
      ))}
    </ul>
  );
}
