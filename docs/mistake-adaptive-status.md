# Mistake Book and Adaptive Study Path — Step 9

**COMPLETE — Step 9 accepted.** Starting commit `1288bf4`, clean before edits. No reset/restart/discard occurred. Step 10 and later are not started; no deployment.

## Baseline and checkpoint

Fresh baseline: all 18 commands passed, **1,317 tests / 49 files**. See [baseline evidence](mistake-adaptive-baseline.json). Initial implementation: **1,423 tests / 55 files**, typecheck, production build and adaptive bundle check passed. Six defects were reproduced before fixes: five in the separate adversarial self-review and one in production responsive acceptance. See [review](mistake-adaptive-review.md). After the final fix, all 23 final commands passed again: **1,432 tests / 57 files**, zero skipped tests, typecheck and production build. All 49 baseline test files retain their exact test counts; no baseline test was removed or skipped. See [test inventory](mistake-adaptive-test-inventory.json) and [final command evidence](mistake-adaptive-final-validation.json).

## Persistence and migration

Student Schema **1 → 2**; IndexedDB **1 → 2**. Retain database name `delftstudy-student-v1`, store `student`, keys `active` and `recovery`. The name is an existing storage identity, not the current version number. Preserve each original attempt object, answer, timestamp, revision, operation ID and exact definition/grader binding. Schema 2 adds only `reviews: {attemptId,reviewedAt,revision}[]` to backups/datasets. Evidence and recommendations are derived, not stored as mutable academic truth. Undo stores a null reviewedAt with a newer revision.

During the native versionchange transaction, validate and convert both active and recovery; add empty review arrays to v1 records; change active generation; preserve dataset revision. All writes and the database version roll back together on malformed records, interrupted writes or incomplete legacy storage. A cooperative older connection closes on versionchange; an old client reopening version 1 receives VersionError. Every write still checks generation and the relevant record revision in the same strict-durability transaction and acknowledges only transaction completion. Workflow conflicts cannot overwrite another tab’s review. No unload dependency.

Schema 1 imports receive strict full preflight and conversion before any active writes. Schema 2 imports validate review references, duplicate IDs, timestamp/revision shape and exact attempt contracts. Future schemas/DB versions fail explicitly. Restore replaces active plus the pre-import recovery atomically and assigns a new generation, rejecting stale-tab writes. Recovery includes pre-import workflow. No automatic deletion or regrading. Capacity is now 5,000 attempts /16 MB; Schema 1 import keeps its original 1,000 /4 MB validation limits. When full, writes fail rather than dropping history. Local transaction completion does not guarantee survival of browser deletion or device/OS failure.

The historical enrichment/IP baseline manifests remain intact. A narrowly scoped three-file migration allowlist (`step9-storage-lock.json`) binds both the original and accepted new hashes of contracts.ts, repository.ts and StudentDataPanel.tsx (capacity message). All other protected bytes remain checked; arbitrary drift in these three files also fails the gate. StudentDataPanel retains replacement confirmation and recovery export.

## Factual mistake model

The existing PracticeService and feedback system are reused unchanged. Resolve the original immutable binding first, then use that exact grader; never fall back to a different definition/grader version. A submitted valid deterministic incorrect result becomes one mistake referencing the original attempt. Correct, DRAFT, ABANDONED, INCOMPLETE, INVALID, technical ERROR and NOT_AUTOGRADABLE produce no mistakes. Missing historical bindings and future-clock submissions have a visible limited/unavailable state, not an inferred wrong result.

Only exact authored atomic item identities with canonical ownership and a matching HIGH-confidence lecture source receive skill-level evidence. Imported broad/source-only mappings, LOW/uncertain locators, altered targets and integrated open assignments cannot grant child-skill mistakes. All 100 existing fixed items retain their bindings. This is authored practice evidence, not exam-mapping confidence or assessment credit. The seven IP integrated program mappings, UNKNOWN locators and course policies stay unchanged.

Authored pattern metadata stays separate. Shared `explainAnswer` matches only declared deterministic wrong patterns against an exact-bound profile. The derived result references pattern ID/version; no diagnosis, misconception history record or copied submitted answer is added to storage. A profile match means that this answer matches the current preserved authored rule, not that the app observed the learner’s mental state. Unmatched wrong answers retain general feedback without a tag.

Open R&L proof/self-check text, IP coding drafts, CO workspace interactions, reading and flashcard reveals never become correctness evidence. They remain unexecuted/unscored where applicable. No new questions, graders, learner-code execution, network requests, analytics or cloud sync were added.

## Aggregation, filters and improvement

Groups are keyed by exact canonical skill, never by topic alone. Within each skill, repeated exact patterns are keyed by pattern ID/version and count actual submitted attempts and distinct items in the inclusive rolling 30-day window. All-time wrong history is retained separately. Times use UTC milliseconds; injected time makes the selectors reproducible. Stable IDs break timestamp ties; a same-timestamp success is not assumed later.

States: active; repeated (at least two wrongs in30 days); recently corrected (one strictly later correct result on that skill); improving (at least two); old (latest wrong older than 90 days without later success). These labels never mean mastery. New wrong evidence after a success restores urgency. Marking reviewed is workflow only, not correctness. No history is automatically removed.

Mistake Book supports course, topic, exact skill, matched pattern, 7/30/90-day or all-history filters; recent-first, needs review, repeated, later correct evidence, reviewed and old views. Each card shows original answer/reference, time, eligible skill, explanation/reasoning, optional exact pattern, transparent group counts/latest occurrence, immutable submission link, Retry as new attempt and Mark/Undo reviewed. Results paginate20 at a time. Historical limitations are separate. Topic Mistakes and factual recent summaries on Dashboard/topic pages link into the same area. No evidence means no invented summary.

## Adaptive model and signals

Pure selectors take the learner snapshot and an explicit clock. No runtime LLM. Only existing content/actions are recommended. A generated projection of **82 existing actions** contains canonical metadata for existing guides, workspaces and 15/30/60 coding tasks; no teaching/reference code is bundled into the initial route.

Priority is a DelftStudy product heuristic, not scientifically validated:

- Recency:40 points through 7 days,25 through 30,10 through 90,2 thereafter (inclusive boundaries).
- Repetition:8×min(4,recent wrong count−1), floored at 0.
- Latest exact pattern match:+6.
- Item diversity:+6×min(2,recent distinct items−1), floored at 0.
- Any strictly later correct evidence:−25; reviewed latest mistake:−5; total floored at 0.
- Canonical prerequisite with its own recent wrong evidence, for a downstream skill with at least two recent wrongs and no later success: +30 AND hard precedence over that downstream skill. No invented parent/child edges; same-course ownership required.

Order eligible groups using prerequisite precedence and priority among available groups, then stable skill IDs. Within each group: exact retry+3; related atomic item+1; Learn−4/cards−6; after three wrong submissions on the same item or later success, suppress that exact retry and prefer Learn+8 or unscored reinforcement+5. Authored coding that fits the chosen budget receives+12 (+2 for exact budget match). Stable action IDs break ties. Related fixed items exclude the latest failed item, three-times-failed items and items with a recent correct result.

The queue covers distinct skill groups first, then optionally a second different action: at most4 actions,2 per skill,2 per activity kind, no duplicate destination, sum of labelled durations within the budget. Presets10/20/30/45/60+ plan up to 60 min. Available time stays in the URL, not a personal schedule. Generic durations (Learn/cards5, related fixed item8, guide/workspace10) are explicitly DelftStudy estimates; coding uses authored15/30/60 labels. No exact completion prediction.

Each reason names the exact skill, recent count/window (or old history), safely matched repetition and item diversity where available, later-success reduction, and any canonical prerequisite. Open activity suggestions explicitly remain unscored. Course/topic context filters the queue. Refresh reloads saved evidence and updates the injected clock; there is no rapidly changing timer or endless feed.

No mastery percentages, grade/readiness predictions, broad skill inflation, exam engine, Mock Exams implementation, accounts, Supabase, scheduling, cloud or deployment. Manual dismiss/snooze is deliberately omitted; review/undo provides the supported workflow action.

## Acceptance evidence

Every command below was executed again after the final CSS correction, not inferred from an earlier run. Full command timings and log digests are in [final validation](mistake-adaptive-final-validation.json). Vitest storage cases use fake-indexeddb; UI cases use jsdom and do not claim native layout or Safari behavior.

| Requirement | Test file / test name or executed check | Command | Actual result |
|---|---|---|---|
| Exact release, checksums, IDs, relations and uncertainty | content-validation / “passes schema, exact counts, semantic integrity and all release checksums” plus 38 negative/regression cases | `pnpm run validate:content`; full Vitest suite | PASS; all 8 SHA-256 checks plus independently pinned manifest |
| Academic/reference/topic projections | academic-index, student-references, topic-projection | `check:academic`, `check:references`, `check:topics`, `validate:topics` | PASS;43 topics/105 subtopics/147 skills |
| Existing content and behavior | CO, RL, IP, enrichment, PracticeService, grading, storage and Assembly test files | `validate:practice`, `validate:co`, `validate:rl`, `validate:enrichment`, `validate:ip`; full suite | PASS; all 1,317 baseline cases retained |
| Old attempts preserved | mistake-migration / “migrates valid legacy backups without rewriting submitted bytes”; “atomically upgrades active and recovery, preserves revisions and changes generation” | `pnpm test --maxWorkers=2` | PASS |
| Atomic migration failure | mistake-migration / malformed active/recovery cases; “abort after a migration put request succeeds rolls back version and all data”; adaptive-review / “incomplete legacy storage rolls back version and preserves recovery bytes” | full suite | PASS |
| Workflow, backup, restore and stale epochs | mistake-migration / “review, undo and conflicts preserve the original answer and submission”; “new-schema export and legacy restore keep a pre-restore recovery, reject stale writes”; “aborted restore preserves attempts and workflow together” | full suite | PASS;18 migration cases total |
| Only objective wrong evidence | mistake-evidence / “wrong deterministic submission becomes one factual mistake with exact trusted pattern”; open/code/correct/draft/invalid cases; mistake-failures / four evaluator statuses | full suite | PASS;28 evidence +4 explicit failure-status cases |
| Original historical version, no current fallback | mistake-evidence / “prior immutable binding remains available; a newer/changed binding is limited, never regraded”; existing practice-catalog/service version tests | full suite | PASS |
| Exact pattern; no broad or integrated inflation | mistake-evidence / “unmatched valid wrong tuple has explanation and no invented pattern”; “tampered/broad … cannot inflate skill evidence”; “requires exact high-confidence source metadata and canonical ownership” | full suite; `validate:mistakes` | PASS;100 exact fixed item bindings |
| Aggregation, distinct items, same-time events | mistake-evidence / “same pattern counts actual attempts and distinct items within inclusive 30 days”; “same-skill different items aggregate without merging their distinct patterns”; adaptive-review deterministic success ordering | full suite | PASS |
| Success retains history but reduces urgency | mistake-evidence / “later successful retry changes state without removing the wrong submission”; adaptive-engine / “later success reduces priority without erasing underlying mistakes” | full suite | PASS |
| Deterministic ranking, UTC boundaries and recurrence | adaptive-engine / input-order equality, exact7/30/90-day boundaries, recent repeated versus old, success-before-new-error | full suite | PASS |
| Canonical prerequisite ordering | adaptive-engine / “recommends an actual prerequisite first only if both skills have exact recent wrong evidence”; adaptive-review / downstream8-errors precedence regression | full suite; `validate:adaptive` | PASS; no invented or parent-topic edges |
| Budget, diversity and anti-loop | adaptive-engine / five budget cases; time changes coding; “repeated familiar retries shift to explanation instead of an indefinite retry loop”; distinct-group caps | full suite | PASS;21 engine cases total |
| UI filters, retry, review/undo, errors, deep links and factual summaries | adaptive-ui /13 cases including course-filter repeated-pattern regression | full suite | PASS |
| Gates and eager/raw bundle rejection | adaptive-validation /24 cases; adaptive-review unreachable-chunk regression | full suite; `validate:mistakes`; `validate:adaptive`; `check:adaptive-bundle` | PASS |
| Existing lazy-loading guards | all earlier inventory and negative bundle tests | `check:co-bundle`, `check:rl-bundle`, `check:enrichment-bundle`, `check:ip-bundle` | PASS |
| Performance, deterministic immutable output | adaptive-performance / “derives and ranks … immutable submissions deterministically within a 5-second safety ceiling” for 100/1,000/5,000 | full suite | PASS; see timings below |
| Type safety / production | TypeScript and all production validation plugins | `pnpm run typecheck`; `pnpm run build` | PASS |
| Trusted IP reference implementation regression |49 compiled fixed fixtures;11 assignment references/144 assertions | `pnpm run verify:ip-java` | PASS; OpenJDK Temurin 21.0.12.1; no learner code executed |
| Real IndexedDB / page reload / multi-tab | tests/browser/verification.ts and step9.ts; production two-tab UI | build-learning-browser-check.ts then Chromium UI buttons and reload | PASS;29 native checks separately from mocks |
| Real responsive / keyboard / routing / Assembly | production build, real app submission flows and measured viewports | Chromium 152.0.7977.64 via browser UI | PASS; details below |
| Patch whitespace | complete final diff | `git diff --check` | PASS |

The full command list comprises 17 content/projection/bundle gates, all tests, typecheck, production build, trusted Java verification, the separate native harness build, and diff checking: **23/23 exit0**. Content Pack **v1.0.1 / academic schema1.1.0** remains authoritative; v1.0.0 is unused. Canonical counts remain 90 documents (IP28/CO29/RL33), 43 topics, 105 subtopics, 147 skills, 37 assessments,489 mapped questions, 17 question types,22 exam patterns and 29 common-error tags. Relations remain 62 topic prerequisites, 69 skill prerequisites, 105 topic/subtopic, 147 subtopic/skill, 306 document/topic, 37 assessment/document, 538 question/topic and 2, 005 question/skill edges.

## Actual production Chromium acceptance

Tested **Chromium 152.0.7977.64 on macOS**, isolated production origin127.0.0.1:4211. The harness uses a separate origin4212 and named test databases; existing learner storage was not overwritten. Browser history was constructed through actual app controls, not by injecting storage. [Browser evidence](mistake-adaptive-browser.json) records routes, test submission IDs, measured widths, native results and final assets.

- Nine deterministic submissions: CO overflow wrong twice then a correct new retry; R&L implication exact-match wrong and unmatched wrong; IP equality exact wrong; CO memory prerequisite wrong plus two cache-field wrongs. Mistakes correctly shows8 original wrong submissions. One further keyboard Retry creates a new editable IP draft; it does not add a mistake.
- Known matches carry the authored pattern. Unmatched R&L0,0,0 has general reasoning and no invented pattern. The correct CO retry changes its two original wrong cards to recently corrected without removing either answer. Original submitted forms stay read-only.
- Course/pattern filtering changes2 R&L mistakes to 1 matched mistake. Back/Forward restores the filters. Review and Undo work; review does not mean learned. Full reload retains all 8 wrongs and the saved review marker.
- Actual two-tab conflict: tabA marks the cache mistake reviewed; tabB with the old revision receives “Review state changed in another tab. Reload before changing it.” Reload saved evidence loads the committed review instead of overwriting it. Native tests also reject stale generations after restore/migration.
- Open proof notes plus a revealed rubric and an edited MaterialKey.java draft do not increase the8 mistakes. Both existing activities still explicitly state unscored/no automatic correctness. No learner code is executed.
- Cache-topic Study Path places “Build a wider, deeper memory” first, with its canonical prerequisite reason, before “Separate cache address fields”. The all-course20-minute queue spans CO/R&L/IP and contains two retries and one unscored guided action; every action explains its evidence and duration.
- IP equality context at 10 min yields a 5 min retry plus 5 min Learn; at 60 min it yields the existing60 min Workshop material ledger. Its keyboard-activated direct link opens the actual task; the explanation calls it unscored reinforcement.
- Dashboard shows8 recent mistakes; cache-topic summary shows2. No percentages, grade/readiness predictions or inferred mastery are shown.
- Both Mistakes and Study Path were measured at 390/768/1280 px. Final document widths equal scroll widths in all 6 cases. The R&L long-title mobile failure was captured before the scoped CSS fix and the same route/data then passed390→390. Keyboard filters, review, Retry and activity links operate; Escape closes the mobile navigation and returns focus to Open navigation. Visual inspection used the actual rendered viewport, not jsdom.
- Final-build Assembly: Basic arithmetic RAX8 in3 instructions; Stack frame RAX15 in9; Function call RAX7/RBX7 in10. Every example completes with RSP/RBP4096 (0x1000).
- Native final run:13 existing scenarios +1 actual reload,14 Step 9 scenarios +1 actual reload =**29 PASS**, zero native failures. These include real versionchange, request-success-then-abort, upgrade rollback toDB1, original binding/answer preservation, old-client VersionError, Schema 1 import, Schema 2 round trip, restore recovery and stale writes. Permission-denial behavior is explicitly injected; it is not a real disk quota experiment.
- Inspected production QA, second tab and harness consoles: **zero warnings/errors**. Browser automation locator timing corrections are tool issues, not app console events.

Safari and Firefox: **NOT RUN**. No claim that this Chromium run tests actual Safari, WebKit or mobile hardware. Physical power-loss/disk-failure persistence and genuine quota exhaustion: **NOT RUN**; deterministic abort/denial cases cover error propagation, not every OS failure. These do not replace browser-data backups.

## Performance and bundle evidence

Final full-suite derivation plus ranking:100 attempts **14.36 ms**,1,000 **62.39 ms**,5,000 **238.50 ms**. Each case also checks reversed input yields identical output and immutable attempts stay unchanged. The5-second safety ceiling passes; timings are local observations, not a device-independent promise. Work groups/indexes actual records rather than pairwise-comparing every attempt. Rendering is paginated20 cards at a time.

| Production output | Raw bytes | Gzip bytes |
|---|---:|---:|
| Initial JS |485,110|127,345|
| Change from baseline |+3,488|+1,022|
| Mistakes route |9,398|3,354|
| Study Path + recommendation engine +82-action projection |35,849|8,373|
| Shared evidence selector/hook |3,196|1,568|
| Total emitted assets |1,438,259|423,752|

See [adaptive bundle inventory](adaptive-bundle-report.json). Mistakes, Study Path, engine, evidence and actions are reachable lazy modules, not initial imports. Dashboard’s tiny summary loader only imports evidence when submitted records exist. No new dependency was added; pnpm-lock.yaml is unchanged. The bundle guards reject source PDFs/ZIPs, full Handoff, source-validation material, reports and test fixtures, including renamed PDF signatures. No raw source or full Handoff is shipped. Existing CO/R&L/IP/enrichment boundaries all pass.

## Preservation, review and scope

[Preservation evidence](mistake-adaptive-preservation.json) compares SHA-256 bytes for **191 protected files** with 1288bf4: all identical. This includes canonical/generated academic truth, all published CO/R&L/IP/enrichment teaching/practice/grader content, PracticeService, Assembly workbench/engine/components/examples/utilities, original baseline manifests and lockfile. Original IP protection manifest:92/95 unchanged plus the3 explicitly approved migration files; enrichment:80/83 plus those same3. These three new hashes are locked rather than exempted. Source reviews were not repeated and source PDFs/ZIPs were not modified.

Baseline test adaptations are limited to the authorized schema/DB 2 and capacity transition, opening the existing test database version, and real new routes replacing placeholders. Future-version rejection now tests3; capacity rejection still proves no eviction at 5,000. Immutability, idempotency, retries, ineligible old evidence policy and unavailable-version checks remain intact. [Per-file counts](mistake-adaptive-test-inventory.json) prove every baseline file retains its test count, with 115 additional cases across 8 files.

The distinct adversarial **self-review** is not an independent audit. Six confirmed defects were reproduced before minimal fixes: incomplete legacy upgrade, prerequisite ordering under disproportionate errors, unreachable lazy-chunk guard, same-time success ordering, filtered repeated-pattern summary, and mobile long-heading overflow. All targeted checks and the full final suite were rerun. [Review details](mistake-adaptive-review.md) identify RED/GREEN evidence.

Limitations are deliberate: bounded local storage; unavailable historical versions are preserved but limited; recommendations are transparent product heuristics; no scheduling predictions; no dismiss/snooze beyond review/undo; unscored coding/proofs/workspaces remain unscored. No mastery, readiness, predicted exam grade, global Exam Engine, Mock Exams implementation, accounts, Supabase, cloud sync, runtime LLM or learner-data transmission. No Step 10 or later work, deployment or unrelated Assembly refactor. **Stop after Step 9.**

## Final Git identity

Starting commit: `1288bf4`. The final acceptance commit is the commit carrying this report and its evidence (message `feat: add trusted mistake history and deterministic study path`). Its exact immutable hash is returned in the delivery message and can be obtained with `git log -1 --format=%H -- docs/mistake-adaptive-status.md`; this avoids embedding a commit hash inside the content that determines that same hash. Final working tree: clean, checked with `git status --porcelain` after the acceptance commit and reported in delivery. All implementation, documentation and evidence are committed together; no partially applied subsection remains.

## Changed-file inventory

The exact added/modified paths relative to 1288bf4 follow. Existing generated bundle reports changed because they measure the final build; protected content projections did not change.

- `README.md` — modified
- `docs/adaptive-bundle-report.json` — added
- `docs/co-bundle-report.json` — modified
- `docs/enrichment-bundle-report.json` — modified
- `docs/ip-bundle-report.json` — modified
- `docs/mistake-adaptive-baseline.json` — added
- `docs/mistake-adaptive-browser.json` — added
- `docs/mistake-adaptive-final-validation.json` — added
- `docs/mistake-adaptive-preservation.json` — added
- `docs/mistake-adaptive-review.md` — added
- `docs/mistake-adaptive-status.md` — added
- `docs/mistake-adaptive-test-inventory.json` — added
- `docs/rl-bundle-report.json` — modified
- `package.json` — modified
- `scripts/adaptive-actions.ts` — added
- `scripts/adaptive-bundle.ts` — added
- `scripts/enrichment.ts` — modified
- `scripts/inspect-adaptive-build.ts` — added
- `scripts/ip-content.ts` — modified
- `scripts/mistake-adaptive-validation.ts` — added
- `scripts/step9-storage-lock.json` — added
- `scripts/storage-migration-preservation.ts` — added
- `scripts/validate-adaptive.ts` — added
- `scripts/validate-enrichment.ts` — modified
- `scripts/validate-mistakes.ts` — added
- `src/App.tsx` — modified
- `src/academic/navigation.ts` — modified
- `src/adaptive/EvidenceSummary.tsx` — added
- `src/adaptive/MistakesPage.tsx` — added
- `src/adaptive/StudyPathPage.tsx` — added
- `src/adaptive/SummaryLoader.tsx` — added
- `src/adaptive/actions.json` — added
- `src/adaptive/adaptive.css` — added
- `src/adaptive/engine.ts` — added
- `src/adaptive/evidence.ts` — added
- `src/adaptive/filters.ts` — added
- `src/adaptive/useEvidence.ts` — added
- `src/learning/StudentDataPanel.tsx` — modified
- `src/learning/contracts.ts` — modified
- `src/learning/repository.ts` — modified
- `src/pages/DashboardPage.tsx` — modified
- `src/pages/TopicPage.tsx` — modified
- `tests/adaptive-engine.test.ts` — added
- `tests/adaptive-performance.test.ts` — added
- `tests/adaptive-review.test.ts` — added
- `tests/adaptive-ui.test.tsx` — added
- `tests/adaptive-validation.test.ts` — added
- `tests/application-routing.test.tsx` — modified
- `tests/browser/index.html` — modified
- `tests/browser/step9.ts` — added
- `tests/browser/verification.ts` — modified
- `tests/enrichment-service.test.ts` — modified
- `tests/helpers/adaptive.ts` — added
- `tests/helpers/learning.ts` — modified
- `tests/ip-practice.test.ts` — modified
- `tests/learning-contracts.test.ts` — modified
- `tests/learning-repository.test.ts` — modified
- `tests/mistake-evidence.test.ts` — added
- `tests/mistake-failures.test.ts` — added
- `tests/mistake-migration.test.ts` — added
- `tests/practice-service.test.ts` — modified
- `tests/topic-ui.test.tsx` — modified
- `vite.config.ts` — modified
