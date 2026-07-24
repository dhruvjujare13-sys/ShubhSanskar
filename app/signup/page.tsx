"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpParent, type ActionState } from "@/lib/actions/auth";
import { siteConfig } from "@/lib/siteConfig";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signUpParent, null);

  return (
    <main className="flex-1 flex items-center justify-center bg-sunny px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border-4 border-marigold">
        <h1 className="font-heading text-3xl text-plum mb-1">Create a parent account</h1>
        <p className="text-slate mb-6">
          Sign up, then add your child so they can log in and start practicing with {siteConfig.teacherName}.
        </p>

        <form action={formAction} className="space-y-4">
          <Field label="Your name" name="fullName" type="text" required />
          <Field label="Phone (optional)" name="phone" type="tel" />
          <Field label="Email" name="email" type="email" required />
          <Field label="Password" name="password" type="password" required minLength={8} />

          {state?.error && (
            <p className="rounded-xl bg-blush px-4 py-3 text-sm text-plum">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-teal py-3 font-heading text-lg text-white shadow-md transition hover:bg-teal-dark disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-plum">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="w-full rounded-xl border-2 border-marigold/40 px-4 py-2 outline-none focus:border-teal"
      />
    </label>
  );
}
