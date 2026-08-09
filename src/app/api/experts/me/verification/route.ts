import { NextRequest, NextResponse } from "next/server";
import { requestVerificationSchema } from "@/modules/experts/schemas";
import { requestVerification } from "@/modules/experts/service";
import { requireCurrentUser, getRequestContext } from "@/lib/request-context";
import { toErrorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const body = requestVerificationSchema.parse(await request.json());
    const ctx = await getRequestContext();
    // This only files the request. Approval is a human-review action
    // (brief §16/§43) — no automated path in this codebase sets
    // VerificationRequest.status to APPROVED.
    const request_ = await requestVerification(user.id, body, ctx.correlationId);
    return NextResponse.json({ request: request_ }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
