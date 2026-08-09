import { z } from "zod";

export const upsertExpertProfileSchema = z
  .object({
    headline: z.string().trim().min(4).max(140),
    yearsExperience: z.number().int().min(0).max(80).optional(),
    topicIds: z.array(z.string().uuid()).max(10).optional(),
  })
  .strict();

export const requestVerificationSchema = z
  .object({
    level: z.number().int().min(1).max(5),
    note: z.string().trim().max(1000).optional(),
  })
  .strict();
