import { prisma } from "@/lib/prisma";
import { Errors } from "@/modules/security/errors";
import { recordAuditEvent } from "@/modules/security/audit";
import { hashPassword, verifyPassword, isPasswordPolicyCompliant } from "./password";
import { createSession, revokeSession, revokeAllUserSessions } from "./session";
import { decryptSecret, verifyTotp } from "./mfa";
import type { RegisterInput, LoginInput } from "./schemas";

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
  correlationId: string;
}

export interface AuthResult {
  token: string;
  expiresAt: Date;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

// A hash of a value nobody will ever supply, used to keep the timing of
// "user not found" identical to "wrong password" (no user enumeration via
// timing side-channel — THREAT_MODEL.md §4.4).
const DUMMY_HASH =
  "$argon2id$v=19$m=65536,t=3,p=1$MDAwMDAwMDAwMDAwMDAwMA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export async function register(
  input: RegisterInput,
  ctx: RequestContext,
): Promise<AuthResult> {
  if (!isPasswordPolicyCompliant(input.password)) {
    throw Errors.weakPassword();
  }

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    // Same generic error whether or not the account exists — no
    // enumeration via the registration endpoint either.
    throw Errors.emailAlreadyRegistered();
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      displayName: input.displayName,
      passwordHash,
      consent: { create: {} }, // all opt-in flags default false except notifications
    },
  });

  const { token, expiresAt } = await createSession(user.id, ctx);

  await recordAuditEvent({
    actorId: user.id,
    action: "auth.register",
    targetType: "User",
    targetId: user.id,
    correlationId: ctx.correlationId,
  });

  return {
    token,
    expiresAt,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  };
}

export async function login(input: LoginInput, ctx: RequestContext): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { mfaTotp: true },
  });

  const passwordOk = await verifyPassword(
    user?.passwordHash ?? DUMMY_HASH,
    input.password,
  );

  if (!user || !passwordOk || user.status !== "ACTIVE") {
    await recordAuditEvent({
      action: "auth.login.failure",
      targetType: "User",
      targetId: user?.id,
      correlationId: ctx.correlationId,
    });
    throw Errors.invalidCredentials();
  }

  if (user.mfaTotp?.confirmedAt) {
    if (!input.totp) {
      throw Errors.mfaRequired();
    }
    const secret = decryptSecret(user.mfaTotp.secretEncrypted);
    if (!verifyTotp(input.totp, secret)) {
      await recordAuditEvent({
        actorId: user.id,
        action: "auth.mfa.failure",
        correlationId: ctx.correlationId,
      });
      throw Errors.mfaInvalid();
    }
  }

  const { token, expiresAt } = await createSession(user.id, ctx);

  await recordAuditEvent({
    actorId: user.id,
    action: "auth.login.success",
    targetType: "User",
    targetId: user.id,
    correlationId: ctx.correlationId,
  });

  return {
    token,
    expiresAt,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  };
}

export async function logout(token: string, ctx: RequestContext, userId?: string): Promise<void> {
  await revokeSession(token);
  await recordAuditEvent({
    actorId: userId,
    action: "auth.logout",
    correlationId: ctx.correlationId,
  });
}

// On password change or MFA reconfiguration, every other active session is
// revoked (brief §20) while the session performing the change is kept
// alive — the user shouldn't be logged out by the same action that just
// secured their account.
export async function invalidateOtherSessions(
  userId: string,
  currentToken: string,
  ctx: RequestContext,
): Promise<void> {
  await revokeAllUserSessions(userId, currentToken);
  await recordAuditEvent({
    actorId: userId,
    action: "auth.session.revoked_all",
    correlationId: ctx.correlationId,
  });
}
