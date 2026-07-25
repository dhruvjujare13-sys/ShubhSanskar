"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addChild } from "@/lib/actions/parent";
import type { ActionState } from "@/lib/actions/auth";
import { SUBJECTS } from "@/lib/types";
import { MATH_TOPIC_OPTIONS } from "@/data/curriculum";

export default function AddChildForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [wantsMath, setWantsMath] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prevState, formData) => {
    const result = await addChild(prevState, formData);
    if (!result) {
      formRef.current?.reset();
      setWantsMath(false);
      router.refresh();
    }
    return result;
  }, null);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3 sm:grid-cols-2">
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
              <input
                type="checkbox"
                name="subjects"
                value={s.value}
                onChange={s.value === "math" ? (e) => setWantsMath(e.target.checked) : undefined}
                className="h-4 w-4 accent-teal"
              />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      {wantsMath && (
        <fieldset className="sm:col-span-2 rounded-xl border-2 border-sky/40 bg-sky/5 p-3">
          <legend className="mb-1 px-1 text-sm font-semibold text-plum">Which math topics?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {MATH_TOPIC_OPTIONS.map((topic) => (
              <label key={topic} className="flex items-center gap-2 text-sm text-slate">
                <input type="checkbox" name="mathTopics" value={topic} className="h-4 w-4 accent-sky" />
                {topic}
              </label>
            ))}
          </div>
        </fieldset>
      )}

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
