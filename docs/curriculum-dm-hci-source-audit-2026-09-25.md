# DM / HCIAP source and content audit - 2026-09-25

## Scope and ownership

Authored only `src/curriculum/data-management.json`, `src/curriculum/hci.json` and this uniquely named audit. No integration files, existing content, generated registry artifacts, commits or deployment were changed by this worker. Other workers are concurrently adding the remaining courses and integration.

## Inventory is not full semantic review

The source roots are the supplied `CSE 12C Data Management (DM)` and `CSE 12B Human Computer Interaction and AI-Assisted Prototyping (HCIAP)` directories under Year 1 Quarter 2. All 129 non-hidden supplied files match the shared `docs/curriculum-source-inventory.json` by exact course-relative path and full SHA-256. No suffix matching or ambiguous basename resolution was needed.

| Course | Files | PDF | Markdown | PDF pages | Unique byte hashes |
| --- | ---: | ---: | ---: | ---: | ---: |
| DM | 77 | 53 | 24 | 5195 | 66 |
| HCI | 52 | 28 | 24 | 1720 | 44 |

Full-file text extraction was performed with local PDF parsers; Markdown files were read for extraction and section surveying. This mechanical extraction is not a claim that all 6,915 PDF pages or every transcription paragraph were semantically read or verified. Every document received a contents/heading or sampled-text inspection; exact duplicate bundles were identified by hash. PDF sampling consistently included pages floor(page_count/4)+1 and floor(3*page_count/4)+1, with further first/middle/end excerpts available during reconnaissance. Additional targeted passages are listed below. The large textbooks were consulted selectively; no cover-to-cover review is claimed.

Visual review covered both pages of the image-only SQL cheat sheet. DM_SRC_045 and DM_SRC_047 have the same byte hash, so the rendered two-page review applies to both copies. Other pages with little extracted text include diagrams, covers, empty answer areas and slide transitions. They were not all rendered; no claim of complete diagram verification or transcription fidelity is made. New exercises provide their own small schemas, values and situations rather than depending on an unseen diagram.

## Targeted evidence and scope decisions

- DM_SRC_001 and DM_SRC_077: complete supplied scope notes/README. CSE12C is a new 5 EC merger; predecessor union is broader than the new course; assessment is not specified. The explicit URI/URL thread is retained through connection/persistence concepts. No external current study-guide verification was performed.
- DM_SRC_037, PDF pp. 1-14: application/database impedance mismatch, durable identity, persistence and JDBC. This is database-access evidence, not sufficient evidence for a complete REST syllabus.
- DM_SRC_014, PDF pp. 1-11: algebra, B+-tree convention-dependent tasks, multidimensional indexing and workload choices. New exercises state their own capacities, split rules and I/O assumptions.
- DM_SRC_010: targeted DDL, REFERENCES and table-constraint material in the lecture transcription; DM_SRC_036 and DM_SRC_071 provide the corresponding SQL lecture sources. Obvious transcription errors are not copied as executable examples.
- DM_SRC_013/015/064-066 and the legacy exam bundles: task structures and solution styles were sampled. Their original rows, diagrams, dates, scores and answer keys are not reproduced as current course requirements. A solution labelled as official or complete was not automatically treated as correct.
- HCI_SRC_041 and HCI_SRC_052: complete supplied scope notes/README. New-course framing is a group prototype using Generative AI and target-user evaluation. The archive explicitly says the new GenAI component has no teaching material.
- HCI_SRC_006: targeted Week 1 PACT and Week 2 requirements/card sorting/ethics passages. They support the preparation workflow, not historical deadlines or a current assessment contract.
- HCI_SRC_015, PDF pp. 18-34: research questions, expert evaluation, four walkthrough questions and heuristic inspection. HCI_SRC_002-004 provide sampled practice evidence for principles, prototypes and exclusion categories.
- HCI_SRC_016, PDF pp. 5-17: experiment questions, manipulated/measured variables, confounds and study design. Statistical claims in the source are not repeated uncritically; the new content does not invent significance thresholds or causal conclusions.
- HCI_SRC_017, PDF pp. 21-35: Wizard-of-Oz protocols and layered evaluation. These support analysis of adaptive systems, not approved AI coding tools or prompting workflows.
- HCI_SRC_032-039, their WDT transcriptions, notes, exercises and labs: optional implementation background. Some old WDT materials are relabelled CSE12B; source lineage takes precedence over those headings. Simplified statements about HTTP, React and concurrency are not promoted to universal technical claims.

DM foundation topics cover architecture, ER mapping, keys, SQL queries, DDL/DML, views, dependencies/normalisation and persistence. Algebra planning, storage/indexing internals, cost optimisation, concurrency, recovery, distributed commit and NoSQL are explicitly inherited extensions with uncertain CSE12C depth. The curriculum is broad preparation grounded in the archive, not a verified full official new-course syllabus.

HCI topics cover PACT, research and requirements, information architecture, interaction/accessibility, ethics, prototyping, expert evaluation, user studies and adaptive/conversational interaction. Two web topics are explicitly optional legacy background. The final project topic applies inherited HCI methods to the new framing and assesses evidence boundaries; it deliberately supplies no invented GenAI tool tutorial, approved-tool list or official grading rubric. HCI theory is subject-matter background from CSE3500; formal replacement lineage is CSE1500 WDT.

## Content and validation

| Course | Topics | Skills | Lesson blocks | Lesson words | Choice | Integer | Open | Total exercises |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CSE12C_DM | 12 | 24 | 37 | 4289 | 28 | 20 | 56 | 104 |
| CSE12B_HCIAP | 12 | 24 | 36 | 3798 | 35 | 4 | 61 | 100 |

PASS: the shared `scripts/curriculum-validation.ts` was executed after changing only its eight-course cardinality precondition in memory to the exact two owned course IDs. The repository validator was not edited. All substantive shared rules passed, including source resolution, minimum topic/block/exercise counts, every skill practised, unique identities, duplicate prompt detection, prerequisite DAG, and response contracts. This is a two-course validation, not an eight-course integration result.

PASS: additional read-only checks required exact inventory paths and matching SHA-256 for all 129 sources, globally unique option IDs as well as content IDs, at least 250 lesson words per topic (observed minima DM 312 / HCI 300), no authoring-helper fields, and no `answer` on any open exercise. Every open exercise has at least three rubric criteria. All 24 integer references were independently enumerated/recomputed using arithmetic or explicit tiny-model reasoning; no SQL engine was used. Choice options and explanations were reviewed for single-answer intent. Open explanations are reference reasoning, not claims of exhaustive or objective grading.

NOT RUN: full eight-course validator/generator and app integration acceptance. At the owned-course validation checkpoint another worker had not yet supplied software-engineering.json (linear-algebra.json arrived during work). The generator writes shared generated metadata unless passed --check; no generation was performed by this worker. Static content checks do not establish UI, production or official assessment acceptance.

Remaining limits: only selective semantic and visual source review; no full re-solution of historical exams; no external verification of the new syllabus; no missing GenAI teaching material recovered; some supplied OCR and historical solutions may remain incorrect outside the specifically used evidence. All exercise scenarios and lesson prose are original adaptations rather than copied historical exam content.

## Independent Linear Algebra review

Read-only review requested after the owned-course audit. Reviewed `src/curriculum/linear-algebra.json` at SHA-256 `b85742dcb05ec1cc4b2d924fc0e376f3329499744667d1c38d3bd5f0043c1bd7`. No changes were made to that author's file. All 100 exercises were inspected: 30 integer answers, 5 choice answers and 65 open-reference explanations/rubrics. Numerical results were independently recomputed using exact rational arithmetic where applicable: elimination, matrix products, determinants, rank, eigenpair identities, powers, projections and least-squares normal equations. General proofs were reviewed algebraically rather than accepted from finite numeric examples. The power formula in LA_E060 was checked at k=0 and by the recurrence for its upper-right entry, as well as numerically for k=0 through 11.

No incorrect objective answer or open-reference numerical result was found under the lessons' standard real-vector/Euclidean conventions. Findings concern explicit assumptions:

- `LA_E063` (line 130 at the reviewed snapshot): the answer 5 is correct for the Euclidean norm, since C^T C=25I. The prompt should say "Euclidean norm" instead of "every vector norm". For the infinity norm, e1 has norm 1 and Ce1 has norm 4, while (1,1) has norm 1 and C(1,1) has norm 7. Thus the stated factor is not norm-independent. This is a prompt-precision issue, not an incorrect intended answer.
- `LA_E080` (line 154): the reference uses p-w in W, which requires W to be a subspace, although the standalone prompt does not explicitly say so. The topic context supplies the intended assumption. Add "W is a subspace of R^n with the Euclidean inner product", or instead justify r dot (p-w)=0 directly from r dot p=r dot w=0. The closest-point conclusion itself remains valid under the stated orthogonality, even for more general W; it is the particular closure step that needs care.
- Adjacent lesson caveat, `LA_T07`, first block's third paragraph (line 126): A=P C P^(-1) with P=[p,q] needs a real 2-by-2 A and a nonreal eigenvalue (b != 0), giving independent real/imaginary parts. As currently phrased for an unspecified "real A", an n-by-n example can give an n-by-2 P with no inverse. The general statement is AP=PC on the invariant plane. For example, a 90-degree rotation block plus the scalar 2 in a 3-by-3 matrix has v=(1,i,0) for eigenvalue -i; P is 3-by-2. This caveat was observed while checking the exercise conventions, not by expanding into a full lesson/source audit.

## Coordinator follow-up

The coordinator independently reported all 104 DM exercise results otherwise correct, with one assumption clarification required in `DM_NORMALIZATION_E04`: the 2NF diagnosis needs a complete stated FD set or an explicit non-prime student_name assumption. The coordinator reserved that prompt edit; this worker did not duplicate it. The coordinator also reported shared content-validator PASS after the other courses arrived. That reported overall pass is separate from this worker's directly executed two-course validation above.

## Per-file review evidence

Paths below are exact course-relative inventory paths. Hash prefixes identify bytes; the shared inventory retains complete SHA-256 values, which were compared in full. `sample` means contents/heading and selected-passage inspection, not exhaustive review. PDF page counts describe extraction coverage only. Duplicate copies do not count as additional independent evidence.

| Source ID | Exact relative filename | Pages | SHA-256 prefix | Review |
| --- | --- | ---: | --- | --- |
| DM_SRC_001 | DM LLM Files/Instructions.md | - | 34c5804d0f87ed4d | complete local scope text |
| DM_SRC_002 | DM LLM Files/Knowledge Files/Assignments (IDM).md | - | 68913e06c7ce9ef0 | text/heading survey; sample |
| DM_SRC_003 | DM LLM Files/Knowledge Files/Course Overview (IDM).md | - | 6dcc7addc0199156 | text/heading survey; sample |
| DM_SRC_004 | DM LLM Files/Knowledge Files/Course Overview (WDT DB).md | - | c595c4a9f776ec5f | text/heading survey; sample |
| DM_SRC_005 | DM LLM Files/Knowledge Files/Database Systems the Complete Book.md | - | 648accc8ed3abf87 | text/heading survey; sample |
| DM_SRC_006 | DM LLM Files/Knowledge Files/Exams (IDM).md | - | 12f12d30f06de5f0 | text/heading survey; sample |
| DM_SRC_007 | DM LLM Files/Knowledge Files/Exams (WDT DB).md | - | c5221a2eaa9f0de8 | text/heading survey; sample |
| DM_SRC_008 | DM LLM Files/Knowledge Files/Fundamentals of Database Systems.md | - | 2a8c5eadf12a2220 | text/heading survey; sample |
| DM_SRC_009 | DM LLM Files/Knowledge Files/Lab Assignments (WDT DB).md | - | 669a82d50f050f37 | text/heading survey; sample |
| DM_SRC_010 | DM LLM Files/Knowledge Files/Lectures (IDM).md | - | cffbd09c5cfcb341 | text/heading survey; sample |
| DM_SRC_011 | DM LLM Files/Knowledge Files/Lectures (WDT DB).md | - | 9455826ccd75e5bd | text/heading survey; sample |
| DM_SRC_012 | From IDM/Database Systems the Complete Book.pdf | 1240 | d869f1217eb8d682 | all-page extraction; sample |
| DM_SRC_013 | From IDM/IDM Assignment Solutions/IDM Assignment 1 Task 1 Solutions.pdf | 9 | 10793d4b0cd01a8f | all-page extraction; sample |
| DM_SRC_014 | From IDM/IDM Assignment Solutions/IDM Assignment 2 Solutions.pdf | 13 | 0fe44312322eefea | all-page extraction; sample |
| DM_SRC_015 | From IDM/IDM Assignment Solutions/IDM Assignment 3 Solutions.pdf | 14 | 9ca482b8bc37d5b3 | all-page extraction; sample |
| DM_SRC_016 | From IDM/IDM Cheat Sheet.pdf | 2 | b3fb90894c282d2a | all-page extraction; sample |
| DM_SRC_017 | From IDM/IDM Exams/IDM Endterms/IDM Endterm 2020.pdf | 19 | 1f1d2bce1b683fef | all-page extraction; sample |
| DM_SRC_018 | From IDM/IDM Exams/IDM Endterms/IDM Endterm 2022.pdf | 17 | 000876d518c8ed10 | all-page extraction; sample |
| DM_SRC_019 | From IDM/IDM Exams/IDM Endterms/IDM Endterm 2023 Solutions.pdf | 28 | aba128ca2996e63f | all-page extraction; sample |
| DM_SRC_020 | From IDM/IDM Exams/IDM Endterms/IDM Endterm 2024.pdf | 20 | c23973edc137754b | all-page extraction; sample |
| DM_SRC_021 | From IDM/IDM Exams/IDM Resits/IDM Resit 2020.pdf | 19 | 3ada47ff770e9afe | all-page extraction; sample |
| DM_SRC_022 | From IDM/IDM Exams/IDM Resits/IDM Resit 2022.pdf | 14 | 19e3e1cf5aa4b7f9 | all-page extraction; sample |
| DM_SRC_023 | From IDM/IDM Exams/IDM Resits/IDM Resit 2023.pdf | 8 | 3ff1b2adb10a9b20 | all-page extraction; sample |
| DM_SRC_024 | From IDM/IDM Exams/IDM Resits/IDM Resit 2024.pdf | 22 | 9b90c9ae51b3d25f | all-page extraction; sample |
| DM_SRC_025 | From IDM/IDM LLM Files/Instructions.md | - | d99fac27474a54a5 | text/heading survey; sample |
| DM_SRC_026 | From IDM/IDM LLM Files/Knowledge Files/Assignments.md | - | 68913e06c7ce9ef0 | text/heading survey; sample; duplicate of DM_SRC_002 |
| DM_SRC_027 | From IDM/IDM LLM Files/Knowledge Files/Course Overview.md | - | 6dcc7addc0199156 | text/heading survey; sample; duplicate of DM_SRC_003 |
| DM_SRC_028 | From IDM/IDM LLM Files/Knowledge Files/Database Systems the Complete Book.md | - | 648accc8ed3abf87 | text/heading survey; sample; duplicate of DM_SRC_005 |
| DM_SRC_029 | From IDM/IDM LLM Files/Knowledge Files/Exams.md | - | 12f12d30f06de5f0 | text/heading survey; sample; duplicate of DM_SRC_006 |
| DM_SRC_030 | From IDM/IDM LLM Files/Knowledge Files/Lectures.md | - | cffbd09c5cfcb341 | text/heading survey; sample; duplicate of DM_SRC_010 |
| DM_SRC_031 | From IDM/IDM Lectures/IDM Lecture 1 - Introduction.pdf | 49 | 0c63b42520c004be | all-page extraction; sample |
| DM_SRC_032 | From IDM/IDM Lectures/IDM Lecture 10 - Query Processing Part 3.pdf | 97 | 1559014213efa297 | all-page extraction; sample |
| DM_SRC_033 | From IDM/IDM Lectures/IDM Lecture 11 - Transactions Concurrency.pdf | 78 | 087d4eedbd18787c | all-page extraction; sample |
| DM_SRC_034 | From IDM/IDM Lectures/IDM Lecture 12 - Recovery Distributed Transactions.pdf | 82 | ef4ec5c74c1acef7 | all-page extraction; sample |
| DM_SRC_035 | From IDM/IDM Lectures/IDM Lecture 13 - NoSQL.pdf | 76 | d5bfddbbf737c540 | all-page extraction; sample |
| DM_SRC_036 | From IDM/IDM Lectures/IDM Lecture 2 - SQL.pdf | 80 | 517cbe1152b355df | all-page extraction; sample |
| DM_SRC_037 | From IDM/IDM Lectures/IDM Lecture 3 - API Persistance.pdf | 74 | 02aa274041995d99 | all-page extraction; sample |
| DM_SRC_038 | From IDM/IDM Lectures/IDM Lecture 4 - Towards Query Processing.pdf | 93 | 0cbff8598779d60a | all-page extraction; sample |
| DM_SRC_039 | From IDM/IDM Lectures/IDM Lecture 5 - Storage.pdf | 64 | 4b9539ede9c230d3 | all-page extraction; sample |
| DM_SRC_040 | From IDM/IDM Lectures/IDM Lecture 6 - Logical Storage Indexing.pdf | 34 | 6db9a93d436e63da | all-page extraction; sample |
| DM_SRC_041 | From IDM/IDM Lectures/IDM Lecture 7 - Indexing.pdf | 75 | 2c286fc304feb26a | all-page extraction; sample |
| DM_SRC_042 | From IDM/IDM Lectures/IDM Lecture 8 - Query Processing Part 1.pdf | 90 | 17ab5d097ec0dc81 | all-page extraction; sample |
| DM_SRC_043 | From IDM/IDM Lectures/IDM Lecture 9 - Query Processing Part 2.pdf | 109 | 56d73e26c71426b7 | all-page extraction; sample |
| DM_SRC_044 | From IDM/IDM Notes.pdf | 37 | d2a791fa763ea75b | all-page extraction; sample |
| DM_SRC_045 | From IDM/SQL Cheat Sheet.pdf | 2 | 132a9ace52a9098a | both image-only pages visually reviewed; identical PDF copies |
| DM_SRC_046 | From WDT DB/Fundamentals of Database Systems.pdf | 1273 | e9b23e67401170cc | all-page extraction; sample |
| DM_SRC_047 | From WDT DB/SQL Cheat Sheet.pdf | 2 | 132a9ace52a9098a | both image-only pages visually reviewed; identical PDF copies |
| DM_SRC_048 | From WDT DB/WDT DB Exams/WDT DB Midterm Resits/WDT DB Midterm Resit 2020.pdf | 29 | b6b4f65ee297e702 | all-page extraction; sample |
| DM_SRC_049 | From WDT DB/WDT DB Exams/WDT DB Midterm Resits/WDT DB Midterm Resit 2022.pdf | 15 | 53846af955af6b47 | all-page extraction; sample |
| DM_SRC_050 | From WDT DB/WDT DB Exams/WDT DB Midterm Resits/WDT DB Midterm Resit 2023.pdf | 14 | e3f01108d2ab4109 | all-page extraction; sample |
| DM_SRC_051 | From WDT DB/WDT DB Exams/WDT DB Midterm Resits/WDT DB Midterm Resit 2024.pdf | 33 | 4dcdaf6d62699990 | all-page extraction; sample |
| DM_SRC_052 | From WDT DB/WDT DB Exams/WDT DB Midterms/WDT DB Midterm 2022.pdf | 15 | 57023411e7c9f2a3 | all-page extraction; sample |
| DM_SRC_053 | From WDT DB/WDT DB Exams/WDT DB Midterms/WDT DB Midterm 2023.pdf | 14 | 1a24a3770ac6c6df | all-page extraction; sample |
| DM_SRC_054 | From WDT DB/WDT DB Exams/WDT DB Midterms/WDT DB Midterm 2024.pdf | 33 | 9e2bec49f72444a9 | all-page extraction; sample |
| DM_SRC_055 | From WDT DB/WDT DB Exams/WDT DB Midterms/WDT DB Midterm 2025 Solutions.pdf | 23 | 0ea8bb26974c9312 | all-page extraction; sample |
| DM_SRC_056 | From WDT DB/WDT DB Exams/WDT DB Midterms/WDT DB Mock 1.pdf | 14 | 47e25ce7308bd06c | all-page extraction; sample |
| DM_SRC_057 | From WDT DB/WDT DB Exams/WDT DB Midterms/WDT DB Mock 2.pdf | 12 | f3fb5a3581b9bfe9 | all-page extraction; sample |
| DM_SRC_058 | From WDT DB/WDT DB LLM Files/Instructions.md | - | 15d9660afa33fdf3 | text/heading survey; sample |
| DM_SRC_059 | From WDT DB/WDT DB LLM Files/Knowledge Files/Course Overview.md | - | c595c4a9f776ec5f | text/heading survey; sample; duplicate of DM_SRC_004 |
| DM_SRC_060 | From WDT DB/WDT DB LLM Files/Knowledge Files/Exams.md | - | c5221a2eaa9f0de8 | text/heading survey; sample; duplicate of DM_SRC_007 |
| DM_SRC_061 | From WDT DB/WDT DB LLM Files/Knowledge Files/Fundamentals of Database Systems.md | - | 2a8c5eadf12a2220 | text/heading survey; sample; duplicate of DM_SRC_008 |
| DM_SRC_062 | From WDT DB/WDT DB LLM Files/Knowledge Files/Lab Assignments.md | - | 669a82d50f050f37 | text/heading survey; sample; duplicate of DM_SRC_009 |
| DM_SRC_063 | From WDT DB/WDT DB LLM Files/Knowledge Files/Lectures.md | - | 9455826ccd75e5bd | text/heading survey; sample; duplicate of DM_SRC_011 |
| DM_SRC_064 | From WDT DB/WDT DB Lab Assignment Solutions/WDT DB Lab Assignment 1 Solutions.pdf | 8 | a9f03318c372eefe | all-page extraction; sample |
| DM_SRC_065 | From WDT DB/WDT DB Lab Assignment Solutions/WDT DB Lab Assignment 2 Solutions.pdf | 14 | 6819d0edb6471fee | all-page extraction; sample |
| DM_SRC_066 | From WDT DB/WDT DB Lab Assignment Solutions/WDT DB Lab Assignment 3 Solutions.pdf | 8 | fd1b5322f0f0397b | all-page extraction; sample |
| DM_SRC_067 | From WDT DB/WDT DB Lectures/WDT DB Lecture 1 - Introduction.pdf | 89 | 02e847c02762881b | all-page extraction; sample |
| DM_SRC_068 | From WDT DB/WDT DB Lectures/WDT DB Lecture 2 - Modelling-ER.pdf | 167 | 1fae31a5195808ae | all-page extraction; sample |
| DM_SRC_069 | From WDT DB/WDT DB Lectures/WDT DB Lecture 3 - More on ER.pdf | 167 | 6bc14900176edcdf | all-page extraction; sample |
| DM_SRC_070 | From WDT DB/WDT DB Lectures/WDT DB Lecture 4 - SQL Part 1.pdf | 74 | 708e09b45f87cf76 | all-page extraction; sample |
| DM_SRC_071 | From WDT DB/WDT DB Lectures/WDT DB Lecture 5 - SQL Part 2.pdf | 135 | ad17353b0c008575 | all-page extraction; sample |
| DM_SRC_072 | From WDT DB/WDT DB Lectures/WDT DB Lecture 6 - Relational Model.pdf | 139 | 3bc2551012df6963 | all-page extraction; sample |
| DM_SRC_073 | From WDT DB/WDT DB Lectures/WDT DB Lecture 7 - Database Normalization.pdf | 305 | e01b1907aeaba16c | all-page extraction; sample |
| DM_SRC_074 | From WDT DB/WDT DB Lectures/WDT DB Lecture 8 - JDBC.pdf | 107 | dd74135c69564e31 | all-page extraction; sample |
| DM_SRC_075 | From WDT DB/WDT DB Lectures/WDT DB Lecture 9 - QA.pdf | 30 | 83200bde9ecb1314 | all-page extraction; sample |
| DM_SRC_076 | From WDT DB/WDT DB Notes.pdf | 10 | 3236a4ceb41ad4ae | all-page extraction; sample |
| DM_SRC_077 | README.md | - | 7c6755356f42b254 | complete local scope text |
| HCI_SRC_001 | From HCI/Designing User Experience.pdf | 674 | 3473fcd30c3c10e3 | all-page extraction; sample |
| HCI_SRC_002 | From HCI/HCI Exam Practice/HCI Expert Analysis Practice Solutions.pdf | 4 | f5cf8bcfd591e274 | all-page extraction; sample |
| HCI_SRC_003 | From HCI/HCI Exam Practice/HCI General Exam Practice Solutions.pdf | 6 | 748c658a11c88aa5 | all-page extraction; sample |
| HCI_SRC_004 | From HCI/HCI Exam Practice/HCI Inclusivity Practice Solutions.pdf | 5 | 92c8f40f4bb01136 | all-page extraction; sample |
| HCI_SRC_005 | From HCI/HCI LLM Files/Instructions.md | - | f6e0253ceb18ee3d | text/heading survey; sample |
| HCI_SRC_006 | From HCI/HCI LLM Files/Knowledge Files/Assignments.md | - | 702a7d6ffcf83893 | text/heading survey; sample |
| HCI_SRC_007 | From HCI/HCI LLM Files/Knowledge Files/Course Overview.md | - | 7dfc2168d9a46a97 | text/heading survey; sample |
| HCI_SRC_008 | From HCI/HCI LLM Files/Knowledge Files/Designing User Experience.md | - | 57cfa043d78ff4b7 | text/heading survey; sample |
| HCI_SRC_009 | From HCI/HCI LLM Files/Knowledge Files/Exams.md | - | 115e1224de90161f | text/heading survey; sample |
| HCI_SRC_010 | From HCI/HCI LLM Files/Knowledge Files/Lectures.md | - | 84ae1c8d3655668d | text/heading survey; sample |
| HCI_SRC_011 | From HCI/HCI Lectures/HCI Lecture 1 - Introduction to HCI.pdf | 69 | 0efa15497b9dc80b | all-page extraction; sample |
| HCI_SRC_012 | From HCI/HCI Lectures/HCI Lecture 2 - Requirements and Information Architecture.pdf | 83 | e4424352efa74ec9 | all-page extraction; sample |
| HCI_SRC_013 | From HCI/HCI Lectures/HCI Lecture 3 - User Experience and Accessibility.pdf | 41 | 3d1cccc7fe39578b | all-page extraction; sample |
| HCI_SRC_014 | From HCI/HCI Lectures/HCI Lecture 4 - Design and Prototyping.pdf | 69 | 8fbc434309e210ed | all-page extraction; sample |
| HCI_SRC_015 | From HCI/HCI Lectures/HCI Lecture 5 - Expert Evaluation.pdf | 61 | fc7e19136fc325cd | all-page extraction; sample |
| HCI_SRC_016 | From HCI/HCI Lectures/HCI Lecture 6 - User Evaluation and Controlled Experiments.pdf | 66 | 293f2181de5839de | all-page extraction; sample |
| HCI_SRC_017 | From HCI/HCI Lectures/HCI Lecture 7 - Interactive Systems.pdf | 45 | 2d26197041dece37 | all-page extraction; sample |
| HCI_SRC_018 | From HCI/HCI Lectures/HCI Lecture 8 - Conversational Interfaces.pdf | 102 | 863a527891ac825b | all-page extraction; sample |
| HCI_SRC_019 | From HCI/HCI Lectures/HCI Lecture 9 - Exam Prep.pdf | 11 | c2a80fa9e0a1cb3e | all-page extraction; sample |
| HCI_SRC_020 | From WDT WEB/WDT WEB Exams/WDT WEB Endterms/WDT WEB Endterm 2020.pdf | 22 | 6bd473240d6a4b47 | all-page extraction; sample |
| HCI_SRC_021 | From WDT WEB/WDT WEB Exams/WDT WEB Endterms/WDT WEB Endterm 2022.pdf | 14 | 60576cf4008c296c | all-page extraction; sample |
| HCI_SRC_022 | From WDT WEB/WDT WEB Exams/WDT WEB Endterms/WDT WEB Endterm 2024.pdf | 33 | 0c904ab7575c3979 | all-page extraction; sample |
| HCI_SRC_023 | From WDT WEB/WDT WEB Exams/WDT WEB Endterms/WDT WEB Practice Endterm.pdf | 24 | 7f3395723bf020eb | all-page extraction; sample |
| HCI_SRC_024 | From WDT WEB/WDT WEB Exams/WDT WEB Resits/WDT WEB Resit 2024.pdf | 34 | 2a0e0d5fb6cd6824 | all-page extraction; sample |
| HCI_SRC_025 | From WDT WEB/WDT WEB LLM Files/Instructions.md | - | ca37c9c34fa26013 | text/heading survey; sample |
| HCI_SRC_026 | From WDT WEB/WDT WEB LLM Files/Knowledge Files/Course Overview.md | - | 052f130ac0e7f45b | text/heading survey; sample |
| HCI_SRC_027 | From WDT WEB/WDT WEB LLM Files/Knowledge Files/Exams.md | - | fc036984cc5022ee | text/heading survey; sample |
| HCI_SRC_028 | From WDT WEB/WDT WEB LLM Files/Knowledge Files/Exercises.md | - | 1e320914aac58132 | text/heading survey; sample |
| HCI_SRC_029 | From WDT WEB/WDT WEB LLM Files/Knowledge Files/Lab Assignments.md | - | 7c85c79df7f87c55 | text/heading survey; sample |
| HCI_SRC_030 | From WDT WEB/WDT WEB LLM Files/Knowledge Files/Lectures.md | - | e12a22529c805741 | text/heading survey; sample |
| HCI_SRC_031 | From WDT WEB/WDT WEB Lab Assignment Solutions/WDT WEB Lab Assignment 4 Solutions.pdf | 6 | 30b3881f26a88988 | all-page extraction; sample |
| HCI_SRC_032 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 1 - Why Web Technology & HTTP.pdf | 128 | fb2babc0251f3774 | all-page extraction; sample |
| HCI_SRC_033 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 2 - HTML and CSS.pdf | 76 | 9ff12afec43a9b37 | all-page extraction; sample |
| HCI_SRC_034 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 3 - JavaScript.pdf | 20 | 5faf0064baf55648 | all-page extraction; sample |
| HCI_SRC_035 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 4 - REST and RESTful APIs.pdf | 41 | 3fdc524e047e0637 | all-page extraction; sample |
| HCI_SRC_036 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 5 - NodeJS and Express.pdf | 21 | 7caa0e0b6d52965f | all-page extraction; sample |
| HCI_SRC_037 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 6 - NodeJS & Postgres & Design Patterns.pdf | 17 | 5f8f130ab1e38c47 | all-page extraction; sample |
| HCI_SRC_038 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 7 - More About React.pdf | 8 | d0624e47f9eb50eb | all-page extraction; sample |
| HCI_SRC_039 | From WDT WEB/WDT WEB Lectures/WDT WEB Lecture 8 - Real-time Applications with Web Sockets.pdf | 22 | f50ebe5f16ef9b7d | all-page extraction; sample |
| HCI_SRC_040 | From WDT WEB/WDT WEB Notes.pdf | 18 | 2789ea895d9b275d | all-page extraction; sample |
| HCI_SRC_041 | HCIAP LLM Files/Instructions.md | - | 93798836b8d5aee3 | complete local scope text |
| HCI_SRC_042 | HCIAP LLM Files/Knowledge Files/Assignments (HCI).md | - | 702a7d6ffcf83893 | text/heading survey; sample; duplicate of HCI_SRC_006 |
| HCI_SRC_043 | HCIAP LLM Files/Knowledge Files/Course Overview (HCI).md | - | 2daaf835e3953a7e | text/heading survey; sample |
| HCI_SRC_044 | HCIAP LLM Files/Knowledge Files/Course Overview (WDT WEB).md | - | 842cc269315c4cd0 | text/heading survey; sample |
| HCI_SRC_045 | HCIAP LLM Files/Knowledge Files/Designing User Experience.md | - | 57cfa043d78ff4b7 | text/heading survey; sample; duplicate of HCI_SRC_008 |
| HCI_SRC_046 | HCIAP LLM Files/Knowledge Files/Exams (HCI).md | - | 115e1224de90161f | text/heading survey; sample; duplicate of HCI_SRC_009 |
| HCI_SRC_047 | HCIAP LLM Files/Knowledge Files/Exams (WDT WEB).md | - | fc036984cc5022ee | text/heading survey; sample; duplicate of HCI_SRC_027 |
| HCI_SRC_048 | HCIAP LLM Files/Knowledge Files/Exercises (WDT WEB).md | - | 1e320914aac58132 | text/heading survey; sample; duplicate of HCI_SRC_028 |
| HCI_SRC_049 | HCIAP LLM Files/Knowledge Files/Lab Assignments (WDT WEB).md | - | 7c85c79df7f87c55 | text/heading survey; sample; duplicate of HCI_SRC_029 |
| HCI_SRC_050 | HCIAP LLM Files/Knowledge Files/Lectures (HCI).md | - | 84ae1c8d3655668d | text/heading survey; sample; duplicate of HCI_SRC_010 |
| HCI_SRC_051 | HCIAP LLM Files/Knowledge Files/Lectures (WDT WEB).md | - | e12a22529c805741 | text/heading survey; sample; duplicate of HCI_SRC_030 |
| HCI_SRC_052 | README.md | - | 9198bbc13b901a26 | complete local scope text |
