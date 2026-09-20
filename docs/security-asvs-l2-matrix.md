# OWASP ASVS L2-Style Baseline

This is a selective review baseline for Notedra, not OWASP certification. `PASS` means current repository or production evidence exists; `PARTIAL` identifies a real gap; `EXTERNAL VERIFY` requires provider, runtime, legal, or independent testing.

| Area | Status | Evidence | Remaining work |
| --- | --- | --- | --- |
| Architecture and trust boundaries | PASS | `docs/security-threat-model.md`; local/cloud separation in `ConfiguredAccountRoot.tsx` | Revisit when adding APIs or processors. |
| Authentication implementation | PARTIAL | `src/cloud/auth.ts`, `src/cloud/supabase.ts`, auth tests; PKCE configured and URL session detection disabled | No password reset UI, global session management, MFA, or account deletion. Leaked-password protection is disabled. |
| Session management | PARTIAL | Persistent auto-refreshed Supabase session; local sign-out; abort epochs; account-switch tests | Stolen-token revocation and password-reset interaction need external verification. |
| Access control | PASS | Forced RLS, eight owner policies, direct writes revoked, owner-derived RPC; live catalog readback | Synthetic live A/B mutation negatives require isolated accounts. |
| Input validation | PASS | `src/learning/contracts.ts`, cloud validation, bounded identifiers/arrays/strings/payloads | Keep parity between client and SQL contracts. |
| Stored cryptography | NOT APPLICABLE | No custom password or key storage; provider stores Auth credentials | Provider cryptography and backups are external. |
| Error handling and logging | PARTIAL | Generic auth/sync errors; runtime gate rejects debug logging and secrets | Provider log retention/redaction and incident alert ownership need review. |
| Data protection and minimization | PARTIAL | Owner-separated stores; minimal analytics; privacy policy; no person profiles | Local data persists after logout; deletion and provider retention mapping incomplete. |
| Communications | PASS | HTTPS production; HSTS; CSP connect allowlist; Supabase/PostHog HTTPS | TLS/provider configuration is externally managed. |
| Malicious code and dependencies | PASS | Exact versions, frozen lockfile, immutable Actions, audit and secret gates | Independent package provenance review remains periodic work. |
| Business logic and integrity | PASS | CAS, receipts, immutable history, deterministic merge and conflict tests | Production multi-device stress is not run. |
| Files and resources | PASS | JSON-only backup input; 16 MB cap; strict parsing; no executable upload | Browser resource use needs continued hostile-input testing. |
| API and web services | PARTIAL | One bounded authenticated RPC; owner-scoped Data API reads; no direct writes | Rate-limit posture and abuse monitoring are provider/operational questions. |
| Configuration | PASS | Fail-closed Sites packaging, provenance manifest, CSP/security headers, secret scan | Auth settings and provider backup capabilities require dashboard review. |

## Count

- PASS: 8
- PARTIAL: 5
- NOT APPLICABLE: 1
- REQUIRES EXTERNAL VERIFICATION: embedded in 8 rows; no row is upgraded to PASS solely from provider assumptions

## Authentication decisions

Leaked-password protection is supported on Supabase Pro and above. Current advisor state is disabled. Expected impact: leaked passwords are rejected for new credentials and may cause a weak-password response for existing password sign-in. Compatibility: application error handling remains generic, but user-facing recovery guidance should be checked. Rollback: disable the setting in Auth password-security settings. Status: **READY FOR OWNER APPROVAL**, not applied.
