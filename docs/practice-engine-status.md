# Step 4 — Shared practice and deterministic grading

**Status: PASS — Step 4 complete, 9 September 2026. Step 5 was not started.**

## 1. Git baseline and completed checkpoints

Work started with a clean tree at the requested Step 3 final commit `2693fd3` (Step 2: `4594fd3`). No reset, discarded changes, storage migration or Assembly refactor occurred. Repository instructions, the three earlier acceptance reports, preserved `INSTRUCTIONS_FOR_CODEX.md`, actual storage contracts/provider, routes, build gates, tests and native-browser harness were inspected before implementation.

Implementation checkpoint: `74c18f8` — `feat: add versioned shared practice and deterministic grading`. This saved a working, tested implementation and resumable acceptance notes. The following documentation commit, `docs: record Step 4 practice acceptance evidence`, contains this final report and README updates. Its exact hash is available with `git log -1 --format='%h %s'` and is included in the final delivery message. Final acceptance requires a clean working tree after that commit; generated files and build output introduce no tracked changes.

## 2. Baseline, final checks and changed files

Before edits, content validation, both projection checks, all **292 tests in 12 files**, typecheck and production build passed. No baseline failures were hidden or worked around. The same commands were rerun after implementation and review, with the new practice gate:

```bash
pnpm run validate:content
pnpm run check:academic
pnpm run check:references
pnpm run validate:practice
pnpm test
pnpm run typecheck
pnpm run build
git diff --check
```

**Actual final results: all commands exited 0; 370 tests in 16 files passed; no skipped or failing tests.** Final suite duration: 9.15 seconds. Production build: 86 transformed modules, 3.37 seconds. Tools: Node 24.19.0, pnpm 11.19.0, TypeScript 5.9.3, Vitest 4.0.18, Vite 7.3.6. No dependency installation, upgrade or lockfile modification was needed. Local execution logs were captured at `/tmp/delftstudy-step4-baseline.log` and `/tmp/delftstudy-step4-final.log`; these temporary logs are not application assets.

Complete change inventory, relative to `2693fd3`:

| Files | Change |
| --- | --- |
| `README.md` | Current routes, practice workflow, saving/version rules, commands and limitations |
| `docs/practice-engine-status.md` | New acceptance report |
| `package.json`, `vite.config.ts` | Practice validation command and additional dev/build/direct-build gate; all prior gates retained |
| `scripts/practice-catalog.ts`, `scripts/validate-practice.ts` | New trusted-pack provenance, definition/grader fingerprint and build checks |
| `src/App.tsx` | Practice catalog, exercise and attempt routes, scoped stylesheet |
| `src/academic/navigation.ts` | Nested Practice breadcrumb/page context only |
| `src/learning/LearningProvider.tsx` | Small queued `changeStudentData` adapter using the existing repository and publication path |
| `src/pages/TopicPage.tsx` | Authored-practice links on the three relevant topics |
| `src/practice/types.ts`, `validation.ts` | Typed definitions/results and strict bounded runtime validation |
| `src/practice/catalog.json`, `catalog-lock.json`, `grader-lock.json`, `catalog.ts` | Six immutable authored definitions, canonical definition hashes, executable grader hash, frozen registry and routes |
| `src/practice/grading.ts`, `service.ts` | Pure graders and thin StudentRepository integration |
| `src/practice/PracticePage.tsx`, `ExercisePage.tsx`, `AttemptPage.tsx`, `ExerciseParts.tsx`, `practice.css` | Catalog, preview, draft/submission runner, safe controls/results and scoped styles |
| `tests/practice-catalog.test.ts`, `practice-grading.test.ts`, `practice-service.test.ts`, `practice-ui.test.tsx` | 78 new acceptance/regression tests |
| `tests/application-routing.test.tsx` | One intentional assertion-block adaptation for the replaced Practice placeholder |

Total: **20 added files and 8 modified files**. The native-browser harness remains unchanged.

## 3. Contracts and repository integration

Four concepts remain separate: immutable academic pack; authored exercise definitions; per-student exercise instances/attempts; computed item feedback. An academic assessment `question_ref` is never treated as a runnable instance or fabricated for these lecture-based exercises.

`PracticeService` provides start/save/submit/retry over the actual `createDraft`, `editDraft` and `submit` repository methods. Browsing/previewing never seeds an attempt. Start is explicit. Drafts save explicitly rather than on unload or through implicit autosave. The UI labels unsaved changes and asks the learner to save before leaving. Submission persists the final current answer even if it differs from the last saved draft.

The provider queue and immediate pending-event guards serialize writes. Inputs and submit controls are disabled while a write is pending. Success follows repository transaction completion, not request success. The returned immutable submitted record is the only grading input. Failures keep the form answer and suppress successful-submission feedback. Identical operation retries are idempotent; conflicting content is rejected. No evaluation-writing API or stored grading result was added.

Initial hint use and prior solution exposure are `null` (unknown), not invented zero/false. A retry of graded familiar content creates a new attempt with known prior solution exposure. Submitted answers and submission metadata are preserved. Unknown exposure imported through a backup remains unknown. Item feedback does not alter `unassessed()` or `evidencePolicy()`.

## 4. Exact definition/instance/version binding

| Existing field | Step 4 meaning |
| --- | --- |
| `attemptId` | Fresh UUID for the student's attempt |
| `templateRef` | Namespaced authored definition ID, e.g. `ds.practice.co-binary-45` |
| `exercise.id` | `ds.instance.` followed by that attempt UUID; distinct namespace from definition identity |
| `exercise.version` | `1:sha256:<64-character definition hash>:grader:<64-character executable grader hash>` |
| `contentVersion` | Existing academic pack version `1.0.1` |
| subject/topic/subtopic/targeted skills | Exact validated canonical ownership; precisely one specified skill |
| `source` | Omitted; there is no assessment mapping for these authored lecture-based exercises |
| submission `operationId` | Stable `ds.submit.<attemptId>` |

The binding is 145 characters, within the existing 200-character field limit. Definition SHA-256 uses deterministic JSON serialization with lexically sorted object keys and preserved array order. This locks prompts, options, row order, formulas, references, rules, provenance and grader identity/version. A separate SHA-256 pins the exact `grading.ts` bytes (`56e488a8f607aeaaf0739ec5797f8a24cfbac9f907652f5f294d9f8192556c1a`). Build checks reject implementation changes under the existing lock.

The resolver validates the stored attempt and checks the complete binding and canonical associations. Unknown definitions, fingerprints, grader versions or mismatched identities produce an explicit original-version-unavailable state; they are never graded with current content and never become an incorrect answer. Stored answers remain readable. Future content/grader changes need new versions and locks, with old support retained or explicit unavailability. Locks are not regenerated by builds.

## 5. Six-item catalog and independent references

Every item is version **1**, labelled **Authored practice / Not an official TU Delft question**. No difficulty estimate is displayed; the source disclosure explicitly disclaims official difficulty and examination weighting. No exam mapping authorizes these exercises. No original PDF or external web curriculum was reconstructed or opened.

| Definition ID | Canonical skill / topic / subtopic | Lecture basis | Independent reference verification |
| --- | --- | --- | --- |
| `ds.practice.co-binary-45` | `CO_SK04_01_RADIX_CONVERT` / `CO_T04_DATA_REP_RADIX_INTEGER` / `CO_ST04_01_RADIX` | CO_LEC_05 | 45 = 32 + 8 + 4 + 1 → `00101101` in eight bits |
| `ds.practice.co-hex-173` | Same CO ownership | CO_LEC_05 | 173 = 10 × 16 + 13 → `AD` |
| `ds.practice.rl-conjunction` | `RL_SK01_03_TRUTH_TABLE` / `RL_T01_PROP_LOGIC` / `RL_ST01_02_TRUTH_VALID` | RL_LEC_01 | `(p ∧ q)` in FF, FT, TF, TT order → F, F, F, T |
| `ds.practice.rl-not-or` | Same R&L ownership | RL_LEC_01 | `(¬p ∨ q)` in that order → T, T, F, T |
| `ds.practice.ip-for-sum` | `IP_SK02_03_LOOP_TRACE` / `IP_T02_CONTROL_FLOW` / `IP_ST02_02_LOOPS` | IP_LEC_02 | i = 1,2,3,4; totals 1,3,6,10 → stable option `sum-10` |
| `ds.practice.ip-while-even` | Same IP ownership | IP_LEC_02 | i = 1,2,3,4; totals 0,2,2,6 → stable option `even-6` |

Exact source records, verified against each skill's HIGH-confidence lecture references and corpus ownership:

- CO_LEC_05: `CO Lecture 5 - Data Representation Part 1.pdf`, `PDF_PAGES_1-32`.
- RL_LEC_01: `R&L Lecture 1 - Propositional Calculus Part 1.pdf`, `PDF_PAGES_1-26`.
- IP_LEC_02: `IP Lecture 2 - Programming Structures.pdf`, `PDF_PAGES_1-34`.

All locators are `WHOLE_DOCUMENT_RANGE` / `DOCUMENT_RANGE`, **not exact supporting slides**. UI disclosures state this and do not invent PDF download URLs. Assessment/uncertain source payloads are rejected by the catalog contract.

The tests use explicit independently calculated expected responses and Java traces, not the grader to generate their expected values. As an extra check, both fixed trusted snippets were actually executed using the already installed **Temurin OpenJDK 21.0.12.1+1 LTS**, with outputs **10** and **6**. Only trusted fixed wrappers in `/tmp/delftstudy-fixed-java-check` were run. No JDK was installed; no learner-supplied code was executed.

## 6. Grading boundaries

`GRADED` alone contains `correct`, `earned` (0 or 1), `max` (1), reference and explanation. `INCOMPLETE`, `INVALID`, `NOT_AUTOGRADABLE` and `ERROR` contain no points. Technical failures cannot masquerade as a wrong answer.

Radix answers allow only outer whitespace trimming; width is exact; binary digits are 0/1 and hexadecimal digits are 0–9/A–F with either case. Prefixes, signs, internal whitespace, invalid suffixes and partial parses are rejected. `bigint` preserves exact arithmetic beyond the Number safe-integer range.

Truth tables use four stable row IDs and a bounded typed p/q expression tree. Every row needs exactly one T/F cell; missing cells are incomplete. No `eval` or free-form parser exists. Java responses select exactly one stable option ID for a trusted fixed snippet; no output text/code execution or keyword grading occurs. Unsupported proof/free-code task requests return NOT_AUTOGRADABLE without publishing fake exercises.

## 7. Protected baseline proof

This command exited 0 (no changes):

```bash
git diff --quiet 2693fd3 -- content-pack src/engine src/components src/utils src/examples src/AssemblyWorkbench.tsx src/index.css src/generated src/learning/contracts.ts src/learning/repository.ts pnpm-lock.yaml
```

Student schema remains **1**, database `delftstudy-student-v1` remains version **1**, and the transactional repository is unchanged. The existing 1,000-attempt and 4 MB backup limits still reject overflow without evicting older attempts. Imported fake correctness/score/confidence/mastery/eligibility fields remain invalid. `unassessed()` stays scoreless; every raw-record evidence-policy flag remains false.

All nine v1.0.1 release files remain byte-identical; eight payload checksums and the independently pinned manifest pass. **v1.0.0 is unused and no v1.0.0 pack directory exists.** The application's unrelated package version `1.0.0` is not an academic content source.

Canonical counts: 90 documents (IP28, CO29, RL33), 43 topics, 105 subtopics, 147 atomic skills, 37 assessments, 489 mapped question records, 17 question types, 22 exam patterns, 29 error tags. Relations: topic prerequisites62, skill prerequisites69, topic→subtopic105, subtopic→skill147, document→topic306, assessment→document37, question→topic538, question→skill2005. All memberships, uniqueness, prerequisite graphs, course boundaries, uncertainty/eligibility checks and eligible unique-document historical-frequency checks pass.

## 8. Acceptance evidence table

All results below were executed, not inferred from implementation. Vitest UI/storage scenarios use jsdom/fake-indexeddb; native-browser evidence is identified separately.

| Requirement | Test file / exact test or scenario | Command / action | Actual result |
| --- | --- | --- | --- |
| Content integrity/counts/policies | `content-validation.test.ts` — 39 tests including schema-cache, checksum, uncertainty and relation mutations | `pnpm run validate:content`; `pnpm test` | PASS |
| Deterministic projections | `academic-index.test.ts`14; `student-references.test.ts`2 | `pnpm run check:academic`; `pnpm run check:references`; `pnpm test` | PASS; 7,462 / 69,985 bytes |
| Six items and ownership | `practice-catalog.test.ts` — `validates six items, exact ownership, sources and immutable fingerprints` | `pnpm run validate:practice`; `pnpm test` | PASS; 6, exactly 2 per subject |
| Catalog negatives | `rejects %s catalog mutations` (8 cases); `rejects source provenance changes even with a matching exercise lock` | `pnpm test` | PASS; duplicate/ownership/source/reference/formula/row/grader/bounds blocked |
| Immutable versions | `refuses changed content under a published version even when structurally valid`; two executable-grader lock tests | `pnpm test` | PASS |
| Direct production gates | `content-build.test.ts`; `practice-catalog.test.ts` — `blocks direct production builds when practice validation fails` | `pnpm test`; actual Vite build with loaded project config | PASS; invalid content and raw/full handoff imports rejected |
| Independent correct/incorrect results | `practice-grading.test.ts` — `independent reference answer %#`, `explicit incorrect answer %#` (6 each) | `pnpm test` | PASS |
| Normalization / missing truth cells / exact options | `practice-grading.test.ts` — parameterized width/case/blank/row cases and `uses exact Java option identities with no text/code parsing` | `pnpm test` | PASS |
| Unsupported/error/no-score/numeric bounds | `practice-grading.test.ts` — unsupported proof/free-code, technical failure, bigint and two review regressions | `pnpm test` | PASS |
| Complete lifecycle per subject | `practice-service.test.ts` — `start/save/reload/submit/review/retry for $subjectId`; `practice-ui.test.tsx` — `completes the $subjectId flow without exposing a solution early` | `pnpm test` | PASS, all 3 subjects |
| Immutable/idempotent submission and final answer | `practice-service.test.ts` — `same start/submission IDs are idempotent and submitted content cannot be rewritten`; `submission persists the latest explicit answer, not an older saved draft` | `pnpm test` | PASS |
| Write completion/failure | `practice-service.test.ts` — `does not acknowledge/grade a submission whose transaction aborts after request success`; `practice-ui.test.tsx` — `save and submit failures keep the typed answer visible without feedback` | `pnpm test` | PASS |
| Pending/double events | `practice-ui.test.tsx` — `guards double starts/submits and does not submit during a pending save` | `pnpm test` | PASS |
| Binding/backup/epoch | `practice-service.test.ts` — `preserves binding and feedback across backup replacement while rejecting stale epochs`; unknown-definition/forged-binding case | `pnpm test` | PASS |
| Exposure/evidence/import limits | `practice-service.test.ts` — imported unknown exposure and 1,000-attempt cases; all `learning-contracts.test.ts`31 | `pnpm test` | PASS; no evidence promotion or record eviction |
| Stale UI / recoverable answer / routes | `practice-ui.test.tsx` — safe-reload conflict, selectable recovery text, unknown version/attempt and same-operation conflict cases | `pnpm test` | PASS |
| Atomic restore / stale record revision | `learning-repository.test.ts`17, including `rolls back both active and recovery after an abort during replacement` and `rejects stale-tab writes after restore inside the write transaction` | `pnpm test` | PASS |
| Routing, topic navigation and Assembly | Existing application-routing72 and Assembly101 tests | `pnpm test` | PASS; earlier coverage retained |
| Actual production subject/reload/history flows | Chromium scenarios in section10 | Production preview4187, UI controls / reload / Back / Forward | PASS |
| Native transactions and aborted restore | Existing `tests/browser/verification.ts`, 13 scenarios plus actual page-reload scenario | `node --import tsx scripts/build-learning-browser-check.ts`, preview4188, run buttons | 13/13 + 1/1 PASS |
| Real cross-tab restore | Export five test attempts, restore in one tab while another retains a draft, try stale submit | Production UI4187 | PASS; stale submit rejected, recovery copy intact, replacement draft blank |
| Responsive / keyboard | 390×844, 768×1024, 1280×900; native selects/radios, Space and Escape menu closure | Production browser UI | PASS; document widths equal viewport, mobile table fits |
| Production exclusions | Emitted Rollup module inventory check with project Vite config, `build.write=false` | Node/Vite `generateBundle` inspection | PASS; 77 emitted modules, no excluded modules |
| Type safety / output / whitespace | Entire project | `pnpm run typecheck`; `pnpm run build`; `git diff --check` | PASS, exit0 |

## 9. Test accounting and allowed adaptation

Baseline retained: **292 tests**, including all earlier230 and all101 Assembly regressions. Existing file counts: parser49, instructions34, executor10, visualization8, content validation39, content build4, academic index14, routing72, learning contracts31, learning repository17, learning UI12, student references2.

New: **78 tests** — catalog14, grading39, service11, practice UI14. Final **370 in16 files**. The native-browser scenarios are additional, not included in Vitest's count.

The only baseline test edit is the existing product-area parameterized assertion in `application-routing.test.tsx`: `/practice` now expects six exercise cards and Authored practice instead of an empty placeholder. Every other product area retains its original empty-state assertions. The no-fake-percentages/streak check remains for all. No test was deleted, skipped or weakened to conceal an unrelated failure.

## 10. Real-browser results and unavailable environments

Actually tested: **Codex In-app Browser, Chromium 152.0.7977.64, macOS**, exact version read from native browser client hints displayed by the existing verification harness. Production application used isolated origin `http://127.0.0.1:4187`; native harness used4188 with unique test databases. The user's existing4173 origin/data were not opened for testing or cleared.

Observed production checks:

- Fresh Practice showed six items and no attempts. CO filtering showed two. Exercise preview did not create a record or reveal a solution.
- CO: saved `001011`, reloaded and recovered it; submission rejected the invalid width; submitted final `00101101` and observed Correct1/1 only after saving. Reload preserved identical answer, explanation and attempt identity. Retry created a different ID and known prior exposure.
- R&L conjunction: F/F/F with last row missing produced an accessible incomplete error; completing T submitted Correct1/1 and the independently expected four rows.
- IP for-loop: keyboard-selected9 submitted Incorrect0/1 with reference10; retry selected10 and submitted Correct1/1. Browser Back/Forward restored review/catalog correctly. Catalog listed the five actual attempts created by these actions.
- Exported those five attempts, restored the backup, and verified the original CO submitted feedback again. Pre-restore recovery export contained exactly the same five attempt records as the original exported backup.
- A second tab held unsaved `11111111` in the CO retry during restore. Its subsequent submit was transactionally rejected as predating the restore. The answer remained in selectable recovery text, controls were disabled, no submitted feedback appeared. Safe reload showed the replacement dataset's blank draft, proving no stale answer was written.
- Mobile truth table at390px fit within x16–374 (358px wide). No horizontal page overflow at390/768/1280. Desktop catalog and mobile error/controls were visually inspected. Mobile navigation opened and Escape closed it (`aria-expanded=false`). Topic-source disclosure and topic→filtered-Practice link worked.
- Unknown exercise route displayed Exercise unavailable without an attempt. Existing tests additionally cover unknown attempt/version and invalid course associations.
- All three Assembly examples ran through the production UI: arithmetic RAX8; stack frame RAX15; function call RAX=RBX7. RSP/RBP returned to0x1000 for every example. Previous/Next, Reset and automatic Run remained functional.
- No production console warnings/errors were reported in inspected application tabs.

Existing native harness: fresh installation, new-connection persistence, concurrent distinct attempts, stale revision, immutable/idempotent submission, request-success-then-abort, atomic restore/stale connection, aborted replacement rollback, invalid import, corruption preservation, blocked upgrade, injected permission denial, and preparation for reload all passed (13/13). Actual page reload retained its committed record (1/1). The permission case injects a denial; it does not claim that macOS/browser permission settings were changed.

**NOT RUN:** actual Safari, Firefox, mobile-device hardware, screen-reader software, real disk-full/quota exhaustion, browser-data deletion/device-failure or OS-crash survival. These are platform/physical-event limits; mocked abort/failure paths, native transaction rollback and required production-browser acceptance were executed. Chromium testing is not Safari testing. No unexecuted critical Step4 acceptance check is counted as PASS. No remote deployment was requested or performed. Temporary test tabs were closed and viewport overrides reset; test preview servers are stopped after acceptance.

## 11. Failure, concurrency and recovery interpretation

Correctness comes from persisted generation and record revision checks within the same write transaction, not notifications. Same-tab generation/revision changes also invalidate the runner. Cross-tab stale submission was verified in the real UI, while controlled test cases reproduce delayed saves, aborts and conflicting operations. Import validation occurs before mutation; active replacement and pre-import recovery share a transaction. Both the unchanged repository tests and native harness prove aborted replacement leaves both snapshots intact.

Successful saving means a completed local transaction. It does not guarantee survival of browser-data deletion, device failure or every OS crash. Essential writes do not depend on unload. Explicit unsaved drafts can be lost if the learner navigates away without saving; the UI states that clearly. Backups retain raw records and exact version binding, never trusted computed grades. The bounded dataset does not silently discard old work.

## 12. Build gates and bundle inspection

`validate:practice` validates the full trusted release before checking catalog/source ownership and immutable locks. It runs in dev/build; the separate Vite plugin runs even for direct `vite build`. Existing content, projection and forbidden-browser-import guards remain enabled. Negative tests demonstrate a failed practice guard blocks a real Vite build and forbidden full/raw handoff imports remain blocked.

An additional Vite build using the actual project configuration and a read-only `generateBundle` inspection examined all **77 emitted module IDs** (12 Practice modules). There were **zero** modules from `content-pack/`, `scripts/`, `tests/`, `.verification-dist`, Ajv, fake-indexeddb, Vitest, jsdom or tsx. No full Handoff JSON/schema, fixtures or native harness ships to the frontend. Answer keys and six minimal lecture disclosures are intentionally included; they are not secure exam secrets.

| Artifact | Exact bytes | SHA-256 |
| --- | ---: | --- |
| `src/practice/catalog.json` | 8,704 | `1ad2a4b15572296057cb4f847ad30715a6adc5dd251c00093d649081e4dffca2` |
| `src/practice/catalog-lock.json` | 599 | `61320b1181faa33778360a499056700201555715ecb3f5112a00074498c1f3b5` |
| `src/practice/grader-lock.json` | 101 | `9b5c46e49121c70265216a5ccc29220e0b4a9480e19bb6e284af3ecd54a3eb07` |
| `src/generated/academic-index.json` | 7,462 | `4655711ac11b8ff491576a8b68df1af8fc0cdecafeca5d67d2cf2db4c2aaff63` |
| `src/generated/student-references.json` | 69,985 | `cb19b20e85f564ad8871e9224fe8b18b324341df719a969966a21ff15ee2cd60` |
| `dist/assets/index-sz1jtXgn.js` | 369,782 | `4ed7e81a3a36899811dc5835985c32a7931dd0e55c5ff3a81434ea8cc5f76ccd` |
| `dist/assets/AssemblyWorkbench-B_swzbvN.js` | 29,502 | `f26c1edb75f9d55a1762ea3e1fbbb31df0b18568bf143bb8b244e132df3d6eb6` |
| `dist/assets/index-h8s4r-oS.css` | 39,676 | `ade6bf180c9d658f155457c6594131ded9b5d280516084dfe03ee601c8ce437c` |

Vite gzip reports: main JS103.41kB, Assembly JS10.20kB, CSS9.54kB. Remaining production files are index.html744bytes and favicon.svg252bytes. No source maps or extra release/test files are present. Assembly's emitted filename changes because its shared main chunk reference changes; protected Assembly source and behavior remain unchanged.

## 13. Separate adversarial self-review

This was a **self-review, not an independent audit**, performed after the initial complete implementation passed365 tests. It examined grading input boundaries, trusted-expression corruption, original-version binding, queued writes, restore conflict recovery and baseline isolation. Four confirmed defects each received a reproducing regression **before** its minimal fix:

| Defect | Failing regression before fix | Minimal fix / verified outcome |
| --- | --- | --- |
| Malformed learner payload returned technical ERROR | `practice-grading.test.ts`: `review regression: malformed learner payload is INVALID rather than technical ERROR` | Validate the bounded answer envelope and classify bad learner input INVALID; PASS |
| A corrupted trusted variable name could silently behave like q and receive a score | `practice-grading.test.ts`: `review regression: corrupted trusted proposition identity is ERROR rather than an incorrect score` | Reject unknown trusted proposition names; ERROR without points; PASS |
| Invalidated forms disabled inputs without an easy selectable recovery view | `practice-ui.test.tsx`: `review regression: conflict exposes unsaved answer as selectable recovery text` | Render raw unsaved answer in an accessible preformatted recovery block; PASS, also confirmed in real stale-tab UI |
| Saved binding locked grader labels but not executable implementation | `practice-catalog.test.ts`: `review regression: instance binding locks executable grader content, not only its version label` | Pin grader source SHA-256, include it in instance version, reject changed source in build; PASS plus modified-source negative test |

All relevant tests and the full final suite/typecheck/build passed after these fixes. No confirmed unresolved correctness defect remains. Limits are intentional: six fixed authored items, explicit draft saves, local-only storage, no grading persistence, no anti-cheat guarantee, no original PDF binaries, no automatic proof/general-code grading, no migration or cross-device sync. The prior development-only transitive `whatwg-encoding` deprecation remains unchanged; no broad dependency update was attempted.

## 14. Scope stop

Only the shared six-item Practice flow was implemented. No mastery/readiness, adaptive Study Path, Mistake Book logic, flashcard/mental-map engine, mock exam orchestration, mass question generation, live AI, backend/auth, schema migration or arbitrary code execution was added. Other product areas retain their placeholders. **Step 5 was not started.**
