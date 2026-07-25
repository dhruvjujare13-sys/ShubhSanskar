"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireTeacher() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "teacher") throw new Error("Only the teacher can do that.");

  return supabase;
}

export async function logProgress(formData: FormData) {
  const supabase = await requireTeacher();

  const studentId = String(formData.get("studentId"));
  const subject = String(formData.get("subject"));
  const topic = String(formData.get("topic") ?? "").trim();
  const status = String(formData.get("status"));
  const notes = String(formData.get("notes") ?? "").trim();

  if (!studentId || !topic) return;

  await supabase.from("progress_entries").insert({
    student_id: studentId,
    subject,
    topic,
    status,
    notes,
  });

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/parent");
  revalidatePath("/dashboard/student");
}

export async function setMeetLink(formData: FormData) {
  const supabase = await requireTeacher();

  const studentId = String(formData.get("studentId") ?? "");
  const meetLink = String(formData.get("meetLink") ?? "").trim();
  if (!studentId) return;

  await supabase.from("students").update({ meet_link: meetLink }).eq("id", studentId);

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/parent");
  revalidatePath("/dashboard/student");
}

export async function deleteStudent(formData: FormData) {
  const supabase = await requireTeacher();

  const studentId = String(formData.get("studentId") ?? "");
  if (!studentId) return;

  await supabase.from("students").delete().eq("id", studentId);

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/parent");
}

export async function addAssignment(formData: FormData) {
  const supabase = await requireTeacher();

  const studentId = String(formData.get("studentId"));
  const subject = String(formData.get("subject"));
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!studentId || !title) return;

  await supabase.from("assignments").insert({
    student_id: studentId,
    subject,
    title,
    description,
  });

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/parent");
  revalidatePath("/dashboard/student");
}
