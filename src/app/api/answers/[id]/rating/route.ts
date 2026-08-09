import { NextRequest, NextResponse } from "next/server";
import { ratingSchema } from "@/modules/content/schemas";
import { rateAnswer } from "@/modules/reputation/service";
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

    const body = ratingSchema.parse(await request.json());
    // Self-rating is rejected inside rateAnswer() regardless of what the
    // client sends — never trust client-side disabling of the UI control.
    await rateAnswer(answerId, user.id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
