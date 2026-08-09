import { NextResponse } from "next/server";
import { getQuestionWithAnswers } from "@/modules/content/service";
import { toErrorResponse } from "@/lib/api-response";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const question = await getQuestionWithAnswers(id);
    return NextResponse.json({ question });
  } catch (err) {
    return toErrorResponse(err);
  }
}
