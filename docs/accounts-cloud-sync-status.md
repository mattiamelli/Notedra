# Step 12 — Accounts + Supabase + Cloud Sync

**STEP 12 IMPLEMENTATION AND REMOTE ACCEPTANCE COMPLETE — 32/32 local commands PASS; 1,856 tests / 74 files; isolated live Supabase acceptance PASS. Step 13 has not started.**

Starting clean accepted commit: `d6586e83045241727b6b62951da09231c7ee95db`. Original Step 12 specification: user attachment `6aa8e799-75f4-475f-ba9f-e628455993cc/pasted-text.txt`. Existing work must be continued, not reset.

## Baseline and implementation record

All **28 baseline commands passed**, including **1,725 tests / 66 files**, TypeScript, production build, all prior content/bundle gates and trusted Java references (49 fixed fixtures; 11 assignments / 144 assertions). Actual command results: `accounts-baseline-results.json`; logs `/tmp/ds-step12-baseline/`. The pre-existing React act warning in adaptive-ui remains a baseline warning, not a new acceptance failure.

Implemented: strict cloud payload allowlist, three-way merge, durable pending-operation journal in the account-local student store, cancellable sync coordinator, auth lifecycle abstraction, Supabase JS adapter, optional account UI, separate anonymous/account profiles, explicit anonymous copy, SQL schema/RLS/CAS/idempotency migration, security/build gates, fake storage/cloud tests and a separate native browser harness. Student Schema 3 / IndexedDB 3 and existing StudentRepository/PracticeService/exam/Assembly code are unchanged.

Initial targeted core/auth run: **88 PASS** (not the final acceptance count). First full suite: **1,840 PASS / 1 failure**; failure was the existing navigation inventory expecting nine destinations before the account route was added. Its expectation was extended to all ten destinations, preserving the original nine. The rerun passed 1,841 tests; the final suite after review fixes passed 1,856 tests across 74 files. Initial build hit the existing protected dependency lock; the only approved change is the pinned Supabase dependency closure, recorded by before/after SHA-256. Existing dependency entries are unchanged. A subsequent bundle build passed, and TypeScript passed after an assertion-narrowing correction in the new guard.

## Architecture and safety policy

- Anonymous storage retains `delftstudy-student-v1`. Account storage is `delftstudy-account-<validated-auth-uuid>-v1`, each at IndexedDB version 3. Switching identity remounts the learning provider; no account dataset is adopted by another account. Sign-out preserves the account database and returns to the separate anonymous dataset. This is app-level isolation, not encryption against someone with browser/OS access.
- Supabase JS **2.116.0**, pinned with its nine-package dependency closure. Minimal email/password through `signUp`, `signInWithPassword`, `getSession`, `onAuthStateChange`, and local-scope `signOut`. The provider owns tokens/session persistence; DelftStudy does not store passwords. Email confirmation does not imply a session: verify email, then sign in. URL session detection is deliberately disabled; no magic-link/OAuth provider is implemented.
- Account/sync/Supabase code is lazy. Missing configuration leaves the existing local app active. An initial configured-session loading screen offers anonymous local study; choosing it cancels session restoration until reload, so a late response cannot replace an unsaved editor. Cloud calls occur on account initialization and explicit Sync now, with one coalesced pass and no retry loop. Later work is visibly pending; reconnection allows manual retry.
- Cloud schema 1 uses one owner snapshot and permanent operation receipts. PostgreSQL revision CAS is serialized per authenticated owner. A receipt binds operation ID to expected revision plus canonical JSON payload hash, so a lost acknowledgement can be retried without a new logical commit. Receipts preserve idempotency after later device writes.
- All eight SELECT/INSERT/UPDATE/DELETE policies restrict ownership through `auth.uid()`; RLS is enabled/forced on both tables. Direct writes are revoked; the narrowly scoped security-definer RPC derives the owner internally, rejects unauthenticated callers, fixes an empty search path, enforces CAS/limits and prevents deleting or changing existing terminal records. There is no account/cloud deletion UI.
- Payload fields are only schema/content binding and attempts/reviews/exams/examReviews. Resume/page visits, telemetry, canonical content, source PDFs, question banks and derived mastery/readiness are absent. Content metadata is a version/fingerprint, not academic content. Downloads validate with the existing backup contracts before writes. Historical bindings are preserved; sync never calls a grader.
- A saved common base proves one-sided mutable changes; both sides changed differently means conflict, even if one revision/timestamp is higher. Identical immutable IDs deduplicate. Submitted/abandoned records cannot change. Absence is not deletion: empty devices and smaller restored backups cannot wipe cloud history. Review/undo and exam drafts use the same three-way ancestry rule. Ambiguous conflicts stop sync and preserve data.
- The local pending request is committed before upload. Acknowledgement and merged active data commit atomically in the same native student-store transaction. Unknown transport outcomes retain the operation ID; only a definite stale CAS can release it for a fresh comparison. New unrelated local work during upload survives and remains pending. Restore-generation changes during upload stop normal local acknowledgement; both pending operation and restore recovery remain available. The explicit “Compare restored history” action retries the original operation and checks the expected restored dataset inside the applying transaction. Immutable conflicts and a second concurrent restore still stop it.
- Manual backup/restore stays independent and schema-compatible. Sync never overwrites the existing pre-restore recovery key. Local durability does not guarantee survival of browser-data deletion, device failure, or every OS crash. Export backups.

## Supabase setup and documentation verification

Official documentation inspected on 10 September 2026:

- [React Auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Sign-up and verification](https://supabase.com/docs/reference/javascript/auth-signup)
- [Auth state subscriptions](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
- [RLS policies and operation-specific testing](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Browser-safe API keys](https://supabase.com/docs/guides/getting-started/api-keys)

For an isolated test project, apply `supabase/migrations/202609100001_learner_sync.sql` with the Supabase SQL editor or a linked Supabase CLI migration workflow. Enable email/password authentication, configure the local site URL for the intended preview origin, and use disposable test accounts. Copy `.env.example` to `.env.local`, supplying only the project URL and browser-safe publishable (or legacy anon) key. Rebuild/restart Vite after configuration changes. Never use a service-role, signing, management or database secret in `VITE_*` variables. No public deployment was performed.

**REMOTE SUPABASE ACCEPTANCE — PASS (isolated API acceptance).** On 10 September 2026, Node 24.19.0 and pnpm 11.19.0 ran the disposable two-user probe in `scripts/remote-supabase-acceptance.ts` against the configured HTTPS project. DNS resolved and the REST endpoint returned an authenticated `401`, as expected before a session. The probe then established real sessions and exercised Auth, the deployed RPC, snapshots, receipts and RLS. It uses only the configured browser-safe key; no service-role or database credential was used.

## Real Supabase remote acceptance

**REMOTE SUPABASE ACCEPTANCE — PASS (isolated API acceptance).** Email/password signup produced authenticated sessions for generated disposable User A and User B. The probe verified:

- User A and User B can each create and read their own `learner_snapshots` and `learner_sync_operations` receipt through `sync_learner_snapshot`.
- Repeating A's exact operation returns revision 1 (idempotency); a stale operation and a reused operation ID with altered request binding are rejected.
- A cannot select B's snapshot or receipt. A's direct UPDATE, DELETE and spoofed INSERT targeting B are denied or yield no visible row; B's revision remains unchanged.
- A fresh signed-in client reads A's stored snapshot after reconnect, then local-scope sign-out and sign-in as B reads B's independent snapshot.
- The reconnect check uses a fresh authenticated client after local sign-out. A real network-disconnect/offline interval was not run and remains explicitly excluded below.

This proves the deployed local-to-cloud RPC/write and cloud read paths for the versioned learner payload. Existing `SyncCoordinator` transaction, merge and local restore behavior remains covered by the 1,856-test local suite; this remote probe intentionally does not rewrite application architecture or invoke a browser UI flow. The disposable accounts and their minimal empty learner histories are retained because the product intentionally has no client-side cloud deletion endpoint.

### Migration syntax correction applied

The previous editor failure was caused by PostgreSQL parser treatment of a *simple CASE expression* used as the right-hand side of `>` without parentheses in line 79. The original fragment was:

```sql
jsonb_array_length(learner_payload->collection) >
  case collection when ... else ... end
```

In PL/pgSQL `IF <expr> THEN` expects a complete expression after `>`, and the unparenthesized CASE expression in that position caused `ERROR: 42601` at parse time in the SQL Editor.

The migration now uses the equivalent, grammar-valid form with explicit expression grouping:

```sql
jsonb_array_length(learner_payload->collection) >
  (case collection
    when 'attempts' then 5000
    when 'reviews' then 5000
    when 'exams' then 250
    else 16000
  end)
```

No other semantics were changed:

- table definitions, keys, checks and ownership fields unchanged;
- RLS enable/force and owner `USING`/`WITH CHECK` predicates unchanged;
- public grants/revokes unchanged;
- `sync_learner_snapshot` validation logic, CAS/revision semantics, immutable conflict checks, receipt idempotency and operation insert/revision advancement unchanged;
- grants on the RPC changed only by keeping the same signature and execution-only grant.

### Remote execution safety of the last failed run

The migration is wrapped in:

```sql
begin;
...
commit;
```

All DDL, grants, function creation, RLS policies and grants are inside the transaction.

Because of this structure, the prior failed execution is considered **safe to rerun the complete corrected file**:

- **A. SAFE TO RERUN COMPLETE MIGRATION**  
  The failed run reported a parse-time error before any object could commit; no prior partial commit is expected from the failed script.

The strongest local verification available here:

- full top-to-bottom file inspection for unbalanced control/transaction syntax (`BEGIN`/`END`, `IF`/`END IF`, `LOOP`/`END LOOP`, function body delimiters, `CASE` grouping, `BEGIN`/`COMMIT`);
- no PostgreSQL parser/runtime available in this workspace (`psql`/`supabase`/`docker` absent), so actual execution can only be confirmed by running the corrected file in a real or local PostgreSQL-enabled environment/Supabase SQL Editor.

## RLS policy inventory

Both tables enable and force RLS. Every policy below applies to `authenticated`; ownership is `(select auth.uid()) = user_id`.

| Operation | `learner_snapshots` policy | `learner_sync_operations` policy | Predicate |
| --- | --- | --- | --- |
| SELECT | `snapshot_select` | `operation_select` | USING owner |
| INSERT | `snapshot_insert` | `operation_insert` | WITH CHECK owner |
| UPDATE | `snapshot_update` | `operation_update` | USING owner AND WITH CHECK owner |
| DELETE | `snapshot_delete` | `operation_delete` | USING owner |

Grants further restrict clients to SELECT: direct INSERT/UPDATE/DELETE remain revoked despite the defensive ownership policies. Writes go through the owner-derived, revision-checked RPC. These are statically verified definitions, not executed remote RLS results.

## Final automated acceptance

All **32 required final commands exited 0**: all prior content, academic/reference projection, topic, CO, R&L, enrichment, IP, mistake/adaptive, exam and mastery/readiness gates; all bundle guards; four Step 12 gates; the full suite; typecheck; production build; trusted Java reference verification; and `git diff --check`. Exact commands, timings and output tails are in [accounts-final-results.json](accounts-final-results.json).

The final suite has **1,856 passing tests / 74 files**, with no skipped tests. All **1,725 baseline cases / 66 files** retain their per-file counts; **131 added cases** cover the new layer. See [per-file inventory](accounts-test-inventory.json). The established adaptive-ui React act timing warning appeared as at baseline; it was not suppressed or weakened. Expected optional-module failure diagnostics are intercepted only by the specific negative unit test. Production browser consoles were inspected separately.

| Acceptance area | Evidence / representative test names | Command | Actual result |
| --- | --- | --- | --- |
| Auth loading, login, signup, verification, logout, restore, errors/expiry | `cloud-auth.test.ts`: starts loading; restores known account; signs in through provider; reports email verification; sign-out; expired session | `pnpm test --maxWorkers=2` | PASS, fake AuthAdapter |
| Auth races and profile isolation | `cloud-auth.test.ts`: older lookup / newer sign-in; switch/cancel epochs; late events; `cloud-profile.test.tsx`: never renders A history under B | full suite | PASS, jsdom/fakes |
| Local-first without configuration / loading failure | `cloud-ui.test.tsx`: real account/CO/RL/IP routes; `cloud-fallback.test.tsx`; SDK failure profile test | full suite; production Chromium | PASS; configured SDK failure injected |
| Anonymous copy and restore consent | `cloud-ui.test.tsx`: copying anonymous data requires explicit choice; explicit restore recovery needs consent | full suite | PASS, jsdom |
| Empty cloud/device, unrelated device writes, dedupe | `cloud-sync.test.ts`: uploads/downloads; two devices converge; `cloud-merge.test.ts` | full suite; native harness | PASS, fake cloud; native IndexedDB separately |
| Immutable attempts, exams, exact old bindings | cloud merge immutable-field cases, exact submitted exam/evaluation dedupe, historical unavailable version | full suite | PASS, no regrading |
| Workflow and exam draft conflict / clock skew | common-base review/undo; higher revision is not ancestry; concurrent exam edits | full suite | PASS |
| Request failure, lost acknowledgement and idempotent reload | `cloud-sync.test.ts`: failed upload/download; lost acknowledgement; new coordinator retry | full suite; native harness | PASS |
| Durable completion / stale writes / local commit failure | successful request then abort; prepare generation/revision; local edits during upload; restore races | full suite; native harness | PASS |
| Restore recovery after an in-flight sync | explicit reconciliation; second restore/immutable-change rejection; consent UI | full suite; native harness | PASS |
| Backup independence and derived evidence | backup/recovery without network; restored exact evidence recomputes Progress | full suite; native exam regression | PASS |
| Corrupt cloud, owner/schema/revision mismatch | payload extra-field/schema/ID tests; wrong account envelope; same-revision mutation regression | full suite | PASS |
| RLS ownership / secret checks | `cloud-security.test.ts`; eight policies, revoked direct writes, owner-derived CAS/receipt RPC; privileged-key/JWT rejection; isolated live User A/B SELECT/UPDATE/DELETE/spoofed-INSERT negatives | `validate:supabase-security`; full suite; `remote-supabase-acceptance.ts` | PASS; live API/RLS acceptance executed, SQL-editor migration execution itself not independently observed |
| Published content / Assembly / storage preservation | 229 exact accepted-baseline SHA-256 comparisons | existing gates; `accounts-preservation.json` | PASS, byte-identical |
| Lazy account, sync and Supabase payload | actual emitted module graph and credential scan | `check:cloud-bundle` | PASS |
| Type safety / production compilation | strict TypeScript and Vite build with every build guard | `typecheck`; `build` | PASS |
| Trusted Java references | 49 fixed fixtures; 11 assignments / 144 assertions | `verify:ip-java` | PASS, Temurin JDK 21.0.12.1 |

## Production Chromium acceptance

Tested **Chromium 152.0.7977.64 on macOS**, production origin `http://127.0.0.1:4218`, separate native harness `http://127.0.0.1:4219`. Existing user origins were not used for test data. No actual Supabase account was created or accessed.

- Final account page: truthful Local only / configuration-required behavior, no dead sign-in buttons without configuration, one configuration message. Document/scroll widths **390/390, 768/768, 1280/1280**; actual 390 px screenshot inspected. Keyboard opens mobile navigation, Escape closes it and returns focus, and Enter on backup guidance reaches Progress’s real export/reload controls.
- CO microcode Learn, R&L first-order logic Learn, IP control-flow Learn, Practice catalogue, Mistakes, Study Path, Exams landing and Progress load and remain usable without accounts.
- Through real UI, submitted `00000000` to Decimal to eight bits, attempt `c8b1f371-77d0-4f37-9840-92039ba9d7fb`. The immutable original and correct `00101101` reference remain visible with explanatory reasoning. Mistakes shows one factual mistake; Study Path offers two related actions. Progress shows CO evidence index 0/Low with 1/46 skill coverage and unknown exam readiness, without fabricating a grade. Opening the final build in a new tab preserves that local history.
- All three Assembly examples run: arithmetic **RAX 8 / 3 steps**, stack frame **RAX 15 / 9**, function call **RAX=RBX 7 / 10**. All finish with RSP/RBP **0x1000**. Previous restores the stack-frame state with RSP/RBP **0x0FF8**. The examples were then run again instruction-by-instruction with the preview server stopped; all results still passed. This proves already-loaded local execution during server unavailability, not fresh offline boot or a complete OS network-disconnection test. The preview was restarted afterwards.
- **Nine final native sync checks PASS** using real IndexedDB and deterministic fake transport: lost acknowledgement, reopened-coordinator retry, download commit, two simulated-device histories, review, request-success-then-abort, independent restore recovery, explicit restore reconciliation, and stale-auth cancellation. Simulated devices use distinct test database prefixes, not real remote devices.
- Native Step 10 regression: **nine checks + one actual page reload PASS**, covering migrations, immutable submissions, transaction abort, backup/recovery, stale writes and deadlines.
- Inspected production and native-test consoles: **zero warnings/errors**. One automation locator needed its observed accessible spacing corrected; immediate post-navigation snapshots sometimes showed the preceding render, so destination state was checked after loading. These were tool timing/locator issues, not application console failures.
- Final isolated production smoke: **Chromium 152.0.7977.64 on macOS**, `http://127.0.0.1:4220`. Account & sync exposes real anonymous/local-only state plus sign-in controls; CO, R&L, IP, Practice, Mistakes, Study Path, Mock Exams and Progress loaded. Progress continued to describe mastery/readiness as derived evidence rather than a grade. No horizontal overflow at **390 px**, **768 px** or **1280 px**; keyboard Enter opened the mobile navigation and Escape closed it with focus returned to the trigger. Arithmetic finished RAX=8, stack frame RAX=15, and function call RAX=RBX=7; every example finished with RSP/RBP 0x1000. No production-console warnings/errors were observed.

## Bundle and performance

| Final production asset group | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| Initial JavaScript | 497,652 | 131,367 |
| Initial change from accepted Step 11 | +3,099 | +1,160 |
| Account page | 5,379 | 2,042 |
| Configured profile + auth/sync engine | 15,694 | 5,764 |
| Separate Supabase client closure | 223,730 | 58,507 |
| Total emitted assets (existing inventory convention) | 1,839,860 | 536,202 |

Account, sync and SDK are lazy; the SDK chunk is not included in initial JS. Engine and configured-profile bytes share one chunk and are not double-counted. See [cloud-bundle-report.json](cloud-bundle-report.json). The previous guards also reject raw source PDFs/ZIPs/full Handoff/report/test payloads. No canonical academic content is uploaded by the explicit payload projection; content fingerprint/version is metadata only.

Client merge tests cover 100, 1,000 and 5,000 records, deterministic reversed-device ordering, unchanged inputs and a five-second safety ceiling. Final observed timings were 4.55 ms / 29.56 ms / 144.06 ms respectively, recorded in the full-suite log and final result evidence; these are local observations, not device-independent predictions. Whole snapshots are sent only on initialization/manual coalesced sync, not every keystroke or render. No automatic retry loop or unload-dependent save exists. SDK token refresh behavior is separate from application sync retries.

## Security review, assumptions and limitations

See [accounts-security-review.md](accounts-security-review.md) for the distinct adversarial self-review, reproduced findings/fixes, extra independent-style verification (not an external audit), second security-assumption review and claim-evidence check. No known unresolved local acceptance defect remains.

**REMOTE SUPABASE ACCEPTANCE — PASS (isolated API acceptance).** Generated User A and User B accounts completed real signup/sign-in, snapshot and receipt writes, exact-operation retry, stale/reused-operation conflict rejection, cross-user SELECT/UPDATE/DELETE/INSERT negatives, reconnect and account-switch reads. This is live Supabase enforcement, distinct from the fake-adapter and Chromium-local-storage tests.

Other explicit NOT RUN items: Safari, Firefox, physical mobile hardware, full OS network disconnection, fresh offline boot, real disk-quota exhaustion, power loss and screen-reader audit. No service-worker caching/PWA or production deployment/hardening was added. Existing 5,000-attempt/250-exam/16 MB backup bounds remain; the sync base/pending journal and recovery require additional local storage. Account namespaces are not encryption. A previously sent request may commit remotely after sign-out, but its stale response cannot acknowledge into another profile. Sign-out uses the provider’s local-session scope; other devices stay signed in.

Ambiguous immutable/draft/workflow conflicts have no “force winner” action. Export both devices’ backups and preserve the originals; continue local study while resolving the conflicting history deliberately. The explicit restore-race action does not bypass these rules. There is no account deletion or cloud-history deletion feature. Derived Mistake Book/Study Path/Progress remains local recomputation; open reasoning/code still earns no automatic correctness. v1.0.1 stays authoritative and v1.0.0 remains unused.

## Final Git identity and scope

Starting commit is given above. The final acceptance commit is the commit containing this report, obtainable with `git log -1 --format=%H -- docs/accounts-cloud-sync-status.md`; its exact full hash and post-commit clean status are reported in the delivery message. This avoids a self-referential commit hash embedded in its own content. All baseline changes and new files are committed together after verification.

Step 13 and later, final visual identity, production hardening, public deployment, unrelated Assembly refactoring, additional graders, telemetry and derived-score persistence were **not started**.

## Changed-file inventory

The following inventory is relative to accepted Step 11. Existing bundle reports change only to describe current production assets. Existing application edits are confined to account composition/navigation, Vite integration and the additive dependency gate exception; baseline test edits add the tenth navigation destination and the separate native harness entry.

- `.env.example`
- `README.md`
- `docs/accounts-baseline-results.json`
- `docs/accounts-cloud-sync-status.md`
- `docs/accounts-final-results.json`
- `docs/accounts-preservation.json`
- `docs/accounts-security-review.md`
- `docs/accounts-test-inventory.json`
- `docs/adaptive-bundle-report.json`
- `docs/cloud-bundle-report.json`
- `docs/co-bundle-report.json`
- `docs/enrichment-bundle-report.json`
- `docs/exam-bundle-report.json`
- `docs/ip-bundle-report.json`
- `docs/progress-bundle-report.json`
- `docs/rl-bundle-report.json`
- `package.json`
- `pnpm-lock.yaml`
- `scripts/cloud-dependency-lock.json`
- `scripts/cloud-validation.ts`
- `scripts/inspect-cloud-build.ts`
- `scripts/remote-supabase-acceptance.ts`
- `scripts/storage-migration-preservation.ts`
- `scripts/validate-auth.ts`
- `scripts/validate-supabase-security.ts`
- `scripts/validate-sync.ts`
- `src/App.tsx`
- `src/accounts/AccountPage.tsx`
- `src/accounts/AccountRoot.tsx`
- `src/accounts/ConfiguredAccountRoot.tsx`
- `src/accounts/accounts.css`
- `src/accounts/context.ts`
- `src/cloud/auth.ts`
- `src/cloud/config.ts`
- `src/cloud/coordinator.ts`
- `src/cloud/local-store.ts`
- `src/cloud/merge.ts`
- `src/cloud/model.ts`
- `src/cloud/supabase.ts`
- `src/shell/AppShell.tsx`
- `supabase/migrations/202609100001_learner_sync.sql`
- `tests/application-routing.test.tsx`
- `tests/browser/cloud.ts`
- `tests/browser/index.html`
- `tests/cloud-auth.test.ts`
- `tests/cloud-client.test.ts`
- `tests/cloud-fallback.test.tsx`
- `tests/cloud-merge.test.ts`
- `tests/cloud-profile.test.tsx`
- `tests/cloud-security.test.ts`
- `tests/cloud-sync.test.ts`
- `tests/cloud-ui.test.tsx`
- `tests/helpers/cloud.ts`
- `vite.config.ts`
