import { NextRequest, NextResponse } from "next/server";
import { upsertExpertProfileSchema } from "@/modules/experts/schemas";
import { upsertExpertProfile } from "@/modules/experts/service";
import { requireCurrentUser } from "@/lib/request-context";
import { toErrorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const body = upsertExpertProfileSchema.parse(await request.json());
    const profile = await upsertExpertProfile(user.id, body);
    return NextResponse.json({ profile });
  } catch (err) {
    return toErrorResponse(err);
  }
}
