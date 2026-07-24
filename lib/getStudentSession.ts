import { cookies } from "next/headers";
import { verifyStudentSession, STUDENT_SESSION_COOKIE } from "@/lib/studentSession";

export async function getStudentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDENT_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyStudentSession(token);
}
