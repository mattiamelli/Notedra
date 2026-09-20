# Authentication, Authorization, and Deletion Review

## Authentication

- Sign-up and sign-in use Supabase password APIs. Display name is profile metadata only and is never authorization input.
- The client persists and auto-refreshes sessions. `detectSessionInUrl` is disabled and no Auth callback route exists, so callback injection is not an active surface.
- Sign-out uses local scope. The app hides the old profile immediately and keeps account IndexedDB isolated by user UUID.
- Session events replace the identity, abort old sync work, and remount account storage. Token refresh for the same owner preserves ephemeral editor state.
- Email verification is handled by Supabase when required. Password reset, global session revocation, MFA, and deletion are not implemented in the product.
- CSRF is not a primary control for bearer-token Data API calls; XSS/token theft remains the relevant browser threat.
- Internal `returnTo` rejects external origins, protocol-relative values, backslashes, root, and account loops.

## Live RLS and RPC matrix

| Object | SELECT | INSERT | UPDATE | DELETE | Ownership / mutation path |
| --- | --- | --- | --- | --- | --- |
| `learner_snapshots` | `authenticated`, owner policy | no direct grant | no direct grant | no direct grant | Forced RLS; all policies bind `auth.uid()` to `user_id`; writes occur through RPC. |
| `learner_sync_operations` | `authenticated`, owner policy | no direct grant | no direct grant | no direct grant | Forced RLS; receipts are owner-bound and written through RPC. |
| `sync_learner_snapshot` | N/A | authenticated execute | authenticated execute | no deletion API | `SECURITY DEFINER`, empty `search_path`, rejects null `auth.uid()`, derives owner internally, validates payload, locks per owner, enforces CAS and immutable history. |
| `rls_auto_enable` | N/A | no browser execution | no browser execution | N/A | Administrative function; live ACL is postgres-only. |

Live catalog inspection confirms forced RLS, eight policies, authenticated direct `SELECT` only, and the intended RPC ACL. Supabase advisor WARN `authenticated_security_definer_function_executable` is accepted by design, not a false positive: the RPC must bypass direct-write revocation, but its body is the authorization boundary.

Synthetic cross-user production mutation tests were not run because no isolated credentials were supplied. Static SQL tests and prior local PostgreSQL A/B tests cover the policy contract. Current status: **REQUIRES ISOLATED SECURITY TEST ENVIRONMENT** for fresh live A/B read, update, delete, receipts, and anonymous-negative verification.

## Account and data deletion

Current product capability is incomplete. There is no authenticated user-facing account deletion operation. An administrative Auth user deletion would cascade the two cloud tables through their foreign keys, but session invalidation, partial failure, local cleanup, and user confirmation are not implemented or verified. Analytics events are anonymous and cannot reliably be mapped back to an account for deletion. User-created backup files are outside application control.

Minimum safe design:

1. Explicit destructive confirmation naming cloud account data and optional local-device data separately.
2. Recent reauthentication before a server-side deletion operation.
3. Server derives identity from the session; it accepts no target user ID.
4. Revoke sessions, delete the Auth user through privileged server-side code, and rely on verified cascades for cloud rows.
5. Return an idempotent operation state and surface partial failures honestly.
6. Only after confirmed cloud deletion, offer deletion of the current account's IndexedDB database and account-scoped local preferences.
7. State that downloaded backups and non-identifying aggregate/provider logs may remain under their own retention rules.

This requires privileged backend/Auth work and destructive local semantics: **OWNER APPROVAL REQUIRED** before implementation.

## Shared-device design

Logout currently ends the local session but intentionally preserves the isolated account database. The preferred addition is a separately confirmed **Remove local data from this device** action scoped to the current local account database. It must never call cloud deletion and must verify IndexedDB removal. This is a proposal only: **OWNER APPROVAL REQUIRED**.

## Session and account abuse cases

| Case | Expected safe behavior | Current evidence / gap |
| --- | --- | --- |
| Stolen refresh token | Revoke affected sessions, preserve evidence, require fresh authentication | Local sign-out does not revoke other devices; provider behavior and an operator revocation procedure require external verification. |
| User A signs out, then user B signs in | A's local database is never mounted for B; pending A sync is aborted | UUID-scoped databases, identity epochs, remount and account-switch tests provide repository evidence. |
| Password reset while another session exists | Old sessions follow the configured Supabase revocation policy and cannot cross account boundaries | Password reset is not implemented; revocation behavior is **REQUIRES EXTERNAL VERIFICATION**. |
| Revoked or deleted account reconnects | Cloud access fails closed; unsynced local data is not silently uploaded under another identity | RLS binds writes to `auth.uid()`; deleted-account and stale-token behavior need an isolated Auth test environment. |
| Offline device reconnects after deletion | It cannot recreate the deleted Auth identity or write owner data; local remnants remain explicitly local | No deletion workflow exists, so end-to-end behavior is unverified. |
| Cloud profile changes while a device is offline | CAS detects stale state and deterministic merge preserves immutable history | Unit/integration tests cover CAS, receipts and merge; production multi-device stress is not run. |

## Multi-device security test plan

Run only in a resettable non-production Supabase project with two synthetic accounts and two independent browser profiles.

1. Seed account A with a known snapshot and receipt set; verify account B and anonymous clients cannot read or mutate either table or invoke a successful owner mutation for A.
2. Connect devices A1 and A2 to account A, take both offline, create distinct immutable attempts, then reconnect A1 followed by A2.
3. Verify stale CAS detection, deterministic merge, preservation of both attempts, stable operation receipts and idempotent replay.
4. Reverse reconnect order from the same seed and compare the canonical result.
5. Export A, mutate only the local synthetic profile, restore the export, and compare the complete validated backup state.
6. Sign out A on one device, sign in as B, and verify A's database, pending operations and recovery history are inaccessible.
7. Revoke A's sessions and verify both devices fail closed without losing or relabeling local state.

No production account or real learner data may be used. Status: **REQUIRES ISOLATED SECURITY TEST ENVIRONMENT**.
