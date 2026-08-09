import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Security-relevant event logging. See THREAT_MODEL.md §4.3 (Repudiation)
// and DATA_CLASSIFICATION.md. This module is the ONLY writer of AuditLog
// rows in the codebase — enforce the "never log secrets" rule in one place
// rather than trusting every call site.

export type AuditAction =
  | "auth.login.success"
  | "auth.login.failure"
  | "auth.logout"
  | "auth.register"
  | "auth.password.changed"
  | "auth.mfa.enabled"
  | "auth.mfa.disabled"
  | "auth.mfa.failure"
  | "auth.session.revoked_all"
  | "expert.verification.requested"
  | "expert.verification.approved"
  | "expert.verification.rejected"
  | "content.report.filed";

// Allow-listed metadata keys only. This is intentionally restrictive: if a
// future call site wants to log a new field, it must be added here after
// review, rather than a call site being able to pass an arbitrary object
// that might contain a token or password by accident.
const ALLOWED_METADATA_KEYS = new Set([
  "reason",
  "level",
  "previousStatus",
  "newStatus",
  "method",
  "path",
]);

function sanitizeMetadata(
  metadata: Record<string, unknown> | undefined,
): Prisma.InputJsonValue | undefined {
  if (!metadata) return undefined;
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (!ALLOWED_METADATA_KEYS.has(key)) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      clean[key] = value;
    }
  }
  return clean;
}

export async function recordAuditEvent(params: {
  actorId?: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  correlationId: string;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      metadata: sanitizeMetadata(params.metadata),
      correlationId: params.correlationId,
    },
  });
}
