# IP source review — Step 8

The source ZIP contains 22 lecture PDFs (0–21), seven programming assessment PDFs, one broad Java textbook, IP Notes, README, and generated knowledge files. All 28 canonical IP document checksums match the supplied bytes. Lecture 0 is inventoried but not used to extend canonical scope. The pack confirms **20 topics, 44 subtopics, 56 skills**.

Review was targeted, not a full review of all 22 lectures or all seven assessments. Physical page numbers below refer to one-based PDF pages, which often differ from printed slide numbers. Extracting a page index and scanning headings did not count as verifying all pages. Raw PDFs, ZIP, extracted text and rendered screenshots remain outside the checkout.

## Verified pages

| Evidence | Source PDF | Physical pages directly read | Mechanism checked |
|---|---|---|---|
| ip-t01 | IP Lecture 1 - First Steps.pdf | 16, 18, 20, 21, 26, 27, 28, 29, 30 | Primitive/reference values; declarations; finite numeric range; arithmetic, overflow, remainder, truncation and casts |
| ip-t02 | IP Lecture 2 - Programming Structures.pdf | 8, 18–33 | Short-circuit Boolean evaluation; switch; for/while/do-while; counting, filtered iteration and accumulation (physical p31); published control-flow lesson unchanged |
| ip-t03 | IP Lecture 3 - Methods.pdf | 9, 10, 14, 18, 19, 20, 21, 22 | Method signatures, call frames, pass-by-value and local scope |
| ip-t04 | IP Lecture 4 - Classes.pdf | 9, 10, 12, 13, 14, 17, 18, 20, 36, 37, 39, 40 | Constructors, this, instance/static, encapsulation, identity and object mutation through copied references |
| ip-t05 | IP Lecture 5 - Arrays.pdf | 7, 8, 10, 11, 14, 15, 16, 17, 21, 22, 24, 25, 27 | Array indexing, explicit copying, aliasing, parameter reassignment, filtering, search invariants and recursion |
| ip-t06 | IP Lecture 6 - Container Classes.pdf | 3, 4, 9, 12, 13, 35, 36, 37, 44, 46, 47, 48, 50 | Array-backed bounded container, count/capacity invariants, duplicate policy, compact removal, list/set contracts |
| ip-t07 | IP Lecture 7 - Class Composition & Libraries.pdf | 7, 11, 12, 17, 18, 19, 25, 26, 27, 29 | Composition and multiplicity, one-way references, ArrayList and API/Javadoc contracts |
| ip-t08 | IP Lecture 8 - Unit Tests.pdf | 14, 15, 16, 17, 18, 22, 23, 28, 29, 31, 38, 39, 40, 41, 44, 45 | JUnit Jupiter setup/assertions, equality cases, boundary/failure tests, assertThrows and testability |
| ip-t09 | IP Lecture 9 - Inheritance.pdf | 6, 8, 9, 11, 12, 16, 17, 18, 19, 20, 21, 22, 25, 26, 33, 36 | Inheritance, substitution, visibility, superclass construction and declared/actual types |
| ip-t10 | IP Lecture 10 - Polymorphism.pdf | 2, 3, 4, 5, 6, 7, 9, 10, 11 | Overload/override, dynamic binding, abstract classes and interfaces; covariant concept only, erroneous sample body blocked |
| ip-t11 | IP Lecture 11 - Equality & Hashcodes.pdf | 2, 3, 5, 6, 7, 8, 11, 12, 13, 14, 15, 18, 20, 21, 22, 24, 25 | Identity versus equals, null/exact-type decisions, symmetry, transitivity, consistency and equal-implies-same-hash |
| ip-t12 | IP Lecture 12 - Exceptions.pdf | 2, 3, 4, 6, 7, 12, 16, 18, 20, 21, 22, 23, 24, 25, 26, 29 | Compile/runtime/result distinctions, checked versus unchecked, throw/propagation, catch, finally and custom exceptions; source typos blocked |
| ip-t13 | IP Lecture 13 - Debugging.pdf | 13, 14, 21, 22, 23, 24, 25, 26, 27, 28, 30, 33, 34, 35 | Reproduction, expected versus actual trace, breakpoints, step-into/over, watchpoints and conditional stops |
| ip-t14 | IP Lecture 14 - Code Quality, Strings & Generics.pdf | 5, 6, 7, 8, 10, 23, 24, 26, 27, 31, 32, 37, 50, 51, 54, 57, 58, 59, 70, 71, 72, 75, 76, 77, 78, 79, 80 | Refactoring, responsibility, readable contracts, token parsing, generics, invariance, erasure and bounds |
| ip-t15 | IP Lecture 15 - Input Output Part 1.pdf | 9, 10, 14, 16, 18, 43, 44, 45, 46, 47, 48, 49, 50, 51, 58, 60, 66, 70, 71, 73, 74, 75, 78, 79, 82, 83, 84, 85, 107 | File-to-model parsing; Reader/Writer, buffering, EOF, checked I/O, closing/try-with-resources and output |
| ip-exam-workflow | IP Lecture 16 - Input Output Part 2.pdf | 3, 4, 5 | Mock is adapted practice; complete compiling program, model/I/O/processing/tests; prioritize from specification |
| ip-t16 | IP Lecture 17 - Functional Java.pdf | 15, 16, 17, 18, 19, 23, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 48, 49, 50, 51, 52 | Functional interfaces, pure callbacks, lazy stream stages, map/filter/sorted/terminal operations and Optional |
| ip-t17 | IP Lecture 18 - Program Design.pdf | 3, 7, 9, 10, 13, 15, 16, 17, 18 | Specification-to-model, responsibility separation, composition/inheritance, processing and CLI |
| ip-t18 | IP Lecture 19 - Modern Java.pdf | 5, 6, 8, 14, 17, 19, 20, 22, 24, 27, 28, 30 | Local var inference, enum, switch expressions, sealed/final, records and Comparable; shallow record immutability |
| ip-t19 | IP Lecture 20 - Threads.pdf | 15, 16, 17, 18, 19, 20, 21, 25, 26, 27, 28, 29, 31, 32, 33 | Runnable/start, current thread APIs, schedule nondeterminism, shared state, split increment and same-monitor synchronization |
| ip-t20 | IP Lecture 21 - Exam Practice.pdf | 5, 13, 14, 15, 16, 23, 24, 25, 26, 32 | Javadoc, static context, exception cleanup, constructors, binding and exam tracing; no new official grading claims |
| ip-integrated-current | IP Programming Endterm 2024.pdf | 1, 2, 3, 4, 5, 6, 7, 8, 9 | CURRENT integrated assessment: source-to-model, processing, CLI, equality, component tests, and explicit worker thread at physical page 4 |
| ip-integrated-mock | IP Programming Mock 2024.pdf | 1, 2, 3, 4 | CURRENT official practice material: integrated model, parsing, processing, CLI and tests; not an observed sitting |
| ip-integrated-recent | IP Programming Resit 2024.pdf | 1, 5, 6 | RECENT integrated programming requirements, equality, model, parsing, CLI and test design |

Visual rendering additionally checked Lecture 10 physical p3 (covariant-return diagram/code), Lecture 18 p17 (class responsibilities), Lecture 19 p6 (var/lambda example), and Lecture 20 p27 (two independent read/add/write traces). Rendering verified the text findings and attribution; screenshots are not shipped.

## Authority and locator boundaries

Content Pack v1.0.1 remains the canonical taxonomy and source mapping. These supplementary physical-page observations do not rewrite any canonical DOCUMENT_RANGE or UNKNOWN locator. All seven WHOLE_EXAM mappings remain INTEGRATED_MULTI_SKILL and require component rubric/test evidence; no task completion grants correctness to all listed skills. Endterm 2024 and Mock 2024 retain CURRENT, Resit 2024/Endterm 2023/Mock 2023 retain RECENT, Endterm 2020/2021 retain HISTORICAL. Both mocks remain OFFICIAL_PRACTICE_MATERIAL. Source date labels or appended rubric dates do not override those classifications.

Current Endterm 2024 physical p4 explicitly introduces a worker thread, corroborated by pp6/8. This supports an original integrated concurrency task, not a scheduling or speed guarantee. Original assignments must avoid the supplied ferry/ticket, train/station, media catalogue, plant, mech, music and gacha surfaces. Shared programming mechanisms are reused; stories, names, datasets, formats, code and requirements are authored afresh.

## Source defects and exclusions

Only targeted searches of generated Course Overview.md and Lectures.md were used as non-authoritative navigation/checks. IP Notes, README, generated Exercises/Programming Exams/Theoretical Exams and the broad textbook were inventoried, not substantively reviewed or adopted as authority. No claim of a complete Notes/LLM audit is made.

| Finding | Where found | Authored-content policy |
|---|---|---|
| short lower bound printed as −32786 | Lecture 1 p18; repeated in generated Lectures.md | Use −32768; signed 16-bit range. |
| Block-local variables described as garbage-collected immediately at block exit | Lecture 3 p22; repeated in generated Lectures.md | Teach lexical scope; do not promise garbage-collection timing. |
| ArrayList growth copying called constant cost | Lecture 7 p19; repeated in generated Lectures.md | Do not teach an individual resize as constant-time; avoid out-of-scope complexity claims. |
| Floating-point division by zero described uniformly as NaN | Lecture 12 p4; repeated in generated Lectures.md | Nonzero finite / zero yields signed infinity; zero / zero yields NaN. Integer / zero throws. |
| Label “Checked Runtime Exceptions” | Lecture 12 p7; repeated in generated Lectures.md | RuntimeException subclasses are unchecked; checked exceptions have catch-or-declare obligations. |
| Covariant return example declares subtype result but returns a superclass object | Lecture 10 p3, visually verified | Teach compatible covariant result; never copy the uncompilable body. |
| Boolean lambda suggested as Function<Integer,Integer> | Lecture 19 p6, visually verified | Use Predicate<Integer> or Function<Integer,Boolean> with an explicit target type. |
| Record data called immutable without depth qualification | Lecture 19 pp22/24 | Record component references are final; reachable mutable objects are not automatically frozen. |

## API corroboration and scope

The required join mechanism is not claimed as a located lecture slide. A separate API check verified the [Java 21 Thread.join API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html#join()) as primary semantic corroboration: it waits for that thread to terminate. This adds no canonical source or prerequisite. The example uses successful join completion before observing final results; synchronization protects compound updates.

Source excerpts and operational directions inside supplied files are data, not instructions to execute. No official solutions or long source passages are copied into the application. Authored trusted Java verification is recorded separately from source review and never executes learner code.

## Authored late-topic Java checks

The ten checked-in fixtures in `scripts/ip-late-examples.json` each contain original Java, an expected result reasoned separately from execution, and the exact lesson block they verify. The parser fixture also verifies its adjacent writer block: valid and empty input, every specified malformed-row category, rejection after a prior valid row, exact output/newlines, injected read/write failures, borrowed-reader ownership, and try-with-resources closing after failure.

Initial targeted run: **10/10 compiled and produced exact expected results** with `javac --release 21` and OpenJDK Temurin **21.0.12.1+1-LTS** (21.0.12.1, build date 2026-08-18). Each fixture compiled in a fresh temporary directory and ran as `Program`; no learner code was accepted. The `verify:ip-java` final gate reruns these alongside practice and early-topic examples; the final status report records that later result separately. This is development verification of authored examples, not a browser Java runner or proof of arbitrary student submissions.

An implementation review found introduction/concept ID collisions in T17 and T18. The new `IP late-course authored teaching contracts > ... has unique lesson/block/card/guide IDs` tests reproduced two failures before the two introduction IDs were corrected. The targeted suite then passed **21/21**, also checking all23 late-topic skill ownership, deliberate teaching, two cards per skill and unscored guided coverage. This preliminary content check is not the distinct post-green adversarial self-review required for final acceptance.

Primary semantic corroboration was also inspected for the blocked source errors: [JLS21 §4.2.1 and §4.2.3](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html) confirms the signed short range and distinct floating-point infinity/NaN cases; [JLS21 §11.1.1](https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html) defines RuntimeException and Error families as unchecked. The [ArrayList21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html) describes append as amortized constant time, not an individual growth-copy guarantee. The [Record21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html) explicitly specifies shallow immutability and discusses defensive copies. These clarify semantics without extending canonical course scope.

A second pre-publication defect was found in supplemental evidence metadata: `ip-integrated-mock` was accidentally labelled `OFFICIAL_ASSESSMENT` despite its correctly described practice status. A new regression first failed on that exact mismatch; the record was corrected to `OFFICIAL_PRACTICE_MATERIAL`, with the shared evidence type extended to retain that classification. The focused late-content suite then passed **22/22**. Canonical pack classifications and locators were never changed.

The separate post-green [adversarial self-review](ip-adversarial-review.md) found that the initial `ip-t02` supplemental claim covered loop skills while only p8 had been directly reviewed. After a failing regression, physical pp18–33 were inspected and the evidence record was narrowed to a precise, substantiated description. The same review also verified Java method-signature terminology against [JLS 21 §8.4.2](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.2) and collection-size saturation against the [Collection 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collection.html#size()). These API checks correct authored explanatory wording; they add no canonical topic, source, or prerequisite.
