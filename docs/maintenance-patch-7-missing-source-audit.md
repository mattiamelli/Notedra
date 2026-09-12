# Patch 7 missing-source audit — resolved

All 25 previously uncovered units now have their trusted source and four new reviewed activities. Current unresolved categories A (missing), B (inaccessible), C (insufficient), D (ambiguous): **0 / 0 / 0 / 0**. No exemptions. The accepted 53-unit taxonomy is unchanged.

The operator explicitly supplied `CSE 11C Computer Organisation (CO).zip` and `CSE 11A Reasoning and Logic (R&L).zip` from Downloads. Only those two named files were inspected outside the previously authorized DelftStudy locations. All 32 canonical CO/R&L PDFs match the source-pack SHA-256 values. The 25 missing units were extracted for inspection under `/tmp/delftstudy-p7-supplied`; no archive/PDF was added to Git or the application build. The other seven CO PDFs did not trigger new exercises or changes to accepted content.

The previous bounded search had classified all 25 as A; that was not a claim that the files did not exist anywhere on the computer. The structured audit preserves that previous insufficiency and records its resolution. The newly supplied evidence, not topic names or generic templates, enabled authoring.

| Course | Unit | Verified source | Physical pages inspected | New | Still required |
|---|---|---|---|---:|---:|
| CSE1400_CO | CO_LEC_01 | CO Lecture 1 - History.pdf | 3, 4, 6, 7, 10, 15, 16, 17, 19, 21, 25 | 4 | 0 |
| CSE1400_CO | CO_LEC_04 | CO Lecture 4 - Logic Circuits Part 2.pdf | 6, 8, 27, 28, 29, 31 | 4 | 0 |
| CSE1400_CO | CO_LEC_08 | CO Lecture 8 - ISA Part 2.pdf | 3, 7, 13, 14, 15, 23, 25, 26, 27, 28, 29 | 4 | 0 |
| CSE1400_CO | CO_LEC_09 | CO Lecture 9 - BPU Part 1.pdf | 19, 20, 21, 22, 26 | 4 | 0 |
| CSE1400_CO | CO_LEC_10 | CO Lecture 10 - BPU Part 2.pdf | 4, 5, 9, 15, 18, 20, 21, 23, 24, 25, 26 | 4 | 0 |
| CSE1400_CO | CO_LEC_11 | CO Lecture 11 - IO.pdf | 17, 18, 23, 25, 26, 28, 29, 31, 32, 33 | 4 | 0 |
| CSE1400_CO | CO_LEC_12 | CO Lecture 12 - Memory.pdf | 7, 8, 9, 12, 14, 27, 30, 31 | 4 | 0 |
| CSE1400_CO | CO_LEC_15 | CO Lecture 15 - Parallel & Virtual Memory.pdf | 11, 13, 15, 19, 20, 26, 27, 29, 30, 32, 33, 34, 37 | 4 | 0 |
| CSE1300_RL | RL_LEC_00 | R&L Lecture 0 - Introduction.pdf | 5, 12, 16, 20, 21 | 4 | 0 |
| CSE1300_RL | RL_LEC_01 | R&L Lecture 1 - Propositional Calculus Part 1.pdf | 3, 4, 5, 6, 7, 14, 16, 17 | 4 | 0 |
| CSE1300_RL | RL_LEC_02 | R&L Lecture 2 - Propositional Calculus Part 2.pdf | 20, 21, 44, 47, 48, 49, 50, 54 | 4 | 0 |
| CSE1300_RL | RL_LEC_03 | R&L Lecture 3 - First-Order Logic.pdf | 29, 46, 64, 69, 70 | 4 | 0 |
| CSE1300_RL | RL_LEC_04 | R&L Lecture 4 - Methods of Proof Part 1.pdf | 16, 18, 23, 26, 30, 31 | 4 | 0 |
| CSE1300_RL | RL_LEC_05 | R&L Lecture 5 - Methods of Proof Part 2.pdf | 7, 8, 10, 16, 23, 26, 28 | 4 | 0 |
| CSE1300_RL | RL_LEC_06 | R&L Lecture 6 - Induction and Recursion Part 1.pdf | 12, 13, 24, 27, 28, 29, 30, 32 | 4 | 0 |
| CSE1300_RL | RL_LEC_07 | R&L Lecture 7 - Induction and Recursion Part 2.pdf | 14, 16, 17, 19, 23, 25, 27, 29, 34, 35, 42, 43, 44 | 4 | 0 |
| CSE1300_RL | RL_LEC_08 | R&L Lecture 8 - Induction and Recursion Part 3.pdf | 7, 20, 23, 24, 29, 40, 51 | 4 | 0 |
| CSE1300_RL | RL_LEC_09 | R&L Lecture 9 - Set Theory Part 1.pdf | 7, 9, 10, 11, 16, 24, 34 | 4 | 0 |
| CSE1300_RL | RL_LEC_10 | R&L Lecture 10 - Set Theory Part 2.pdf | 6, 14, 17, 19, 25, 28 | 4 | 0 |
| CSE1300_RL | RL_LEC_11 | R&L Lecture 11 - Set Theory Part 3.pdf | 6, 8, 12, 16, 18, 27, 29 | 4 | 0 |
| CSE1300_RL | RL_LEC_12 | R&L Lecture 12 - Functions & Relations.pdf | 9, 22, 34, 36, 39, 40, 44 | 4 | 0 |
| CSE1300_RL | RL_LEC_13 | R&L Lecture 13 - The limitations of Set Theory.pdf | 12, 17, 18, 21, 22, 25, 39, 40, 41, 43 | 4 | 0 |
| CSE1300_RL | RL_LEC_14 | R&L Lecture 14 - Functions on trees and graphs.pdf | 5, 6, 7, 9, 17, 22 | 4 | 0 |
| CSE1300_RL | RL_LEC_15 | R&L Lecture 15 - Exam Prep.pdf | 6, 8, 10, 11, 17, 19, 20, 22, 23, 25, 27, 29 | 4 | 0 |
| CSE1300_RL | RL_LEC_16 | R&L Lecture 16 - The Last One.pdf | 6, 11, 18, 22, 24, 26 | 4 | 0 |

See [per-unit source hashes, reviewed pages and distinct demands](maintenance-patch-7-restored-source-review.json).
