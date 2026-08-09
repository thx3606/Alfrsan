# Database ERD (Phase 1–4 schema)

Relationships (1—1, 1—N, N—N) for `prisma/schema.prisma`. Full field list and
sensitivity classification: `DATA_CLASSIFICATION.md`.

```
User 1───1 ExpertProfile
User 1───N Session
User 1───1 MfaTotp
User 1───N RecoveryCode
User 1───1 Consent
User 1───N Question        (author)
User 1───N Answer          (author)
User 1───N Article         (author)
User 1───N Rating          (rater)
User 1───N Report          (reporter)
User 1───N Outcome         (reportedBy)
User 1───N AuditLog         (actor, optional)

ExpertProfile N───N Topic  (via ExpertProfileTopic)
ExpertProfile 1───N VerificationRequest
ExpertProfile 1───N ReputationEvent

Topic 1───N Question (optional)
Topic 1───N Article  (optional)

Question 1───N Answer
Answer   1───N Rating
Answer   1───1 Outcome
```

Design notes:

- `ExpertProfile` is optional 1:1 off `User` — every expert is a user, not
  every user is an expert. Becoming an expert does not require a separate
  account.
- `ReputationEvent` is an append-only ledger; `ExpertProfile.reputationScore`
  is a cache recomputed by `src/modules/reputation`. Never trust the cache
  as a write target from outside that module.
- `Rating` has a unique constraint on `(answerId, raterId)` — one rating per
  person per answer — and the service layer additionally rejects a rating
  where `raterId === answer.authorId` (no self-rating).
- `Report`/`AuditLog` model the two different "who did what" needs:
  `Report` is user-initiated (a case), `AuditLog` is system-recorded
  (an event), and neither is ever modified after creation by application
  code.
