# KHIBRA (خِبرة) — Architecture

## 1. Product summary

KHIBRA is a Saudi-first knowledge-and-expertise network. Unlike engagement-driven
social networks, its core metric is **verified, useful knowledge** — not
followers, likes, or watch time. The central object is not "the post" but
**the question, the answer, and the outcome it produced.**

Primary flows:

- A user asks a question or browses knowledge content.
- The platform matches the question to qualified, verified experts.
- Experts answer; users rate usefulness/accuracy and can record a real-world
  **Outcome** ("this solved my problem").
- Every expert accrues a **Knowledge Reputation Score** computed from
  quality, verified expertise, and outcomes — not popularity.

This document covers the technical architecture as implemented in this
repository today. See `ROADMAP.md` for what is designed but not yet built.

## 2. High-level architecture

```
                         ┌─────────────────────────────┐
                         │        Client (Browser)      │
                         │  Next.js App Router (RTL,    │
                         │  Arabic-first, i18n-ready)    │
                         └───────────────┬──────────────┘
                                         │ HTTPS (HSTS, CSP)
                         ┌───────────────▼──────────────┐
                         │   Next.js Server (App+API)    │
                         │  - Route handlers (REST-ish)  │
                         │  - Server Components           │
                         │  - proxy.ts (security)      │
                         └───┬───────────┬───────────┬───┘
                             │           │           │
                 ┌───────────▼──┐  ┌─────▼─────┐ ┌───▼────────────┐
                 │  Service Layer│  │ AI Privacy │ │ Rate Limiter /  │
                 │  (auth, repu- │  │ Gateway    │ │ Audit Logger    │
                 │  tation, con- │  │ (isolated) │ │ (server-only)   │
                 │  tent, verify)│  └─────┬─────┘ └────────────────┘
                 └───────┬───────┘        │
                         │         (sanitized only)
                 ┌───────▼───────┐        │
                 │  Prisma ORM    │        ▼
                 │ (parameterized)│   External/self-hosted
                 └───────┬───────┘   AI provider (future,
                         │           behind provider
                 ┌───────▼───────┐   abstraction — not
                 │  PostgreSQL    │   wired yet)
                 │ (least-priv.   │
                 │  app role)     │
                 └────────────────┘
```

Supporting services referenced by design but not deployed in this phase:
Redis (rate-limit/session cache backing, queues), object storage (S3-compatible,
for uploads), OpenSearch (full-text/semantic search). See `ROADMAP.md`.

## 3. Why a modular monolith, not microservices (decision)

The master brief allows microservices "when needed" but explicitly warns
against adopting them for appearances. At current stage (pre-product-market
fit, single team, <100k users target for phase 1) a modular monolith is the
correct choice:

- **Lower operational burden**: one deployable, one migration history, no
  distributed-transaction problems for flows that span Users/Content/
  Reputation (which are tightly coupled here).
- **Faster iteration** on the reputation algorithm and matching logic, which
  will change weekly early on — cross-service contracts would slow that down.
- **Still decomposable later**: modules are isolated under `src/modules/*`
  with explicit boundaries (no module reaches into another module's Prisma
  models directly; everything goes through a service interface). This makes
  a future extraction (e.g. Search or AI Gateway to its own service) a
  refactor, not a rewrite.

Risk accepted: a single Postgres/app becomes a scaling bottleneck past
several million users. Mitigation: stateless app tier behind a CDN/WAF,
read replicas, and the module boundaries above keep extraction cheap.

## 4. Module boundaries (`src/modules/*`)

| Module | Responsibility | Status |
|---|---|---|
| `auth` | Registration, login, sessions, MFA (TOTP), password policy, CSRF | Implemented |
| `users` | User profiles, privacy settings, consent | Implemented (core) |
| `experts` | Expert profile, verification levels, verification requests | Implemented (core) |
| `content` | Questions, Answers, Articles (polymorphic content model) | Implemented (core) |
| `reputation` | Knowledge Reputation Score engine | Implemented (v1) |
| `ai-gateway` | PII/secret detection, redaction, policy engine, provider abstraction | Implemented (detection + policy; no external provider wired) |
| `security` | Rate limiting, audit log, security headers | Implemented |
| `moderation` | Content moderation pipeline | Not yet implemented — see ROADMAP |
| `search` | Full-text/semantic search | Not yet implemented — see ROADMAP |
| `payments` | Marketplace/consultation payments | Not yet implemented — see ROADMAP |
| `notifications` | Push/email/SMS | Not yet implemented — see ROADMAP |
| `admin` | Admin dashboard, four-eyes approvals | Not yet implemented — see ROADMAP |

Each module owns its Prisma models and exposes a `service.ts` — route
handlers call services, never Prisma directly, so authorization checks live
in one place per module (§21 "never trust the client" from the brief).

## 5. Data flow: "Ask a question" (illustrative)

1. Client submits question via `POST /api/questions` (authenticated, CSRF
   token validated, rate-limited per user+IP).
2. Route handler validates payload with a Zod schema (reject unknown
   fields, enforce length/type limits).
3. `content` service persists the Question with `authorId` from the
   **server-side session**, never from client-supplied body.
4. `reputation`/expert-matching (future) ranks candidate experts by
   specialty + reputation score + availability — not by follower count.
5. Any AI-assisted classification of the question text passes through the
   **AI Privacy Gateway** first (PII/secret redaction, policy check) before
   any model call — see `AI_SECURITY.md`.
6. Response never echoes internal IDs/stack traces; errors map to a
   catalog (`AUTH_xxx`, `CONTENT_xxx`, `SECURITY_xxx`) with a correlation ID.

## 6. Authentication & session architecture

- Passwords hashed with **Argon2id** (`argon2` package), unique salt per
  hash (library-managed), tuned parameters in `src/modules/auth/password.ts`.
- Sessions are opaque random tokens (not JWT) stored server-side
  (`Session` table) and referenced via an `HttpOnly`, `Secure`,
  `SameSite=Lax` cookie — avoids the "trust the client's claims" failure
  mode of unsigned/overly-trusted JWTs for session state.
- Refresh/session rotation: on privilege-relevant actions (password change,
  MFA change) all other sessions are revoked.
- MFA: TOTP (RFC 6238) via `otplib`, with single-use recovery codes stored
  hashed (Argon2id).
- CSRF: double-submit cookie pattern validated on all state-changing routes.

## 7. Database

PostgreSQL, accessed exclusively through Prisma with parameterized queries
(no raw string concatenation). See `prisma/schema.prisma` and the ERD in
`DATA_CLASSIFICATION.md` / `prisma/schema.prisma` comments. The app
connects as a least-privilege role (`khibra_app`), never a superuser — see
`SECURITY.md` §Database.

## 8. AI Privacy Gateway (summary — full detail in `AI_SECURITY.md`)

No user data reaches an external AI provider without passing:
`Data Classification → PII/Secret Detection → Redaction → Policy Engine
(deny-by-default) → (only if approved) AI call → Output Security Filter`.

In this phase, **no external AI provider is wired up** — that requires a
provider decision (self-hosted vs. hosted, e.g. Anthropic/OpenAI/Azure) and
an API key, which is a decision for the product owner (data residency and
cost implications). What *is* implemented and real: the detection engine,
redaction, and the deny-by-default policy engine, independently testable
and enforced regardless of which provider is chosen later.

## 9. Deployment shape (target, not yet automated in this phase)

Dev → Staging → Production, physically separate environments/secrets
(§129). CI runs lint/typecheck/tests before merge (see `ROADMAP.md` for
CI/CD pipeline status — not yet implemented in this phase).

## 10. What changed from the previous repository content

This repository previously contained an unrelated car-rental fleet
management app (`cavalry-fleet`: cars/bookings/promotions/admin). Per
explicit product direction, that application has been retired and this
repository now hosts KHIBRA. See `ROADMAP.md` for the phased build plan.
