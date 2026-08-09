import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser, getRequestContext } from "@/lib/request-context";
import { SESSION_COOKIE_NAME } from "@/modules/auth/session";
import { toErrorResponse, rateLimitResponse } from "@/lib/api-response";
import { mfaVerifySchema } from "@/modules/auth/schemas";
import { decryptSecret, verifyTotp } from "@/modules/auth/mfa";
import { generateRecoveryCodes } from "@/modules/auth/recovery-codes";
import { invalidateOtherSessions } from "@/modules/auth/service";
import { recordAuditEvent } from "@/modules/security/audit";
import { Errors } from "@/modules/security/errors";
import { rateLimiter, RateLimitPolicy } from "@/modules/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();

    const limit = rateLimiter.consume(
      `mfa-confirm:${user.id}`,
      RateLimitPolicy.mfaVerify.limit,
      RateLimitPolicy.mfaVerify.windowMs,
    );
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterMs);

    const { totp } = mfaVerifySchema.parse(await request.json());

    const record = await prisma.mfaTotp.findUnique({ where: { userId: user.id } });
    if (!record) throw Errors.mfaInvalid();

    const secret = decryptSecret(record.secretEncrypted);
    if (!verifyTotp(totp, secret)) throw Errors.mfaInvalid();

    await prisma.mfaTotp.update({
      where: { userId: user.id },
      data: { confirmedAt: new Date() },
    });

    const recoveryCodes = await generateRecoveryCodes(user.id);
    const ctx = await getRequestContext();
    const cookieStore = await cookies();
    const currentToken = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? "";
    await invalidateOtherSessions(user.id, currentToken, ctx);
    await recordAuditEvent({
      actorId: user.id,
      action: "auth.mfa.enabled",
      correlationId: ctx.correlationId,
    });

    return NextResponse.json({ recoveryCodes });
  } catch (err) {
    return toErrorResponse(err);
  }
}
