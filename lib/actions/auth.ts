"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string } | null;

export async function signUpParent(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || password.length < 8) {
    return { error: "Please fill in your name, a valid email, and a password of at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      error:
        "Account created! Check your email to confirm it, then come back and log in.",
    };
  }

  redirect("/dashboard/parent");
}

export async function signIn(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Incorrect email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  redirect(profile?.role === "teacher" ? "/dashboard/teacher" : "/dashboard/parent");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
