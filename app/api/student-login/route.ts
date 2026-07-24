import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { signStudentSession, STUDENT_SESSION_COOKIE } from "@/lib/studentSession";
import { isLocked, recordFailure, clearFailures } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { username, pin } = await req.json();

  if (typeof username !== "string" || typeof pin !== "string" || !username.trim() || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: "Enter a username and a 4-digit PIN." }, { status: 400 });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const rateLimitKey = `student-login:${normalizedUsername}`;

  if (isLocked(rateLimitKey)) {
    return NextResponse.json(
      { error: "Too many tries. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const supabase = createAdminClient();
  const { data: student, error } = await supabase
    .from("students")
    .select("id, full_name, username, pin_hash")
    .ilike("username", normalizedUsername)
    .maybeSingle();

  if (error || !student) {
    recordFailure(rateLimitKey);
    return NextResponse.json({ error: "That username and PIN don't match." }, { status: 401 });
  }

  const pinMatches = await bcrypt.compare(pin, student.pin_hash);
  if (!pinMatches) {
    recordFailure(rateLimitKey);
    return NextResponse.json({ error: "That username and PIN don't match." }, { status: 401 });
  }

  clearFailures(rateLimitKey);

  const token = await signStudentSession({
    studentId: student.id,
    username: student.username,
    fullName: student.full_name,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDENT_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
