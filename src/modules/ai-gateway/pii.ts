// Pattern-based PII and secret detection. This is a first, real,
// testable layer — not a substitute for a proper DLP/NER model, but every
// pattern here is enforced today (unlike aspirational future ML-based
// detection). See AI_SECURITY.md.

export type PiiType =
  | "NATIONAL_ID"
  | "PHONE"
  | "EMAIL"
  | "IBAN"
  | "CREDIT_CARD"
  | "JWT"
  | "API_KEY"
  | "GENERIC_SECRET";

// Types that must NEVER be sent to an AI provider, even redacted — their
// presence itself means the request path is wrong (brief §13: BLOCK, not
// "try to hide it").
export const SECRET_TYPES: ReadonlySet<PiiType> = new Set([
  "JWT",
  "API_KEY",
  "GENERIC_SECRET",
]);

export interface PiiFinding {
  type: PiiType;
  start: number;
  end: number;
}

interface Pattern {
  type: PiiType;
  regex: RegExp;
  validate?: (match: string) => boolean;
}

function luhnValid(digits: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

const PATTERNS: Pattern[] = [
  // Saudi National ID / Iqama: 10 digits, starts with 1 (citizen) or 2 (resident)
  { type: "NATIONAL_ID", regex: /\b[12]\d{9}\b/g },
  // Saudi mobile numbers: +9665XXXXXXXX, 9665XXXXXXXX, or 05XXXXXXXX
  { type: "PHONE", regex: /\b(?:\+?9665|05)\d{8}\b/g },
  { type: "EMAIL", regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g },
  // Saudi IBAN: SA + 22 digits
  { type: "IBAN", regex: /\bSA\d{22}\b/gi },
  {
    type: "CREDIT_CARD",
    regex: /\b(?:\d[ -]?){13,19}\b/g,
    validate: (match) => luhnValid(match.replace(/[ -]/g, "")),
  },
  { type: "JWT", regex: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g },
  {
    type: "API_KEY",
    regex: /\b(?:sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16})\b/g,
  },
  {
    type: "GENERIC_SECRET",
    regex: /\b(?:password|passwd|secret|api[_-]?key|token)\s*[:=]\s*\S+/gi,
  },
];

export function detectPii(text: string): PiiFinding[] {
  const findings: PiiFinding[] = [];
  for (const pattern of PATTERNS) {
    // RegExp with the global flag keeps state on `.lastIndex`; use a copy
    // per call so repeated calls don't skip matches from stale state.
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (pattern.validate && !pattern.validate(match[0])) continue;
      findings.push({ type: pattern.type, start: match.index, end: match.index + match[0].length });
    }
  }
  return findings.sort((a, b) => a.start - b.start);
}
