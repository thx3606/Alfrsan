# Data Classification

Every field stored by KHIBRA is classified below. Classification drives:
default visibility, whether it may ever reach the AI Privacy Gateway, log
handling, and retention.

## Classes

- **Public** — safe to show to anyone, including unauthenticated visitors.
- **Internal** — visible to the platform and the owning user; not exposed
  to other users by default.
- **Confidential** — visible only to the owning user (and admins under
  audited access); never sent to AI, never logged in full.
- **Secret** — never persisted in plaintext, never logged, never sent
  anywhere except the exact mechanism designed for it (e.g. password hash
  verification).

## Field-level classification (current schema)

| Model.field | Class | Notes |
|---|---|---|
| `User.displayName` | Public | Shown on public profile |
| `User.avatarUrl` | Public | EXIF/GPS stripped before storage (upload pipeline — future) |
| `User.bio` | Public | User-authored, moderated |
| `User.email` | Confidential | Never shown to other users; used for auth/notifications only |
| `User.phoneNumber` | Confidential | Never shown to other users |
| `User.passwordHash` | Secret | Argon2id; never leaves the auth module; never logged |
| `User.nationalId` (on `VerificationRequest`) | Secret | Only touched by the verification workflow; never sent to AI; never logged; access restricted to verification service |
| `Session.token` | Secret | Only ever compared server-side; never logged |
| `MfaTotp.secret` | Secret | Encrypted at rest (see `prisma/schema.prisma` note); never logged |
| `RecoveryCode.codeHash` | Secret | Hashed, single-use |
| `ExpertProfile.specialties/yearsExperience/skills` | Public | Expert-authored, part of discovery |
| `VerificationRequest.documentUrl` | Confidential | Object storage, not web-served directly (future upload pipeline) |
| `Content.body` (Question/Answer/Article) | Public (once published) | Goes through moderation pipeline before public visibility (future) |
| `Rating.*` | Internal | Aggregate is public (score), individual rater identity is Internal |
| `ReputationEvent.*` | Internal | Computed, not user-editable |
| `AuditLog.*` | Confidential (admin-only) | Never contains secrets/passwords/tokens by construction |
| `Consent.*` | Internal | Drives what may be sent to AI/analytics |

## AI eligibility

A field may be included in any AI Gateway request **only if** it is
classified `Public` or `Internal` **and** has no PII/secret pattern
detected by the DLP engine at request time (defense in depth — the
classification table is a first filter, the DLP scan is the enforced
control). `Confidential` and `Secret` fields are structurally excluded from
any AI Gateway call path in code (see `src/modules/ai-gateway`).

## Retention (target policy — enforcement job is future work)

| Data | Retention |
|---|---|
| Active account data | Retained while account is active |
| Deleted account | 30-day soft-delete grace period, then hard delete except records required by law (e.g. financial/audit records, retained per applicable legal minimums) |
| Audit logs | 1 year rolling |
| Session tokens | Expire on logout or 30 days of inactivity, whichever first |
| Recovery codes | Rotated on use; unused codes expire when MFA is reconfigured |
