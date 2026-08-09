import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/modules/auth/schemas";
import { register } from "@/modules/auth/service";
import { getRequestContext } from "@/lib/request-context";
import { toErrorResponse, rateLimitResponse } from "@/lib/api-response";
import { setSessionCookie } from "@/lib/session-cookie";
import { rateLimiter, RateLimitPolicy } from "@/modules/security/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimiter.consume(
    `register:${ip}`,
    RateLimitPolicy.register.limit,
    RateLimitPolicy.register.windowMs,
  );
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterMs);

  try {
    const body = registerSchema.parse(await request.json());
    const ctx = await getRequestContext();
    const result = await register(body, ctx);

    const response = NextResponse.json({ user: result.user }, { status: 201 });
    setSessionCookie(response, result.token, result.expiresAt);
    return response;
  } catch (err) {
    return toErrorResponse(err);
  }
}
