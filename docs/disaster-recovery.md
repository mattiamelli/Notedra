# Disaster Recovery

This runbook distinguishes tested release recovery from untested provider/database restore.

| Scenario | Detection | Containment and recovery | Data impact | Verification |
| --- | --- | --- | --- | --- |
| Broken frontend deployment | HTTP/browser checks, Worker errors, user reports | Stop publishing; deploy the last known-good saved Sites version after owner approval | Local/cloud data should remain untouched | Version/SHA/deployment readback, 200/404/405, CSP, browser smoke |
| Corrupted release artifact | Manifest or Worker digest mismatch | Reject packaging; rebuild from a clean pushed SHA | None if gate works | Recompute Worker SHA-256 and compare manifest before saving |
| Supabase outage | Auth/sync errors and provider status | Keep local-first mode; do not reset or overwrite; retry manually after recovery | Unsynced local work remains device-dependent | Sync known test profile and confirm revision/receipts |
| Accidental client data corruption | Contract/merge errors or user report | Stop affected release; preserve recovery copy; restore only a synthetic or user-confirmed backup | Potential local profile impact | Exact export/restore comparison and generation checks |
| Bad sync release | Conflict spike or immutable-history failure | Roll back frontend; disable further release; preserve pending operations | Cloud writes already accepted need case-specific analysis | Isolated A/B and multi-device acceptance before re-release |
| Credential leak | Secret scanner/provider alert | Revoke/rotate the specific secret, inspect use, rebuild artifacts | Depends on credential capability | Confirm old credential invalid and new path works |
| Malicious dependency | Advisory or integrity anomaly | Freeze releases; remove/pin dependency; inspect lifecycle scripts | Possible build or browser compromise | Clean install, audit, secret scan, full tests and artifact review |

## Sites rollback rehearsal

v23 remains identifiable as the previous saved and deployed version, source SHA `3219f3b22698638474a49643e0ac3414acfe5ea3`. Required Supabase/PostHog build-variable names are present. The procedure in `hosting/README.md` is executable, but no rollback was deployed during this review.

## Database boundary

No production database restore was performed. Supabase backup availability, retention, point-in-time recovery, and restore objectives depend on the active plan and provider configuration. Until a provider-backed restore is rehearsed in an isolated project, database RPO/RTO and restore capability are **UNKNOWN / PROVIDER POLICY REVIEW REQUIRED**.
