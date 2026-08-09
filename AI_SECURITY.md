# AI Security & Data Policy

## The one rule that overrides all others

**No user data reaches an external AI provider without first passing
through the AI Privacy Gateway, which is deny-by-default.** If the
gateway cannot positively confirm data is safe to send, the request is
blocked — not degraded, not "best effort," blocked.

## Current implementation status

This phase implements the **detection and policy layers** of the gateway
(`src/modules/ai-gateway`):

- `pii.ts` — pattern-based detectors for Saudi National ID / Iqama numbers,
  phone numbers (+966 and local formats), email addresses, IBANs, credit
  card–shaped numbers, JWTs, API-key–shaped tokens, and common secret
  prefixes (`sk-`, `ghp_`, AWS-style keys, etc.).
- `redact.ts` — a standalone utility that replaces detected spans with
  typed placeholders (`[REDACTED:PHONE]`, `[REDACTED:NATIONAL_ID]`, ...).
  It is **not** used to launder a blocked request into an approved one —
  per brief §13 the policy on detection is BLOCK, explicitly not "hide it
  and send anyway." It exists for safe internal use cases (e.g. showing a
  moderator a preview of why something was blocked) — nothing in the
  approval path depends on it.
- `policy.ts` — deny-by-default policy engine: a request must declare
  `purpose`, `dataClassification`, and `consentGiven`; any PII/secret
  match anywhere in the text, or any `Confidential`/`Secret`-classified
  payload (see `DATA_CLASSIFICATION.md`), or missing consent, causes the
  engine to return `BLOCKED` with a reason code — never a partial pass and
  never a "redacted version" sent through instead.
- `gateway.ts` — the only public entrypoint. **No external AI provider is
  wired up in this phase.** Calling `gateway.send()` today runs the full
  pipeline and, on approval, throws `AI_PROVIDER_NOT_CONFIGURED` rather
  than silently no-op'ing or fabricating a response. This is intentional:
  wiring a real provider is a product decision (self-hosted model vs.
  Anthropic/OpenAI/Azure-hosted, with real data-residency and cost
  implications — see §"What's deliberately not decided yet" below) and we
  will not fake that integration.

## Pipeline (as specified, current implementation coverage marked)

```
User Data
  ↓
Data Classification            [implemented — DATA_CLASSIFICATION.md + schema-level tagging]
  ↓
PII Detection                  [implemented — pii.ts]
  ↓
Sensitive Data Detection        [implemented — pii.ts secret detectors]
  ↓
Policy Engine (deny-by-default) [implemented — policy.ts; BLOCKS on any
                                  detection rather than redacting and
                                  continuing, per brief §13]
  ↓
AI Gateway                      [implemented as a blocking stub — gateway.ts]
  ↓
Approved AI Model                [NOT implemented — no provider wired]
  ↓
Output Security Filter          [NOT implemented — nothing to filter yet]
  ↓
Response
```

## Provider abstraction (design, for when a provider is chosen)

`src/modules/ai-gateway/provider.ts` defines an `AiProvider` interface
(`classify`, `summarize`, `embed`) so that swapping providers — or moving
to a self-hosted model — never requires touching call sites. No concrete
provider implementation exists yet.

## No-training policy

Default and current reality: **no user data is sent to any external party
for any purpose**, because no external party is connected. When a
provider is chosen, the default configuration MUST set
"no-training"/zero-retention where the provider offers it, and platform
data may never be used to train an external model without explicit
informed consent, a documented legal basis, and data isolation controls —
none of which exist yet because there is nothing to opt into.

## Kill switch

Because no provider is wired, the kill switch requirement (§95–96 of the
product brief) is currently satisfied trivially: the platform has zero
runtime dependency on AI today (`gateway.send()` is not called from any
shipped feature). When AI features are added, each call site must be
wrapped in a feature flag that can be disabled without a deploy — this is
tracked in `ROADMAP.md` and must be implemented in the same change that
adds the first live AI feature, not after.

## What's deliberately not decided yet (needs a product/legal decision)

- Which AI provider(s) to use, and whether any workload requires
  self-hosting for Saudi data-residency reasons — this affects contract
  terms, DPAs, and cost, and should not be decided unilaterally in code.
- Retention/logging policy for AI Gateway requests themselves (the
  metadata *about* a request, not the content) — needs a privacy review
  before implementation.
- Whether voice transcription (§51 of the product brief) runs locally or
  via a hosted STT provider — has direct data-residency implications.

## Testing

`src/modules/ai-gateway/__tests__` contains adversarial test cases that
assert the policy engine blocks: raw national ID numbers, raw phone
numbers, JWT-shaped strings, `sk-`-prefixed keys, and payloads carrying
`Confidential`/`Secret`-classified fields — see `TESTING.md` (future) for
the full AI security test catalog as it grows.
