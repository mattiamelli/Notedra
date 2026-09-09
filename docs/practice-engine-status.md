# Step 4 — Shared practice and deterministic grading

IN PROGRESS. Started from clean 2693fd3. Baseline content/navigation/student-reference checks, 292 tests, typecheck and production build passed before edits. Full baseline output was captured in /tmp/delftstudy-step4-baseline.log. Step 5 is not started.

The three specified skills and their canonical ownership were confirmed in the preserved pack. Selected lecture provenance: CO_LEC_05 PDF_PAGES_1-32, RL_LEC_01 PDF_PAGES_1-26, IP_LEC_02 PDF_PAGES_1-34. All are whole-document ranges, not exact supporting slides. No assessment mappings or original PDFs are used.

Planned binding uses existing fields: templateRef = authored definition ID; exercise.id = namespaced instance/attempt identity; exercise.version = definition version plus SHA-256 lock. Student schema/database remain unchanged. Catalog, pure graders and tests precede UI integration. Final acceptance is pending.

Implementation checkpoint: 365 tests and typecheck passed before the separate adversarial self-review. Both trusted fixed Java snippets executed in the already installed Temurin OpenJDK 21.0.12.1+1, producing 10 and 6. No JDK or dependency was installed.

Self-review (not independent audit) confirmed three defects. Regression tests were added and all three failed before fixes: malformed learner payload returned ERROR instead of INVALID; an unknown proposition in a corrupted trusted expression could produce an incorrect score instead of ERROR; conflict UI disabled inputs without a selectable recovery copy. Minimal fixes validate the answer boundary, reject unknown proposition identities, and show safe text for copying after conflict. Final reruns and production browser acceptance remain pending.

Fourth review regression failed before its fix: instance binding did not lock executable grader content. Added grader-lock.json, checked by the production guard, and included that hash in exercise.version. Definitions retain their independent immutable locks. 370 tests, typecheck and production build now pass.

Production browser checkpoint (9 September 2026): isolated origin 4187; Chromium 152.0.7977.64; all three subject flows pass, draft/submitted reload pass, retry and Back/Forward pass, five genuine test attempts exported/restored, stale Practice tab blocked transactionally with selectable recovery text, all three Assembly examples pass (8,15,7) and pointers restored. Mobile390/tablet768/desktop1280 have no horizontal overflow. Native storage harness on4188:13/13 plus actual reload pass. Final documentation and final rerun pending. User's origin4173 remains untouched.
