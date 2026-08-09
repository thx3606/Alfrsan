import { cookies, headers } from "next/headers";
import { validateSessionToken, SESSION_COOKIE_NAME } from "@/modules/auth/session";
import type { User } from "@prisma/client";

export async function getRequestContext(): Promise<{
  ipAddress?: string;
  userAgent?: string;
  correlationId: string;
}> {
  const h = await headers();
  return {
    // Only trust the proxy header in front of a known, controlled proxy —
    // in this dev phase there is no verified edge proxy, so this is a
    // best-effort value for audit logging, not an authorization input.
    ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
    userAgent: h.get("user-agent") ?? undefined,
    correlationId: crypto.randomUUID(),
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const result = await validateSessionToken(token);
  return result?.user ?? null;
}

export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const { Errors } = await import("@/modules/security/errors");
    throw Errors.sessionInvalid();
  }
  return user;
}
