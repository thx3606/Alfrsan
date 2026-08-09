import { prisma } from "@/lib/prisma";
import { Errors } from "@/modules/security/errors";
import type { z } from "zod";
import type { createQuestionSchema, createAnswerSchema } from "./schemas";

const MAX_PAGE_SIZE = 50;

export async function createQuestion(
  authorId: string,
  input: z.infer<typeof createQuestionSchema>,
) {
  return prisma.question.create({
    data: { authorId, title: input.title, body: input.body, topicId: input.topicId },
  });
}

export async function listQuestions(params: { take?: number; cursor?: string }) {
  const take = Math.min(params.take ?? 20, MAX_PAGE_SIZE);
  return prisma.question.findMany({
    take,
    ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, displayName: true, avatarUrl: true } },
      topic: true,
      _count: { select: { answers: true } },
    },
  });
}

export async function getQuestionWithAnswers(questionId: string) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      author: { select: { id: true, displayName: true, avatarUrl: true } },
      topic: true,
      answers: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              expertProfile: { select: { reputationScore: true, verificationLevel: true } },
            },
          },
          outcome: true,
        },
      },
    },
  });
  if (!question) throw Errors.notFound();
  return question;
}

export async function createAnswer(
  authorId: string,
  questionId: string,
  input: z.infer<typeof createAnswerSchema>,
) {
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw Errors.notFound();

  const answer = await prisma.answer.create({
    data: { questionId, authorId, body: input.body },
  });

  if (question.status === "OPEN") {
    await prisma.question.update({ where: { id: questionId }, data: { status: "ANSWERED" } });
  }

  return answer;
}
