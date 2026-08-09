import { detectPii, type PiiFinding } from "./pii";

// Replaces detected spans with typed placeholders rather than deleting
// them, so downstream logic can still reason about text structure
// ("a phone number was here") without ever seeing the value.
export function redactText(text: string): { redacted: string; findings: PiiFinding[] } {
  const findings = detectPii(text);
  if (findings.length === 0) return { redacted: text, findings };

  // Merge overlapping findings (e.g. a credit-card-shaped span inside a
  // longer digit run) by taking the earliest start / latest end per
  // overlapping cluster, so we don't produce malformed output.
  const merged: PiiFinding[] = [];
  for (const finding of findings) {
    const last = merged[merged.length - 1];
    if (last && finding.start <= last.end) {
      last.end = Math.max(last.end, finding.end);
    } else {
      merged.push({ ...finding });
    }
  }

  let result = "";
  let cursor = 0;
  for (const span of merged) {
    result += text.slice(cursor, span.start);
    result += `[REDACTED:${span.type}]`;
    cursor = span.end;
  }
  result += text.slice(cursor);

  return { redacted: result, findings };
}
