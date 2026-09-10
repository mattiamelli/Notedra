# Step 12 security-focused adversarial self-review

This is a distinct **self-review**, not an independent external audit. It followed the first green implementation (1,841 tests / 71 files and a production bundle build). Final fresh verification followed browser acceptance and the subsequent green full suite.

## Reproduced findings and fixes

| Finding | Reproduction and regression | Fix and result |
| --- | --- | --- |
| Same cloud revision could contain changed valid data | `cloud-sync.test.ts`: “self-review: rejects changed cloud bytes at the same acknowledged revision”; pre-fix sync accepted the injected record. | Compare the whole known snapshot when its revision equals the saved base. Invalid response is rejected before local prepare. PASS. |
| SDK initialization exception removed local learning | `cloud-profile.test.tsx`: “self-review: SDK initialization failure falls back to anonymous local learning”. | Catch initialization failure and retain an explicitly labelled anonymous local profile. PASS. |
| Repeated React setup created duplicate SDK clients | `cloud-client.test.ts`: repeated identical configuration did not return the same adapter/client. | Reuse the SDK client per exact URL/key configuration; dispose each auth subscription independently. PASS. |
| Subscription setup failure could escape as an unhandled rejection | `cloud-auth.test.ts`: injected synchronous adapter subscription exception. | Catch it and publish a local-fallback auth error with no visible account identity. PASS. |
| Missing optional account chunk could prevent local use | `cloud-fallback.test.tsx`: injected lazy import failure. | Optional error boundary and an immediate local-study choice during loading. PASS. The initial test inspected the Suspense placeholder too early; bounded React settling was added. Its first RED output alone was not conclusive failure evidence. The final test verifies actual error handling and retained local content. |
| Repeated configuration guidance cluttered the mobile account page | Real 390 px screenshot; `cloud-ui.test.tsx`: “final-review: configuration guidance is not repeated beside the identical status”. | Render configuration guidance once. PASS in tests and final 390/768/1280 Chromium inspection. |
| A restore during sync stopped safely, but had no continuation action | Existing `cloud-sync.test.ts` already reproduced and verified the preserved pending operation/recovery stop. Final review identified the missing recovery path. | Added an explicitly confirmed comparison, not automatic overwrite: original operation retry, expected restored dataset checked in the same write transaction, then the same conservative merge. Two new storage tests reject conflicting immutable content and a second concurrent restore. Consent/UI test and ninth native browser scenario PASS. |
| A late session restore could override an explicit choice to continue anonymously | `cloud-profile.test.tsx`: “final-review: choosing anonymous study cannot be overridden by a late restored session”; RED showed account A replacing anonymous state after the choice. | Close the account-session controller and keep an explicit anonymous provider until reload. The delayed response cannot switch profiles or discard the editor. Targeted PASS; the complete 32-command acceptance was rerun after this correction. |

RED logs: `/tmp/ds-step12-review-red.log`, `review-red2.log`, `review-red3.log` (each uses the full `/tmp/ds-step12-` prefix), and `/tmp/ds-step12-final-review-red.log`. Green targeted runs: `/tmp/ds-step12-review-green.log`, `/tmp/ds-step12-final-review-green.log`, `/tmp/ds-step12-restore-recovery.log`. The last session-race regression is recorded in `/tmp/ds-step12-late-session-red.log` and `/tmp/ds-step12-late-session-green.log`. Final full results are checked in as `accounts-final-results.json`.

The unchanged navigation regression originally expected nine destinations. Step 12 adds Account as the tenth; its assertion was extended rather than removing a destination/check. All 66 baseline files retain their test counts. No baseline case was skipped.

## Final independent-style verification

Re-read the auth lifecycle, optional-loading fallback, account provider identity keys, sync coordinator, native transaction journal, merge rules, SQL grants/policies/RPC, backup interaction, bundle inventory and Step 12 sections 0–57. Cross-checked claims against fake-storage tests, native Chromium results and actual availability of remote credentials. No external reviewer participated.

Account changes remount the learning provider; token refresh cancels old sync epochs without remounting the exercise tree or losing ephemeral editor text (covered by the configured-profile integration test). A cancelled remote request can still finish at the server; its result cannot be applied under the new identity. The operation receipt makes later reconciliation idempotent. Client-side profile separation is not encryption against OS/browser inspection.

StudentRepository, contracts, PracticeService, exams/evaluation, progress derivation, all published content and Assembly source remain byte-identical to accepted Step 11. The explicit dependency addition is pinned separately; prior dependency entries were not removed or rewritten. No data migration was required. The extra metadata key shares the existing native transaction scope without entering backups.

## Second security-assumption review

| Assumption challenged | Actual policy / evidence |
| --- | --- |
| Client clocks disagree | Clocks never pick a merge winner. Saved common base and revisions determine one-sided changes; divergent workflow changes conflict. Fake two-device review/undo and skew tests PASS. |
| Upload succeeds but acknowledgement is lost | Pending operation is committed locally first. Permanent server receipt binds ID to expected revision and payload hash. Fake and native retry scenarios PASS; remote execution NOT RUN. |
| Two devices edit one draft/review | No silent answer interleaving. Both changed differently relative to base means conflict, even when one revision is larger. Merge tests PASS. |
| Account switches/signs out during a request | Old AbortSignal invalidated; old response cannot acknowledge into new profile. UUID-separated databases and provider keys prevent A history under B. Fake auth/profile/native cancellation PASS. |
| Local data belongs to somebody else | Anonymous history remains separate; copy requires account-specific explicit consent. Account A is never a default import source for B. This cannot prevent an OS user deliberately inspecting local databases. |
| Authenticated cloud data is malformed | Envelope owner/schema/revision and full backup contracts validate before prepare/apply. Same-revision changed bytes are rejected. No grader is invoked. Negative tests PASS. |
| Old app reconnects | Unsupported cloud/student schemas and content fingerprints fail closed. Exact historical versions are preserved without upgrade/regrading. Schema 3/DB 3 preserved; fake/native backup regressions PASS. |
| RLS is missing or misconfigured | The migration enables/forces it and revokes direct writes. Static gate checks eight policies, owner-derived RPC and restricted grants. Client validation is not a substitute for server security. **Live enforcement NOT RUN.** Apply and remotely test the migration before using a real project. |
| Supabase is down/offline for days | Local repositories continue. No app retry loop; failed operations keep stable IDs and require manual retry. Saved history remains bounded by existing capacities. Native failure scenarios and server-unavailable loaded Assembly PASS. |
| Local commit fails after remote success | Active data and acknowledgement journal roll back together; never report Synced. Fake/native abort tests PASS. |
| Backup restore overlaps sync | Ordinary sync stops on generation change. Explicit recovery still checks the confirmed restored dataset transactionally and cannot rewrite submitted evidence. Fake/native recovery PASS. |
| User expects cloud deletion from a small backup | Absence is not deletion. Cloud history may return during merge, with this policy disclosed beside backup guidance. No destructive cloud/account deletion feature. |
| Saved means indestructible | It does not. IndexedDB transaction completion is the local acknowledgement boundary; browser deletion, device failure and some OS failures still require independent backups. |

## Claim-evidence consistency

- **Unit/jsdom/fake-indexeddb:** 131 added tests plus all 1,725 baseline tests; final 1,856 / 74 files. No fake result is called live cloud acceptance.
- **Native Chromium:** nine sync scenarios using actual IndexedDB and deterministic fake cloud transport; native Step 10 nine checks plus one actual reload. Real loaded Assembly continues with the preview server stopped.
- **Production UI:** account local-only behavior, keyboard/mobile navigation, three responsive widths, course lessons, Practice submission, Mistakes, Study Path, Exams landing, Progress and all Assembly examples. Configured account identity/form behavior uses jsdom fakes, not a live account.
- **Remote Supabase / SQL execution / RLS negative requests:** NOT RUN. No credentials/project/CLI/database runtime available. No live ownership or production multi-device security claim.
- **Safari/Firefox, physical mobile hardware, a full OS network disconnect, fresh offline boot/service-worker caching, power loss and real disk quota exhaustion:** NOT RUN. Server-unavailable loaded-tool execution and deterministic transport/storage errors are narrower tests, explicitly labelled.

Final 32-command suite, typecheck/build, trusted Java verification and all earlier integrity/bundle gates passed. Step 13, public deployment, final visual identity work and unrelated refactors were not started.
