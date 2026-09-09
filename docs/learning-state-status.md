# Step 3 — Learning state and local persistence

Status: IN PROGRESS. Step 4 is not started.

## Baseline

Started from clean `4594fd3`. Before edits, content validation, generated navigation check, all **230 tests in 8 files**, typecheck, and production build passed. Node 24.19.0, pnpm 11.19.0. The subsequent dependency-inspection command was blocked by the sandbox's pnpm store access; this was not a build/test failure and is being retried with appropriate access.

The immutable v1.0.1 pack, Step 1 gates, generated navigation, existing 230 tests and Assembly implementation are preserved. Student schema is separate from academic schema 1.1.0. No grading, mastery, readiness or Step 4 feature is authorized.

## Resumable checkpoint

Baseline inspection complete. Implementing bounded contracts, native IndexedDB repository and generated references before UI integration. Final verification and acceptance evidence are pending; no unexecuted check is PASS.

## Implementation checkpoint and adversarial self-review

Contracts, deterministic student reference projection (69,985 bytes), native IndexedDB repository, resume and backup UI implemented. Initial full verification: 290 tests passed, typecheck and production build passed. Added development-only fake-indexeddb 6.2.5; no runtime dependency.

A separate adversarial **self-review**, not an independent audit, examined request/transaction ordering, immutable submission handling, epoch/revision checks, replacement/recovery scope, untrusted backup validation, UI races and error visibility. Two confirmed UI bugs received failing regression tests **before** fixes:

- `review regression: topic save failures are visible on the topic page`: failed because no alert rendered on topic routes. Moved the storage-error notice into the shared shell.
- `review regression: valid trailing-slash topic routes save canonical identity`: failed because exact pathname matching ignored a valid router URL. Normalize trailing slashes before canonical lookup; never store arbitrary URLs.

The earlier first new-test run exposed a test assertion calling a synchronously validating method as a promise and using an invented topic ID. The API now consistently rejects asynchronously for preflight validation, and that assertion explicitly expects INVALID for MISSING. No baseline test was altered.

Native-browser harness is a separate production-mode artifact under ignored `.verification-dist/`, never part of `dist/`. Browser acceptance remains pending until executed. All generated student references and code are available in Git status for resumption.

Checkpoint update: both review regressions now pass; **292 tests**, strict typecheck and production build pass. No baseline tests changed. Native IndexedDB checks passed in Codex In-app Browser, Chromium **152.0.7977.64**, including controlled request-success/transaction-abort, restore rollback and committed data after actual reload. Production UI at isolated origin `127.0.0.1:4185` passed resume/reload, invalid import alert, explicit replacement confirmation, recovery export, and a real second-tab stale-write rejection. Three Assembly examples and previous/next/run/pause/reset passed. Mobile 390px, tablet 768px and desktop 1280px showed no horizontal page overflow. Final documentation, projection checks and final build/bundle verification remain in progress.
