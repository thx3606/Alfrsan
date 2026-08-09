import { NextRequest, NextResponse } from "next/server";
import { listExperts } from "@/modules/experts/service";
import { toErrorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const topicId = request.nextUrl.searchParams.get("topicId") ?? undefined;
    const experts = await listExperts({ topicId });
    return NextResponse.json({ experts });
  } catch (err) {
    return toErrorResponse(err);
  }
}
