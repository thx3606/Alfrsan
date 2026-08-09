# KHIBRA — Threat Model (STRIDE)

Scope: this document covers the systems implemented in this phase (auth,
user/expert profiles, content/Q&A, reputation, AI privacy gateway) plus the
target architecture for systems not yet built (flagged **[future]**), so
the threat model stays ahead of implementation rather than trailing it.

## 1. Assets

- User credentials (password hashes, MFA secrets, recovery codes)
- Session tokens / cookies
- PII: names, phone numbers, emails, national ID (if collected for
  verification), location, uploaded identity documents
- Private messages **[future]**
- Content (questions, answers, articles) and authorship/ownership
- Reputation scores and rating data (integrity-critical — gameable = broken
  product)
- Verification level and supporting documents (expert credentials)
- Payment data **[future — never stored directly, provider-hosted only]**
- Audit logs / security event logs
- AI Gateway policy configuration and redaction rules
- Admin credentials and admin session state

## 2. Actors

- Anonymous visitor
- Authenticated regular user
- Authenticated expert (verified at some Level 0–5)
- Admin / moderator (role-scoped)
- Platform AI Gateway (a *system* actor with no standing DB access)
- External AI provider **[future]** — treated as untrusted-by-default,
  receives only sanitized data
- Attacker (external, unauthenticated or authenticated-low-privilege)
- Malicious/compromised expert account (insider-adjacent threat)

## 3. Trust boundaries

1. Browser ⇄ Next.js server (public internet, TLS-terminated at edge)
2. Next.js server ⇄ PostgreSQL (private network; least-privilege DB role)
3. Next.js server ⇄ AI Privacy Gateway (in-process today; a separate
   service boundary once extracted per `ARCHITECTURE.md` §3)
4. AI Privacy Gateway ⇄ External AI provider **[future]** — the hardest
   boundary: everything crossing it is assumed to leave our security
   perimeter permanently.
5. Regular user ⇄ Admin surfaces (must never be reachable without an
   Admin-role, MFA-verified session)
6. Uploaded file ⇄ server processing (untrusted content boundary)

## 4. STRIDE analysis

### 4.1 Spoofing

| Threat | Mitigation | Status |
|---|---|---|
| Credential stuffing / brute force on login | Argon2id hashing, rate limiting per IP+account, generic error messages (no user enumeration via timing/messages) | Implemented |
| Session token theft via XSS | HttpOnly cookies (JS cannot read them), CSP restricting inline script | Implemented |
| Session fixation | New session token issued on login, old sessions revoked on password/MFA change | Implemented |
| MFA bypass | TOTP required when enabled; recovery codes single-use, hashed at rest | Implemented |
| Impersonating an expert (fake credentials) | Multi-level `VerificationRequest` workflow, human review required for Level ≥3 | Implemented (workflow) / human review process is procedural, not automatable |

### 4.2 Tampering

| Threat | Mitigation | Status |
|---|---|---|
| Client-supplied `authorId`/`role`/`reputationScore` in request bodies | Server derives identity from session only; Zod schemas reject unknown/extra fields; reputation is server-computed, never client-writable | Implemented |
| SQL injection | Prisma parameterized queries exclusively; no raw string concatenation | Implemented |
| Tampering with another user's content (IDOR) | Every mutating query includes an ownership/role predicate at the service layer, re-checked server-side regardless of what the UI shows | Implemented |
| Reputation manipulation (vote rings, self-rating) | Self-rating blocked at the DB constraint + service layer (`Rating.raterId != content.authorId`); anomaly signals designed in `reputation` module for **[future]** fraud engine | Implemented (hard block) / anomaly detection is future work |

### 4.3 Repudiation

| Threat | Mitigation | Status |
|---|---|---|
| Admin/user denies performing a sensitive action | `AuditLog` records actor, action, target, timestamp, correlation ID for security-relevant events (login, MFA change, verification decisions, role changes) | Implemented (core events) |
| Log tampering | Audit log is append-only from the app's perspective (no update/delete API); production would ship to a write-once sink **[future infra]** | Partially implemented (app-level); infra-level immutability is future work |

### 4.4 Information Disclosure

| Threat | Mitigation | Status |
|---|---|---|
| Sensitive user data sent to an external AI model | AI Privacy Gateway: PII/secret detection + redaction + deny-by-default policy engine, enforced before any external call **[external call itself is future — not wired]** | Implemented (detection/policy); no external call exists yet to leak from |
| Verbose errors leaking stack traces/SQL/paths | Central error mapping to an error catalog (`AUTH_xxx`, `CONTENT_xxx`, `SECURITY_xxx`); raw errors logged server-side only | Implemented |
| Enumeration via login/registration responses | Identical generic responses for "wrong password" vs "no such account" | Implemented |
| Overexposed profile fields (phone/email/national ID) | Privacy-by-default field visibility; only explicitly public profile fields are returned by public endpoints | Implemented (schema-level default) |
| Secrets in logs | Audit/log helpers strip known secret-shaped fields before writing | Implemented (allow-list logging, not raw object dumps) |

### 4.5 Denial of Service

| Threat | Mitigation | Status |
|---|---|---|
| Auth endpoint flooding | Rate limiter keyed by IP + account on `/api/auth/*` | Implemented (in-memory; Redis-backed for multi-instance is **[future]**) |
| Large payload abuse | Body size limits enforced at the route/schema layer | Implemented (basic) |
| L7/L3 volumetric DDoS | CDN/WAF/DDoS protection in front of the app | **[future infra]** — not applicable to a single dev environment |

### 4.6 Elevation of Privilege

| Threat | Mitigation | Status |
|---|---|---|
| Regular user reaching admin functionality | No admin routes exist yet in this phase (see `ROADMAP.md`); when built, will require role check at middleware + service layer + DB query predicate (defense in depth, not a single `if role === 'admin'`) | Deferred — tracked as a hard requirement before any admin route ships |
| Escalating verification level client-side | Verification level is a server/service-computed + human-approved field; never accepted from client input | Implemented |
| JWT/session forgery | No unsigned/self-asserted identity tokens; opaque server-side session lookups only | Implemented |

## 5. Residual risks (accepted for this phase, tracked)

- No WAF/DDoS layer yet — acceptable for a pre-launch dev/staging phase,
  **must** be resolved before internet-facing production launch.
- No moderation pipeline yet — content is not yet screened for
  spam/hate/fraud before publish. Tracked as a release blocker in
  `ROADMAP.md` / `PRODUCTION_RELEASE_CHECKLIST.md` (future).
- Rate limiting is in-memory (single instance only); will not hold under
  horizontal scaling until backed by Redis.
- No automated secret-scanning/SAST/DAST wired into CI yet in this repo.
- File upload handling (for expert verification documents, avatars) is not
  yet implemented; must ship with magic-byte validation, storage outside
  web root, and malware scanning before any upload endpoint is exposed.

## 6. Non-goals for this phase (explicitly out of scope, see ROADMAP)

Payments, messaging, mobile apps, search engine, moderation ML, admin
panel, external AI provider wiring, Kubernetes/multi-region deployment.
