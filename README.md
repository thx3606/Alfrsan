# خِبرة | KHIBRA

> المعرفة من أهلها، والقيمة تثبتها النتيجة.

KHIBRA is a Saudi-first knowledge and expertise network: verified experts,
real questions, real answers, and a reputation system built on quality and
outcomes rather than followers or engagement. See `ARCHITECTURE.md` for the
full system design and `ROADMAP.md` for what's implemented versus planned.

**Project status: early build (Phase 1–4 of 17). Not production-ready.**
See `SECURITY.md` for the hardening checklist that must be completed
before any production deployment.

## Documentation

| Doc | Purpose |
|---|---|
| `ARCHITECTURE.md` | System design, module boundaries, key decisions |
| `THREAT_MODEL.md` | STRIDE threat model |
| `SECURITY.md` | Security policy, severity levels, hardening checklist |
| `DATA_CLASSIFICATION.md` | Field-level data sensitivity classification |
| `AI_SECURITY.md` | AI Privacy Gateway design and current implementation status |
| `ROADMAP.md` | Phase-by-phase build status |

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript
- **Database**: PostgreSQL via Prisma
- **Auth**: Argon2id password hashing, TOTP MFA, server-side sessions
- **Validation**: Zod
- **Styling**: Tailwind CSS, RTL-first (Arabic primary, English secondary)
- **Tests**: Vitest

## Local development

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (local or via `docker compose up -d db`)

### Setup

```bash
cp .env.example .env       # fill in local values — never commit real secrets
npm install
npx prisma migrate dev     # applies schema to your local Postgres
npm run dev
```

Open http://localhost:3000.

### Tests

```bash
npm test
```

## Environment variables

See `.env.example` for the full list. Nothing in `.env.example` is a real
secret — it exists only to document required variables.

## Security

Please read `SECURITY.md` before reporting a vulnerability or deploying
this project anywhere reachable by real users. Do not deploy this
repository's current state to production — see the hardening checklist in
`SECURITY.md`.
