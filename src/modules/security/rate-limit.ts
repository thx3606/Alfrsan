// Rate limiting. In-memory in this phase (single app instance only — see
// ROADMAP.md / THREAT_MODEL.md §4.5: this does NOT hold under horizontal
// scaling). The interface is deliberately storage-agnostic so a Redis
// (e.g. sliding-window via INCR+EXPIRE) implementation can be swapped in
// without touching call sites.

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export interface RateLimiter {
  consume(key: string, limit: number, windowMs: number): RateLimitResult;
}

interface Bucket {
  count: number;
  windowStart: number;
}

class InMemoryRateLimiter implements RateLimiter {
  private buckets = new Map<string, Bucket>();

  consume(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || now - existing.windowStart >= windowMs) {
      this.buckets.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
    }

    if (existing.count >= limit) {
      const retryAfterMs = existing.windowStart + windowMs - now;
      return { allowed: false, remaining: 0, retryAfterMs };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: limit - existing.count,
      retryAfterMs: 0,
    };
  }

  // Bounds unbounded memory growth from one-shot keys (e.g. per-IP on a
  // public endpoint hit once and never again).
  sweep(maxAgeMs: number) {
    const now = Date.now();
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.windowStart > maxAgeMs) {
        this.buckets.delete(key);
      }
    }
  }
}

const globalForRateLimit = globalThis as unknown as {
  rateLimiter: InMemoryRateLimiter | undefined;
  rateLimitSweepTimer: ReturnType<typeof setInterval> | undefined;
};

export const rateLimiter =
  globalForRateLimit.rateLimiter ?? new InMemoryRateLimiter();

if (!globalForRateLimit.rateLimiter) {
  globalForRateLimit.rateLimiter = rateLimiter;
  globalForRateLimit.rateLimitSweepTimer = setInterval(
    () => rateLimiter.sweep(60 * 60 * 1000),
    10 * 60 * 1000,
  );
  globalForRateLimit.rateLimitSweepTimer.unref?.();
}

// Named limit presets. Auth endpoints are deliberately much stricter than
// read endpoints (brief §86).
export const RateLimitPolicy = {
  login: { limit: 8, windowMs: 5 * 60 * 1000 },
  register: { limit: 5, windowMs: 60 * 60 * 1000 },
  mfaVerify: { limit: 8, windowMs: 5 * 60 * 1000 },
  contentWrite: { limit: 30, windowMs: 60 * 1000 },
  default: { limit: 120, windowMs: 60 * 1000 },
} as const;
