import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/request-context";
import { toErrorResponse } from "@/lib/api-response";
import { generateTotpSecret, encryptSecret, buildOtpAuthUrl } from "@/modules/auth/mfa";

// Starts MFA enrollment: generates a new TOTP secret and stores it
// encrypted but unconfirmed. It only takes effect once /mfa/confirm
// verifies the user actually has it loaded in an authenticator app.
export async function POST() {
  try {
    const user = await requireCurrentUser();

    const secret = generateTotpSecret();
    await prisma.mfaTotp.upsert({
      where: { userId: user.id },
      create: { userId: user.id, secretEncrypted: encryptSecret(secret) },
      update: { secretEncrypted: encryptSecret(secret), confirmedAt: null },
    });

    return NextResponse.json({
      otpAuthUrl: buildOtpAuthUrl(secret, user.email),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
