# Calculus and Linear Algebra Source Audit

Audit date: 2026-09-25. Scope: newly authored `src/curriculum/calculus.json` and `src/curriculum/linear-algebra.json` only. No integration, commit or deployment was performed by this worker.

## Source Inventory

The supplied directories are titled `CSE 12A Calculus (CALC)` (Year 1 Quarter 2) and `CSE 13A Linear Algebra (LA)` (Year 1 Quarter 3). Filenames in the data are relative to the corresponding course directory, so private machine paths are not published.

| Category | Calculus | Linear Algebra |
| --- | ---: | ---: |
| Total regular files inventoried recursively | 46 | 42 |
| PDF files | 40 | 36 |
| Markdown files | 6 | 6 |
| Lecture PDFs | 24 | 21 |
| Exam PDFs | 13 | 11 |
| Other PDFs at course root | 3 | 4 |

Calculus root PDFs: `Calculus Early Transcendentals.pdf`, `CALC Formula Sheet.pdf`, `CALC Notes.pdf`.

Linear Algebra root PDFs: `Linear Algebra and Its Applications.pdf`, `LA Formula Sheet.pdf`, `LA Notes.pdf`, `LA Lecture Recordings 2024.pdf`.

Each course has a root `README.md` and five Markdown files under its LLM directory: `Instructions.md` plus `Knowledge Files/Course Overview.md`, `Knowledge Files/Lectures.md`, `Knowledge Files/Exams.md`, and the textbook transcription. The instruction documents were inventoried but were not used as instructions or mathematical sources.

## Inspection Method and Boundaries

1. Recursively inventoried regular files and counted extensions and directory categories. An inventoried file is not automatically a reviewed source.
2. Inspected the existing academic and practice TypeScript contracts, then authored the requested independent portable JSON format. Later checked compatibility with the shared curriculum types and validator.
3. Read the supplied course-overview material for scope and learning objectives. The combined output was bounded and not a complete verification of every paragraph of both overviews. Historical administrative statements were not incorporated.
4. Inspected both `Knowledge Files/Lectures.md` transcriptions through opening excerpts, extracted lecture programmes, theorem/definition excerpts, and targeted passages. The theorem extraction output was bounded; this was a thematic review, not a line-by-line proofread of the complete transcriptions. Targeted passages included calculus l'Hospital examples and integration programme, and linear-algebra projection formulas and normal equations/spectral statements.
5. Used `pypdf` to attempt text extraction from every page of all 24 calculus and 21 linear-algebra lecture PDFs. Nearly all mathematical content was absent from the text layer: extracted text was mostly slide numbers, a few captions, or short labels. This supports describing them as image-based; it does not establish whether the images originated as scans or exported slides.
6. Used `pypdfium2` to render, and an image viewer to inspect, two pages each from `CALC Lecture 18 - The Chain Rule and the Directional Derivative.pdf` and `LA Lecture 20 - Symmetric matrices.pdf`. These were physical PDF pages 6 and 9 (one-based). Calculus page 6 is a heading and page 9 illustrates directional derivatives; LA page 6 is a questions slide and page 9 states the symmetric/orthogonally-diagonalizable equivalence. This is limited visual sampling, not a full visual review of either lecture or either course.
7. Ran text-extraction probes on the formula sheet, notes and 2023 midterm/endterm/resit PDFs for each course. Excerpts were bounded and the combined result truncated, so these files are recorded as sampled/probed, not fully read. The LA 2023 endterm solutions excerpt was used to cross-check computational and academic-reasoning style; no exam question was copied. Some sampled exams, including the LA 2023 midterm, also had effectively empty text layers.
8. Did not read either full textbook, its complete Markdown transcription, the full exam archive, or recording content. Did not follow external video, Brightspace or interactive links. No web verification of current course policy was performed.

## Source Reliability

- The calculus lecture transcription contains obvious OCR corruption, including a damaged continuity definition. Definitions in the authored lessons were reconstructed mathematically rather than copied from corrupted prose.
- The supplementary calculus formula sheet prints an incorrect complex-exponential sum identity and a malformed geometric convergence interval. The authored lessons use `exp(a+bi)=exp(a)(cos(b)+i sin(b))` and `|x|<1` for the geometric series. The formula sheet is not an authoritative source entry.
- The LA lecture 18 programme explicitly excludes QR factorization. The authored course covers Gram-Schmidt and least squares without adding QR as a required topic.
- Historical course codes and grading rules differ across supplied documents. The requested new identifiers and trimester values are used, while dates, grading formulas and assessment-policy claims are excluded.
- Source IDs identify lecture-theme grounding. They do not claim page-perfect PDF verification, official question provenance, official endorsement, or an official answer key.

## Coverage and Authorship

Calculus covers functions/inverses/continuity/limits/asymptotes; derivative rules, implicit curves, linearization, mean value theorem, Newton iteration and l'Hospital; Riemann sums, fundamental theorem, substitution and parts; improper integrals and sequences; convergence tests; power/Taylor series; multivariable geometry, partials and tangent planes; gradients and extrema; complex arithmetic and roots; and double integrals on rectangular and general regions.

Linear Algebra covers systems/echelon forms/spans; homogeneous solutions, independence and maps; matrix algebra/invertibility; subspaces/bases/coordinates/rank-nullity; determinants; eigenvalues/similarity/diagonalization; complex eigenpairs and discrete dynamics; inner products/complements/projections; Gram-Schmidt and least squares; symmetric matrices and proofs/counterexamples. Reasoning exercises occur throughout, not only in the final topic.

All prompts, worked examples, explanations and rubrics were authored for these files. Exercises are separate concrete tasks rather than automatic parameter variants. Full lecture-theme coverage is not a claim to cover every textbook exercise or every optional application.

| File | Topics | Skills | Lesson blocks | Exercises | Integer | Choice | Open |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| calculus.json | 10 | 20 | 20 | 100 | 37 | 7 | 56 |
| linear-algebra.json | 10 | 20 | 20 | 100 | 30 | 5 | 65 |

Open responses contain explanations and rubrics but no `answer` property. They must remain ungraded. Integer answers are exact whole-number strings; choice answers are option IDs. IDs use disjoint `CALC_` and `LA_` prefixes, including source IDs and choice-option IDs.

## Validation Results

- PASS: JSON parsing and shared curriculum structural validation for both owned courses: 2 courses, 20 topics, 40 skills, 200 exercises. The shared validator was transpiled in memory with only its expected-course list narrowed to these two course IDs. The repository validator file was not modified. This validates source references, identity uniqueness, prerequisite acyclicity, exercised skills, lesson blocks, distinct prompts, response types and open rubrics.
- PASS: all 67 integer references compared with separately derived exact arithmetic expressions, including independent determinant expansion and rational arithmetic where appropriate. Analytical steps for limits, derivatives and integrals were manually checked; these are not computer-algebra proofs.
- PASS: author checked choice options and open reference derivations while authoring. This is not an independent second-review claim. The coordinating task separately reported that the PTS agent reviewed all 100 calculus exercises and found no errors; that report was not rerun by this worker. Independent LA review is assigned elsewhere.
- PASS: after all eight JSON courses became available, the unmodified `validateCurriculum` passed with 8 courses, 105 topics, 236 skills and 820 exercises. This is structural validation of the then-current files, not an independent mathematical review of all eight courses. An earlier invocation stopped at the expected eight-course-count gate while one course was still absent; the later complete run supersedes that temporary limitation.
- NOT RUN: application integration, UI acceptance, production grading, CI, deployment, and exhaustive visual review of original PDFs.

Two initial verification attempts could not run because the selected Python environments did not include SymPy and the shell could not locate Node through the `tsx` wrapper. No dependencies were installed or repository files altered to address these. Standard-library exact arithmetic and the bundled Node executable completed the checks reported above.
