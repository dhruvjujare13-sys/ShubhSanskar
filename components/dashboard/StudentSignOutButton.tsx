"use client";

import { useRouter } from "next/navigation";

export default function StudentSignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/student-logout", { method: "POST" });
        router.push("/student-login");
        router.refresh();
      }}
      className="rounded-full border-2 border-plum px-4 py-2 text-sm font-heading font-bold text-plum hover:bg-plum hover:text-white"
    >
      Bye for now!
    </button>
  );
}
