import { NextRequest, NextResponse } from "next/server";
import { createAnswerSchema } from "@/modules/content/schemas";
import { createAnswer } from "@/modules/content/service";
import { requireCurrentUser } from "@/lib/request-context";
import { toErrorResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimiter, RateLimitPolicy } from "@/modules/security/rate-limit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireCurrentUser();
    const { id: questionId } = await context.params;

    const limit = rateLimiter.consume(
      `content-write:${user.id}`,
      RateLimitPolicy.contentWrite.limit,
      RateLimitPolicy.contentWrite.windowMs,
    );
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterMs);

    const body = createAnswerSchema.parse(await request.json());
    const answer = await createAnswer(user.id, questionId, body);
    return NextResponse.json({ answer }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
