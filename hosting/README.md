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

`build:hosting` produces the ignored packaging root `.sites-release/`, containing only the generated Worker and copies of this Site's hosting manifest. Use the Sites package helper with that root; commit/push the **real repository** and save that exact source commit. This is an artifact staging directory, not another project/repository/Site. No source files, secrets or databases are packaged. The builder scans every embedded frontend asset and the generated Worker. The frontend `dist/` remains separate so its existing size/module/privacy gates still inspect only frontend delivery, not a duplicate server wrapper.

The current frontend assets are all UTF-8. A future binary asset fails the build until explicitly encoded; it is never silently corrupted. Generated output must be regenerated after any frontend or hosting change. Source-only remote build fallback must run both build steps and package the staging root; do not assume plain `pnpm build` produces a server entrypoint.

`policy.json` selects report-only/enforced CSP. Change this only as part of an explicit verified release. Existing `_headers` supplies the exact security policy; no unsupported manifest keys or fake HTML equivalents are used. Public courses, topic overviews and lessons receive initial public metadata; private modes use generic noindex shell. Sitemap retains the 47 established canonical entries. Unknown routes and missing files return 404; valid personal route shapes preserve client routing and never put their IDs or query state in metadata.
