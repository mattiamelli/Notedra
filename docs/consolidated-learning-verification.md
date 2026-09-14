# Consolidated learning experience verification

Content revision inspected: `35338354f916e2433085e726ea19cccfd2747a33`.

The accepted advanced bank was preserved. The active catalog now contains 681 eligible exercises: 210 Computer Organisation, 192 Reasoning and Logic, and 279 Introduction to Programming. Eight source-linked Assembly trace exercises were added after auditing the existing bank for register, stack, and call-tracing coverage.

| Requirement | Source/component | Initial finding | Implementation | Evidence | Gate |
| --- | --- | --- | --- | --- | --- |
| Readable prose and code | Product, Practice, Topic Study, Exam styles | Body and code text could be cramped; some Java samples obscured structure | Consistent body/code sizing, preserved indentation, contained horizontal scrolling; reviewed `adjust(int x)` example | TypeScript, Java fixture verification, responsive browser checks | PASS |
| Written Overview for every topic | Canonical academic index, authored lesson summaries and source IDs | Overview repeated dashboard-like metadata | All 43 registered topics receive 2–4 connected source-grounded paragraphs; metadata grid removed | `consolidated-overview.test.ts` enumerates all topics and provenance | PASS |
| Five-language learning UI | Central message catalog and content catalogs | Generated recommendations, Progress, Mistakes, Assembly explanations and CO workspace had English leakage | Stable-key UI translations plus presentation-time content localization for en/it/es/fr/de; canonical course/topic names and technical tokens remain English | i18n enumeration, interpolation, locale-switch and technical-token tests | PASS |
| Screenshot cases A–J | CO workspace, Dashboard, Assembly, Progress, Study Path, Mistakes, Java runner | Reproduced untranslated or unclear states described in the brief | Localized presentation paths, explicit confidence labels, preserved canonical titles and readable code | Targeted routing/UI tests and manual desktop/mobile theme/locale checks | PASS |
| Progressive typed Assembly tracing | CO lecture source `CO_LEC_02`, Assembly simulator | Existing bank had limited dedicated progressive multi-register tracing | Added 8 exercises covering one call, frames, stack slots, sequential/nested calls and the owner benchmark; 1–5 exact typed fields | Validator checks checkpoints, independent benchmark states, call limit, supported instructions and numeric parsing | PASS |
| Dynamic exercise completion | Active catalog and persisted graded attempts | Dashboard cards did not derive completion from the loaded bank | Shared selector counts distinct available exercises and distinct finalized graded attempts; duplicates and removed IDs are excluded | Empty/partial/full, 20/40→20/50, deduplication and color tests | PASS |
| Course-card navigation | Dashboard course cards | Redundant Browse topics row and no completion metric | One semantic whole-card link, accessible progress bar and localized count; redundant row removed | Keyboard/routing and completion UI tests | PASS |
| Protected behavior | Preservation manifests and existing evidence fixtures | Required strict cross-patch preservation | Exact chained hashes preserve the accepted predecessor and current content; no Supabase, Auth, database, RLS, sync, CAS/PT409, mastery or readiness algorithm edits | Hardening, mastery, readiness, sync/security validators and final diff audit | PASS |

## Assembly benchmark evidence

The high-difficulty item starts at `main` with `%rsp = 0x1000` and `%rbp = 0x2000`, and stops immediately after the first execution of `addq $24, %rsp`. The independently asserted checkpoint is `%rax = 38`, `%rdi = 18`, `%rsp = 0x1000`, `%rbp = 0x2000`. Transfer into `first` has `%rsp = 0x0FE0`; transfer into `second` has `%rsp = 0x0FC0`; return from `second` yields `%rax = 34`, `%rdi = 13` before the next instruction in `first`.

## Completion contract

An exercise is complete after at least one finalized, valid, persisted graded submission, correct or incorrect. This measures completed exercise activity; it does not change or stand in for Learning Mastery or Exam Readiness. Each canonical exercise counts once regardless of attempts, locales, views, or typed fields.

## Manual acceptance routes

The final browser pass covers Dashboard and course cards; CO Boolean workspace; Assembly execution and typed tracing; Progress; Study Path; Mistakes; and the IP method-call exercise. Each is checked at desktop and mobile widths, in light and dark themes, with English and a non-English locale. System theme remains covered by the existing theme test matrix.

Final production-preview acceptance on 2026-09-14 passed at 1280 px and 390 px across English, Italian, Spanish, French and German. It also passed System theme switching without reload, the Italian Boolean-workspace leakage check, four labelled owner-benchmark fields, the reviewed Java line structure, and one-step Assembly execution history. The run used fresh anonymous browser contexts and no learner account or remote data.
