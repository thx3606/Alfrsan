import type { ReputationEventType } from "@prisma/client";

// Knowledge Reputation Score — deterministic, auditable, testable in
// isolation from the database. See brief §34 ("Reputation = Quality -
// Abuse, never Followers") and ARCHITECTURE.md.
//
// Design principles:
//   - Every point awarded traces back to one ReputationEvent row (the
//     ledger), so the score is always explainable ("why is my score X?"
//     answers with a list of events — brief §156 Explainability).
//   - Negative signals (abuse, unhelpful ratings) subtract, so gaming the
//     positive side without real quality is a losing strategy long-term.
//   - The score is never client-writable; only this module computes it.

export interface RatingSignal {
  helpful: boolean;
  accurate: boolean;
  clear: boolean;
  recommend: boolean;
}

// +1 per positive dimension, -0.5 per negative dimension. A rating that is
// entirely negative nets -2; entirely positive nets +4. Partial credit for
// partially-useful answers, which better reflects reality than a single
// thumbs up/down.
export function pointsForRating(rating: RatingSignal): number {
  const dims = [rating.helpful, rating.accurate, rating.clear, rating.recommend];
  return dims.reduce((total, positive) => total + (positive ? 1 : -0.5), 0);
}

export const FIXED_EVENT_POINTS: Record<
  Exclude<ReputationEventType, "ANSWER_RATED_HELPFUL" | "ANSWER_RATED_UNHELPFUL">,
  number
> = {
  // A user reporting their real problem got solved is the strongest
  // available signal of genuine usefulness (brief §36 "Proof of Outcome").
  OUTCOME_RESOLVED: 10,
  // Per verification level approved (1..5) — multiplied by level at the
  // call site, this is the per-level unit.
  VERIFICATION_APPROVED: 5,
  // A confirmed abuse finding (fraud, manipulation, fake credentials) —
  // large enough to meaningfully offset gamed positive signals.
  ABUSE_PENALTY: -20,
};

// A reputation score is a sum of ledger points, floored at zero — a new
// or heavily-penalized expert starts/returns to a neutral baseline rather
// than an unbounded negative number that would be confusing to display.
export function sumReputationEvents(points: number[]): number {
  const total = points.reduce((sum, p) => sum + p, 0);
  return Math.max(0, Math.round(total * 100) / 100);
}
