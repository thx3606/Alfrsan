import { z } from "zod";

export const createQuestionSchema = z
  .object({
    title: z.string().trim().min(8).max(200),
    body: z.string().trim().min(20).max(5000),
    topicId: z.string().uuid().optional(),
  })
  .strict();

export const createAnswerSchema = z
  .object({
    body: z.string().trim().min(10).max(10000),
  })
  .strict();

export const ratingSchema = z
  .object({
    helpful: z.boolean(),
    accurate: z.boolean(),
    clear: z.boolean(),
    recommend: z.boolean(),
  })
  .strict();

export const outcomeSchema = z
  .object({
    resolved: z.boolean(),
    note: z.string().trim().max(1000).optional(),
  })
  .strict();
