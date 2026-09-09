# Step 5 — Topic Learning Experience

IN PROGRESS — implementation checkpoint; final production-browser acceptance and full final report remain pending. Steps 6–14 have not been started.

Started from clean acfad2d. Baseline content validation, academic/student projections, practice validation, all370 tests in16files, typecheck and production build passed before edits. Log: /tmp/delftstudy-step5-baseline.log.

Implemented a deterministic84,049-byte canonical study projection (3subjects/43topics/105subtopics/147skills/106 deduplicated provenance records); seven stable study modes per topic; canonical Overview and accessible Mental Map for all43; three authored lessons with27 versioned blocks; exactly24 versioned cards (8/course). New fingerprints/build guards preserve authored versions and source ownership. Existing Practice catalog/service/grading/storage are reused; no new student fields or evaluations.

Pilot taxonomy confirmed directly in the immutable handoff JSON and normalized Master Content Pack: CO6skills/3subtopics, RL7skills/4subtopics, IP4skills/2subtopics. IP prerequisite remains IP_T01_JAVA_BASICS. All pilot lecture/skill refs are HIGH with DOCUMENT_RANGE: CO_LEC_05 pages1–32 / CO_LEC_06 pages1–27; RL_LEC_01 pages1–26 / RL_LEC_02 pages1–82; IP_LEC_02 pages1–34. Subtopic UNKNOWN provenance is preserved in the projection, never upgraded to exact support.

Independent arithmetic and logic checks pass. All4 fixed trusted Java snippets executed on installed Temurin OpenJDK21.0.12.1+1 LTS: branch→pass, switch→middle, aggregate→9 3, search→4. No JDK/dependencies installed, no learner code executed.

Initial implementation:468 tests/typecheck/build passed. Separate adversarial self-review (not independent audit) found canonical Mental Map links opened Overview without focusing the requested node. A failing regression expected CO_ST04_02_SIGNED_INTEGER but received ds-content; minimal hash-target focus/scroll fix applied. Full review rerun passed:469 tests in20files, no warnings, typecheck and production build. Log: /tmp/delftstudy-step5-reviewed.log.

Baseline test adaptations are limited to the seven-mode count and shifted Flashcards/Practice tab indices, plus making the existing Practice input helper wait for the actual input instead of assuming a fixed30ms delay suffices under a larger concurrent test suite. Assertions/coverage remain intact. New UI tests inspect all301topic/mode combinations and check flashcard actions do not alter the student backup after the topic visit has settled.
