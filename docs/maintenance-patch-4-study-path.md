# Maintenance Patch 4 — Study Path completion

| # | Gate | Result |
|---:|---|---|
| 1 | Starting branch | `maintenance/student-ui-cleanup`; isolated implementation branch: `maintenance/study-path-completion`. |
| 2 | Starting HEAD | `50e34595d024456cd39589d28633ddf8a08b59c3`. |
| 3 | Initial git status | Clean. |
| 4 | Root cause | More than one incomplete link: old 10/20/30/45/60 presets, automatic output, unclear refresh CTA, no safe no-evidence session, and a four-item ceiling. |
| 5 | Previous flow | Selector changes immediately recalculated a queue; no course was required; no explicit generation boundary; no evidence produced no session. |
| 6 | Final input flow | Choose one of six durations, a required course, and an optional topic; topic choices follow the selected course. |
| 7 | CTA | `Build Study Session` is primary and disabled only until a course exists or storage is busy. |
| 8 | Generation | New pure deterministic session assembly combines the accepted recommendation output with canonical topic activities. No runtime LLM or new learner model. |
| 9 | Learner signals | Existing saved mistake groups, recency, retries, later successes, reviewed state and deterministic priority remain inputs through the unchanged recommendation engine. |
| 10 | Prerequisites | Only canonical topic prerequisites or the existing evidence-backed skill prerequisite rule can add prerequisite work. |
| 11 | Mistakes | Existing real mistake evidence can add retry/review actions. Empty evidence never creates a mistake action. |
| 12 | UNKNOWN/default | With no evidence, the session starts from actual authored course/topic structure and does not label the learner weak or failing. |
| 13 | Duration | Presets are 15, 30, 45, 60, 90 and `2h+`; `2h+` is deterministically bounded to 120 minutes. Allocation uses five-minute increments and totals the selected budget exactly. |
| 14 | Practice/exam-style | Short sessions favor focused learning/application; 90/120-minute sessions include the existing course mock-exam setup while extended sessions add prerequisite/subtopic depth. |
| 15 | Result | Ordered cards show activity type, time, topic, plain-language reason and direct action. Internal IDs and ranking scores remain hidden. |
| 16 | Next action | Every card links to a real route; a visible `Start first activity` action begins the session. |
| 17 | Error/retry | A failed build is announced, keeps URL selections, shows no stale cards and remains retryable. Input changes invalidate old output. |
| 18 | Persistence | Selections remain URL-only and generated sessions remain ephemeral. No local/cloud schema added. |
| 19 | Cross-course | Focused tests cover CO, R&L and IP with course-specific topic routes and no wrong-course actions. |
| 20 | Files changed | Study Path page; new session assembler; focused tests; exact preservation hashes; generated bundle reports; this report. |
| 21 | Tests | Added 13 pure session tests; updated 3 Study Path UI regressions, including explicit generation and recoverable failure. |
| 22 | Focused result | 51/51 PASS across session, adaptive engine, adaptive UI and Dashboard projection after final changes. |
| 23 | Adaptive result | Accepted ranking engine remains byte-identical; adaptive validation PASS. |
| 24 | Routing | Full routing suite PASS; Chromium opened the generated first action successfully. |
| 25 | Mastery/readiness | Full mastery/readiness regression suites PASS; formulas and evidence mutation behavior unchanged. |
| 26 | Full Vitest | 2,062/2,062 PASS across 92 files after final changes. |
| 27 | TypeScript | PASS. |
| 28 | Production build | PASS. |
| 29 | Hardening | PASS with only exact authorized Study Path/UI test hashes updated. |
| 30 | Security | Final static source and emitted-asset security checks PASS. |
| 31 | Content | Trusted content, academic index, topic, practice, CO, R&L, enrichment, IP, exam, mastery and readiness validation PASS. |
| 32 | Bundle | No dependency added. Study Path remains lazy; its production chunk changed from 4,263 to 8,746 bytes raw (+4,483) and from 1,835 to 3,605 bytes gzip (+1,770). Production exclusions PASS. |
| 33 | Desktop Chromium | Chromium 151 at 1280×900: all six presets generated; activity counts 2/3/4/5/7/9; exact totals; no duplicate links, console errors or horizontal overflow; first action opened. |
| 34 | Mobile Chromium | Chromium 151 at 375×900: same generation checks PASS; selectors/CTA/actions usable; no horizontal overflow; first action opened. |
| 35 | Accessibility | Native labelled selectors, keyboard-operable buttons/links, visible focus, semantic ordered results, status/alert announcements and text labels PASS. |
| 36 | Preservation | Patch 1 Assembly, Patch 2 cloud/account/countdown and Patch 3 cleanup remain unchanged. Guards were not weakened. |
| 37 | Adversarial review | No invented curriculum, fake mistakes, wrong-course leakage, duplicate filler, metric mutation, new cloud state, dead routes, unrelated schema/config changes or exposed internal IDs found. |
| 38 | Final git status | Clean after the focused commit. |
| 39 | Final commit | Recorded in the operator-facing final report because a commit cannot contain its own hash. |
| 40 | Final gate | **PASS**. |

The desktop/mobile browser harness used disposable anonymous browser state and did not alter learner, Auth or cloud data. Screenshots: `/tmp/patch4-study-path-1280.png` and `/tmp/patch4-study-path-375.png`.
