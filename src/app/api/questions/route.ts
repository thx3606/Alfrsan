import { NextRequest, NextResponse } from "next/server";
import { createQuestionSchema } from "@/modules/content/schemas";
import { createQuestion, listQuestions } from "@/modules/content/service";
import { requireCurrentUser } from "@/lib/request-context";
import { toErrorResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimiter, RateLimitPolicy } from "@/modules/security/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    const questions = await listQuestions({ cursor });
    return NextResponse.json({ questions });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();

    const limit = rateLimiter.consume(
      `content-write:${user.id}`,
      RateLimitPolicy.contentWrite.limit,
      RateLimitPolicy.contentWrite.windowMs,
    );
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterMs);

    const body = createQuestionSchema.parse(await request.json());
    const question = await createQuestion(user.id, body);
    return NextResponse.json({ question }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
