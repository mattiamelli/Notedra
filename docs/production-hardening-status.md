# Step 14 — Production hardening and security

**COMPLETE — the Step 14 `PT409` correction is deployed by the project operator and remote acceptance passed. Local hardening: 37/37 commands PASS, 1,874 tests / 81 files. Step 15 not started.**

Starting HEAD `6d1b9dfd3fb148ba7097e7ed238e600da2a81deb`, verified clean before edits. Fresh baseline: **34/34 commands PASS; 1,864 tests / 77 files**. Results are in `hardening-baseline-results.json`. Content Pack v1.0.1, academic schema 1.1.0, Student Schema 3 and IndexedDB 3 remain authoritative.

## Historical implementation checkpoints (superseded by final status below)

- All baseline gates executed, including Java 49 fixtures and 11 assignments / 144 assertions.
- Existing disposable Supabase probe rerun against configured project: PASS (two new test users, snapshots, receipts, CAS, idempotency, cross-user negatives, reconnect/account switch). No real learner profile or migration modified. Log `/tmp/ds-hardening-remote.log`.
- Added static source/whole-repository secret, HTML/URL/debug, env and preservation checks; emitted artifact/secret checks. New scripts are build-only.
- Confirmed lazy route failure removes navigation; regression RED `/tmp/ds-hardening-route-red.log`, fixed via route-local error boundary. First fix remounted route content and broke two original keyboard tests; corrected to reset only error state on navigation. Original assertions retained; 95 focused routing/topic/boundary tests PASS.
- Confirmed overlapping sign-in during pending sign-out; regression RED `/tmp/ds-hardening-auth-red.log`. Auth operations now reject overlap with a retry message and release their guard on success/failure. Existing auth epoch and identity separation retained; 37 focused tests PASS.
- Confirmed backup text falsely denied cloud sync and described replacement across the whole origin. Wording now identifies the current local profile; no persistence changes. Regression RED `/tmp/ds-hardening-copy-red.log`, targeted GREEN.
- First full implementation suite: 1,868 PASS / 2 keyboard failures (of 1,870). This is **not** final acceptance. `/tmp/ds-hardening-first/` contains actual results, including failed history.
- Native Chromium `152.0.7977.83`: Step 9 14/14, Step 10 9/9, Step 12 9/9; three actual reload checks PASS. Old core harness: 12/13; its corruption setup still requested DB 2. Updated its default to the actual DB version; rerun OPEN. Production DB unchanged.
- Production preview is an isolated copied build at `http://127.0.0.1:4232/`; native harness `4233`. Anonymous wrong answer and correct new retry verified; real disposable UI signup and Synced verified, account Mistakes empty (anonymous history not adopted). Further browser acceptance OPEN.
- Full final suite, adversarial review, extra fresh review, mobile matrix and final commit remain OPEN.

## Practical threat model and current mitigations

| Threat | Actual boundary / evidence to verify finally | Residual limitation |
| --- | --- | --- |
| Malicious authenticated user / cross-user access | Owner from auth.uid(); forced RLS; SELECT-only table grants; restricted CAS RPC; live two-user negative probe | Browser validation is not server security; no administrative SQL introspection was performed |
| Replayed ID / stale revision / independent devices | Permanent owner-bound operation receipt; payload hash; advisory transaction lock; three-way merge | Receipts intentionally accumulate; no deletion/compaction without a future replay-safe design |
| Malformed/future cloud data or local backup | Exact shape/content/schema/bounds validation before transaction; atomic active/recovery writes | A user who controls their device can fabricate valid-looking personal practice; this is not trusted examination/anti-cheat software |
| Immutable divergence / historical binding mismatch | Submitted/abandoned records reject mutation; exact grader binding; missing versions stay unresolved | Backups from a different content fingerprint are refused; no automatic historical content fetching |
| Account switch / stale auth response | UUID-separated local profiles; auth epoch abort; remounted provider; explicit anonymous-copy consent; serialized actions | Profiles are not encrypted vaults; browser/OS access can inspect them; sent requests may complete remotely after logout |
| XSS through proof/code/backup text | React text rendering; textarea input; no raw HTML API in runtime source; no learner-code execution | Static scanner is a heuristic, not a proof against every possible obfuscation or dependency defect |
| URL abuse / redirect | Canonical route matching; static internal links; project-origin validation; URL session detection disabled | Deep-link support requires correct host SPA fallback in Step 15 |
| Secret leakage / supply chain | Whole working repository and dist scan; exposed env allowlist; ignored local env; pinned minimal dependencies | Pattern scans do not prove absence of every credential format; dev advisories recorded below |
| Storage exhaustion / abort / stale tab | Completed strict-durability transaction is save boundary; generation+revision checks in write transaction; visible failure/recovery | Browser deletion, real disk loss and every OS crash are not covered by a local save |
| Oversized payload / long processing | 16 MB backup/RPC payload, 5,000 attempts, 250 exams, 16,000 component characters; bounded selectors/pagination | JSON parsing/derivation is synchronous; low-end physical device profiling and malicious RPC load tests not run |
| Missing lazy page / network failure | Route boundary preserves shell/provider; account optional fallback; explicit manual sync retry, coalesced pass | Fresh offline boot is not supported; no service worker; SDK/network completion times are not guaranteed |
| Stale exam / double submit | Native revision/generation checks, idempotent operation ID, immutable submitted data, explicit deadline handling | Browser clock is learner-controlled; no proctoring or official-grade claim |

## Dependency audit

Registry audit completed with `pnpm audit --json`; five advisories: one critical, three moderate, one low. All paths reported dev-only. See `hardening-dependency-audit.json` for exact IDs and affected versions. Initial sandbox network attempt failed; the authorized network retry returned actual registry results.

- Ajv 8.17.1: ReDoS requires `$data`, not enabled by the checked-in strict build validator; no runtime Ajv import.
- esbuild 0.27.3: Windows development server arbitrary file read; this Mac build emits static assets and no esbuild server is deployed.
- Vitest 4.0.18 / mocker: UI server arbitrary execution and mock redirect traversal; acceptance uses `vitest run`, no publicly listening Vitest UI/server. Neither package is in the production graph.

No blind upgrades, dependency or lockfile changes. These advisories are **not dismissed as patched**. Do not expose development/test servers publicly. Reassess before changing the development/server workflow.

## Step 15 external configuration handoff (not performed)

Choose the actual static hosting provider and canonical HTTPS origin; upload only `dist`. Configure SPA fallback for application routes, but return 404 for absent hashed assets. Serve HTML with revalidation and hashed assets with immutable caching; retain old hashed assets through a release overlap so open tabs can finish. The new route boundary handles a missing module without resetting the learner profile.

Build with only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, using the selected project origin and browser-safe publishable/anon key. Never expose service-role, database, JWT signing or management secrets. Set the Supabase Site URL to the final canonical HTTPS origin and narrow Auth Redirect URLs to intended paths; remove temporary localhost entries from the production project when no longer required. Current app uses password auth, PKCE configuration and `detectSessionInUrl:false`; email verification returns to sign-in, not a general user-controlled redirect. No proxy/CORS workaround is needed. [Supabase redirect guidance](https://supabase.com/docs/guides/auth/redirect-urls).

Recommended hosting response headers, to validate on the chosen host before enforcing:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://YOUR_PROJECT.supabase.co; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

Replace the exact Supabase origin; no wildcard or unnecessary websocket origin (no realtime subscription used). Script eval/inline scripts are not required. Existing React dynamic style properties justify the separate style-attribute allowance; this does not allow inline scripts. Frame protection belongs in real HTTP headers, not a pretend meta tag. Trial with Report-Only and inspect actual deployment CSP violations, then enforce. [CSP reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy).

HSTS only after final HTTPS works: begin with a short max-age, then `max-age=31536000` after operational verification; includeSubDomains/preload only if every affected subdomain is HTTPS-ready. Canonical public URL, final metadata, sitemap/robots and Search Console are Step 15 decisions. No public hosting, DNS, header or Supabase redirect configuration has been changed here.

## Separate adversarial self-review

Performed after the first complete green rerun (**1,870 / 81 files**, `/tmp/ds-hardening-green-tests.log`), distinct from implementation and not an independent audit. Re-read auth methods/subscription/epoch handling; coordinator and native prepare/finish/release; three-way immutable merge; active/recovery transactions; exam save/submit/confirmation; environment parsing, migration SQL and emitted import guards.

- Challenged account switching while logout is in flight: the new operation guard rejects overlap before invoking the provider, while ordinary epoch cancellation/profile separation remain unchanged. Extended the regression to verify a later sign-in succeeds after logout completes (guard is not permanently stuck).
- Challenged lazy recovery: error reset is now a prop-driven state reset, not a React key that remounts every healthy route. The original keyboard regressions pass. Error text contains no thrown SQL/token/message content; shell remains outside the failed subtree and the current learning provider remains above it.
- Challenged stale/changed cloud acknowledgements: owner/schema/revision/op validated by coordinator; exact payload checked again by IndexedSyncStore.finish before its transaction; same-revision changed snapshot rejected against acknowledged base. Permanent receipts intentionally remain replay-safe, not truncated.
- Challenged partial restore: complete validation precedes mutation; active/recovery share one transaction, and generation plus revision protect replacement. Submitted exam/attempt locks and exact version binding have no runtime diff.
- Challenged XSS: production exam response containing `<img src=x onerror="alert(1)">` displayed literally after submission, no injected image node, open response still unscored. Source scan found no raw HTML sink in current runtime. This does not claim resistance to all hypothetical obfuscations/dependency attacks.
- Challenged scans themselves: negative tests reject private database URLs/tokens, HTML sinks, scriptable URLs and disguised test harness artifacts. Malformed noncredential JWT test strings initially triggered the reused scanner; valid decoded JWT roles remain checked while syntactically malformed examples are not described as real secrets. Values are withheld in scan errors.
- Connected the static hardening guard to the normal production build so it is not merely an optional final command. Emitted artifact checks remain a separate post-build gate.

No RLS/auth ownership, sync merge, storage schema, academic formula, engine or published-content redesign was introduced.

## Extra fresh security verification and claim check

After green tests, production acceptance and the separate self-review, re-read auth/session guard and cleanup; sync acknowledgement byte equality, owner/epoch checks and local journal scope; storage transaction completion, migration/restore; SQL policies/grants/definer search path; immutable exam submission; backup preflight; env keys and Vite production graph. Cross-checked claimed protection against actual test names and the browser record.

Two evidence-quality corrections:

1. The old remote probe accepted *any* RPC/negative-write error as a rejection. Strengthened it to require stale `40001`, reused operation `23505`, and direct-write `42501`, and added same-ID changed payload, own-write/CAS bypass and both receipt-table mutation negatives. This is test hardening, not a claim that deployed RLS was defective. The existing successful positive snapshot/receipt reads remain mandatory; network failures now fail acceptance. Final rerun result recorded below.
2. Preservation reports must not call repaired files byte-identical. Step 14 checks **358** original source/test/content/public/SQL paths: **354 unchanged**, four exact before/after repairs pinned in `hardening-preservation.json` (auth, backup copy, shell wrapper, native test helper). Earlier locks remain historical; their comparisons reconstruct original bytes only after asserting the exact accepted repair digest. No arbitrary file exemption or baseline assertion removal.

No additional runtime defect was confirmed in this fresh pass. The native corruption harness correction changes only its setup version; schema/migration and corruption assertions remain intact. Newly added guard tests are negative scanner tests, not hundreds of duplicated render cases. No retained baseline unit case was removed or skipped.

## Acceptance evidence map

Commands below are included in the final 37-command results. Unit/storage mocks and native/browser/remote evidence are intentionally separated.

| Requirement | Evidence / command | Classification |
| --- | --- | --- |
| Baseline and published academic preservation | `validate:content`, academic/reference/topic checks, all course/enrichment guards; hardening baseline comparison | Static validation |
| Secret/env boundaries | `hardening-validation.test.ts` private token/database tests; `validate:hardening`, `validate:security-final`; local env contained only two public VITE keys | Unit + static source/dist scan |
| RLS policies/grants/search_path/CAS | `cloud-security.test.ts`, `validate:supabase-security`; unchanged SQL; two-user probe | Static + live remote (not administrative schema introspection) |
| Auth epochs/account isolation/overlap | `cloud-auth.test.ts`, `cloud-profile.test.tsx`, `hardening-auth.test.ts` pending logout regression and subsequent sign-in; real UI account isolated from anonymous | Unit/jsdom + production Chromium |
| Replay/changed bytes/immutable merge | `cloud-sync.test.ts` same-revision mutation, lost acknowledgement, coalescing, changed account, restore races; `cloud-merge.test.ts`; receipt probe | Fake transport integration + native IndexedDB + live remote |
| Storage/backup/future schemas/atomic abort | `learning-repository.test.ts`, `exam-repository.test.ts`, migration regressions; native core/Step 9/10; actual UI restore | Unit fake-indexeddb + native IndexedDB + production Chromium |
| XSS/unsafe URL | runtime AST gate and `hardening-validation.test.ts`; existing unsafe project-origin tests; real open exam HTML-like answer renders literally | Static + unit + production Chromium |
| Stale/double/conflicting exam submission | `exam-repository.test.ts`: atomic/idempotent lock, changed request rejection, stale saves, exact boundary; native exam tests; mobile confirm/review | Unit fake-indexeddb + native + production Chromium |
| Exact academic evidence/open safety | all Practice, Mistake, Adaptive, Exam, Mastery, Readiness and IP tests; exact source hashes | Unit/integration + static preservation |
| Error handling/failed lazy module | `cloud-fallback.test.tsx`; new route regression; actual temporarily missing copied-build chunk, generic alert and Dashboard recovery | jsdom + production Chromium |
| Network failures/retry status | existing failed-upload/download, lost-ack, abort and coalescing tests; explicit Synced only after native completion | Fake transport + native; real online sync separately |
| Resource limits/performance | existing 100/1,000/5,000-attempt, 250-session performance tests; 16 MB and per-answer bounds; SQL payload/collection caps | Unit/Node performance + static SQL |
| Dependency hygiene | exact pinned dependencies retained; real registry audit with five dev-only findings; no test/dev packages in emitted graph | Registry + static graph; not vulnerability-free claim |
| Headers/CORS/origins | concrete handoff above; only intended Supabase SDK communication; no proxy or scriptable redirect | Static design; deployed enforcement NOT RUN |
| Logs and development-only assets | runtime AST debug/sink scan; source/asset secret scan; previous lazy guards plus production artifact inventory | Static + production console observations |
| Keyboard/mobile | original routing/topic keyboard assertions retained; native dialog Escape and return, keyboard restore confirmation; 24 measured surface-width combinations | jsdom + production Chromium |
| Assembly | original engine and example regression tests, three real UI examples; RAX 8/15/7, RBX7 for calls, pointers4096; Previous/Reset | Unit + production Chromium |

## Browser and native results

See `hardening-browser-results.json`. Chromium **152.0.7977.83**, macOS, exact version read from native test page UA high-entropy display. Native IndexedDB: **45 scenario checks plus 3 actual page-reload checks PASS**, combined across core (13 after its helper correction), Step 9 (14), exams (9) and sync (9). Sync native transport is deliberately fake; the live Supabase probe is separate. The original 12/13 core run is retained as a real failed test setup, not relabelled PASS.

Production origin `4232`: anonymous unknown Dashboard; wrong-answer feedback and distinct correct retry; real disposable signup/sign-in/Synced/sign-out; account history remained empty rather than auto-adopting anonymous mistakes; local exam autosave/flag/submit/open-text/review; restored empty backup with pre-restore recovery; Study Path destination; IP copy/reset/specification controls; all three Assembly examples. The empty restore affects only this isolated anonymous test profile. No real user history or cloud profile was used.

Measured account sign-in, Progress/backup, Mistakes, Study Path, Exam review, IP and Assembly at **390/768/1280**, 21 checks with document width equal to scroll width. The actual immutable-cloud-conflict state subsequently passed all three widths too: **24 total combinations**. Mobile exam dialog also measured390/390; Escape returned focus to its invoking button. The route failure is generic and leaves navigation visible. No warning/error was observed before fault injection; the intentionally missing module produced one expected console TypeError, which is not suppressed or counted as an ordinary clean-console pass.

## Explicit limitations / NOT RUN

- Safari, Firefox, physical mobile devices and screen-reader certification: NOT RUN. Responsive viewport tests are Chromium tests, not physical-device or Safari claims.
- Two *physical* devices: NOT RUN. Conflict/restore/account-cancellation correctness is covered by fake-transport/native transaction tests; actual production UI immutable conflict was exercised with generated test backups on the disposable account.
- Real quota exhaustion, power loss, long OS disconnection and fresh offline boot: NOT RUN. Controlled storage/transport aborts and bounds are narrower evidence. No offline service worker was added.
- Production-host headers/CSP/HSTS, DNS/public canonical URL, final Auth redirects and deployed origin behavior: NOT RUN; explicitly Step 15. Do not call the local preview a deployed secure site.
- Project administrator SQL catalogue inspection and adversarial RPC load testing: NOT RUN. Checked-in RLS/force/grants were reviewed; live requests verified enforcement for the tested operations. Permanent receipts grow with successful operations; hosting/project quotas and abuse monitoring need operational planning, not a silent replay-breaking receipt purge.
- Client-owned local evidence is not certified assessment data; local clocks and valid-shaped self-edited backups are not an anti-cheat boundary.
- Five development advisories remain as documented. No runtime dependency upgrade was justified by this registry result. Reassess before exposing any test/development server.

## Final local results and remote acceptance blocker

**37/37 final local commands PASS; 1,870 tests across 81 files, no skipped baseline tests.** Exact command/exit/timing inventory: `hardening-final-results.json`. Baseline1,864/77 plus six new targeted cases across four files. Final unit duration54.10s. Typecheck and production build pass; Java49fixtures plus11assignment references/144assertions pass. Node24.19.0, pnpm11.19.0. No dependency upgrade or schema change.

Final build: initial JavaScript503,057B /133,248B gzip, CSS88,937B, total assets1,877,565B; 129 emitted files scanned. Versus accepted Step13: +888B initial JS, +308B gzip, CSS unchanged, +1,307B total. Existing cloud/course/exam/progress/adaptive graph and bundle limits pass. Vite still emits its advisory >500kB chunk warning; unchanged explicit520kB/140kB-gzip limits pass. Academic canonical counts and all manifest/relation/prerequisite/uncertainty gates pass unchanged. The full Handoff and raw source packs are excluded. Student Schema3 / DB3 and Assembly engines retain original bytes.

### Live remote evidence — not accepted as a final PASS

The original existing probe completed once early in this step and printed PASS, but the later evidence review found its negative assertions too weak: any provider/network error counted as denial. That earlier result is retained as historical evidence and **does not substitute for the stricter final acceptance**.

The strengthened probe checks exact codes and both learner tables. Two actual final attempts stopped at:

```text
REMOTE ACCEPTANCE FAILED: stale revision did not produce a conflict: no error upstream request timeout
```

Permanent remote summary: `hardening-remote-results.json`. Logs: `/tmp/ds-hardening-remote-final.log` and `/tmp/ds-hardening-remote-retry.log`. Positive signup, initial own RPC and exact-operation replay occur before this assertion and completed in those runs; subsequent strict RLS mutation checks did **not execute** after the failing assertion. Do not label those unexecuted strict checks PASS. The initial, weaker full two-user run did exercise them, but could not distinguish all transport failures.

The deployed schema was not changed. Inspection of the installed PostgREST client's `fetchWithRetry` confirms POST RPCs are not automatically retried by that client; no evidence currently justifies changing SDK retry settings or weakening error classification. Cause of the upstream timeout is **unresolved** (not proven to be an RLS or client architecture defect). No cross-user data exposure was observed. The tested production UI immutable-conflict case is detected by the conservative local merge and remains distinct from remote stale-CAS rejection.

### Continuation checklist — remaining work only

1. Diagnose why the configured project returns an upstream timeout for a stale-CAS RPC instead of the expected structured `40001` response. Use only disposable accounts/browser-safe configuration; do not request service-role credentials or rerun migrations speculatively.
2. Rerun the strengthened `scripts/remote-supabase-acceptance.ts` successfully, including the currently unreached exact-code receipt/cross-user checks. Do not weaken assertions to accept network errors.
3. If a real source defect is confirmed, add a regression before the minimal fix and repeat relevant/full regression gates as required. No evidence yet authorizes declaring a backend defect fixed.
4. Update this report with the final remote result and any required targeted follow-up, then create the actual Step14 acceptance commit. Step15 remains out of scope.

This checkpoint is coherent and locally green but **not the accepted completion of Step14**. No partially applied migration or temporary missing production asset remains. The four exact source/test repair hashes and all original locks are checked in. Git checkpoint hash is reported in the delivery message; it is the commit carrying this status report (avoids a self-referential hash in its own contents).

## Changed-file inventory at checkpoint

- `docs/adaptive-bundle-report.json`
- `docs/cloud-bundle-report.json`
- `docs/co-bundle-report.json`
- `docs/enrichment-bundle-report.json`
- `docs/exam-bundle-report.json`
- `docs/hardening-baseline-results.json`
- `docs/hardening-browser-results.json`
- `docs/hardening-dependency-audit.json`
- `docs/hardening-final-results.json`
- `docs/hardening-first-results.json`
- `docs/hardening-remote-results.json`
- `docs/ip-bundle-report.json`
- `docs/production-hardening-status.md`
- `docs/progress-bundle-report.json`
- `docs/rl-bundle-report.json`
- `docs/visual-bundle-report.json`
- `package.json`
- `scripts/exam-storage-preservation.ts`
- `scripts/hardening-preservation.json`
- `scripts/hardening-preservation.ts`
- `scripts/hardening-validation.ts`
- `scripts/inspect-production-build.ts`
- `scripts/progress-validation.ts`
- `scripts/remote-supabase-acceptance.ts`
- `scripts/validate-hardening.ts`
- `scripts/validate-security-final.ts`
- `scripts/validate-visual.ts`
- `src/cloud/auth.ts`
- `src/learning/StudentDataPanel.tsx`
- `src/shell/AppShell.tsx`
- `src/shell/RouteBoundary.tsx`
- `tests/browser/verification.ts`
- `tests/hardening-auth.test.ts`
- `tests/hardening-backup-copy.test.tsx`
- `tests/hardening-route.test.tsx`
- `tests/hardening-validation.test.ts`
- `vite.config.ts`

Runtime repairs are limited to auth action serialization, a route-local failure boundary and backup wording. Other modifications are tests, exact preservation checks, the stricter remote probe, build-only security gates and generated evidence. Design CSS, published academic content, graders, merge algorithms, storage contracts/repository, RLS SQL and Assembly engine remain unchanged.

## Targeted remote continuation — 2026-09-10 UTC

Started from clean checkpoint `97b064d5d82e8abbc5fda92ec7bcfd4a4dbfbf82`. Application code, the existing strict probe, RLS/CAS semantics and migrations remain unchanged. Step 15 was not started.

Environment: Node `v24.19.0` is available through the installed runtime (not the default shell PATH); pnpm `11.19.0`. DNS resolved and unauthenticated HTTPS REST returned the expected 401 in both attempts. Both disposable users authenticated successfully in each attempt. Initial authenticated snapshot RPC and exact-operation replay returned 200 and passed the probe assertions. General connectivity and ordinary authenticated RPCs therefore worked.

Exact failing endpoint: `POST https://obaljgxtosxnsljdtjjf.supabase.co/rest/v1/rpc/sync_learner_snapshot`. Scenario: a new operation ID with `expected_revision: 0` after revision 1 has been saved and replayed successfully. Required result: structured conflict code `40001`.

| Attempt | Stale request finished (UTC) | Request duration | Actual result |
| --- | --- | --- | --- |
| 1 | 2026-09-10 20:00:35.018 | 125.271 seconds | HTTP 504, `upstream request timeout`, no structured conflict code |
| 2 | 2026-09-10 20:03:57.509 | 124.933 seconds | HTTP 504, `upstream request timeout`, no structured conflict code |

Exactly **2 attempts / 1 retry** were made in this continuation, more than 60 seconds apart after the first failure. Each used the existing probe unchanged. A temporary external fetch observer recorded only method/path/status/duration, never credentials, tokens or request/response bodies. Machine-readable evidence is appended in `hardening-remote-results.json`; transient logs are `/tmp/ds-step14-remote-resume-1.log` and `/tmp/ds-step14-remote-resume-2.log`. Four disposable accounts were created; no admin/service-role credentials or cleanup migration was used.

Classification: **external/upstream infrastructure timeout**, not application PASS. The underlying cause remains unresolved; no application/security defect was established. The probe stops at stale revision rejection, so reused-operation conflict, own table SELECT/receipt access, cross-user SELECT/UPDATE/DELETE, spoofed INSERT, direct-write denial and reconnect/account-switch checks remain **NOT RUN in this continuation**. Authenticated User B signup passed, but its snapshot write occurs after the blocking assertion and was not reached.

Fresh affected checks: `pnpm validate:supabase-security` PASS (2 tables / 8 owner policies; static only), `pnpm validate:security-final` PASS (521 repository files / 131 runtime files / 129 emitted assets), and `pnpm validate:hardening` PASS. The checkpoint's **37/37 validation commands, 1,870 tests across 81 files, typecheck, production build, Java and Chromium acceptance remain the last complete local evidence**; they were not rerun in this documentation-only continuation. This is not a new full-suite PASS. The remaining blocker is unchanged; no final Step 14 acceptance commit is justified.

## RPC 504 diagnosis — 2026-09-10 (no implementation changes)

**PARTIAL — REMOTE CONFLICT ACCEPTANCE BLOCKED BY UPSTREAM/DATABASE TIMEOUT. Classification E: UNKNOWN root cause.** The observed failure is an upstream HTTP 504; evidence does not distinguish A (database blocking) from C (PostgREST/provider infrastructure). B (SQL logic defect) is not proven. D (original harness/SDK defect) is not sufficient to explain it: one native-fetch reproduction without Supabase SDK produced the same result.

### Checked-in branch trace

Inspected `supabase/migrations/202609100001_learner_sync.sql` lines 39–120. This is the checked-in definition; **exact deployed definition, owner role, extra triggers and server settings were NOT independently retrieved**. No SQL connector/psql/database credentials are available here. No privileged credential was requested or used.

- Lines 54–62 reject absent auth (`42501`) and invalid envelope (`22023`). Owner comes exclusively from `auth.uid()`; there is no caller-supplied owner to mismatch. Snapshot/receipt reads and writes use this owner. Direct table ownership enforcement is separately defined by RLS and revoked writes.
- Lines 64–67 hash revision + payload, acquire the transaction-scoped owner advisory lock, then read the operation receipt. Every valid call passes through these operations.
- Lines 68–70: an existing receipt with a different binding raises `23505`; an identical binding returns immediately. This path does **not** lock the snapshot row.
- Lines 72–73: without a receipt, select the owner's snapshot `FOR UPDATE`, then compare revision (missing row = 0). A mismatch immediately raises `40001`. This branch contains no loop, insert or later validation.
- Initial save also executes line 72 but finds no tuple to row-lock; 0 matches 0. Lines 74–108 validate content/history, with bounded collection loops (empty in this repro), then lines 110–115 upsert snapshot and insert receipt atomically.
- A current-revision update follows the same snapshot lock, validates immutable history and writes the next revision. Receipt uniqueness waits can occur at line 114 on successful writes, **not after the stale branch's RAISE**.

First operation after divergence from the passing idempotent path: line 72 `SELECT ... FOR UPDATE`. Compared with the initial save, the SQL statement is shared but now locks an existing tuple; the first unique instruction is line 73's `RAISE 40001`. Neither the HTTP result nor row reads reveal whether execution reached that RAISE.

Lock order inside this function is owner advisory lock → receipt SELECT (no explicit row lock) → snapshot row lock → snapshot/receipt writes. Sequential calls for one owner should serialize; the checked-in function contains no inverted lock order or exception-catching retry loop. Other transactions, DDL, custom live triggers or external writers could still block it; their absence cannot be established here. The function is SECURITY DEFINER with an empty search_path and qualified application tables. No custom trigger is declared in this migration; foreign-key effects occur on writes, which the stale path should not reach. No sessions were terminated.

### One controlled native HTTP reproduction

Only one stale RPC was sent in this diagnosis, with no automatic retries. A new disposable user avoided overlapping prior acceptance sessions. All four learner collections were empty; content consisted only of version `1.0.1` and fingerprint, not course text or student answers. Signup and initial snapshot save returned HTTP 200. Read-only preflight SELECTs returned:

- User: `bb8d31a1-a9c5-4a96-b8a8-7d068240e241`.
- Server revision: `1`; saved operation: `b40c3670-1661-4393-b1ab-799666f481b6`.
- Exactly one receipt: same operation, revision `1`, request hash `724cf8c046fb60071e5b82f81fc2d5ce7eebaa35659dea4218e995e30093a87c`.
- Requested expected revision: `0`; new stale operation: `d38042b1-1de4-4883-9fe7-39357cf25483`; no existing receipt for it. Expected revision is not separately stored in a receipt; the request binding hash covers it.
- Endpoint: `POST https://obaljgxtosxnsljdtjjf.supabase.co/rest/v1/rpc/sync_learner_snapshot`.
- Response at `2026-09-10T20:11:07.127Z`: **HTTP 504**, body exactly `upstream request timeout`, elapsed **125,213 ms**. No structured SQLSTATE was returned.

Postflight snapshot SELECT also failed at `2026-09-10T20:12:08.746Z`, after **61,619 ms**, with HTTP 504 and structured body:

```json
{"code":"PGRST003","details":null,"hint":null,"message":"Timed out acquiring connection from connection pool."}
```

This directly establishes connection-pool acquisition failure for the subsequent read (category C symptom). It does not prove the pool caused the earlier stale RPC failure or establish what occupied its connections (root-cause classification remains E). The script stopped on this read failure; the postflight receipt read was NOT RUN. Final row/receipt state therefore remains unverified. The preflight reads were successful; do not claim the row stayed unchanged after the timeout. No further request or retry was made. Exact sanitized events are retained under `diagnosis20260910` in `hardening-remote-results.json`.

### Safest next manual diagnostic (not executed here)

Use the project's Supabase SQL Editor with its normal project operator access; do not put database/admin secrets into the app. First retrieve the deployed definition and trigger metadata read-only and compare to the checked-in migration:

```sql
select p.oid::regprocedure as signature, pg_get_userbyid(p.proowner) as owner,
       p.prosecdef, p.proconfig, pg_get_functiondef(p.oid)
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'sync_learner_snapshot';
select tgrelid::regclass as relation, tgname, tgisinternal,
       pg_get_triggerdef(oid)
from pg_trigger
where tgrelid in ('public.learner_snapshots'::regclass,
                 'public.learner_sync_operations'::regclass);
```

Inspect provider/PostgREST/database logs for the exact UTC window 20:09:01–20:11:08 and the disposable owner above. Look for SQLSTATE 40001, cancellation, pool exhaustion, transaction retries and wait events. If a carefully supervised future request is needed, have the operator capture activity **while it is waiting** (not merely afterwards):

```sql
with target as (
  select pid from pg_stat_activity
  where datname = current_database() and pid <> pg_backend_pid()
    and state = 'active' and query ilike '%sync_learner_snapshot%'
    and query_start > now() - interval '5 minutes'
)
select a.pid, a.state, a.xact_start, a.query_start,
       a.wait_event_type, a.wait_event, pg_blocking_pids(a.pid) as blockers
from pg_stat_activity a
where a.pid in (select pid from target)
   or a.pid in (select unnest(pg_blocking_pids(pid)) from target);
```

The activity filter identifies RPC candidates, not proven ownership; correlate the request timestamp/logs before attributing a PID. For a confirmed PID, inspect only `pg_locks` rows for that PID and its `pg_blocking_pids` (read-only). Do not terminate sessions or reapply migrations. No corrective SQL or migration is justified without this evidence. If RAISE 40001 appears promptly in database logs but HTTP still waits, escalate the paired timestamps/status to Supabase support; if a lock wait is identified, investigate its blocker with the operator.

No code/SQL fix made; no migration required or proposed on current evidence. No local regression rerun is warranted for documentation-only diagnosis. Previous local and browser results remain historical checkpoint evidence, not new acceptance. Strict reused-operation/RLS mutation/reconnect checks remain unverified. Step 15 was not started.

## Corrective `PT409` implementation — 2026-09-10

The live log evidence changed the diagnosis: `sync_learner_snapshot` used PostgreSQL SQLSTATE `40001` for a permanent application stale-revision conflict. Supabase documents that affected PostgREST versions treat `40001` as retryable transaction failure, turning one RPC request into repeated database transactions. This explains the repeated `Stale cloud revision` log records, PostgREST timeout-manager termination, subsequent HTTP 504 and `PGRST003` pool-acquisition failure. The CAS comparison, owner advisory lock, row lock and receipt logic were correct; the error signal was not.

New migration: `supabase/migrations/202609100002_stale_conflict_pt409.sql`.

- It uses `create or replace function` with the existing signature, `SECURITY DEFINER`, empty search path, advisory lock, receipt lookup, snapshot `FOR UPDATE`, validation, upsert and grants unchanged.
- Its only function-body semantic replacement is `raise exception 'Stale cloud revision' using errcode = '40001'` with `raise sqlstate 'PT409' using message = 'Stale cloud revision'`.
- `PT409` is PostgREST's explicit application HTTP 409 contract, so it is not interpreted as a retryable serialization failure. The TypeScript adapter maps **only** the exact pair `PT409` / `Stale cloud revision` to `SyncError('CONFLICT')`; arbitrary HTTP 409-like codes, `PGRST003`, 504 and unknown outcomes remain network errors and retain the durable pending operation.

`cloud-validation.ts` compares the replacement function byte-for-byte against the applied migration after the single permitted `40001 → PT409` replacement. Tests cover exact adapter normalization, non-stale PT409 rejection, PGRST003 retention as network failure, stale-pass release/no same-pass retry, idempotency, operation reuse, coalescing, timeout recovery and auth lifecycle. The local full suite passed **1,874 tests in 81 files**. The complete Step 14 local gate is **37/37 PASS**: full tests, all content/bundle/security validators, typecheck, production build, Java (49 fixtures and 11 assignments / 144 assertions), and diff check. The production bundle remains 503,057 bytes initial JS / 133,244 gzip; Vite's existing >500 kB advisory warning remains.

The configured workspace has neither Supabase CLI nor `psql`, and only a browser publishable key. Applying a migration requires project-operator access and cannot be performed safely through the public Data API. The correction is therefore **not deployed**, no live acceptance probe was rerun against an unchanged function, and the deployed PostgREST version is **NOT CONFIRMED**. The previous Chromium acceptance is historical evidence; a fresh Chromium pass for this non-visual adapter/migration change is **NOT RUN** because the isolated current preview could not be kept alive by this execution environment. This does not affect the local gates, but prevents a claim of complete Step 14 acceptance.

### Required operator action before remote acceptance

Apply exactly `202609100002_stale_conflict_pt409.sql` through the project's normal Supabase migration workflow or SQL Editor, after confirming `202609100001_learner_sync.sql` is already present. Do not rerun the original migration. Then run `node --import tsx scripts/remote-supabase-acceptance.ts` from this repository using only the existing browser publishable key. Acceptance requires a single stale request to return promptly with code `PT409` and message `Stale cloud revision`, unchanged revision-1 snapshot, no stale-operation receipt, responsive subsequent reads, and the existing two-user RLS/idempotency/reconnect checks. Inspect the related logs to confirm that one stale request does not create the prior repeated `40001` pattern. If the environment supports it, record the deployed PostgREST version as evidence.

## Final remote and browser acceptance — 2026-09-10 UTC

This section supersedes the earlier pending-deployment text. The project operator confirmed that `202609100002_stale_conflict_pt409.sql` was applied through the normal Supabase workflow; it was **not** reapplied from this workspace. The exact existing strict remote probe then passed from a clean disposable-user run at `2026-09-10T20:56:50.209Z`–`20:56:55.642Z`.

- DNS resolved and unauthenticated REST HTTPS returned 401. Two disposable account signups succeeded (HTTP 200). The first cloud write and exact-operation replay returned 200.
- One deliberately stale CAS RPC returned HTTP 409 / `PT409` with the exact message `Stale cloud revision` in **151 ms**. The probe verified that revision 1 and its original operation remained unchanged and that the stale operation did not receive a receipt. No 504 or `PGRST003` occurred in this run.
- Changed reuse of an operation ID was rejected (HTTP 409; the probe asserts SQLSTATE `23505`). User B's initial write succeeded. Own reads succeeded; cross-user SELECT was invisible; cross-user UPDATE, DELETE and spoofed INSERT were denied (HTTP 403); User B's data remained unchanged.
- Reconnect and account switching returned the isolated cloud profile. The probe finished with `REMOTE ACCEPTANCE PASS: auth, snapshots, receipts, RLS isolation, idempotency, stale-CAS conflict, reconnect and account switch.` No service-role/admin credential was used.

Fresh production-preview Chromium acceptance used the current built application at `http://127.0.0.1:4234/`. Dashboard startup completed without an error state. Account recovery reached the anonymous-local profile and Account & cloud sync page, where the optional sign-in and local recovery controls rendered correctly. The Assembly Visualizer loaded the Stack frame example and executed `pushq %rbp`: RSP changed from `0x1000` to `0x0FF8`, the prior RBP was shown at the pushed cell, the deterministic explanation appeared and execution history recorded step 1. This was a Chromium preview check; it did not use a real browser UI credential or claim Safari coverage.

The deployed PostgREST version remains **NOT CONFIRMED** because it is not exposed through the browser-safe project interface. The behavioral result is nevertheless recorded precisely: the stale application conflict now returns promptly and all required remote authorization, idempotency and isolation checks pass. The existing Vite initial-chunk advisory (>500 kB) remains a non-blocking build warning. No Step 15 work was started.
