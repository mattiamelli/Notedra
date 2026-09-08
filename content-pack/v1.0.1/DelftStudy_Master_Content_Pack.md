# DelftStudy - MASTER CONTENT PACK

**Pack version:** 1.0.1  
**Schema version:** 1.1.0  
**Generated:** 2026-09-08T22:40:44.202083+00:00  

This is a PATCH release of the previously analysed academic taxonomy. The 90-PDF academic analysis and 43-topic / 147-skill taxonomy were not rebuilt; only production blockers verified by the independent audit were corrected.

## Production blocker corrections

- Removed the duplicate `RL_T07_FUNCTIONS_RELATIONS` reference from `RL_RESIT_2023_Q4` and rebuilt question relation edges.
- Locked all `UNVERIFIED_OR_DRILL_ONLY` mappings out of generation, mastery, exam-readiness, and verified frequency aggregation.
- Historical frequency by assessment type now counts unique assessment documents.
- Verified solution material directly in all 16 R&L assessment PDFs and corrected `solution_included`.
- Added exact physical PDF page provenance for all numbered assessment questions; analytical IP components remain UNKNOWN when no exact original question boundary exists.
- Strengthened JSON Schema with exact counts, enums, typed relations, unique items, ID membership constraints, per-ID exact-occurrence constraints, and uncertainty-policy conditionals.
- Clarified that the handoff contains source records/hashes, not PDF binaries/full text.

## Corpus counts

| metric | value |
| --- | --- |
| documents | 90 |
| IP | 28 |
| CO | 29 |
| R&L | 33 |
| topics | 43 |
| subtopics | 105 |
| atomic skills | 147 |
| assessments | 37 |
| question/component mappings | 489 |

## Corpus inventory

### IP - Introduction to Programming

| document_id | document | type | status | era | style weight | solutions | solution verification | sha256 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IP_LEC_01 | IP Lecture 1 - First Steps.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 6382355d495c… |
| IP_LEC_02 | IP Lecture 2 - Programming Structures.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 919b8ea50f22… |
| IP_LEC_03 | IP Lecture 3 - Methods.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 2f6376e5fa56… |
| IP_LEC_04 | IP Lecture 4 - Classes.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 09273694c6fd… |
| IP_LEC_05 | IP Lecture 5 - Arrays.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 36122c0245a2… |
| IP_LEC_06 | IP Lecture 6 - Container Classes.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 670f0acfd35f… |
| IP_LEC_07 | IP Lecture 7 - Class Composition & Libraries.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | b75f2ae8961e… |
| IP_LEC_08 | IP Lecture 8 - Unit Tests.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 9375cd20aa2d… |
| IP_LEC_09 | IP Lecture 9 - Inheritance.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 81ebbf803744… |
| IP_LEC_10 | IP Lecture 10 - Polymorphism.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 82387ffde8b7… |
| IP_LEC_11 | IP Lecture 11 - Equality & Hashcodes.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | ef12290236da… |
| IP_LEC_12 | IP Lecture 12 - Exceptions.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 4c2d7f7bd047… |
| IP_LEC_13 | IP Lecture 13 - Debugging.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 0082526ef9ec… |
| IP_LEC_14 | IP Lecture 14 - Code Quality, Strings & Generics.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 42f6f713b9c3… |
| IP_LEC_15 | IP Lecture 15 - Input Output Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | b57559fa3227… |
| IP_LEC_16 | IP Lecture 16 - Input Output Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | ed25e3ba2fd5… |
| IP_LEC_17 | IP Lecture 17 - Functional Java.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 206da7129ad6… |
| IP_LEC_18 | IP Lecture 18 - Program Design.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 2ef49475562c… |
| IP_LEC_19 | IP Lecture 19 - Modern Java.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | ac4508c19ae8… |
| IP_LEC_20 | IP Lecture 20 - Threads.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | c35d85d4a6ce… |
| IP_LEC_21 | IP Lecture 21 - Exam Practice.pdf | EXAM_PREPARATION | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 0770914dc752… |
| IP_RESIT_2024 | IP Programming Resit 2024.pdf | RESIT | OFFICIAL_ASSESSMENT | RECENT | HIGH | no | N/A | f85091bea8f3… |
| IP_MOCK_2024 | IP Programming Mock 2024.pdf | MOCK | OFFICIAL_PRACTICE_MATERIAL | CURRENT | VERY_HIGH | no | N/A | 1390f5c687e9… |
| IP_MOCK_2023 | IP Programming Mock 2023.pdf | MOCK | OFFICIAL_PRACTICE_MATERIAL | RECENT | HIGH | no | N/A | d9a0a61d9770… |
| IP_END_2024 | IP Programming Endterm 2024.pdf | ENDTERM | OFFICIAL_ASSESSMENT | CURRENT | VERY_HIGH | no | N/A | 3b60ffd01c44… |
| IP_END_2023 | IP Programming Endterm 2023.pdf | ENDTERM | OFFICIAL_ASSESSMENT | RECENT | HIGH | no | N/A | e93b0b8bae75… |
| IP_END_2021 | IP Programming Endterm 2021.pdf | ENDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | MEDIUM_HIGH | no | N/A | 6361bd5e24e1… |
| IP_END_2020 | IP Programming Endterm 2020.pdf | ENDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | MEDIUM | no | N/A | 5ff9046d6bb0… |

### CO - Computer Organisation

| document_id | document | type | status | era | style weight | solutions | solution verification | sha256 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CO_LEC_01 | CO Lecture 1 - History.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 0b13c9143f12… |
| CO_LEC_02 | CO Lecture 2 - Assembly.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | a4412b3ce78a… |
| CO_LEC_03 | CO Lecture 3 - Logic Circuits Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | a43e8e11995b… |
| CO_LEC_04 | CO Lecture 4 - Logic Circuits Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 3c9f10594770… |
| CO_LEC_05 | CO Lecture 5 - Data Representation Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | f2925011ac37… |
| CO_LEC_06 | CO Lecture 6 - Data Representation Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 4511ee2a4ce7… |
| CO_LEC_07 | CO Lecture 7 - ISA Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 145765ac18f2… |
| CO_LEC_08 | CO Lecture 8 - ISA Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | a950add76795… |
| CO_LEC_09 | CO Lecture 9 - BPU Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | c2fb7e418c48… |
| CO_LEC_10 | CO Lecture 10 - BPU Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 9992ad49bd29… |
| CO_LEC_11 | CO Lecture 11 - IO.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | fec6ffcc2a70… |
| CO_LEC_12 | CO Lecture 12 - Memory.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | b29615f566ce… |
| CO_LEC_13 | CO Lecture 13 - Caching.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 716aa3b2e850… |
| CO_LEC_14 | CO Lecture 14 - Pipelining.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 2eeeb6fdb1df… |
| CO_LEC_15 | CO Lecture 15 - Parallel & Virtual Memory.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 9a32a821b3fa… |
| CO_END_FILE2020 | CO Endterm 2020.pdf | ENDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | LOW_MEDIUM | no | N/A | ecabb69d11dc… |
| CO_END_FILE2025_SOL | CO Endterm 2025 Solutions.pdf | ENDTERM | OFFICIAL_ASSESSMENT | CURRENT | VERY_HIGH | yes | N/A | 550c7e720cea… |
| CO_END_FILE2024 | CO Endterm 2024.pdf | ENDTERM | OFFICIAL_ASSESSMENT | RECENT | HIGH | no | N/A | 31cf60bb621f… |
| CO_END_FILE2023 | CO Endterm 2023.pdf | ENDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | HIGH | no | N/A | 94b570a81808… |
| CO_END_FILE2022 | CO Endterm 2022.pdf | ENDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | MEDIUM_HIGH | no | N/A | d760d40fdb89… |
| CO_END_EXAMPLE | CO Endterm 2021.pdf | EXAM_PREPARATION | OFFICIAL_PRACTICE_MATERIAL | HISTORICAL | PRACTICE_ONLY | no | N/A | 370cedb36b6f… |
| CO_RESIT_2025_SOL | CO Resit 2025 Solutions.pdf | RESIT | OFFICIAL_ASSESSMENT | CURRENT | VERY_HIGH | yes | N/A | c6e3e6713267… |
| CO_RESIT_2024 | CO Resit 2024.pdf | RESIT | OFFICIAL_ASSESSMENT | RECENT | HIGH | no | N/A | 3afd1447a8d1… |
| CO_RESIT_2023 | CO Resit 2023.pdf | RESIT | OFFICIAL_ASSESSMENT | RECENT | HIGH | no | N/A | cbc98c58a147… |
| CO_MID_FILE2025_SOL | CO Midterm 2025 Solutions.pdf | MIDTERM | OFFICIAL_ASSESSMENT | CURRENT | VERY_HIGH | yes | N/A | 9c78643694f2… |
| CO_MID_FILE2024 | CO Midterm 2024.pdf | MIDTERM | OFFICIAL_ASSESSMENT | RECENT | HIGH | no | N/A | c6449d04a15d… |
| CO_MID_FILE2022 | CO Midterm 2022.pdf | MIDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | MEDIUM_HIGH | no | N/A | 8e862bdb5c65… |
| CO_MID_EXAMPLE | CO Midterm 2021.pdf | EXAM_PREPARATION | OFFICIAL_PRACTICE_MATERIAL | HISTORICAL | PRACTICE_ONLY | no | N/A | 4d69457785a5… |
| CO_MID_FILE2020 | CO Midterm 2020.pdf | MIDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | LOW_MEDIUM | no | N/A | 8c6428711750… |

### R&L - Reasoning and Logic

| document_id | document | type | status | era | style weight | solutions | solution verification | sha256 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RL_LEC_00 | R&L Lecture 0 - Introduction.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | fa8ece42f92d… |
| RL_LEC_01 | R&L Lecture 1 - Propositional Calculus Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | a22b9b230ea3… |
| RL_LEC_02 | R&L Lecture 2 - Propositional Calculus Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 8415854093bb… |
| RL_LEC_03 | R&L Lecture 3 - First-Order Logic.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 053ff0ce0122… |
| RL_LEC_04 | R&L Lecture 4 - Methods of Proof Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | f57b520e9f91… |
| RL_LEC_05 | R&L Lecture 5 - Methods of Proof Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | f0233d7dc90b… |
| RL_LEC_06 | R&L Lecture 6 - Induction and Recursion Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 40e5e409b61b… |
| RL_LEC_07 | R&L Lecture 7 - Induction and Recursion Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | c07f460b35ab… |
| RL_LEC_08 | R&L Lecture 8 - Induction and Recursion Part 3.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | HISTORICAL | NOT_APPLICABLE | no | N/A | ae72f72ff3a4… |
| RL_LEC_09 | R&L Lecture 9 - Set Theory Part 1.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | da6e89b05f6a… |
| RL_LEC_10 | R&L Lecture 10 - Set Theory Part 2.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | f2532f55bbf1… |
| RL_LEC_11 | R&L Lecture 11 - Set Theory Part 3.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 43410db70e1f… |
| RL_LEC_12 | R&L Lecture 12 - Functions & Relations.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | f0a41ddcdc3c… |
| RL_LEC_13 | R&L Lecture 13 - The limitations of Set Theory.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 73c688fa5ae0… |
| RL_LEC_14 | R&L Lecture 14 - Functions on trees and graphs.pdf | LECTURE | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 48db36c461b8… |
| RL_LEC_15 | R&L Lecture 15 - Exam Prep.pdf | EXAM_PREPARATION | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | cb151d94a896… |
| RL_LEC_16 | R&L Lecture 16 - The Last One.pdf | EXAM_PREPARATION | OFFICIAL_COURSE_MATERIAL | CURRENT | NOT_APPLICABLE | no | N/A | 4ad61fe453c7… |
| RL_END_FILE2020 | R&L Endterm 2020.pdf | ENDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | LOW | yes | VERIFIED | ecb36ce19135… |
| RL_RESIT_2025 | R&L Resit 2025.pdf | RESIT | OFFICIAL_ASSESSMENT | CURRENT | VERY_HIGH | yes | VERIFIED | 463dde16b9b5… |
| RL_RESIT_2024 | R&L Resit 2024.pdf | RESIT | OFFICIAL_ASSESSMENT | RECENT | HIGH | yes | VERIFIED | c588362700a5… |
| RL_RESIT_2023 | R&L Resit 2023.pdf | RESIT | OFFICIAL_ASSESSMENT | RECENT | HIGH | yes | VERIFIED | 9af7e1640ad6… |
| RL_RESIT_2022 | R&L Resit 2022.pdf | RESIT | OFFICIAL_ASSESSMENT | HISTORICAL | MEDIUM_HIGH | yes | VERIFIED | 4773106811b2… |
| RL_RESIT_2020 | R&L Resit 2020.pdf | RESIT | OFFICIAL_ASSESSMENT | HISTORICAL | LOW | yes | VERIFIED | 133ddc8a6b4d… |
| RL_MID_2025 | R&L Midterm 2025.pdf | MIDTERM | OFFICIAL_ASSESSMENT | CURRENT | VERY_HIGH | yes | VERIFIED | 792352a68c33… |
| RL_MID_2024 | R&L Midterm 2024.pdf | MIDTERM | OFFICIAL_ASSESSMENT | RECENT | HIGH | yes | VERIFIED | 20476101c3ec… |
| RL_MID_2023 | R&L Midterm 2023.pdf | MIDTERM | OFFICIAL_ASSESSMENT | RECENT | HIGH | yes | VERIFIED | db55f3971863… |
| RL_MID_2022 | R&L Midterm 2022.pdf | MIDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | MEDIUM_HIGH | yes | VERIFIED | b14ec5055aff… |
| RL_MID_2020 | R&L Midterm 2020.pdf | MIDTERM | OFFICIAL_ASSESSMENT | HISTORICAL | LOW_MEDIUM | yes | VERIFIED | 6927cfcd3a3a… |
| RL_MCQ_2023 | R&L MCQ Test 2023.pdf | MCQ_TEST | OFFICIAL_ASSESSMENT | RECENT | LOW_FOR_CURRENT_EXAM_STYLE | yes | VERIFIED | d951bb3e9cb2… |
| RL_MCQ_2021 | R&L MCQ Test 2021.pdf | MCQ_TEST | OFFICIAL_ASSESSMENT | HISTORICAL | LOW_FOR_CURRENT_EXAM_STYLE | yes | VERIFIED | 44864c7e35ef… |
| RL_MCQ_2020 | R&L MCQ Test 2020.pdf | MCQ_TEST | OFFICIAL_ASSESSMENT | HISTORICAL | LOW_FOR_CURRENT_EXAM_STYLE | yes | VERIFIED | f226c326cea6… |
| RL_END_2025 | R&L Endterm 2025.pdf | ENDTERM | OFFICIAL_ASSESSMENT | CURRENT | VERY_HIGH | yes | VERIFIED | a0f3d7fa0db5… |
| RL_END_2024 | R&L Endterm 2024.pdf | ENDTERM | OFFICIAL_ASSESSMENT | RECENT | HIGH | yes | VERIFIED | 503f3992b17d… |

# Taxonomy and evidence

# IP - Introduction to Programming

## IP_T01_JAVA_BASICS - Java basics and data

Primitive/reference types, variables, expressions, casting, output, and numeric behavior.

**Confidence:** `HIGH`  
**Prerequisite topics:** None  
**Source documents:** IP Lecture 1 - First Steps.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK01_01_DECLARE_ASSIGN | Declare and update variables | Choose valid types; declare, assign, and update variables. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK01_02_REASON_TYPES | Reason about Java types | Determine expression/variable types and primitive vs reference behavior. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK01_03_EVAL_EXPRESSIONS | Evaluate Java expressions | Apply precedence and Java numeric rules. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK01_04_CAST_CONVERT | Use and reason about casts | Determine when casts are required and their result. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK01_05_NUMERIC_EDGE | Recognize numeric edge cases | Identify overflow, truncation, and precision behavior. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T02_CONTROL_FLOW - Control flow and programming structures

Boolean expressions, branching, loops, switch, and aggregation.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T01_JAVA_BASICS  
**Source documents:** IP Lecture 2 - Programming Structures.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK02_01_BOOLEAN_CONDITIONS | Build boolean conditions | Construct and evaluate conditions from a specification. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK02_02_BRANCH_TRACE | Trace branching | Predict nested if/else or switch control flow. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK02_03_LOOP_TRACE | Trace loops | Track state, termination, and results. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK02_04_LOOP_IMPLEMENT | Implement iterative processing | Write traversal/count/filter/search/aggregation loops. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## IP_T03_METHODS_SCOPE - Methods, parameters, scope, and calls

Method extraction, signatures, parameters, return values, scope, calls, and recursion foundations.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T01_JAVA_BASICS, IP_T02_CONTROL_FLOW  
**Source documents:** IP Lecture 3 - Methods.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK03_01_DEFINE_METHOD | Define methods from requirements | Choose parameters/return type and implement coherent methods. | IP_SK01_01_DECLARE_ASSIGN, IP_SK02_01_BOOLEAN_CONDITIONS | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK03_02_TRACE_CALLS | Trace method calls | Reason about arguments, locals, and return values. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK03_03_SCOPE | Reason about scope | Determine visible identifier bindings and persistent changes. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK03_04_PASS_BY_VALUE | Reason about Java pass-by-value | Distinguish parameter reassignment from object mutation. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T04_CLASSES_OBJECTS - Classes, objects, constructors, and encapsulation

Fields, constructors, methods, this, static/instance state, and references.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T03_METHODS_SCOPE  
**Source documents:** IP Lecture 4 - Classes.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK04_01_MODEL_CLASS | Model a domain class | Choose fields and constructors to represent an entity. | IP_SK03_01_DEFINE_METHOD | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK04_02_CONSTRUCTOR_STATE | Reason about constructors and state | Predict/implement initial object state and this. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK04_03_INSTANCE_STATIC | Distinguish instance and static context | Choose class-level versus per-object state/behavior. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK04_04_ENCAPSULATION | Apply basic encapsulation | Expose behavior/data through appropriate methods. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T05_ARRAYS_RECURSION - Arrays, traversal, aliasing, and recursion

Array processing, copying/aliasing, traversal, and recursive call behavior.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T02_CONTROL_FLOW, IP_T03_METHODS_SCOPE  
**Source documents:** IP Lecture 5 - Arrays.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK05_01_ARRAY_TRAVERSE | Traverse arrays safely | Use indices/loops without off-by-one errors. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK05_02_ARRAY_PROCESS | Process arrays | Search, filter, aggregate, or transform arrays. | IP_SK02_04_LOOP_IMPLEMENT | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK05_03_ARRAY_ALIAS | Reason about array aliases | Predict assignment, parameter-passing, and mutation effects. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK05_04_RECURSION | Implement and trace simple recursion | Identify base/recursive cases and trace finite recursive calls. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T06_CONTAINER_CLASSES - Container classes and representation invariants

Collection-like abstractions over arrays, internal invariants, and collection semantics.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T04_CLASSES_OBJECTS, IP_T05_ARRAYS_RECURSION  
**Source documents:** IP Lecture 6 - Container Classes.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK06_01_CONTAINER_IMPL | Implement an array-backed container | Maintain storage while adding/removing/searching. | IP_SK05_02_ARRAY_PROCESS, IP_SK04_01_MODEL_CLASS | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK06_02_REP_INVARIANT | Maintain representation invariants | Preserve valid internal state after mutation. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK06_03_COLLECTION_SEMANTICS | Implement collection semantics | Distinguish list-like and set-like behavior. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T07_COMPOSITION_LIBRARIES - Composition, object relationships, and Java libraries

Has-a relationships, multiplicities, standard collections, imports, and API/Javadoc use.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T04_CLASSES_OBJECTS, IP_T06_CONTAINER_CLASSES  
**Source documents:** IP Lecture 7 - Class Composition & Libraries.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK07_01_COMPOSE_MODEL | Design composed object models | Represent domain relationships with references/collections. | IP_SK04_01_MODEL_CLASS | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK07_02_API_USE | Use documented Java APIs | Find and correctly apply allowed library methods/types. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T08_TESTING - Unit testing and testability

JUnit-style testing, positive/negative/edge cases, exception tests, and testable design.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T03_METHODS_SCOPE, IP_T04_CLASSES_OBJECTS  
**Source documents:** IP Lecture 8 - Unit Tests.pdf  
**Historical verified assessment documents:** 1 (LOW)  
**By assessment type (unique docs):** {"ENDTERM": 1}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK08_01_WRITE_TESTS | Write meaningful unit tests | Select inputs/assertions exposing incorrect behavior. | IP_SK03_01_DEFINE_METHOD | LOW | OBSERVED_SKILL_LEVEL | HIGH |
| IP_SK08_02_TEST_BOUNDARIES | Test boundary and failure cases | Include negative, edge, and exceptional cases. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK08_03_TESTABILITY | Reason about testability | Recognize design choices affecting testability. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T09_INHERITANCE - Inheritance and subtype design

is-a relationships, extends/super, visibility, constructors, overriding, and substitution.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T04_CLASSES_OBJECTS  
**Source documents:** IP Lecture 9 - Inheritance.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK09_01_DESIGN_HIERARCHY | Design an inheritance hierarchy | Use inheritance when domain relationship/substitutability justify it. | IP_SK04_01_MODEL_CLASS | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| IP_SK09_02_INHERITANCE_TRACE | Trace inherited behavior | Predict constructor/override behavior and accessible members. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T10_POLYMORPHISM_BINDING - Polymorphism, interfaces, and binding

Interfaces, dynamic dispatch, overload/override distinction, covariant returns, and abstraction.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T09_INHERITANCE  
**Source documents:** IP Lecture 10 - Polymorphism.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK10_01_POLY_DESIGN | Design with interfaces/polymorphism | Choose useful abstraction boundaries and interchangeable implementations. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK10_02_DISPATCH_TRACE | Resolve overload/override behavior | Determine selected/called method from static/dynamic types. | IP_SK09_02_INHERITANCE_TRACE | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T11_EQUALITY_HASHING - Equality, identity, and hash-based collections

equals/hashCode contracts, identity vs value equality, inheritance/type checks, and hash collections.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T09_INHERITANCE, IP_T10_POLYMORPHISM_BINDING  
**Source documents:** IP Lecture 11 - Equality & Hashcodes.pdf  
**Historical verified assessment documents:** 2 (MEDIUM)  
**By assessment type (unique docs):** {"ENDTERM": 2}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK11_01_EQUALS_IMPL | Implement correct equals | Implement value equality consistent with domain semantics and contract. | IP_SK04_01_MODEL_CLASS | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |
| IP_SK11_02_HASH_CONTRACT | Maintain equals/hashCode consistency | Ensure equal objects hash equally and collections behave correctly. | IP_SK11_01_EQUALS_IMPL | LOW | OBSERVED_SKILL_LEVEL | HIGH |
| IP_SK11_03_EQUALITY_EDGE | Diagnose equality edge cases | Find bugs caused by overloading, inheritance, or type checks. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T12_EXCEPTIONS - Errors and exceptions

Syntax/semantic/runtime/result errors; checked/unchecked exceptions; throwing/catching/finally/custom exceptions.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T03_METHODS_SCOPE  
**Source documents:** IP Lecture 12 - Exceptions.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK12_01_CLASSIFY_FAILURE | Classify program failures | Distinguish compile-time, runtime, and logical/result errors. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK12_02_EXCEPTION_FLOW | Implement and trace exception handling | Select appropriate behavior and predict flow. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T13_DEBUGGING - Debugging and runtime diagnosis

Systematic diagnosis using compiler feedback, debugger stepping, breakpoints, watches, stack/heap reasoning.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T03_METHODS_SCOPE, IP_T04_CLASSES_OBJECTS  
**Source documents:** IP Lecture 13 - Debugging.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK13_01_DEBUG_SYSTEMATIC | Debug systematically | Use code/state evidence to isolate faults. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T14_CODE_QUALITY_STRINGS_GENERICS - Code quality, strings, parsing helpers, and generics

Maintainability/testability, refactoring, String operations, generics, invariance/bounds, and erasure foundations.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T07_COMPOSITION_LIBRARIES, IP_T10_POLYMORPHISM_BINDING  
**Source documents:** IP Lecture 14 - Code Quality, Strings & Generics.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK14_01_REFACTOR | Refactor for quality | Improve clarity, duplication, coupling, and testability without changing behavior. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK14_02_STRING_PARSE | Parse structured text with String operations | Turn text records into typed values robustly. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK14_03_GENERIC_REASON | Use and reason about generics | Choose type parameters and diagnose generic incompatibilities. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T15_IO_PARSING - Input/output and file parsing

Text/binary I/O, readers/writers, buffering, try-with-resources, external formats, and output generation.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T12_EXCEPTIONS, IP_T14_CODE_QUALITY_STRINGS_GENERICS  
**Source documents:** IP Lecture 15 - Input Output Part 1.pdf, IP Lecture 16 - Input Output Part 2.pdf  
**Historical verified assessment documents:** 5 (HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 4, "RESIT": 1}  
**Recent/current verified docs:** 3  
**Practice/example docs:** 2  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK15_01_PARSE_FILE | Implement file-to-model parsing | Read specified formats and construct valid domain objects robustly. | IP_SK14_02_STRING_PARSE, IP_SK12_02_EXCEPTION_FLOW | HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| IP_SK15_02_WRITE_FILE | Write required output formats | Serialize/report results in required textual/binary form. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| IP_SK15_03_RESOURCE_SAFETY | Manage I/O resources safely | Use correct lifetime/error handling for resources. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T16_FUNCTIONAL_JAVA - Functional Java, lambdas, streams, and Optional

Functional interfaces, lambdas, stream pipelines, laziness, and Optional.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T07_COMPOSITION_LIBRARIES, IP_T14_CODE_QUALITY_STRINGS_GENERICS  
**Source documents:** IP Lecture 17 - Functional Java.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK16_01_LAMBDA | Write/use lambdas | Express behavior using functional interfaces covered in the lecture. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK16_02_STREAM_PIPE | Build and trace stream pipelines | Transform/filter/aggregate collections with correct stream semantics. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK16_03_OPTIONAL | Use Optional appropriately | Represent/handle potentially absent results without accidental null logic. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T17_PROGRAM_DESIGN - Program design and domain architecture

Translate a narrative specification into class structure, responsibilities, parser, processing, and CLI.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T07_COMPOSITION_LIBRARIES, IP_T09_INHERITANCE, IP_T15_IO_PARSING  
**Source documents:** IP Lecture 18 - Program Design.pdf  
**Historical verified assessment documents:** 5 (HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 4, "RESIT": 1}  
**Recent/current verified docs:** 3  
**Practice/example docs:** 2  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK17_01_DOMAIN_MODEL | Derive a domain model from a specification | Identify entities, shared/variant data, responsibilities, relationships. | IP_SK07_01_COMPOSE_MODEL, IP_SK09_01_DESIGN_HIERARCHY | HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| IP_SK17_02_DECOMPOSE | Decompose a complete application | Separate I/O, model, processing, interaction, and testing concerns. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T18_MODERN_JAVA - Modern Java constructs used in the course

var, enum, switch expressions, records, sealed/final types, Comparable, and concise modeling.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T04_CLASSES_OBJECTS, IP_T09_INHERITANCE  
**Source documents:** IP Lecture 19 - Modern Java.pdf  
**Historical verified assessment documents:** 0 (NOT_OBSERVED)  
**By assessment type (unique docs):** {}  
**Recent/current verified docs:** 0  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK18_01_MODERN_MODEL | Choose modern Java modeling constructs | Use enum/record/sealed/final when they match requirements. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| IP_SK18_02_MODERN_USE | Use modern syntax correctly | Implement switch/var/Comparable patterns without weakening type reasoning. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

## IP_T19_THREADS_CONCURRENCY - Threads and shared-state concurrency

Thread/Runnable lifecycle, start/join, shared memory, races, synchronization, and atomic behavior.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T04_CLASSES_OBJECTS, IP_T12_EXCEPTIONS  
**Source documents:** IP Lecture 20 - Threads.pdf  
**Historical verified assessment documents:** 2 (MEDIUM)  
**By assessment type (unique docs):** {"ENDTERM": 2}  
**Recent/current verified docs:** 1  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK19_01_THREAD_RUN | Create and coordinate threads | Start/join workers correctly and distinguish start from direct run calls. | None | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |
| IP_SK19_02_SYNC | Diagnose and protect shared state | Recognize races and apply taught synchronization/coordination. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## IP_T20_EXAM_PROGRAM_SYNTHESIS - Integrated programming-exam synthesis

End-to-end Delft-style program synthesis: model, parse, process, filter, interact, test, write, optionally threads.

**Confidence:** `HIGH`  
**Prerequisite topics:** IP_T15_IO_PARSING, IP_T17_PROGRAM_DESIGN, IP_T08_TESTING, IP_T11_EQUALITY_HASHING, IP_T19_THREADS_CONCURRENCY  
**Source documents:** IP Lecture 21 - Exam Practice.pdf  
**Historical verified assessment documents:** 5 (HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 4, "RESIT": 1}  
**Recent/current verified docs:** 3  
**Practice/example docs:** 2  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| IP_SK20_01_EXAM_SYNTHESIS | Build a full Delft-style program | Integrate the course into a coherent compiling tested application under exam constraints. | IP_SK17_02_DECOMPOSE, IP_SK15_01_PARSE_FILE, IP_SK08_01_WRITE_TESTS | HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| IP_SK20_02_EXAM_PRIORITIZE | Prioritize exam implementation | Sequence implementation to maximize reliable progress under time pressure. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |

# CO - Computer Organisation

## CO_T01_HISTORY - History and computer generations

Historical development, key inventions, generations, and architecture/performance significance.

**Confidence:** `HIGH`  
**Prerequisite topics:** None  
**Source documents:** CO Lecture 1 - History.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"MIDTERM": 4, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK01_01_HISTORY | Recall/explain major historical milestones | Place key inventions/developments and explain significance. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T02_BOOLEAN_KMAP - Boolean algebra and Karnaugh maps

Boolean expressions, truth functions, minimum SoP, K-maps, and don't-cares.

**Confidence:** `HIGH`  
**Prerequisite topics:** None  
**Source documents:** CO Lecture 3 - Logic Circuits Part 1.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"MIDTERM": 4, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK02_01_BOOLEAN_EVAL | Evaluate/simplify Boolean expressions | Translate among formula, truth table, and behavior. | None | HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK02_02_SOP | Derive sum-of-products | Construct/verify SoP from a logical specification. | None | HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK02_03_KMAP_BUILD | Build a Karnaugh map | Populate from formula/truth specification including don't-cares. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK02_04_KMAP_MINIMIZE | Minimize with a Karnaugh map | Choose valid maximal groups and derive minimum/near-minimum SoP. | CO_SK02_03_KMAP_BUILD, CO_SK02_02_SOP | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T03_DIGITAL_CMOS_SEQUENTIAL - Digital logic, CMOS, combinational and sequential circuits

Transistors, CMOS networks, gates, multiplexers/adders, latches/flip-flops, SRAM-cell concepts.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T02_BOOLEAN_KMAP  
**Source documents:** CO Lecture 4 - Logic Circuits Part 2.pdf, CO Lecture 3 - Logic Circuits Part 1.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"MIDTERM": 4, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK03_01_CMOS_TRACE | Evaluate CMOS circuits | Determine transistor states and logical output. | None | HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK03_02_CMOS_DESIGN | Design/debug CMOS logic | Construct or repair CMOS realization under constraints. | CO_SK02_01_BOOLEAN_EVAL, CO_SK03_01_CMOS_TRACE | HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK03_03_COMB_BLOCK | Reason about combinational blocks | Derive/diagnose gate, MUX, full-adder behavior/timing. | None | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK03_04_SEQ_LOGIC | Explain/trace sequential storage | Reason about latch/flip-flop/SRAM behavior and triggering. | None | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T04_DATA_REP_RADIX_INTEGER - Radix and integer data representation

Base conversion/arithmetic, BCD, S&M, 1C, 2C, excess, endianness, range, overflow.

**Confidence:** `HIGH`  
**Prerequisite topics:** None  
**Source documents:** CO Lecture 5 - Data Representation Part 1.pdf, CO Lecture 6 - Data Representation Part 2.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"MIDTERM": 4, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK04_01_RADIX_CONVERT | Convert between number bases | Convert values between supported/arbitrary bases. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK04_02_RADIX_ARITH | Compute in a specified radix | Perform arithmetic respecting base constraints. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK04_03_SIGNED_ENCODE | Encode/decode signed representations | Convert and compare S&M, 1C, 2C. | CO_SK04_01_RADIX_CONVERT | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK04_04_OVERFLOW | Detect representation overflow | Determine representability and fixed-width overflow. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK04_05_BCD_EXCESS | Decode/compute BCD and excess encodings | Interpret nonstandard encodings in calculations. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK04_06_ENDIAN | Reason about byte order | Determine memory/register interpretation under endianness. | None | LOW | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T05_DATA_REP_FIXED_FLOAT - Fixed-point and floating-point representation

Precision/range trade-offs, custom floating-point formats, normalization, exponent bias, limits.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T04_DATA_REP_RADIX_INTEGER  
**Source documents:** CO Lecture 5 - Data Representation Part 1.pdf, CO Lecture 6 - Data Representation Part 2.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"MIDTERM": 4, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK05_01_FIXED | Encode/decode fixed-point values | Reason about layout, value, range, and precision. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| CO_SK05_02_FLOAT_ENCODE | Encode/decode floating point | Work from the specified format rather than assumed IEEE details. | CO_SK04_01_RADIX_CONVERT, CO_SK04_03_SIGNED_ENCODE | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK05_03_FLOAT_RANGE | Analyze floating-point range/precision | Determine representability and range/precision trade-offs. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T06_ASSEMBLY_X86_64 - x86-64 Assembly and stack execution

AT&T syntax, registers, partial registers, memory addressing, stack frames, call/ret, recursion, alignment, tracing.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T04_DATA_REP_RADIX_INTEGER  
**Source documents:** CO Lecture 2 - Assembly.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 1, "MIDTERM": 4, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK06_01_ASM_READ | Read x86-64 AT&T instructions | Interpret operand order, widths, immediates, registers, memory. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| CO_SK06_02_PARTIAL_REG | Reason about partial-register writes | Track byte/word/dword/qword effects on full registers. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| CO_SK06_03_STACK_TRACE | Trace stack and calls | Track RSP/RBP, return addresses, locals, pushes/pops, nested calls. | CO_SK06_01_ASM_READ, CO_SK04_03_SIGNED_ENCODE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| CO_SK06_04_ASM_DEBUG | Diagnose assembly stack/code errors | Find incorrect stack/register/alignment assumptions. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## CO_T07_ISA - Instruction Set Architecture

ISA as HW/SW interface, formats, operand/address styles, opcode sizing, addressing modes, RISC/CISC.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T06_ASSEMBLY_X86_64  
**Source documents:** CO Lecture 7 - ISA Part 1.pdf, CO Lecture 8 - ISA Part 2.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 1, "MIDTERM": 3, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK07_01_ISA_BITS | Calculate instruction-format bit budgets | Derive opcode/register/address capacity under length constraints. | CO_SK04_01_RADIX_CONVERT | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK07_02_ISA_DESIGN | Design a valid instruction format | Allocate bits/encodings to satisfy ISA specification. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK07_03_ISA_COMPARE | Compare ISA styles | Translate computations or explain stack/accumulator/register and RISC/CISC trade-offs. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T08_BPU_MICROCODE - Basic Processing Unit and microcode

Datapath, control signals, microoperations, fetch/execute, control encoding, WMFC, hardwired vs microprogrammed.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T07_ISA  
**Source documents:** CO Lecture 9 - BPU Part 1.pdf, CO Lecture 10 - BPU Part 2.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 5, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK08_01_MICRO_TRACE | Trace microoperations | Translate microinstruction sequence to transfers and assembly effect. | CO_SK07_03_ISA_COMPARE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| CO_SK08_02_WRITE_MICRO | Write microroutines | Construct correct fetch/execute microsteps. | CO_SK08_01_MICRO_TRACE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| CO_SK08_03_CONTROL_BITS | Calculate control encoding size | Determine bit counts for horizontal/vertical/mixed organizations. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| CO_SK08_04_CONTROL_COMPARE | Compare control organizations | Explain performance/size/flexibility trade-offs. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| CO_SK08_05_MICRO_OPT | Optimize a microroutine | Overlap independent transfers/waits without violating dependencies. | CO_SK08_02_WRITE_MICRO | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## CO_T09_IO_INTERRUPTS - Input/output organization, buses, and interrupts

I/O organization, bus control, timing, polling/interrupts, daisy-chain, tri-state, address decoding.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T07_ISA  
**Source documents:** CO Lecture 11 - IO.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 5, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK09_01_BUS_REASON | Reason about bus/I-O behavior | Explain timing/control and valid device/bus interactions. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK09_02_IO_ADDRESS | Solve ignored-address-line problems | Determine aliases/collisions and nonconflicting addresses. | CO_SK04_01_RADIX_CONVERT | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK09_03_INTERRUPT_TRACE | Analyze interrupt systems | Trace/prioritize interrupts and compute timing/throughput. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T10_DMA_MEMORY - DMA and memory organization

DMA/non-programmed I/O, cells/words/chips, pins, banks/interleaving, physical organization.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T09_IO_INTERRUPTS  
**Source documents:** CO Lecture 12 - Memory.pdf, CO Lecture 11 - IO.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 5, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK10_01_DMA | Explain/analyze DMA | Compare programmed/interrupt I/O with DMA and reason about bus/CPU consequences. | None | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK10_02_MEMORY_BITS | Calculate memory organization | Derive chip counts, address/data pins, capacity, word organization. | CO_SK04_01_RADIX_CONVERT | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK10_03_INTERLEAVE | Analyze memory interleaving | Determine bank mapping/performance effects. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T11_CACHE - Cache organization and locality

Block/set/tag addressing, associativity, replacement, hit/miss tracing, locality, policies, access implications.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T10_DMA_MEMORY  
**Source documents:** CO Lecture 13 - Caching.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 5, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK11_01_CACHE_BITS | Compute cache address fields | Calculate offset/index/tag sizes and capacity/associativity constraints. | CO_SK10_02_MEMORY_BITS | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK11_02_CACHE_TRACE | Trace cache state | Simulate accesses and replacement policy accurately. | CO_SK11_01_CACHE_BITS | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK11_03_CACHE_OPT | Optimize access for cache | Choose/explain transformations reducing misses. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T12_PIPELINE - Pipelining, hazards, and scheduling

Latency/throughput, stage overlap, data/control hazards, forwarding, branch prediction, stalls, scheduling.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T08_BPU_MICROCODE, CO_T11_CACHE  
**Source documents:** CO Lecture 14 - Pipelining.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 5, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK12_01_PIPE_PERF | Compute pipeline performance | Compute latency/throughput/cycles for ideal/nonideal pipelines. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK12_02_PIPE_HAZARD | Analyze hazards | Identify dependencies, stalls/forwarding, branch penalties. | CO_SK06_01_ASM_READ, CO_SK12_01_PIPE_PERF | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK12_03_PIPE_SCHEDULE | Schedule pipeline work | Construct/compare schedules respecting dependencies/resources. | CO_SK12_02_PIPE_HAZARD | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T13_PARALLELISM - Parallelism and performance scaling

Instruction/data/task parallelism, superscalar/multicore/GPU, classification, speedup limits, Amdahl.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T12_PIPELINE  
**Source documents:** CO Lecture 15 - Parallel & Virtual Memory.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 5, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK13_01_PAR_CLASS | Classify/compare parallel architectures | Identify execution model and performance implications. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK13_02_AMDAHL | Solve speedup-limit problems | Compute/infer speedup and serial fraction. | CO_SK12_01_PIPE_PERF | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

## CO_T14_VIRTUAL_MEMORY - Virtual memory and address translation

Virtual/physical pages, page tables, translation, protection/isolation, process address spaces.

**Confidence:** `HIGH`  
**Prerequisite topics:** CO_T10_DMA_MEMORY  
**Source documents:** CO Lecture 15 - Parallel & Virtual Memory.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 5, "RESIT": 3}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 1  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| CO_SK14_01_VM_TRANSLATE | Solve virtual-memory translation/sizing | Determine page/table/index/offset behavior. | CO_SK10_02_MEMORY_BITS | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |
| CO_SK14_02_VM_REASON | Explain VM benefits/trade-offs | Reason about protection, abstraction, and process address spaces. | None | VERY_HIGH | OBSERVED_SKILL_LEVEL | HIGH |

# R&L - Reasoning and Logic

## RL_T01_PROP_LOGIC - Propositional logic

Connectives, truth tables, equivalence, normal forms, validity, necessary/sufficient, satisfiability.

**Confidence:** `HIGH`  
**Prerequisite topics:** None  
**Source documents:** R&L Lecture 1 - Propositional Calculus Part 1.pdf, R&L Lecture 2 - Propositional Calculus Part 2.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 3, "MIDTERM": 1, "RESIT": 4}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK01_01_CONNECTIVE | Interpret propositional connectives | Translate/reason precisely about standard connectives. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK01_02_NEC_SUFF | Reason about necessary/sufficient conditions | Convert wording to implications and derive converse/contrapositive/inverse. | None | NOT_OBSERVED | NOT_OBSERVED_IN_MAPPED_ASSESSMENTS | HIGH |
| RL_SK01_03_TRUTH_TABLE | Construct truth tables | Build full truth tables including custom operators. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK01_04_PROP_VALIDITY | Test propositional validity | Use premise-true/conclusion-false rows. | RL_SK01_03_TRUTH_TABLE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK01_05_EQUIV | Establish/refute equivalence | Prove equivalence or exhibit a differing row. | RL_SK01_03_TRUTH_TABLE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK01_06_NORMAL_FORM | Rewrite to DNF/CNF | Produce equivalent normal form by table/equivalences. | RL_SK01_01_CONNECTIVE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK01_07_SAT_PROP | Reason about propositional satisfiability | Construct valuations/counterexamples and recognize vacuous validity/explosion. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## RL_T02_FOL - First-order logic and formal structures

Predicates/constants/relations/functions, quantifiers, translation, negation, Tarski worlds, structures, countermodels.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T01_PROP_LOGIC  
**Source documents:** R&L Lecture 3 - First-Order Logic.pdf  
**Historical verified assessment documents:** 9 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 3, "MIDTERM": 1, "RESIT": 5}  
**Recent/current verified docs:** 6  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK02_01_NL_TO_FOL | Translate natural language to FOL | Define symbols and encode all semantic constraints. | RL_SK01_01_CONNECTIVE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK02_02_FOL_TO_NL | Translate FOL to natural language | Give unambiguous natural English, not symbol-reading. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK02_03_NEGATE_FOL | Negate and simplify quantified statements | Push negations to predicates correctly. | RL_SK02_01_NL_TO_FOL | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK02_04_TARSKI | Construct/evaluate Tarski worlds | Build a world satisfying constraints or identify violation. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK02_05_FORMAL_STRUCTURE | Construct/evaluate formal structures | Assign domain/predicate/relation interpretations satisfying requirements. | RL_SK02_01_NL_TO_FOL | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK02_06_COUNTERMODEL | Disprove FOL claims/arguments with structures | Construct a valid countermodel and explain why it refutes. | RL_SK02_05_FORMAL_STRUCTURE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## RL_T03_PROOF_METHODS - Methods of proof

Direct/generalisation, cases, contradiction, contrapositive, existence, method selection, and proof diagnosis.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T01_PROP_LOGIC, RL_T02_FOL  
**Source documents:** R&L Lecture 4 - Methods of Proof Part 1.pdf, R&L Lecture 5 - Methods of Proof Part 2.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 2, "MIDTERM": 1, "RESIT": 5}  
**Recent/current verified docs:** 6  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK03_01_GENERALIZE | Prove a universal claim from an arbitrary element | Introduce arbitrary objects correctly and justify universal conclusion. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK03_02_DIRECT | Construct a direct proof | Transform assumptions through justified steps into target. | RL_SK03_01_GENERALIZE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK03_03_CASES | Construct a proof by cases | Choose exhaustive cases, prove each, conclude without gaps. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK03_04_CONTRADICTION | Construct a proof by contradiction | Negate target correctly and derive contradiction. | RL_SK02_03_NEGATE_FOL | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK03_05_CONTRAPOSITIVE | Construct a proof by contrapositive | Write and prove the correct contrapositive. | RL_SK01_02_NEC_SUFF, RL_SK03_01_GENERALIZE | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK03_06_IDENTIFY_PROOF | Identify proof techniques in a proof excerpt | Recognize techniques and cite structural evidence. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK03_07_DEBUG_PROOF | Diagnose proof mistakes | Identify invalid assumptions, missing arbitrariness/cases/justification. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## RL_T04_INDUCTION_RECURSION - Induction, recursive definitions, structural induction, and invariants

Mathematical/strong induction, recursive sequences/functions/sets, structural induction, four-part invariant proofs.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T03_PROOF_METHODS  
**Source documents:** R&L Lecture 6 - Induction and Recursion Part 1.pdf, R&L Lecture 7 - Induction and Recursion Part 2.pdf, R&L Lecture 8 - Induction and Recursion Part 3.pdf  
**Historical verified assessment documents:** 9 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 3, "MIDTERM": 1, "RESIT": 5}  
**Recent/current verified docs:** 6  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK04_01_DEFINE_RECURSIVE | Create recursive definitions | Specify complete bases, recursive rules, domains/indexing, exclusivity when required. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK04_02_EVAL_RECURSIVE | Evaluate recursive functions/sequences | Expand definitions accurately. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK04_03_INDUCTION | Construct mathematical induction proofs | Use matching base, arbitrary IH, explicit IH use, conclusion. | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK04_04_INDUCTION_SETUP | Choose induction setup | Determine base cases/step size and weak vs strong hypothesis. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK04_05_RECURSIVE_SET | Define recursive sets/languages | Give base/closure/exclusion rules defining exactly the set. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK04_06_STRUCT_INDUCTION | Prove over recursively defined structures | Cover every constructor with appropriate IH and step. | RL_SK04_05_RECURSIVE_SET, RL_SK04_03_INDUCTION | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK04_07_INVARIANT | Construct process/algorithm invariant proofs | Prove initialization, preservation, termination, post-condition. | RL_SK04_03_INDUCTION, RL_SK03_02_DIRECT | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## RL_T05_TREES_GRAPHS - Trees, graphs, traversals, and recursive functions on structures

Tree definitions/traversals, constrained construction, directed graphs/DAGs/topological ordering, recursive tree functions.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T04_INDUCTION_RECURSION  
**Source documents:** R&L Lecture 8 - Induction and Recursion Part 3.pdf, R&L Lecture 11 - Set Theory Part 3.pdf, R&L Lecture 14 - Functions on trees and graphs.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 2, "MIDTERM": 1, "RESIT": 4}  
**Recent/current verified docs:** 6  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK05_01_TREE_CONSTRUCT | Construct trees under constraints | Draw trees satisfying node/leaf/height/traversal/value constraints. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK05_02_TREE_TRAVERSE | Compute tree traversals/properties | Determine traversals, leaves, height, descendants. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK05_03_TREE_FUNC | Define/evaluate recursive tree functions | Write complete case definitions and evaluate/transform trees. | RL_SK04_01_DEFINE_RECURSIVE, RL_SK05_01_TREE_CONSTRUCT | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK05_04_GRAPH_CONSTRUCT | Construct graphs under constraints | Build graph satisfying counts/edges/cycles/order requirements. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK05_05_TOPO | Reason about topological order | Determine existence/uniqueness/impossibility using graph structure. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## RL_T06_SET_THEORY - Set theory

Membership/subsets, operations, Venn diagrams, powersets, Cartesian products, set-builder notation, proofs/counterexamples.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T02_FOL, RL_T03_PROOF_METHODS  
**Source documents:** R&L Lecture 9 - Set Theory Part 1.pdf, R&L Lecture 10 - Set Theory Part 2.pdf, R&L Lecture 11 - Set Theory Part 3.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 3, "RESIT": 5}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK06_01_SET_CALC | Compute set expressions | Evaluate explicit/set-builder expressions and distinguish membership/subset. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK06_02_VENN | Translate set expressions and Venn regions | Shade/describe exact represented set. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK06_03_POWER_CART | Compute powersets/Cartesian products | Enumerate correctly respecting nested sets vs tuples. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK06_04_SET_PROOF | Prove set claims | Use arbitrary-element/cases/contradiction appropriately. | RL_SK03_01_GENERALIZE, RL_SK06_01_SET_CALC | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK06_05_SET_COUNTER | Counterexample set claims | Choose concrete sets satisfying premises but falsifying conclusion. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## RL_T07_FUNCTIONS_RELATIONS - Functions and relations

Well-defined functions, injectivity/surjectivity/bijectivity, relation properties, equivalence relations, construction.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T06_SET_THEORY  
**Source documents:** R&L Lecture 12 - Functions & Relations.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 3, "RESIT": 5}  
**Recent/current verified docs:** 5  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK07_01_WELL_DEFINED | Test function well-definedness | Check totality, unique output, codomain membership. | RL_SK06_03_POWER_CART | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK07_02_CONSTRUCT_FUNC | Construct functions with required properties | Specify mapping satisfying domain/codomain/property constraints. | None | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK07_03_INJ_SURJ | Classify/prove mapping properties | Use definitions/counterexamples to determine mapping properties. | RL_SK07_01_WELL_DEFINED | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |
| RL_SK07_04_REL_PROPS | Analyze relation properties | Prove or disprove reflexive/symmetric/transitive/equivalence properties. | RL_SK06_03_POWER_CART | NOT_OBSERVED | BROAD_OR_INTEGRATED_ONLY | HIGH |

## RL_T08_LIMITS_COUNTABILITY - Infinite sets, countability, and limits of formal systems

Number-set hierarchy, countability, bijection/listing arguments, Cantor-style reasoning, paradox/limits overview.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T06_SET_THEORY, RL_T07_FUNCTIONS_RELATIONS  
**Source documents:** R&L Lecture 13 - The limitations of Set Theory.pdf  
**Historical verified assessment documents:** 8 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 3, "MIDTERM": 1, "RESIT": 4}  
**Recent/current verified docs:** 6  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK08_01_NUMBER_SETS | Classify number/set membership | Reason precisely about N/Z/Q/R/C and cardinality class. | None | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |
| RL_SK08_02_COUNTABLE | Show countability with a listing/bijection | Give constructive argument/function establishing countable infinity. | RL_SK07_03_INJ_SURJ, RL_SK08_01_NUMBER_SETS | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |
| RL_SK08_03_LIMITS | Explain core limitation results at course depth | State conceptual consequences without inventing theory beyond sources. | None | MEDIUM | OBSERVED_SKILL_LEVEL | HIGH |

## RL_T09_TRANSFER_CONSTRAINT_PUZZLES - Novel transfer and constraint-reconstruction problems

End-of-exam reasoning puzzles requiring elimination, backward reasoning, parity/count constraints, information sufficiency.

**Confidence:** `HIGH`  
**Prerequisite topics:** RL_T01_PROP_LOGIC, RL_T03_PROOF_METHODS, RL_T04_INDUCTION_RECURSION  
**Source documents:** R&L Lecture 0 - Introduction.pdf, R&L Lecture 15 - Exam Prep.pdf, R&L Lecture 16 - The Last One.pdf  
**Historical verified assessment documents:** 7 (VERY_HIGH)  
**By assessment type (unique docs):** {"ENDTERM": 2, "MIDTERM": 1, "RESIT": 4}  
**Recent/current verified docs:** 6  
**Practice/example docs:** 0  

### Atomic skills

| skill_id | skill | definition | prereqs | historical evidence | exam evidence | confidence |
| --- | --- | --- | --- | --- | --- | --- |
| RL_SK09_01_TRANSFER | Solve novel constraint puzzles | Model constraints, reduce candidates, justify elimination, reach unique conclusion. | RL_SK01_04_PROP_VALIDITY, RL_SK03_03_CASES | HIGH | OBSERVED_SKILL_LEVEL | HIGH |

# Assessment mappings

All page locators below are physical PDF pages. `UNKNOWN` is retained for analytical component boundaries that do not correspond to an exact original numbered question.

## IP assessments

### ASM_IP_RESIT_2024 - IP Programming Resit 2024.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WHOLE_EXAM | PDF_PAGES_1-9 | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN, IP_T15_IO_PARSING | IP_SK17_01_DOMAIN_MODEL, IP_SK15_01_PARSE_FILE, IP_SK20_01_EXAM_SYNTHESIS, IP_SK11_01_EQUALS_IMPL, IP_SK08_01_WRITE_TESTS, IP_SK02_04_LOOP_IMPLEMENT | 5 | HIGH | INTEGRATED_MULTI_SKILL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | True |
| COMPONENT_1 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN | IP_SK17_01_DOMAIN_MODEL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_2 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T15_IO_PARSING | IP_SK15_01_PARSE_FILE | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_3 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_4 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_5 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_IP_MOCK_2024 - IP Programming Mock 2024.pdf

**Type/status:** `MOCK` / `OFFICIAL_PRACTICE_MATERIAL`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WHOLE_EXAM | PDF_PAGES_1-4 | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN, IP_T15_IO_PARSING | IP_SK17_01_DOMAIN_MODEL, IP_SK15_01_PARSE_FILE, IP_SK20_01_EXAM_SYNTHESIS, IP_SK09_01_DESIGN_HIERARCHY, IP_SK02_04_LOOP_IMPLEMENT | 5 | HIGH | INTEGRATED_MULTI_SKILL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | True |
| COMPONENT_1 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN | IP_SK17_01_DOMAIN_MODEL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_2 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_3 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_4 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_5 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_IP_MOCK_2023 - IP Programming Mock 2023.pdf

**Type/status:** `MOCK` / `OFFICIAL_PRACTICE_MATERIAL`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WHOLE_EXAM | PDF_PAGES_1-4 | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN, IP_T15_IO_PARSING | IP_SK17_01_DOMAIN_MODEL, IP_SK15_01_PARSE_FILE, IP_SK11_01_EQUALS_IMPL, IP_SK11_02_HASH_CONTRACT, IP_SK15_02_WRITE_FILE, IP_SK20_01_EXAM_SYNTHESIS | 5 | HIGH | INTEGRATED_MULTI_SKILL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | True |
| COMPONENT_1 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T15_IO_PARSING | IP_SK15_01_PARSE_FILE | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_2 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN | IP_SK17_01_DOMAIN_MODEL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_3 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_4 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T11_EQUALITY_HASHING | IP_SK11_01_EQUALS_IMPL, IP_SK11_02_HASH_CONTRACT | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_5 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_6 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T15_IO_PARSING | IP_SK15_01_PARSE_FILE | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_IP_END_2024 - IP Programming Endterm 2024.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WHOLE_EXAM | PDF_PAGES_1-9 | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN, IP_T15_IO_PARSING | IP_SK17_01_DOMAIN_MODEL, IP_SK15_01_PARSE_FILE, IP_SK20_01_EXAM_SYNTHESIS, IP_SK09_01_DESIGN_HIERARCHY, IP_SK02_04_LOOP_IMPLEMENT, IP_SK19_01_THREAD_RUN | 5 | HIGH | INTEGRATED_MULTI_SKILL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | True |
| COMPONENT_1 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN | IP_SK17_01_DOMAIN_MODEL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_2 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T15_IO_PARSING | IP_SK15_01_PARSE_FILE | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_3 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_4 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_5 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T19_THREADS_CONCURRENCY | IP_SK19_01_THREAD_RUN | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_IP_END_2023 - IP Programming Endterm 2023.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WHOLE_EXAM | PDF_PAGES_1-9 | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN, IP_T15_IO_PARSING | IP_SK17_01_DOMAIN_MODEL, IP_SK15_01_PARSE_FILE, IP_SK20_01_EXAM_SYNTHESIS, IP_SK09_01_DESIGN_HIERARCHY, IP_SK02_04_LOOP_IMPLEMENT | 5 | HIGH | INTEGRATED_MULTI_SKILL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | True |
| COMPONENT_1 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN | IP_SK17_01_DOMAIN_MODEL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_2 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_3 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_4 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_5 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_IP_END_2021 - IP Programming Endterm 2021.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WHOLE_EXAM | PDF_PAGES_1-7 | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN, IP_T15_IO_PARSING | IP_SK17_01_DOMAIN_MODEL, IP_SK15_01_PARSE_FILE, IP_SK20_01_EXAM_SYNTHESIS, IP_SK11_01_EQUALS_IMPL, IP_SK11_02_HASH_CONTRACT, IP_SK08_01_WRITE_TESTS | 5 | HIGH | INTEGRATED_MULTI_SKILL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | True |
| COMPONENT_1 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN | IP_SK17_01_DOMAIN_MODEL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_2 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_3 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T11_EQUALITY_HASHING | IP_SK11_01_EQUALS_IMPL, IP_SK11_02_HASH_CONTRACT | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_4 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T08_TESTING | IP_SK08_01_WRITE_TESTS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_5 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T15_IO_PARSING | IP_SK15_01_PARSE_FILE | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_6 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_IP_END_2020 - IP Programming Endterm 2020.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WHOLE_EXAM | PDF_PAGES_1-5 | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN, IP_T15_IO_PARSING | IP_SK17_01_DOMAIN_MODEL, IP_SK15_01_PARSE_FILE, IP_SK20_01_EXAM_SYNTHESIS, IP_SK11_01_EQUALS_IMPL, IP_SK19_01_THREAD_RUN, IP_SK19_02_SYNC, IP_SK15_02_WRITE_FILE | 5 | HIGH | INTEGRATED_MULTI_SKILL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | True |
| COMPONENT_1 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T17_PROGRAM_DESIGN | IP_SK17_01_DOMAIN_MODEL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_2 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS | IP_SK20_01_EXAM_SYNTHESIS | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_3 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T15_IO_PARSING | IP_SK15_01_PARSE_FILE | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_4 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T11_EQUALITY_HASHING | IP_SK11_01_EQUALS_IMPL | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_5 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T19_THREADS_CONCURRENCY | IP_SK19_01_THREAD_RUN | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| COMPONENT_6 | UNKNOWN | IP_T20_EXAM_PROGRAM_SYNTHESIS, IP_T19_THREADS_CONCURRENCY | IP_SK19_01_THREAD_RUN | 3 | MEDIUM_HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

## CO assessments

### ASM_CO_END_FILE2020 - CO Endterm 2020.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_2 | CO_T10_DMA_MEMORY | CO_SK10_01_DMA | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_4 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_4 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_5 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_5 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_6 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 12 | PDF_PAGE_6 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 13 | PDF_PAGE_6 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 14 | PDF_PAGE_6 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 15 | PDF_PAGE_7 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 16 | PDF_PAGE_7 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 17 | PDF_PAGE_7 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 18 | PDF_PAGE_7 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_END_FILE2025_SOL - CO Endterm 2025 Solutions.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_3 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_3 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_3 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_7 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_9 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_9 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_10 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_11 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_11 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_END_FILE2024 - CO Endterm 2024.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_2 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_4 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_4 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_5 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_5 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_6 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_6 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_END_FILE2023 - CO Endterm 2023.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_3 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_3 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_4 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_4 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_5 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_5 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_6 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_7 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_END_FILE2022 - CO Endterm 2022.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_3 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_3 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_4 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_4 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_5 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_5 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_5 | CO_T10_DMA_MEMORY | CO_SK10_01_DMA | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_6 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_7 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_7 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_END_EXAMPLE - CO Endterm 2021.pdf

**Type/status:** `EXAM_PREPARATION` / `OFFICIAL_PRACTICE_MATERIAL`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_3 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_4 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_4 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_5 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_6 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_6 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_7 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_RESIT_2025_SOL - CO Resit 2025 Solutions.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_3 | CO_T01_HISTORY | CO_SK01_01_HISTORY | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_3 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_3 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_01_CMOS_TRACE, CO_SK03_02_CMOS_DESIGN | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_03_COMB_BLOCK | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_8 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_8 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_8 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_9 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_10 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_10 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_11 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 13 | PDF_PAGE_11 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_12 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 15 | PDF_PAGE_13 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 16 | PDF_PAGE_13 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 17 | PDF_PAGE_15 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 18 | PDF_PAGE_15 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 19 | PDF_PAGE_17 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 20 | PDF_PAGE_17 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 21 | PDF_PAGE_18 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 22 | PDF_PAGE_19 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_RESIT_2024 - CO Resit 2024.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T01_HISTORY | CO_SK01_01_HISTORY | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_2 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_04_SEQ_LOGIC | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_2 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_2 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_2 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_3 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_3 | CO_T02_BOOLEAN_KMAP | CO_SK02_01_BOOLEAN_EVAL, CO_SK02_02_SOP | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_3 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_3 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_4 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_4 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_4 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_5 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 15 | PDF_PAGE_5 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 16 | PDF_PAGE_6 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 17 | PDF_PAGE_6 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 18 | PDF_PAGE_7 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 19 | PDF_PAGE_7 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 20 | PDF_PAGE_7 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 21 | PDF_PAGE_8 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 22 | PDF_PAGE_8 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_RESIT_2023 - CO Resit 2023.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T01_HISTORY | CO_SK01_01_HISTORY | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_2 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_01_CMOS_TRACE, CO_SK03_02_CMOS_DESIGN | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_2 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_3 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_3 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_4 | CO_T02_BOOLEAN_KMAP | CO_SK02_01_BOOLEAN_EVAL, CO_SK02_02_SOP | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_4 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_4 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_5 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_5 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_6 | CO_T08_BPU_MICROCODE | CO_SK08_01_MICRO_TRACE, CO_SK08_02_WRITE_MICRO, CO_SK08_03_CONTROL_BITS, CO_SK08_05_MICRO_OPT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_6 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 15 | PDF_PAGE_7 | CO_T09_IO_INTERRUPTS | CO_SK09_01_BUS_REASON, CO_SK09_02_IO_ADDRESS, CO_SK09_03_INTERRUPT_TRACE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 16 | PDF_PAGE_7 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 17 | PDF_PAGE_7 | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 18 | PDF_PAGE_8 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 19 | PDF_PAGE_8 | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE, CO_SK11_03_CACHE_OPT | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 20 | PDF_PAGE_9 | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 21 | PDF_PAGE_10 | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 22 | PDF_PAGE_10 | CO_T13_PARALLELISM | CO_SK13_01_PAR_CLASS, CO_SK13_02_AMDAHL | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_CO_MID_FILE2025_SOL - CO Midterm 2025 Solutions.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_3 | CO_T01_HISTORY | CO_SK01_01_HISTORY | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_3 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_3 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_01_CMOS_TRACE, CO_SK03_02_CMOS_DESIGN | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_4 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_6 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_06_ENDIAN | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_6 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_7 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_9 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_9 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_10 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_11 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

### ASM_CO_MID_FILE2024 - CO Midterm 2024.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T01_HISTORY | CO_SK01_01_HISTORY | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_2 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_01_CMOS_TRACE, CO_SK03_02_CMOS_DESIGN | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_3 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_4 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_4 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_4 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_5 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_5 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

### ASM_CO_MID_FILE2022 - CO Midterm 2022.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T01_HISTORY | CO_SK01_01_HISTORY | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_01_BOOLEAN_EVAL, CO_SK02_02_SOP | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_3 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_4 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_03_COMB_BLOCK | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_4 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_01_CMOS_TRACE, CO_SK03_02_CMOS_DESIGN | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_5 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_5 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_04_SEQ_LOGIC | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_6 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 12 | PDF_PAGE_6 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 13 | PDF_PAGE_7 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

### ASM_CO_MID_EXAMPLE - CO Midterm 2021.pdf

**Type/status:** `EXAM_PREPARATION` / `OFFICIAL_PRACTICE_MATERIAL`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_01_BOOLEAN_EVAL, CO_SK02_02_SOP | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_01_BOOLEAN_EVAL, CO_SK02_02_SOP | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_4 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_4 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_5 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_6 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_6 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_04_SEQ_LOGIC | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_6 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_03_COMB_BLOCK | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_7 | CO_T07_ISA | CO_SK07_01_ISA_BITS, CO_SK07_02_ISA_DESIGN, CO_SK07_03_ISA_COMPARE | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 12 | PDF_PAGE_7 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

### ASM_CO_MID_FILE2020 - CO Midterm 2020.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | CO_T01_HISTORY | CO_SK01_01_HISTORY | 1 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 2 | PDF_PAGE_2 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 3 | PDF_PAGE_2 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_04_SEQ_LOGIC | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 4 | PDF_PAGE_3 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_03_COMB_BLOCK | 1 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 5 | PDF_PAGE_3 | CO_T02_BOOLEAN_KMAP | CO_SK02_01_BOOLEAN_EVAL, CO_SK02_02_SOP | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 6 | PDF_PAGE_4 | CO_T02_BOOLEAN_KMAP | CO_SK02_03_KMAP_BUILD, CO_SK02_04_KMAP_MINIMIZE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 7 | PDF_PAGE_4 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_01_RADIX_CONVERT, CO_SK04_02_RADIX_ARITH | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 8 | PDF_PAGE_4 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_5 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 10 | PDF_PAGE_5 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_03_COMB_BLOCK | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 11 | PDF_PAGE_5 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 12 | PDF_PAGE_6 | CO_T04_DATA_REP_RADIX_INTEGER | CO_SK04_03_SIGNED_ENCODE, CO_SK04_04_OVERFLOW, CO_SK04_05_BCD_EXCESS | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 13 | PDF_PAGE_6 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 14 | PDF_PAGE_6 | CO_T03_DIGITAL_CMOS_SEQUENTIAL | CO_SK03_03_COMB_BLOCK | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 15 | PDF_PAGE_7 | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 16 | PDF_PAGE_7 | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_02_PARTIAL_REG, CO_SK06_03_STACK_TRACE, CO_SK06_04_ASM_DEBUG | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

## R&L assessments

### ASM_RL_END_2025 - R&L Endterm 2025.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC, RL_T02_FOL | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_4 | RL_T06_SET_THEORY, RL_T05_TREES_GRAPHS | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_4 | RL_T05_TREES_GRAPHS, RL_T07_FUNCTIONS_RELATIONS, RL_T08_LIMITS_COUNTABILITY | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_5 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_5 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_RL_END_2024 - R&L Endterm 2024.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_3 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_3 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_3 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_3 | RL_T08_LIMITS_COUNTABILITY | RL_SK08_01_NUMBER_SETS, RL_SK08_02_COUNTABLE, RL_SK08_03_LIMITS | 4 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 15 | PDF_PAGE_5 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_RL_END_FILE2020 - R&L Endterm 2020.pdf

**Type/status:** `ENDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 15 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 16 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | MEDIUM | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 17 | PDF_PAGE_5 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 18 | PDF_PAGE_5 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 19 | PDF_PAGE_5 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 20 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 21 | PDF_PAGE_5 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 22 | PDF_PAGE_5 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 23 | PDF_PAGE_5 | RL_T08_LIMITS_COUNTABILITY | RL_SK08_01_NUMBER_SETS, RL_SK08_02_COUNTABLE, RL_SK08_03_LIMITS | 3 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 24 | PDF_PAGE_6 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 25 | PDF_PAGE_6 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

### ASM_RL_RESIT_2025 - R&L Resit 2025.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_4 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_5 | RL_T06_SET_THEORY, RL_T08_LIMITS_COUNTABILITY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_5 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_5 | RL_T07_FUNCTIONS_RELATIONS, RL_T08_LIMITS_COUNTABILITY | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 15 | PDF_PAGE_6 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_RL_RESIT_2024 - R&L Resit 2024.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_4 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_5 | RL_T06_SET_THEORY, RL_T07_FUNCTIONS_RELATIONS | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_5 | RL_T07_FUNCTIONS_RELATIONS, RL_T08_LIMITS_COUNTABILITY | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 15 | PDF_PAGE_5 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 16 | PDF_PAGE_5 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_RL_RESIT_2023 - R&L Resit 2023.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T07_FUNCTIONS_RELATIONS, RL_T08_LIMITS_COUNTABILITY | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_2 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | RL_T05_TREES_GRAPHS, RL_T07_FUNCTIONS_RELATIONS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_4 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_4 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_RL_RESIT_2022 - R&L Resit 2022.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T04_INDUCTION_RECURSION, RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_3 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_3 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T01_PROP_LOGIC, RL_T02_FOL | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_4 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_4 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

### ASM_RL_RESIT_2020 - R&L Resit 2020.pdf

**Type/status:** `RESIT` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_2 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_2 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_3 | RL_T08_LIMITS_COUNTABILITY | RL_SK08_01_NUMBER_SETS, RL_SK08_02_COUNTABLE, RL_SK08_03_LIMITS | 2 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |
| 9 | PDF_PAGE_3 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 11 | PDF_PAGE_3 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 12 | PDF_PAGE_3 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 13 | PDF_PAGE_3 | RL_T07_FUNCTIONS_RELATIONS | RL_SK07_01_WELL_DEFINED, RL_SK07_02_CONSTRUCT_FUNC, RL_SK07_03_INJ_SURJ, RL_SK07_04_REL_PROPS | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 14 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 15 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 16 | PDF_PAGE_4 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 17 | PDF_PAGE_5 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 18 | PDF_PAGE_5 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 19 | PDF_PAGE_5 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 20 | PDF_PAGE_5 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 21 | PDF_PAGE_5 | RL_T06_SET_THEORY | RL_SK06_01_SET_CALC, RL_SK06_02_VENN, RL_SK06_03_POWER_CART, RL_SK06_04_SET_PROOF, RL_SK06_05_SET_COUNTER | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 22 | PDF_PAGE_5 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 23 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 24 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 25 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 26 | PDF_PAGE_6 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 5 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |

### ASM_RL_MID_2025 - R&L Midterm 2025.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `CURRENT`  
**Assessment confidence:** `HIGH`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 2 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 4 | PDF_PAGE_2 | RL_T02_FOL, RL_T01_PROP_LOGIC, RL_T08_LIMITS_COUNTABILITY | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 5 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 6 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 3 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 7 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 8 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 9 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION, RL_T05_TREES_GRAPHS | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | HIGH | TOPIC_LEVEL_BROAD | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES | True |
| 10 | PDF_PAGE_4 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | HIGH | SKILL_LEVEL | True | SOURCE_ANALOGUE_ALLOWED_NONVERBATIM | UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT | True |

### ASM_RL_MID_2024 - R&L Midterm 2024.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 2 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 4 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 5 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 6 | PDF_PAGE_3 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 7 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 8 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 9 | PDF_PAGE_4 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 10 | PDF_PAGE_4 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |

### ASM_RL_MID_2023 - R&L Midterm 2023.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 4 | PDF_PAGE_2 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 5 | PDF_PAGE_2 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 6 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 7 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 8 | PDF_PAGE_4 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 9 | PDF_PAGE_4 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 10 | PDF_PAGE_4 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |

### ASM_RL_MID_2022 - R&L Midterm 2022.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 2 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 3 | PDF_PAGE_4 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 4 | PDF_PAGE_5 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 5 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 6 | PDF_PAGE_6 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 7 | PDF_PAGE_6 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 8 | PDF_PAGE_6 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 9 | PDF_PAGE_7 | RL_T05_TREES_GRAPHS | RL_SK05_01_TREE_CONSTRUCT, RL_SK05_02_TREE_TRAVERSE, RL_SK05_03_TREE_FUNC, RL_SK05_04_GRAPH_CONSTRUCT, RL_SK05_05_TOPO | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 10 | PDF_PAGE_8 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 11 | PDF_PAGE_8 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | MEDIUM | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |

### ASM_RL_MID_2020 - R&L Midterm 2020.pdf

**Type/status:** `MIDTERM` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 3 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 3 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 4 | PDF_PAGE_2 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 5 | PDF_PAGE_2 | RL_T03_PROOF_METHODS | RL_SK03_01_GENERALIZE, RL_SK03_02_DIRECT, RL_SK03_03_CASES, RL_SK03_04_CONTRADICTION, RL_SK03_05_CONTRAPOSITIVE, RL_SK03_06_IDENTIFY_PROOF, RL_SK03_07_DEBUG_PROOF | 4 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 6 | PDF_PAGE_3 | RL_T04_INDUCTION_RECURSION | RL_SK04_01_DEFINE_RECURSIVE, RL_SK04_02_EVAL_RECURSIVE, RL_SK04_03_INDUCTION, RL_SK04_04_INDUCTION_SETUP, RL_SK04_05_RECURSIVE_SET, RL_SK04_06_STRUCT_INDUCTION, RL_SK04_07_INVARIANT | 4 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 7 | PDF_PAGE_3 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 3 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 8 | PDF_PAGE_3 | RL_T09_TRANSFER_CONSTRAINT_PUZZLES | RL_SK09_01_TRANSFER | 5 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |

### ASM_RL_MCQ_2023 - R&L MCQ Test 2023.pdf

**Type/status:** `MCQ_TEST` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `RECENT`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 3 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 4 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 5 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 6 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 7 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 8 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 9 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 10 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 11 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 12 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 13 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 14 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 15 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 16 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 17 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 18 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 19 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 20 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |

### ASM_RL_MCQ_2021 - R&L MCQ Test 2021.pdf

**Type/status:** `MCQ_TEST` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 3 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 4 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 5 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 6 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 7 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 8 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 9 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 10 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 11 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 12 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 13 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 14 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 15 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 16 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 17 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 18 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 19 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 20 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |

### ASM_RL_MCQ_2020 - R&L MCQ Test 2020.pdf

**Type/status:** `MCQ_TEST` / `OFFICIAL_ASSESSMENT`  
**Evidence era:** `HISTORICAL`  
**Assessment confidence:** `PARTIALLY_UNVERIFIED`  

| Q | PDF page | topics | skills | diff | confidence | granularity | generate | adaptive policy | mastery policy | readiness eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 2 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 3 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 4 | PDF_PAGE_2 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 5 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 6 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 7 | PDF_PAGE_3 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 8 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 9 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 10 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 11 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 12 | PDF_PAGE_4 | RL_T01_PROP_LOGIC | RL_SK01_01_CONNECTIVE, RL_SK01_03_TRUTH_TABLE, RL_SK01_04_PROP_VALIDITY, RL_SK01_05_EQUIV, RL_SK01_06_NORMAL_FORM, RL_SK01_07_SAT_PROP | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 13 | PDF_PAGE_4 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 14 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 15 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 16 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 17 | PDF_PAGE_5 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 18 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 19 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |
| 20 | PDF_PAGE_6 | RL_T02_FOL | RL_SK02_01_NL_TO_FOL, RL_SK02_02_FOL_TO_NL, RL_SK02_03_NEGATE_FOL, RL_SK02_04_TARSKI, RL_SK02_05_FORMAL_STRUCTURE, RL_SK02_06_COUNTERMODEL | 2 | LOW | UNVERIFIED_OR_DRILL_ONLY | False | UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS | DO_NOT_UPDATE_SKILL_MASTERY | False |

# Provenance coverage

| locator class | count |
| --- | --- |
| question_PDF_PAGE | 444 |
| question_PDF_PAGE_RANGE | 7 |
| question_UNKNOWN | 38 |
| skill_PDF_PAGE_RANGE | 224 |
| topic_PDF_PAGE_RANGE | 60 |

Exact question-page provenance is not claimed for analytical IP component records. Topic/skill lecture provenance is document-range level, not an assertion that every page is equally relevant.

# INSTRUCTIONS FOR CODEX

1. Treat this handoff pack as the normalized academic specification for DelftStudy. Do not reinterpret all 90 PDFs from scratch unless an item is explicitly UNKNOWN, UNVERIFIED, PARTIALLY_UNVERIFIED, or page/visual verification is required.
2. Keep subject_id, topic_id, subtopic_id, skill_id, document_id, assessment_id, question_type_id, pattern_id, error_tag, and relationship identifiers immutable once persisted. Migrations must preserve referential integrity.
3. Use subject/course associations from the pack. Never infer a cross-course association from similar terminology.
4. Preserve document_type, official_status, evidence_era, current_style_weight, filename_year_label, internal_date, and solution_included as distinct fields. Never count OFFICIAL_PRACTICE_MATERIAL as an observed official sitting.
5. For current exam-style generation, prefer CURRENT evidence, then RECENT evidence. HISTORICAL evidence may supply mechanisms only when still corroborated. Do not silently revive obsolete assessment formats.
6. Any question with mapping_granularity=UNVERIFIED_OR_DRILL_ONLY, or an explicitly PARTIALLY_UNVERIFIED/LOW/UNVERIFIED mapping, must have can_generate_variants=false, must not be used as a source-derived generation template, must not update individual skill mastery, must not contribute weighted exam-readiness, and must not contribute verified topic/skill historical-frequency counts.
7. Do not convert UNKNOWN/UNVERIFIED source locator, difficulty component, future weighting, or future exam content into numeric/factual values. UNKNOWN is a valid data state. A whole-document page range is document-level provenance, not exact page-level provenance.
8. Respect mapping_granularity, skill_mastery_update_policy, historical_topic_frequency_eligible, historical_skill_frequency_eligible, and exam_readiness_eligible. Broad topic mappings may not award mastery to every child skill. Integrated IP programs require rubric/test decomposition before per-skill credit.
9. Historical_frequency counts UNIQUE assessment documents. by_assessment_type must also count UNIQUE assessment documents per type. Historical frequency is not a forecast and must never be treated as a future-exam probability.
10. Mastery must be based on demonstrated performance, not lecture/page completion. Keep learning_mastery and exam_mastery/readiness separate.
11. IP exam-readiness must include integrated program evidence (domain model + parsing + processing/CLI + relevant quality/testing requirements). Theory-only or code-prediction-only evidence is insufficient.
12. CO exam-readiness must include calculation/tracing/open explanation across early and late course clusters; do not infer readiness from one subsystem only.
13. R&L exam-readiness must include open formalization/model/countermodel/proof/induction-or-invariant evidence. MCQ-only evidence is insufficient.
14. Question generation must create new surface instances with the same verified academic mechanism/difficulty. Never copy real exam wording or data verbatim. no_verbatim_exam_copy=true.
15. Use deterministic validators only where a unique/oracle answer is reliable. Use rubric grading for proofs, open explanations, model construction and other multi-valid-answer tasks; use compile/tests/requirements for IP implementation.
16. If a task depends on geometry/diagrams not fully represented in parsed text, require the source page image or a verified reconstructed template; do not invent diagram geometry.
17. The existing x86-64 Assembly Visualizer belongs under CO_T06_ASSEMBLY_X86_64. Preserve its working engine/UI and integrate it as one Computer Organisation tool rather than making Assembly the whole course.
18. Do not expose a predicted TU Delft grade as a certainty. exam_readiness is an evidence index with confidence and coverage, not an official mark.
19. The handoff JSON contains source-document records and hashes, NOT the 90 source PDF binaries or full PDF text. If Codex needs to verify a diagram, exact wording, or unresolved locator, the original PDF must be supplied/accessed separately.
20. Run the schema validation plus the semantic integrity checks in FINAL_VALIDATION_REPORT after any migration/edit. A pack with broken refs, duplicate IDs/edges, invalid prerequisite refs, uncertainty-policy contradictions, frequency leakage, or manifest/checksum mismatch is not production-safe.