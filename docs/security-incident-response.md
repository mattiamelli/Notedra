# Security Incident Response

## Detection

Monitor GitHub dependency/workflow alerts and CI, Supabase advisors/Auth/database logs, OpenAI Sites deployment and Worker errors, unexpected PostHog behavior, and user reports. Record UTC timestamps and preserve original evidence.

## Classification

Classify as security defect, suspected account compromise, personal-data exposure, dependency compromise, or deployment compromise. Record systems, data categories, users potentially affected, attacker capability, confidence, and ongoing impact.

## Containment

- Stop publication and preserve the current version identifiers.
- Roll back Sites only to a verified saved version with explicit owner authorization.
- Disable an affected integration if that reduces harm.
- Rotate only credentials shown to be exposed; never rotate public client identifiers as if they were secrets.
- Revoke sessions when account compromise is plausible.
- Preserve logs and artifacts before destructive cleanup.

## Investigation

Build a timeline covering detection, first exposure, deployments, Auth events, database/RPC activity, dependency changes, and response actions. Minimize access to user data and record who handled evidence. Do not copy credentials or full learner payloads into tickets.

## Recovery

Patch the root cause, add a regression test, rerun security gates, deploy through source/artifact provenance, verify production, and monitor for recurrence. Do not describe recovery as complete until the affected control is verified.

## Notification checklist

Notification depends on facts, role, contracts, and jurisdiction and requires appropriate legal assessment. For a possible GDPR personal-data breach, promptly record the event, assess risk to individuals, establish controller/processor responsibilities, and obtain advice on supervisory-authority and user notification timelines. The commonly referenced 72-hour GDPR supervisory-authority window runs from controller awareness when notification is required; it does not mean every security bug is reportable.

## Owners to assign before beta expansion

- incident lead and backup
- Supabase, GitHub, Sites, and PostHog account owners
- legal/privacy decision owner
- user communications owner
- evidence custodian and post-incident review owner
