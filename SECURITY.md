# Security Policy

## Reporting a vulnerability

If you believe you've found a security vulnerability in KHIBRA, please
report it privately rather than opening a public issue. Include:

- A description of the vulnerability and its impact
- Steps to reproduce (proof-of-concept if possible)
- Affected component/URL/endpoint

We do not yet have a public bug bounty program; this project is pre-launch.
Do not test against production data or third-party accounts without
authorization.

## Severity levels and response posture

| Severity | Definition | Release policy |
|---|---|---|
| Critical | Remote code execution, full auth bypass, mass PII exposure, AI data exfiltration to an external party | Blocks release. No exceptions. |
| High | Privilege escalation, IDOR on sensitive data, stored XSS, significant business-logic bypass | Blocks release unless a documented risk acceptance is signed off by a security reviewer, with a committed fix timeline |
| Medium | Limited-scope info disclosure, missing defense-in-depth control, rate-limit gaps | Must have a tracked remediation plan; does not block release by itself |
| Low | Hardening opportunities, verbose (but non-sensitive) errors, minor header gaps | Logged and triaged by priority |

## Security architecture summary

See `THREAT_MODEL.md` for the full STRIDE analysis and `ARCHITECTURE.md`
for system design. Key controls implemented in this phase:

- **Authentication**: Argon2id password hashing, TOTP MFA, hashed
  single-use recovery codes, opaque server-side sessions (not client-
  trusted JWTs), session revocation on sensitive changes.
- **Session cookies**: `HttpOnly`, `Secure`, `SameSite=Lax`.
- **CSRF**: double-submit token validated on all state-changing routes.
- **Authorization**: every mutating operation re-checks ownership/role at
  the service layer server-side; nothing is trusted from the client beyond
  "which record did they ask for."
- **Injection**: Prisma parameterized queries exclusively; Zod schema
  validation rejects unexpected input shapes on every route.
- **Security headers**: CSP, HSTS, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy, frame-ancestors protection — see `proxy.ts`.
- **Rate limiting**: per-IP and per-account limits on authentication
  endpoints (in-memory in this phase; Redis-backed is required before
  multi-instance production deployment — see `ROADMAP.md`).
- **AI data isolation**: PII/secret detection and deny-by-default policy
  engine sit between any user data and any AI call — see `AI_SECURITY.md`.
  No external AI provider is connected in this phase.
- **Audit logging**: security-relevant events (login, MFA change,
  verification decisions) are recorded with actor/action/target/timestamp,
  with secrets/PII excluded by construction (allow-listed fields only).

## Explicit security assumptions and residual risks

- This phase has **no WAF/DDoS layer, no moderation pipeline, no
  automated SAST/DAST/secret-scanning in CI, and no admin panel**. None of
  these are implemented yet; see `ROADMAP.md` and
  `THREAT_MODEL.md` §5 for the tracked list. **This means the current
  state of this repository is not production-ready and must not be
  deployed to handle real user data as-is.**
- Rate limiting is single-instance (in-memory) and will not hold under
  horizontal scaling.
- No penetration test has been performed against this codebase.
- We do not claim "100% secure" or "no vulnerabilities" anywhere in this
  project's documentation, per explicit product direction — only that
  known, testable controls are implemented and verified by the test suite
  referenced in each module.

## Hardening checklist before any production deployment

- [ ] WAF + DDoS protection in front of the application
- [ ] Redis-backed distributed rate limiting
- [ ] Moderation pipeline for all user-generated content
- [ ] SAST + dependency scanning + secret scanning in CI, blocking merge
- [ ] Admin panel with mandatory MFA and four-eyes approval for
      destructive actions
- [ ] External penetration test against OWASP ASVS
- [ ] Backup + restore drill completed and documented
- [ ] Incident response runbook rehearsed
