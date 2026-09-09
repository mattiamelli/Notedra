# Step 9 adversarial self-review

This was a separate self-review after the initial green implementation (1,423 tests / 55 files, typecheck, production build and lazy bundle gate). It is not an independent audit.

| Confirmed defect | Failing regression before fix | Minimal correction | Targeted result |
|---|---|---|---|
| A v1 store with recovery but missing active data advanced to DB 2 before reporting incomplete storage | `adaptive-review.test.ts` — incomplete legacy storage (version 2 vs expected1) | Abort the upgrade transaction for a nonempty store without active data; preserve recovery and DB 1 | PASS |
| Eight downstream wrongs outweighed the prerequisite bonus while the reason said to review the prerequisite first | same file — prerequisite-first explanation (cache selected before memory) | Apply canonical prerequisite precedence before priority ranking, with stable priority ordering among available nodes | PASS |
| An unreachable lazy chunk could satisfy the adaptive bundle owner check | same file — unreachable lazy chunks (did not throw) | Verify reachability through static/dynamic imports from the production entry | PASS |
| Correct-history arrays depended on source array order for identical timestamps | same file — success history order | Sort successful evidence by timestamp then stable attempt ID | PASS |
| A course filter still displayed another course’s repeated-pattern summary | `adaptive-ui.test.tsx` — repeated-pattern summary respects selected course | Count only skills represented by the filtered mistakes; keep the explicit 30-day window | PASS |

The first four regressions ran RED together (4/4 failed), then GREEN with migration, adaptive and validation tests (67/67). The fifth ran RED (1 failed,12 passed); targeted UI/evaluator checks were rerun after the fix. Full final verification is recorded separately in mistake-adaptive-status.md.

Also inspected: attempt/version immutability, restore transaction completion/recovery, source eligibility, cross-course identities, exact misconception selection, open/code exclusion, same-item retry limits, old/new recurrence, success effects, UTC boundaries, 5,000-record complexity and lazy imports. No source teaching content or grader was rewritten. Native browser checks and responsive checks remain separate acceptance evidence.

## Production browser regression — long recommendation title

The separate Chromium acceptance pass reproduced a sixth defect after the initial final automation pass: at a measured 390 px viewport, `/study-plan?course=CSE1300_RL` with real wrong implication submissions had a 416 px document scroll width. The related practice title “Compare meanings across all valuations” inherited the existing global heading `white-space: nowrap` rule; its content measured 364 px inside a 305 px heading. This was recorded as a failing real-browser regression before changing code (jsdom does not perform layout).

Minimal fix: scope `display: block`, `white-space: normal` and word wrapping to Mistake/Study Path card headings in adaptive.css. The global Assembly styles remain unchanged. Repeated the same route/data at 390 px (document width/scroll width390/390), all six requested route/viewport combinations, and every final gate after the fix: PASS. Final measured evidence is in mistake-adaptive-browser.json and mistake-adaptive-status.md.
