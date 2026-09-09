# Step 8 adversarial self-review

This is a separate review pass after the implementation first passed its complete local gate (reported by the coordinating author as 1,239 tests across 45 files, typecheck, production build and IP validation). It is a coordinated author/team **self-review**, not an independent audit. Initial green results are not the final acceptance result. The final full rerun and real-browser evidence belong in [the Step 8 status report](introduction-programming-status.md).

## Review scope and method

The source/content reviewer read the actual new 19 lesson files (109 blocks), their 104 flashcards, all 33 fixed Java prediction programs with expected answers and explanations, all 33 bounded feedback paths, and the grading/version-dispatch changes. This covered integer arithmetic and casts, reference passing/aliasing, overload versus override, equality/hash contracts, exceptions, strings/generics, I/O ownership, stream order/laziness, records, and thread launch/completion/atomicity. T02's published lesson/cards were preserved; its supplemental source metadata was checked where a newly authored assignment depended on it.

Six assignment references were additionally inspected directly: `grid-key`, `batch-token`, `reading-export`, `material-ledger`, `air-audit`, and `note-index`. The three integrated references were checked for component-level evidence, parsing before opening output, propagation of failures, borrowed versus owned resources, stable value equality, synchronization on one shared counter, and waiting for completion before returning results. A separate assignment-author pass covers all eleven references and the trusted Java harnesses.

The review followed actual changed code in `src/ip/grading.ts`, the IP branches of `src/practice/runtime.ts`, `src/practice/ExerciseParts.tsx`, and `src/enrichment/feedback.ts`. Arbitrary learner text does not reach a Java runner. The new graded items accept one declared choice for a fixed authored program. Explanations require the exact exercise/version/grader binding; only an explicitly matched distractor gets its bounded misconception explanation. Other incorrect choices receive the neutral fallback, and no new learner misconception state is written.

Source review was reused rather than indiscriminately repeated. One discovered evidence gap required reading additional actual physical pages of Lecture 2. The original assignment domains and examples were compared with the already reviewed source surfaces: no copied official solution, long passage, or renamed official integrated problem was found in the inspected content. This is a bounded human review, not an automated plagiarism certification or a full review of every archived PDF.

## Confirmed findings and regression evidence

### 1. Supplemental loop evidence was broader than its inspected pages

`ip-t02` listed all four canonical control-flow skills but initially pointed only to physical p8, which covers short-circuit Boolean evaluation. That did not substantiate the loop-implementation evidence used by the new array-window assignment. The canonical DOCUMENT_RANGE already remained intact; this was a defect in the new supplemental evidence claim.

A regression was added first: `tests/ip-late-content.test.ts` → `IP late-course authored teaching contracts > loop implementation evidence includes the inspected accumulation page rather than only Boolean material`. The targeted command `pnpm test tests/ip-late-content.test.ts -t 'loop implementation evidence' --maxWorkers=2` failed at 21:59:52 on 2026-09-09: **1 failed, 22 filtered**; the actual failure was `[8]` not containing `31`. Filtering was only for the targeted RED run, not an exclusion from the final suite.

The reviewer directly read Lecture 2 physical pp18–33: switch, iteration and counted loops, nested/filtered loops, while, accumulation at p31, maximum at p32, and do-while. The minimal fix adds those verified pages and a precise mechanism summary to `src/ip/evidence.json` and [the source ledger](ip-source-review.md). Published T02 content, canonical sources and UNKNOWN locators are unchanged.

`pnpm test tests/ip-late-content.test.ts --maxWorkers=2` then passed at 22:01:49: **23/23 tests, no skipped tests**. A later source/grading rerun at 22:03:05 used `pnpm test tests/ip-practice.test.ts tests/ip-late-content.test.ts --maxWorkers=2`: **67/67 across two files**, comprising 44 fixed-practice/version/feedback/mock-storage/concurrency-model checks and 23 content/source checks.

### 2. Four new IP validation checks accepted contradictory metadata

The validator reviewer added four mutants before changing the validator. `pnpm test tests/ip-content.test.ts -t 'contradictory or invented' --maxWorkers=2` failed at 21:58:01 on 2026-09-09: **4 failed, 92 filtered**. The new IP gate unexpectedly accepted:

- A mock question whose authority differed from its parent assessment.
- A question whose era differed from its parent assessment.
- A duplicate Endterm 2024 replacing Endterm 2023 while aggregate 7/45 counts stayed unchanged.
- An invented `start_page` on an UNKNOWN locator.

The fix in the new IP validator checks the exact seven distinct assessment IDs, one whole-program question per assessment, matching per-question parent metadata, and strict allowed UNKNOWN-locator fields. The existing full-pack validator and baseline checksum gate already protected the real published pack; these findings were holes in the additional Step 8 gate, not corruptions of published canonical data or learner data.

The validator reviewer reported the full `pnpm test tests/ip-content.test.ts --maxWorkers=2` rerun at 21:58:20: **96/96 tests, no skipped tests**, plus a passing typecheck. The coordinating author reruns these with the entire final suite.

### 3. Method declaration was called a Java method signature

The actual T03 contract block and signature card included the return type when describing a method signature. This could teach that methods may overload solely by changing a return type. [JLS 21 §8.4.2](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.2) was inspected during this review: the method signature uses the name, type parameters when present, and formal parameter types; it does not include the result type or modifiers.

The early-content owner first added `tests/ip-review-semantics.test.ts` and ran `pnpm test tests/ip-review-semantics.test.ts --maxWorkers=2` at 22:03:27: **1/1 failed** on the original misleading title. Only the new T03 contract block/title and card wording then changed: a method header includes the result; the non-generic signature uses the name and ordered parameter types; return type/modifiers are excluded and changing only the return type cannot create an overload. The same command passed at 22:03:49: **1/1, no skipped tests**. Content IDs, metadata ownership, Java examples and all fixed-practice/grader bindings stayed unchanged. No published pilot is involved.

### 4. Two reference explanations overgeneralized Java List capacity

The material-ledger and note-index reference reasoning justified `long` using an unrestricted statement that every Java `List` is limited to `Integer.MAX_VALUE` elements. The actual parsers and worker snapshots use bounded array-backed data, but that statement is too broad for the general collection interface. [Collection.size in Java 21](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collection.html#size()) explicitly permits size saturation for larger collections.

The assignment owner first added two explicit array-backed-bound regressions. At 22:03:04, `pnpm test tests/build-inventory.test.ts tests/ip-assignment-references.test.ts --maxWorkers=2` reported **40 passing and 2 failing assignment-reference tests**, alongside the separate collector failure described below. Only the two reference explanations and matching development-harness reasoning changed to the concrete array-backed input limits; the Java implementation did not change.

At 22:03:42, `node --import tsx scripts/verify-ip-assignments.ts` reran all **11 references and 144 assertions successfully** on OpenJDK Temurin 21.0.12.1+1-LTS, refreshing the recorded evidence. At 22:04:12, `pnpm test tests/ip-review.test.tsx tests/ip-ui.test.tsx tests/ip-assignment-references.test.ts tests/ip-bundle.test.ts tests/build-inventory.test.ts --maxWorkers=2` passed **124 tests across five files**, including all 42 reference tests. The owner also reported a passing typecheck.

### 5. Reset did not invalidate asynchronous workbench operations

The UI/reference owner reproduced four failures before changing implementation. At 22:00:27, `pnpm test tests/ip-review.test.tsx --maxWorkers=2` reported **4 failed and 3 passed**: a reference import completing after Reset could expose the solution again; a failed pre-reset import could overwrite reset status; late clipboard completion could also overwrite reset status; and ordinary Practice on T01 displayed an inaccurate 60-minute-only empty state.

The minimal fixes in `CodingWorkbench` add generation checks for asynchronous completion and reset the busy state, while `Assignments` uses an empty-state message appropriate to the selected mode. The regression suite also checks mismatched reference data leaves drafts intact and an unrelated assignment query is rejected. At 22:00:59, `pnpm test tests/ip-review.test.tsx tests/ip-ui.test.tsx --maxWorkers=2` passed **19 tests across two files**. These are controlled jsdom tests, not Chromium evidence. The later five-suite run above passed them again.

### 6. Bundle inventory could describe an intermediate emission

At 22:03:04, the new `tests/build-inventory.test.ts` fixture failed in the combined command above: generated metadata retained a shared-style JavaScript asset that Vite subsequently removed and omitted HTML added later in emission. That made the report an inaccurate description of final production files, even though the application output itself was not changed by the report.

The fix uses a shared final `writeBundle` inventory collector in the CO/R&L inspectors. It does not silently filter away missing files or weaken bundle gates. The controlled fixture verifies exact emitted inventory, byte/gzip totals and dependency edges. At 22:03:42 it passed **1/1**, and the five-suite rerun at 22:04:12 passed again. The final real production build remains a separate acceptance gate recorded in the status report.

## Findings not supported by the inspection

No incorrect expected result was found among the 33 new fixed-program items. Integer division/cast timing, overflow, static fields, aliasing, constructor order, dispatch, equality/hash collisions, checked exceptions, retained empty fields, streams, Optional, `var`, record equality and direct `run()` matched the code and independent reasoning inspected. The two race examples describe possible outcomes rather than claiming one guaranteed schedule or an exhaustive Java Memory Model model. The successful synchronized example explicitly assumes normal completion and combines same-monitor updates with both joins.

The inspected I/O references do not promise atomic filesystem replacement: they defer opening output until parsing succeeds, but explicitly allow partial output on a later write failure. Borrowed readers stay owned by the caller. Reference code, test specifications and rubrics are revealed as unscored study aids; revealing them is not evidence that a student's open answer has passed.

## Evidence boundaries

The 67-test rerun above is a Vitest result. Its five storage scenarios use `fake-indexeddb`; it is not a real-browser durability test. The concurrency outcome tests are explicit conceptual event models, not exhaustive proofs about all Java executions. Trusted Java fixtures are development-only checked-in authored code and are recorded separately in [Java evidence](ip-java-evidence.json) and [assignment evidence](ip-assignment-java-evidence.json). No learner Java is executed.

Real Chromium acceptance, browser/engine versions, responsive checks, production-build gates, final complete test counts and unavailable checks must be taken from the final Step 8 status report. This file does not substitute an earlier green run for those final checks. The illustrative JUnit excerpt is not claimed to have run as JUnit; the separate Java harness checks its specified behavior.
