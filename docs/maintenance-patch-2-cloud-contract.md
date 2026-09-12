# Maintenance Patch 2 — cloud contract acceptance

Current completed acceptance: [final mobile acceptance](maintenance-patch-2-final-mobile.md), gate PASS. The details below are the preserved pre-deployment record.

This is the preserved **pre-deployment** record. The approved migration has since been deployed; see [deployment and live acceptance](maintenance-patch-2-deployment-acceptance.md) for the current FIX NEEDED gate and the remaining Account/Profile visual failure.

2026-09-12. Final gate: **FIX NEEDED**. Local validation passes. The corrective migration has **not** been applied remotely; post-deployment cloud and authenticated UI acceptance are still required. No final acceptance commit, merge, or push was made.

| # | Requested evidence | Result |
| --- | --- | --- |
| 1 | Starting HEAD | `caedc2767bff83c5634f8f27d9acd1c78fbe3912`, branch `maintenance/dashboard-account-ux`. Existing staged and unstaged Patch 2 work was retained. |
| 2 | Exact 22023 cause | The RPC compares the sorted top-level JSON keys against six pre-Patch-2 fields. An otherwise valid payload containing `upcomingExams` fails this exact allowlist. Reproduced against the historical SQL in local PostgreSQL. |
| 3 | Existing versions | Student/backup schema 3, cloud envelope 1. Starting worktree used IndexedDB 3, but starting HEAD already used IndexedDB 4. The pre-existing local downgrade was incompatible with databases opened by that HEAD. |
| 4 | Student Schema | Remains 3. Optional/defaulted planning data does not change the existing learning record shapes. |
| 5 | IndexedDB | Restored 4, the version already in starting HEAD. DB 3 upgrades without rewriting its existing store, generation, or journal; DB 4 reopens directly. DB 1/2 retain their existing transactional migrations. Regression tests prove existing DB 3/4 exams, recovery and sync metadata survive. Unknown future DB 5 remains rejected without deletion. |
| 6 | Backup version | Remains 3; old omitted fields default to `[]`. Valid exam data survives backup round-trip. Explicit malformed `null` is rejected rather than silently normalized. |
| 7 | Migration | `supabase/migrations/20260912122342_upcoming_exams_cloud_contract.sql`, generated with the official Supabase CLI. Historical migrations were not edited. |
| 8 | SQL semantic change | Only optional upcoming-exam validation and the exact top-level allowlist extension. An early object-type check ensures malformed top-level values return 22023. The request is never augmented or normalized before fingerprinting/storage/acknowledgement. |
| 9 | Old compatibility | Old payloads without the field succeed. A receipt created with the historical SQL is replayed identically after the correction. Application validation leaves old cloud payload serialization unchanged; old backups default safely. |
| 10 | Malformed input | Real local PostgreSQL rejects invalid top-level/collection/entry types, extra/missing fields, more than 50 entries, duplicate IDs, blank/overlong names, overlong IDs, non-string/impossible dates, timestamps and derived fields. Unicode name lengths follow the application's UTF-16 limits. |
| 11 | Focused tests | **190/190 PASS**, 11 files, exit 0. Includes contracts, repository, backup migration, serialization, merge, coordinator, account profile isolation and SQL preservation. Separate PostgreSQL integration: **62 assertions PASS**. |
| 12 | Full Vitest | **90 files / 2,042 tests PASS**, exit 0; no unhandled or asynchronous errors. |
| 13 | TypeScript | PASS, exit 0. |
| 14 | Production build | Full `package.json` build command PASS, including normal Vite guards; exit 0. Existing large-chunk advisory remains; no guard bypass or alternate build configuration. |
| 15 | Hardening/security | `validate:hardening`, `validate:security-final`, `validate:supabase-security`, `validate:sync`, `validate:auth`: all PASS, exit 0. Static checks are not represented as live enforcement. |
| 16 | Deployment | **NOT APPLIED**. Read-only access through the Supabase connector is available for `obaljgxtosxnsljdtjjf`. Its migration-list response is empty; the existing RPC nevertheless exists and its exact function body matches the historical local PT409 correction. Do not blindly replay historical migrations. |
| 17 | Real upcoming-exam cloud sync | **NOT RERUN after deployment**, since no deployment occurred. The live RPC still lacks `upcomingExams`. The previous real 22023 failure is not being called fixed remotely. Local SQL now accepts and stores the new snapshot. |
| 18 | PT409 | PASS in real local PostgreSQL; stale revision leaves the row and receipts unchanged. Live function inspection confirms PT409 is present, but post-deployment live behavior remains pending. |
| 19 | Idempotency | PASS in local PostgreSQL: historical receipts, identical retry, retry after newer writes, and 23505 for operation reuse with changed revision/payload. Remote post-deployment proof pending. |
| 20 | User A | Prior disposable signup/display-name metadata evidence retained. Post-deployment authenticated greeting, avatar, profile and remote exam restoration **NOT RUN** in this acceptance pass. |
| 21 | User B | Local PostgreSQL and application storage isolation PASS. Real second-user identity/exam switching after deployment **NOT RUN**. |
| 22 | Account isolation | Local SQL RLS hides A's snapshots and receipts from B; B gets an independent owner/revision. Direct writes denied. Account database tests preserve separate exam lists. Remote post-deployment isolation pending. |
| 23 | Logout/anonymous | Local profile tests and separate anonymous/account exam storage PASS. Fresh browser contexts exercised anonymous CRUD. Real authenticated logout/login and A/B/A switching pending. |
| 24 | Desktop/mobile | Chromium 151, 1280px and 375px: PASS for anonymous Dashboard, exam add/edit/delete, reload persistence, configured account/signup-name form, keyboard focus, no horizontal overflow and no page errors. Screenshots reviewed. No signup was submitted by this browser check. Authenticated mobile checks remain pending deployment. |
| 25 | Preservation | Assembly runtime/content untouched. Preservation tests and normal guards PASS. Only exact required reviewed hash entries were updated; the new SQL guard verifies its reviewed validation block and exact equality of all remaining SQL with the previous correction. Pre-existing Patch 2 changes remain in the working tree. |
| 26 | Bundle | Cloud and production bundle checks PASS. Compared with starting HEAD: initial JS 503,057 → 507,838 bytes (+4,781), initial gzip 133,244 → 134,731 (+1,487); total assets 1,877,934 → 1,886,505 (+8,571). This includes all outstanding Patch 2 work, not just this correction. No runtime dependency added; SQL/browser test tools were temporary external tools. |
| 27 | Adversarial review | Exact SQL delta checked: signature, SECURITY DEFINER, empty search_path, auth.uid ownership, locks, immutable-history checks, grants, fingerprint, receipts, CAS/PT409 and revision writes are unchanged. Unknown fields and derived UI data remain rejected. Three-way exam merge preserves independent additions/one-sided edits, propagates deletion against an unchanged ancestor and rejects concurrent edit/edit or edit/delete conflicts without mutating inputs. Date validation is timezone-independent. No production Auth/Confirm Email setting was changed. |
| 28 | Git status | Dirty as expected; existing `MM src/accounts/AccountPage.tsx` staging retained. Modified sources/guards/tests and generated bundle reports; new corrective SQL, focused tests, local SQL/browser harnesses and this report remain uncommitted. `.env.local` is ignored and absent from the index. Full final status: `/tmp/p2-cloud-final-git-status.txt`. |
| 29 | Final commit | **NOT CREATED**: deployment, real cloud/A-B/logout checks and authenticated mobile acceptance are still required by the requested commit gate. |
| 30 | Final gate | **FIX NEEDED**, pending approved migration deployment and live acceptance. No Patch 3 or Step 16 work. |

The optional SQL field has exactly the existing shape `{id, name, examDate}`: at most 50 entries, unique nonempty IDs of at most 100 UTF-16 units, nonblank names of at most 120 units, and real calendar dates from `0001-01-01` through `9999-12-31` in `YYYY-MM-DD` form. An explicit empty array expresses deletion. The RPC remains a full-snapshot replacement; omission retains the old payload meaning, with no hidden server-side merge or altered receipt bytes.

Migration SHA-256: `52ff3b67f0ad9c53c2a1e5479b7543f4533e01891ee2b43566bd465c39da07ca`.
Verified current remote function-body SHA-256: `5c22e6cb908a624f5849e817ebb0161efedc119329e65d87116fa5553b6fe380`, identical to the historical local function body. Remote signature, SECURITY DEFINER, empty search_path and authenticated-only execution grants were inspected read-only.

The browser-safe configuration was already restored before this pass. The updated build used it successfully, without printing values. `.env.local` remains ignored/uncommitted. No service-role key, database password, signing secret, or management token was requested or used.

The operator action is to approve applying **only** the new migration to **`obaljgxtosxnsljdtjjf`**, using the available Supabase `apply_migration` mechanism with name `upcoming_exams_cloud_contract` and the exact reviewed SQL file contents. This production action is pending the explicit boundary in request sections 9–10. Afterwards, verify the migration and rerun the disposable live acceptance before making any final commit.

Reproducible local evidence:

- Vitest: `node node_modules/vitest/vitest.mjs run`; final log `/tmp/p2-cloud-final-tests.log`.
- Focused tests: final log `/tmp/p2-cloud-final-focused.log`.
- Build: the complete `scripts.build` command from `package.json`; final log `/tmp/p2-cloud-final-build.log`.
- Named package validation commands and exit statuses: `/tmp/p2-cloud-final-gates.log`.
- SQL: `node tests/sql/upcoming-exams.mjs /tmp/p2-pglite/package/dist/index.js`; PGlite 0.5.8, PostgreSQL in memory, no network or production data. Log `/tmp/p2-cloud-sql.log`.
- Browser: `tests/browser/upcoming-preview.mjs` with the bundled Playwright module and `PLAYWRIGHT_BROWSERS_PATH=/tmp/p2-playwright`. Log `/tmp/p2-cloud-browser.log`; screenshots `/tmp/p2-dashboard-1280.png`, `/tmp/p2-dashboard-375.png`, `/tmp/p2-account-1280.png`, `/tmp/p2-account-375.png`.
- Runtime/package lock files were not changed. A pnpm wrapper attempted an automatic dependency reinstall and aborted before doing so; commands were then executed directly using the existing installed binaries and the unchanged package scripts.

Database-function documentation consulted: [Supabase database functions](https://supabase.com/docs/guides/database/functions), [PostgreSQL JSON operators](https://www.postgresql.org/docs/current/functions-json.html). Verification results above come from this repository and the local/read-only checks, not from documentation assumptions.
