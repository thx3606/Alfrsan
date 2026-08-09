// Double-submit-cookie CSRF protection. Edge-runtime-safe (uses the Web
// Crypto API only, no Node.js `crypto` module) because it runs from
// proxy.ts on every request. See THREAT_MODEL.md §4.1 and brief §22.

export const CSRF_COOKIE_NAME = "khibra_csrf";
export const CSRF_HEADER_NAME = "x-khibra-csrf";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function isSafeMethod(method: string): boolean {
  return SAFE_METHODS.has(method.toUpperCase());
}

export function generateCsrfToken(): string {
  return crypto.randomUUID() + crypto.randomUUID();
}

// Constant-time comparison without relying on Node's crypto module, so it
// works in both the Edge middleware runtime and Node route handlers.
export function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function isCsrfValid(cookieToken: string | undefined, headerToken: string | null): boolean {
  if (!cookieToken || !headerToken) return false;
  return timingSafeStringEqual(cookieToken, headerToken);
}
