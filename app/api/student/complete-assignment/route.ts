import { NextRequest, NextResponse } from "next/server";
import { getStudentSession } from "@/lib/getStudentSession";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const session = await getStudentSession();
  if (!session) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { assignmentId } = await req.json();
  if (typeof assignmentId !== "string") {
    return NextResponse.json({ error: "Missing assignment." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Only allow completing an assignment that belongs to this student.
  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, student_id")
    .eq("id", assignmentId)
    .maybeSingle();

  if (!assignment || assignment.student_id !== session.studentId) {
    return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
  }

  await supabase
    .from("assignments")
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq("id", assignmentId);

  return NextResponse.json({ ok: true });
}
