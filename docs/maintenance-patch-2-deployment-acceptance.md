# Maintenance Patch 2 — deployment and live acceptance

Historical deployment-stage record. The remaining UI issue has since been corrected and verified: see [final mobile acceptance](maintenance-patch-2-final-mobile.md) for the current PASS gate.

Final gate: **FIX NEEDED**. The approved cloud migration succeeded and the real cloud/A-B checks passed. Final visual acceptance found that the authenticated mobile Account/Profile page does **not display the user's display name**. Per the operator's stop instruction, no further remote changes or final commit were made after this finding.

| Requested item | Result |
| --- | --- |
| Migration applied | **Yes**, only `20260912122342_upcoming_exams_cloud_contract.sql`, to `obaljgxtosxnsljdtjjf`, using `apply_migration` with name `upcoming_exams_cloud_contract`. No historical migrations replayed. |
| Deploy timestamp | Success confirmed at **2026-09-12 12:44:48 UTC / 14:44:48 CEST**. |
| Approved file verified | SHA-256 `52ff3b67f0ad9c53c2a1e5479b7543f4533e01891ee2b43566bd465c39da07ca`, identical to the reviewed/approved file. The exact SQL preservation validator passed immediately before deployment. |
| Exact semantic change | Accept the optional top-level `upcomingExams` field while retaining the exact required legacy fields. Validate at most 50 exact `{id,name,examDate}` entries, unique bounded IDs, nonblank bounded names, real date-only values, and no derived/extra fields. Reject invalid top-level types with 22023. Do not normalize the payload or change receipt bytes. |
| Security/contract preservation | No changes to RLS, ownership, function signature, empty search_path, SECURITY DEFINER, advisory/row locks, CAS/revisions, PT409, receipt fingerprint/idempotency, isolation or unrelated schema/functions. The replacement function body remotely matches the approved local body: SHA-256 `163d24c67183885795c3851fef5bbc0bd9017e51082a281ea6cef68a080e2e99`. Execution grants remain `{postgres=X/postgres,authenticated=X/postgres}`. |
| User A cloud checks | **PASS**: disposable signup/sign-in, persisted display_name, API-created exam, actual browser-created exam, remote persistence, reload and reconnect restoration, greeting and avatar. |
| User B cloud checks | **PASS**: separate disposable signup/display_name, independent empty snapshot, no A snapshots or receipts through RLS, no A exams or identity in the browser. |
| Switch A → B → A | **PASS**: A identity and exams return. |
| 22023 | **Resolved for valid upcomingExams**. Invalid collections, capacity, blank/overlong names, impossible dates and derived fields still produce the expected 22023 rejection. |
| Old format | **PASS**: omitted field accepted without adding it to the acknowledged payload; historical operation replay preserved. |
| PT409 regression | **PASS**: stale CAS returns PT409, creates no receipt and does not change the saved revision. |
| Idempotency | **PASS**: exact retry returns revision 2; historical receipt returns revision 1 after later writes; changed request binding returns 23505. |
| RLS isolation | **PASS**: A/B cross-reads return no rows; direct cross-user update returns 42501. |
| Anonymous/account separation | **PASS**: an anonymous browser exam is absent under A, and returns after logout; authenticated exam and identity disappear. |
| Desktop/mobile | Desktop authenticated actions and identity switching passed. Mobile Account visual acceptance **FAIL**: display_name absent from the account page, despite correct email, avatar and sync state. The mobile Dashboard screenshot captured the loading state, so that screenshot is **not accepted** as final authenticated Dashboard evidence. |
| Full test count | Last full local gate: **90 files / 2,042 tests PASS**, no async errors, exit 0. Preserved from pre-deployment validation; no application code changed in this deployment pass. The suite was not rerun after the stop condition. |
| Other local gates | Last TypeScript, standard production build, hardening, security, cloud/Supabase and bundle checks PASS. Those are retained local results, not substitutes for the failed visual requirement. |
| Final commit | **Not created**. HEAD remains `caedc2767bff83c5634f8f27d9acd1c78fbe3912`. |
| Git status | Dirty Patch 2 tree retained, including pre-existing staged AccountPage changes, validated sources/tests/migration, generated bundle reports, the live acceptance harness and reports. Full status in `/tmp/p2-postdeploy-git-status.txt`. `.env.local` remains ignored and uncommitted. |
| Final gate | **FIX NEEDED**. No merge, push, Patch 3, Auth, SMTP, Confirm Email or other Supabase configuration changes. |

The live harness completed **48 passing assertions** at `2026-09-12T12:47:07.119Z`. Its raw automated result is `/tmp/p2-live-results.json`; its log is `/tmp/p2-live-acceptance.log`. This automated PASS is **not** the final acceptance gate: its account assertions checked email/state and its viewport check did not wait for the mobile Dashboard to finish loading. Subsequent manual screenshot review found the missing profile display-name requirement, overriding the automated result to FIX NEEDED. No acceptance criterion was waived.

Failure evidence: `/tmp/p2-live-account-375.png` shows the authenticated Account/Profile page containing the email and `Synced` status, but no full display name. This contradicts the existing Patch 2 Account/Profile requirement to display both display name and email. `/tmp/p2-live-dashboard-375.png` is a loading-state capture and provides no final Dashboard visual proof.

Disposable accounts were used exclusively. Their SDK sessions and the browser session had already been signed out successfully before manual screenshot review. Test-owned cloud snapshots remain as acceptance evidence; no administrative account deletion or other cleanup mutation was attempted after the stop condition. No personal learner data or privileged credentials were used.

The next step requires operator direction on the remaining Account/Profile presentation defect and then a correctly awaited authenticated mobile check. The deployed SQL was not rolled back or modified again.
