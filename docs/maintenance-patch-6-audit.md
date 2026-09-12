# Patch 6 — initial audit

Clean accepted Patch 5 HEAD `39a15c1bd9965f48ff1f1faae902defdb21b3d72`; starting branch `maintenance/exercise-system-source-alignment`; isolated branch `maintenance/interactive-logic-structured-exercises`.

Patch 5 provides seven explicit types, original grader fingerprints, immutable attempts, native controls, cautious authored feedback, same-topic next selection and a generated coverage matrix. Answers support canonical keyed choice tokens without changing Student Schema or cloud contracts. Structured slot selections can use that transport while constructing a real propositional AST, rather than arbitrary formula text.

`src/rl/logic.ts` already provides bounded AST validation, classical evaluation and counterexample/equivalence helpers. Reuse this as the semantic oracle. CO's current Boolean/K-map source and lessons cover Gray ordering, wraparound and don't-cares. Canonical R&L areas support propositional construction/equivalence; they do not establish a dedicated Karnaugh-map area. Do not invent one. No general quantifier/theorem-proving UI is necessary for representative scope.

Add bounded template-based formula construction/reconstruction, and 2–4-variable map completion/reverse expression tasks. Formula templates constrain topology, node count, allowed variables/operators and slot identity. Map reverse checking will establish equivalence on care cells, explicitly not minimality. No grouping/minimization claim or new symbolic engine.

New Practice tasks retain scaffolding; distinct authored Exam-style challenges remove givens/preparation. These are individual exam-style practice tasks, not new readiness-bearing timed mock components. Existing exam banks remain unchanged.

Existing CSS uses semantic light-theme tokens and accessible native controls. New widgets need isolated fieldset/grid styling; do not inherit radio widths (Patch 5 finding). Reuse primary buttons and semantic status/feedback. Preserve IP, Assembly, cloud, learning schema and all evidence formulas.
