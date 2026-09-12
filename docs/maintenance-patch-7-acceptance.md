# Maintenance Patch 7 — complete requested acceptance report

**PASS.** Source-restoration continuation completed; detailed executable evidence is in [finalization validation](maintenance-patch-7-finalization-validation.json).

1. **Starting branch.** `maintenance/interactive-logic-structured-exercises`; isolated continuation `maintenance/exercise-bank-expansion`.

2. **Starting HEAD.** `9d26e960299fffb57815400be1d0dc3da3dd629a` (accepted Patch 6).

3. **Initial git status.** Clean before isolating Patch 7.

4. **Canonical units.** CO 15 (01–15), R&L 17 (00–16), IP 21 (01–21): **53**. Preparation units included; no invented unit zero.

5. **Existing objective exercises.** 107: CO 37, R&L 35, IP 35. Historical guides/tools are not miscounted as objective questions.

6. **New CO.** 60.

7. **New R&L.** 68.

8. **New IP.** 84.

9. **Total new.** 212 (142 objective + 70 unscored guides); 100 added in the source-restoration continuation.

10. **Minimum per unit.** 4.

11. **Average per unit.** 4.0; maximum 4.

12. **Units with 5+.** 0; no fifth item justified merely by quantity.

13. **Below four / exceptions.** 0 / none. All 25 prior source blockers resolved.

14. **Practice / Exam-style.** 103 / 109. Distinct authored demands; exam tasks omit preparation or use broad proof fields, not cloned labels or fabricated timed scores.

15. **Medium / Hard / Exam-level.** 84 / 75 / 53; authored difficulty labels, not statistical calibration.

16. **Types.** 3 logic-build; 1 kmap-fill; 76 ip-fixed; 28 enrichment-exact tuples; 18 co-exact; 16 rl-exact; 70 guided-rubric.

17. **Source grounding.** Canonical HIGH skill/source references plus inspected physical PDF pages. All 32 supplied CO/R&L PDFs match canonical SHA-256. Previously accepted IP source evidence preserved. See restored-source-review.json.

18. **Copyright / fidelity.** Original scenarios, code, bounded questions and reference reasoning; no copied official question surfaces, answer-key text or raw course files in the app. See content review.

19. **CO review.** History reasoning; CMOS conduction/latch/shift semantics; ISA constraints; single-bus/control sequencing; I/O arbitration; DMA/memory; parallel/VM reasoning extend the previously reviewed logic/representation/assembly/cache/pipeline bank.

20. **R&L review.** All 17 units covered: arguments, Boolean/FOL semantics, proof methods, induction/invariants, trees, sets, relations/functions, countability/limits and integrated preparation. Open proofs never use keyword scoring.

21. **IP review.** 76 new JDK-verified predictions and 8 unscored design/implementation guides across all 21 canonical units; prior accepted records unchanged.

22. **Patch 6 types.** Four new Boolean/K-map activities use accepted logic-build/kmap-fill families with complemented literals. Original seven interactive exercises and bindings preserved.

23. **Assembly verification.** PASS: 24 independent CO checks, including four real accepted-engine programs; unsigned multiplication, aliasing, stack/call and destructive operands remain covered.

24. **Java verification.** PASS: 125 compiled trusted fixtures, 11 assignment references with 144 assertions; concurrency claims additionally model-tested. No arbitrary learner Java execution.

25. **Logic / K-map.** PASS: overbar A versus complemented A, assignment/minterm mapping both directions, multi-variable products, Gray-order preservation, care-row equivalence and visible/accessibly labelled desktop/mobile bars.

26. **Feedback.** PASS: factual reference/explanation and safe invalid-input messages. Wrong new tasks do not invent diagnostic misconceptions; guided solutions disclose review limits.

27. **Mistake Book.** PASS: canonical exact-bound evidence, wrong submission/reload/retry and factual mistake regressions; content alone creates no learner evidence.

28. **Study Path.** PASS: same-course/topic next tasks, prerequisite handling and anti-loop regressions. Existing recommendation/planning algorithms unchanged.

29. **Mastery.** PASS existing full regression; no semantics or score changes.

30. **Readiness.** PASS existing full regression; no open-guide or blueprint score invention.

31. **Coverage matrix.** `docs/maintenance-patch-7-coverage.md` (53 units); `docs/maintenance-patch-5-coverage.md` (456 supported areas, 249 objective items).

32. **Validation scripts.** Added expansion-validation, verify-expansion-co, verify-completion and their explicit oracles/checkpoint; updated validate-practice, exercise-coverage, verify-ip-java and measured bundle guard. Exact paths in changed-files.json.

33. **Duplicates.** PASS: zero exact/normalized new prompt collisions or reused IDs. Per-unit demands manually reviewed; two draft proof near-variants replaced before acceptance.

34. **Files changed.** 87 scoped files; complete list in `maintenance-patch-7-changed-files.json`. No unrelated runtime/source/auth files.

35. **Test files changed.** See the manifest’s tests entries: new notation/expansion validation/service/completion/browser checks and explicit catalogue/baseline fixture adjustments. Existing assertions retained for historical content.

36. **Content validation.** PASS canonical source, scope, answer format, metadata, capabilities and bindings.

37. **Coverage validation.** PASS: 53/53, four per unit, zero pending or exempted.

38. **Exercise validators.** PASS all bound references; 38 independently derived new closed results and valid-but-wrong/malformed tests; open work intentionally unscored.

39. **Full Vitest.** **PASS: 103 files, 2,366 tests**. Initial obsolete-count/fixture failures resolved; final complete run has no failures.

40. **TypeScript.** PASS.

41. **Production build.** PASS actual package build; final emitted content rebuilt by the bundle chain.

42. **Academic validation.** PASS content/index/references/topics/course validations through production build.

43. **Hardening.** PASS exact historical preservation, ignored env and static source checks.

44. **Security.** PASS static source/emitted artifact scan; not a live remote-auth claim.

45. **Bundle impact.** Patch 6 → final: initial JS 507,455→510,265 (+2,810), gzip 134,670→134,964 (+294), total 1,918,056→2,245,349 (+327,293). All six expansion modules lazy/single-owner. Authorized total ceiling 2.3 MB; initial ceilings unchanged. Full attribution in bundle-diagnosis.md.

46. **Java gate.** PASS including full trusted fixture/reference rerun after source completion.

47. **Desktop Chromium.** PASS 1280 px: all 100 new activities, 32 prior objectives/8 guides, all 7 original interactions.

48. **Mobile Chromium.** PASS 375 px: same cases, no horizontal overflow or page errors.

49. **Accessibility.** PASS visible separated overbars plus NOT labels, original 44 px interactive controls/keyboard flows, unique guide heading/field IDs, labelled textareas and reveal/reset. New desktop/mobile screenshots visually inspected.

50. **Preservation changes.** Only inspected UI/catalogue integration and test expectations receive exact after-hashes; historical before-hashes unchanged. Original 107 objectives, prior 112 Patch 7 activities and all original grading/domain/storage/engine contracts preserved.

51. **Adversarial review.** New CMOS contention title corrected; two proof draft near-variants replaced. Independent mathematics/CPU/Java checks and explicit open rubrics; no filler fifth items, copied official question wording or fake automatic proof grading.

52. **Remaining gaps.** No Patch 7 lecture-coverage/source gaps. Open proof/design work still requires self/human review by design; difficulty is not empirically calibrated.

53. **Final git status.** Clean after the single final commit, verified in delivery. `.env.local` ignored and uncommitted; no merge/push.

54. **Final commit hash.** Exact identifier returned in the operator response; it is the single `content: expand lecture exercise bank` commit containing this report. A commit cannot embed its own hash.

55. **Final gate.** **PASS**. Stop after Patch 7; no Patch 8, merge, push or Step 16.
