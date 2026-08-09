import { prisma } from "@/lib/prisma";
import { Errors } from "@/modules/security/errors";
import type { RatingSignal } from "./score";
import { pointsForRating, FIXED_EVENT_POINTS, sumReputationEvents } from "./score";

// Reputation only accrues to users who have chosen to build an
// ExpertProfile (brief: reputation is an expert-track concept). A rating
// on an answer from a non-expert user is still recorded (feedback is
// still useful to the asker) but does not move a Knowledge Reputation
// Score because there is no score to move.
async function recomputeAndCacheScore(expertProfileId: string): Promise<number> {
  const events = await prisma.reputationEvent.findMany({
    where: { expertProfileId },
    select: { points: true },
  });
  const score = sumReputationEvents(events.map((e) => e.points));
  await prisma.expertProfile.update({
    where: { id: expertProfileId },
    data: { reputationScore: score },
  });
  return score;
}

export async function rateAnswer(
  answerId: string,
  raterId: string,
  rating: RatingSignal,
): Promise<void> {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { author: { include: { expertProfile: true } } },
  });
  if (!answer) throw Errors.notFound();

  // Hard block on self-rating — never trust the client to not attempt
  // this. THREAT_MODEL.md §4.2.
  if (answer.authorId === raterId) throw Errors.forbidden();

  await prisma.rating.upsert({
    where: { answerId_raterId: { answerId, raterId } },
    create: { answerId, raterId, ...rating },
    update: { ...rating },
  });

  const expertProfile = answer.author.expertProfile;
  if (!expertProfile) return;

  const points = pointsForRating(rating);
  await prisma.reputationEvent.create({
    data: {
      expertProfileId: expertProfile.id,
      type: points >= 0 ? "ANSWER_RATED_HELPFUL" : "ANSWER_RATED_UNHELPFUL",
      points,
      sourceType: "Answer",
      sourceId: answerId,
    },
  });

  await recomputeAndCacheScore(expertProfile.id);
}

export async function recordOutcome(
  answerId: string,
  reportedById: string,
  resolved: boolean,
  note?: string,
): Promise<void> {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { author: { include: { expertProfile: true } }, question: true },
  });
  if (!answer) throw Errors.notFound();

  // Only the person who originally asked the question can attest to the
  // outcome — otherwise anyone could fabricate "this solved my problem"
  // for an answer they don't own the context of.
  if (answer.question.authorId !== reportedById) throw Errors.forbidden();

  await prisma.outcome.upsert({
    where: { answerId },
    create: { answerId, reportedById, resolved, note },
    update: { resolved, note },
  });

  const expertProfile = answer.author.expertProfile;
  if (!expertProfile || !resolved) return;

  await prisma.reputationEvent.create({
    data: {
      expertProfileId: expertProfile.id,
      type: "OUTCOME_RESOLVED",
      points: FIXED_EVENT_POINTS.OUTCOME_RESOLVED,
      sourceType: "Answer",
      sourceId: answerId,
    },
  });

  await recomputeAndCacheScore(expertProfile.id);
}

export async function applyVerificationApproved(
  expertProfileId: string,
  level: number,
): Promise<void> {
  await prisma.reputationEvent.create({
    data: {
      expertProfileId,
      type: "VERIFICATION_APPROVED",
      points: FIXED_EVENT_POINTS.VERIFICATION_APPROVED * level,
      sourceType: "VerificationRequest",
      sourceId: expertProfileId,
    },
  });
  await recomputeAndCacheScore(expertProfileId);
}

// Applied only through the (future) human-reviewed abuse/fraud workflow —
// never automatically from an AI signal alone (brief §32 "AI suggests,
// human reviews" for account-affecting decisions).
export async function applyAbusePenalty(expertProfileId: string): Promise<void> {
  await prisma.reputationEvent.create({
    data: {
      expertProfileId,
      type: "ABUSE_PENALTY",
      points: FIXED_EVENT_POINTS.ABUSE_PENALTY,
      sourceType: "ExpertProfile",
      sourceId: expertProfileId,
    },
  });
  await recomputeAndCacheScore(expertProfileId);
}
