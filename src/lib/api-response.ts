import { NextResponse } from "next/server";
import { AppError, Errors } from "@/modules/security/errors";
import { ZodError } from "zod";

// Every route handler funnels caught errors through this so the client
// never sees a raw exception message, stack trace, or DB error (brief §67).
export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return NextResponse.json(err.toResponseBody(), { status: err.httpStatus });
  }
  if (err instanceof ZodError) {
    const validationError = Errors.validationFailed();
    return NextResponse.json(validationError.toResponseBody(), {
      status: validationError.httpStatus,
    });
  }
  console.error(err);
  const internal = Errors.internal();
  return NextResponse.json(internal.toResponseBody(), { status: internal.httpStatus });
}

export function rateLimitResponse(retryAfterMs: number): NextResponse {
  const err = Errors.rateLimited();
  const response = NextResponse.json(err.toResponseBody(), { status: err.httpStatus });
  response.headers.set("Retry-After", Math.ceil(retryAfterMs / 1000).toString());
  return response;
}
