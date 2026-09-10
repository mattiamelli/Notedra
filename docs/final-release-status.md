# Step 15 — Public deployment and final release readiness

**PARTIAL — public acceptance progressed; Confirm Email, hosting headers and server-side SEO/404 gates remain open. No final Step 15 acceptance commit; no Step 16.**

This is the current status. Earlier checkpoints are preserved in [final-release-history.md](final-release-history.md). The continuation started from `f3017bbb495b40bd6ccc99bad5d0f5902adbd445`, with empty status and diff. Step 14 remains accepted. No database migration, Auth setting, RLS policy, schema, grading rule or Assembly engine was changed.

Production origin: **https://delftstudy-assembly.mattiamelli07.chatgpt.site/**. Existing Sites project `appgprj_6aa004e18c4881918fc92e84ebbe989b`, public access, saved version 3 at the start of this continuation. No new Site or provider migration.

## Current gate table

| Requirement | Status | Evidence / scope |
| --- | --- | --- |
| HTTPS, stable origin, homepage | PASS | Fresh TLS-verified public curl and real browser |
| Internal navigation, direct links, nested refresh | PASS | Course, exercise, exam review, Account and Assembly; browser route matrix below |
| Nonexistent application routes | PARTIAL | Browser displays Page not found and noindex; HTTP remains 200 soft-404 |
| Genuinely missing hashed/static asset | PARTIAL — FAIL | `/assets/release-check-missing.js` returns 200 HTML |
| robots.txt | PASS | Actual text/plain, exact allow rule and correct sitemap directive |
| Sitemap format, origin, uniqueness, exclusion, resolution | PASS | 47/47 unique public URLs, valid XML, HTTPS origin, all 200; this does not prove indexability |
| Course title/description/canonical/OG/social metadata | PARTIAL | Correct rendered metadata; generic noindex HTML before JavaScript; see SEO limitation |
| Personal route noindex | PASS | Raw and rendered noindex for Account/Progress/Mistakes/Study Path/Practice/Exams; no learner serialization |
| Favicon and manifest | PASS | Actual SVG and JSON at declared paths; installability was not tested |
| Required HTTP security headers | PARTIAL — FAIL | None of the six required header families is present in sampled responses |
| Supabase Site URL / Redirect URL | PASS — operator-confirmed | Exact values already confirmed saved; no new operator action for these URLs |
| Signup / email confirmation | BLOCKED / INCONSISTENT | Supabase Support ticket SU-469802 |
| A session refresh and manual upload | PASS | Disposable A, actual public UI; Pending → Syncing → Synced |
| B sign-in/logout/session persistence | PASS | Disposable authorized Gmail alias, real public Auth and browser |
| A / B / anonymous profile separation | PASS, bounded UI scope | Cross-profile attempt routes unavailable; anonymous draft preserved; no adopt/copy action |
| B cloud-to-local recovery | PASS after repair | Empty local restore recovered saved answer/exam; exact historical component and rubric now resolve on the real public version 4 |
| Desktop/tablet/mobile smoke | PASS, bounded | 31 route/viewport checks with no horizontal page overflow; not device certification |
| Keyboard/forms/dialogs | PASS, bounded | Visible menu focus, Enter, Escape, form save, exam submission and review; exhaustive focus trapping NOT RUN |
| Browser console | PASS, bounded | No captured warn/error entries on public test tab at review time |
| Core Web Vitals / browser engine numeric version | NOT RUN | Read-only browser API exposes neither navigator nor performance; UA reflector request blocked by client |
| Performance compression and asset sizes | PASS with residual | Live gzip verified; existing >500 kB chunk advisory retained |
| Search Console operator instructions | PASS — prepared | Exact URL-prefix property and verification/submission steps below |
| Search Console verification/submission/indexing | NOT RUN | Requires operator Google account/token; indexing is not promised |
| Custom domain / Safari / Firefox / physical devices | NOT APPLICABLE to this run | No such certification or provider migration claimed |

## Supabase external investigation and URLs

Confirm Email dashboard setting: ENABLED according to project operator.
Effective public Auth behavior/API: still reports mailer_autoconfirm=true.
Supabase Support ticket: SU-469802.
Status: EXTERNAL INVESTIGATION OPEN.

The current continuation did not toggle or work around the setting. The approved B alias also obtained an immediate session without email verification. That observation does **not** count as email-confirmation PASS. Further verification-email acceptance awaits Supabase resolution. The last separate settings GET is recorded in the historical evidence; it is not claimed as a fresh API call in this continuation.

Both **Site URL** and the single production **Redirect URL** are already operator-confirmed as:

`https://delftstudy-assembly.mattiamelli07.chatgpt.site/`

No repeat change is requested. The current signUp adapter relies on Site URL (no emailRedirectTo) and `detectSessionInUrl:false`; return after verification and sign in through `/account`. No invented `/auth/callback` or wildcard is required. Actual confirmation delivery/return remains unverified; dashboard settings were not independently read with privileged access.

## Live HTTP, SEO and privacy

[release-live-http-results.json](release-live-http-results.json) records the fresh 66-response inspection begun `2026-09-10T22:30:45Z` and completed `22:30:59Z` (11 September locally). It contains response metadata, hashes, sizes and timings; cookies, tokens and body contents are not retained.

- robots.txt is real text with `User-agent: *`, `Allow: /` and the exact sitemap URL. It permits crawlers to see page-level noindex, rather than hiding that directive behind Disallow.
- Sitemap XML contains exactly 47 unique URLs: 3 courses, 43 canonical topic overviews, 1 Assembly tool. Every URL uses the production HTTPS origin and returned 200. No account, personal progress, mistake, study-plan, attempt, exam-session, query or fragment URLs occur.
- Rendered `/co`, `/rl`, `/ip` and Assembly acquire public canonical URLs and index,follow. Canonical topic overviews are public; `/learn` and other mode descendants retain conservative noindex in this MVP policy. Personal views and unknown paths remain noindex,follow with no canonical.
- All initial fallback HTML, including courses, is generic and noindex. JavaScript replacing noindex does not establish search readiness: Google may skip rendering a noindex document. See [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- Raw OG/Twitter tags exist but are generic and lack page-specific canonical/og:url. The browser script improves rendered tags; social crawlers that do not execute JavaScript will still receive generic metadata. No social preview image is configured or claimed.
- Favicon `/favicon.svg` and `/manifest.webmanifest` return valid actual assets. Manifest points at the SVG, starts at `/`, and describes an independent study tool. App installation/offline capability is not claimed.
- Metadata describes independent student support. Practice/exam/Progress text explicitly disclaims official TU Delft questions/grades; no official affiliation is asserted.
- Noindex is **not** a security boundary. Auth/RLS protects remote records. Local profiles are unencrypted browser datasets, as the UI explains.
- No Vite development client/react-refresh entry is served by the deployed HTML. The two literal `http://localhost` strings in the initial JS are React Router URL-construction fallbacks, not observed network destinations; no localhost links or runtime redirect was observed. This does not certify unrelated local servers on the operator's machine.

## Hosting security limitation and minimum follow-up

Actual sampled response headers include `server: cloudflare`, `cache-control: public, max-age=0, must-revalidate`, Content-Type and CDN metadata. They do **not** include enforced CSP or report-only CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options/frame-ancestors, or Strict-Transport-Security. Asset gzip is real, but hashed assets receive revalidation rather than the prepared one-year immutable policy.

The generated `_headers` and `_redirects` were not applied by this Sites static deployment. The installed static packaging contract accepts only `directory` and `not_found_handling`; adding undocumented hosting.json header keys is not a supported fix. Setting fallback to none was already tested and broke deep links; that failed deployment was recovered without losing code. This continuation preserves the working SPA fallback.

Missing CSP/frame protection are **unmet release security requirements**, not a cosmetic residual to waive. They do not prove an RLS bypass or an existing XSS exploit. Missing nosniff/referrer/permissions policies are defense-in-depth gaps; absent HSTS does not negate the observed valid HTTPS connection but remains an unfulfilled hardening policy. No ineffective HTML meta replacements were added.

Smallest justified follow-up: obtain a supported Sites edge/static response mechanism for explicit public-document rewrites, application fallback only, genuine asset 404s and actual response headers. If static Sites cannot supply this, use a thin supported Worker/response adapter on the **same Site/origin**, leaving the React application and Supabase unchanged. Validate that provider contract before implementation; no full framework rewrite or hosting migration is justified now. Public SEO, asset 404 and headers remain separate from the Supabase ticket.

## Production browser evidence

Real Codex in-app Chromium browser on the public HTTPS site. Its numeric engine version was not exposed by the available API; the attempted public user-agent reflector was blocked by the client. **Numeric version NOT RUN**, so no exact-version reproducibility claim. No actual Safari/Firefox/physical device/screen-reader certification. No mocked storage was used for the following UI flows.

| Viewport | Routes tested | Observed page widths |
| --- | --- | --- |
| Desktop 1440×1000 | `/`, `/co`, `/rl`, `/ip`, `/co/CO_T01_HISTORY/learn`, `/practice`, `/exams`, `/mistakes`, `/study-plan`, `/progress`, `/account`, Assembly tool | 12/12 scrollWidth = clientWidth = 1440 |
| Tablet 768×1024 | `/`, `/co`, `/practice`, `/exams`, `/progress`, `/account`, Assembly tool | 7/7 = 768 |
| Mobile 390×844 | Same 12 routes as desktop | 12/12 = 390 |

These are mounted-route/layout checks, not exhaustive interactions on every course. Screenshots were visually inspected for desktop Assembly, mobile Assembly and the mobile navigation/submission dialog. Mobile editor has its own horizontal code scroll; the page does not overflow.

Additional actual flows:

- Menu opens with Enter, visible focus ring; Escape closes; choosing Mock Exams closes navigation and opens the setup route. Dialog Escape cancellation and confirmation work. A read-only activeElement observation did not expose reliable focus-trap evidence, so exhaustive trapping is NOT RUN.
- Disposable A: refresh retained identity; wrong answer `00000000` submitted for decimal 45, feedback reference `00101101` with reasoning; retry created a distinct attempt. Sync now acknowledged the history. Sign-out returned to anonymous; A's attempt became unavailable.
- Anonymous test draft `11111111` saved. B did not see that draft or A's attempt; the Copy anonymous history control was not used. B's correct submission `00101101` saved and synchronized. B signed out and signed back in; refresh retained identity and submission. On final sign-out the anonymous draft was still `11111111`, and B's attempt was unavailable.
- B quick CO exam: seed `step15-public-smoke`, one test answer `11010`, three unanswered components. Mobile confirmation dialog showed accurate counts; submitted review showed 2/4 verified objective points and no invented open-answer score. Nested review refresh succeeded.
- B recovery test: synced, exported backup, imported schema-generated empty backup through the normal UI, confirmed reversible local replacement. UI reported restore complete with pre-restore recovery available. Full navigation reopened sync and returned the submitted answer and exam. The expected transient Attempt not found check timed out because data had already returned; it is not counted as an observed empty-state PASS. The returned exam exposed the binding-order bug below.
- Assembly: step changed RSP 0x1000→0x0FF8 with saved RBP, explanation/history; Previous restored 0x1000. Run results: arithmetic RAX=8; stack frame RAX=15 and RSP=0x1000; function call RAX=RBX=7 and RSP=0x1000. No engine change.
- Unknown global/topic routes render Page not found and noindex, with no canonical. Their server status remains 200, a failed HTTP gate.

Fresh RLS SQL mutation probes were not rerun; Step 14's accepted two-user RLS/idempotency/PT409 evidence is preserved separately. UI profile isolation is not presented as a replacement for those SQL checks. Offline network fault injection and a second physical device are NOT RUN; refresh/reconnect and cloud recovery were exercised.

One minor pre-existing UX issue: Pending may retain explanatory text from the previous Synced state. The Pending badge remains correct; no save success is inferred for the new work. No unrelated UI refactor was made.

## Confirmed bug and bounded repair

After cloud recovery, the saved exam showed the historical-version-unavailable alert even though the exact authored bank was present. `src/exams/engine.ts:resolveSession` compared JSON.stringify outputs; JSONB object key ordering therefore made identical ItemBinding values appear different.

A new test file, `tests/exam-cloud-order.test.ts`, reproduced the problem before the fix: 6 failing reordered-binding cases, with 6 negative controls passing across CO/R&L/IP quick/full blueprints. The fix compares all binding fields explicitly, preserves array/component order and count, and mutates no saved object. Negative controls change item/evaluator IDs/versions, weights, evaluation/response types, order and count. All remain rejected. No historical answer or grade is rewritten.

The initial attempt to place tests in the preserved exam-engine test file was rejected by the baseline gate; the tests were moved to their own file, restoring the original tests byte-for-byte. The repair is pinned by an exact before/after hash in `hardening-preservation.json`; exam validation now uses the existing strict beforeHardening mechanism, as other preservation gates do. Published content locks were not regenerated and no broad exemption was introduced. A further baseline gate rejection was resolved through this exact repair pin before rerunning tests.

Targeted regression: **88/88 tests PASS**, 3 files (12 new regression tests, 53 unchanged exam tests, 23 cloud sync tests). Full fresh gates and public repair verification are recorded below when complete.

## Performance and test provenance

Fresh public transfer measurements before the repair: initial module 503,057 decoded bytes / 132,159 transferred gzip bytes; metadata script 13,508 / 2,674; initial CSS 78,672 / 16,865. Total initial JS decoded 516,565, transferred gzip 134,833 (headers excluded). All three fetched assets exactly matched local build SHA-256. These are actual curl responses, not estimated gzip.

Sequential 66-request TTFB: min 0.101333s, median 0.137967s, max 1.508027s. This is one machine and potentially warm CDN cache, **not Core Web Vitals or a field performance claim**. Browser navigator/performance APIs were unavailable in the read-only inspection scope; LCP/INP/CLS and Lighthouse are NOT RUN.

Account/cloud and heavy practice, exam, progress, adaptive, Assembly and course payloads already use lazy loading; existing bundle guards check module ownership. Configured account support loads during app startup by design, even though it is a separate chunk. No obvious low-risk eager-import removal justified a new architecture change. Existing >500 kB Vite warning remains a documented performance residual.

Preserved pre-repair evidence: 1,882 tests / 82 files PASS; production/content build PASS; Java 49 fixtures + 11 assignments / 144 assertions PASS. This continuation freshly passed typecheck, hardening source validation and the 183-file production secret/artifact scan before the repair. Because runtime code then changed, those are not the final repair gates; fresh reruns are required below.

## Search Console instructions — prepared, not performed

1. In [Google Search Console](https://search.google.com/search-console), choose Add property → **URL prefix** and enter exactly `https://delftstudy-assembly.mattiamelli07.chatgpt.site/`. Do not select a Domain property for the provider-owned parent domain.
2. Choose **HTML file** verification and download Google's exact file. Supply that file to this project; place it unchanged in `public/`, rebuild and update the existing Site. Before Verify, fetch its exact root URL and confirm the file's real verification contents, not SPA fallback HTML. Keep the file published afterward. No verification token has been supplied or invented.
3. Click Verify after that file is live. The current hosting serves real static files (robots/manifest prove that path), so this method avoids needing the provider's DNS. [Google ownership guidance](https://support.google.com/webmasters/answer/9008080?hl=en).
4. After server-side noindex/canonical routing is corrected, open Sitemaps and submit `https://delftstudy-assembly.mattiamelli07.chatgpt.site/sitemap.xml`. XML validity now passes, but its course targets are not yet accepted as indexable.
5. Use URL Inspection for `https://delftstudy-assembly.mattiamelli07.chatgpt.site/co`, choose Test live URL, inspect rendered page/HTML, indexing allowance and canonical. Request indexing only once the page is eligible. Repeat for representative topics if useful.
6. The homepage is a personalized dashboard and intentionally noindex. Do not request indexing for `/`, Account, Progress, Mistakes, Study Path or personal practice/exam records. `/co` is the representative main public course page.

No Search Console configuration, ownership verification, sitemap submission or Google indexing is claimed. Google controls indexing; no guarantee is made.

## Separate adversarial self-review

This is a self-review, not an independent audit. Challenged: raw versus rendered SEO, HTTP versus UI 404, sitemap resolution versus indexability, Supabase setting claim versus actual signup, Synced versus email-confirmation acceptance, UI separation versus RLS, local-versus-cloud recovery, key order versus binding values, viewport width versus complete accessibility, gzip transfer versus Web Vitals, and baseline versus fresh test provenance. The cloud binding bug was found through this review and reproduced before repair. Remaining failed/unrun gates are explicitly retained.

## Fresh repair verification / deployment checkpoint

Fresh repair gates completed on 11 September local time:

| Command | Actual result |
| --- | --- |
| `pnpm test tests/exam-cloud-order.test.ts` before repair | 6 FAIL / 6 PASS: defect reproduced, not an acceptance pass |
| `pnpm test tests/exam-cloud-order.test.ts tests/exam-engine.test.ts tests/cloud-sync.test.ts --maxWorkers=2` after repair | 88/88 PASS, 3 files |
| `pnpm test --maxWorkers=2` | **1,894/1,894 PASS, 83/83 files**, 71.49s |
| `pnpm typecheck` | PASS, fresh after repair |
| `pnpm build` | PASS, all inherited content/academic/reference/practice/course/exam/mastery/readiness gates and TypeScript; Vite 12.79s |
| `pnpm check:production-bundle` | PASS, all inherited bundle guards; 183 emitted files secret/artifact scan |
| `pnpm validate:hardening` | PASS, 529 repository / 131 runtime files, Schema3 / IndexedDB3 |
| `pnpm validate:security-final` | PASS, same source scope plus 183 emitted artifacts |
| `pnpm verify:ip-java` | PASS, 49 fixtures and 11 assignments / 144 assertions, OpenJDK21.0.12.1 |
| `git diff --check` | PASS before checkpoint commit |

The original 1,882 tests are preserved; 12 regressions were added. No source pack, full Handoff, privileged key, test harness or source map entered the production artifact. Current module graph remains 503,057 initial JS bytes / 133,244 local gzip; metadata script adds 13,508 bytes as before. Artifact inventory graph reports 1,877,934 bytes and CSS88,955. These inventory totals differ from the full release output and are not CDN transfer measurements.

### Published repair and fresh final verification

Repair source **`d6f4a8644f5cefcaa80518b193383e152afe1dce`**, saved version **4**, version ID `appgprj_6aa004e18c4881918fc92e84ebbe989b~appgver_f693f61594cc81919df066fa488035af`, deployment `appgdep_6aa335d3b7bc8191941780bfba22ef24`. Sites reported succeeded at `2026-09-10T22:57:39.973094+00:00` on the unchanged public URL. Artifact archive hash: `sha256:9fb2a913045c0dcd17d659a32a4cab3229c04fa5d316b2791e194a108d379674`, 184 packaged files including hosting metadata.

The source push was initially rejected twice by automatic approval review because it requested explicit authorization to export versioned repository contents to the registered Git host. After confirming the connector-provided destination and unchanged source packs, the operator explicitly approved that exact push to the existing Sites repository on git.chatgpt-team.site. The push then succeeded. No alternative destination or approval bypass was used.

**Live regression PASS:** reopening the *same already cloud-recovered* B exam on version 4 displayed Encode a signed integer, exact version 1, immutable answer 11010, original 2/4 objective total and explanatory feedback; no historical-unavailable alert. The third open component also displayed its original question, rubric and reference, with Unanswered and no automatic score. No saved records were rewritten to obtain this result. B remained Synced; final sign-out returned to the separate anonymous profile. Viewport override was reset and the public dashboard left open. Final captured browser warning/error log was empty.

[release-live-http-after-repair.json](release-live-http-after-repair.json) records another **66 fresh responses**, `22:58:32–22:58:43 UTC`, after publication. All 47 sitemap URLs still resolve on the same HTTPS origin. Newly published initial JS `/assets/index-Df_r97Yw.js`, CSS and metadata script match the current built hashes; real gzip bytes are unchanged from the earlier measurements. Required headers, raw public canonical/noindex routing and missing-asset 404 remain failed, honestly unchanged by this application repair.

The current metadata, route privacy, artifact comparison, browser fix and documentation claims were checked again after publishing. Final documentation changes do not change the deployed build; the deployment source remains the exact repair commit above, and later documentation-only checkpoints may be ahead of it.

### Remaining before Step 15 COMPLETE

1. Supabase resolves SU-469802 and a fresh disposable signup proves confirmation email delivery/return and required pre-confirmation behavior.
2. The host supplies real CSP/frame protection and the other required response policies. Retest after Report-Only validation and enforcement; do not call absent headers a passing security gate.
3. Public course documents need correct initial indexability/canonical/social metadata, with application-only fallback and real missing-asset 404. Sitemap XML itself is already valid, but public indexing readiness is not.
4. Search Console ownership is an operator task requiring Google's actual verification file; instructions are ready, configuration/indexing not performed. Numeric browser version, field Web Vitals, offline fault injection and exhaustive accessibility remain explicitly NOT RUN, with the bounded smoke evidence above retained.

**Confirm Email is not the only remaining blocker.** No Supabase Site URL/Redirect URL change is currently required. No provider migration, Step 16 or final acceptance commit was made; this is a clean, resumable **Step 15 PARTIAL** checkpoint.

## Three HTTP blockers continuation — report-only checkpoint

Starting HEAD `c81a111a84f30a6acc035463d3096e1d3064d971`; status and diff empty. Fresh live HEAD `/co` at `2026-09-10T23:09:56Z` still lacked the six required header families. No Supabase setting/API/signup was re-diagnosed; SU-469802 remains external.

The installed Sites skill documents both static and standalone Worker ESM deployment on the same project. Its Worker starter returns custom headers/status through `Response`, with embedded assets; its packager accepts `dist/server/index.js` and hosting metadata. The current continuation implements that small response adapter, not a provider or framework migration. Public URL and project ID remain unchanged. `hosting/README.md` documents the separate generated packaging root and reproducible build steps.

Focused tests: **41/41 PASS** (33 HTTP-delivery cases plus the 8 existing release tests). Typecheck PASS. Production build/content gates PASS (Vite7.96s). Production bundle and emitted-asset exclusions PASS (226 frontend files). Generated Worker local smoke covers all three courses, nested lesson, private route and missing JS/CSS/image/global route. Worker is 2,221,768 raw bytes / 520,340 gzip bytes, containing 90 public initial documents and 132 actual frontend assets. The canonical sitemap remains 47 URLs. No `src/` application file, scoring/answer semantics, storage, Auth/RLS, or content version changed. The accepted 1,894-test full-suite result is preserved; it was not unnecessarily rerun for this delivery-only change.

CSP starts Report-Only to inspect real browser compatibility. Local response tests and a supported format are not live capability proof; the same-site deployment and actual HTTP/browser checks are still pending at this checkpoint. Do not claim the three blockers fixed until those live checks pass, and do not claim enforced CSP until its subsequent enforcement phase passes.
