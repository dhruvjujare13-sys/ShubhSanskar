"use client";

import { useActionState } from "react";
import { addChild } from "@/lib/actions/parent";
import type { ActionState } from "@/lib/actions/auth";
import { SUBJECTS } from "@/lib/types";

export default function AddChildForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(addChild, null);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input
        name="fullName"
        required
        placeholder="First and last name"
        className="rounded-xl border-2 border-teal/40 px-3 py-2"
      />
      <input
        name="username"
        required
        placeholder="firstname + 2 numbers (e.g. maya42)"
        className="rounded-xl border-2 border-teal/40 px-3 py-2"
      />
      <input
        name="pin"
        required
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        placeholder="4-digit PIN"
        className="rounded-xl border-2 border-teal/40 px-3 py-2"
      />
      <input
        name="age"
        type="number"
        min={1}
        max={100}
        placeholder="Age"
        className="rounded-xl border-2 border-teal/40 px-3 py-2"
      />
      <input
        name="grade"
        placeholder="Grade / level (e.g. 2nd grade, Adult)"
        className="rounded-xl border-2 border-teal/40 px-3 py-2 sm:col-span-2"
      />

      <fieldset className="sm:col-span-2">
        <legend className="mb-1 text-sm font-semibold text-plum">What will they be learning?</legend>
        <div className="flex flex-wrap gap-4">
          {SUBJECTS.map((s) => (
            <label key={s.value} className="flex items-center gap-2 text-sm text-slate">
              <input type="checkbox" name="subjects" value={s.value} className="h-4 w-4 accent-teal" />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <textarea
        name="notes"
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
        {pending ? "Adding…" : "Add child"}
      </button>
    </form>
  );
}
