# Step 6 — Complete Computer Organisation

**PASS — Step 6 implemented and verified. Step 7 and later are not started.**

Verified on 9 September 2026. This is a local application, not a deployment. The scope is deliberate coverage of the normalized CO taxonomy with explicit teaching models, not a claim to reproduce every detail of unavailable original lecture slides.

## 1. Baseline, checkpoints and final status

Started from clean Step 5 `da12065a9580e9228011632b03b8635b4e56e25a`. Step 5 implementation `e50d1e3` and its final evidence report were fully committed; no partial Step 5 work was discarded or restarted. Read the Step 1–5 reports and inspected the Topic Learning, published content locks, Practice/grading/version bindings, StudentRepository/LearningProvider, routed Assembly and production guards.

All requested **baseline** gates passed before edits: `validate:content`, `check:academic`, `check:references`, `validate:practice`, `check:topics`, `validate:topics`, `pnpm test` (469 tests, 20 files), `typecheck`, `build`, and `git diff --check`. Baseline main JS: 494,902 bytes; Assembly chunk: 29,502 bytes. The original baseline log was captured in `/tmp/delftstudy-step6-baseline.log`.

Incremental commits:
- `4eee044` — verified bounded CO teaching models, 39 new tests.
- `4941a79` — authored/locked CO content, shared Practice extension and lazy workspaces; 613 tests passed before self-review.
- `ee587b4c3b1be223177e0acf686b9083d4769583` — final application implementation: minimal guided-only Practice message fix with failing-then-passing regression.
- The subsequent documentation/verification commit contains this report, README and reproducible module inspection. Resolve that self-referencing final commit with `git log -1 --format=%H -- docs/computer-organisation-status.md`; its exact hash is also reported to the user. All final verification ran on the application code in `ee587b4`. Final acceptance status: all changes committed and working tree clean (checked after the documentation commit).

## 2. Final commands and actual results

| Command | Actual result |
| --- | --- |
| `pnpm run validate:content` | PASS: schema, canonical counts, relations, prerequisites, uncertainty/generation/frequency policy, 8 file checksums plus independently pinned manifest |
| `pnpm run check:academic` | PASS: 3 subjects / 43 topics, deterministic 7,462-byte projection |
| `pnpm run check:references` | PASS: 3 / 43 / 105 / 147 canonical IDs and 489 mapping locators, 69,985 bytes |
| `pnpm run validate:practice` | PASS: all original 6 definitions and original executable grader lock |
| `pnpm run check:topics` | PASS: 43 topics / 105 subtopics / 147 skills, 84,049 bytes |
| `pnpm run validate:topics` | PASS: 3 published pilot lessons, 24 cards, 54 immutable locks |
| `pnpm run validate:co` | PASS: 14 CO topics / 32 subtopics / 46 skills; 13 new lessons, 79 total CO cards, 28 new exact exercises, 17 unscored activities, 10 tools including Assembly; all source/ownership/coverage/version/capability checks |
| `pnpm test` | PASS: **614 tests in 25 files**, no skipped tests in the final run |
| `pnpm run typecheck` | PASS, strict TypeScript, no diagnostics |
| `pnpm run build` | PASS, including every preflight gate; Vite 120 transformed modules |
| `pnpm run check:co-bundle` | PASS: direct Vite build, all guards, module-graph checks and final emitted asset measurements |
| `git diff --check` | PASS, no whitespace errors |

The complete post-review run was captured in `/tmp/ds-step6-final-gates.log`. Temporary logs are supporting session evidence, not required project inputs. The checked-in report records their actual results; `docs/co-bundle-report.json` contains the reproducible production module inventory.

## 3. Canonical scope and source authority

The unchanged v1.0.1 Handoff JSON confirms **14 topics, 32 subtopics and 46 CO atomic skills**, inside `CSE1400_CO`. Global counts remain 90 documents (29 CO), 43 topics, 105 subtopics, 147 skills, 37 assessments, 489 mapped question records, 17 question types, 22 exam patterns and 29 error tags. There is no fifteenth CO topic and no additional taxonomy. The generated academic, student-reference and topic-study projections are byte-identical to Step 5.

T01 remains `CURRENT_SUPPORTING`; T02–T14 remain `CURRENT_CORE`. Canonical prerequisites are displayed in canonical topic order; no adaptive or personalized order is inferred. The table below lists every topic prerequisite. All 32 CO subtopic prerequisite lists are empty in the trusted projection; skill prerequisite lists appear in the skill table.

**PDF/source verification:** Read the preserved `INSTRUCTIONS_FOR_CODEX.md`, normalized Master Content Pack CO section and Handoff taxonomy/source associations. No original lecture PDF binaries were supplied. **Original PDF pages inspected: none.** Source locators remain HIGH-confidence, broad `DOCUMENT_RANGE` / `PDF_PAGE_RANGE` lecture associations. They are not asserted as exact supporting pages. UNKNOWN locators in Overview remain UNKNOWN. No web curriculum, reconstructed source diagrams, invented exact slide numbers or named-machine chronology was added.

New circuit connectivity and numerical examples are explicitly stated authored teaching instances. CMOS networks are specified in words; K-map coordinates and Gray order are mathematical definitions. No result depends on an unseen diagram. Symbolic BPU transfers specify the available temporaries and sequential order without claiming the original hardware geometry or control-word layout.

## 4. Lessons and course capabilities

All lessons begin with a mental model, cover the topic’s owned skills in non-introduction/non-recap blocks, explain procedures and distinctions, and end with a recap and links to cards/Practice. All new items are version 1 with stable IDs. T04’s published lesson and eight cards are untouched. RL/IP remain their original pilots.

| Topic | Lesson | Blocks | Cards | Graded exercises | Unscored activities | Tool | Topic prerequisites |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| CO_T01_HISTORY | ds.lesson.co.t01 | 6 | 3 | 0 | 1 | — | None |
| CO_T02_BOOLEAN_KMAP | ds.lesson.co.t02 | 7 | 7 | 2 | 2 | Boolean truth workspace | None |
| CO_T03_DIGITAL_CMOS_SEQUENTIAL | ds.lesson.co.t03 | 6 | 6 | 2 | 2 | — | CO_T02_BOOLEAN_KMAP |
| CO_T04_DATA_REP_RADIX_INTEGER | ds.lesson.co | 9 | 8 | 7 | 0 | — | None |
| CO_T05_DATA_REP_FIXED_FLOAT | ds.lesson.co.t05 | 6 | 6 | 3 | 0 | Representation workspace | CO_T04_DATA_REP_RADIX_INTEGER |
| CO_T06_ASSEMBLY_X86_64 | ds.lesson.co.t06 | 7 | 7 | 1 | 1 | Assembly Visualizer | CO_T04_DATA_REP_RADIX_INTEGER |
| CO_T07_ISA | ds.lesson.co.t07 | 6 | 5 | 1 | 2 | Instruction bit-budget workspace | CO_T06_ASSEMBLY_X86_64 |
| CO_T08_BPU_MICROCODE | ds.lesson.co.t08 | 7 | 7 | 2 | 3 | — | CO_T07_ISA |
| CO_T09_IO_INTERRUPTS | ds.lesson.co.t09 | 6 | 5 | 2 | 1 | Address alias workspace | CO_T07_ISA |
| CO_T10_DMA_MEMORY | ds.lesson.co.t10 | 6 | 5 | 2 | 1 | Memory organization workspace | CO_T09_IO_INTERRUPTS |
| CO_T11_CACHE | ds.lesson.co.t11 | 6 | 6 | 2 | 1 | Cache trace workspace | CO_T10_DMA_MEMORY |
| CO_T12_PIPELINE | ds.lesson.co.t12 | 6 | 6 | 2 | 1 | Pipeline timing workspace | CO_T08_BPU_MICROCODE, CO_T11_CACHE |
| CO_T13_PARALLELISM | ds.lesson.co.t13 | 6 | 4 | 2 | 1 | Amdahl workspace | CO_T12_PIPELINE |
| CO_T14_VIRTUAL_MEMORY | ds.lesson.co.t14 | 6 | 4 | 2 | 1 | Virtual-memory workspace | CO_T10_DMA_MEMORY |

**CO totals: 14 lessons, 90 blocks, 79 flashcards, 30 graded exercises (2 preserved + 28 new), 17 guided activities, 9 new workspaces + the existing Assembly Visualizer.** Across the application there are 16 authored lessons, 95 flashcards and 34 graded exercises. Capability counts describe available material, never completion or mastery.

## 5. Every canonical skill: deliberate lesson blocks, cards and Practice classification

A = a reliable fixed-answer subtask is automatically graded; this is not proof of proficiency in the entire skill. B = multiple-valid structured design with an unscored rubric. C = open explanation/reasoning with an unscored rubric. D = existing specialized Assembly tool. E = unsafe to grade automatically without a useful guided replacement. Classification counts: **A 27, B 7, C 10, D 2, E 0**. No B/C activity receives a numeric score.

Block/card IDs are stable authored identifiers. Introduction/recap scopes are omitted from the block column to demonstrate actual teaching coverage. All card IDs below are meaningful study cards, not generated duplicates. **Uncovered skills: 0/46** for both lessons and flashcards.

| Canonical skill | Non-summary lesson blocks | Cards (count and IDs) | Class and rationale | Practice links | Skill prerequisites |
| --- | --- | --- | --- | --- | --- |
| CO_SK01_01_HISTORY | ds.block.co.t01.switching; ds.block.co.t01.program; ds.block.co.t01.integration; ds.block.co.t01.explain | 3: ds.card.co.t01.switching; ds.card.co.t01.stored; ds.card.co.t01.integration | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t01.milestone | None |
| CO_SK02_01_BOOLEAN_EVAL | ds.block.co.t02.evaluate | 1: ds.card.co.t02.truth | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-boolean-rows; tool: boolean | None |
| CO_SK02_02_SOP | ds.block.co.t02.evaluate; ds.block.co.t02.sop | 1: ds.card.co.t02.sop | B — Construction or scheduling can have multiple valid solutions. Use structured criteria and reference checks, without scoring one representation as uniquely correct. | ds.guided.co.t02.sop | None |
| CO_SK02_03_KMAP_BUILD | ds.block.co.t02.populate; ds.block.co.t02.dont-care | 2: ds.card.co.t02.gray; ds.card.co.t02.x | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-gray-population | None |
| CO_SK02_04_KMAP_MINIMIZE | ds.block.co.t02.groups; ds.block.co.t02.dont-care | 3: ds.card.co.t02.wrap; ds.card.co.t02.implicant; ds.card.co.t02.covers | B — Construction or scheduling can have multiple valid solutions. Use structured criteria and reference checks, without scoring one representation as uniquely correct. | ds.guided.co.t02.groups | CO_SK02_02_SOP; CO_SK02_03_KMAP_BUILD |
| CO_SK03_01_CMOS_TRACE | ds.block.co.t03.cmos | 1: ds.card.co.t03.switch | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-cmos-nand | None |
| CO_SK03_02_CMOS_DESIGN | ds.block.co.t03.design | 1: ds.card.co.t03.complement | B — Construction or scheduling can have multiple valid solutions. Use structured criteria and reference checks, without scoring one representation as uniquely correct. | ds.guided.co.t03.network | CO_SK02_01_BOOLEAN_EVAL; CO_SK03_01_CMOS_TRACE |
| CO_SK03_03_COMB_BLOCK | ds.block.co.t03.blocks | 2: ds.card.co.t03.mux; ds.card.co.t03.adder | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-full-adder | None |
| CO_SK03_04_SEQ_LOGIC | ds.block.co.t03.state | 2: ds.card.co.t03.latch; ds.card.co.t03.sram | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t03.storage | None |
| CO_SK04_01_RADIX_CONVERT | ds.block.co.radix; ds.block.co.radix-example | 1: ds.card.co.weights | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-binary-45; ds.practice.co-hex-173 | None |
| CO_SK04_02_RADIX_ARITH | ds.block.co.radix-example | 1: ds.card.co.carry | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-hex-addition | None |
| CO_SK04_03_SIGNED_ENCODE | ds.block.co.signed; ds.block.co.signed-example | 2: ds.card.co.sign-magnitude; ds.card.co.twos | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-signed-five | CO_SK04_01_RADIX_CONVERT |
| CO_SK04_04_OVERFLOW | ds.block.co.overflow | 2: ds.card.co.range; ds.card.co.overflow | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-overflow-four | None |
| CO_SK04_05_BCD_EXCESS | ds.block.co.encodings | 1: ds.card.co.bcd-excess | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-bcd-thirty-eight | None |
| CO_SK04_06_ENDIAN | ds.block.co.endian | 1: ds.card.co.endian | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-little-byte | None |
| CO_SK05_01_FIXED | ds.block.co.t05.fixed | 2: ds.card.co.t05.fixed; ds.card.co.t05.fixed-encode | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-fixed-signed; tool: representation | None |
| CO_SK05_02_FLOAT_ENCODE | ds.block.co.t05.float-format; ds.block.co.t05.float-example | 2: ds.card.co.t05.bias; ds.card.co.t05.normal | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-custom-float-encode; tool: representation | CO_SK04_01_RADIX_CONVERT; CO_SK04_03_SIGNED_ENCODE |
| CO_SK05_03_FLOAT_RANGE | ds.block.co.t05.float-format; ds.block.co.t05.range | 2: ds.card.co.t05.range; ds.card.co.t05.spacing | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-custom-float-maximum; tool: representation | None |
| CO_SK06_01_ASM_READ | ds.block.co.t06.operands | 2: ds.card.co.t06.order; ds.card.co.t06.lea | D — The existing Assembly Visualizer supports executable qword tracing. Use it within its documented subset; non-executable width concepts remain in Learn. | tool: assembly | None |
| CO_SK06_02_PARTIAL_REG | ds.block.co.t06.widths | 2: ds.card.co.t06.eax; ds.card.co.t06.small | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-eax-read | None |
| CO_SK06_03_STACK_TRACE | ds.block.co.t06.frame; ds.block.co.t06.calls | 2: ds.card.co.t06.call; ds.card.co.t06.rsp | D — The existing Assembly Visualizer supports executable qword tracing. Use it within its documented subset; non-executable width concepts remain in Learn. | tool: assembly | CO_SK04_03_SIGNED_ENCODE; CO_SK06_01_ASM_READ |
| CO_SK06_04_ASM_DEBUG | ds.block.co.t06.debug | 1: ds.card.co.t06.debug | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t06.debug | None |
| CO_SK07_01_ISA_BITS | ds.block.co.t07.budget | 2: ds.card.co.t07.ceil; ds.card.co.t07.capacity | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-isa-capacity; tool: isa | CO_SK04_01_RADIX_CONVERT |
| CO_SK07_02_ISA_DESIGN | ds.block.co.t07.design | 1: ds.card.co.t07.design | B — Construction or scheduling can have multiple valid solutions. Use structured criteria and reference checks, without scoring one representation as uniquely correct. | ds.guided.co.t07.format | None |
| CO_SK07_03_ISA_COMPARE | ds.block.co.t07.styles; ds.block.co.t07.addressing | 2: ds.card.co.t07.styles; ds.card.co.t07.interface | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t07.compare | None |
| CO_SK08_01_MICRO_TRACE | ds.block.co.t08.trace | 1: ds.card.co.t08.trace | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-micro-transfer | CO_SK07_03_ISA_COMPARE |
| CO_SK08_02_WRITE_MICRO | ds.block.co.t08.fetch | 2: ds.card.co.t08.wmfc; ds.card.co.t08.fetch | B — Construction or scheduling can have multiple valid solutions. Use structured criteria and reference checks, without scoring one representation as uniquely correct. | ds.guided.co.t08.routine | CO_SK08_01_MICRO_TRACE |
| CO_SK08_03_CONTROL_BITS | ds.block.co.t08.encoding | 2: ds.card.co.t08.encoded; ds.card.co.t08.horizontal | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-control-width | None |
| CO_SK08_04_CONTROL_COMPARE | ds.block.co.t08.organizations | 1: ds.card.co.t08.control | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t08.control | None |
| CO_SK08_05_MICRO_OPT | ds.block.co.t08.optimize | 1: ds.card.co.t08.overlap | B — Construction or scheduling can have multiple valid solutions. Use structured criteria and reference checks, without scoring one representation as uniquely correct. | ds.guided.co.t08.optimize | CO_SK08_02_WRITE_MICRO |
| CO_SK09_01_BUS_REASON | ds.block.co.t09.bus; ds.block.co.t09.compare | 2: ds.card.co.t09.tristate; ds.card.co.t09.poll | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t09.bus | None |
| CO_SK09_02_IO_ADDRESS | ds.block.co.t09.decode | 2: ds.card.co.t09.alias; ds.card.co.t09.collision | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-address-alias; tool: address | CO_SK04_01_RADIX_CONVERT |
| CO_SK09_03_INTERRUPT_TRACE | ds.block.co.t09.interrupt; ds.block.co.t09.compare | 2: ds.card.co.t09.priority; ds.card.co.t09.poll | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-interrupt-completion | None |
| CO_SK10_01_DMA | ds.block.co.t10.dma | 1: ds.card.co.t10.dma | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t10.dma | None |
| CO_SK10_02_MEMORY_BITS | ds.block.co.t10.chips; ds.block.co.t10.procedure | 2: ds.card.co.t10.width; ds.card.co.t10.pins | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-memory-chips; tool: memory | CO_SK04_01_RADIX_CONVERT |
| CO_SK10_03_INTERLEAVE | ds.block.co.t10.interleave; ds.block.co.t10.procedure | 2: ds.card.co.t10.bank; ds.card.co.t10.stride | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-bank-index; tool: memory | None |
| CO_SK11_01_CACHE_BITS | ds.block.co.t11.fields | 2: ds.card.co.t11.fields; ds.card.co.t11.capacity | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-cache-tag-width; tool: cache | CO_SK10_02_MEMORY_BITS |
| CO_SK11_02_CACHE_TRACE | ds.block.co.t11.trace; ds.block.co.t11.policies | 3: ds.card.co.t11.lru; ds.card.co.t11.block; ds.card.co.t11.write | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-cache-lru-trace; tool: cache | CO_SK11_01_CACHE_BITS |
| CO_SK11_03_CACHE_OPT | ds.block.co.t11.locality; ds.block.co.t11.policies | 2: ds.card.co.t11.locality; ds.card.co.t11.write | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t11.locality | None |
| CO_SK12_01_PIPE_PERF | ds.block.co.t12.cycles | 2: ds.card.co.t12.fill; ds.card.co.t12.latency | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-pipeline-total; tool: pipeline | None |
| CO_SK12_02_PIPE_HAZARD | ds.block.co.t12.hazards; ds.block.co.t12.schedule | 2: ds.card.co.t12.load; ds.card.co.t12.branch | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-pipeline-load-use; tool: pipeline | CO_SK06_01_ASM_READ; CO_SK12_01_PIPE_PERF |
| CO_SK12_03_PIPE_SCHEDULE | ds.block.co.t12.schedule; ds.block.co.t12.optimize | 2: ds.card.co.t12.schedule; ds.card.co.t12.reorder | B — Construction or scheduling can have multiple valid solutions. Use structured criteria and reference checks, without scoring one representation as uniquely correct. | ds.guided.co.t12.schedule; tool: pipeline | CO_SK12_02_PIPE_HAZARD |
| CO_SK13_01_PAR_CLASS | ds.block.co.t13.classes; ds.block.co.t13.limits | 2: ds.card.co.t13.classes; ds.card.co.t13.hardware | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t13.parallel | None |
| CO_SK13_02_AMDAHL | ds.block.co.t13.formula; ds.block.co.t13.example; ds.block.co.t13.limits | 2: ds.card.co.t13.time; ds.card.co.t13.limit | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-amdahl-speedup; ds.practice.co-amdahl-inverse; tool: amdahl | CO_SK12_01_PIPE_PERF |
| CO_SK14_01_VM_TRANSLATE | ds.block.co.t14.layout; ds.block.co.t14.translation; ds.block.co.t14.protection | 3: ds.card.co.t14.offset; ds.card.co.t14.table; ds.card.co.t14.fault | A — Fixed, explicitly specified subparts have a unique independently checked answer. This does not grade every possible task or award mastery. | ds.practice.co-vm-table-size; ds.practice.co-vm-translate; tool: vm | CO_SK10_02_MEMORY_BITS |
| CO_SK14_02_VM_REASON | ds.block.co.t14.protection; ds.block.co.t14.spaces | 2: ds.card.co.t14.fault; ds.card.co.t14.process | C — Explanations and trade-offs require a reasoned rubric review. The activity is an unscored self-check; no keyword matching or numeric grade. | ds.guided.co.t14.isolation; tool: vm | None |

The full machine-readable classification and exact source IDs are in `src/co/coverage.json`, `src/co/topics/*.json` and `src/co/tools.json`. These are build-validated against canonical ownership. All 266 new content/classification/tool/exercise lock entries are checked; the 28 Practice definition fingerprints are separately projected for immutable attempt bindings. Normal development and production builds **never regenerate content/grader locks**.

## 6. Exact exercise inventory and shared grading

All new exercises are original lecture-associated surface instances, `AUTHORED_PRACTICE`, with fully stated formats/assumptions. No assessment mapping was used to authorize a new item. The new `co-exact@1` grader compares normalized **fixed references**, rather than generating an answer using the workspace under test. Binary/hex widths are exact, hex is case-insensitive, exact decimal normalization permits redundant zeroes, and malformed/blank/oversized inputs get no score. Numerical tolerances, free-text keyword grading and arbitrary design grading are not implemented.

Every new expected answer has an explicit independent derivation in `tests/co-reference.test.ts`; all 28 are checked against the definition and grader. The two preserved radix definitions retain their original independent tests and original grader hash.

| Exercise ID | Skill | Grader/version | Reference | Lecture association |
| --- | --- | --- | --- | --- |
| ds.practice.co-binary-45 | CO_SK04_01_RADIX_CONVERT | radix-exact@1 | 00101101 | CO_LEC_05 · PDF_PAGES_1-32 (broad) |
| ds.practice.co-hex-173 | CO_SK04_01_RADIX_CONVERT | radix-exact@1 | AD | CO_LEC_05 · PDF_PAGES_1-32 (broad) |
| ds.practice.co-boolean-rows | CO_SK02_01_BOOLEAN_EVAL | co-exact@1 | 0011 | CO_LEC_03 · PDF_PAGES_1-30 (broad) |
| ds.practice.co-gray-population | CO_SK02_03_KMAP_BUILD | co-exact@1 | 01100110 | CO_LEC_03 · PDF_PAGES_1-30 (broad) |
| ds.practice.co-cmos-nand | CO_SK03_01_CMOS_TRACE | co-exact@1 | 0 | CO_LEC_03 · PDF_PAGES_1-30 (broad) |
| ds.practice.co-full-adder | CO_SK03_03_COMB_BLOCK | co-exact@1 | 10 | CO_LEC_03 · PDF_PAGES_1-30 (broad) |
| ds.practice.co-hex-addition | CO_SK04_02_RADIX_ARITH | co-exact@1 | 44 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-signed-five | CO_SK04_03_SIGNED_ENCODE | co-exact@1 | 11010 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-overflow-four | CO_SK04_04_OVERFLOW | co-exact@1 | 1 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-bcd-thirty-eight | CO_SK04_05_BCD_EXCESS | co-exact@1 | 00111000 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-little-byte | CO_SK04_06_ENDIAN | co-exact@1 | B2 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-fixed-signed | CO_SK05_01_FIXED | co-exact@1 | -1.5 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-custom-float-encode | CO_SK05_02_FLOAT_ENCODE | co-exact@1 | 0101101 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-custom-float-maximum | CO_SK05_03_FLOAT_RANGE | co-exact@1 | 60 | CO_LEC_06 · PDF_PAGES_1-27 (broad) |
| ds.practice.co-eax-read | CO_SK06_02_PARTIAL_REG | co-exact@1 | 000000000000AB12 | CO_LEC_02 · PDF_PAGES_1-64 (broad) |
| ds.practice.co-isa-capacity | CO_SK07_01_ISA_BITS | co-exact@1 | 64 | CO_LEC_07 · PDF_PAGES_1-23 (broad) |
| ds.practice.co-micro-transfer | CO_SK08_01_MICRO_TRACE | co-exact@1 | 2 | CO_LEC_10 · PDF_PAGES_1-28 (broad) |
| ds.practice.co-control-width | CO_SK08_03_CONTROL_BITS | co-exact@1 | 8 | CO_LEC_10 · PDF_PAGES_1-28 (broad) |
| ds.practice.co-address-alias | CO_SK09_02_IO_ADDRESS | co-exact@1 | 53 | CO_LEC_11 · PDF_PAGES_1-35 (broad) |
| ds.practice.co-interrupt-completion | CO_SK09_03_INTERRUPT_TRACE | co-exact@1 | 12 | CO_LEC_11 · PDF_PAGES_1-35 (broad) |
| ds.practice.co-memory-chips | CO_SK10_02_MEMORY_BITS | co-exact@1 | 8 | CO_LEC_12 · PDF_PAGES_1-32 (broad) |
| ds.practice.co-bank-index | CO_SK10_03_INTERLEAVE | co-exact@1 | 3 | CO_LEC_12 · PDF_PAGES_1-32 (broad) |
| ds.practice.co-cache-tag-width | CO_SK11_01_CACHE_BITS | co-exact@1 | 9 | CO_LEC_13 · PDF_PAGES_1-34 (broad) |
| ds.practice.co-cache-lru-trace | CO_SK11_02_CACHE_TRACE | co-exact@1 | 00100 | CO_LEC_13 · PDF_PAGES_1-34 (broad) |
| ds.practice.co-pipeline-total | CO_SK12_01_PIPE_PERF | co-exact@1 | 12 | CO_LEC_14 · PDF_PAGES_1-33 (broad) |
| ds.practice.co-pipeline-load-use | CO_SK12_02_PIPE_HAZARD | co-exact@1 | 7 | CO_LEC_14 · PDF_PAGES_1-33 (broad) |
| ds.practice.co-amdahl-speedup | CO_SK13_02_AMDAHL | co-exact@1 | 2.5 | CO_LEC_15 · PDF_PAGES_1-46 (broad) |
| ds.practice.co-amdahl-inverse | CO_SK13_02_AMDAHL | co-exact@1 | 0.25 | CO_LEC_15 · PDF_PAGES_1-46 (broad) |
| ds.practice.co-vm-table-size | CO_SK14_01_VM_TRANSLATE | co-exact@1 | 4096 | CO_LEC_15 · PDF_PAGES_1-46 (broad) |
| ds.practice.co-vm-translate | CO_SK14_01_VM_TRANSLATE | co-exact@1 | 15B3 | CO_LEC_15 · PDF_PAGES_1-46 (broad) |

The 17 open activities are displayed with expandable self-check criteria in topic Practice. They are not registered as executable exercise definitions; they create no attempt or score. Their exact IDs, canonical scopes and rubric versions are locked in the topic JSON and included in the skill mapping above.

**Reuse proof:** `PracticeService.start/save/submit/retry` still delegates to the same `StudentRepository.createDraft/editDraft/submit` methods. Only the exercise union and dispatch imports were widened. `src/practice/runtime.ts` dispatches old tasks to the untouched Step 4 grader and new fixed tasks to `src/co/grading.ts`; there is no duplicate persistence system or second Practice runner. Existing six definitions, original grader source and all original fingerprints are byte-identical. `versionBinding` emits the exact original binding strings for old tasks. New bindings include both definition and executable-grader SHA-256. Missing/stale bindings return unavailable rather than grading a preserved answer against different content. Five new service scenarios verify create/save/reload/submit/idempotency/conflict/retry and no evidence promotion.

## 7. Specialized workspaces and assumptions

All nine new workspaces use `src/co/models.ts`, independent of React/storage/grading. The form state and cache cursor stay in memory. Every workspace has an explicit Reset, labelled controls, keyboard-operable form submission, errors, readable result text/tables and responsive layout. Changing inputs marks old output as stale until Calculate. Cache stepping is disabled for changed inputs.

| Tool | Canonical topic | Skills | Explicit scope / limitations |
| --- | --- | --- | --- |
| Boolean truth workspace | CO_T02_BOOLEAN_KMAP | CO_SK02_01_BOOLEAN_EVAL | Two Boolean inputs; all four assignments; no arbitrary formula or K-map drawing grader. |
| Representation workspace | CO_T05_DATA_REP_FIXED_FLOAT | CO_SK05_01_FIXED, CO_SK05_02_FLOAT_ENCODE, CO_SK05_03_FLOAT_RANGE | Custom float: hidden leading 1, all exponent codes ordinary, no zero/subnormal/infinity/NaN. Fixed point uses an explicitly chosen signed interpretation. |
| Assembly Visualizer | CO_T06_ASSEMBLY_X86_64 | CO_SK06_01_ASM_READ, CO_SK06_03_STACK_TRACE | The existing supported qword instruction subset and sparse aligned memory model are unchanged. Partial-register examples in Learn are reading-only. |
| Instruction bit-budget workspace | CO_T07_ISA | CO_SK07_01_ISA_BITS | Fixed instruction length, explicit field counts, no reserved opcode codes unless the learner accounts for them separately. |
| Address alias workspace | CO_T09_IO_INTERRUPTS | CO_SK09_02_IO_ADDRESS | Eight-bit byte addresses in the interface; bit 0 is the least significant bit. No timing or physical wiring is inferred. |
| Memory organization workspace | CO_T10_DMA_MEMORY | CO_SK10_02_MEMORY_BITS, CO_SK10_03_INTERLEAVE | Non-multiplexed address/data pins, excluding power/control; exact whole-chip organization; bank mapping uses word addresses. |
| Cache trace workspace | CO_T11_CACHE | CO_SK11_01_CACHE_BITS, CO_SK11_02_CACHE_TRACE | Initially empty, read-only, read-allocate, true LRU; tags listed least to most recent. No writes, timing or hierarchy simulation. |
| Pipeline timing workspace | CO_T12_PIPELINE | CO_SK12_01_PIPE_PERF, CO_SK12_02_PIPE_HAZARD, CO_SK12_03_PIPE_SCHEDULE | Five equal stages F,D,X,M,W; in order; fetch waits; separate stage resources; same-cycle W-to-D register access; no branches or speculation. |
| Amdahl workspace | CO_T13_PARALLELISM | CO_SK13_02_AMDAHL | Fixed original workload; ideal scaling of only the parallel fraction; zero communication/coordination overhead. |
| Virtual-memory workspace | CO_T14_VIRTUAL_MEMORY | CO_SK14_01_VM_TRANSLATE, CO_SK14_02_VM_REASON | Flat one-level page table; byte addresses; explicit present/write permission; no TLB, page replacement or OS fault-handler model. |

**Deliberately omitted specialized tools:** no interactive K-map grouping/minimal-cover grader, no BPU geometry/control-signal tracer, no interrupt timing simulator. Learn contains verified Gray ordering, wrap/non-adjacency, don’t-care and equivalence examples; Practice grades only truth/map population and uses unscored grouping criteria. BPU and timing exercises use fully specified symbolic/fixed scenarios. Open microcode/CMOS/ISA designs and trade-offs are not falsely forced into unique-answer scoring.

Independent reference checks include Boolean truth tables, specified ideal CMOS/MUX/adders, Gray map cells and wrap/don’t-care alternatives, two’s-complement/fixed and custom-float endpoints, partial-register reading masks, frame addresses, ISA/control bit counts, address aliases, stated interrupt intervals, chip dimensions/pins/banks, cache decomposition/LRU states, pipeline endpoints/hazards, Amdahl fractions and VM sizing/translation. Model tests cover bounds and invalid inputs; UI tests cover every tool’s reset, accessible controls, errors and no student-data writes. Published T04/RL/IP example tests remain intact.

## 8. Source policy, protected bytes and student data

`validate:content` and all 39 existing negative content tests still enforce blocked/unverified/LOW/partially-unverified generation policy, broad-topic evidence limits, canonical relations and observed-sitting frequency. The new validator rejects assessment-source substitution or extra mapping/eligibility fields in authored exercises. A broad mapping cannot grant child-skill evidence; raw attempts continue to return `eligible: false`. Official practice material is still excluded from the unique observed-official-sitting frequency calculation. No official question fixture or verbatim exam text was copied.

The full nine-file `content-pack/v1.0.1/` tree is byte-identical to `da12065`. All eight non-manifest hashes match the release manifest, whose own independently pinned SHA-256 is `d26c0384029d261185cd118979c874d86771439e49cf68a8deb96ee450653bcc`. **v1.0.0 is unused.** The full Handoff JSON, master pack, validators and build-only CO coverage/content locks are absent from production browser modules. Small exercise/grader fingerprints are retained only where required to resolve saved attempt versions.

`src/learning/` is byte-identical to baseline. **STUDENT_SCHEMA_VERSION = 1; native IndexedDB version = 1.** No student fields were added. Existing resume-topic behavior is preserved, but lessons/cards/tools do not write mastery, completion, flashcard scheduling, tool progress or readiness. Practice feedback stays derived in memory and is not trusted mastery. Success still depends on transaction completion; aborts propagate. Restore validation, atomic recovery/replacement and stale-generation/revision checks remain in the same write transaction. Local saving cannot guarantee survival of browser-data deletion, device failure or every OS crash.

Protected Assembly source paths (`src/engine/`, `src/components/`, `src/utils/`, `src/examples/`, `src/AssemblyWorkbench.tsx`, `src/index.css`) are byte-identical to baseline. The eight-register bigint CPU, parser/memory behavior, supported instructions, stack/history/explanations, preferences and three examples were not refactored. The new partial-register lesson cases are explicitly reading-only, outside the simulator subset.

## 9. Acceptance evidence

| Requirement | Test file / named test or actual scenario | Command / execution | Actual result |
| --- | --- | --- | --- |
| Canonical counts, source/mapping uncertainty, manifest, prerequisites | `tests/content-validation.test.ts`, `tests/academic-index.test.ts`, `tests/student-references.test.ts`, `tests/topic-projection.test.ts` | Full final `pnpm test` and all content/projection commands | PASS: 39 + 14 + 2 + 54 tests |
| Old build-import restrictions | `tests/content-build.test.ts` | Full final `pnpm test` | PASS: 4 tests, including Handoff import/raw-import rejection |
| Published pilot ownership/versions and independent examples | `tests/topic-content.test.ts`, `tests/topic-examples.test.ts` | Full final `pnpm test`, `validate:topics` | PASS: 17 + 6 tests |
| Complete CO Learn/card ownership, source policy, immutability and classification | `tests/co-content.test.ts` — `14 lessons, 32 subtopics, 46 deliberate skill scopes, 79 cards…`, negative mutations and version tests | Full final `pnpm test`, `validate:co` | PASS: 36 tests |
| Deterministic model transitions and invalid boundaries | `tests/co-models.test.ts` | Full final `pnpm test` | PASS: 39 tests |
| Independent fixed-answer and worked-example references | `tests/co-reference.test.ts` — 28 explicit reference cases and ten coverage/independent mechanism checks | Full final `pnpm test` | PASS: 38 tests |
| Preserve original Practice contracts/graders/lifecycle/UI | `tests/practice-catalog.test.ts`, `practice-grading.test.ts`, `practice-service.test.ts`, `practice-ui.test.tsx` | Full final `pnpm test` | PASS: 14 + 39 + 11 + 14 tests |
| New attempts reuse repository, retain old bindings, reject conflicts and stale definitions | `tests/co-practice.test.ts` | Full final `pnpm test` | PASS: 6 tests |
| Every workspace reset/accessibility/no storage + all 14 course lessons/cards/Practice | `tests/co-ui.test.tsx` | Full final `pnpm test` | PASS: 26 tests, including review regression |
| All old Topic routes/modes, card controls, history and saved-attempt links | `tests/topic-ui.test.tsx` | Full final `pnpm test` | PASS: 22 tests, including all 43 topics × 7 modes |
| Student contract, transactional repository, storage UI | `tests/learning-contracts.test.ts`, `learning-repository.test.ts`, `learning-ui.test.tsx` | Full final `pnpm test` | PASS: 31 + 17 + 12 mocked-storage tests |
| Canonical app navigation and routed Assembly behavior | `tests/application-routing.test.tsx` | Full final `pnpm test` | PASS: 72 tests |
| All original Assembly regressions | `parser.test.ts`, `executor.test.ts`, `instructions.test.ts`, `visualization.test.ts` | Full final `pnpm test` | PASS: 49 + 10 + 34 + 8 = 101 tests |
| Native transaction/storage guarantees | `tests/browser/verification.ts` — 13 named checks + actual post-reload record check | Separate harness built with `node --import tsx scripts/build-learning-browser-check.ts`; buttons on isolated `http://127.0.0.1:4192/` | PASS: 14 actual Chromium scenarios; includes controlled abort/permission fault injection |
| Graded end-to-end app flows | Boolean rows, cache LRU trace, pipeline total, Amdahl speedup, VM translation | Manual production UI on isolated `http://127.0.0.1:4191/` | PASS: start → answer → submit → correct review → reload; VM also explicit Save draft |
| Course-wide real-browser learning | Learn → Flashcards → reveal → Practice for T01–T14 | Same isolated production preview | PASS: all 14; History rubric disclosure and card next/reset also exercised |
| Lazy production boundaries and final sizes | `scripts/inspect-co-build.ts` | `pnpm run check:co-bundle` | PASS; exact modules and byte/gzip measurements in `docs/co-bundle-report.json` |
| Responsive and keyboard/navigation | Course, pipeline Practice, Boolean Learn, VM cards at measured 390/768/1280 widths; mobile menu Escape/focus; tab ArrowRight; Back/Forward | Actual Chromium DOM measurement + screenshots | PASS: document/body scroll width equals viewport in all 12 final checks |

Baseline **469 tests in 20 files retained**. Added **145 tests in 5 files** (39 models + 36 content + 38 references + 6 service + 26 UI), yielding **614 / 25**. No baseline test was deleted, skipped or weakened. Three existing UI test files were adapted: exact catalogue counts reflect the real expansion, original items are explicitly retained, course-row selectors distinguish new prerequisite links, previously empty Assembly cards/Practice now require real content, and helpers wait for lazy route resolution rather than asserting during a loading fallback.

## 10. Real browser, production examples and unavailable environments

Browser actually tested: **Chromium / Google Chrome 152.0.7977.64, macOS**, confirmed through the native harness’s displayed `fullVersionList`. This is actual Chromium, not jsdom. The unit repository/UI tests use `fake-indexeddb`/jsdom and are reported separately above. The native harness uses unique test databases and controlled injected failures; it does not erase user data.

Isolated origins were 4191 (application) and 4192 (native harness). The user’s existing 4173 origin and database were not altered by the checks. Test submissions exist only in the isolated 4191 database. No seed/fake student data is added to the product.

| Production Assembly example | Executed instructions | Result | Controls |
| --- | ---: | --- | --- |
| Basic arithmetic | 3 | RAX=8; RSP/RBP=0x1000 | Previous → Next → Reset PASS |
| Stack frame | 9 | RAX=15; RSP/RBP=0x1000 | Previous → Next → Reset PASS |
| Function call | 10 | RAX=7, RBX=7; RSP/RBP=0x1000 | Previous → Next → Reset PASS |

New workspace browser checks: NAND table/reset; fixed code zero and reset; invalid ISA field budget/reset; ignored-bit aliases 0x24/0x25/0x34/0x35; memory organization changed to 8 chips/reset; cache hit refresh and eviction of tag 1; forwarding disabled gives 12 cycles/4 waits, reset gives 9/1; Amdahl serial fraction zero gives speedup 3/unbounded ideal limit; absent VM entry gives NOT_PRESENT with no physical address, reset restores 0x734.

All 14 topic Learn/cards/Practice pages were visited in the production build. Five graded submissions survived reload with the same correct feedback (Boolean 0011, cache 00100, pipeline 12, Amdahl 2.5, VM 15B3). Mobile menu Escape returns focus, ArrowRight changes the mode route, Back/Forward returns to the correct cards/Practice page, and direct links resolve. Screenshots inspected phone cards, tablet layout and desktop pipeline workspace. Final application console inspection returned **zero warnings/errors**.

The first responsive attempt targeted the other preview tab: requested widths differed from measured viewport width. Those preliminary checks were discarded, the native tab was closed, and all 12 checks were rerun with exact measured widths. One initial label-selector mismatch was resolved using the control’s verified accessible role/name; it was an automation locator issue, not an application error.

**NOT RUN:** actual Safari, Firefox, Playwright WebKit, real iOS/Android devices, screen-reader audio review and destructive OS/browser crash recovery. Cross-engine/device behavior beyond the tested Chromium viewports is not established. No original PDF page verification was possible because the PDFs were not supplied; exact slide details/geometry are not claimed. No critical implemented-mechanism/build/storage/Assembly acceptance check remains unexecuted.

## 11. Payload and module boundaries

Source JSON for the thirteen new lesson/card/guided bundles is loaded by topic with Vite dynamic imports. Shared workspace code/models load only when a supported Practice workspace opens. Practice definitions and the original runner are lazy; Assembly remains a separate lazy module. No visualization dependency or other dependency was added. Published pilot content remains in its prior shared layer.


Initial main JS: **470,777 bytes / 124,236 gzip**, versus baseline 494,902 bytes (24,125 bytes smaller). Thirteen CO topic chunks: **104,952 bytes** combined; authored topic JSON on disk: **137,654 bytes** including whitespace. All production assets (including HTML/CSS): **733,654 bytes / 206,857 gzip summed per file**.

| Production asset | Bytes | Gzip bytes |
| --- | ---: | ---: |
| `assets/index-BdAB0elM.js` | 470,777 | 124,236 |
| `assets/PracticePage-05k4z31T.js` | 2,911 | 1,297 |
| `assets/ExercisePage-D7Oapn5M.js` | 1,572 | 842 |
| `assets/AttemptPage-CBEgnwf6.js` | 4,724 | 1,954 |
| `assets/ExerciseParts-B48sBlEH.js` | 4,047 | 1,578 |
| `assets/AssemblyWorkbench-CgNwYNIf.js` | 29,502 | 10,203 |
| `assets/TopicPractice-B7jFCu_l.js` | 1,676 | 818 |
| `assets/service-DMGqow7i.js` | 48,125 | 13,247 |
| `assets/CO_T01_HISTORY-D8bfk0pi.js` | 6,587 | 2,101 |
| `assets/CO_T02_BOOLEAN_KMAP-CkGvwNMn.js` | 9,319 | 3,001 |
| `assets/CO_T03_DIGITAL_CMOS_SEQUENTIAL-J4cbyzTo.js` | 9,445 | 2,990 |
| `assets/CO_T05_DATA_REP_FIXED_FLOAT-dT4EEjp_.js` | 6,940 | 2,177 |
| `assets/CO_T06_ASSEMBLY_X86_64-DkDjWx_x.js` | 9,118 | 2,963 |
| `assets/CO_T07_ISA-CGiPsZmf.js` | 8,073 | 2,575 |
| `assets/CO_T08_BPU_MICROCODE-D0_ntbyY.js` | 11,299 | 3,394 |
| `assets/CO_T09_IO_INTERRUPTS-Djg7YmFS.js` | 7,533 | 2,496 |
| `assets/CO_T10_DMA_MEMORY-Fhx2oQdG.js` | 7,253 | 2,385 |
| `assets/CO_T11_CACHE-iPa6VChI.js` | 7,748 | 2,638 |
| `assets/CO_T12_PIPELINE-BFgDPOAQ.js` | 8,385 | 2,754 |
| `assets/CO_T13_PARALLELISM-kuJ2Wedj.js` | 6,454 | 2,098 |
| `assets/CO_T14_VIRTUAL_MEMORY-CKyMY8-7.js` | 6,798 | 2,102 |
| `assets/TopicContent-DdRYeGyw.js` | 5,951 | 2,675 |
| `assets/Workspace-Zm5jAuTS.js` | 13,507 | 5,480 |
| `assets/index-P2Argt9Y.css` | 45,910 | 10,853 |

`docs/co-bundle-report.json` lists every source module per chunk and initial/static/dynamic imports. The initial dependency graph has only the main chunk; it excludes CO topic JSON, CO models/workspaces/Practice definitions and Assembly. Development-only lock/coverage validation modules and the full Handoff JSON are absent from **every** chunk. Small definition/grader fingerprints in the shared Practice chunk are required for old-attempt compatibility. Asset sizes are measured after Vite’s final preload rewriting, not from premature plugin-hook output.

## 12. Distinct adversarial self-review

After the initial 613-test green implementation and build, a **self-review** examined the complete diff and relevant execution paths. This was not an independent audit. Reviewed academic boundaries, every authored worked mechanism/reference, fixed versus nonunique grading, no IEEE assumptions in the custom float, K-map wrap/don’t-care conditions, cache LRU hit updates, pipeline cycle endpoints, source precision and blocked/broad mappings, immutable old bindings, payload boundaries, no derived student fields, responsive behavior and byte-preserved Assembly.

Confirmed product defect: guided-only History Practice displayed “Topic practice is not available yet” above a working unscored activity. Added `review regression: guided-only topics never claim Practice is unavailable` in `tests/co-ui.test.tsx`, ran it and observed the expected failure, then minimally passed `hasStudyActivities` to the existing TopicPractice component. It now says no automatically graded exercises and directs learners to the actual activities/tool. The regression and all Topic UI tests pass, the final production browser confirms the corrected message, and the complete final suite/build/gates pass.

Verification-code correction: the first bundle-inspection script compared pre-rewrite chunk byte counts with final files; Vite’s preload rewrite legitimately changed those counts. The checker now records module membership during generation and measures sizes from emitted files after the build completes. Its final direct-build/module inspection passes. This was a reporting-harness issue, not a product behavior change. No educational content or published grader lock was rewritten during review.

No confirmed correctness defect or failed critical gate remains. No warning is hidden as PASS; unavailable checks are named above.

## 13. Changed-file inventory

Files added/modified since Step 5 are listed below. Existing student, Assembly, academic pack/projections, pilot content and old grader/definition locks are absent from this change list. Build output, dependencies and temporary evidence logs are ignored/uncommitted.

- `README.md`
- `docs/co-bundle-report.json`
- `docs/computer-organisation-status.md`
- `package.json`
- `scripts/co-content.ts`
- `scripts/inspect-co-build.ts`
- `scripts/validate-co.ts`
- `src/App.tsx`
- `src/co/COStudyMode.tsx`
- `src/co/TopicContent.tsx`
- `src/co/Workspace.tsx`
- `src/co/capabilities.json`
- `src/co/co.css`
- `src/co/content-lock.json`
- `src/co/coverage.json`
- `src/co/grader-lock.json`
- `src/co/grading.ts`
- `src/co/models.ts`
- `src/co/practice-lock.json`
- `src/co/practice.json`
- `src/co/tools.json`
- `src/co/topics/CO_T01_HISTORY.json`
- `src/co/topics/CO_T02_BOOLEAN_KMAP.json`
- `src/co/topics/CO_T03_DIGITAL_CMOS_SEQUENTIAL.json`
- `src/co/topics/CO_T05_DATA_REP_FIXED_FLOAT.json`
- `src/co/topics/CO_T06_ASSEMBLY_X86_64.json`
- `src/co/topics/CO_T07_ISA.json`
- `src/co/topics/CO_T08_BPU_MICROCODE.json`
- `src/co/topics/CO_T09_IO_INTERRUPTS.json`
- `src/co/topics/CO_T10_DMA_MEMORY.json`
- `src/co/topics/CO_T11_CACHE.json`
- `src/co/topics/CO_T12_PIPELINE.json`
- `src/co/topics/CO_T13_PARALLELISM.json`
- `src/co/topics/CO_T14_VIRTUAL_MEMORY.json`
- `src/co/types.ts`
- `src/pages/CoursePage.tsx`
- `src/pages/TopicPage.tsx`
- `src/practice/AttemptPage.tsx`
- `src/practice/ExerciseParts.tsx`
- `src/practice/PracticePage.tsx`
- `src/practice/catalog.ts`
- `src/practice/runtime.ts`
- `src/practice/service.ts`
- `src/topic-study/AuthoredViews.tsx`
- `src/topic-study/TopicPractice.tsx`
- `tests/application-routing.test.tsx`
- `tests/co-content.test.ts`
- `tests/co-models.test.ts`
- `tests/co-practice.test.ts`
- `tests/co-reference.test.ts`
- `tests/co-ui.test.tsx`
- `tests/practice-ui.test.tsx`
- `tests/topic-ui.test.tsx`
- `vite.config.ts`

## 14. Limitations and stop boundary

- Source references are honest whole-document associations. Exact slide verification and source-dependent geometry await original PDFs; the broad history sequence is not an invented lecture-specific named-machine chronology.
- Graded exercises cover fixed, well-specified subtasks. Item correctness is not mastery, readiness, a predicted grade or a measure of complete skill competence.
- Multiple-valid circuit/K-map/ISA/microcode/schedule designs and architectural explanations remain unscored rubric work. No keyword scoring, arbitrary drawing parser or minimum-cover grader.
- Boolean workspace supports the four stated two-input gates. Representation workbench uses explicit bounded fixed/custom floating formats. Cache is empty/read-only/read-allocate LRU. Pipeline uses a fixed declared five-stage sequence and fetch-wait model. VM uses a supplied entry in a flat one-level model. None claims to emulate every physical CPU/OS detail.
- Partial-register Assembly examples are reading-only. Existing qword simulator behavior is preserved.
- No parameter-randomized exercise generation, Exam Engine, automatic marks for open tasks, global progress, readiness, mastery, Mistake Book, cloud synchronization or deployment was added.
- RL/IP remain their original Step 5 pilots and original Step 4 exercises. **Step 7 and every later step are NOT started.**

Stop at this verified Step 6 boundary.
