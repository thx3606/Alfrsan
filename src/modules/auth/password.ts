import argon2 from "argon2";

// Argon2id, tuned parameters (OWASP-recommended floor: m=19MiB, t=2, p=1 —
// we go higher on memory since this runs server-side, not on constrained
// mobile hardware). Unique salt is handled internally by the argon2
// library per call. See SECURITY.md / brief §19.
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(plaintext: string): Promise<string> {
  return argon2.hash(plaintext, ARGON2_OPTIONS);
}

export async function verifyPassword(
  hash: string,
  plaintext: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, plaintext);
  } catch {
    // Malformed/foreign hash format — never throw into a login flow,
    // treat as "does not match".
    return false;
  }
}

// Minimum client-independent password policy. Zxcvbn-style strength
// scoring and breach-corpus checking (brief §19 "breach password
// detection") require an external wordlist/API decision and are tracked
// in ROADMAP.md — this is the structural floor enforced today.
const MIN_LENGTH = 12;

export function isPasswordPolicyCompliant(password: string): boolean {
  if (password.length < MIN_LENGTH) return false;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  return varietyCount >= 3;
}
