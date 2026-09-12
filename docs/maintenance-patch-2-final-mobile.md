# Maintenance Patch 2 — final mobile acceptance

2026-09-12. Acceptance gate: **PASS**. This report supersedes the earlier pre-deployment and deployment-stage FIX NEEDED reports, retained as historical evidence.

| # | Requested finding | Result |
| --- | --- | --- |
| 1 | Starting HEAD | `caedc2767bff83c5634f8f27d9acd1c78fbe3912`, branch `maintenance/dashboard-account-ux`. Existing Patch 2 staged/unstaged work retained. |
| 2 | Root cause | Reproduced with a disposable signed-in user at 375px and 1280px. AccountPage omitted the display name at both widths. Desktop only appeared correct because AppShell showed the name in the header. The existing 650px responsive rule hides the header text on mobile, exposing the omission. No stale Auth binding or second mobile component. |
| 3 | Exact fix | Add the existing `account.state.user.displayName`, trimmed and rendered as escaped React text, above the email in the shared AccountPage profile section. Render only when present/nonblank. No CSS change. |
| 4 | Files changed in this UI pass | `src/accounts/AccountPage.tsx`; its exact entry in `scripts/hardening-preservation.json`; new `tests/account-display-name.test.tsx`; disposable reproduction/acceptance harness `scripts/patch2-mobile-ui.mjs`; this report and supersession notes; generated bundle reports refreshed by the existing production-bundle command. The final commit also includes previously validated outstanding Patch 2 work. |
| 5 | Focused tests | **78/78 PASS**, 7 files, exit 0. Four new regression cases cover profile identity across account switching/logout, canonical greeting/avatar, anonymous fallback, and countdown controls/text. Profile regression reproduced red before the fix. Existing account, Dashboard and upcoming-exam checks remain green. |
| 6 | TypeScript | PASS, exit 0. |
| 7 | Production build | Complete standard package build PASS, exit 0, with all normal guards. Existing large-chunk advisory remains; no alternative configuration. |
| 8 | Hardening/security | `validate:hardening`, `validate:security-final` and `check:production-bundle` PASS, exit 0. `.env.local` remains ignored/uncommitted. |
| 9 | Desktop smoke | Authenticated Chromium at 1280px PASS: profile name/email/state, greeting/avatar, exam add/edit/delete, keyboard focus and Account navigation. Screenshot reviewed. |
| 10 | Mobile Account/Profile | Authenticated Chromium at 375px PASS: full name visible in the profile itself, email wraps, account and sync state visible, actions usable. Screenshot reviewed. |
| 11 | Mobile Dashboard | PASS after explicitly waiting for authenticated greeting, Upcoming Exams and fonts. Fully rendered screenshot reviewed; no loading-state screenshot substituted for acceptance. |
| 12 | Overflow/layout | No horizontal document overflow or overlapping Dashboard panels at either tested width. Screenshots show readable, unclipped text and aligned header/avatar. Existing desktop sidebar layout preserved; mobile uses the existing collapsed navigation. |
| 13 | Display-name source | Canonical existing AccountContext/Auth displayName only; no new profile storage, email-derived identity, raw metadata, IDs, tokens or secrets displayed. |
| 14 | Greeting/avatar | PASS: `Hello Mobile Acceptance` and avatar `M` in the authenticated browser. Unit regression also checks accented `É` and anonymous `DS` fallback. |
| 15 | Countdown | Mobile and desktop add/edit/delete PASS; `2 DAYS` critical urgency readable; keyboard Tab moves from exam name to date; Account/Profile reachable from Dashboard. |
| 16 | Preservation | Only the AccountPage preservation hash changed in this UI pass. Guards stayed enabled. Assembly code, cloud SQL/migrations, RLS, ownership, CAS, PT409, receipts, Auth settings, Confirm Email and persistence architecture were not changed in this pass. |
| 17 | Final git status | Final acceptance commit collects the reviewed outstanding Patch 2 files. Post-commit status/hash are reported in the completion message; `.env.local` is excluded from the index. |
| 18 | Final commit | One final acceptance commit, `fix: finalize mobile account ux`; no merge or push. Its exact hash is provided in the completion message to avoid a self-referential commit hash in this file. |
| 19 | Final gate | **PASS**. No Patch 3 or Step 16. |

The previously verified **90-file / 2,042-test full suite** is retained as allowed by this request. It was not rerun for this one-line presentation change; current focused tests, TypeScript, full production build, security and real authenticated desktop/mobile checks provide the narrow regression evidence. The new four cases are not misreported as a newly run full-suite count.

Previously accepted real cloud results remain valid: deployed migration, valid/invalid/old snapshot handling, idempotency, PT409, RLS, A/B/A switching and anonymous/account separation. No new cloud-contract deployment or configuration change was performed. A new disposable account was used for before/after UI reproduction and signed out afterwards. No real learner data was used.

Adversarial review: the profile is shared across widths, so no mobile-specific identity branch was introduced. Account switch/logout tests clear the previous name/email, and the browser confirms logout removes the name. Existing paragraph wrapping handles narrow layouts without changing other content visibility. The UI addition is text-only and has no effect on storage, Auth calls or synchronization. Historical migrations and Assembly files have no new changes. The exact preservation guard continues to pass.

Evidence: `/tmp/p2-mobile-test-red.log`, `/tmp/p2-mobile-focused.log`, `/tmp/p2-mobile-build.log`, `/tmp/p2-mobile-gates.log`, `/tmp/p2-mobile-ui.log`, `/tmp/p2-mobile-ui-results.json`. Chromium version: `151.0.7922.34`; viewports: 375×900 and 1280×900. No physical-device, Safari or Firefox coverage is claimed.

Screenshots: `/tmp/p2-mobile-before-375.png`, `/tmp/p2-mobile-before-1280.png`, `/tmp/p2-mobile-account-375.png`, `/tmp/p2-mobile-account-1280.png`, `/tmp/p2-mobile-dashboard-375.png`, `/tmp/p2-mobile-dashboard-1280.png`.
