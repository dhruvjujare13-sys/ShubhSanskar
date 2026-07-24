import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifyStudentSession, STUDENT_SESSION_COOKIE } from "@/lib/studentSession";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard/student")) {
    const token = request.cookies.get(STUDENT_SESSION_COOKIE)?.value;
    const session = token ? await verifyStudentSession(token) : null;
    if (!session) {
      return NextResponse.redirect(new URL("/student-login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard/teacher") || pathname.startsWith("/dashboard/parent")) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const wantsTeacher = pathname.startsWith("/dashboard/teacher");
    const isTeacher = profile?.role === "teacher";

    if (wantsTeacher && !isTeacher) {
      return NextResponse.redirect(new URL("/dashboard/parent", request.url));
    }
    if (!wantsTeacher && isTeacher) {
      return NextResponse.redirect(new URL("/dashboard/teacher", request.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
