# Step 3 — Learning state and local persistence

## Final status

**COMPLETE — required Step 3 acceptance checks passed on 9 September 2026. Step 4 was NOT started.** No practice engine, grading, mastery/readiness calculation, adaptive logic, fake progress, backend or cloud integration was implemented.

## Starting point and checkpoints

- Started at the expected clean commit **4594fd3**. Inspected Git/status, Step 1/2 reports, the preserved operational instructions, routing, generators, import/build guards, Assembly storage and tests before edits.
- Before changes: content validation, navigation freshness, **230 tests in 8 files**, typecheck and production build all passed. No baseline failures.
- The separate `pnpm why` dependency inspection initially failed because the sandbox could not open pnpm's store database. Retrying with appropriate access succeeded; this was not an application/test/build failure.
- **41519d0** saves the tested Step 3 implementation, regression fixes, browser harness and resumable checkpoint. At that checkpoint 292 tests, typecheck and production build passed.
- The final documentation/verification commit is the commit containing this report (`git log -1 --oneline`). The final response records its resolved hash and checked Git status. Generated build output and test artifacts remain ignored.

## Architecture and contracts

The academic pack remains immutable **v1.0.1 / academic schema 1.1.0**. Its full SHA-256 fingerprint is `0290897dea04a92aeecee0e449baabcf781e91ead1577469e10a08700965a36e`.

Student data uses **student schema 1**, native IndexedDB database **delftstudy-student-v1**, IndexedDB version **1**, and one `student` object store with `active` and optional `recovery` keys. The active record includes the content identity, canonical resume position, bounded attempts, persisted generation and dataset revision. The recovery key holds the immediately preceding compatible backup. `hasRecovery` is derived from that persisted record. UI save/error status reflects actual transaction outcomes.

A single bounded dataset keeps transaction scope straightforward: read and runtime-validate the current data, check generation plus the relevant revision, make the change, validate the result, write, and acknowledge only on transaction completion. Distinct attempt writes serialize without losing one another. Attempt revisions protect edits; dataset revision protects resume changes and restore preview/confirmation. Restore generates a fresh epoch and stores recovery plus replacement in the same transaction. Notifications are not a correctness dependency. There is no event log, synchronization framework or speculative migration layer.

The asynchronous `StudentRepository` interface is separate from React. Clocks, IDs, database name and IDB factory are injectable. Application code uses native IndexedDB; **fake-indexeddb 6.2.5 is development-only**. The application has no temporary-memory mode claiming saved data. Unsupported schema/database/content versions and corrupt records are preserved and rejected; no automatic reset, deletion or migration is attempted.

Attempts preserve unique identity, canonical subject/topic, optional subtopic, explicitly targeted skills, optional exercise instance/version, optional source mapping/template references, content version, answer kind/value, timestamps, revision and nullable hint/solution exposure. Text/code answers are bounded to 16,000 characters; choices to 50 unique identifiers. At most 1,000 attempts and 4 MB per backup are supported. Code is data only. Optional template IDs are opaque instance metadata, not assertions of verified academic templates.

DRAFT answers can be revised. SUBMITTED and ABANDONED records cannot be edited. Submission preserves the final answer and operation/timestamp metadata; identical repeated operations are idempotent, while conflicting ID/content reuse rejects. A retry uses a new attempt ID. Future evaluation must be stored separately; there is no evaluation-writing API in this step.

All raw records fail closed for derived evidence. `unassessed()` has no score, and `evidencePolicy()` is always ineligible until trusted evaluation exists. This includes all 489 canonical source mappings: uncertain, broad and integrated IP mappings cannot gain confidence, individual skill credit or readiness by being saved/imported. Source locator/difficulty uncertainty is not converted into mapping uncertainty. Imports reject invented correctness, confidence, eligibility and mastery fields.

## Generated projections and browser payload

The existing generator's trusted validation and atomic-write utilities are reused. Both projections are deterministically sorted and checked during direct Vite production builds. Neither contains timestamps.

| Projection | Bytes | Fields/counts |
| --- | ---: | --- |
| `src/generated/academic-index.json` | 7,462 | Unchanged: 3 subject labels and 43 canonical topic labels/order/ownership |
| `src/generated/student-references.json` | 69,985 | `content` version/fingerprint; 3 subject IDs; 43 topic `id/subject`; 105 subtopic `id/topic`; 147 skill `id/subtopic`; 489 source mapping `id/subject/topics` |

The source mapping IDs combine assessment identity and question reference; the persistence validator consumes them for optional source ownership checks. They are not exercise instances. No extra policy payload, assessment content, question mechanisms, provenance or frequency tables are shipped. All raw evidence is ineligible, so no partial confidence resolver is invented.

Projection SHA-256:

- Navigation: `4655711ac11b8ff491576a8b68df1af8fc0cdecafeca5d67d2cf2db4c2aaff63` (identical to Step 2).
- Student references: `cb19b20e85f564ad8871e9224fe8b18b324341df719a969966a21ff15ee2cd60`.

Final production assets after documentation finalization:

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `assets/index-Bd0ubdtN.js` | 338,751 | `1066feac534b045abce9d45f22a435433d2b97b9345137b6f7f1712b55ab5171` |
| `assets/AssemblyWorkbench-DK1znZa0.js` | 29,502 | `06dd3306da00e61436d3a13e173fd405abcb477ab6ff76c2ca02a431d24ea5bf` |
| `assets/index-6Jwow9b0.css` | 36,197 | `bd89f8c7f39a8a7755d535716d74dd54d7ada0388847cca390ef71a8f39a9db3` |
| `index.html` | 744 | `e1eb8f75b2adc0da223b5c40b014fa207be08c8f0913a2a2159dc384e450498a` |
| `favicon.svg` | 252 | `23f7bf50a23828a272bf229eb2bbc429f650cad177f859fe79785770dbb35ac7` |

JavaScript total: **368,253 bytes**, up 86,126 bytes from Step 2 (282,127). The Assembly chunk retains its 29,502-byte size; its import reference to the changed main bundle changes its hash. Assembly source is unchanged.

Actual `dist/` inventory and payload inspection passed: no full Handoff JSON, JSON Schema, validator, fake-indexeddb, test fixture/harness, or academic assessment/policy payload. The production import guard remains unchanged. `.verification-dist/` is a separate ignored production-mode test output and is not copied into `dist/`. README/report text affects Tailwind's automatic class scanning. Final documentation added one unused visibility utility (29 CSS bytes); finalization reran the build and checked the listed asset sizes/hashes. No Assembly stylesheet was edited.

## Real UI behavior

Valid topic visits, including the Assembly tool and trailing-slash canonical topic URLs, save a resume identity after storage loads. Invalid/404 routes do not overwrite it. Dashboard renders the canonical course/topic labels and reconstructs the route safely; it never automatically redirects or displays progress percentages.

Progress retains its unassessed placeholder and adds local status, export, file validation, replacement preview, explicit confirmation, cancellation, reload and recovery export. Replacement cannot occur before confirmation. Imported text is never rendered as HTML. Shared-shell alerts expose save conflicts/errors even while on a topic or Assembly route. A stale tab must reload saved data; it cannot silently overwrite restored records.

The interface explains browser/origin locality (including different hosts and ports), lack of cloud sync, browser-data/device-loss risk and backup transfer. Saves acknowledge completed transactions, not survival of every OS crash. Essential student writes do not rely on unload/beforeunload. The independent Assembly namespace and memory-only CPU history are excluded from student backups.

## Final commands and test breakdown

Environment: Node **24.19.0**, pnpm **11.19.0**, TypeScript **5.9.3**, Vitest **4.0.18**, Vite **7.3.6**. Commands ran from the existing repository.

| Command | Actual result |
| --- | --- |
| `pnpm run validate:content` | PASS, zero integrity violations; all checksums/counts/relations/policies |
| `pnpm run check:academic` | PASS, 3 subjects / 43 topics / 7,462 bytes |
| `pnpm run check:references` | PASS, 3 / 43 / 105 / 147 taxonomy IDs and 489 source locators / 69,985 bytes |
| `pnpm test` | PASS, **292 tests in 12 files**, no failures/skips |
| `pnpm run typecheck` | PASS, no errors |
| `pnpm run build` | PASS, all validation/generation/typecheck/build gates |
| `node --import tsx scripts/build-learning-browser-check.ts` | PASS, separate production-mode native browser harness |
| `git diff --check` | PASS |
| Protected-path diff against `4594fd3` | PASS, no academic, Assembly, existing-index or baseline-test changes |
| Nine release files vs byte-verified import `744b6d5` | PASS, byte-for-byte identical |

| Test file | Passing |
| --- | ---: |
| `parser.test.ts` | 49 |
| `instructions.test.ts` | 34 |
| `executor.test.ts` | 10 |
| `visualization.test.ts` | 8 |
| `content-validation.test.ts` | 39 |
| `content-build.test.ts` | 4 |
| `academic-index.test.ts` | 14 |
| `application-routing.test.tsx` | 72 |
| `learning-contracts.test.ts` | 31 new |
| `learning-repository.test.ts` | 17 new |
| `learning-ui.test.tsx` | 12 new |
| `student-references.test.ts` | 2 new |

All **230 baseline tests are retained unchanged**, including all 101 original Assembly tests. The **62 new tests** are storage/contracts/projection/UI tests; fake-indexeddb and jsdom results are distinct from the native-browser results below.

## Acceptance-evidence table

Test files in this table are under `tests/`. Every listed result was executed. `pnpm test` runs the named unit/UI tests; the browser command builds the separate harness, which was then served with `pnpm exec vite preview --outDir .verification-dist --host 127.0.0.1 --port 4186 --strictPort` and operated through its buttons.

| Requirement | Test file / test name or scenario | Command | Actual result |
| --- | --- | --- | --- |
| Valid bounded answers and round-trip | `learning-contracts.test.ts`: `round-trips text, choice and code as raw unassessed data` | `pnpm test` | PASS |
| Invalid IDs, ownership, lifecycle, revisions, sizes | `learning-contracts.test.ts`: 23 `rejects … with a deliberate validation error` cases; canonical subtopic/skill ownership; malformed JSON/oversized backup | `pnpm test` | PASS; deliberate INVALID errors |
| Duplicate IDs and version compatibility | `learning-contracts.test.ts`: duplicate attempt/operation IDs; three incompatible-version cases | `pnpm test` | PASS |
| Fresh storage, reload and concurrent initialization | `learning-repository.test.ts`: `initializes fresh storage and survives a new repository/remount without empty-default overwrite` | `pnpm test` | PASS |
| Distinct concurrent writes, revision conflicts | `learning-repository.test.ts`: `preserves distinct concurrent writes and rejects stale draft revisions` | `pnpm test` | PASS |
| Submission idempotency vs conflicting content, immutable submission, retry identity | `learning-repository.test.ts`: `identical submissions are idempotent; conflicting IDs and edits never rewrite submitted answers`; `abandons only drafts and prevents reassignment of an existing attempt ID` | `pnpm test` | PASS |
| Transaction completion, abort propagation | `learning-repository.test.ts`: `acknowledges writes only after transaction completion and propagates abort after request success` | `pnpm test` | PASS; request succeeds, transaction deliberately aborts, active data unchanged |
| Unavailable/full storage, future database, corruption preservation | `learning-repository.test.ts`: unavailable/failed-write case, newer IndexedDB refusal and 3 corrupt/incompatible-record cases | `pnpm test` | PASS; exact failure types checked, no silent empty state |
| Blocked upgrade and late-open cleanup | `learning-repository.test.ts`: `reports a genuinely blocked native-style upgrade and closes its late connection` | `pnpm test` | PASS; controlled version-2 factory requests a blocked upgrade of a test database |
| Consistent export and recovery round-trip | `learning-repository.test.ts`: consistent export during writes; atomic replacement/recovery | `pnpm test` | PASS |
| Import preflight, no partial mutation | `learning-repository.test.ts`: malformed import rejection before writes | `pnpm test` | PASS |
| Aborted replacement | `learning-repository.test.ts`: `rolls back both active and recovery after an abort during replacement` | `pnpm test` | PASS; prior active AND prior recovery unchanged |
| Persisted epoch and stale confirmation | `learning-repository.test.ts`: stale-tab writes after restore; data changed after confirmation preview | `pnpm test` | PASS; transaction-level CONFLICT |
| All raw source mappings ineligible | `learning-contracts.test.ts`: `leaves hints and exposure unknown, and all source mappings ineligible` (loops over all 489) | `pnpm test` | PASS; no score or child-skill credit |
| Imported fake correctness/confidence/eligibility/mastery rejected | `learning-contracts.test.ts`: four fake-field rejection cases; `learning-ui.test.tsx`: malformed/fake-score import | `pnpm test` | PASS |
| Deterministic canonical reference projection | `student-references.test.ts`: exact trusted source/allowlisted fields/counts and reordered-input determinism | `pnpm test`; `pnpm run check:references` | PASS |
| Genuine resume, no fabricated data or invalid-route writes | `learning-ui.test.tsx`: fresh Dashboard; canonical saved link; valid/invalid visits | `pnpm test` | PASS |
| Loading race and StrictMode remount | `learning-ui.test.tsx`: delayed initial load; StrictMode setup/cleanup | `pnpm test` | PASS |
| Accessible error and restore confirmation | `learning-ui.test.tsx`: accessible storage error; confirmation/cancel/recovery; failed restore | `pnpm test` | PASS |
| Errors on topic routes and valid trailing slash | `learning-ui.test.tsx`: both `review regression: …` tests | `pnpm exec vitest run tests/learning-ui.test.tsx` | Failed before fixes; **PASS after fixes**, included in final full run |
| Assembly storage untouched | `learning-ui.test.tsx`: `student operations leave Assembly namespace bytes untouched` | `pnpm test` | PASS, exact localStorage comparison |
| Actual IndexedDB transaction, concurrency, restore, version/error behavior | `browser/verification.ts`: 13 named native checks below | Browser harness build/preview commands above, **Run native storage checks** | **13 PASS / 0 FAIL** |
| Actual page reload persistence | `browser/verification.ts`: `actual page reload retained committed database record` | Reload harness, **Verify committed record after reload** | **PASS** |
| Production UI resume, invalid import, confirmed restore and stale tab | Actual `dist/` app, isolated `4185` origin, two tabs | `pnpm run preview --port 4185 --strictPort`; browser interactions | PASS; stale write shown as explicit alert |
| Downloaded backup/recovery semantics | Actual export buttons; downloaded JSON files | Browser actions; local JSON equality inspection | PASS; pre-import backup equals downloaded recovery exactly |
| Routing, responsive layout, Assembly end-to-end | Production app navigation; 390 / 768 / 1280 CSS px; all 3 examples | Production preview + browser interactions; `pnpm test` | PASS; no horizontal overflow; arithmetic 8, stack 15, call RAX/RBX 7, RSP/RBP 0x1000 |
| Protected academic source and all previous gates | Existing content/index/Assembly suites; protected-path Git diff; checksum comparison | Final commands above | PASS |

## Native-browser verification details

Tested **Codex In-app Browser, Chromium 152.0.7977.64 on macOS**. The exact full version was read from browser client hints (`fullVersionList`); the reduced UA advertises Chrome/152.0.0.0. This was **not Safari** and not Playwright WebKit.

The actual production app used isolated origin `http://127.0.0.1:4185/`. The harness used `http://127.0.0.1:4186/` and random `delftstudy-isolated-acceptance-*` database names. The user's existing `4173` origin/data were not opened or cleared by these tests. No demonstration attempts were seeded into the real application origin. Test backups contained no attempts.

The separate production-mode harness ran these **13 checks**, all PASS:

1. Fresh installation.
2. Committed resume survives new connection.
3. Distinct concurrent attempts survive.
4. Stale draft edit rejected.
5. Immutable and idempotent submission.
6. Request success followed by abort is not saved.
7. Restore and recovery are atomic; stale connection rejected.
8. Aborted replacement preserves active and recovery.
9. Invalid import rejected before mutation.
10. Corruption preserved with explicit error.
11. Blocked upgrade rejects and releases late connection.
12. Browser permission failure propagates (**injected SecurityError**, not a real browser-permission toggle).
13. Prepare actual page-reload persistence check.

After an actual page reload, the additional committed-record check passed. Transaction aborts used the real native IndexedDB implementation with a controlled abort after request success. The blocked test used a factory requesting version 2 to reproducibly hold an upgrade behind another native connection; production still supports only version 1. No fake-indexeddb code is in this harness.

Actual production UI checks also verified:

- Empty Dashboard contains no invented resume or attempts; a real topic visit produces canonical labels and survives reload.
- Invalid backup containing an imported `mastery` field displays an accessible error without replacing data.
- Valid file opens a replacement preview; the replacement button is disabled until the checkbox is checked.
- Confirmed replacement completes, survives reload, and exposes pre-restore export.
- A real second tab loaded before restore cannot save a subsequent topic visit; it displays “This tab predates a backup restore.” Reloading saved data recovers the tab.
- Downloaded student backup and recovery JSON were read from disk and compared: exact semantic equality for the pre-import snapshot. The browser download-event waiter timed out, but the actual download existed and was verified. This is a tool-observation limitation, not a passed notification check.
- Mobile menu open/close/Escape, browser Back/Forward, responsive widths, and three Assembly examples all pass. Previous/Next, Run/Pause and Reset were exercised. RSP/RBP restore to 0x1000. Production console inspection showed no warning/error entries.

**NOT RUN (additional environment checks):** actual Safari, Firefox, other devices, physical disk-full exhaustion, real browser permission-setting changes and OS/device crash/reboot durability. Their impact is unverified environment-specific behavior; no cross-browser/crash-survival claim is made. Required failure behavior is covered by controlled transaction aborts/native errors and reproducible adapter/UI tests. No required critical acceptance check was left unexecuted.

## Separate adversarial self-review

After the initial implementation passed 290 tests/typecheck/build, a distinct **self-review** inspected the diff and relevant contracts, transaction lifecycle, mutation, restore, import and UI paths. It was not an independent audit. It confirmed two UI defects; each received a failing regression test **before** the fix:

| Confirmed bug | Reproduction before fix | Fix / final result |
| --- | --- | --- |
| Failed topic save was invisible on the topic page | `review regression: topic save failures are visible on the topic page` failed: no alert | Move LearningNotice into shared AppShell; regression and full suite PASS; actual stale-tab alert also verified |
| Router accepts trailing-slash topic paths but recorder ignored them | `review regression: valid trailing-slash topic routes save canonical identity` failed: no saved topic | Normalize trailing slashes before canonical lookup; regression and full suite PASS |

An earlier test-development run also caught an invented topic ID used in an assertion and a preflight method throwing synchronously while the test expected a Promise rejection. The assertion now explicitly expects INVALID for MISSING, and async repository preflight methods reject consistently. A test-only TypeScript nullable-name error and React test flush warnings were fixed before final checks. No original test was edited, disabled or weakened.

The review found no remaining confirmed defects in submission immutability, generation/revision transaction checks or recovery atomicity. This statement is limited to the executed review/tests, not a guarantee that no future bug can exist.

## Complete file inventory versus 4594fd3

Modified:

- `.gitignore`: ignore separate browser test output.
- `package.json`, `pnpm-lock.yaml`: reference scripts/generation hooks; dev-only fake-indexeddb.
- `vite.config.ts`: additional student-reference freshness gate.
- `src/App.tsx`: application-only learning provider around existing routes.
- `src/pages/DashboardPage.tsx`: genuine resume link.
- `src/pages/ProductAreaPage.tsx`: compact student-data section on Progress only.
- `src/shell/AppShell.tsx`: shared storage error notice.
- `src/shell/shell.css`: scoped storage/resume/confirmation styles.
- `README.md`: local storage, contracts, reference generation, backup instructions, limits and verification.

Added:

- `src/generated/student-references.json`.
- `src/learning/contracts.ts`, `repository.ts`, `LearningProvider.tsx`, `StudentDataPanel.tsx`.
- `scripts/student-references.ts`, `generate-student-references.ts`, `student-references-guard.ts`, `build-learning-browser-check.ts`.
- `tests/learning-contracts.test.ts`, `learning-repository.test.ts`, `learning-ui.test.tsx`, `student-references.test.ts`.
- `tests/helpers/learning.ts`, `tests/browser/index.html`, `tests/browser/verification.ts`.
- `docs/learning-state-status.md`.

All nine academic release files still match the byte-verified import. All 230 baseline tests, Assembly engine/UI/components/examples/utils/stylesheet and the navigation index are unchanged from 4594fd3. **v1.0.0 is unused**. Existing manifest checks, relation/prerequisite checks, uncertainty policy checks and canonical counts remain intact: **3 subjects / 90 documents / 43 topics / 105 subtopics / 147 skills / 37 assessments / 489 mappings / 17 question types / 22 patterns / 29 error tags**. Relation counts remain **62 / 69 / 105 / 147 / 306 / 37 / 538 / 2005**.

## Limitations and handoff

Local storage is browser/origin scoped, not backed up or synced automatically. One pre-restore snapshot is retained; subsequent successful restores replace that recovery snapshot. Export it first if older recovery data matters. Unknown versions or corrupt storage require a compatible application/backup or explicit future recovery work; this step deliberately does not silently repair/reset it. Only the current schema exists; no legacy migrations were invented.

Existing deprecated development dependency: **whatwg-encoding@3.1.1**, transitive through **jsdom@26.1.0**, directly and via **html-encoding-sniffer@4.0.0**; jsdom is a direct dev dependency and also resolved for Vitest 4.0.18. No broad dependency upgrade occurred. This dependency is excluded from the browser application.

No pending implementation, test, typecheck, content-integrity or build failures remain. Step 3 is complete. **Stop here; Step 4 was NOT started.**
