# Maintenance Patch 9 — launch readiness

Status: **FIX NEEDED**. The public legal contact is complete. Production still has the external Auth configuration and deployment blockers listed below.

## Decisions

- No analytics was added. DelftStudy has no advertising model and does not need behavioral tracking to launch safely. Suggested future product events remain uncollected until there is a documented purpose and lawful consent or other basis.
- No cookie banner was added. Application code sets no analytics or marketing cookie. Supabase may retain the authentication session, and the hosting edge currently sets a strictly necessary bot-management cookie; both are described in the Privacy Policy.
- The Light palette remains the Patch 8 semantic palette because its measured values closely match the supplied reference: cool `#f0f7ff` page, white cards, navy `#081747`, DelftStudy blue `#0061ed`, CO blue, R&L green, and IP purple.
- HSTS is prepared at one year. `includeSubDomains` and preload are intentionally omitted because the application does not control the shared `chatgpt.site` parent domain.
- The social preview is a 1200×630, 22.4 kB PNG. Its checked-in SVG source preserves reproducibility.

## Verified evidence

- Privacy Policy, Terms of Use, and the application footer consistently use the approved public legal and support contact `notedra.support@gmail.com`.
- Live production redirects HTTP to HTTPS and serves enforced CSP, `nosniff`, strict-origin referrer policy, restrictive Permissions Policy, frame denial, and HSTS.
- Live disposable User A/User B acceptance passed signup, sign-in, snapshots, operation receipts, RLS read/write isolation, idempotency, PT409 stale-CAS rejection, reconnect, sign-out, and account switching. No privileged credential was used.
- Effective Auth settings still return `mailer_autoconfirm: true`; email confirmation therefore remains unresolved.
- The authorized `20260912205044_restrict_rls_auto_enable.sql` source matched SHA-256 `917d2bc07343ff77d8c65270c63f76ca7d7ef05c5a9075a19550b04d4220beab`. Its only operation is `REVOKE EXECUTE` on `public.rls_auto_enable()` from `PUBLIC`, `anon`, and `authenticated`; it contains no table, data, policy, RLS, ownership, CAS, PT409, receipt, account-isolation, or unrelated-function change.
- Supabase applied that single migration at 2026-09-12 19:25 UTC and recorded it as version `20260912192500`, name `restrict_rls_auto_enable`. Post-deploy ACL checks show `PUBLIC`, `anon`, and `authenticated` have no execute privilege, while the function owner retains administrative access. Both learner tables still have RLS enabled and forced, all eight policies remain present, and the application sync RPC remains executable by `authenticated` only.
- The post-deploy security advisor no longer reports `rls_auto_enable`. It still reports leaked-password protection disabled. The operator confirmed that the current project plan does not provide this Pro-only control, so upgrading to Pro or higher is an external launch blocker. The authenticated `sync_learner_snapshot` SECURITY DEFINER warning is intentional: that is the app RPC, and the live tests confirm its ownership, CAS, receipt, and RLS constraints.
- The post-deploy disposable User A/User B run passed signup, sign-in, cloud writes and reads, reconnect, logout, account switching, RLS read/write isolation, operation idempotency, and PT409 stale-CAS rejection. No privileged credential or real learner data was used.
- Dependency audit has no runtime advisory. Updating Ajv 8.17.1→8.20.0 and Vitest 4.0.18→4.1.11 removed the critical and moderate development advisories. One low esbuild advisory affects a Windows development server; DelftStudy deploys static assets from macOS/Linux tooling and does not expose the Vite development server publicly.
- Production-like Chromium covered ten routes in Light and Dark at 1280 px and 375 px, 273 internal links, one H1, labelled controls, duplicate IDs, horizontal overflow, and browser errors. Final LCP was 944 ms, CLS improved from 0.2025 to 0.0213, and navigation duration was 155 ms in the local run. INP and field data were not available.
- Initial JavaScript is 516.46 kB / 136.81 kB gzip. Course and exercise banks remain lazy. The complete built asset set is below the preserved 2.3 MB budget.

## Search Console operator steps

Run these only after the Patch 9 artifact is deployed and live checks show the root canonical and `index,follow`:

1. In Google Search Console, add a URL-prefix property for `https://delftstudy-assembly.mattiamelli07.chatgpt.site/` and complete the verification method offered for that host.
2. Submit `https://delftstudy-assembly.mattiamelli07.chatgpt.site/sitemap.xml` under **Sitemaps**.
3. Use **URL Inspection** for the homepage, one course page, and one topic page. Confirm that Google sees the intended canonical and permits indexing.
4. Select **Request Indexing** for those representative pages. This requests crawling; it does not guarantee or prove indexing.
5. Recheck the Page indexing and Core Web Vitals reports after field data becomes available.

The machine-readable 25-item matrix is in `maintenance-patch-9-launch-readiness.json` and is checked by `scripts/validate-launch.ts`.
