# Service and Subprocessor Inventory

This inventory lists services actually used by Notedra. Legal status, DPA coverage, transfer mechanisms, and contractual roles require owner/legal verification.

| Service | Purpose | Data categories | Known region | DPA/status evidence | International-transfer question | Owner action |
| --- | --- | --- | --- | --- | --- | --- |
| Supabase | Auth and learner sync database | Account identifiers, profile name, study state, receipts | Project is `eu-west-1` | Store current DPA and service-status links | Confirm subprocessors, support access, backups, and any transfers outside EEA | Review DPA, retention, backup/restore, Auth settings |
| PostHog EU Cloud | Privacy-minimized product analytics | Explicit product events; transport metadata | EU ingestion endpoint | Store current DPA and subprocessor links | Confirm storage/support locations and retention | Review project retention and data-processing terms |
| OpenAI Sites / Cloudflare infrastructure | Build artifact hosting and web delivery | Deployment configuration, artifacts, request/Worker logs | UNKNOWN / provider review | Store applicable Sites and infrastructure terms | Confirm hosting/log regions and support access | Obtain current DPA/subprocessor/retention information |
| GitHub | Source control and CI | Source, commits, developer identity, CI logs/artifacts | Provider-managed | Store current DPA/subprocessor links | Confirm organization settings and transfer basis | Review access, audit logs, retention, and branch protection |

No processor should be added to this document merely because it is a possible future choice.
