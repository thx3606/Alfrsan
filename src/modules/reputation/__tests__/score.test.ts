import { describe, it, expect } from "vitest";
import { pointsForRating, sumReputationEvents, FIXED_EVENT_POINTS } from "../score";

describe("pointsForRating", () => {
  it("awards full positive points for an all-positive rating", () => {
    expect(
      pointsForRating({ helpful: true, accurate: true, clear: true, recommend: true }),
    ).toBe(4);
  });

  it("penalizes an all-negative rating", () => {
    expect(
      pointsForRating({ helpful: false, accurate: false, clear: false, recommend: false }),
    ).toBe(-2);
  });

  it("gives partial credit for a mixed rating", () => {
    expect(
      pointsForRating({ helpful: true, accurate: true, clear: false, recommend: false }),
    ).toBe(1);
  });
});

describe("sumReputationEvents", () => {
  it("sums positive and negative events", () => {
    expect(sumReputationEvents([4, 4, -2, 10])).toBe(16);
  });

  it("floors at zero — a heavily penalized expert never goes negative", () => {
    expect(sumReputationEvents([1, -20, -20])).toBe(0);
  });

  it("returns zero for no events", () => {
    expect(sumReputationEvents([])).toBe(0);
  });

  it("rounds to 2 decimal places", () => {
    expect(sumReputationEvents([1, 1, 1])).toBe(3);
    expect(sumReputationEvents([0.5, 0.5, 0.501])).toBeCloseTo(1.5, 1);
  });
});

describe("fixed event points", () => {
  it("rewards outcomes more than a single positive rating", () => {
    expect(FIXED_EVENT_POINTS.OUTCOME_RESOLVED).toBeGreaterThan(4);
  });

  it("abuse penalty outweighs a typical single burst of gamed positive ratings", () => {
    expect(Math.abs(FIXED_EVENT_POINTS.ABUSE_PENALTY)).toBeGreaterThan(
      FIXED_EVENT_POINTS.OUTCOME_RESOLVED,
    );
  });
});
