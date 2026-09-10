# Step 15 historical checkpoints

Historical evidence only; see final-release-status.md for current acceptance.

# Step 15 — Public deployment and search readiness

**PARTIAL — baseline is now public; SEO/hosting correction prepared locally. Live email-confirmation evidence conflicts with the operator-confirmed setting. Final production acceptance remains open.**

## Baseline and hosting

On 2026-09-10, `git rev-parse HEAD` returned `83fa10af0a7cdccd651d8b0779f051ec139f0392`; both `git status --short` and `git diff` were empty. Step 14 remains accepted. Its 1,874 tests / 81 files and 37 gates are historical baseline evidence, not fresh Step 15 results.

The existing `.openai/hosting.json` selects Sites project `appgprj_6aa004e18c4881918fc92e84ebbe989b` and static output `dist`. Sites confirmed owner access, no prior version/deployment, and an owner-only custom access policy. This identity was preserved. No account or domain was created or purchased.

The accepted source commit was pushed to the existing Sites source repository. Version 1 (`appgprj_6aa004e18c4881918fc92e84ebbe989b~appgver_663411d80594819194119df6e3e71d12`) holds the existing accepted build, packaged as 130 files. A private baseline deployment was started to establish the real hosting origin before production Auth configuration. It is not the public Step 15 release.

## Readiness inspection and implementation plan

1. Reuse Sites and verify actual HTTPS, headers, asset 404s, caching and SPA fallback. Do not infer these from a successful upload.
2. Add a release metadata/indexability layer with deterministic public URLs once the real origin is known. Use route-specific HTML/head metadata and safe SPA navigation updates; retain the existing visual design and study logic.
3. Generate robots and sitemap from public routes only. Keep learner IDs, answers and summaries out of generated files. Test URL generation, XML escaping, private-route exclusion and missing-asset behavior.
4. Configure Supabase production URL and email policy through the project operator; test with disposable accounts and real verification email delivery.
5. Publish the final source/build, run the complete release regression gate and public Chromium desktop/tablet/mobile acceptance, then perform a separate adversarial self-review and claim/evidence check. Commit the final accepted release only when its gate is complete.

The Vite build already performs trusted-content and preservation checks, uses hashed assets and a separate Supabase chunk, and does not enable production source maps. `index.html` has a generic description, title, viewport, theme color and SVG favicon. Route titles update in AppShell. Canonical links, Open Graph/social metadata, manifest, robots, sitemap and route-specific indexing rules are not implemented yet. The existing report records initial JS 503,057 bytes / 133,244 gzip; this is not a measurement of public transfer compression or Core Web Vitals.

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are allowed by the existing build guard. `.env.local` stays ignored. No admin, service-role, database or management credential is needed for this release. Learner persistence, RLS, CAS and grading are unchanged.

## Planned route policy

| Actual route | Planned indexing |
| --- | --- |
| `/`, `/dashboard` | Noindex: personalized dashboard; `/dashboard` redirects within the app to `/` |
| `/co`, `/rl`, `/ip` | Public course pages, indexable |
| Canonical course topic Overview/Learn pages | Public authored study content, indexable with exact canonical IDs |
| `/co/CO_T06_ASSEMBLY_X86_64/visualizer` | Public tool description; never serialize editor drafts |
| `/account`, `/progress`, `/mistakes`, `/study-plan` | Noindex; user-specific state |
| `/practice` and descendants; `/exams` and descendants | Conservative noindex, including attempt/session/review IDs |
| Unknown routes | Noindex; missing static files must return actual HTTP 404 |

There is no standalone `/courses` route; the dashboard links to the three actual course routes. Noindex is not access control. Crawlers must be able to see the noindex response; do not hide a noindex directive behind robots disallow. See [Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Operator boundary: production Auth

Once the provider returns the stable origin, use the configured project's Supabase Dashboard:

1. Authentication → URL Configuration: set Site URL to the exact canonical HTTPS origin. Set only the exact intended production callback/return URL; no broad wildcard. Remove temporary localhost entries once development no longer needs them.
2. Confirm Email: the operator has now confirmed that it was manually re-enabled under Authentication → Sign In / Providers → Email. Do not request or perform this change again. The earlier read-only `mailer_autoconfirm: true` result predates that confirmation and is historical. Actual production email delivery remains to be tested.
3. Review production SMTP/email delivery in the Dashboard. Keep SMTP credentials in Supabase only. Provide two disposable inboxes under operator control for the verification flow; do not disable confirmation merely to simplify tests.
4. Confirm the saved settings before they count as complete. Do not supply privileged credentials in this repository or task.

[Supabase's configuration documentation](https://supabase.com/docs/guides/auth/general-configuration) locates Confirm Email in the email provider settings. Its actual saved state and email delivery require operator evidence and a production flow test.

## Search Console handoff

After public release, add the exact HTTPS origin as a URL-prefix property in Search Console. Verify ownership using a supported method (an exact HTML verification file can be added to the public build without embedding learner data). Submit `sitemap.xml`, inspect a public course URL such as `/co`, run the live URL test and request indexing if eligible. Inspect the rendered page and canonical URL. Search Console setup and observed Google indexing are separate outcomes; neither is currently verified or promised. See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Evidence status

| Check | Status |
| --- | --- |
| Exact starting HEAD and clean baseline | PASS |
| Existing Sites identity and source push | PASS |
| Sites baseline deployment and HTTPS response | PASS — deployed; unauthenticated HTTP 401 |
| Anonymous public accessibility | NOT MET — Sites custom owner-only policy |
| Confirm Email enabled | PASS — operator-confirmed; setting not changed by the agent |
| Production Supabase URL and SMTP delivery acceptance | NOT RUN |
| Production signup, sign-in, sync, account isolation | NOT RUN |
| Public deep links, refresh, missing asset 404 | NOT RUN |
| Production headers, caching and compression | NOT RUN |
| SEO implementation and published robots/sitemap | NOT RUN |
| Public desktop/tablet/mobile, keyboard and dialogs | NOT RUN |
| Fresh full Step 15 tests/build/security/Java | NOT RUN |
| Final adversarial review and claim/evidence check | NOT RUN |
| Search Console ownership/submission/indexing | NOT RUN |
| Custom domain | NOT APPLICABLE: provider origin is sufficient |

## Resumable operator checkpoint — 2026-09-10

The private baseline deployment ID is `appgdep_6aa31e4d313881918d21dfd4c2d44939`. Latest observed status: `publishing`, URL `null`, failure message `null`, provider update `2026-09-10T21:23:35.837986+00:00`. This is an in-flight operation, not a failed or successful public release. Resume by checking this exact deployment ID; do not upload/deploy the same baseline again or create a replacement Site. No access-policy change was made. Even after this private deployment succeeds, anonymous public accessibility must be configured and verified before public release acceptance.

The immediate dependency is completion of the existing Sites publishing operation. No further Confirm Email action is required. Production Site URL and redirect changes must wait for a verified stable provider URL; do not guess the URL from the slug. If publishing remains stalled, ask Sites support to inspect deployment `appgdep_6aa31e4d313881918d21dfd4c2d44939` in project `appgprj_6aa004e18c4881918fc92e84ebbe989b`; there is no reported terminal error to fix locally. No dashboard/admin access was requested.

Fresh `validate:security-final` passed: 523 repository files, 131 runtime files, 129 emitted artifacts; schema/IndexedDB remain 3. `git diff --check` passed. No runtime or build source was changed, and no new full Vitest/typecheck/Java run is claimed. HEAD remains the accepted Step 14 commit; the only local addition is this uncommitted status document. The complete public acceptance gate, SEO implementation and final release commit remain open.

## Successful baseline deployment — latest evidence

This section supersedes the earlier publishing checkpoint. The same deployment completed successfully at `2026-09-10T21:30:31.539234+00:00`. Sites returned the exact URL:

`https://delftstudy-assembly.mattiamelli07.chatgpt.site`

No new deployment was created. A fresh Sites lookup confirmed `access_mode: custom`, with only the owner allowed. An unauthenticated HTTPS GET at `2026-09-10T21:41:48Z` returned HTTP/2 401, HTML, `cache-control: no-store` and `referrer-policy: no-referrer`. TLS verification succeeded without disabling certificate checks. These are access-gateway response headers, not evidence that application security headers, routing or public page content pass. Public access remains a separate release requirement.

### Exact Supabase operator configuration

1. Open the existing Supabase project, then Authentication → URL Configuration.
2. Set **Site URL** to `https://delftstudy-assembly.mattiamelli07.chatgpt.site/` and save.
3. Under **Redirect URLs**, add the single exact URL `https://delftstudy-assembly.mattiamelli07.chatgpt.site/` and save. No wildcard or invented callback path is needed. Remove obsolete localhost/preview entries when no longer used; retain any genuinely required development entry until its use ends.
4. Leave **Confirm Email enabled**. It has already been re-enabled by the operator; no further change was requested or made.
5. Confirm that these URL values are saved. Actual verification-email delivery, sign-in and sync will be checked only afterward using disposable accounts.

The current adapter calls `signUp({email,password})` without `emailRedirectTo`; Supabase therefore uses Site URL. It sets `detectSessionInUrl:false`; the accepted flow asks users to verify their email and then sign in through `/account`. Do not add `/auth/callback` or promise automatic sign-in. See [Supabase redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls).

Per the operator-boundary instruction, work stops for configuration confirmation. No application/security architecture or deployment access policy changed. HEAD remains `83fa10af0a7cdccd651d8b0779f051ec139f0392`; only this uncommitted status document changed. Fresh public deep-link, mobile, cloud, SEO and full release regression gates remain NOT RUN. The latest request prohibits creating another deployment; publishing future SEO source changes will need that restriction resolved before a new build can be released.

## Public baseline and release correction checkpoint

The operator confirmed the Site URL and Redirect URL were saved, then explicitly authorized updating the same Site/URL. Sites access was changed to public (policy revision 2, `2026-09-10T21:45:05.731229+00:00`) under the Step 15 public-release request. There was no new Site, URL or learner authorization policy.

Fresh unauthenticated GETs returned HTTP 200 for `/`, `/dashboard`, `/co`, `/rl`, `/ip`, `/practice`, `/mistakes`, `/study-plan`, `/exams`, `/progress`, `/account`, the Assembly tool and `/co/CO_T01_HISTORY/learn`. These establish HTTP fallback only, not full browser acceptance for each route. Browser navigation from Dashboard to Account and an Account page reload displayed the expected local profile/sign-in form.

Confirmed baseline release failures: `/assets/release-check-missing.js`, `/robots.txt` and `/sitemap.xml` returned the SPA HTML with HTTP 200. Canonical, Open Graph, CSP, nosniff, HSTS and robots response headers were absent. These are not passing SEO/security results.

The new build-only `scripts/release.ts` generates 47 public metadata pages (3 courses, 43 overviews, Assembly), sitemap, robots, manifest, route metadata updater, an explicit route rewrite list and headers. `.openai/hosting.json` requests static `not_found_handling: none` so missing assets are not implicitly rewritten. Actual provider handling of `_headers`/`_redirects` must still be tested after publishing. CSP starts Report-Only; HSTS has a cautious 300-second lifetime without preload/subdomains. No study engine, grading, account or storage source changed. The original generic dashboard remains the main page and is noindex.

The existing raw-source guards rejected robots.txt as a text source. They now permit only its exact known contents through `isReleaseRobots`; other text, appended content, archives and source payloads remain rejected. No broad text-file exemption was added.

Local results: 1,882 tests / 82 files PASS (57.12 seconds); standalone typecheck PASS; full production build/content gates PASS; targeted release/IP/enrichment tests 83/83 PASS; Java 49 fixtures and 11 assignments / 144 assertions PASS. Subsequent bundle-guard refinements require affected test reruns before deployment. The app's initial module graph is unchanged at 503,057 bytes / 133,244 gzip; the new external route-metadata script adds 13,508 uncompressed bytes to initial loading. Do not describe the unchanged graph metric as the total new initial JavaScript. Vite's existing chunk advisory remains.

### Production Auth discrepancy — do not overwrite operator settings

From the real public `/account` page, the authorized disposable account A signup produced an immediate authenticated session and `Synced` without a verification-email step. This proves basic signup/session/initial cloud acknowledgement for this test only, not confirmed-email policy acceptance or account isolation. A read-only settings request to `obaljgxtosxnsljdtjjf.supabase.co/auth/v1/settings` returned `mailer_autoconfirm: true`, `disable_signup: false`, `external.email: true`. The operator reconfirmed that Confirm Email appears enabled. Both facts are retained; the mismatch is unresolved. No Auth setting was changed. Do not claim email delivery/confirmation PASS or ask the operator to repeat enabling it without resolving the discrepancy.

The authorized second test identity is the operator-approved Gmail +step15b alias; its signup/isolation tests remain pending. No real learner profile was used or copied.

### Separate adversarial self-review of release preparation

Reviewed route allowlist versus personal IDs, markup escaping, SPA metadata cleanup, literal robots exception, header scopes, static fallback and output-versus-live claims. Removed a proposed `/release/*` noindex header before publication because a provider could apply it to rewritten public documents. No test or live result is claimed for the hosting configuration until it is observed. Review is a self-review, not an independent audit. Full public mobile, confirmed-email, isolation and final release review remain open.

### Pre-publication checkpoint verification

After the exact robots exceptions were complete, the full suite was rerun: **1,882/1,882 tests, 82/82 files PASS**, 57.05 seconds. Typecheck PASS. Production bundle inspection PASS including all inherited course/cloud/visual guards; final artifact scan PASS (183 files). The preserved module graph plus the external metadata script totals 516,565 uncompressed initial JavaScript bytes. Entire generated production output is 1,988,797 bytes (581,197 gzip summed per file; not measured CDN transfer).

On the current public baseline, manual Sync now returned to Synced for disposable A. Account at 390×844 had document scrollWidth 390, with no horizontal page overflow; this is one measured surface, not the full mobile acceptance matrix. Viewport override was reset. The forthcoming source commit is a resumable release-preparation checkpoint, not the final accepted Step 15 release commit.

No Step 16 has been created.

## Live release verification and safe routing recovery — 2026-09-10 22:05 UTC

Version 2, source `17e83a245de152074febb76b6b7f2823a81d4775`, deployment `appgdep_6aa328d2ad608191b843f539800627f9` succeeded at `2026-09-10T22:02:48.062573+00:00` on the unchanged public origin. Fresh TLS-verified curl requests at 22:05:34–35 UTC confirmed the new metadata script on `/` (200), real robots.txt (200 text/plain), real sitemap.xml (200 text/xml), and a missing asset (404). However `/co` and `/account` returned empty 404 responses. The provider did not apply the generated `_redirects`; none of the configured `_headers` security policies were present. Therefore this deployment is NOT accepted. Python's separate certificate store failed issuer validation; curl using the system trust store succeeded without bypassing TLS.

The minimal recovery restores the provider's `single-page-application` fallback in hosting.json, preserving all release files and application code. This prioritizes functional deep links; missing-asset strict 404, server-side public metadata routing and security headers remain unresolved hosting gates. Do not describe fallback restoration as fixing those gates. No application runtime, Auth, RLS or database setting changed. The unchanged compiled assets can be reused because only the provider routing configuration changed. The 1,882-test result above remains the last full local run, not a new run.

The operator again confirmed Confirm Email is enabled in the intended project and no setting was changed. The public API/session discrepancy remains unresolved; email confirmation is BLOCKED, not PASS. A supported provider mechanism for per-route rewrites and response headers, and resolution of the Auth setting discrepancy, are required before final release acceptance. Step 15 remains PARTIAL.

### Confirmed recovery and current stopping point

Recovery source `bd2dbdf17b7a1a8a6806f66cd2c3e54fc3c16058`, saved version `appgprj_6aa004e18c4881918fc92e84ebbe989b~appgver_a7abd6bb236c8191ad277a5dd113c157`, deployment `appgdep_6aa32a32c3208191ae30c571fadc0189` succeeded at `2026-09-10T22:07:54.233846+00:00`. The public URL is unchanged. At 22:08:31–32 UTC, fresh HTTPS returned 200 HTML for `/co`, `/account`, the Assembly tool and `/practice/ds.practice.co-binary-45`; real robots text and sitemap XML remained 200, with exactly 47 sitemap URLs. An actual in-app browser reload of the exercise displayed its title, prompt and Start exercise button. This is a targeted recovery smoke check, not the full browser matrix.

As expected with the recovery fallback, a missing JS asset now returns 200 HTML: strict asset 404 remains FAIL. Required response headers remain absent, and raw public course documents still use generic noindex HTML instead of the generated public metadata page. Client-side metadata alone does not establish search-engine acceptance. No claim of complete SEO or security-header acceptance is made.

After the operator's latest confirmation, a fresh read-only Auth settings GET at `2026-09-10T22:09:49.697886+00:00` on `https://obaljgxtosxnsljdtjjf.supabase.co/auth/v1/settings` again returned `mailer_autoconfirm: true`, `disable_signup: false`, `external.email: true`. The operator reports Confirm Email enabled. Do not toggle the setting or rerun signup to conceal the discrepancy. The operator should supply these exact contradictory facts to Supabase support for the same project; no passwords or privileged credentials are needed. Email-confirmation acceptance and remaining two-account production checks are pending resolution. The last local full-suite result remains 1,882 tests / 82 files; no source-runtime change or new full-suite run occurred during this routing-only recovery.

**Current status: PARTIAL — public routing restored; Auth confirmation discrepancy and hosting SEO/header gates unresolved.** Final production browser/mobile, account-isolation, enforced CSP, Search Console readiness and final release acceptance remain open. Do not submit the sitemap as fully accepted while the server documents remain noindex. All prior source work is preserved; Step 16 has not started.
