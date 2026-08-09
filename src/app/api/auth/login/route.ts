import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/modules/auth/schemas";
import { login } from "@/modules/auth/service";
import { getRequestContext } from "@/lib/request-context";
import { toErrorResponse, rateLimitResponse } from "@/lib/api-response";
import { setSessionCookie } from "@/lib/session-cookie";
import { rateLimiter, RateLimitPolicy } from "@/modules/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const body = loginSchema.parse(await request.json());

    // Rate-limit by IP *and* by the targeted account, so an attacker can't
    // dodge the limit by rotating source IPs against a single account, nor
    // exhaust a shared-IP legitimate user's budget by spraying many
    // accounts from one address in isolation from the account-level limit.
    const ipLimit = rateLimiter.consume(
      `login:ip:${ip}`,
      RateLimitPolicy.login.limit,
      RateLimitPolicy.login.windowMs,
    );
    const accountLimit = rateLimiter.consume(
      `login:acct:${body.email}`,
      RateLimitPolicy.login.limit,
      RateLimitPolicy.login.windowMs,
    );
    if (!ipLimit.allowed || !accountLimit.allowed) {
      return rateLimitResponse(Math.max(ipLimit.retryAfterMs, accountLimit.retryAfterMs));
    }

    const ctx = await getRequestContext();
    const result = await login(body, ctx);

    const response = NextResponse.json({ user: result.user });
    setSessionCookie(response, result.token, result.expiresAt);
    return response;
  } catch (err) {
    return toErrorResponse(err);
  }
}
