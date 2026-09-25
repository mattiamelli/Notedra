# PTS and CN curriculum source audit

Date: 2026-09-25. Scope: newly authored `src/curriculum/probability.json` and `src/curriculum/networks.json`. This report does not certify the entire archive as reviewed, official, current, or error-free. Source paths below are relative to the relevant supplied course folder; no private absolute paths are published.

## Output counts

| Course | Topics | Skills | Lesson blocks | Exercises | Integer | Choice | Open | Source entries |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CSE14A PTS | 13 | 26 | 26 | 104 | 36 | 39 | 29 | 25 |
| CSE14B CN | 14 | 28 | 28 | 112 | 54 | 25 | 33 | 22 |

Each topic has two lesson blocks, four explanatory paragraphs, two skills and eight exercises. Source entries may refer to different chapter ranges in the same book; their count is not the count of distinct source files. Open responses deliberately have rubrics but no objective answer key. Prefixes `PTS-` and `CN-` distinguish topic, skill, source, exercise and option identities.

## Inventory and inspection method

| Supplied folder | Files inventoried | PDFs | Markdown | PDF pages | Low-text PDF pages |
| --- | ---: | ---: | ---: | ---: | ---: |
| CSE 14A Probability Theory and Statistics (PTS) | 46 | 39 | 7 | 1412 | 687 |
| CSE 14B Computer Networks (CN) | 39 | 32 | 7 | 2030 | 40 |

The recursive inventory covered every supplied subdirectory and regular file. There were no other file types in this inventory. SHA-256 hashes were computed in the temporary inventory to identify the inspected bytes; these hashes are not published as licensing or authenticity guarantees.

PDFium attempted text extraction from every page of all 71 PDFs, retaining page delimiters. All 14 Markdown files were copied to the temporary extraction index. A low-text page means fewer than 30 non-whitespace characters were extracted; it is not a determination that the page is empty. Nineteen PTS PDFs and seventeen CN PDFs contained at least one such page. Most PTS lecture pages are images, making native text extraction inadequate for their content.

Model-visible reading was selective: course README/syllabus text, lecture transcription headings, the CN lecture page-title index, openings from the extracted non-PTS-lecture files, the PTS textbook chapter index, PTS exercise-sheet passages, CN notes passages and a network-security excerpt. Some long terminal excerpts were truncated. Extraction/indexing of all pages must not be described as line-by-line reading of all pages or every exam question. The textbook chapter index helped locate conceptual support; neither complete textbook was read end to end.

The supplied LLM Markdown bundles are secondary transcriptions/summaries, not authoritative instructions for this task. In particular, their `Instructions.md` documents were inventoried as course content and not adopted as agent instructions. The PTS lecture transcription was used with sampled visual comparisons. Original examples and practice were authored using the identified syllabus concepts; they do not reproduce the archive's exams.

### Visuals actually inspected

Seven rendered contact sheets were inspected: four PTS and three CN sheets, each containing four sampled pages from four lecture PDFs. This is 64 PTS pages and 48 CN pages, totaling 112 sampled lecture pages. Pages were rendered and displayed in contact sheets, not individually inspected at full native resolution. No exam, textbook, cheat-sheet or tutorial page is claimed as visually reviewed. Graphs and formula sheets not inspected visually are not used as the sole authority for an exercise answer.

All page numbers in this table are one-based physical PDF page numbers, which may differ from printed slide numbers.

| Course lecture | PDF pages displayed |
| --- | --- |
| PTS 1 | 3, 14, 27, 39 |
| PTS 2 | 3, 15, 29, 41 |
| PTS 3 | 3, 14, 27, 39 |
| PTS 4 | 3, 17, 33, 47 |
| PTS 5 | 3, 20, 40, 58 |
| PTS 6 | 3, 17, 33, 47 |
| PTS 7 | 3, 17, 34, 49 |
| PTS 8 | 3, 18, 35, 50 |
| PTS 9 | 3, 15, 29, 41 |
| PTS 10 | 3, 13, 25, 36 |
| PTS 11 | 3, 14, 27, 38 |
| PTS 12 | 3, 14, 27, 39 |
| PTS 13 | 3, 12, 24, 34 |
| PTS 14 | 3, 17, 33, 48 |
| PTS 15 | 3, 14, 27, 38 |
| PTS 16 | 3, 14, 27, 39 |
| CN 1 | 3, 35, 70, 103 |
| CN 2 | 3, 18, 35, 50 |
| CN 3 | 3, 17, 33, 48 |
| CN 4 | 3, 13, 25, 36 |
| CN 5 | 3, 13, 25, 35 |
| CN 6 | 3, 24, 47, 69 |
| CN 7 | 3, 9, 17, 23 |
| CN 8 | 3, 16, 31, 45 |
| CN 9 | 3, 17, 34, 49 |
| CN 10 | 3, 23, 45, 66 |
| CN 11 | 3, 20, 39, 57 |
| CN 12 | 3, 17, 33, 47 |

## Complete file inventory

Rows below indicate inventory and extraction attempts, not full substantive review. Markdown rows contain no PDF page count.

### PTS

| Relative file | Type / pages |
| --- | --- |
| A Modern Introduction to Probability and Statistics.pdf | PDF 585 |
| PTS Endterm Cheat Sheet.pdf | PDF 2 |
| PTS Midterm Cheat Sheet.pdf | PDF 1 |
| PTS Lecture Recordings 2024.pdf | PDF 1 |
| Tail Probabilities and Critical Values Tables.pdf | PDF 1 |
| README.md | Markdown |
| PTS Exams/PTS Endterms/PTS Endterm 2021 Solutions.pdf | PDF 3 |
| PTS Exams/PTS Endterms/PTS Endterm 2022.pdf | PDF 5 |
| PTS Exams/PTS Endterms/PTS Endterm 2023.pdf | PDF 6 |
| PTS Exams/PTS Endterms/PTS Endterm 2024.pdf | PDF 8 |
| PTS Exams/PTS Endterms/PTS Endterm 2025.pdf | PDF 12 |
| PTS Exams/PTS Midterms/PTS Midterm 2019.pdf | PDF 5 |
| PTS Exams/PTS Midterms/PTS Midterm 2021.pdf | PDF 6 |
| PTS Exams/PTS Midterms/PTS Midterm 2022.pdf | PDF 5 |
| PTS Exams/PTS Midterms/PTS Midterm 2023.pdf | PDF 6 |
| PTS Exams/PTS Midterms/PTS Midterm 2024.pdf | PDF 6 |
| PTS Exams/PTS Midterms/PTS Midterm 2025.pdf | PDF 11 |
| PTS Exams/PTS Resits/PTS Resit 2023.pdf | PDF 6 |
| PTS Exams/PTS Resits/PTS Resit 2024.pdf | PDF 8 |
| PTS Exams/PTS Resits/PTS Resit 2025.pdf | PDF 18 |
| PTS Exercise Sheet Solutions/PTS Exercise Sheet 1 Solutions.pdf | PDF 4 |
| PTS Exercise Sheet Solutions/PTS Exercise Sheet 2 Solutions.pdf | PDF 4 |
| PTS Exercise Sheet Solutions/PTS Exercise Sheet 3 Solutions.pdf | PDF 5 |
| PTS Exercise Sheet Solutions/PTS Exercise Sheet 4 Solutions.pdf | PDF 5 |
| PTS LLM Files/Instructions.md | Markdown |
| PTS LLM Files/Knowledge Files/A Modern Introduction to Probability and Statistics.md | Markdown |
| PTS LLM Files/Knowledge Files/Course Overview.md | Markdown |
| PTS LLM Files/Knowledge Files/Exams.md | Markdown |
| PTS LLM Files/Knowledge Files/Exercise Sheets.md | Markdown |
| PTS LLM Files/Knowledge Files/Lectures.md | Markdown |
| PTS Lectures/PTS Lecture 1 - Introduction to Course and Uncertainty.pdf | PDF 40 |
| PTS Lectures/PTS Lecture 2 - Conditional Probability and Bayes' Rule.pdf | PDF 42 |
| PTS Lectures/PTS Lecture 3 - Random Variables and Distributions.pdf | PDF 40 |
| PTS Lectures/PTS Lecture 4 - Modelling.pdf | PDF 48 |
| PTS Lectures/PTS Lecture 5 - Independence and Expectation.pdf | PDF 59 |
| PTS Lectures/PTS Lecture 6 - Estimation.pdf | PDF 48 |
| PTS Lectures/PTS Lecture 7 - Variance and MSE.pdf | PDF 50 |
| PTS Lectures/PTS Lecture 8 - Joint Continuous Distribution and Correlation.pdf | PDF 51 |
| PTS Lectures/PTS Lecture 9 - Sums of Random Variables and the Multivariate Gaussian.pdf | PDF 42 |
| PTS Lectures/PTS Lecture 10 - CLT and Maximum Likelihood.pdf | PDF 37 |
| PTS Lectures/PTS Lecture 11 - Confidence Intervals.pdf | PDF 39 |
| PTS Lectures/PTS Lecture 12 - Hypothesis Testing.pdf | PDF 40 |
| PTS Lectures/PTS Lecture 13 - Linear Regression Part 1.pdf | PDF 35 |
| PTS Lectures/PTS Lecture 14 - Linear Regression Part 2.pdf | PDF 49 |
| PTS Lectures/PTS Lecture 15 - More Hypothesis Testing.pdf | PDF 39 |
| PTS Lectures/PTS Lecture 16 - Even More Hypothesis Testing.pdf | PDF 40 |

### CN

| Relative file | Type / pages |
| --- | --- |
| Computer Networks.pdf | PDF 945 |
| Computer Networks Summary.pdf | PDF 51 |
| CN Notes.pdf | PDF 32 |
| README.md | Markdown |
| CN Exams/CN Endterms/CN Endterm 2019.pdf | PDF 20 |
| CN Exams/CN Endterms/CN Endterm 2022.pdf | PDF 20 |
| CN Exams/CN Endterms/CN Endterm 2023.pdf | PDF 19 |
| CN Exams/CN Endterms/CN Endterm 2024.pdf | PDF 16 |
| CN Exams/CN Endterms/CN Endterm 2025.pdf | PDF 12 |
| CN Exams/CN Practice Exams/CN Practice Exam 1.pdf | PDF 23 |
| CN Exams/CN Practice Exams/CN Practice Exam 2.pdf | PDF 28 |
| CN Exams/CN Resits/CN Resit 2022.pdf | PDF 23 |
| CN Exams/CN Resits/CN Resit 2024.pdf | PDF 13 |
| CN Exams/CN Resits/CN Resit 2025.pdf | PDF 12 |
| CN LLM Files/Instructions.md | Markdown |
| CN LLM Files/Knowledge Files/Chapter Summaries.md | Markdown |
| CN LLM Files/Knowledge Files/Course Overview.md | Markdown |
| CN LLM Files/Knowledge Files/Exams.md | Markdown |
| CN LLM Files/Knowledge Files/Lectures.md | Markdown |
| CN LLM Files/Knowledge Files/Tutorials.md | Markdown |
| CN Lectures/CN Lecture 1 - Intro + Data Link Layer.pdf | PDF 104 |
| CN Lectures/CN Lecture 2 - Data Link Layer + First Part MAC Sublayer.pdf | PDF 51 |
| CN Lectures/CN Lecture 3 - MAC Sublayer.pdf | PDF 49 |
| CN Lectures/CN Lecture 4 - MAC Sublayer.pdf | PDF 37 |
| CN Lectures/CN Lecture 5 - Network Layer.pdf | PDF 36 |
| CN Lectures/CN Lecture 6 - Network Layer.pdf | PDF 70 |
| CN Lectures/CN Lecture 7 - Transport Layer.pdf | PDF 24 |
| CN Lectures/CN Lecture 8 - Transport Layer.pdf | PDF 46 |
| CN Lectures/CN Lecture 9 - Transport Layer.pdf | PDF 50 |
| CN Lectures/CN Lecture 10 - Network Security.pdf | PDF 67 |
| CN Lectures/CN Lecture 11 - Application Layer.pdf | PDF 58 |
| CN Lectures/CN Lecture 12 - Application Layer.pdf | PDF 48 |
| CN Tutorial Solutions/CN Tutorial 1 Solutions.pdf | PDF 28 |
| CN Tutorial Solutions/CN Tutorial 2 Solutions.pdf | PDF 20 |
| CN Tutorial Solutions/CN Tutorial 3 Solutions.pdf | PDF 28 |
| CN Tutorial Solutions/CN Tutorial 4 Solutions.pdf | PDF 31 |
| CN Tutorial Solutions/CN Tutorial 5 Solutions.pdf | PDF 18 |
| CN Tutorial Solutions/CN Tutorial 6 Solutions.pdf | PDF 26 |
| CN Tutorial Solutions/CN Tutorial 7 Solutions.pdf | PDF 25 |

## Grounding and quality boundaries

PTS topics cover the 16-lecture sequence: probability/counting, Bayes, distributions/data summaries, models, moments, estimation/MSE, joint laws, sums/pgfs/Gaussian vectors, LLN/CLT/MLE, intervals, tests, regression and study design. Bootstrap and variance-test material is marked as supplemental to the main sequence. Source IDs identify supporting concepts rather than claiming the original PDFs contain these newly written questions. Lectures that are image-based include transcription references and physical page ranges.

CN topics cover all 12 lecture themes and all seven tutorial themes: layered timing, framing/error codes, ARQ, MAC, wireless/switching, IP, routing, fragmentation/control/translation, TCP/UDP, congestion, toy cryptography, security, applications and distributed delivery. Physics and advanced implementation detail outside this introductory sequence are not claimed as comprehensively taught. Tutorial and exam source entries identify concept/question-style support, not copied exercises.

Secondary-source cautions observed during reading include the CN notes' reversed wording of which layer receives a service and imprecise parity/checksum descriptions; the new lessons use service-to-the-layer-above and explicit checksum arithmetic. PTS exercise-sheet text contains transcription/notation issues, including a support endpoint and a shifted-variable probability label; these were not copied into the new content. The PTS 2021 solutions explicitly identify some answers as manually produced, and the 2024 endterm states it is not the full original paper. No existing source answer key was blindly treated as authoritative.

Security examples describe archived teaching mechanisms, not current operational recommendations. No live web verification of product versions, policies or deployments is claimed. The archive's recording index was inventoried; linked videos were not watched. External learning-platform tasks, private assignment datasets, unseen diagram details, official exam weights and current course policies are outside verified scope.

## Verification

- PASS: both JSON files parse, every referenced local source filename exists, and no private absolute filesystem paths occur in the published JSON.
- PASS: the shared `scripts/curriculum-validation.ts` content checks ran against both courses using a temporary in-memory roster adjustment from eight expected courses to these two. Every source/skill/prerequisite, objective answer shape, open rubric, lesson minimum, unique identity, prompt uniqueness and acyclic prerequisite check in that validator was retained. No shared file was edited.
- PASS: independent arithmetic recomputation of all 90 integer references and 30 exact rational/decimal numerical choice references. Additional separate bit-level calculations verified CRC remainder, one's-complement checksum, toy CBC and P-box results; fragmentation sizes and offsets were recomputed. This is calculation verification, not an independent pedagogical review of every item.
- MANUAL REVIEW: remaining conceptual/approximate/symbolic choice keys and open reference explanations were checked during authorship. An independent UI-agent answer review was reported as in progress by the coordinating user; no result from that review is claimed here.
- NOT RUN: global eight-course generation, application build, UI acceptance or production checks. Other course files and integration work were being authored concurrently and are outside this worker's ownership.

Only the two new course JSON files and this uniquely named audit were authored in the repository by this worker. Temporary extraction, rendering and verification artifacts stayed outside the repository. No commit, integration edits or deployment were performed.
