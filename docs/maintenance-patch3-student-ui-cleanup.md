# Maintenance Patch 3 — student UI cleanup

## Scope and invariants

This patch changes learner-facing presentation only. Mastery, readiness,
confidence, coverage, evidence eligibility, grading, learner records, backup
semantics, cloud sync, CAS/PT409, RLS, account isolation, Assembly behavior and
Study Path ranking remain unchanged.

## Student-facing audit

- **Immediate learner information:** mastery, readiness, confidence, skills
  needing practice, recent mistakes and next actions remain visible.
- **Occasional explanation:** metric explanations, source scope and Study Path
  selection rules use native, keyboard-accessible disclosures.
- **Account and data management:** export, import, recovery and local-data
  warnings now live in Account under **Data & Privacy**.
- **Technical detail:** evidence policy/version information remains available
  behind nested technical details. Canonical IDs remain in models, routes,
  fragment targets and React keys, but are no longer printed as learner content.

Notable cleanup covered Progress, Dashboard summaries, Study Path, Mistake Book,
Practice attempt metadata, Account, course/topic overview, flashcards and
supplemental cards. Mock Exams, review, Assembly and sync status were audited;
no unrelated redesign or behavior change was required.

## Presentation decisions

- Unknown mastery appears as **Not enough practice yet** and unknown readiness
  as **Not enough exam practice yet**. Neither is displayed as zero or failure.
- Coverage is described as skills with reliable practice. Confidence explains
  how much reliable practice supports the estimate.
- Readiness explicitly remains study guidance and does not estimate an exam
  result or chance of passing.
- Historical submissions whose original activity cannot be verified remain
  saved and are described without grader or binding terminology.
- Data-loss, restore, account-separation and sync warnings remain visible in
  learner language.

## Validation

- Focused Progress, Account, Dashboard, backup, cloud, exam and topic tests:
  PASS.
- Full Vitest: 91 files, 2,048 tests PASS.
- TypeScript and production build: PASS.
- Content, academic, mastery, readiness, hardening and final security checks:
  PASS.
- Production, Progress, cloud, CO, R&L, IP, enrichment, adaptive and exam bundle
  guards: PASS.
- Java release verification: 49 compiled fixtures PASS.
- Bundle delta versus the accepted Patch 2 report: initial JavaScript -609
  bytes (-137 gzip); total assets -838 bytes.
- Browser acceptance: Account and Progress passed at the available 812 px
  viewport with no horizontal overflow. The 375 px viewport could not be
  selected in the available browser surface; no CSS was changed and the
  accepted Patch 2 375 px evidence remains structurally applicable.
