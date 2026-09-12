# Maintenance Patch 6 — final acceptance

| # | Required report item | Result |
|---:|---|---|
| 1 | Starting branch | `maintenance/exercise-system-source-alignment`; isolated patch branch `maintenance/interactive-logic-structured-exercises`. |
| 2 | Starting HEAD | Exact accepted Patch 5: `39a15c1bd9965f48ff1f1faae902defdb21b3d72`. |
| 3 | Initial status | Clean, verified before edits. |
| 4 | Existing architecture | Patch 5 explicit dispatch, immutable bindings, keyed choice storage, cautious feedback and next flow reused. `src/rl/logic.ts` already supplies bounded propositional AST semantics. Canonical K-map coverage is CO; R&L supports formula construction/equivalence, not a separately evidenced K-map area. Initial audit: `maintenance-patch-6-audit.md`. |
| 5 | Final types | `logic-build` and `kmap-fill`, added to the accepted discriminated union; existing seven types retained. |
| 6 | Builder | Bounded authored expression topology with fixed nodes, negation, binary nodes and labelled variable/operator slots. No arbitrary text concatenation or theorem prover. |
| 7 | Structured answer | Canonical keyed selections reconstruct the existing `PropFormula` AST. Slot identities/options, variable domain, topology, node/depth limits and completeness are checked. Transport remains the existing `choice` answer; no storage/cloud migration. |
| 8 | Semantic validation | Existing `evaluateProp` checks every assignment for up to four allowed variables. Equivalent operand order is accepted. A wrong formula produces a factual counterexample. Invalid/duplicate/out-of-domain tokens cannot grade. |
| 9 | Map domain | Separate pure layout/valuation/adjacency helpers, native table renderer and structured validator. Binary minterm array is independent of visual Gray placement. |
| 10 | Gray code | Binary-reflected Gray sequence `i XOR (i >> 1)`; 1-bit axes `0,1`, 2-bit axes `00,01,11,10`. |
| 11 | Cell mapping | Concatenate row bits then column bits in declared variable order. Two/three/four-variable maps enumerate each minterm exactly once; wraparound tested, diagonals rejected. |
| 12 | Function → map | PASS: two- and three-variable function completion with explicit given cells; four-variable minterm/don’t-care completion without givens. |
| 13 | Map → expression | PASS: supplied three-variable combinational map reconstructed through a five-slot Boolean expression. All care assignments checked. |
| 14 | Minimal form | Deliberately **not claimed**. Reverse task verifies equivalence and provides an authored reference; no grouping or minimization optimizer. |
| 15 | R&L additions | Three: necessary-condition missing connective; De Morgan reconstruction with equivalent operand order; less-scaffolded sufficient-condition composition. No unsupported R&L K-map mapping invented. |
| 16 | CO additions | Four: two-input combinational map; three-input partial map; four-input minterms plus don’t-cares; reverse map-to-function reconstruction. All use canonical CO lecture/skill sources. |
| 17 | Practice | Four tasks across courses use a partial expression or given map cells and optional topic preparation. Shared check, reset, immediate feedback and retry remain available. |
| 18 | Exam-style | Three distinct challenges: nested condition construction, four-variable minterm map and reverse combinational map. No preparation panel; no given answer cells. Individual exam-style practice, not newly readiness-bearing timed mock components. Existing exam banks unchanged. |
| 19 | Feedback | Human-readable formula or minterm values; first counterexample for non-equivalence; exact wrong cells for maps; original authored reasoning. No psychological or unverified misconception diagnosis. |
| 20 | Mistakes | PASS: wrong structured submissions enter existing factual Mistake Book evidence. New service test verifies counterexample reasoning, immutable binding, retry and next; no new error tags or fake open-work mistakes. |
| 21 | Eligibility | Canonical atomic source/skill eligibility reused without alteration; all 107 items checked against HIGH lecture provenance. No retroactive evidence, automatic readiness, new weights or formula changes. |
| 22 | Interaction design | Isolated workspace fieldset, visible formula preview, labelled controls, Gray table, distinct reset and existing primary Submit. No unrelated page redesign. |
| 23 | Contrast | White paper, cool panel, navy text, stronger restrained borders and blue focus using existing semantic tokens. Error/correct states retain textual feedback. |
| 24 | CTA treatment | Existing blue primary Submit and outlined Reset/Retry/Next; spaced controls and keyboard-operable actions. |
| 25 | Dark-mode readiness | All new widget colors use accepted semantic CSS variables. No global dark-mode feature, dependency or new color system. |
| 26 | Files | New interactive types/domain/grader/UI/CSS/content/locks/capabilities; shared dispatch and coverage adapter; validated course counts; three focused test files and browser harness; count-only historical regression updates; preservation and generated reports. Inventory below. |
| 27 | Tests | 17 domain/content cases, 5 UI/mode cases, 1 service/evidence case; existing per-type/per-item tests also expand. Historical-count filters explicitly retain the old exercise sets. |
| 28 | Logical builder | PASS: allowed variables/operators, correct/wrong connective and variable, equivalent order, malformed topology, duplicate choices, reset, submission and human-readable feedback. |
| 29 | K-map domain | PASS: 2/3/4-variable mapping, Gray headers, wraparound, distinct minterms, givens, invalid cells, X behavior, reverse equivalence and explicit non-minimality. |
| 30 | Renderer/validator | PASS: explicit type dispatch, labelled native controls, safe unavailable handling, per-type grading and feedback; no prompt heuristics. |
| 31 | Practice/exam | PASS in focused mode tests and production browser. Construction count and map givens differ, not only labels. Existing timed exam suites also pass. |
| 32 | Mistakes regression | PASS in full suite; no evidence or history logic modified. |
| 33 | Study Path | PASS, including accepted session duration and routing tests. Generation/recommendation logic untouched. |
| 34 | Mastery/readiness | PASS: all relevant suites and academic validations; existing formulas/weights/schema unchanged. |
| 35 | Full Vitest | **2,117 / 2,117 PASS, 98 files**, final run after application changes; 61.27 seconds. Initial targeted baseline: 141 PASS in 7 files. |
| 36 | TypeScript | PASS in final standard build. |
| 37 | Production build | PASS: exact `package.json` build script executed with bundled Node and local binaries (npm absent). Existing large-chunk advisory retained; no limit weakened. |
| 38 | Hardening | PASS, exact accepted preservation layer retained. |
| 39 | Security | PASS, final source/emitted-artifact scans. No remote changes or claim of new live cloud enforcement. |
| 40 | Academic | PASS: standard trusted-content/course/Practice/exam/evidence validations plus new canonical-source, reference, slot, map, capability and immutable-hash validation. Current matrix: 244 areas, 107 objective items, all 43 topics and 147 skills. |
| 41 | Java | PASS: 49 trusted compiled fixtures, two concurrency claims independently model-tested; 11 assignment references / 144 assertions, JDK 21.0.12.1. Learner Java remains unexecuted. |
| 42 | Bundle | Versus Patch 5: initial JS 507,271 → 507,455 (+184 bytes); initial gzip 134,607 → 134,670 (+63); CSS 89,767 → 91,364 (+1,597); total assets 1,893,977 → 1,918,056 (+24,079). All production/lazy-load guards PASS; no dependency added. |
| 43 | Desktop Chromium | PASS, 1280×900: all seven new tasks, incomplete/correct/wrong, reset, retry/reload, keyboard start/submit/next, no console/network/page errors in final run. |
| 44 | Mobile Chromium | PASS, 375×900: same seven flows, controls at least 44px, readable 4-variable map, contained widget overflow capability and no page-wide overflow. Screenshots visually reviewed. No Safari/Firefox/physical-device claim. |
| 45 | Accessibility | Explicit field labels, fieldsets/legends, table caption and row/column headers, minterm/assignment labels, native keyboard selects, visible focus, text correctness/errors and live formula preview. Not a full screen-reader audit. |
| 46 | Preservation | 15 exact entries updated/added; original pre-hardening hashes and all earlier entries retained. New grader fingerprint binds types, domain, grader and the unchanged accepted R&L semantic oracle. Old definitions/IDs/graders unchanged. |
| 47 | Adversarial review | Every new task and domain path reviewed: correct care rows, Gray geometry, bounded AST, safe alternative formulas, no minimization claim, no copied exam surface, no arbitrary learner Java/logic evaluation. Reviewed integration and count-only test changes. One initial mobile page-load failure did not reproduce in the final isolated run with console/network logging; no speculative application workaround was added. |
| 48 | Limitations | Fixed authored topology, at most four propositional variables; no quantifier builder, theorem prover, arbitrary grouping or minimal-SOP grading. No R&L K-map claim without canonical support. No new timed-mock bank. Seven representative tasks only; no Patch 7 expansion. |
| 49 | Final status | Clean after the one focused commit; no merge/push. |
| 50 | Commit | Hash reported in the operator-facing final response (a commit cannot contain its own hash). Message `feat: add interactive logic exercises`. |
| 51 | Final gate | **PASS**. Stop at Patch 6: no Patch 7, Step 16 or appearance expansion. |

## Evidence and reproduction

- `node node_modules/vitest/vitest.mjs run --maxWorkers=2`; log `/tmp/patch6-final-vitest.log`.
- Exact standard build script; log `/tmp/patch6-build.log`.
- `node --import tsx scripts/interactive-validation.ts` and `scripts/exercise-coverage.ts --check`.
- `validate-hardening.ts`, `validate-security-final.ts`, `inspect-production-build.ts`, `verify-ip-java.ts`, `verify-ip-assignments.ts`; corresponding `/tmp/patch6-<script>.log` files.
- `node tests/browser/interactive-preview.mjs /absolute/path/to/playwright/index.mjs http://127.0.0.1:4177`; log `/tmp/patch6-browser.log`.
- Disposable anonymous contexts only. Screenshots `/tmp/patch6-{1280,375}-<exercise-slug>-{input,feedback}.png` and `/tmp/patch6-{1280,375}-wrong.png`.
- Existing `src/rl/logic.ts`, Assembly, account/cloud, learning schema, adaptive and progress code verified byte-unchanged against Patch 5.

## File inventory

- `docs/adaptive-bundle-report.json`
- `docs/cloud-bundle-report.json`
- `docs/enrichment-bundle-report.json`
- `docs/exam-bundle-report.json`
- `docs/ip-bundle-report.json`
- `docs/maintenance-patch-5-coverage.md`
- `docs/maintenance-patch-6-audit.md`
- `docs/maintenance-patch-6-final.md`
- `docs/progress-bundle-report.json`
- `docs/rl-bundle-report.json`
- `docs/visual-bundle-report.json`
- `scripts/exercise-coverage.ts`
- `scripts/hardening-preservation.json`
- `scripts/interactive-validation.ts`
- `scripts/validate-practice.ts`
- `src/interactive/Controls.tsx`
- `src/interactive/capabilities.json`
- `src/interactive/domain.ts`
- `src/interactive/grader-lock.json`
- `src/interactive/grading.ts`
- `src/interactive/interactive.css`
- `src/interactive/practice-lock.json`
- `src/interactive/practice.json`
- `src/interactive/types.ts`
- `src/pages/CoursePage.tsx`
- `src/practice/ExerciseParts.tsx`
- `src/practice/catalog.ts`
- `src/practice/presentation.ts`
- `src/practice/registered-types.ts`
- `src/practice/runtime.ts`
- `tests/adaptive-validation.test.ts`
- `tests/application-routing.test.tsx`
- `tests/browser/interactive-preview.mjs`
- `tests/co-practice.test.ts`
- `tests/enrichment.test.ts`
- `tests/interactive-domain.test.ts`
- `tests/interactive-service.test.ts`
- `tests/interactive-ui.test.tsx`
- `tests/ip-practice.test.ts`
- `tests/mistake-evidence.test.ts`
- `tests/practice-ui.test.tsx`
- `tests/rl-topic-ui.test.tsx`
- `tests/topic-ui.test.tsx`
