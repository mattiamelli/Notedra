# Step 14 — Production hardening and security

**PARTIAL — CONTINUATION REQUIRED. Local hardening verified: 37/37 commands PASS, 1,870 tests / 81 files. Final strict live Supabase acceptance is BLOCKED by repeated upstream request timeouts. Step 15 not started; no deployment or migration.**

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
