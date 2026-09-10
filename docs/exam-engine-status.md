# Step 10 — Exam Engine + Mock Exams

**ACCEPTED — Step 10 verification completed on 10 September 2026.** Step 11 and later were not started. No deployment, accounts, mastery, readiness or grade prediction was added.

## Baseline and commit identity

Starting commit: `1cea2d124b6aa2cb9762f974bfe13c608aa69efc`, inspected clean before implementation. Steps 1–9 and the supplemental enrichment patch were retained. The second attachment supplied sections 10–50 of the same specification; work continued without a reset or restart.

The accepted final commit is the commit containing this report, identifiable with `git log -1 --format=%H -- docs/exam-engine-status.md`; its exact hash is reported in the completion message. The commit packages the tested implementation and this evidence together. Git status is checked again after committing; generated production/native test output is ignored. This report does not substitute an earlier checkpoint result for final acceptance.

Baseline: **1,432 tests / 57 files**, 23/23 baseline commands passed, including production and trusted Java checks (`exam-baseline-results.json`). Supplied source ZIPs matched all 90 canonical document hashes: IP 28, CO 29, R&L 33 (`exam-baseline-source-archive-check.json`). These are baseline/source evidence, not the final test run.

Final: **1,540 tests / 62 files**, no skipped or removed baseline cases. The 108 added tests are in five Step 10 files. Existing test changes update the deliberate schema version, construct genuine legacy backups without new fields, and replace the former exam-placeholder expectation. The previous native Step 9 harness now constructs a genuine Schema 1 fixture and expects DB 3; its original behavioral assertions still run.

## Architecture and lifecycle

One shared typed exam system lives in `src/exams/`. `types.ts` separates blueprint, item definition, exact binding, session response, immutable evaluation, separate review and provenance. `engine.ts` owns selection, absolute timing, exact resolution and summary. `records.ts` performs bounded record/backup validation. `evaluation.ts` reuses the existing Practice catalog, exact `versionBinding`, `gradeResponse` and Step 9 `eligibleSkill`; it does not introduce a second grader or recommendation engine.

The React route is lazy. `ExamsPage` provides landing/setup/history; `ExamSessionPage` handles navigation and confirmation; `ExamReviewPage` presents immutable answers and the accepted shared Feedback component. The open editor and three reference payloads load separately. Existing CO/R&L/IP learning, PracticeService, feedback, Mistake Book, Study Path, generated indices and Assembly source have no diff against the accepted baseline.

Before Start, setup has no persisted session. Start creates an `IN_PROGRESS` session after a committed write. Responses/flags can change under epoch and revision checks. Submit atomically writes `SUBMITTED`, exact answers, original question/blueprint/evaluator versions, submittedAt, component results and eligible evidence attempts. Abandon locks saved responses without evaluation. Retake creates a new UUID and deadline, leaving the previous record unchanged. An identical repeated submission operation is idempotent; conflicting content is rejected. Review/undo uses separate revisioned records and cannot edit submitted responses or add correctness points.

Routes: `/exams`, `/exams/history`, `/exams/:courseId/setup`, `/exams/sessions/:sessionId`, `/exams/review/:sessionId`. Local missing-session links explain the absence rather than inventing data. Saved active routes reload drafts; saved submitted routes stay locked. Result question selection uses `?q=`. Browser Back/Forward remains provided by the existing router.

## Timing, autosave and navigation

Policy: `ABSOLUTE_FREEZE_CONFIRM_V1`. StartedAt and deadlineAt are persisted ISO timestamps; remaining time is derived from deadline minus the current clock. The interval only refreshes the display. Reload and background elapsed time do not create a new deadline. At or after expiry, repository writes reject new answers; previously saved responses remain and the student **explicitly confirms** submission. Exact-boundary tests use an injected clock. No three-hour wall-clock wait is claimed.

`useExamDraft` immediately queues serialized writes, retaining the latest draft and committed revision separately. “Saved in this browser” follows repository completion, not an individual IndexedDB request. Pending saves disable final submission. A failure stops the queue, retains unsaved form text and displays a reload action; a stale tab cannot silently overwrite a newer answer. Dynamic grading code is loaded before opening the final write transaction. Essential persistence does not depend on unload/beforeunload.

Numbered buttons expose current, answered, unanswered and flagged state. Next/previous, next flagged and next unanswered support the same jump grid. Flags are workflow only. Before confirmation, the modal lists answered, unanswered, open/rubric and flagged counts. Blank/whitespace responses are explicitly UNANSWERED, distinct from incorrect or ungradable answers. Submission is allowed with blanks. Review navigation and native dialog buttons work with keyboard input.

## Storage migration and recovery

One deliberate upgrade: **Student Schema 2 → 3; IndexedDB 2 → 3**. Academic schema stays **1.1.0**, Content Pack **v1.0.1**. Database name remains `delftstudy-student-v1`; the existing `student` store still holds active/recovery. Added data: `exams` and `examReviews`. Schema 1/2 backups and databases upgrade directly, preserving prior attempt and review values. Unsupported future versions, extra/malformed legacy fields, corrupt sessions and inconsistent evidence fail validation before active replacement.

The existing transaction-completion/abort behavior and generation mechanism are reused. The epoch and target record revision are checked in the write transaction. Restore validates first, retains the previous active backup as recovery and replaces active with a new generation in one transaction. Failed upgrade/restore tests verify both records and DB version roll back. Cross-tab notifications are not a correctness dependency.

Bounds: 250 sessions, 64 components/session, 16,000 characters/answer, existing 5,000 attempts and 16 MB backup maximum. At a limit, a write fails visibly; it does not evict submitted history. Backups include in-progress/submitted sessions, exact bindings, timing, evaluations and separate review workflow. Submitted answers are not rewritten during migration or future evaluation. Local data can still be lost through browser-data deletion/device failure; export backups. Imports are structurally validated local data, not signed or tamper-proof academic records.

## Blueprints and question bank

Six version-1 blueprints use stable ordered slots, authored timing/weights/difficulty, canonical question types and current/recent mechanism provenance. Stable FNV-1a seed selection is persisted and tested; the first bank has **one fixed candidate per slot**, so a new seed does not imply a new question set. Constraints reject duplicates, duplicate mechanism IDs, missing coverage and overconcentration. Ordering preserves the connected IP specification. The bank is intentionally finite rather than runtime-generated.

| Course/mode | Components | Exact / open | Time | Authored difficulty (Easy / Medium / Hard) | Objective maximum / open weight |
|---|---:|---:|---:|---|---:|
| CO quick | 4 | 2 / 2 | 30 min | 0 / 2 / 2 | 4 / 8 |
| CO full | 22 | 8 / 14 | 180 min | 0 / 11 / 11 | 16 / 56 |
| R&L quick | 3 | 1 / 2 | 30 min | 0 / 1 / 2 | 2 / 8 |
| R&L full | 14 | 2 / 12 | 180 min | 0 / 2 / 12 | 4 / 48 |
| IP quick | 4 | 2 / 2 | 30 min | 0 / 2 / 2 | 4 / 12 |
| IP full | 10 | 2 / 8 | 180 min | 0 / 2 / 8 | 4 / 48 |

There are **46 unique components: 12 exact and 34 open**, with 34 separate reference approaches. Quick sets reuse a subset of their full bank; they are not additional unique questions. Difficulty is qualitative DelftStudy workload, never an official exam difficulty claim.

### CO

Full mode covers 13 technical topics (T02–T14); history is outside this technical mock. Exactly one Assembly component prevents it dominating the course. Boolean/K-map construction, CMOS, representations, ISA, BPU/microcode, interrupts, DMA, memory, cache, pipeline, parallelism and VM have calculation, tracing or explanatory components. Full question types: 9 calculate/convert, 4 state trace, 3 architecture design, 6 explanation/compare. Quick: 3 calculate/convert and 1 architecture design, including two open reasoning responses.

The 22-part authored full structure is informed by current resit breadth and separate current mid/endterm mechanisms. It does not inherit official point weights. No source-dependent diagram geometry is reconstructed.

### R&L

Full mode has 2 exact row-vector items and 12 open reasoning components. Types: 2 evaluate-model, 2 translation/formalization, 3 model/construction, 6 prove, 1 transfer/constraint. Quick combines a validity counterrow probe, formalization and induction. Full includes quantifiers, countermodels, proof methods, induction, invariants/recursive sets, sets, trees, graphs, functions/relations and transfer.

Arbitrary proof/formalization strings do not reach an exact grader. Distinct equivalent surfaces and even deliberately incorrect keyword-filled prose produce RUBRIC_REVIEW_REQUIRED, without numeric correctness. One reference approach is not declared the only valid answer. This matches the observed open-heavy current/recent assessments.

### IP

GlazeLab is one original connected programming specification, not eight unrelated trivia tasks. Full mode has two independently graded probes plus model/invariants, polymorphism, equality/hashCode, parsing/file I/O, streams, application/command handling, worker lifecycle and testing components. Each open component includes requirements, explicit rubric skill ownership and reference/test specification. Quick retains the two probes and model/equality components.

The exam editor saves code/notes as text; it is not a compiler, sandbox or multi-file IDE. The existing Coding Workbench remains unchanged and available elsewhere. Java code never enters the objective grader or a shell. Integrated completion/self-review does not award every mapped skill. Current IP integrated assessment inspection from accepted Step 8 is reused; no repeated source review was needed.

## Scoring, feedback, history and evidence

Policy: `EXACT_COMPONENTS_OPEN_UNSCORED_V1`. Each exact component has weight 2 and is binary according to its independently verified Practice oracle. Partial totals are sums of separately checked components, never partial text/keyword/code matching. There are no automatic partial points inside an open component.

Exact inventory (existing Practice IDs): CO `co-signed-five`, `co-fixed-signed`, `co-isa-capacity`, `co-micro-transfer`, `co-address-alias`, `co-cache-tag-width`, `co-pipeline-total`, `co-vm-translate`; R&L `rl-argument-counterrows`, `rl-equivalence-rows`; IP `ip-dispatch`, `ip-array-bound`, each prefixed `ds.practice.`. Their definition/grader hashes remain unchanged.

AUTO_SCORED, UNANSWERED, RUBRIC_REVIEW_REQUIRED and NOT_AUTOGRADABLE are separate immutable evaluation states. A self-reviewed open item remains unverified. Unanswered objective components earn no verified points; unanswered open work has no numeric grade. Result/history show the objective denominator separately from open authored weight and pending answered open components. The inherited one-point feedback scale is now explicitly distinguished from the two-point exam weight.

History shows course/mode/date, time limit and elapsed submission minutes, counts, verified objective points, open review count and resume/review/new-session links. Review includes exact submitted answer, objective feedback or open rubric/reference, unanswered status and source-mechanism context. It cannot predict a TU Delft grade or probability of passing.

Eligible exact component submissions become existing immutable Practice attempts in the same transaction. Each carries one exact canonical skill; existing Step 9 selectors determine whether it is a mistake and how it affects the same 82 study actions. Blank, malformed, proof and code responses create no such evidence. Session completion and flags are not academic evidence. Prior solution exposure is unknown (`null`), not falsely asserted unseen. No new mastery field or exam-specific weakness score exists.

## Historical content and authority

A session binds blueprint ID/version, ordered item ID/version, evaluator ID/version, weights, seed and timing/scoring policy. Exact resolution checks course ownership as well. Shared deterministic graders must match the original Practice hash. Missing/different historical definitions display a limited state; the original answer remains stored and is not interpreted with a newer version. Source/definition/evaluator hashes in `exam-content-lock.json` lock this first published exam version. Future material changes require deliberate new versions and retention of old definitions; automatic archive fetching is not implemented.

Fresh canonical validation passed: **90 documents, 37 assessments, 489 question/component records, 43 topics, 105 subtopics, 147 skills, 17 question types, 22 patterns, 29 common-error tags**. Relations remain 62 topic prerequisites, 69 skill prerequisites, 105 topic→subtopic, 147 subtopic→skill, 306 document→topic, 37 assessment→document, 538 question→topic and 2,005 question→skill edges. Eight manifest checksums plus the independently pinned manifest pass. Uncertainty/eligibility checks, course boundaries, prerequisite graphs and unique-document frequency checks pass. R&L still blocks 99 uncertain mappings and keeps 135 broad mappings topic-only; UNKNOWN is not promoted. IP UNKNOWN locators remain unchanged.

Content Pack **v1.0.0 is unused**. The nine v1.0.1 release files and generated academic/reference/study projections have no diff. No canonical pattern/tag or source frequency was invented. The manifest validates normalized pack files; direct PDF inspection is separately evidenced below, not claimed by the manifest command.

## Source inspection and original authorship

The detailed filename/physical-page/mechanism/era record is in [exam-source-review.md](exam-source-review.md). Inspected: CO Midterm 2025 Solutions pp1,3–5,9–11; Endterm 2025 Solutions pp1,3–7,9–12; Resit 2025 Solutions pp1,14–15,17–19. R&L Endterm 2025 pp1–5; Midterm 2025 pp1–4; Resit 2025 pp1,4–6; Endterm 2024 pp1,3–5. Accepted IP review reused: Programming Endterm 2024 pp1–9, Mock 2024 pp1–4, Resit 2024 pp1,5–6. Physical pages are one-based.

CO Endterm p3 and R&L Endterm p4 were visually inspected. CO filenames labelled 2025 contain internal 2024 dates; canonical CURRENT classification remains authoritative. The IP official mock is practice evidence, not an observed sitting. No exact frequency calculation or official weighting is claimed.

New open surfaces and GlazeLab are DelftStudy-authored; reviewed mechanisms guide breadth/response type without reproducing source stories, datasets, code or diagrams. Existing exact items retain their accepted authorship reviews. Raw extracts/renderings stayed outside the checkout. This is targeted source inspection, not an exhaustive copyright/legal audit.

## Acceptance evidence

Each command below was rerun after the final runtime fixes. `exam-final-validation.json` records exit codes, durations and retained output summaries (temporary full logs are also named). Test counts are Vitest only; native/browser checks are reported separately.

| Requirement | Test file / case or evidence | Command | Actual result |
|---|---|---|---|
| Six blueprints, course/version/seed/coverage | `exam-engine.test.ts`: per-course/mode reconstruction cases | `pnpm test --maxWorkers=2` | PASS, part of 53 engine cases |
| Reload/background/exact expiry | Same file: per-mode deadline cases; repository exact-boundary case | Same | PASS |
| Correct oracle, malformed response, blanks, independent partial components | Same file: all 12 exact bindings, blank cases, partial-points case | Same | PASS |
| CO breadth / R&L open safety / integrated IP | Same file: thirteen-cluster, twelve-open, eight-component cases | Same | PASS |
| Start/save/flag/submit/abandon/retake/lock/review | `exam-repository.test.ts`: transactional lifecycle cases | Same | PASS, 16 cases |
| Restore, old backups, future/corrupt records, rollback, stale epoch | Same file: Schema 2 preservation, three upgrade failure cases, restore/abort cases | Same | PASS |
| Large bank/history | Engine: 10,000 extra candidates ×100 selections; repository: 250 sessions | Same | PASS under 5 s / 3 s test bounds on this machine |
| Routing, missing local data, confirmation and locked review | `exam-ui.test.tsx` | Same | PASS, 4 cases; jsdom + fake-indexeddb |
| Canonical/source/content/bundle negative cases | `exam-validation.test.ts` | Same | PASS, 30 cases (23 content mutants plus bundle positive/negatives) |
| Post-green self-review / extra-review defects | `exam-review.test.ts` named regressions | Same | PASS, 5 cases |
| Existing Steps 1–9 regressions | Original 57 test files | Same | PASS, 1,432 baseline cases retained |
| Exact content, manifests, relations, uncertainty and eligibility | Existing content/source gates | See full command table | PASS |
| Published and storage fingerprints | Existing validators + chained `step10-storage-lock.json` | See full command table | PASS; historical locks retained |
| Real native durability/migration/stale connections/reload | `tests/browser/exam.ts` and updated `step9.ts` | Separate production harness, UI buttons | PASS, 10 + 15 native checks |
| Six actual exam flows and responsive UI | Production Chromium below | Production preview / CUA interaction | PASS for stated scenarios |
| Compiler/bundle/Java | Typecheck, production and trusted fixture gates | See full command table | PASS |

### Full final command results

| Command | Result | Seconds |
|---|---|---:|
| `pnpm run validate:content` | PASS (exit 0) | 2.24 |
| `pnpm run check:academic` | PASS (exit 0) | 1.78 |
| `pnpm run check:references` | PASS (exit 0) | 1.81 |
| `pnpm run validate:practice` | PASS (exit 0) | 1.79 |
| `pnpm run check:topics` | PASS (exit 0) | 1.81 |
| `pnpm run validate:topics` | PASS (exit 0) | 1.84 |
| `pnpm run validate:co` | PASS (exit 0) | 1.88 |
| `pnpm run check:co-bundle` | PASS (exit 0) | 9.39 |
| `pnpm run validate:rl` | PASS (exit 0) | 3.5 |
| `pnpm run check:rl-bundle` | PASS (exit 0) | 8.92 |
| `pnpm run validate:enrichment` | PASS (exit 0) | 2.45 |
| `pnpm run check:enrichment-bundle` | PASS (exit 0) | 9.58 |
| `pnpm run validate:ip` | PASS (exit 0) | 3.27 |
| `pnpm run check:ip-bundle` | PASS (exit 0) | 9.7 |
| `pnpm run validate:mistakes` | PASS (exit 0) | 2.21 |
| `pnpm run validate:adaptive` | PASS (exit 0) | 1.63 |
| `pnpm run check:adaptive-bundle` | PASS (exit 0) | 9.4 |
| `pnpm run validate:exam` | PASS (exit 0) | 2.37 |
| `pnpm run validate:exam-content` | PASS (exit 0) | 1.63 |
| `pnpm run check:exam-bundle` | PASS (exit 0) | 9.9 |
| `pnpm test --maxWorkers=2` | PASS (exit 0) | 45.19 |
| `pnpm run typecheck` | PASS (exit 0) | 11.32 |
| `pnpm run build` | PASS (exit 0) | 33.82 |
| `pnpm run verify:ip-java` | PASS (exit 0) | 77.57 |
| `git diff --check` | PASS (exit 0) | 0.21 |
| `node --import tsx scripts/build-learning-browser-check.ts` | PASS (exit 0) | 2.57 |

The trusted Java check compiled **49 authored fixtures** and verified **11 reference assignments / 144 assertions** with OpenJDK/Temurin 21.0.12.1. Two concurrency claims use separate model tests; the Java command does not claim nondeterministic scheduling proof. It does not execute learner code or the newly submitted exam code.

## Production Chromium acceptance

Actual browser: **Chromium 152.0.7977.64 / Google Chrome 152.0.7977.64, macOS**, read from `userAgentData.fullVersionList` in the native harness. The application ran as a production preview at isolated origin `http://127.0.0.1:4214`; the separate production-mode native harness ran at `http://127.0.0.1:4215`. Existing user/demo origins were not used for test submissions. Explicit approval for isolated Step 10 acceptance was obtained after an automatic reviewer applied an obsolete demo-only restriction.

All six flows were first exercised, then run again after the final historical-course/exposure fixes. Each final run entered one objective response and one open response, left others blank, flagged a question, reloaded the saved draft, confirmed submission and inspected the immutable review. These are representative end-to-end workflows, **not** a claim that every open component was manually solved or that a full three-hour mock elapsed.

| Final flow | Submitted session ID | Answered / unanswered / flags | Objective / open weight | Result |
|---|---|---|---|---|
| CO quick | `c53f1394-0fc3-462f-b2df-04ff5739a898` | 2 / 2 / 1 | 0/4; 8 open | PASS |
| CO full | `57512dc0-7e47-410d-9d33-c9bba018f419` | 2 / 20 / 1 | 2/16; 56 open | PASS |
| R&L quick | `a584c9b1-90de-4d9a-b3f3-102cac12e65c` | 2 / 1 / 1 | 0/2; 8 open | PASS |
| R&L full | `824de353-bcf5-40ae-93ee-ed9743265c27` | 2 / 12 / 1 | 2/4; 48 open | PASS |
| IP quick | `e0b4b8ee-a09c-43a6-9cc2-e4aa95e9400a` | 2 / 2 / 1 | 0/4; 12 open | PASS |
| IP full | `4d62f5f9-2056-4641-9932-aee6de346536` | 2 / 8 / 1 | 2/4; 48 open | PASS |

Direct before/after DOM observations verified unchanged deadlines and response text. The repeat CO full deadline was 12:33:56, R&L full 12:36:06, IP quick 10:07:14 and IP full 12:37:57 (browser local display). The initial six-flow run also verified each absolute deadline. A temporary browser helper captured stale outer variables for some repeat-run metadata; those helper deadline/session fields were excluded from this report. Session IDs above come from actual post-submit review URLs; deadlines come from direct DOM observations. Browser-tool timeouts were recovered by inspecting current page state, not counted as application failures or skipped acceptance.

Observed: objective wrong-answer feedback with correct reference and explanation; readonly inputs absent after submission; new session IDs on retake; separate self-review persisted after reload; twelve saved submitted sessions visible in history after the two runs. R&L proof containing an irrelevant induction outline stayed unscored; IP incomplete model/worker text stayed unexecuted and unscored. Keyboard Enter exercised answer/flag/jump/submit/result controls; next/previous and native dialog cancel/confirm were inspected. Result navigation actually opened the selected rubric after route update.

Two real production tabs opened the same CO full session. A saved answer in A made B's overwrite fail visibly; after A submitted, B's stale edit also failed and reload showed the lock. Native tests independently reproduce generation and revision conflicts transactionally.

The initial run created exactly three eligible mistake categories (CO signed representation, R&L counterrows, IP dispatch), with later correct submissions retained; no open code/proof entries appeared. Existing Study Path then suggested four actions through its own evidence selector. After the final rerun, Mistake Book showed six wrong submissions across the same three categories (two per category), and Study Path still used four existing actions; open responses added no entries. Representative IP binding Learn, CO representation Learn and R&L flashcards were opened; card reveal worked. Back returned from IP Learn to Study Path, and Forward restored IP Learn. Exam deep-link reload was exercised repeatedly.

All three Assembly production examples ran: arithmetic **RAX 8**, stack frame **RAX 15**, function call **RAX=RBX 7**, with **RSP/RBP 0x1000** at completion. Function-call Previous restored RBX 0 and Next restored 7. Assembly source/engine has no diff; its full existing regression suite passes.

Responsive production checks: **390, 768, 1280 px**. Initial runs inspected R&L formula/editor/grid/timer at 390/768 and IP code at 390, including screenshots. Final code rechecked the mobile submit dialog and open result/code/rubric at all three widths. Measured document clientWidth equals scrollWidth (390/390, 768/768, 1280/1280) on the inspected layouts. The dialog's counts/buttons wrapped without horizontal overflow. Viewport override was reset. This is targeted responsive/keyboard inspection, not a screen-reader conformance audit.

Inspected main production and native-browser console warning/error lists were **empty**. This means zero observed logs in the inspected sessions, not a universal guarantee for untested browsers.

### Native IndexedDB evidence

Step 10: **9 run checks + 1 actual reload check = 10 PASS**. Nonempty Schema 2 active/recovery fixtures included an immutable prior submitted answer and review record; both were preserved during DB 3 migration. Cooperative versionchange, stale second connection, request-success-then-abort submission rollback, exact repeat submission, post-submit lock, round-trip/recovery epoch, aborted restore, aborted version upgrade and injected exact expiry all passed. Reload retained exact versions/deadline/responses/flags/evidence.

Step 9 regression harness: **14 run checks + 1 actual reload check = 15 PASS** against current DB 3. Genuine Schema 1 active/recovery, old-client rejection, immutable attempt interpretation, later success, review/undo conflicts, abort-after-request success, import/restore epochs and upgrade rollback passed. These used native Chromium IndexedDB, separately from Vitest's fake-indexeddb/jsdom tests.

## Production payload measurements

No new dependencies. Source PDFs/ZIPs, full Handoff, docs/source review, validators and test fixtures are excluded from the production module/asset inventory. Small exam record validation is included with student storage; course banks, UI, open support and references stay lazy. Values below are bytes, measured from emitted assets, not estimates.

Initial JS **493,966** / gzip **130,037**; total assets **1,569,100** / gzip **458,986**.

| Payload | Bytes | Gzip bytes |
|---|---:|---:|
| `ExamsPage.tsx` | 7,052 | 2,856 |
| `ExamSessionPage.tsx` | 8,468 | 3,290 |
| `ExamReviewPage.tsx` | 6,154 | 2,578 |
| `ExamOpenAnswer.tsx` | 958 | 543 |
| `banks/co.json` | 31,788 | 5,833 |
| `banks/rl.json` | 20,990 | 4,277 |
| `banks/ip.json` | 23,311 | 4,365 |
| `references/co.json` | 5,981 | 1,934 |
| `references/rl.json` | 4,989 | 1,617 |
| `references/ip.json` | 3,988 | 1,433 |

See `exam-bundle-report.json` for exact chunk names/import graphs. Existing CO/R&L/enrichment/IP/adaptive bundle reports were regenerated by their mandatory checks. A Vite mixed static/dynamic import notice occurs **only in the separate native-test build**, because its harness deliberately imports the engine directly; that test artifact is not shipped. Production application build passed without that notice. The initial JS is not claimed to be tiny; further bundle optimization is outside this step.

## Adversarial self-review

Performed after the first green implementation (1,535 tests, typecheck/build/bundle) as a distinct self-review, not an independent external audit. Reviewed timer/reset, stale writes, submission races, content identity, source policy, objective/open separation, component evidence and lazy boundaries.

Two confirmed defects were reproduced with failing tests before fixes:

1. An identical operation ID plus altered seed could be accepted as an idempotent retry. Submission now compares the original stable snapshot fields, not only answers/items/flags.
2. A backup could link one evidence attempt to two exam sessions. Global evidence-link uniqueness now rejects that import before replacement.

A third test confirmed Schema 2 extra exam fields are rejected. The red run had 2 failed/1 passed; the targeted fixed run had 19 passes. Final suite includes these regressions and native rollback/idempotency checks. Historical storage locks were not overwritten: Step 10 uses an explicit before/after hash chain.

## Final independent-style verification

A further review compared the full sections 0–50 with code, tests, validators, source evidence and production behavior after normal testing/browser acceptance/self-review. This is another review by the implementing agent from a fresh-reviewer perspective, **not an independent external audit**.

Two more confirmed gaps were reproduced first (2 failed/3 passed): historical resolution lacked an explicit session-course comparison, and evidence asserted `solutionViewed:false` despite unknown prior exposure. The resolver now requires matching session/bank/blueprint courses; exposure is null. Targeted rerun: **74/74 PASS**. All 26 final commands and six production exam flows were then rerun. The proof/code evaluation policy did not change.

Other evidence improvements: nonempty native migration fixtures; Step 9 native fixture updated for current version and rerun; misleading “fourteen technical clusters” test title corrected to the tested thirteen; original one-point shared feedback scale explicitly explained beside exam weights. No previous grader or Assembly behavior was refactored.

## Second hidden-assumption and claim-evidence review

Reviewed timing/order, missing historical definitions, local imports, partial credit, prior exposure, native-vs-mocked storage and product language again. Checked that the timer is a study aid using the device clock, not an anti-cheat clock; offline/manual clock changes are not authenticated. Missing old content becomes a visible limited state, not an automatic version migration. Open completion remains workflow rather than correctness. Future content retention needs deliberate versioned authoring.

Claims in this report were reconciled with concrete evidence: fixed selection is not fresh random variation; source inspection is targeted; browser runs answer representative components rather than solving the whole bank; native transaction tests do not prove crash-proof storage; local backups are not cryptographically authenticated; objective totals are not course grades; old accepted test counts are labelled historical. No additional confirmed runtime defect remained after the fixes above. The only build warning is the disclosed test-artifact notice.

## Limitations and NOT RUN

- **Safari and Firefox: NOT RUN.** Native behavior/appearance there is not acceptance-tested; Chromium is the only tested engine. No Playwright WebKit result is called Safari.
- Screen-reader audit, prolonged three-hour wall-clock exam, OS-crash/power-loss simulation and real storage-quota exhaustion: **NOT RUN**. Injected clocks, aborts, bounds and native reload scenarios cover the stated alternatives; no survival/anti-cheat claims are made.
- First bank is a finite fixed authored set, not an official exam archive or new-variant generator. Timing/weights/difficulty are authored. References are one approach, not a complete proof checker or Java execution environment.
- Open notes/code are saved per component, not as an executable multi-file project. Self-review does not verify correctness. No whole-course final mark, mastery or readiness exists.
- History is bounded to 250 sessions and validated under 16 MB; no pagination/cloud recovery/archive fetching. Extremely large records can hit the existing attempt/byte bounds and fail visibly.
- Raw official sources are not distributed; source review does not establish exact official weighting or frequency.

## Changed-file inventory

Inventory relative to the accepted starting commit; generated build/native output and node_modules are ignored. Historical content and code with no diff are intentionally absent.

```text
README.md
docs/adaptive-bundle-report.json
docs/co-bundle-report.json
docs/enrichment-bundle-report.json
docs/exam-baseline-results.json
docs/exam-baseline-source-archive-check.json
docs/exam-bundle-report.json
docs/exam-engine-status.md
docs/exam-final-validation.json
docs/exam-source-review.md
docs/ip-bundle-report.json
docs/rl-bundle-report.json
package.json
scripts/exam-bundle.ts
scripts/exam-content-lock.json
scripts/exam-storage-preservation.ts
scripts/exam-validation.ts
scripts/inspect-exam-build.ts
scripts/mistake-adaptive-validation.ts
scripts/step10-storage-lock.json
scripts/storage-migration-preservation.ts
scripts/validate-exam-content.ts
scripts/validate-exam.ts
src/App.tsx
src/academic/navigation.ts
src/exams/ExamDialog.tsx
src/exams/ExamOpenAnswer.tsx
src/exams/ExamReviewPage.tsx
src/exams/ExamSessionPage.tsx
src/exams/ExamsPage.tsx
src/exams/banks/co.json
src/exams/banks/ip.json
src/exams/banks/rl.json
src/exams/catalog.ts
src/exams/engine.ts
src/exams/evaluation.ts
src/exams/exams.css
src/exams/records.ts
src/exams/references/co.json
src/exams/references/ip.json
src/exams/references/rl.json
src/exams/types.ts
src/exams/useExamDraft.ts
src/learning/StudentDataPanel.tsx
src/learning/contracts.ts
src/learning/repository.ts
tests/adaptive-review.test.ts
tests/adaptive-validation.test.ts
tests/application-routing.test.tsx
tests/browser/exam.ts
tests/browser/index.html
tests/browser/step9.ts
tests/enrichment-service.test.ts
tests/exam-engine.test.ts
tests/exam-repository.test.ts
tests/exam-review.test.ts
tests/exam-ui.test.tsx
tests/exam-validation.test.ts
tests/ip-practice.test.ts
tests/learning-contracts.test.ts
tests/learning-repository.test.ts
tests/mistake-migration.test.ts
vite.config.ts
```

Implementation is limited to Step 10. The existing shared learning systems and Assembly behavior remain guarded by unchanged published fingerprints plus regression tests. No Step 11 work, production deployment or remote storage was started.
