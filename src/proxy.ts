import { NextRequest, NextResponse } from "next/server";
import { securityHeaders } from "@/modules/security/headers";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  generateCsrfToken,
  isCsrfValid,
  isSafeMethod,
} from "@/modules/security/csrf";

// Next.js 16 renamed the "middleware" file convention to "proxy" (it now
// defaults to the Node.js runtime rather than Edge — see
// node_modules/next/dist/docs/.../proxy.md). This file keeps using only
// Web Crypto (no Node `crypto` import) anyway, so it stays portable if a
// future config ever pins a different runtime. Two jobs only:
//   1. Attach security headers to every response.
//   2. Enforce CSRF on state-changing /api requests (fail closed — see
//      brief §127 "on failure, DENY, not ALLOW").
export function proxy(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const method = request.method;

  if (isApiRoute && !isSafeMethod(method)) {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!isCsrfValid(cookieToken, headerToken)) {
      const response = NextResponse.json(
        { error: { code: "SECURITY_001", message: "طلب غير موثوق" } },
        { status: 403 },
      );
      applyHeaders(response);
      return response;
    }
  }

  const response = NextResponse.next();
  applyHeaders(response);

  // Issue a CSRF cookie for any client that doesn't have one yet so the
  // next mutating request can echo it back in the header.
  if (!request.cookies.get(CSRF_COOKIE_NAME)) {
    response.cookies.set(CSRF_COOKIE_NAME, generateCsrfToken(), {
      httpOnly: false, // must be readable by client JS to echo in the header
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
  }

  return response;
}

function applyHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(securityHeaders())) {
    response.headers.set(key, value);
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
