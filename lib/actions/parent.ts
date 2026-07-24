"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/auth";
import { SUBJECTS } from "@/lib/types";
import type { Subject } from "@/lib/types";

const SUBJECT_VALUES = new Set(SUBJECTS.map((s) => s.value));

export async function addChild(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be logged in." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const pin = String(formData.get("pin") ?? "");
  const ageRaw = String(formData.get("age") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const subjects = formData.getAll("subjects").map(String).filter((s): s is Subject => SUBJECT_VALUES.has(s as Subject));

  if (!fullName || !/^[a-z0-9_]{3,20}$/.test(username)) {
    return {
      error: "Enter your child's name and a username (3-20 letters/numbers/underscores, no spaces).",
    };
  }
  if (!/^\d{4}$/.test(pin)) {
    return { error: "The PIN must be exactly 4 digits." };
  }
  if (subjects.length === 0) {
    return { error: "Pick at least one subject for your child to learn." };
  }
  const age = ageRaw ? Number(ageRaw) : null;
  if (ageRaw && (!Number.isInteger(age) || age! < 1 || age! > 100)) {
    return { error: "Enter a valid age." };
  }

  const pinHash = await bcrypt.hash(pin, 10);

  const { error } = await supabase.from("students").insert({
    parent_id: user.id,
    full_name: fullName,
    username,
    pin_hash: pinHash,
    subjects,
    age,
    grade,
    notes,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is taken — try another one." };
    }
    return { error: "Couldn't add your child. Please try again." };
  }

  revalidatePath("/dashboard/parent");
  revalidatePath("/dashboard/teacher");
  return null;
}

export async function updateChild(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be logged in." };

  const studentId = String(formData.get("studentId") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const ageRaw = String(formData.get("age") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const subjects = formData.getAll("subjects").map(String).filter((s): s is Subject => SUBJECT_VALUES.has(s as Subject));

  if (!studentId || !fullName) {
    return { error: "Something went wrong — please try again." };
  }
  if (subjects.length === 0) {
    return { error: "Pick at least one subject for your child to learn." };
  }
  const age = ageRaw ? Number(ageRaw) : null;
  if (ageRaw && (!Number.isInteger(age) || age! < 1 || age! > 100)) {
    return { error: "Enter a valid age." };
  }

  const { error } = await supabase
    .from("students")
    .update({ full_name: fullName, age, grade, notes, subjects })
    .eq("id", studentId)
    .eq("parent_id", user.id);

  if (error) {
    return { error: "Couldn't save changes. Please try again." };
  }

  revalidatePath("/dashboard/parent");
  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/student");
  return null;
}

export async function deleteChild(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in.");

  const studentId = String(formData.get("studentId") ?? "");
  if (!studentId) return;

  await supabase.from("students").delete().eq("id", studentId).eq("parent_id", user.id);

  revalidatePath("/dashboard/parent");
  revalidatePath("/dashboard/teacher");
}
