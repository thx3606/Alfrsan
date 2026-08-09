import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logout } from "@/modules/auth/service";
import { SESSION_COOKIE_NAME } from "@/modules/auth/session";
import { getRequestContext, getCurrentUser } from "@/lib/request-context";
import { toErrorResponse } from "@/lib/api-response";
import { clearSessionCookie } from "@/lib/session-cookie";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const ctx = await getRequestContext();

    if (token) {
      const user = await getCurrentUser();
      await logout(token, ctx, user?.id);
    }

    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (err) {
    return toErrorResponse(err);
  }
}
