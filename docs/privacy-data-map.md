# Privacy Data Map

Unknown retention values are intentionally not guessed.

| Data category | Source | Location | Purpose | Retention | Identity link | Processor | Deletion path |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Anonymous local study state | Browser activity/import | IndexedDB | Local learning state | Until browser/user removal | Local profile only | Browser/device owner | Browser storage removal; no current in-app action |
| Account local study state | Browser activity/cloud merge | UUID-scoped IndexedDB | Offline-first account profile | Until browser/user removal | Supabase user UUID | Browser/device owner | Proposed explicit device removal; not implemented |
| Supabase account | Sign-up/profile | Supabase Auth | Authentication and profile | UNKNOWN / policy review | Email and user UUID | Supabase | No current user-facing deletion workflow |
| Synced study snapshot | Sync RPC | Supabase Postgres | Multi-device continuity | Until account/admin deletion; exact policy not documented | User UUID | Supabase | Auth deletion should cascade; end-to-end path unverified |
| Sync receipts/history | Sync RPC | Supabase Postgres | Idempotency and integrity | Permanent while account exists by design | User UUID and operation UUID | Supabase | Auth deletion should cascade; ordinary sync cannot delete |
| Backup files | User export | User-selected filesystem | Portability and recovery | User controlled | Contents may identify study activity | User/device/cloud storage chosen by user | User deletes the file |
| Product events | Explicit allowlisted actions | PostHog EU and random anonymous ID in browser localStorage | Anonymous product usage and same-browser retention measurement | UNKNOWN / provider/project policy review; local ID until site storage removal | Pseudonymous same-browser context only; no account link or `identify` | PostHog | Browser storage removal resets local ID; events are not reliably account-addressable; provider retention applies |
| Source and CI operational data | Developer activity | GitHub | Development and releases | UNKNOWN / provider policy review | Developer identity | GitHub | Provider/account administration |
| Hosting configuration and request logs | Deployments and requests | OpenAI Sites / Cloudflare infrastructure | Delivery and operations | UNKNOWN / provider policy review | Request metadata may include transport IP | OpenAI/Cloudflare as applicable | Provider policy/support process |

The map is operational evidence, not a legal determination of controller/processor roles or GDPR compliance.
