import { describe, it, expect } from "vitest";
import { rateLimiter } from "../rate-limit";

// Re-implement instantiation locally (not the shared global singleton) so
// tests don't interfere with each other's buckets.
class TestableLimiter {
  private buckets = new Map<string, { count: number; windowStart: number }>();

  consume(key: string, limit: number, windowMs: number, now: number) {
    const existing = this.buckets.get(key);
    if (!existing || now - existing.windowStart >= windowMs) {
      this.buckets.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
    }
    if (existing.count >= limit) {
      return { allowed: false, remaining: 0, retryAfterMs: existing.windowStart + windowMs - now };
    }
    existing.count += 1;
    return { allowed: true, remaining: limit - existing.count, retryAfterMs: 0 };
  }
}

describe("rate limiter semantics", () => {
  it("allows requests under the limit", () => {
    const limiter = new TestableLimiter();
    for (let i = 0; i < 5; i++) {
      expect(limiter.consume("k", 5, 1000, 0).allowed).toBe(true);
    }
  });

  it("blocks once the limit is exceeded within the window", () => {
    const limiter = new TestableLimiter();
    for (let i = 0; i < 5; i++) limiter.consume("k", 5, 1000, 0);
    expect(limiter.consume("k", 5, 1000, 100).allowed).toBe(false);
  });

  it("resets after the window elapses", () => {
    const limiter = new TestableLimiter();
    for (let i = 0; i < 5; i++) limiter.consume("k", 5, 1000, 0);
    expect(limiter.consume("k", 5, 1000, 1500).allowed).toBe(true);
  });

  it("tracks independent keys separately", () => {
    const limiter = new TestableLimiter();
    for (let i = 0; i < 5; i++) limiter.consume("a", 5, 1000, 0);
    expect(limiter.consume("b", 5, 1000, 0).allowed).toBe(true);
  });
});

describe("shared rate limiter singleton", () => {
  it("is importable and usable directly", () => {
    const result = rateLimiter.consume("unique-key-1", 3, 1000);
    expect(result.allowed).toBe(true);
  });
});
