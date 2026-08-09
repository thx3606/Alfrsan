import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import type { Session, User } from "@prisma/client";

// Opaque, server-side sessions — not JWTs. The client only ever holds a
// random token in an HttpOnly cookie; the server holds the source of
// truth and can revoke instantly. See ARCHITECTURE.md §6.

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "khibra_session";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function createSession(
  userId: string,
  context: { userAgent?: string; ipAddress?: string },
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      userAgent: context.userAgent?.slice(0, 255),
      ipAddress: context.ipAddress,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function validateSessionToken(
  token: string,
): Promise<{ session: Session; user: User } | null> {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) return null;
  if (session.revokedAt) return null;
  if (session.expiresAt < new Date()) return null;
  if (session.user.status !== "ACTIVE") return null;

  const { user, ...sessionOnly } = session;
  return { session: sessionOnly, user };
}

export async function revokeSession(token: string): Promise<void> {
  await prisma.session.updateMany({
    where: { tokenHash: hashToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

// Called on password change, MFA change, or detected suspicious activity —
// invalidates every other active session for the account (brief §20
// "token reuse" / sensitive-change session revocation). The session making
// the current request is preserved by default so the user isn't logged
// out by the same action that secured their account; pass no exception to
// revoke everything including the current session (e.g. "log out all
// devices").
export async function revokeAllUserSessions(
  userId: string,
  exceptToken?: string,
): Promise<void> {
  await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
      ...(exceptToken ? { tokenHash: { not: hashToken(exceptToken) } } : {}),
    },
    data: { revokedAt: new Date() },
  });
}
