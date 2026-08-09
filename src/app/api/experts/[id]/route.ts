import { NextResponse } from "next/server";
import { getExpertProfile } from "@/modules/experts/service";
import { toErrorResponse } from "@/lib/api-response";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const expert = await getExpertProfile(id);
    return NextResponse.json({ expert });
  } catch (err) {
    return toErrorResponse(err);
  }
}
