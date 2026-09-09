# Step 5 — Topic Learning Experience

**COMPLETE — 9 September 2026.** Only Step 5 was implemented. All critical academic, version, routing, storage, browser and Assembly regression checks executed and passed. No unresolved application defects were found after the fixes below. This is an implementation acceptance report and adversarial self-review, not an independent audit.

## 1. Git baseline and final checkpoint

- Started from clean `acfad2d0017a65682ded3b82efea89fae82c6516` (Step 4).
- Implementation and reviewed regression fix: `e50d1e3fdd0d7e6d53f5eb5e38d7f5874edb289e`, `feat: add canonical topic learning and three authored pilots`.
- Final documentation commit: the commit containing this finalized report, `docs: record Step 5 topic learning acceptance evidence`. Resolve its exact hash with `git log -1 --format=%H -- docs/topic-learning-experience-status.md`; a tracked document cannot embed its own commit hash. The handoff response also records that hash.
- Final handoff requires and was checked with `git status --porcelain` (empty) and `git diff --check` (exit 0). No existing changes were reset or discarded. The preserved implementation checkpoint was clean before final browser verification/documentation.

No dependencies were installed or changed. Node **24.19.0**, TypeScript **5.9.3**, Vitest **4.0.18**, Vite **7.3.6**. The existing local hosting metadata was preserved; no deployment, new project or new repository was created.

## 2. Baseline and final command results

Before edits, all requested baseline commands passed: content validation, academic and student projections, practice validation, **370 tests in 16 files**, typecheck and production build. Baseline log: `/tmp/delftstudy-step5-baseline.log` (session-local evidence; this report retains its results).

| Final command | Actual result |
| --- | --- |
| `pnpm run validate:content` | PASS; schema, exact counts, relations, prerequisites, uncertainty, manifest integrity |
| `pnpm run check:academic` | PASS; 3 subjects / 43 topics; 7,462 bytes |
| `pnpm run check:references` | PASS; 3 / 43 / 105 / 147 and 489 source locators; 69,985 bytes |
| `pnpm run validate:practice` | PASS; the same six immutable exercises and grader locks |
| `pnpm run check:topics` | PASS; 3 / 43 / 105 / 147; 84,049 bytes |
| `pnpm run validate:topics` | PASS; 3 lessons / 27 blocks / 24 cards; ownership, sources and 54 locks |
| `pnpm test` | PASS; 469 tests in 20 files; 0 failed, skipped or pending; final run 12.45 seconds |
| `pnpm run typecheck` | PASS; exit 0 |
| `pnpm run build` | PASS; all gates, typecheck, 95 transformed modules, 3.49-second Vite build |
| Direct Vite API production build with emitted-module inspection | PASS; all configured gates ran; 86 emitted modules; no forbidden imports; completed output byte-identical to `dist/` |
| `git diff --check` | PASS; exit 0 |

Final command log: `/tmp/delftstudy-step5-final.log`. Review rerun: `/tmp/delftstudy-step5-reviewed.log`. Logs are not required runtime assets.

The unchanged Content Pack validator reports: **90 documents** (IP 28, CO 29, RL 33), **43 topics, 105 subtopics, 147 skills, 37 assessments, 489 mapped question records, 17 question types, 22 exam patterns, 29 error tags**. Relation counts: topic prerequisites **62**, skill prerequisites **69**, topic→subtopic **105**, subtopic→skill **147**, document→topic **306**, assessment→document **37**, question→topic **538**, question→skill **2,005**. All eight payload SHA-256/size checks plus the independently pinned manifest pass. All nine release files are byte-identical to `acfad2d`. **v1.0.0 is unused and absent.** Original PDF binaries/text were not opened or reanalysed.

## 3. Complete changed-file inventory

Relative to `acfad2d`: **29 files, 19 added and 10 modified**.

| Status | File |
| --- | --- |
| M | `README.md` |
| A | `docs/topic-learning-experience-status.md` |
| M | `package.json` |
| A | `scripts/generate-topic-study.ts` |
| A | `scripts/topic-content.ts` |
| A | `scripts/topic-projection.ts` |
| A | `scripts/validate-topic-content.ts` |
| M | `src/App.tsx` |
| M | `src/academic/navigation.ts` |
| A | `src/generated/topic-study.json` |
| M | `src/learning/LearningProvider.tsx` |
| M | `src/pages/TopicPage.tsx` |
| M | `src/shell/AppShell.tsx` |
| A | `src/topic-study/AcademicViews.tsx` |
| A | `src/topic-study/AuthoredViews.tsx` |
| A | `src/topic-study/TopicPractice.tsx` |
| A | `src/topic-study/content-lock.json` |
| A | `src/topic-study/content.ts` |
| A | `src/topic-study/flashcards.json` |
| A | `src/topic-study/lessons.json` |
| A | `src/topic-study/topic-study.css` |
| A | `src/topic-study/types.ts` |
| M | `tests/application-routing.test.tsx` |
| M | `tests/practice-ui.test.tsx` |
| A | `tests/topic-content.test.ts` |
| A | `tests/topic-examples.test.ts` |
| A | `tests/topic-projection.test.ts` |
| A | `tests/topic-ui.test.tsx` |
| M | `vite.config.ts` |

## 4. Topic Learning architecture

Canonical academic structure and authored educational text remain separate. The immutable v1.0.1 Handoff JSON is the source of truth; its normalized Master Content Pack was inspected directly to confirm the three pilots before authoring. A build-time projection feeds frozen browser selectors, canonical Overview/Mental Map components, typed lessons/cards, and a small Practice-link adapter. No browser import of the full handoff is used.

React Router keeps `/co/:topicId`, `/rl/:topicId`, `/ip/:topicId` as Overview. Valid suffixes are `overview`, `learn`, `mental-map`, `flashcards`, `practice`, `exam-style`, `mistakes`. Invalid topic/course/mode combinations use Not Found. The existing static Assembly route and Practice routes retain precedence. Breadcrumb/title resolution uses the same canonical route selector. Resume tracking only recognizes the new valid mode URLs and stores the existing topic identity.

## 5. Generated projection

`src/generated/topic-study.json`: **84,049 bytes**, **3 subjects / 43 topics / 105 subtopics / 147 skills / 106 deduplicated source records**. Budget: 180,000 bytes. SHA-256: `1b886353299ac96dbddd818c71074e0575079066b5c5a347febbcddf0e73608e`.

Allowlisted fields: subject IDs; topic ID/subject/name/description/relevance/prerequisites/source IDs/subtopics; subtopic ID/name/prerequisites/source IDs/skills; skill ID/name/description/prerequisites/source IDs; source ID/document ID/filename/locator/kind/precision/confidence. Source IDs are deterministic hashes of those selected fields, with collision detection. No assessment content, frequency tables, full question mappings or academic schema is included.

Locale-independent ID ordering, sorted references, deduplication and timestamp-free serialization give deterministic bytes. Generation validates the pack and writes atomically. Direct builds reject stale/missing output, invalid ownership, unknown references, cross-course/level prerequisites, cycles and duplicates. Existing navigation/student-reference artifacts are unchanged. The latter still contains only its pre-existing 489 minimal validation locators, not full question mappings or assessment content.

## 6. Authored model, scope and versioning

Controlled blocks: introduction, concept, procedure, worked_example, important_rule, common_pitfall, code_example and recap. Rendering uses React text, fixed code and bounded tables; no raw HTML/MDX execution. Every block/card has an ID, version, topic, owning subtopics, relevant skills and source associations. Runtime data is frozen. Validators reject extra fields, unsafe kinds, missing content, incomplete coverage and invalid provenance.

Three lessons, nine blocks each; every pilot skill is covered in both the lesson and its eight cards. All content is labelled authored DelftStudy material. `content-lock.json` contains **54 SHA-256 entries** (3 lessons + 27 blocks + 24 cards), **5,089 bytes**. Normal generation/build does not rewrite locks. Changed published content requires a new version and explicitly reviewed lock; lesson fingerprints also cover ordered child blocks. Negative tests prove old fingerprints reject changed text, identity and version.

Canonical pilot subtopics:

- CO: `CO_ST04_01_RADIX`, `CO_ST04_02_SIGNED_INTEGER`, `CO_ST04_03_OTHER_ENCODINGS`; six skills. No topic prerequisite.
- RL: `RL_ST01_01_CONNECTIVES`, `RL_ST01_02_TRUTH_VALID`, `RL_ST01_03_NORMAL_FORMS`, `RL_ST01_04_SAT_EXPLOSION`; seven skills. No topic prerequisite.
- IP: `IP_ST02_01_BOOLEAN_BRANCH`, `IP_ST02_02_LOOPS`; four skills. Prerequisite **`IP_T01_JAVA_BASICS`**.

All pilot subtopic prerequisite lists are empty. Canonical skill prerequisites remain intact: CO signed encoding requires radix conversion; RL validity/equivalence require truth tables, normal forms require connectives. The UI does not invent other dependencies.

| Source ID | Canonical filename | Recorded locator | Confidence / precision |
| --- | --- | --- | --- |
| CO_LEC_05 | CO Lecture 5 - Data Representation Part 1.pdf | PDF_PAGES_1-32 | HIGH / DOCUMENT_RANGE |
| CO_LEC_06 | CO Lecture 6 - Data Representation Part 2.pdf | PDF_PAGES_1-27 | HIGH / DOCUMENT_RANGE |
| RL_LEC_01 | R&L Lecture 1 - Propositional Calculus Part 1.pdf | PDF_PAGES_1-26 | HIGH / DOCUMENT_RANGE |
| RL_LEC_02 | R&L Lecture 2 - Propositional Calculus Part 2.pdf | PDF_PAGES_1-82 | HIGH / DOCUMENT_RANGE |
| IP_LEC_02 | IP Lecture 2 - Programming Structures.pdf | PDF_PAGES_1-34 | HIGH / DOCUMENT_RANGE |

These are **broad academic-scope associations**, not exact supporting pages for authored claims. Canonical subtopic UNKNOWN locator/precision records remain UNKNOWN. There are no invented PDF downloads or official-wording claims. Source records remain separate from assessment mapping confidence.

## 7. Exact lesson inventory

`lessons.json`: **27,195 bytes**, SHA-256 `f29bf2fd528704a230a59b9f4ee0231c5cc4460bdd4aa2b67e5b700d81a85f76`. All lesson/block versions are 1. Skill IDs below determine the exact owning subtopic associations stored in each block.

### `ds.lesson.co@1` — `CO_T04_DATA_REP_RADIX_INTEGER`

| Block ID (version 1) | Kind / title | Canonical skills | Source documents |
| --- | --- | --- | --- |
| `ds.block.co.model` | introduction — Bits need an interpretation | `CO_SK04_01_RADIX_CONVERT`, `CO_SK04_03_SIGNED_ENCODE`, `CO_SK04_05_BCD_EXCESS`, `CO_SK04_06_ENDIAN` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.radix` | procedure — Use positional weights | `CO_SK04_01_RADIX_CONVERT` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.radix-example` | worked_example — One value, three bases | `CO_SK04_01_RADIX_CONVERT`, `CO_SK04_02_RADIX_ARITH` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.signed` | concept — Choose the signed encoding | `CO_SK04_03_SIGNED_ENCODE` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.signed-example` | worked_example — Encode −5 in four bits | `CO_SK04_03_SIGNED_ENCODE` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.overflow` | worked_example — Check range before trusting the bits | `CO_SK04_04_OVERFLOW` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.encodings` | worked_example — BCD and excess encodings | `CO_SK04_05_BCD_EXCESS` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.endian` | worked_example — Byte order is a memory convention | `CO_SK04_06_ENDIAN` | CO_LEC_05, CO_LEC_06 |
| `ds.block.co.recap` | recap — State the format, then calculate | `CO_SK04_01_RADIX_CONVERT`, `CO_SK04_02_RADIX_ARITH`, `CO_SK04_03_SIGNED_ENCODE`, `CO_SK04_04_OVERFLOW`, `CO_SK04_05_BCD_EXCESS`, `CO_SK04_06_ENDIAN` | CO_LEC_05, CO_LEC_06 |

### `ds.lesson.rl@1` — `RL_T01_PROP_LOGIC`

| Block ID (version 1) | Kind / title | Canonical skills | Source documents |
| --- | --- | --- | --- |
| `ds.block.rl.model` | introduction — Reason about every valuation | `RL_SK01_01_CONNECTIVE`, `RL_SK01_03_TRUTH_TABLE` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.connectives` | concept — Read connectives precisely | `RL_SK01_01_CONNECTIVE`, `RL_SK01_02_NEC_SUFF` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.table` | procedure — Build columns before conclusions | `RL_SK01_03_TRUTH_TABLE` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.demorgan` | worked_example — Check a De Morgan equivalence | `RL_SK01_03_TRUTH_TABLE`, `RL_SK01_05_EQUIV` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.validity` | worked_example — Search for a counterexample row | `RL_SK01_04_PROP_VALIDITY` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.forms` | worked_example — DNF and CNF describe the same truth condition | `RL_SK01_06_NORMAL_FORM`, `RL_SK01_03_TRUTH_TABLE`, `RL_SK01_05_EQUIV` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.sat` | concept — Satisfiable, tautological, or inconsistent | `RL_SK01_07_SAT_PROP` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.pitfall` | common_pitfall — Truth is not argument validity | `RL_SK01_02_NEC_SUFF`, `RL_SK01_04_PROP_VALIDITY`, `RL_SK01_07_SAT_PROP` | RL_LEC_01, RL_LEC_02 |
| `ds.block.rl.recap` | recap — Keep the three tests separate | `RL_SK01_03_TRUTH_TABLE`, `RL_SK01_04_PROP_VALIDITY`, `RL_SK01_05_EQUIV`, `RL_SK01_06_NORMAL_FORM`, `RL_SK01_07_SAT_PROP` | RL_LEC_01, RL_LEC_02 |

### `ds.lesson.ip@1` — `IP_T02_CONTROL_FLOW`

| Block ID (version 1) | Kind / title | Canonical skills | Source documents |
| --- | --- | --- | --- |
| `ds.block.ip.model` | introduction — Follow the next executed statement | `IP_SK02_01_BOOLEAN_CONDITIONS`, `IP_SK02_02_BRANCH_TRACE`, `IP_SK02_03_LOOP_TRACE` | IP_LEC_02 |
| `ds.block.ip.conditions` | concept — Translate a condition before writing a branch | `IP_SK02_01_BOOLEAN_CONDITIONS` | IP_LEC_02 |
| `ds.block.ip.branch` | code_example — Trace an if / else-if chain | `IP_SK02_01_BOOLEAN_CONDITIONS`, `IP_SK02_02_BRANCH_TRACE` | IP_LEC_02 |
| `ds.block.ip.switch` | code_example — A switch starts at its matching case | `IP_SK02_02_BRANCH_TRACE` | IP_LEC_02 |
| `ds.block.ip.loops` | procedure — Separate initialization, test, body and update | `IP_SK02_03_LOOP_TRACE`, `IP_SK02_04_LOOP_IMPLEMENT` | IP_LEC_02 |
| `ds.block.ip.aggregate` | worked_example — Filter, count and aggregate in one traversal | `IP_SK02_03_LOOP_TRACE`, `IP_SK02_04_LOOP_IMPLEMENT` | IP_LEC_02 |
| `ds.block.ip.search` | code_example — Stop when a match is found | `IP_SK02_03_LOOP_TRACE`, `IP_SK02_04_LOOP_IMPLEMENT` | IP_LEC_02 |
| `ds.block.ip.pitfall` | common_pitfall — Check boundaries and accumulator placement | `IP_SK02_03_LOOP_TRACE`, `IP_SK02_04_LOOP_IMPLEMENT` | IP_LEC_02 |
| `ds.block.ip.recap` | recap — Explain the path and the changing state | `IP_SK02_01_BOOLEAN_CONDITIONS`, `IP_SK02_02_BRANCH_TRACE`, `IP_SK02_03_LOOP_TRACE`, `IP_SK02_04_LOOP_IMPLEMENT` | IP_LEC_02 |

## 8. Exact flashcard inventory

Every card is version **1**. Subtopic IDs are the exact owners of the listed skills; each source association is validated against those skills.

| Card ID | Prompt | Canonical skills | Source documents |
| --- | --- | --- | --- |
| `ds.card.co.weights` | How do you decode digits in base b? | `CO_SK04_01_RADIX_CONVERT` | CO_LEC_05, CO_LEC_06 |
| `ds.card.co.carry` | When does a carry occur in base-b addition? | `CO_SK04_02_RADIX_ARITH` | CO_LEC_05, CO_LEC_06 |
| `ds.card.co.sign-magnitude` | How do sign-and-magnitude and ones’ complement represent negative values? | `CO_SK04_03_SIGNED_ENCODE` | CO_LEC_05, CO_LEC_06 |
| `ds.card.co.twos` | How do you negate a fixed-width twos’ complement bit pattern? | `CO_SK04_03_SIGNED_ENCODE` | CO_LEC_05, CO_LEC_06 |
| `ds.card.co.range` | What ranges fit in n unsigned or n twos’ complement bits? | `CO_SK04_04_OVERFLOW` | CO_LEC_05, CO_LEC_06 |
| `ds.card.co.overflow` | What signals signed overflow when adding in twos’ complement? | `CO_SK04_04_OVERFLOW` | CO_LEC_05, CO_LEC_06 |
| `ds.card.co.bcd-excess` | How do BCD and excess encodings differ? | `CO_SK04_05_BCD_EXCESS` | CO_LEC_05, CO_LEC_06 |
| `ds.card.co.endian` | What does little-endian put at the lowest address of a multi-byte value? | `CO_SK04_06_ENDIAN` | CO_LEC_05, CO_LEC_06 |
| `ds.card.rl.or` | Does p ∨ q exclude the case where both are true? | `RL_SK01_01_CONNECTIVE` | RL_LEC_01, RL_LEC_02 |
| `ds.card.rl.necessary` | In p → q, which condition is necessary and which is sufficient? | `RL_SK01_02_NEC_SUFF` | RL_LEC_01, RL_LEC_02 |
| `ds.card.rl.rows` | What must be kept fixed when comparing two truth-table columns? | `RL_SK01_03_TRUTH_TABLE` | RL_LEC_01, RL_LEC_02 |
| `ds.card.rl.validity` | What kind of row disproves an argument’s validity? | `RL_SK01_04_PROP_VALIDITY` | RL_LEC_01, RL_LEC_02 |
| `ds.card.rl.equivalence` | How can you refute a claimed equivalence? | `RL_SK01_05_EQUIV` | RL_LEC_01, RL_LEC_02 |
| `ds.card.rl.normal` | What distinguishes DNF from CNF? | `RL_SK01_06_NORMAL_FORM` | RL_LEC_01, RL_LEC_02 |
| `ds.card.rl.sat` | What is the difference between satisfiable and tautological? | `RL_SK01_07_SAT_PROP` | RL_LEC_01, RL_LEC_02 |
| `ds.card.rl.explosion` | Why do inconsistent premises semantically entail any conclusion? | `RL_SK01_07_SAT_PROP` | RL_LEC_01, RL_LEC_02 |
| `ds.card.ip.interval` | How do you test that an integer x is in the inclusive interval [low, high]? | `IP_SK02_01_BOOLEAN_CONDITIONS` | IP_LEC_02 |
| `ds.card.ip.short-circuit` | When does Java skip the right operand of && or \|\|? | `IP_SK02_01_BOOLEAN_CONDITIONS` | IP_LEC_02 |
| `ds.card.ip.branch` | How many branches of one if / else-if / else chain are selected? | `IP_SK02_02_BRANCH_TRACE` | IP_LEC_02 |
| `ds.card.ip.switch` | What does break prevent in a traditional colon-style switch? | `IP_SK02_02_BRANCH_TRACE` | IP_LEC_02 |
| `ds.card.ip.loop-order` | What is the normal execution order of a simple for loop? | `IP_SK02_03_LOOP_TRACE` | IP_LEC_02 |
| `ds.card.ip.while` | Can a while body execute zero times? What about do-while? | `IP_SK02_03_LOOP_TRACE` | IP_LEC_02 |
| `ds.card.ip.reduce` | Where should the initial sum or count be set for a reduction? | `IP_SK02_04_LOOP_IMPLEMENT` | IP_LEC_02 |
| `ds.card.ip.search` | What two outcomes must an iterative search represent? | `IP_SK02_04_LOOP_IMPLEMENT` | IP_LEC_02 |

`flashcards.json`: **12,214 bytes**, SHA-256 `8f48c7ec0734aeb8640b525a0accdffabb5ec9b3b3caa628ef81f8d8c0d45cf1`. Exactly eight per pilot, 24 unique cards. Reveal/hide, wraparound previous/next, Fisher–Yates shuffle and reset operate on stable card IDs. Order and reveal state are React memory only; no score, schedule or completion field exists.

## 9. Mental Map and accessibility

Every map has exactly its canonical topic, subtopics and atomic skills. Connector lines mean containment; prerequisite links are separately labelled and come only from canonical references, including prerequisites outside the displayed topic. No mastery coloring or inferred conceptual edges.

Semantic nested lists, explicit Topic/Subtopic/Skill labels, keyboard-operable links, visible focus and a separate text outline make the map understandable without color. Canonical links open and focus the corresponding Overview section. Tabs have selected state, tabpanel association, roving focus, arrow keys and Home/End. Flashcards have labelled articles, disclosure state, hidden answer content and native buttons. Reading width is capped at 780 CSS px; mobile tabs wrap, code and long IDs wrap, and tables remain within the page.

## 10. Practice reuse proof

`src/topic-study/TopicPractice.tsx` filters the unchanged catalog by canonical topic and builds links to the existing preview/attempt routes. It reads existing saved attempts and uses the existing version resolver. It defines no grader, answer key, service or storage operation. The full `src/practice/` directory is byte-identical to `acfad2d`.

Each pilot shows exactly its two existing exercises (CO binary/hex; RL two truth tables; IP two fixed Java-output items). The real CO flow created one isolated draft, saved `00101101`, resumed the **same attempt**, submitted it, reviewed **1 / 1 item point**, and reloaded the review successfully. The topic then offered Review submission. These are item points, never mastery/readiness. Global `/practice` behavior remains covered by all existing tests. Non-pilot topics display an honest no-authored-exercises state.

## 11. Deliberately unavailable modes

Exam-style and Mistakes have stable routes and explicit unavailable states. No official exam items, adaptive mistake inference, grading engine, fake percentages, roadmap step numbers or fabricated student activity were added to these modes. Non-pilot Learn/Flashcards are also intentionally empty.

## 12. Learning-state and Assembly preservation

`STUDENT_SCHEMA_VERSION = 1` in `src/learning/contracts.ts`; `factory.open(..., 1)` in `src/learning/repository.ts`. Both files are unchanged. No migration or student fields were added. Lesson/card interactions write no academic evidence. Existing resume visits remain canonical topic visits. A test compares exported backups before/after card controls after the visit transaction settles; bytes/data remain unchanged.

The full repository/contract and Practice lifecycle suites pass, including completion-before-save-success, idempotent submission, immutable answers, stale revisions, restore epochs, atomic recovery and aborts. Native-browser checks provide separate evidence below. Local persistence remains vulnerable to browser-data deletion, device failure and some crashes; existing backup/export wording is unchanged.

Preservation command (exit 0):

```bash
git diff --quiet acfad2d -- content-pack src/engine src/components src/utils src/examples src/AssemblyWorkbench.tsx src/index.css src/practice src/learning/contracts.ts src/learning/repository.ts src/generated/academic-index.json src/generated/student-references.json pnpm-lock.yaml
```

Assembly Overview/Map use canonical data; the specialized `/co/CO_T06_ASSEMBLY_X86_64/visualizer` tool remains unchanged. All **101 original Assembly tests** pass, plus routed Assembly checks. Actual production examples: arithmetic **RAX 8** (3 steps); stack frame **RAX 15** (9 steps); function call **RAX/RBX 7** (10 steps). Every final RSP/RBP was **0x1000**. Previous restored RBX 0 before the final copy; Next replayed it; Reset restored initial registers.

## 13. Independent content correctness

Expected values were independently calculated rather than obtained from the lesson renderer or Practice graders.

| Example | Independent check / actual result |
| --- | --- |
| Radix 19 | 16+2+1 = 19; binary 10011; hexadecimal 13 |
| Binary sum | 11+7 = 18; 1011 + 0111 = 10010 |
| Four-bit −5 | Sign/magnitude 1101; ones’ complement 1010; twos’ complement 1011; −8+2+1 = −5 |
| Signed overflow | Four-bit range −8…7; 6+3 = 9; low 1001 decodes −7, so overflow |
| BCD/excess | Decimal 27 → 0010 0111; ordinary binary interpretation 39; bias 7 with −2 → code 5 (0101) |
| Endianness | 0x12×256 + 0x34 = 0x1234; big-endian lower byte 0x12, little-endian 0x34 |
| De Morgan | Enumerated FF/FT/TF/TT: both columns T,T,T,F |
| Exactly-one DNF/CNF | Independent formula evaluation: both F,T,T,F |
| Implication relationships | Implication/contrapositive T,T,F,T; converse/inverse T,F,T,T |
| Validity/explosion | Modus ponens has no counterexample; affirming consequent fails at p=F,q=T; p and ¬p have no common valuation |
| Java branches | score 7 → pass; switch choice 2 with break → middle |
| Java aggregation | (sum,count): (1,1),(1,1),(4,2),(4,2),(9,3); output `9 3` |
| Java search | Tests 1,2,3,4; first divisible by 4 → `4` |

The four fixed trusted Java snippets were additionally executed using the **already-installed Temurin OpenJDK 21.0.12.1+1 LTS**, `/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home/bin/java`. Wrappers in `/tmp/delftstudy-step5-java` produced exactly `pass\n`, `middle\n`, `9 3\n`, `4\n`. No JDK installation or learner-controlled execution occurred. These checks do not claim compilation of arbitrary student code.

## 14. Acceptance evidence

All test paths are relative to the project. Parameterized counts are Vitest cases, not assertions.

| Requirement | Test file / test or scenario | Command | Actual result |
| --- | --- | --- | --- |
| Trusted pack, counts, manifest and uncertainty | `tests/content-validation.test.ts`: schema/exact counts/checksums; all negative cases | `pnpm test` + `pnpm run validate:content` | 39 tests PASS; 0 validation issues |
| Full handoff/raw import blocked | `tests/content-build.test.ts`: blocks full handoff browser imports, including `?raw` | `pnpm test` | 4 tests PASS |
| Existing projections preserved | `tests/academic-index.test.ts`, `tests/student-references.test.ts` | `pnpm test`; `check:academic`; `check:references` | 16 tests PASS; unchanged bytes |
| Topic counts/ownership/determinism | `tests/topic-projection.test.ts`: matches canonical fields; byte-deterministic reordered source | `pnpm test`; `check:topics` | PASS |
| Source precision and negative corruption | Same file: preserves broad/UNKNOWN; six corruption cases; missing/stale bytes | `pnpm test` | PASS |
| Canonical maps for all topics | Same file: map for each ID contains only containment/prerequisite edges | `pnpm test` | 43 map cases PASS; projection file total 54 |
| Authored scope/version safety | `tests/topic-content.test.ts`: three complete lessons; 11 invalid-content cases; 4 changed-lock cases | `pnpm test`; `validate:topics` | PASS |
| Direct production topic gate | Same file: direct Vite build blocked by failed topic validation | `pnpm test` | PASS; content test file total 17 |
| Worked examples | `tests/topic-examples.test.ts`: six independent arithmetic/logic/Java-trace checks | `pnpm test` | 6 PASS; four Java snippets also executed |
| All topic/mode routes | `tests/topic-ui.test.tsx`: all 43 topics resolve in each of seven modes | `pnpm test` | 7 cases cover 301 route combinations; PASS |
| Invalid routes / deep links / history | Same file: invalid topic/mode cases; Learn/Flashcards remount and BrowserRouter Back/Forward | `pnpm test` | PASS; real reload/history also PASS |
| Canonical Overview and map fallback | Same file: canonical descriptions/prerequisites/sources; accessible map/text alternative | `pnpm test` | PASS |
| Map focus regression | Same file: review regression, canonical links focus requested Overview node | `pnpm test` | Failed before fix, PASS after; real Chromium target focus confirmed |
| Pilot/non-pilot UI | Same file: three pilot flows; honest empty non-pilot states | `pnpm test` | PASS |
| Card controls/no storage mutation | Same file: reveal/hide, navigation, shuffle/reset without storage/identity changes | `pnpm test` | PASS; exported backup unchanged |
| Keyboard mode navigation | Same file: follows URL and retains active tab focus | `pnpm test` | PASS; real Enter/ArrowRight/Home also PASS |
| Topic Practice reuses saved attempt | Same file: resumes/reviews same immutable attempt | `pnpm test` | PASS; topic UI file total 22 |
| Existing Practice regressions | `tests/practice-{catalog,grading,service,ui}.test.*` | `pnpm test`; `validate:practice` | 78 tests PASS; six published definitions unchanged |
| Existing learning-state safety | `tests/learning-{contracts,repository,ui}.test.*` | `pnpm test` | 60 tests PASS using mocked storage where applicable |
| Native IndexedDB | `tests/browser/`: existing isolated 13-scenario harness + actual reload | Build harness; preview 4190; press Run, reload, Verify | 13/13 PASS, reload PASS, 0 failures |
| Shell / routed Assembly regressions | `tests/application-routing.test.tsx` | `pnpm test` | 72 tests PASS |
| Assembly engine/history/visualization | parser, instructions, executor, visualization test files | `pnpm test` | 101 tests PASS; three real production examples PASS |
| Responsive / no hidden overflow | Actual Chromium production topic modes; Java pre blocks and map bounds | Preview 4189; 390/768/1280 CSS px | PASS; page scrollWidth equals each viewport; inspected descendants stay in bounds |
| Browser payload boundary | Actual emitted module IDs and completed-output byte comparison | Direct Vite API build with `write:false` | 86 emitted modules; 0 forbidden; all four assets identical to final build |
| Final static correctness | Whole project | `pnpm run typecheck`; `pnpm run build`; `git diff --check` | PASS, exit 0 |

## 15. Test accounting

**370 baseline cases retained in 16 files + 99 new cases in 4 files = 469 cases in 20 files.** No test was deleted, skipped or weakened. New files: topic projection 54, content 17, examples 6, UI 22.

Adaptations to two baseline files: the topic-shell route test now expects seven modes rather than six; its existing Flashcards/Practice checks use their new positions. The existing Practice UI input helper waits for the actual mounted input instead of assuming 30 ms is enough under a larger concurrent suite. This fixes a reproduced test-harness timing failure, retains the original assertions and does not change application behavior. All other 14 baseline files are unchanged.

## 16. Real production-browser results

**Actual Chromium/Google Chrome 152.0.7977.64 on macOS**, confirmed using browser client-hint fullVersionList displayed by the existing verification harness. The reduced user agent alone showed 152.0.0.0 and was not used as the exact version. Browser checks were separate from Vitest/jsdom/fake-indexeddb tests.

Application production preview: **http://127.0.0.1:4189/**, isolated from the user's 4173 origin. Native-storage harness: **http://127.0.0.1:4190/** with uniquely named test databases. Neither opened or cleared the user's data.

- CO: Overview → Learn → Mental Map → Flashcards → Practice → start/save/resume/submit/review existing binary exercise; correct feedback persists after reload. All card controls tested.
- RL: Overview → Learn → Mental Map → Flashcards; revealed multiple cards; Practice lists both existing logic items.
- IP: Overview confirms Java basics prerequisite; Learn shows all four Java snippets; map, multiple keyboard-revealed cards and both Practice items checked.
- Direct Learn reload and Flashcards reload passed; browser Back/Forward restored Map/Overview; canonical map link focused `CO_ST04_02_SIGNED_INTEGER`.
- Non-pilot `IP_T01_JAVA_BASICS`: real Overview/Map; empty Learn/Cards/Practice. Exam-style and Mistakes explicitly unavailable.
- Assembly topic Overview/Map and established tool route passed; all three production examples, Previous/Next and Reset passed.
- **390 × 844**, **768 × 1024**, **1280 × 900** CSS px checked. Topic mode controls remain usable; inspected lesson/map/cards fit without page overflow. Java pre blocks at 390 had equal client/scroll widths of 356 px. Visible focus and layout screenshots inspected; viewport restored afterward.
- Enter reveals/hides cards and opens map text/source disclosures; Home and ArrowRight change active mode and retain focus. Sources explicitly describe broad provenance.
- Inspected app and harness console: **0 errors / 0 warnings**.
- Native storage: 13/13 PASS, including concurrent writes, stale revisions, immutable/idempotent submission, abort after request success, atomic restore/recovery, stale connection, aborted replacement, invalid import, preserved corruption, blocked upgrade, and injected permission denial. Actual page reload retained committed data (PASS). Injected denial is fault injection, not a real browser permission prompt.

Temporary tabs and preview processes 4189/4190 were closed; expected process exit 130 came from deliberate Ctrl-C. The user's two original 4173 tabs remained open and its server returned HTTP 200. No user storage was cleared.

**NOT RUN:** actual Safari, Firefox, WebKit automation, physical mobile devices, screen-reader software, browser-data deletion/device-failure/OS-crash survival. The impact is limited cross-browser/assistive-technology coverage and no crash-durability guarantee. These are not claimed as PASS; all explicitly required actual-Chromium acceptance checks ran.

## 17. Final build and browser payload

No new dependency. React, React DOM and React Router remain the runtime dependencies. Assembly is still a separate lazy chunk. Main payload includes the minimal academic projections and bounded authored content; it is below Vite's default chunk warning threshold, but full-course content expansion will require a fresh payload review.

The final direct Vite API build loaded the actual project config and all mandatory guards. Inspection of Rollup chunk `modules` found **86 emitted modules** (95 transformed), with **zero** imports of `content-pack/`, scripts/tests, source PDFs, academic JSON Schema, full handoff, full assessment corpus, Node validators, Ajv, tsx, jsdom, fake-indexeddb, Vitest or the native-browser harness. The topic content lock is build-only. Existing Practice definition/grader locks remain runtime inputs for immutable attempt identity, as before.

A first inspection compared CSS inside `generateBundle`, before Vite's later finalization, and rejected a premature byte comparison. The inspection was corrected to compare the completed build's returned output, after every hook finished. All completed outputs then matched the final production files byte-for-byte; no application/build changes were needed. Emitted inventory retained at `/tmp/delftstudy-step5-bundle.json` for this session.

| Production artifact | Exact bytes | gzip bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `assets/index-Hy1rvx8f.js` | 494,902 | 131,738 | `3f3dee1dc47c10a92d89544523fb8e5bd65abe78c038648a29e5facea52ca4be` |
| `assets/AssemblyWorkbench-B46a6Cub.js` | 29,502 | 10,202 | `e7bb79a471b658ea96c09631091dea8ee96e43b82b284dab7cadb5c6e0194efc` |
| `assets/index-1zu2p6BZ.css` | 44,026 | 10,447 | `0015f7666027ccb375c7802f98e2ea91c3c38a6360e42105175f8ec16f36aff0` |
| `index.html` | 744 | 457 | `559584cd3b4f2ff0574a23d7bacb4daec4edda7f03a426c6388b4c90e9d9300e` |

Source payload files: topic projection **84,049** bytes; lessons **27,195**; flashcards **12,214**; topic locks **5,089** (not bundled). Existing navigation **7,462** and student references **69,985** remain unchanged. No source maps/PDFs are present in production output.

Emitted application-module inventory (remaining entries are the React/React DOM/React Router/Scheduler runtime and Vite/CommonJS helpers):

```text
index.html
src/App.tsx
src/AssemblyWorkbench.tsx
src/academic/navigation.ts
src/components/CodeEditor.tsx
src/components/ControlPanel.tsx
src/components/ExecutionHistory.tsx
src/components/Icon.tsx
src/components/InstructionExplanation.tsx
src/components/RegisterPanel.tsx
src/components/StackVisualizer.tsx
src/engine/cpu.ts
src/engine/executor.ts
src/engine/instructions.ts
src/engine/memory.ts
src/engine/parser.ts
src/engine/session.ts
src/engine/types.ts
src/examples/examplePrograms.ts
src/generated/academic-index.json
src/generated/student-references.json
src/generated/topic-study.json
src/index.css
src/learning/LearningProvider.tsx
src/learning/StudentDataPanel.tsx
src/learning/contracts.ts
src/learning/repository.ts
src/main.tsx
src/pages/CoursePage.tsx
src/pages/DashboardPage.tsx
src/pages/NotFoundPage.tsx
src/pages/ProductAreaPage.tsx
src/pages/TopicPage.tsx
src/practice/AttemptPage.tsx
src/practice/ExercisePage.tsx
src/practice/ExerciseParts.tsx
src/practice/PracticePage.tsx
src/practice/catalog-lock.json
src/practice/catalog.json
src/practice/catalog.ts
src/practice/grader-lock.json
src/practice/grading.ts
src/practice/practice.css
src/practice/service.ts
src/practice/validation.ts
src/shell/AppShell.tsx
src/shell/PageParts.tsx
src/shell/ShellIcon.tsx
src/shell/shell.css
src/topic-study/AcademicViews.tsx
src/topic-study/AuthoredViews.tsx
src/topic-study/TopicPractice.tsx
src/topic-study/content.ts
src/topic-study/flashcards.json
src/topic-study/lessons.json
src/topic-study/topic-study.css
src/topic-study/types.ts
src/utils/stackRows.ts
src/utils/storage.ts
src/utils/useSimulator.ts
```

## 18. Separate adversarial self-review

After the initial **468-test** implementation/typecheck/build passed, a separate adversarial **self-review** examined the diff and academic claims, source precision, ownership, generated freshness, content locks, route/focus behavior, Practice reuse, fake evidence risks, accessibility, overflow and Assembly preservation. This was not an independent audit.

One confirmed application defect: Mental Map links changed to Overview but focused the main region instead of their requested canonical section. First added a regression test; it failed with expected `CO_ST04_02_SIGNED_INTEGER`, actual `ds-content`. Minimal fix: AppShell now focuses/scrolls a valid hash target within its content. The regression then passed, the review rerun passed all **469 tests**, and actual Chromium verified target focus. Keyboard tab focus remains preserved. Full final validation was rerun after the fix; no later source changes were made.

Test-only development issues were also reconciled: the old fixed-delay Practice helper occasionally found no input under parallel suite load; it now waits for the input. New storage tests initially compared backups before the asynchronous initial visit settled; a test probe waits for the actual ready/topic state. Final tests emitted no React act warnings. Neither change relaxes persistence assertions. The premature bundle-inspection timing issue above was in the verification script, not the application.

## 19. Remaining limitations and warnings

No unresolved critical defect or build warning. Only three topics have authored lessons/cards; the remaining 40 intentionally expose canonical structure with honest empty authored modes. Practice still has six introductory exercises and does not cover every pilot skill. Exam-style/Mistakes engines, mastery, readiness, scheduling, completion and adaptive study are absent by design.

Provenance is normalized broad academic scope, not exact-page evidence. Original lecture PDFs and their complete text are not shipped or independently revalidated. The Mental Map is a canonical list/containment layout rather than an interactive graph engine. Cards reset on unmount/reload and have no persistence. Browser-only answer keys remain inspectable, as appropriate for this personal tool. Native storage is local to origin/device and is not guaranteed to survive deletion or every failure. Only actual Chromium was tested; other environments are listed NOT RUN above.

The original Assembly MVP's documented instruction subset, aligned-word memory, 2,000-step limit and simplified call addresses remain unchanged. Hosting/deployment and a final global redesign are outside scope. No new production functionality remains partially applied.

## 20. Scope closure

**Steps 6–14 were NOT started.** No full-course expansion, additional grading, symbolic solver, learner-code execution, exam generation, mistake engine, mastery/readiness, new persistence fields or schema migration was implemented. The repository is resumable from its completed implementation and final evidence commits. Stop after Step 5.
