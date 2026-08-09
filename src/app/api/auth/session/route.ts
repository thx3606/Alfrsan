import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/request-context";
import { toErrorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
