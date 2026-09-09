# Introduction to Programming — Step 8

**COMPLETE — all required Step 8 acceptance gates passed on 9 September 2026.** Step 9 and all later steps were not started. No deployment was performed.

## Git, interruption and preservation

Started from clean `bda8c0f`. The user resumed while valid Step 8 work was uncommitted; HEAD was still `bda8c0f`, with no staged changes or checkpoint commit. No reset, restore, discard or restart occurred. Implementation checkpoint: `48331d4` (`feat: complete IP learning content and safe coding workbench`). The final acceptance commit is the commit carrying this report; its exact hash is reported in the completion message and by `git log -1 --oneline`. Git cleanliness is checked after that commit.

Before interruption: targeted source inventory/review, 19 new topic files, 33 fixed Java predictions, partial shared registry/feedback integration, workbench components, initial Java checks and assignment authoring were in place. After continuation: reconciled an incomplete integration expression; completed 11 assignment/reference pairs, route/course wiring, shared cues, locks/classifications/gates, regression tests, adversarial fixes, production browser acceptance and this report. Working content was preserved.

Fresh baseline verification passed all 16 requested commands before edits: **1,029 tests in 40 files**, typecheck, build, content/projection/practice/CO/RL/enrichment and bundle gates. [Baseline command evidence](ip-baseline-results.json) is retained. Final verification passed **1,317 tests in 49 files**, no skipped/removed tests, typecheck, build and every required gate.

[Preservation evidence](ip-preservation-evidence.json) independently compares **95 protected file SHA-256 values** against both the current bytes and `git show bda8c0f:<path>`. The existing 83-file enrichment guard remains active. Pack **v1.0.1 / academic schema1.1.0**, **Student Schema1 / IndexedDB1**, generated canonical data, published pilot/CO/RL/enrichment records and historical grader bindings are unchanged. The entire Assembly engine/components/examples/utils, PracticeService and StudentRepository have no baseline diff. Dependency versions/lockfile are unchanged. **v1.0.0 is absent and unused.**

## Canonical learning and practice coverage

**20 topics / 44 subtopics / 56 skills**, all derived from the authoritative pack. There are 20 lessons (19 new, published T02 preserved), 118 lesson blocks, **112 cards — exactly two per skill, zero uncovered skills**, 21 unscored guided activities, 35 fixed predictions (33 new plus two preserved), eight optional map cues and 11 coding tasks. Across DelftStudy: 43 course topics with lessons, 270 cards and 100 shared Practice items.

The detailed tables in [the complete coverage inventory](ip-coverage-inventory.md) are part of this report: every canonical skill maps to substantive teaching block IDs, exact card IDs/count, A/B/C/D/E classification/reason, exercises, guides and assignments. It also includes all 33 feedback/misconception profiles, every guided/coding activity and every assignment requirement → rubric → test specification → skill mapping. No skill is counted solely from an introduction or recap.

| Topic | Lesson blocks | Cards | Fixed predictions | Guided self-checks | Related coding tasks |
| --- | ---: | ---: | ---: | ---: | ---: |
| `IP_T01_JAVA_BASICS` | 8 | 10 | 5 | 1 | 0 |
| `IP_T02_CONTROL_FLOW` | 9 | 8 | 2 | 1 | 1 |
| `IP_T03_METHODS_SCOPE` | 7 | 8 | 3 | 1 | 2 |
| `IP_T04_CLASSES_OBJECTS` | 7 | 8 | 2 | 1 | 4 |
| `IP_T05_ARRAYS_RECURSION` | 7 | 8 | 3 | 1 | 2 |
| `IP_T06_CONTAINER_CLASSES` | 6 | 6 | 1 | 1 | 2 |
| `IP_T07_COMPOSITION_LIBRARIES` | 6 | 4 | 1 | 1 | 5 |
| `IP_T08_TESTING` | 7 | 6 | 0 | 1 | 8 |
| `IP_T09_INHERITANCE` | 6 | 4 | 1 | 1 | 1 |
| `IP_T10_POLYMORPHISM_BINDING` | 6 | 4 | 1 | 1 | 1 |
| `IP_T11_EQUALITY_HASHING` | 5 | 6 | 3 | 1 | 2 |
| `IP_T12_EXCEPTIONS` | 5 | 4 | 2 | 1 | 4 |
| `IP_T13_DEBUGGING` | 4 | 2 | 0 | 1 | 1 |
| `IP_T14_CODE_QUALITY_STRINGS_GENERICS` | 5 | 6 | 2 | 1 | 4 |
| `IP_T15_IO_PARSING` | 5 | 6 | 0 | 1 | 4 |
| `IP_T16_FUNCTIONAL_JAVA` | 5 | 6 | 3 | 1 | 1 |
| `IP_T17_PROGRAM_DESIGN` | 4 | 4 | 0 | 1 | 4 |
| `IP_T18_MODERN_JAVA` | 5 | 4 | 2 | 1 | 3 |
| `IP_T19_THREADS_CONCURRENCY` | 5 | 4 | 4 | 1 | 1 |
| `IP_T20_EXAM_PROGRAM_SYNTHESIS` | 6 | 4 | 0 | 2 | 3 |

**Classification:** A32, B4, C18, D2, E0. A means only a particular fixed response can be safely graded; it does not make arbitrary implementations of that skill autogradable. B/C answers have explicit structured/open rubrics; D denotes integrated coding-workbench practice. Every skill has deliberate practice coverage. Canonical topic/skill prerequisites and map topology are unchanged; optional cues attach only to existing skill IDs.

## Coding workbench and integrated assignments

Editable starter files, file/class tabs, requirements, copy, reset, reference-solution reveal, test/specification reveal and component self-check all work. Arrow keys/Home/End move file-tab focus. Drafts exist only in page memory and are lost on navigation/task changes/reload; the UI clearly says to copy files first. No schema migration or additional draft store was added. Reset invalidates pending reference and clipboard completions.

| Time | Authored assignment | Primary role |
| --- | --- | --- |
| 15 min | `ds.assignment.ip.array-window` — Count threshold crossings in a window | Unscored coding and requirement-based self-check |
| 15 min | `ds.assignment.ip.batch-token` — Parse one strictly specified token | Unscored coding and requirement-based self-check |
| 15 min | `ds.assignment.ip.boundary-tests` — Design tests that expose boundary bugs | Unscored coding and requirement-based self-check |
| 15 min | `ds.assignment.ip.grid-key` — A value key with an honest equality contract | Unscored coding and requirement-based self-check |
| 15 min | `ds.assignment.ip.label-stream` — Transform labels and handle an empty result | Unscored coding and requirement-based self-check |
| 30 min | `ds.assignment.ip.alert-policies` — Compose and dispatch alert policies | Unscored coding and requirement-based self-check |
| 30 min | `ds.assignment.ip.capacity-shelf` — Build a bounded shelf with a clear invariant | Unscored coding and requirement-based self-check |
| 30 min | `ds.assignment.ip.reading-export` — Validate readings before exporting a file | Unscored coding and requirement-based self-check |
| 60 min | `ds.assignment.ip.air-audit` — Air-quality batch audit with explicit failure rules | Integrated program, component rubric/test evidence |
| 60 min | `ds.assignment.ip.material-ledger` — Workshop material ledger | Integrated program, component rubric/test evidence |
| 60 min | `ds.assignment.ip.note-index` — Coordinate a parallel note index | Integrated program, component rubric/test evidence |

The three T20 assignments are serious original integrated flows: **material-ledger** combines a value model/equality, parsing, aggregation, CLI/output and tests; **air-audit** emphasizes I/O, malformed input, exception/resource behavior, reporting and test design; **note-index** uses taught concurrency mechanisms with synchronized updates and joins. Time labels are DelftStudy practice design, not official exam timing. Each reference is one valid implementation; alternative designs and JUnit suites are not compared as text.

**No fake grading or unsafe learner execution:** open code and guides have no grader/score fields and are not registered as deterministic exercises. Workbench text never reaches PracticeService, `eval`, a Function constructor, network request or process API. Only declared option IDs for fixed trusted snippets are graded. Source/negative tests reject free-form/keyword graders and undeclared response formats; UI tests verify arbitrary draft text remains unexecuted and no test-passed claim appears. Development-only process scripts accept checked-in authored manifests, never learner answers; bundle gates exclude those scripts.

## Shared feedback, attempts and source policy

The existing enrichment `explainAnswer`/Feedback/EvidenceView architecture was extended, not replaced. All 33 new profiles bind the exact immutable exercise/grader fingerprint and cover 33 safely matched answer patterns. Feedback shows submitted prediction, reference, explanation, reasoning and reminder; unmatched wrong options receive a verified fallback without a misconception label, and correct answers have no error tag. No learner misconception history or evaluation is persisted. Existing 16 CO/RL profiles and all 67 prior item definitions/bindings remain valid.

PracticeService and StudentRepository remain unchanged. A repeated identical submission is idempotent; conflicting content is rejected; retry creates a new attempt and preserves the original submitted answer. All original storage tests remain, new IP service tests use fake-indexeddb, and separate real Chromium checks are recorded below. Successful local persistence is not a guarantee against browser-data deletion or device/OS failure.

Seven canonical IP whole-assessment mappings remain **INTEGRATED_MULTI_SKILL**, each requiring component rubric/test evidence and excluding blanket child-skill correctness. **All 38 analytical component locators remain UNKNOWN** with their original unverified method/shape. Mock2024 is current official practice material; Mock2023 is recent practice, never an observed sitting. Current/recent/historical policy, generation restrictions and source weights remain canonical. There is no aggregate mastery, score, predicted grade or global exam orchestration.

## Source inspection and original authorship

[Source inventory](ip-source-inventory.json) records the uploaded archive and its members. All 28 canonical IP document hashes match the supplied ZIP (21 canonical lectures and seven assessments); Lecture0 is inventoried without expanding taxonomy. The package also contains the textbook, notes, README and generated knowledge files. Raw PDF/ZIP/text extraction stayed outside the repository.

[Targeted source review](ip-source-review.md) lists each actually inspected filename, physical PDF page and supported mechanism, including modern Java and current integrated/concurrency assessment mechanisms. The 24 runtime evidence records provide only small attribution metadata; they never replace broad canonical locators with invented precise ones. The whole package was **not** claimed to have been read. Supplemental API/JLS corroboration, including join and method-signature semantics, is identified separately.

Blocked lecture/generated-summary claims include the wrong short lower bound, treating every floating divide-by-zero as NaN, “checked runtime exceptions”, local scope exit equated with garbage collection, every ArrayList resize claimed constant-cost, an ill-typed covariant example and an Integer-return functional interface used for a Boolean predicate. IP Notes was inventoried, not substantively reviewed. Current official material establishes mechanisms; notes/generated summaries never establish truth.

All lesson wording, numeric examples, starter/reference code, domains, formats and datasets are newly authored. Source review checked the original task surfaces and the new assignment contexts; no official story, names, file formats, wording, code, datasets or distinctive task combination was reused. This is an authorship/source review, not a claim that string similarity proves semantic originality. The canonical integrated evidence only informs mechanisms and workload.

## Trusted Java verification

**OpenJDK Temurin 21.0.12.1+1-LTS** (Java and javac21.0.12.1). [Fixed/lesson evidence](ip-java-evidence.json) records **49 compiled fixtures** (31 fixed-practice cases including intended compiler/runtime failures, eight early-topic examples, ten late-topic examples), independent reasoning and actual results. Two unsynchronized concurrency claims are verified by explicit possible-event models rather than sampling one run as a scheduling proof.

[Assignment evidence](ip-assignment-java-evidence.json) records **11 trusted reference implementations / 144 actual Java assertions**, exact reference/harness hashes and compiler/runtime commands. Independent contract oracles cover parser boundaries, malformed records, output formatting, resource ownership/closing, exceptions, equality, stream behavior and synchronized counts. JDK requirement harnesses ran; illustrative JUnit code is explicitly **NOT RUN as JUnit**. These checks do not execute any student program.

## Final automated acceptance

| Command | Actual result |
| --- | --- |
| `pnpm run validate:content` | PASS — exit 0 |
| `pnpm run check:academic` | PASS — exit 0 |
| `pnpm run check:references` | PASS — exit 0 |
| `pnpm run validate:practice` | PASS — exit 0 |
| `pnpm run check:topics` | PASS — exit 0 |
| `pnpm run validate:topics` | PASS — exit 0 |
| `pnpm run validate:co` | PASS — exit 0 |
| `pnpm run check:co-bundle` | PASS — exit 0 |
| `pnpm run validate:rl` | PASS — exit 0 |
| `pnpm run check:rl-bundle` | PASS — exit 0 |
| `pnpm run validate:enrichment` | PASS — exit 0 |
| `pnpm run check:enrichment-bundle` | PASS — exit 0 |
| `pnpm run validate:ip` | PASS — exit 0 |
| `pnpm run check:ip-bundle` | PASS — exit 0 |
| `pnpm test --maxWorkers=2` | PASS — exit 0 |
| `pnpm run typecheck` | PASS — exit 0 |
| `pnpm run build` | PASS — exit 0 |
| `pnpm run verify:ip-java` | PASS — exit 0 |
| `git diff --check` | PASS — exit 0 |

[Exact command timestamps/exit codes](ip-final-validation.json). The full suite was run after the adversarial fixes; production/browser evidence is not borrowed from the baseline. All nineteen final commands passed, including the additional trusted Java gate.

| Acceptance requirement | Test file / test name or parameter group | Command | Actual result |
| --- | --- | --- | --- |
| 20/44/56 coverage, immutable IDs/locks, source ownership, capability order | `tests/ip-content.test.ts` — “validates 20 topics,44 subtopics,56 deliberately covered skills…”; generated indexes/locks; lesson/card defects | `pnpm test --maxWorkers=2` | PASS; 96 IP validation cases |
| Every skill classified; safe integrated/UNKNOWN/mock policy | `tests/ip-content.test.ts` — classification defects, seven integrated programs/38 UNKNOWN, policy mutation and contradictory metadata groups | Same full suite | PASS |
| Fixed predictions and exact feedback, invalid/free-code rejection, retry/idempotency | `tests/ip-practice.test.ts` — 33 per-item cases; five durable mock-storage cases; independent concurrency models | Same full suite | PASS; 44 cases |
| Workbench edit/copy/reset/reveal/keyboard and no fake execution | `tests/ip-ui.test.tsx` — 15/30/60 tasks; file tabs; ephemeral reload/clipboard denial; displayed predictions | Same full suite | PASS; 12 cases |
| Late reference/clipboard completion cannot undo Reset; correct mode empty states | `tests/ip-review.test.tsx` — delayed imports, late clipboard, unavailable/mismatched reference and route checks | Same full suite | PASS; 7 cases |
| 15/30/60 requirements, real references, I/O/eq/streams/races, exact compiled hashes | `tests/ip-assignment-references.test.ts` — per-assignment test mapping/evidence; independent contract cases | Same full suite | PASS; 42 cases |
| Late-topic IDs/scope/cards and verified source statements | `tests/ip-late-content.test.ts`; `tests/ip-review-semantics.test.ts` — method-header/signature distinction | Same full suite | PASS; 23 + 1 cases |
| Lazy modules, no raw source/full Handoff/validators/editor dependency | `tests/ip-bundle.test.ts` negative graphs/artifacts; actual `check:ip-bundle` | Full suite and `pnpm run check:ip-bundle` | PASS; 62 cases plus production graph |
| Reports describe final emitted files, not temporary CSS entries | `tests/build-inventory.test.ts` — emitted graph after Vite removes a shared pure-CSS JS chunk | Full suite | PASS; 1 real Vite fixture |
| Trusted original Java semantics and reference requirements | `scripts/verify-ip-java.ts`; `scripts/verify-ip-assignments.ts` | `pnpm run verify:ip-java` | PASS; 49 fixtures + 144 assertions |
| Existing CO/RL/enrichment/Assembly/Practice/storage/projections | All 40 baseline test files, retained without case-count reduction | Full suite; every existing gate | PASS; all 1,029 baseline cases |
| Real native storage and production journeys | Browser acceptance described below | Isolated Chromium UI and native harness | PASS; separately recorded |

**Test accounting:** 1029 baseline + 288 new = **1317**, across 49 files. Every one of the original40 files retains its original test count. Five baseline files were adapted to the expanded catalogue/completed IP pages: the historical67/61/34 item subsets and all original bindings remain explicitly checked; obsolete empty-state assertions were replaced by actual new content checks. No assertion was skipped or weakened to conceal a failure. [Exact per-file accounting](ip-test-inventory.json).

| New test file | Passing cases |
| --- | ---: |
| `tests/ip-content.test.ts` | 96 |
| `tests/ip-review.test.tsx` | 7 |
| `tests/ip-ui.test.tsx` | 12 |
| `tests/build-inventory.test.ts` | 1 |
| `tests/ip-bundle.test.ts` | 62 |
| `tests/ip-practice.test.ts` | 44 |
| `tests/ip-late-content.test.ts` | 23 |
| `tests/ip-assignment-references.test.ts` | 42 |
| `tests/ip-review-semantics.test.ts` | 1 |

## Production Chromium acceptance

**Actual engine: Chromium152.0.7977.64 on macOS**, read from the browser’s high-entropy version data on the separate verification page. Production origin: `http://127.0.0.1:4202`; native test-only artifact: `http://127.0.0.1:4203`. [Structured browser evidence](ip-browser-acceptance.json). The native harness is never a production input and uses isolated test databases.

- Final production Learn routes: all20 visited again after final build, correct topic headings and substantive blocks; actual width/scrollWidth1280 and wrapped code. Published T02 loop prediction still works. T20 flashcard reveal works; T19 optional map cue changes no topology.
- Six wrong-answer flows: integer division, pass-by-value, dispatch, equality, exceptions and unsynchronized race. Learner/reference text, answer-pattern explanation, reasoning and reminder verified. Nine further new correct predictions cover constructors/static state, aliasing/recursion, inheritance, generics, streams, var and synchronized/joined workers; no false misconception tag.
- Pass-by-value wrong8:7 survives a real reload; retry submits4:9 as a new attempt. Back restores the original8:7; Forward restores the correct retry. Real native-storage suite passed13 scenarios plus actual reload persistence = **14 checks**, including controlled abort-after-request-success, atomic restore/recovery and stale-connection rejection. Permission failure is injected. No actual OS-crash experiment is claimed.
- T08 testing and T17 design guides accept notes and reveal criteria without grading. 15/30/60 workbenches accept edits, copy through the native clipboard, reveal real references/specifications and keep drafts unchanged. I/O file tabs move focus with ArrowRight/Home and preserve independent drafts. Reset restores starter files/hides references; actual mobile reload discards unsaved draft and retains deep-linked task selection.
- **Measured390px:** array-window15-minute task, revealed code/specifications, navigation expand/Escape, reload; clientWidth=scrollWidth390. **Measured768px:** material-ledger60-minute integration, reference files, canonical cues, study-tab Home focus and preserved CO/RL feedback; both widths768. **Measured1280px:** reading-export30-minute task, all20 final Learn pages and Assembly; both widths1280. Viewport values were checked from the DOM; an initial unapplied resize was not counted. A foreground tab provided the actual requested widths. The390px workbench screenshot was visually inspected.
- Preserved CO carry/overflow and R&L converse/contrapositive wrong-answer profiles display the original specific explanation/reference. Assembly runs: arithmetic RAX8 in3steps; stack-frame RAX15 in9steps; function RAX/RBX7 in10steps; all finish RSP/RBP4096. Previous/Next, current-line/pushed-cell highlighting, exact history restoration, Reset, Run/Pause and DEC/HEX also checked.
- **Zero inspected console warnings/errors** across both production QA tabs and the native harness. Safari and Firefox are **NOT RUN**. This is real Chromium, not Playwright WebKit or actual Safari.

## Payload boundaries and sizes

| Final production category | Bytes | Gzip bytes | Chunks |
| --- | ---: | ---: | ---: |
| Initial JavaScript | 481,622 | 126,323 | 1 |
| 19 new IP topic payloads | 168,424 | 55,588 | 19 |
| Coding Workbench | 6,686 | 2,479 | 1 |
| Authored assignment payloads | 54,571 | 20,268 | 11 |
| Revealable reference solutions | 43,262 | 17,535 | 11 |
| Preserved IP pilot loader/guide | 1,727 | 989 | 1 |
| All JS/CSS assets | 1,383,217 | 407,855 | See module inventory |
| All production files including HTML/favicon | 1,384,213 | 408,505 | See file inventory |

Initial increase over `bda8c0f`: **6,545 bytes / 1,219 gzip bytes**. [Full chunk/module report](ip-bundle-report.json) records each final emitted file. Lesson/assignment/reference/workbench chunks are separately lazy; references are not statically imported by assignments/workbench. Only small capability/route metadata joins the initial graph. There is no Monaco or new runtime dependency. **Full Handoff, source PDF/ZIP/textbook content, raw source-review material, validators and full teaching locks are absent from the frontend.** Canonical metadata and minimal exact attempt fingerprints remain intentionally available.

## Review, limitations and final boundary

[Distinct adversarial self-review](ip-adversarial-review.md) documents six finding groups with failing regressions before minimal fixes: incomplete supplemental loop evidence; four validator metadata gaps; method signature terminology; two overbroad reference explanations; reset/async/empty-state behavior; final bundle-inventory timing. This was a team **self-review, not an independent audit**. A strict IP bundle gate also caught an eager workbench stylesheet import; course summaries now reuse existing styling and workbench CSS stays lazy. The documented JDK override is supported by both development runners. All final gates were rerun after the fixes.

Limitations: free-form Java is intentionally unexecuted/unscored; workbench drafts are ephemeral; multiple valid designs require human self-check; no sandbox/IDE compiler or JUnit runtime was added. Trusted JDK checks cover authored examples only. Race models illustrate permitted outcomes and do not emulate the complete Java Memory Model. Source inspection was targeted, not a full package/textbook review. Safari/Firefox, actual OS/device-crash durability and JUnit-framework execution remain NOT RUN and are not counted as PASS. No required Step8 acceptance check remains open; those checks are explicit limitations, not missing critical acceptance gates.

**Step9–15 were not started:** no learner Mistake Book, adaptive path, global exam engine, mastery/readiness, accounts/cloud sync, later polish/hardening initiative or deployment.

## Changed-file inventory

The implementation is separated into new `src/ip/` content/types/workbench, small shared routing/Practice/feedback extensions, build validators/collectors, tests and evidence documentation. Existing Assembly, student persistence and published course content have no changes. Exact paths relative to this repository follow:

```text
README.md
docs/co-bundle-report.json
docs/enrichment-bundle-report.json
docs/introduction-programming-status.md
docs/ip-adversarial-review.md
docs/ip-assignment-java-evidence.json
docs/ip-baseline-results.json
docs/ip-browser-acceptance.json
docs/ip-bundle-report.json
docs/ip-coverage-inventory.md
docs/ip-final-validation.json
docs/ip-java-evidence.json
docs/ip-preservation-evidence.json
docs/ip-source-inventory.json
docs/ip-source-review.md
docs/ip-test-inventory.json
docs/rl-bundle-report.json
package.json
scripts/final-bundle-inventory.ts
scripts/inspect-co-build.ts
scripts/inspect-ip-build.ts
scripts/inspect-rl-build.ts
scripts/ip-assignment-java-harnesses.json
scripts/ip-baseline.json
scripts/ip-bundle.ts
scripts/ip-content.ts
scripts/ip-early-examples.json
scripts/ip-late-examples.json
scripts/ip-practice-oracles.json
scripts/validate-ip.ts
scripts/verify-ip-assignments.ts
scripts/verify-ip-java.ts
src/enrichment/EvidenceView.tsx
src/enrichment/StudyCues.tsx
src/enrichment/TopicEnrichment.tsx
src/enrichment/feedback.ts
src/enrichment/types.ts
src/ip/Assignments.tsx
src/ip/CodingWorkbench.tsx
src/ip/IPStudyMode.tsx
src/ip/IntroTopicContent.tsx
src/ip/MapCues.tsx
src/ip/TopicContent.tsx
src/ip/assignment-index.json
src/ip/assignments/air-audit.json
src/ip/assignments/alert-policies.json
src/ip/assignments/array-window.json
src/ip/assignments/batch-token.json
src/ip/assignments/boundary-tests.json
src/ip/assignments/capacity-shelf.json
src/ip/assignments/grid-key.json
src/ip/assignments/label-stream.json
src/ip/assignments/material-ledger.json
src/ip/assignments/note-index.json
src/ip/assignments/reading-export.json
src/ip/capabilities.json
src/ip/content-lock.json
src/ip/coverage.json
src/ip/cues.json
src/ip/evidence.json
src/ip/feedback.json
src/ip/grader-lock.json
src/ip/grading.ts
src/ip/intro-guided.json
src/ip/ip.css
src/ip/misconceptions.json
src/ip/practice-lock.json
src/ip/practice.json
src/ip/references/air-audit.json
src/ip/references/alert-policies.json
src/ip/references/array-window.json
src/ip/references/batch-token.json
src/ip/references/boundary-tests.json
src/ip/references/capacity-shelf.json
src/ip/references/grid-key.json
src/ip/references/label-stream.json
src/ip/references/material-ledger.json
src/ip/references/note-index.json
src/ip/references/reading-export.json
src/ip/topics/IP_T01_JAVA_BASICS.json
src/ip/topics/IP_T03_METHODS_SCOPE.json
src/ip/topics/IP_T04_CLASSES_OBJECTS.json
src/ip/topics/IP_T05_ARRAYS_RECURSION.json
src/ip/topics/IP_T06_CONTAINER_CLASSES.json
src/ip/topics/IP_T07_COMPOSITION_LIBRARIES.json
src/ip/topics/IP_T08_TESTING.json
src/ip/topics/IP_T09_INHERITANCE.json
src/ip/topics/IP_T10_POLYMORPHISM_BINDING.json
src/ip/topics/IP_T11_EQUALITY_HASHING.json
src/ip/topics/IP_T12_EXCEPTIONS.json
src/ip/topics/IP_T13_DEBUGGING.json
src/ip/topics/IP_T14_CODE_QUALITY_STRINGS_GENERICS.json
src/ip/topics/IP_T15_IO_PARSING.json
src/ip/topics/IP_T16_FUNCTIONAL_JAVA.json
src/ip/topics/IP_T17_PROGRAM_DESIGN.json
src/ip/topics/IP_T18_MODERN_JAVA.json
src/ip/topics/IP_T19_THREADS_CONCURRENCY.json
src/ip/topics/IP_T20_EXAM_PROGRAM_SYNTHESIS.json
src/ip/types.ts
src/pages/CoursePage.tsx
src/pages/TopicPage.tsx
src/practice/ExerciseParts.tsx
src/practice/catalog.ts
src/practice/registered-types.ts
src/practice/runtime.ts
tests/application-routing.test.tsx
tests/build-inventory.test.ts
tests/co-practice.test.ts
tests/enrichment.test.ts
tests/ip-assignment-references.test.ts
tests/ip-bundle.test.ts
tests/ip-content.test.ts
tests/ip-late-content.test.ts
tests/ip-practice.test.ts
tests/ip-review-semantics.test.ts
tests/ip-review.test.tsx
tests/ip-ui.test.tsx
tests/practice-ui.test.tsx
tests/topic-ui.test.tsx
vite.config.ts
```
