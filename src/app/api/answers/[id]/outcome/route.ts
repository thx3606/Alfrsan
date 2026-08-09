import { NextRequest, NextResponse } from "next/server";
import { outcomeSchema } from "@/modules/content/schemas";
import { recordOutcome } from "@/modules/reputation/service";
import { requireCurrentUser } from "@/lib/request-context";
import { toErrorResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimiter, RateLimitPolicy } from "@/modules/security/rate-limit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireCurrentUser();
    const { id: answerId } = await context.params;

    const limit = rateLimiter.consume(
      `content-write:${user.id}`,
      RateLimitPolicy.contentWrite.limit,
      RateLimitPolicy.contentWrite.windowMs,
    );
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterMs);

    const body = outcomeSchema.parse(await request.json());
    // recordOutcome() independently verifies the caller is the original
    // asker — never trust the client for this ownership check either.
    await recordOutcome(answerId, user.id, body.resolved, body.note);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
