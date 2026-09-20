# Security Release Gate

A production release is blocked when any of these conditions is true:

- dependency audit reports HIGH or CRITICAL vulnerability
- source or generated-artifact secret scan fails
- hardening validation fails
- a security-critical focused test fails
- GitHub CI fails
- Sites source SHA or Worker digest differs from the release manifest
- packaging accepts stale output, missing inputs, or a dirty checkout

INFO-only findings do not block release. MEDIUM/LOW findings require explicit triage and may block based on demonstrated attack path and owner decision.

Required release evidence:

1. Clean pushed commit and successful CI for its full SHA.
2. Frozen-lock install, typecheck, focused security/auth/backup/sync/hosting tests, hardening, source/artifact secret scan, and dependency audit.
3. Production build with the approved build-variable names present and values withheld.
4. Fail-closed Sites packaging from the clean SHA.
5. Manifest `sourceSha` and recomputed Worker SHA-256 match.
6. Saved Sites version has the same source SHA and no deployment before approval.
7. Explicit owner authorization naming the saved version before deploy.
8. Terminal deployment success plus HTTP, headers, browser, and Worker-error checks.

Current automation covers immutable Actions, frozen lockfile install, typecheck, full tests, and build. The hardening/build path performs source and artifact scans; packaging tests cover stale staging and provenance. Live provider settings, owner approval, and post-deploy checks remain procedural controls.
