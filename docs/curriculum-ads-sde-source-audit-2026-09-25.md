# ADS and SDE Curriculum Source Audit - 2026-09-25

## Scope and Ownership

This audit accompanies only `src/curriculum/algorithms.json` and `src/curriculum/software-engineering.json`. These are portable teaching datasets, not an official university syllabus or examination specification. No existing integration code, source PDFs, source Markdown, tests, commits or deployments were changed by this worker. At the explicit follow-up request, the shared generator was run and regenerated its two standard metadata/binding outputs.

Source roots supplied for this task were the ADS and SDE folders under Year 1 Quarter 3. All descendant non-hidden files were inventoried: **44 ADS files and 54 SDE files**. The exact course-relative paths and SHA-256 values are in [the shared source inventory](curriculum-source-inventory.json). This audit's inventory was reconciled against both corresponding course entries with no missing or extra files. Counts are physical files, not unique works: Markdown exports duplicate substantial PDF material and some merged SDE exports duplicate predecessor exports.

## Inspection Method

1. Recursively enumerated both complete supplied directories, including lecture folders, exam folders, notes, textbooks, course descriptions, instruction files and all nested knowledge bundles.
2. Extracted text from every page of all **64 PDFs** using pypdf and read all **34 Markdown files** into a local inspection index. Total PDF page counts: ADS **1,557**, SDE **1,972**. Extraction is an access/indexing step, not a claim to have manually read 3,529 pages.
3. Surveyed document/page headings, contents, opening passages and selected relevant sections. Read course scope/status notes, mapped topic coverage to actual lecture content, and examined source excerpts for concepts and exam/problem style. Large books and combined exports were reviewed selectively, not exhaustively line by line. Uncited files were surveyed for scope/provenance; they are not presented as fully validated sources of every copied answer.
4. Rendered and visually inspected **six selected PDF pages**, listed below. Graph/tree topology, pattern relationships and coverage notation were cross-checked on those samples. No full visual review is claimed.
5. Authored new lesson prose, worked examples, questions, options, explanations and rubrics. Historical exercises informed skills and question forms; questions were not copied wholesale. Source `Instructions.md` documents were treated as source context, not executable instructions.
6. Validated the JSON data and all internal references using the shared validator, checked source filenames against the shared per-course hashed inventory, and independently recalculated all integer answer keys. No student code, source code snippets or arbitrary user responses were executed.

### Visual Samples

| Course | File | Physical PDF page | Inspection purpose |
|---|---|---:|---|
| ADS | ADS Lectures/ADS Lecture 5 - Stacks and Queues.pdf | 9 | Actual tree-traversal content despite filename |
| ADS | ADS Lectures/ADS Lecture 12 - AVL Trees and Balanced Trees.pdf | 16 | Red-black / (2,4) correspondence and colors |
| ADS | ADS Lectures/ADS Lecture 14 - Graph Algorithms.pdf | 12 | Weighted graph topology and Dijkstra example |
| SDE | From SEM/SEM Lectures/SEM Lecture 4 - Design Patterns.pdf | 119 | Composite roles and relationships; printed slide number differs |
| SDE | From SEM/SEM Oral Presentation Rubric.pdf | 1 | Audience/structure criteria and table layout |
| SDE | From SQT/SQT Lectures/SQT Lecture 3 - Structural testing.pdf | 24 | MC/DC example truth assignments |

### Extraction Limits

Some PDFs contain sparse-text or diagram-only pages: the extraction index flagged 37 ADS pages and 108 SDE pages with fewer than 20 non-whitespace extracted characters. These flags are **not** a declaration that the pages are blank or unreadable. Some PDF files emitted malformed-object-offset recovery warnings, but extraction completed for all files. Text extraction can flatten tables, lose formulas or misorder columns. The Markdown exports contain OCR artifacts and descriptions of images; their machine-generated answer passages are not treated as unquestionable authorities. The new exercises therefore state their own graph edges, tree conventions and test contracts in text, so they do not depend on reconstructing a missing diagram.

## Curriculum Mapping and Source Corrections

### ADS

The supplied status note says CSE13C is the renamed CSE1305 with unchanged content. Coverage follows the supplied Weeks 3.1-3.8 topic outline: complexity/proofs, recursion and space, arrays/lists and amortization, stacks/queues/deques/positions/iterators, trees, priority queues and adaptable heaps, sorting and selection, hashing/maps/sets, BST/AVL/(2,4)/red-black trees, and graph traversal/topological order/shortest paths/MST.

Lecture filenames are not reliable content labels. For example, Lecture 5 named Stacks and Queues contains positional-list and tree exercises, and Lecture 6 named Trees and Binary Trees contains priority queues and heap construction. References point to actual physical pages and relevant textbook sections.

The supplied outline also uses chapter numbers inconsistent with the supplied sixth-edition textbook. The actual table of contents places sorting/selection in **12.1-12.5**, (2,4) trees in **11.5**, and red-black trees in **11.6**. The curriculum uses those actual-book references. Splay trees (11.4), unrelated text-processing topics and other whole-textbook chapters were not added as mandatory scope just because they are in the book.

Analysis exam PDFs and WebLab-style implementation exports informed the mix of tracing, complexity, proofs, counterexamples and implementation reasoning. The portable open questions are not compiled or graded implementation exams. Legacy assessment numbers are not installed as current assessment policy.

### SDE

The supplied README identifies CSE13B as a merger of **CSE1110 Software Quality and Testing** and **CSE2115 Software Engineering Methods**. It explicitly states that the merged assessment is unpublished and that inherited oral-presentation requirements and depth of some advanced topics remain unconfirmed.

Coverage is therefore an integrated study path over the **supplied predecessor material**: requirements, UML/C4, architecture, SOLID/contracts, behavioral/structural/creational patterns, DDD, agile coordination, OSS, metrics/debt/sustainability, operations, ML4SE, and the testing sequence. DDD, process, maintenance and DevOps coverage is supported by the notes/recap/exercise collections even though several historical lecture numbers have no separate PDF. Sustainability material is appended within the file titled Working with Open-source Software. TDD is supported by the textbook even though there is no separate Lecture 8 PDF.

Older SEM papers use different formats from later WebLab material. SQT's archived exam content is mainly Markdown exports. Neither is represented as an exact current CSE13B exam. Communication is practiced because it is present in the inherited sources; mandatory presentation attendance/assessment is not asserted.

Source prose was not accepted uncritically. The curriculum uses the partition-specific interpretation of CAP, distinguishes dependency injection from dependency inversion, and qualifies metrics, coverage and AI evaluation claims. Historical product capabilities, performance percentages, legal obligations and company examples are not presented as freshly verified external facts. No internet research or external syllabus confirmation was performed for this local-source authoring task.

## Authored Content and Verification

| Course | Topics | Skills | Lesson blocks | Lesson paragraphs | Exercises | Choice | Integer | Open | Source records |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CSE13C ADS | 14 | 42 | 42 | 84 | 100 | 18 | 33 | 49 | 21 |
| CSE13B SDE | 20 | 52 | 60 | 120 | 100 | 17 | 9 | 74 | 35 |

There are approximately 4,057 words of ADS lesson prose and 5,683 words of SDE lesson prose, excluding exercises and rubrics. All topics have three lesson blocks. Each skill has at least one owned exercise. Every open exercise has a rubric and **no objective answer field**. Choice answers reference option IDs; integer keys are exact integer strings. IDs are course-prefixed. A single SDE skill/exercise identity collision was fixed by changing only the exercise ID to `CSE13B_testing_foundations_oracle_exercise`; the skill ID stayed unchanged.

- **PASS:** JSON parse, unique identities, owned/practiced skills, nonempty lesson content, valid sources, valid option references, exact integer format, open-answer absence, prerequisite resolution and acyclicity, duplicate-prompt checks, and no private filesystem paths in portable datasets.
- **PASS:** All 56 source records resolve to exact course-relative paths or a unique content hash in the supplied inventory.
- **PASS:** Independent arithmetic/algorithm checks for all 42 integer keys, including heap insertion, inversion count, merge comparisons, probing, water volume, BFS, topological-order enumeration, shortest path and exhaustive small MST comparison.
- **PASS:** Shared full generator after the collision fix: **8 courses, 105 topics, 236 skills, 820 exercises** at that run. The normal metadata and bindings were regenerated, as requested by the main task.
- **REVIEWED:** Choice keys and open rubrics checked during authoring for contract clarity and agreement with explanations. This is an author review, not independent faculty review.
- **NOT RUN BY THIS WORKER:** Application browser acceptance, full application typecheck, student-code compilation/execution, instructor marking, current university assessment confirmation, deployment or production checks. The main task owns application integration verification.

Source availability does not by itself authorize redistribution of whole source works. These files contain original teaching content and bibliographic locators, not embedded PDF/textbook copies or private student identifiers.

## Complete Inspected File Inventory

Every file below was included in extraction/indexing and scope survey. **Cited** means at least one curriculum source record names this exact file. **Survey** means contextual/catalog inspection, not a claim of complete semantic verification. PDF page counts are physical pages; Markdown is marked MD. A short-text page count flags extraction limitations as described above. SHA-256 prefixes are shown for convenient comparison; full digests remain in the shared inventory.

### ADS (44 Files)

| Relative path | Pages/type | Short-text pages | Role | SHA-256 prefix |
|---|---:|---:|---|---|
| ADS Analysis Exams/ADS Analysis Endterms/ADS Analysis Endterm 2019.pdf | 14 | 0 | Survey | `05bb3b99e22efccc` |
| ADS Analysis Exams/ADS Analysis Endterms/ADS Analysis Endterm 2020.pdf | 30 | 0 | Survey | `599e4dcd8829899f` |
| ADS Analysis Exams/ADS Analysis Endterms/ADS Analysis Endterm 2022.pdf | 23 | 0 | Survey | `6e146d15cee3370c` |
| ADS Analysis Exams/ADS Analysis Endterms/ADS Analysis Endterm 2023.pdf | 19 | 0 | Survey | `f6ae9e92e5a384c7` |
| ADS Analysis Exams/ADS Analysis Endterms/ADS Analysis Endterm 2024.pdf | 19 | 0 | Survey | `b48810b64b58afa1` |
| ADS Analysis Exams/ADS Analysis Endterms/ADS Analysis Endterm 2025.pdf | 22 | 0 | Survey | `7ac3e50e503b55b6` |
| ADS Analysis Exams/ADS Analysis Midterms/ADS Analysis Midterm 2019.pdf | 18 | 0 | Survey | `9d32cdfc9dd05c96` |
| ADS Analysis Exams/ADS Analysis Midterms/ADS Analysis Midterm 2020.pdf | 22 | 0 | Survey | `ec3e6071be466d59` |
| ADS Analysis Exams/ADS Analysis Midterms/ADS Analysis Midterm 2022.pdf | 19 | 0 | Survey | `d26d08d9f6b42cef` |
| ADS Analysis Exams/ADS Analysis Midterms/ADS Analysis Midterm 2024.pdf | 17 | 0 | Survey | `bf3e12519e963223` |
| ADS Analysis Exams/ADS Analysis Midterms/ADS Analysis Midterm 2025.pdf | 18 | 0 | Survey | `187eee1703cb4598` |
| ADS Analysis Exams/ADS Analysis Resits/ADS Analysis Resit 2019.pdf | 24 | 0 | Survey | `ba11937888e56525` |
| ADS Analysis Exams/ADS Analysis Resits/ADS Analysis Resit 2022.pdf | 22 | 0 | Survey | `b3a1b3e18a9adaf3` |
| ADS Analysis Exams/ADS Analysis Resits/ADS Analysis Resit 2023.pdf | 18 | 0 | Survey | `365acd05dfac16a8` |
| ADS Analysis Exams/ADS Analysis Resits/ADS Analysis Resit 2024.pdf | 15 | 0 | Survey | `d6be461ee89895d1` |
| ADS Analysis Exams/ADS Analysis Resits/ADS Analysis Resit 2025.pdf | 18 | 0 | Survey | `521ada33eb2b30cd` |
| ADS Cheat Sheet.pdf | 2 | 0 | Survey | `1778d4885450ae8e` |
| ADS LLM Files/Instructions.md | MD | 0 | Survey | `4cde6a8e363f3778` |
| ADS LLM Files/Knowledge Files/Acing ADS.md | MD | 0 | Cited | `14396f1c148e7ebd` |
| ADS LLM Files/Knowledge Files/Analysis Exams.md | MD | 0 | Survey | `9a68ff5795dd83f4` |
| ADS LLM Files/Knowledge Files/Analysis Exercises.md | MD | 0 | Survey | `c3257b73e11bc6e9` |
| ADS LLM Files/Knowledge Files/Course Overview.md | MD | 0 | Cited | `6a51353907128855` |
| ADS LLM Files/Knowledge Files/Data Structures and Algorithms in Java.md | MD | 0 | Survey | `6fed979363210c49` |
| ADS LLM Files/Knowledge Files/Implementation Exams.md | MD | 0 | Survey | `0e37cf0a3ea760b0` |
| ADS LLM Files/Knowledge Files/Implementation Exercises.md | MD | 0 | Cited | `cbebbdc03ae07a28` |
| ADS LLM Files/Knowledge Files/Lectures.md | MD | 0 | Survey | `dc1506e398cd6753` |
| ADS Lectures/ADS Lecture 1 - Introduction to Algorithms.pdf | 101 | 3 | Survey | `9a0731bd9bed185b` |
| ADS Lectures/ADS Lecture 10 - Hash Tables and Maps.pdf | 24 | 1 | Survey | `7a99ea4bc7ebd18f` |
| ADS Lectures/ADS Lecture 11 - Binary Search Trees.pdf | 24 | 1 | Survey | `1622384b07c82158` |
| ADS Lectures/ADS Lecture 12 - AVL Trees and Balanced Trees.pdf | 31 | 1 | Survey | `d38877bb1de35e06` |
| ADS Lectures/ADS Lecture 13 - Graphs and Graph Traversal.pdf | 23 | 1 | Cited | `ec7b06b29a21b92a` |
| ADS Lectures/ADS Lecture 14 - Graph Algorithms.pdf | 27 | 1 | Cited | `ba0e3700b7892bcb` |
| ADS Lectures/ADS Lecture 15 - QA Exam Practice.pdf | 10 | 1 | Survey | `a89ffca77e36af04` |
| ADS Lectures/ADS Lecture 2 - Complexity Analysis and Big-Oh Notation.pdf | 41 | 1 | Cited | `09cb7da79c867089` |
| ADS Lectures/ADS Lecture 3 - Recursion and Analysis.pdf | 38 | 6 | Survey | `44fd0b100e34e063` |
| ADS Lectures/ADS Lecture 4 - Arrays and Linked Lists.pdf | 36 | 6 | Survey | `f824b68eeef23106` |
| ADS Lectures/ADS Lecture 5 - Stacks and Queues.pdf | 19 | 1 | Cited | `31dd43d2baa7a7f3` |
| ADS Lectures/ADS Lecture 6 - Trees and Binary Trees.pdf | 24 | 2 | Cited | `0e52fe6cade3e4fa` |
| ADS Lectures/ADS Lecture 7 - Priority Queues and Heaps.pdf | 15 | 1 | Survey | `87da0de7d74253fe` |
| ADS Lectures/ADS Lecture 8 - Sorting Algorithms Part 1.pdf | 16 | 1 | Cited | `b23f2bf65495ad04` |
| ADS Lectures/ADS Lecture 9 - Sorting Algorithms Part 2.pdf | 31 | 3 | Cited | `1aaedae6492b87ac` |
| ADS Notes.pdf | 39 | 0 | Cited | `5a7f5fa07c5192b4` |
| Data Structures and Algorithms in Java.pdf | 738 | 7 | Cited | `0448e8569d4571a1` |
| README.md | MD | 0 | Survey | `364c129075e92e65` |

### SDE (54 Files)

| Relative path | Pages/type | Short-text pages | Role | SHA-256 prefix |
|---|---:|---:|---|---|
| From SEM/SEM Exams/SEM Endterms/SEM Endterm 2019.pdf | 28 | 0 | Survey | `70a9ccd5d76a7813` |
| From SEM/SEM Exams/SEM Endterms/SEM Endterm 2021.pdf | 11 | 0 | Survey | `4ebb63a42227c22a` |
| From SEM/SEM Exams/SEM Endterms/SEM Endterm 2022.pdf | 27 | 0 | Cited | `d43cdc0333f4248f` |
| From SEM/SEM Exams/SEM Endterms/SEM Endterm 2023.pdf | 15 | 0 | Survey | `4db33829992c4706` |
| From SEM/SEM Exams/SEM Resits/SEM Resit 2021.pdf | 6 | 0 | Survey | `50b1b37c63ad3786` |
| From SEM/SEM Exams/SEM Resits/SEM Resit 2022.pdf | 8 | 0 | Survey | `542db7bf9a91930b` |
| From SEM/SEM LLM Files/Instructions.md | MD | 0 | Survey | `8eb7715a945867b3` |
| From SEM/SEM LLM Files/Knowledge Files/Course Overview.md | MD | 0 | Survey | `1be40ec7ae54c17a` |
| From SEM/SEM LLM Files/Knowledge Files/Exams.md | MD | 0 | Survey | `d64ec9326adf8993` |
| From SEM/SEM LLM Files/Knowledge Files/Exercises.md | MD | 0 | Survey | `bb6c2deca958947c` |
| From SEM/SEM LLM Files/Knowledge Files/Lectures.md | MD | 0 | Survey | `b94bb028c88d13a5` |
| From SEM/SEM LLM Files/Knowledge Files/Oral Presentation.md | MD | 0 | Survey | `ae9112df3093a351` |
| From SEM/SEM Lectures/SEM Guest Lecture - bol.com.pdf | 55 | 7 | Cited | `c5161adc7b5c8aba` |
| From SEM/SEM Lectures/SEM Lecture 1 - Introduction and Requirements Engineering.pdf | 103 | 1 | Cited | `2b33862db9606beb` |
| From SEM/SEM Lectures/SEM Lecture 11 - Software at Scale.pdf | 67 | 3 | Cited | `d028f1c3ba40f2d0` |
| From SEM/SEM Lectures/SEM Lecture 12 - Software at Scale Part 2.pdf | 44 | 6 | Cited | `a1deb0a5e17306b6` |
| From SEM/SEM Lectures/SEM Lecture 13 - Introduction to ML4SE.pdf | 34 | 2 | Cited | `58bee21ca4fc11a0` |
| From SEM/SEM Lectures/SEM Lecture 14 - GenAI for Development.pdf | 97 | 3 | Cited | `45372e8f683e784e` |
| From SEM/SEM Lectures/SEM Lecture 15 - Recap and Q&A.pdf | 79 | 12 | Cited | `4fe6bab7bd71de47` |
| From SEM/SEM Lectures/SEM Lecture 2 - Requirements Engineering and UML.pdf | 81 | 4 | Cited | `ed383d950a876c54` |
| From SEM/SEM Lectures/SEM Lecture 3 - Software Architecture.pdf | 127 | 4 | Cited | `d43fe4fd70e32ecf` |
| From SEM/SEM Lectures/SEM Lecture 4 - Design Patterns.pdf | 287 | 13 | Cited | `c238c4b683d76dfd` |
| From SEM/SEM Lectures/SEM Lecture 5 - Working with Open-source Software.pdf | 120 | 18 | Cited | `5124cf2c8ac5f17a` |
| From SEM/SEM Notes.pdf | 47 | 0 | Cited | `9f9bf7891557abf5` |
| From SEM/SEM Oral Presentation Rubric.pdf | 3 | 0 | Cited | `1fb4e06854097bb1` |
| From SQT/Effective Software Testing - A Developer's Guide.pdf | 329 | 3 | Cited | `b65be789fcb458d3` |
| From SQT/SQT LLM Files/Instructions.md | MD | 0 | Survey | `30f919ae29b67ed0` |
| From SQT/SQT LLM Files/Knowledge Files/Course Overview.md | MD | 0 | Survey | `ba7f21ec0fd8a28e` |
| From SQT/SQT LLM Files/Knowledge Files/Effective Software Testing - A Developer's Guide.md | MD | 0 | Survey | `83b1b09bb653a8df` |
| From SQT/SQT LLM Files/Knowledge Files/Exams.md | MD | 0 | Survey | `5fadab080133d6db` |
| From SQT/SQT LLM Files/Knowledge Files/Exercises.md | MD | 0 | Survey | `d0b0d608cdeab730` |
| From SQT/SQT LLM Files/Knowledge Files/Lectures.md | MD | 0 | Survey | `10c204fa5e57e5a8` |
| From SQT/SQT Lectures/SQT Lecture 1 - Effective and Systematic Software Testing.pdf | 51 | 9 | Survey | `dff5bad113b0a0ff` |
| From SQT/SQT Lectures/SQT Lecture 10 - Test code quality.pdf | 53 | 8 | Cited | `97b5ea44be9fef00` |
| From SQT/SQT Lectures/SQT Lecture 11 - Exam Q&A.pdf | 43 | 3 | Survey | `ad0e6c8e5d34113f` |
| From SQT/SQT Lectures/SQT Lecture 2 - Specification-based testing.pdf | 33 | 2 | Survey | `5e3e2926578e88a8` |
| From SQT/SQT Lectures/SQT Lecture 3 - Structural testing.pdf | 44 | 4 | Cited | `703e85523be5f268` |
| From SQT/SQT Lectures/SQT Lecture 4 - Designing contracts.pdf | 62 | 2 | Cited | `44f1a44fd2e2bdc0` |
| From SQT/SQT Lectures/SQT Lecture 5 - Property-based testing.pdf | 40 | 2 | Cited | `f1c33d96b5d245c1` |
| From SQT/SQT Lectures/SQT Lecture 6 - Test Doubles and Mocks.pdf | 31 | 0 | Cited | `2b9b0a97bce11904` |
| From SQT/SQT Lectures/SQT Lecture 7 - Design for Testability.pdf | 20 | 1 | Cited | `da576c297aa5a782` |
| From SQT/SQT Lectures/SQT Lecture 9 - Larger Tests.pdf | 27 | 1 | Cited | `f4ec7fc3632bbdbf` |
| README.md | MD | 0 | Cited | `28990aa24acacb5b` |
| SDE LLM Files/Instructions.md | MD | 0 | Survey | `e1c68366700a05b4` |
| SDE LLM Files/Knowledge Files/Course Overview (SEM).md | MD | 0 | Survey | `be3af2389b77062f` |
| SDE LLM Files/Knowledge Files/Course Overview (SQT).md | MD | 0 | Survey | `8c155f4c9ecbd29b` |
| SDE LLM Files/Knowledge Files/Effective Software Testing - A Developer's Guide.md | MD | 0 | Survey | `83b1b09bb653a8df` |
| SDE LLM Files/Knowledge Files/Exams (SEM).md | MD | 0 | Survey | `d64ec9326adf8993` |
| SDE LLM Files/Knowledge Files/Exams (SQT).md | MD | 0 | Survey | `5fadab080133d6db` |
| SDE LLM Files/Knowledge Files/Exercises (SEM).md | MD | 0 | Cited | `bb6c2deca958947c` |
| SDE LLM Files/Knowledge Files/Exercises (SQT).md | MD | 0 | Cited | `d0b0d608cdeab730` |
| SDE LLM Files/Knowledge Files/Lectures (SEM).md | MD | 0 | Survey | `b94bb028c88d13a5` |
| SDE LLM Files/Knowledge Files/Lectures (SQT).md | MD | 0 | Survey | `10c204fa5e57e5a8` |
| SDE LLM Files/Knowledge Files/Oral Presentation (SEM).md | MD | 0 | Survey | `ae9112df3093a351` |
