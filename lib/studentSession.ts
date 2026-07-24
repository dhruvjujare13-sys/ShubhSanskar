import { SignJWT, jwtVerify } from "jose";

export const STUDENT_SESSION_COOKIE = "student_session";

function secretKey() {
  const secret = process.env.STUDENT_SESSION_SECRET;
  if (!secret) throw new Error("STUDENT_SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type StudentSessionPayload = {
  studentId: string;
  username: string;
  fullName: string;
};

export async function signStudentSession(payload: StudentSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
}

export async function verifyStudentSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as StudentSessionPayload & { iat: number; exp: number };
  } catch {
    return null;
  }
}
