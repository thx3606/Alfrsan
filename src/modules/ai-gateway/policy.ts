import { detectPii } from "./pii";

// Deny-by-default policy engine. Per brief §13, the policy on any
// detected PII/secret is BLOCK — explicitly NOT "redact it and send
// anyway." `redact.ts` exists as a separate utility (e.g. for safely
// logging or displaying a preview of blocked content) but is never used
// here to launder a request into an approval.

export type DataClassification = "Public" | "Internal" | "Confidential" | "Secret";

export interface AiRequest {
  purpose: string;
  dataClassification: DataClassification;
  consentGiven: boolean;
  text: string;
}

export type PolicyDecision =
  | { allowed: true }
  | { allowed: false; reason: string };

// Only these classes may ever reach an AI call path — enforced here in
// addition to the field-level exclusion described in DATA_CLASSIFICATION.md
// (defense in depth: even if a caller mistakenly tags something wrong
// upstream, this is the second gate).
const AI_ELIGIBLE_CLASSIFICATIONS: ReadonlySet<DataClassification> = new Set([
  "Public",
  "Internal",
]);

export function evaluateAiRequest(request: AiRequest): PolicyDecision {
  if (!request.consentGiven) {
    return { allowed: false, reason: "consent_required" };
  }

  if (!AI_ELIGIBLE_CLASSIFICATIONS.has(request.dataClassification)) {
    return { allowed: false, reason: "classification_not_eligible" };
  }

  if (detectPii(request.text).length > 0) {
    return { allowed: false, reason: "sensitive_data_detected" };
  }

  return { allowed: true };
}
