# Sites HTTP adapter

This is a small Cloudflare-compatible ESM response handler for the existing Site. It serves the unchanged Vite build and applies real HTTP policies. It has no database binding, outbound fetch, authentication logic, learner-state access or framework dependency.

The Sites Worker starter documents a default `fetch(request, env, ctx)` export in `dist/server/index.js` and embedded assets. Static Sites configuration did not apply `_headers`/`_redirects`; the Worker makes those responses explicit.

Build and validate the normal frontend first:

```sh
pnpm build
pnpm test tests/hosting.test.ts tests/release.test.ts --maxWorkers=2
pnpm typecheck
pnpm check:production-bundle
pnpm build:hosting
```

`pnpm build` produces and validates the ordinary application build. `pnpm build:sites` is the explicit production path that then packages Sites; `pnpm build:hosting -- --expected-source-sha <full-commit-sha>` can separately verify an already-built production tree. Packaging always deletes stale `.sites-release/` output first and fails non-zero when required production inputs are unavailable. It also requires a clean Git checkout so generated provenance cannot attribute uncommitted bytes to the previous commit.

The ignored packaging root `.sites-release/` contains the generated Worker, copies of this Site's hosting manifest and `release-manifest.json`. The release manifest records only the full source commit, Worker SHA-256 digest, build target and public Sites project ID. Verify its `sourceSha` against the intended commit and recompute `artifactSha256` over `.sites-release/dist/server/index.js` before asking Sites to save a version. After Sites saves the version, record its returned version beside this manifest; Sites remains the authority for the assigned version and deployment ID. Use the Sites package helper with that root; commit/push the **real repository** and save that exact source commit. This is an artifact staging directory, not another project/repository/Site. No source files, secrets or databases are packaged. The builder scans every embedded frontend asset and the generated Worker. The frontend `dist/` remains separate so its existing size/module/privacy gates still inspect only frontend delivery, not a duplicate server wrapper.

The current frontend assets are all UTF-8. A future binary asset fails the build until explicitly encoded; it is never silently corrupted. Generated output must be regenerated after any frontend or hosting change. Source-only remote build fallback must run both build steps and package the staging root; do not assume plain `pnpm build` produces a server entrypoint.

## Rollback rehearsal

Rollback reuses the existing Sites version history; it does not rebuild or change Supabase, PostHog or their build variables. Identify the last known-good saved version and read back its recorded source SHA before taking action. Compare that SHA with the release checkpoint and, where retained, compare the associated Worker digest with its `release-manifest.json`. Do not publish the prior version until the owner explicitly authorizes the exact version and source SHA.

After an authorized rollback, verify the canonical domain and saved Sites domain, HTTP 200/404/405 behavior, CSP and security headers, browser console and asset loading, one anonymous local study flow, configured Supabase availability without mutating user data, and one privacy-safe PostHog event at the EU endpoint. Record the resulting deployment ID and confirm that the expected prior version is live. This procedure is a rehearsal only until an explicitly authorized rollback is actually performed.

`policy.json` selects report-only/enforced CSP. Change this only as part of an explicit verified release. Existing `_headers` supplies the exact security policy; no unsupported manifest keys or fake HTML equivalents are used. Public courses, topic overviews and lessons receive initial public metadata; private modes use generic noindex shell. Sitemap retains the 47 established canonical entries. Unknown routes and missing files return 404; valid personal route shapes preserve client routing and never put their IDs or query state in metadata.
