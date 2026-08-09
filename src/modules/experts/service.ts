import { prisma } from "@/lib/prisma";
import { Errors } from "@/modules/security/errors";
import { recordAuditEvent } from "@/modules/security/audit";
import type { z } from "zod";
import type { upsertExpertProfileSchema, requestVerificationSchema } from "./schemas";

const MAX_PAGE_SIZE = 50;

export async function upsertExpertProfile(
  userId: string,
  input: z.infer<typeof upsertExpertProfileSchema>,
) {
  const profile = await prisma.expertProfile.upsert({
    where: { userId },
    create: { userId, headline: input.headline, yearsExperience: input.yearsExperience },
    update: { headline: input.headline, yearsExperience: input.yearsExperience },
  });

  if (input.topicIds) {
    await prisma.expertProfileTopic.deleteMany({ where: { expertProfileId: profile.id } });
    await prisma.expertProfileTopic.createMany({
      data: input.topicIds.map((topicId) => ({ expertProfileId: profile.id, topicId })),
      skipDuplicates: true,
    });
  }

  return profile;
}

// Ranked by reputation score, never by follower count or recency alone —
// this is the platform's core differentiator (brief §3/§57).
export async function listExperts(params: { take?: number; topicId?: string }) {
  const take = Math.min(params.take ?? 20, MAX_PAGE_SIZE);
  return prisma.expertProfile.findMany({
    take,
    where: params.topicId
      ? { topics: { some: { topicId: params.topicId } } }
      : undefined,
    orderBy: { reputationScore: "desc" },
    include: {
      user: { select: { id: true, displayName: true, avatarUrl: true, bio: true } },
      topics: { include: { topic: true } },
    },
  });
}

export async function getExpertProfile(expertProfileId: string) {
  const profile = await prisma.expertProfile.findUnique({
    where: { id: expertProfileId },
    include: {
      user: { select: { id: true, displayName: true, avatarUrl: true, bio: true } },
      topics: { include: { topic: true } },
    },
  });
  if (!profile) throw Errors.notFound();
  return profile;
}

export async function requestVerification(
  userId: string,
  input: z.infer<typeof requestVerificationSchema>,
  correlationId: string,
) {
  const profile = await prisma.expertProfile.findUnique({ where: { userId } });
  if (!profile) throw Errors.notFound();

  const request = await prisma.verificationRequest.create({
    data: { expertProfileId: profile.id, level: input.level, note: input.note },
  });

  // Recorded, but deciding it is explicitly a human-review action (brief
  // §16/§43) — no code path in this repo auto-approves a VerificationRequest.
  await recordAuditEvent({
    actorId: userId,
    action: "expert.verification.requested",
    targetType: "VerificationRequest",
    targetId: request.id,
    metadata: { level: input.level },
    correlationId,
  });

  return request;
}
