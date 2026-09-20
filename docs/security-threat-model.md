# Notedra Security Threat Model

Status: repository threat model for production revision `98e148e57649c4e132cbe6e94c5de6c31939b14c`. This is not a certification or penetration test.

## Scope and assets

Assets are local and cloud study state, immutable attempt and exam history, recovery copies, account sessions, profile metadata, Supabase data, PostHog product events, deployment configuration, release artifacts, and source provenance.

Trust boundaries:

- browser to Supabase Auth, Data API, and `sync_learner_snapshot`
- browser to PostHog EU ingestion
- anonymous IndexedDB profile to authenticated account profile
- local IndexedDB to imported JSON backup
- device A to cloud snapshot to device B
- GitHub source to CI to OpenAI Sites artifact and deployment
- route, form, exercise, Assembly, Java, and backup input to React rendering

Actors are an unauthenticated remote attacker, malicious authenticated user, stolen-session holder, malicious backup author, compromised dependency or CI action, shared-device user, and accidental operator.

## Threat register

| Threat | Likelihood | Impact | Existing mitigation | Residual risk / recommended control |
| --- | --- | --- | --- | --- |
| Cross-account cloud access (IDOR) | Low | High | Forced RLS; eight `auth.uid() = user_id` policies; direct writes revoked; RPC derives owner from `auth.uid()` | Live synthetic A/B write and delete negatives require an isolated test environment. Repeat after every SQL change. |
| Privilege abuse through `SECURITY DEFINER` RPC | Low | High | Execute limited to `authenticated`; null owner rejected; empty `search_path`; bounded schema; owner-scoped locks and queries | Advisor warning is expected but important. Keep the function narrow and review every replacement migration. |
| Stolen refresh token | Medium | High | Supabase session lifecycle, local sign-out, RLS owner binding, account-specific IndexedDB | Local sign-out does not globally revoke other sessions. Document revocation response and consider short-lived sessions/MFA for higher-risk use. |
| Shared-device disclosure after logout | Medium | Medium | Account-specific databases; signed-out data hidden from the app; messaging says local data remains | A local OS/browser user can inspect storage. Add an owner-approved explicit "Remove local data from this device" action, never implicit cloud deletion. |
| Malicious backup import | Medium | Medium | 16 MB limit; strict schemas; closed object fields; bounded arrays/strings; canonical IDs; version/fingerprint checks; confirmation before replace | Continue hostile parser tests; browser resource exhaustion below 16 MB remains possible but bounded. |
| XSS through imported or authored strings | Low | High | React text rendering; static source gate rejects unsafe HTML APIs, script URLs, `eval`, and `Function`; CSP blocks inline scripts | External browser testing remains required; keep URLs and any future rich text explicitly validated. |
| Sync replay/race or history rewrite | Medium | High | Stable operation UUIDs, payload hash receipts, CAS, per-owner advisory lock, immutable history checks, generation-aware local transactions | Production multi-device stress remains unexecuted without isolated accounts. Maintain deterministic merge tests. |
| Compromised dependency or CI action | Low | High | Exact dependency versions, frozen lockfile, immutable action SHAs, read-only workflow token, non-persisted checkout credentials, audits | Registry/package provenance and maintainer compromise remain external risks. Review dependency changes and install scripts. |
| Stale or misattributed Sites artifact | Low | High | Clean-checkout packaging, stale staging deletion, source SHA and Worker digest manifest, saved-version/deployment separation | Keep manifest verification and owner authorization mandatory for every publish. |
| Operator error or bad release | Medium | Medium | CI, version history, provenance, rollback procedure, HTTP checks | Rehearse rollback without deployment and preserve an incident timeline. Database restore is provider/plan dependent and unproven. |
| Analytics privacy leakage | Low | Medium | Explicit allowlisted events, no identify/autocapture/replay, person profiles disabled, EU endpoint, GeoIP controls | Transport IP can reach provider infrastructure; retention and contractual terms require provider review. |
| Account deletion inconsistency | Medium | Medium | Auth user FK cascades cloud tables if an administrator deletes the Auth user | No user-facing deletion backend or verified session-revocation lifecycle exists. Implement only after owner approval and isolated testing. |

## Security objectives

1. A browser identity can read and mutate only its own cloud study state.
2. Submitted history cannot be silently deleted or rewritten by ordinary sync.
3. Local profiles never mix across account changes.
4. Imported data is inert, bounded, schema-valid data.
5. Builds and deployments are attributable to one pushed source revision.
6. Logs and analytics exclude credentials and unnecessary learner content.

## Residual boundaries

Client-side storage is not encryption against another OS user. Supabase, PostHog, GitHub, OpenAI Sites, and Cloudflare controls are partly provider-managed. Independent penetration testing, real multi-device testing, session revocation behavior, and provider backup restore remain external verification items.
