# Data Subject Request Readiness

This is an operational checklist, not legal advice.

## Intake and identity

Record the request, jurisdiction, deadline owner, identity-verification method, systems searched, decisions, exports, deletions, and response. Do not ask for more identity data than necessary.

| Request | Local browser data | Supabase | Analytics | Hosting/operations |
| --- | --- | --- | --- | --- |
| Access | User can export current profile; support cannot remotely read a device | Auth profile and owner snapshot/receipts require authenticated/admin process | Events are not linked through `identify`; assess provider search feasibility | Review only if logs can be associated lawfully and reliably |
| Correction | User can change display name and replace local state through confirmed restore | Profile update exists; study correction follows immutable-history rules | Usually not account-addressable | Correct operational records only where appropriate |
| Deletion | Browser storage removal is manual; no in-app account action | No end-to-end self-service flow; Auth deletion/cascades need privileged process | Cannot promise retroactive account deletion for anonymous events | Provider retention/legal obligations may apply |
| Export | JSON backup exists for current study profile | Ensure cloud is synced before export; Auth metadata export is separate | Explain non-identifying event model | Provider exports are case-specific |
| Objection/restriction | Stop using optional features locally where feasible | Suspend processing only through an approved operational procedure | Disable future analytics where legally/operationally required; assess existing retention | Record provider instructions and limitations |

Never tell a requester that "everything" was deleted unless every applicable system and legitimate retention exception was checked.
