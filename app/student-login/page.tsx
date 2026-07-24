"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "Go"];

export default function StudentLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(finalPin: string) {
    if (!username.trim() || finalPin.length !== 4) {
      setError("Type your username and a 4-digit PIN first!");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/student-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin: finalPin }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/student");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong. Try again.");
      setPin("");
    }
  }

  function pressKey(key: string) {
    if (loading) return;
    if (key === "⌫") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === "Go") {
      submit(pin);
      return;
    }
    setPin((p) => {
      const next = p.length < 4 ? p + key : p;
      if (next.length === 4) submit(next);
      return next;
    });
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-sky/20 to-sunny px-4 py-12">
      <h1 className="font-heading text-4xl text-plum mb-2 text-center">Hi! Who&apos;s learning today?</h1>
      <p className="text-slate mb-8 text-center">Type your name and your secret PIN.</p>

      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border-4 border-sky">
        <label className="block mb-4">
          <span className="mb-1 block text-sm font-semibold text-plum">My username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border-2 border-sky/50 px-4 py-3 text-lg outline-none focus:border-sky"
            placeholder="e.g. maya"
            autoFocus
          />
        </label>

        <div className="mb-4 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-5 w-5 rounded-full border-2 border-plum ${
                pin.length > i ? "bg-marigold" : "bg-white"
              }`}
            />
          ))}
        </div>

        {error && <p className="mb-4 rounded-xl bg-blush px-4 py-2 text-center text-sm text-plum">{error}</p>}

        <div className="grid grid-cols-3 gap-3">
          {KEYS.map((key) => (
            <motion.button
              key={key}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => pressKey(key)}
              disabled={loading}
              className={`rounded-2xl py-4 text-xl font-heading font-bold shadow-md ${
                key === "Go"
                  ? "bg-grass text-white"
                  : key === "⌫"
                    ? "bg-blush text-plum"
                    : "bg-sunny text-plum border-2 border-marigold/40"
              }`}
            >
              {key}
            </motion.button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate">
        Parent or teacher?{" "}
        <Link href="/login" className="font-semibold text-teal underline">
          Log in here
        </Link>
      </p>
    </main>
  );
}
