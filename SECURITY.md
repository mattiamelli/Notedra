# Security policy

The repository is private and is maintained as a student portfolio project. Do not report a suspected vulnerability by committing proof-of-concept credentials or personal data.

For a private report, contact Mattia Melli through the private GitHub repository or the contact details on the maintainer's GitHub profile. Include the affected path, a concise reproduction and the impact, while redacting secrets from the report.

If a credential is ever exposed, revoke or rotate it immediately, then report where it appeared without reproducing its value. Do not rewrite Git history as a first response; preserve evidence and assess every affected credential and deployment.

The frontend accepts only browser-safe Supabase publishable or anon keys. Supabase service-role keys, database credentials and other administrative secrets must remain outside the repository and browser bundle.
