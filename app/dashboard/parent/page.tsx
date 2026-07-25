import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AddChildForm from "./AddChildForm";
import ChildCard from "./ChildCard";
import { siteConfig, whatsAppLink } from "@/lib/siteConfig";
import type { Assignment, Profile, ProgressEntry, Student } from "@/lib/types";

export default async function ParentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone")
    .eq("id", user.id)
    .maybeSingle<Profile>();
  if (profile?.role === "teacher") redirect("/dashboard/teacher");

  const { data: students, error: studentsError } = (await supabase
    .from("students")
    .select("id, parent_id, full_name, username, subjects, age, grade, notes, meet_link")
    .eq("parent_id", user.id)
    .order("full_name")) as { data: Student[] | null; error: { message: string } | null };

  if (studentsError) {
    console.error("Failed to load students:", studentsError.message);
  }

  const studentIds = (students ?? []).map((s) => s.id);

  const [progressRes, assignmentsRes] = await Promise.all([
    studentIds.length
      ? supabase
          .from("progress_entries")
          .select("id, student_id, subject, topic, status, notes, updated_at")
          .in("student_id", studentIds)
          .order("updated_at", { ascending: false })
      : Promise.resolve({ data: [] as ProgressEntry[] }),
    studentIds.length
      ? supabase
          .from("assignments")
          .select("id, student_id, subject, title, description, completed, completed_at, created_at")
          .in("student_id", studentIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as Assignment[] }),
  ]);

  const progress = progressRes.data as ProgressEntry[] | null;
  const assignments = assignmentsRes.data as Assignment[] | null;

  return (
    <div className="flex min-h-screen flex-col bg-sunny">
      <DashboardHeader roleLabel="Parent" personName={profile?.full_name || "there"} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <h1 className="font-heading text-3xl text-plum mb-2">Your children</h1>
        <p className="mb-6 text-slate">
          Track progress, see assignments, and message {siteConfig.teacherName} anytime.
        </p>

        {studentsError && (
          <p className="mb-6 rounded-xl bg-blush px-4 py-3 text-sm text-plum">
            Couldn&apos;t load your children: {studentsError.message}
          </p>
        )}

        <div className="mb-6 grid gap-6">
          {students?.map((student) => (
            <ChildCard
              key={student.id}
              student={student}
              progress={(progress ?? []).filter((p) => p.student_id === student.id)}
              assignments={(assignments ?? []).filter((a) => a.student_id === student.id)}
            />
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg border-2 border-teal/30">
          <h2 className="font-heading text-xl text-plum mb-3">Add another child</h2>
          <AddChildForm />
        </div>

        <a
          href={whatsAppLink(`Hi ${siteConfig.teacherName}, I have a question about tutoring.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-grass px-5 py-2.5 font-heading font-bold text-white shadow hover:opacity-90"
        >
          Message {siteConfig.teacherName} on WhatsApp
        </a>
      </main>
    </div>
  );
}
