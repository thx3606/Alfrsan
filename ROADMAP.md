# KHIBRA — Build Roadmap

The product brief for KHIBRA describes a full platform: web + mobile,
expert verification, reputation engine, AI gateway, moderation, payments,
marketplace, admin panel, search, Kubernetes-scale infra, and more. That
is a multi-quarter, multi-team effort. Per the brief's own guidance
(§142 "don't write a million files at once — implement in phases", §138
"don't tell me it's done if it isn't"), this repository is being built in
phases. This file is the source of truth for what's actually implemented
versus planned.

## Phase status

| Phase | Scope | Status |
|---|---|---|
| 1 | Architecture, threat model, security model, docs | **Done** (this change) |
| 2 | Database schema (PostgreSQL/Prisma) | **Done** (this change) — core entities only, see below |
| 3 | Authentication (password + MFA + sessions) | **Done** (this change) |
| 4 | Core platform (home, expert profile, Q&A CRUD) | **Done, minimal** (this change) — no feed ranking, no rich media yet |
| 5 | Experts (verification workflow) | **Partial** — data model + request/decision flow exist; document upload, knowledge assessment tests, human-review UI are not built |
| 6 | Content (articles, videos, courses, case studies, etc.) | **Not started** — only Question/Answer/Article exist as content types |
| 7 | Questions ("ask an expert" matching) | **Partial** — question creation/listing exists; specialty-based expert matching/ranking is not implemented |
| 8 | Reputation | **Partial (v1)** — deterministic score from ratings/outcomes/verification is implemented and tested; anti-fraud signal collection (device fingerprint, timing analysis) is not implemented |
| 9 | Moderation | **Not started** |
| 10 | AI Gateway | **Partial** — PII/DLP detection, redaction, deny-by-default policy engine implemented and tested; no external/self-hosted AI provider is wired up (requires a product decision — see `AI_SECURITY.md`) |
| 11 | Security hardening (WAF, distributed rate limiting, SAST/DAST in CI) | **Not started** — see `SECURITY.md` hardening checklist |
| 12 | Payments | **Not started** |
| 13 | Admin panel | **Not started** |
| 14 | Mobile apps (iOS/Android) | **Not started** |
| 15 | Testing (full security/load/chaos suite) | **Partial** — unit tests for auth, reputation, DLP exist; no E2E, load, or chaos testing |
| 16 | Hardening (pen test, bug bounty readiness) | **Not started** |
| 17 | Production launch checklist | **Not started** — see hardening checklist in `SECURITY.md` |

## Explicitly not in this phase (do not assume these exist)

- Mobile apps, messaging/DMs, marketplace/payments, university mode,
  business accounts, voice question transcription, search engine
  (OpenSearch), Knowledge Graph, recommendation engine, notifications
  (push/email/SMS), admin dashboard, moderation ML, fraud/anti-bot engine,
  Kubernetes/multi-region deployment, CI/CD pipeline, WAF/CDN/DDoS layer.

## Immediate next steps (recommended order)

1. File upload pipeline (avatars, verification documents) with magic-byte
   validation and object storage — required before any real expert
   verification flow can go live.
2. Moderation pipeline for published content — required before public
   content publishing is safe.
3. Admin panel with mandatory MFA + four-eyes for destructive actions —
   required before any human-review workflow (verification decisions,
   reports) can function.
4. CI pipeline: lint, typecheck, unit tests, dependency/secret scanning
   blocking merge.
5. Redis-backed rate limiting once running more than one app instance.
