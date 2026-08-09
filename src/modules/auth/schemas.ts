import { z } from "zod";

// Every auth API route validates against one of these before touching the
// database. `.strict()` rejects unknown fields so a client can never sneak
// extra properties (e.g. `role`, `verificationLevel`) into a request body.

export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(12).max(256),
    displayName: z.string().trim().min(2).max(80),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(1).max(256),
    totp: z.string().regex(/^\d{6}$/).optional(),
  })
  .strict();

export const mfaVerifySchema = z
  .object({
    totp: z.string().regex(/^\d{6}$/),
  })
  .strict();

export const recoveryCodeSchema = z
  .object({
    code: z.string().regex(/^[2-9A-HJ-NP-Z]{5}-[2-9A-HJ-NP-Z]{5}$/),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
