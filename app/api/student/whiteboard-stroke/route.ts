import { NextRequest, NextResponse } from "next/server";
import { getStudentSession } from "@/lib/getStudentSession";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const session = await getStudentSession();
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { points, color, width } = await req.json();

  if (!Array.isArray(points) || points.length < 2) {
    return NextResponse.json({ error: "Invalid stroke." }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase.from("whiteboard_strokes").insert({
    student_id: session.studentId,
    author: "student",
    points,
    color: typeof color === "string" ? color : "#4a2545",
    width: typeof width === "number" ? width : 3,
  });

  return NextResponse.json({ ok: true });
}
