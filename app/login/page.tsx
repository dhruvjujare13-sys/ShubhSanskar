"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type ActionState } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signIn, null);

  return (
    <main className="flex-1 flex items-center justify-center bg-sunny px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border-4 border-teal">
        <h1 className="font-heading text-3xl text-plum mb-1">Welcome back</h1>
        <p className="text-slate mb-6">Log in as a parent or teacher.</p>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-plum">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border-2 border-teal/40 px-4 py-2 outline-none focus:border-teal"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-plum">Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border-2 border-teal/40 px-4 py-2 outline-none focus:border-teal"
            />
          </label>

          {state?.error && (
            <p className="rounded-xl bg-blush px-4 py-3 text-sm text-plum">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-marigold py-3 font-heading text-lg text-white shadow-md transition hover:bg-marigold-dark disabled:opacity-60"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-teal underline">
            Create a parent account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate">
          Logging in as a student?{" "}
          <Link href="/student-login" className="font-semibold text-teal underline">
            Go here
          </Link>
        </p>
      </div>
    </main>
  );
}
