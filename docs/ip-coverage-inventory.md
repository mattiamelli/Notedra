# IP coverage and authored-content inventory

This is a reproducible inventory of current authored files and the preserved published IP pilot. It records content coverage, not learner progress, test execution or final acceptance. The Step 8 status report supplies actual validation, browser and Git evidence. No item here grants mastery or broad skill correctness.

## Counts and interpretation

- Canonical IP scope: **20 topics / 44 subtopics / 56 skills**.
- Lessons: **20** (19 new plus preserved T02), **118 blocks**.
- Flashcards: **112**; uncovered canonical skills: **0**.
- Guided activities: **21**, all unscored; fixed Practice items: **35** (2 preserved plus 33 new).
- Coding assignments: **11** unique: 5 × 15 minutes, 3 × 30 minutes, 3 × 60 minutes. These times are DelftStudy practice design, not official exam durations.
- New shared-feedback profiles: **33**; misconception-authoring records: **33**; explicit wrong-answer patterns: **33**; map cues: **8**.
- Primary practice categories: **A: 32**, **B: 4**, **C: 18**, **D: 2**, **E: 0**. A denotes a safe fixed authored prediction, never a general ability to grade arbitrary Java. C and D retain rubric/workspace coverage; no category claims learner mastery.

Assignment counts below distinguish primary ownership from exposure on related topics. Related-topic totals overlap and must not be summed as unique assignments. Substantive teaching excludes introduction and recap blocks.

## Twenty-topic inventory

| Topic | Lesson | Blocks | Cards | Guides | Fixed drills | Primary tasks | Related tasks |
|---|---|---|---|---|---|---|---|
| IP_T01_JAVA_BASICS | `ds.lesson.ip.t01@1` | 8 | 10 | 1 | 5 | 0 | 0 |
| IP_T02_CONTROL_FLOW | `ds.lesson.ip@1` | 9 | 8 | 1 | 2 | 0 | 1 |
| IP_T03_METHODS_SCOPE | `ds.lesson.ip.t03@1` | 7 | 8 | 1 | 3 | 0 | 2 |
| IP_T04_CLASSES_OBJECTS | `ds.lesson.ip.t04@1` | 7 | 8 | 1 | 2 | 0 | 4 |
| IP_T05_ARRAYS_RECURSION | `ds.lesson.ip.t05@1` | 7 | 8 | 1 | 3 | 1 | 2 |
| IP_T06_CONTAINER_CLASSES | `ds.lesson.ip.t06@1` | 6 | 6 | 1 | 1 | 1 | 2 |
| IP_T07_COMPOSITION_LIBRARIES | `ds.lesson.ip.t07@1` | 6 | 4 | 1 | 1 | 0 | 5 |
| IP_T08_TESTING | `ds.lesson.ip.t08@1` | 7 | 6 | 1 | 0 | 1 | 8 |
| IP_T09_INHERITANCE | `ds.lesson.ip.t09@1` | 6 | 4 | 1 | 1 | 0 | 1 |
| IP_T10_POLYMORPHISM_BINDING | `ds.lesson.ip.t10@1` | 6 | 4 | 1 | 1 | 1 | 1 |
| IP_T11_EQUALITY_HASHING | `ds.lesson.ip.t11@1` | 5 | 6 | 1 | 3 | 1 | 2 |
| IP_T12_EXCEPTIONS | `ds.lesson.ip.t12@1` | 5 | 4 | 1 | 2 | 0 | 4 |
| IP_T13_DEBUGGING | `ds.lesson.ip.t13@1` | 4 | 2 | 1 | 0 | 0 | 1 |
| IP_T14_CODE_QUALITY_STRINGS_GENERICS | `ds.lesson.ip.t14@1` | 5 | 6 | 1 | 2 | 1 | 4 |
| IP_T15_IO_PARSING | `ds.lesson.ip.t15@1` | 5 | 6 | 1 | 0 | 1 | 4 |
| IP_T16_FUNCTIONAL_JAVA | `ds.lesson.ip.t16@1` | 5 | 6 | 1 | 3 | 1 | 1 |
| IP_T17_PROGRAM_DESIGN | `ds.lesson.ip.t17@1` | 4 | 4 | 1 | 0 | 0 | 4 |
| IP_T18_MODERN_JAVA | `ds.lesson.ip.t18@1` | 5 | 4 | 1 | 2 | 0 | 3 |
| IP_T19_THREADS_CONCURRENCY | `ds.lesson.ip.t19@1` | 5 | 4 | 1 | 4 | 0 | 1 |
| IP_T20_EXAM_PROGRAM_SYNTHESIS | `ds.lesson.ip.t20@1` | 6 | 4 | 2 | 0 | 3 | 3 |

## Every skill: teaching and flashcards

IDs are explicit so the inventory can be checked against locks and canonical ownership. An introduction mentioning a skill is not counted as its substantive teaching.

| Skill | Meaning | Substantive block IDs | Card count | Card IDs |
|---|---|---|---|---|
| IP_SK01_01_DECLARE_ASSIGN | Declare and update variables | `ds.block.ip.t01.variables` | 2 | `ds.card.ip.t01.declare`<br>`ds.card.ip.t01.update` |
| IP_SK01_02_REASON_TYPES | Reason about Java types | `ds.block.ip.t01.types` | 2 | `ds.card.ip.t01.reference`<br>`ds.card.ip.t01.primitive` |
| IP_SK01_03_EVAL_EXPRESSIONS | Evaluate Java expressions | `ds.block.ip.t01.expressions`<br>`ds.block.ip.t01.trace` | 2 | `ds.card.ip.t01.division`<br>`ds.card.ip.t01.concat` |
| IP_SK01_04_CAST_CONVERT | Use and reason about casts | `ds.block.ip.t01.conversion`<br>`ds.block.ip.t01.trace` | 2 | `ds.card.ip.t01.cast-position`<br>`ds.card.ip.t01.narrow` |
| IP_SK01_05_NUMERIC_EDGE | Recognize numeric edge cases | `ds.block.ip.t01.limits`<br>`ds.block.ip.t01.trace` | 2 | `ds.card.ip.t01.overflow`<br>`ds.card.ip.t01.precision` |
| IP_SK02_01_BOOLEAN_CONDITIONS | Build boolean conditions | `ds.block.ip.conditions`<br>`ds.block.ip.branch` | 2 | `ds.card.ip.interval`<br>`ds.card.ip.short-circuit` |
| IP_SK02_02_BRANCH_TRACE | Trace branching | `ds.block.ip.branch`<br>`ds.block.ip.switch` | 2 | `ds.card.ip.branch`<br>`ds.card.ip.switch` |
| IP_SK02_03_LOOP_TRACE | Trace loops | `ds.block.ip.loops`<br>`ds.block.ip.aggregate`<br>`ds.block.ip.search`<br>`ds.block.ip.pitfall` | 2 | `ds.card.ip.loop-order`<br>`ds.card.ip.while` |
| IP_SK02_04_LOOP_IMPLEMENT | Implement iterative processing | `ds.block.ip.loops`<br>`ds.block.ip.aggregate`<br>`ds.block.ip.search`<br>`ds.block.ip.pitfall` | 2 | `ds.card.ip.reduce`<br>`ds.card.ip.search` |
| IP_SK03_01_DEFINE_METHOD | Define methods from requirements | `ds.block.ip.t03.contract` | 2 | `ds.card.ip.t03.signature`<br>`ds.card.ip.t03.return` |
| IP_SK03_02_TRACE_CALLS | Trace method calls | `ds.block.ip.t03.calls`<br>`ds.block.ip.t03.trace` | 2 | `ds.card.ip.t03.locals`<br>`ds.card.ip.t03.ignored` |
| IP_SK03_03_SCOPE | Reason about scope | `ds.block.ip.t03.scope`<br>`ds.block.ip.t03.trace` | 2 | `ds.card.ip.t03.shadow`<br>`ds.card.ip.t03.scope-gc` |
| IP_SK03_04_PASS_BY_VALUE | Reason about Java pass-by-value | `ds.block.ip.t03.passing`<br>`ds.block.ip.t03.trace` | 2 | `ds.card.ip.t03.rebind`<br>`ds.card.ip.t03.mutate` |
| IP_SK04_01_MODEL_CLASS | Model a domain class | `ds.block.ip.t04.model`<br>`ds.block.ip.t04.trace` | 2 | `ds.card.ip.t04.domain-fields`<br>`ds.card.ip.t04.object-alias` |
| IP_SK04_02_CONSTRUCTOR_STATE | Reason about constructors and state | `ds.block.ip.t04.construct`<br>`ds.block.ip.t04.trace` | 2 | `ds.card.ip.t04.constructor`<br>`ds.card.ip.t04.this-field` |
| IP_SK04_03_INSTANCE_STATIC | Distinguish instance and static context | `ds.block.ip.t04.static`<br>`ds.block.ip.t04.trace` | 2 | `ds.card.ip.t04.static-count`<br>`ds.card.ip.t04.static-method` |
| IP_SK04_04_ENCAPSULATION | Apply basic encapsulation | `ds.block.ip.t04.encapsulation`<br>`ds.block.ip.t04.trace` | 2 | `ds.card.ip.t04.private-rule`<br>`ds.card.ip.t04.interface` |
| IP_SK05_01_ARRAY_TRAVERSE | Traverse arrays safely | `ds.block.ip.t05.traverse`<br>`ds.block.ip.t05.trace` | 2 | `ds.card.ip.t05.bounds`<br>`ds.card.ip.t05.empty-null` |
| IP_SK05_02_ARRAY_PROCESS | Process arrays | `ds.block.ip.t05.process` | 2 | `ds.card.ip.t05.filter-count`<br>`ds.card.ip.t05.search` |
| IP_SK05_03_ARRAY_ALIAS | Reason about array aliases | `ds.block.ip.t05.alias`<br>`ds.block.ip.t05.trace` | 2 | `ds.card.ip.t05.alias-copy`<br>`ds.card.ip.t05.shallow` |
| IP_SK05_04_RECURSION | Implement and trace simple recursion | `ds.block.ip.t05.recursion`<br>`ds.block.ip.t05.trace` | 2 | `ds.card.ip.t05.base`<br>`ds.card.ip.t05.stack` |
| IP_SK06_01_CONTAINER_IMPL | Implement an array-backed container | `ds.block.ip.t06.storage`<br>`ds.block.ip.t06.trace` | 2 | `ds.card.ip.t06.capacity`<br>`ds.card.ip.t06.remove` |
| IP_SK06_02_REP_INVARIANT | Maintain representation invariants | `ds.block.ip.t06.invariant`<br>`ds.block.ip.t06.trace` | 2 | `ds.card.ip.t06.invariant`<br>`ds.card.ip.t06.failure` |
| IP_SK06_03_COLLECTION_SEMANTICS | Implement collection semantics | `ds.block.ip.t06.semantics`<br>`ds.block.ip.t06.trace` | 2 | `ds.card.ip.t06.duplicates`<br>`ds.card.ip.t06.order` |
| IP_SK07_01_COMPOSE_MODEL | Design composed object models | `ds.block.ip.t07.composition` | 2 | `ds.card.ip.t07.composition`<br>`ds.card.ip.t07.multiplicity` |
| IP_SK07_02_API_USE | Use documented Java APIs | `ds.block.ip.t07.api`<br>`ds.block.ip.t07.library-cost`<br>`ds.block.ip.t07.trace` | 2 | `ds.card.ip.t07.javadoc`<br>`ds.card.ip.t07.remove-overload` |
| IP_SK08_01_WRITE_TESTS | Write meaningful unit tests | `ds.block.ip.t08.assertions`<br>`ds.block.ip.t08.junit`<br>`ds.block.ip.t08.worked` | 2 | `ds.card.ip.t08.aaa`<br>`ds.card.ip.t08.assert-meaning` |
| IP_SK08_02_TEST_BOUNDARIES | Test boundary and failure cases | `ds.block.ip.t08.boundaries`<br>`ds.block.ip.t08.junit`<br>`ds.block.ip.t08.worked` | 2 | `ds.card.ip.t08.zero-boundary`<br>`ds.card.ip.t08.exception` |
| IP_SK08_03_TESTABILITY | Reason about testability | `ds.block.ip.t08.testability`<br>`ds.block.ip.t08.worked` | 2 | `ds.card.ip.t08.pure-core`<br>`ds.card.ip.t08.coverage` |
| IP_SK09_01_DESIGN_HIERARCHY | Design an inheritance hierarchy | `ds.block.ip.t09.hierarchy` | 2 | `ds.card.ip.t09.substitution`<br>`ds.card.ip.t09.has-a` |
| IP_SK09_02_INHERITANCE_TRACE | Trace inherited behavior | `ds.block.ip.t09.construction`<br>`ds.block.ip.t09.visibility`<br>`ds.block.ip.t09.trace` | 2 | `ds.card.ip.t09.chain`<br>`ds.card.ip.t09.private-super` |
| IP_SK10_01_POLY_DESIGN | Design with interfaces/polymorphism | `ds.block.ip.t10.abstraction` | 2 | `ds.card.ip.t10.interface`<br>`ds.card.ip.t10.abstract` |
| IP_SK10_02_DISPATCH_TRACE | Resolve overload/override behavior | `ds.block.ip.t10.static-dynamic`<br>`ds.block.ip.t10.binding`<br>`ds.block.ip.t10.trace` | 2 | `ds.card.ip.t10.overload`<br>`ds.card.ip.t10.override` |
| IP_SK11_01_EQUALS_IMPL | Implement correct equals | `ds.block.ip.t11.value` | 2 | `ds.card.ip.t11.signature`<br>`ds.card.ip.t11.null-fields` |
| IP_SK11_02_HASH_CONTRACT | Maintain equals/hashCode consistency | `ds.block.ip.t11.hash` | 2 | `ds.card.ip.t11.collision`<br>`ds.card.ip.t11.mutable-key` |
| IP_SK11_03_EQUALITY_EDGE | Diagnose equality edge cases | `ds.block.ip.t11.edges` | 2 | `ds.card.ip.t11.edge-matrix`<br>`ds.card.ip.t11.inheritance` |
| IP_SK12_01_CLASSIFY_FAILURE | Classify program failures | `ds.block.ip.t12.classification` | 2 | `ds.card.ip.t12.phase`<br>`ds.card.ip.t12.checked` |
| IP_SK12_02_EXCEPTION_FLOW | Implement and trace exception handling | `ds.block.ip.t12.flow`<br>`ds.block.ip.t12.custom` | 2 | `ds.card.ip.t12.throw-throws`<br>`ds.card.ip.t12.cleanup` |
| IP_SK13_01_DEBUG_SYSTEMATIC | Debug systematically | `ds.block.ip.t13.workflow`<br>`ds.block.ip.t13.boundary` | 2 | `ds.card.ip.t13.hypothesis`<br>`ds.card.ip.t13.step` |
| IP_SK14_01_REFACTOR | Refactor for quality | `ds.block.ip.t14.refactor` | 2 | `ds.card.ip.t14.responsibility`<br>`ds.card.ip.t14.metrics` |
| IP_SK14_02_STRING_PARSE | Parse structured text with String operations | `ds.block.ip.t14.strings` | 2 | `ds.card.ip.t14.split`<br>`ds.card.ip.t14.immutable-string` |
| IP_SK14_03_GENERIC_REASON | Use and reason about generics | `ds.block.ip.t14.generics` | 2 | `ds.card.ip.t14.invariance`<br>`ds.card.ip.t14.erasure` |
| IP_SK15_01_PARSE_FILE | Implement file-to-model parsing | `ds.block.ip.t15.read` | 2 | `ds.card.ip.t15.eof`<br>`ds.card.ip.t15.parse-boundary` |
| IP_SK15_02_WRITE_FILE | Write required output formats | `ds.block.ip.t15.write` | 2 | `ds.card.ip.t15.output`<br>`ds.card.ip.t15.write-failure` |
| IP_SK15_03_RESOURCE_SAFETY | Manage I/O resources safely | `ds.block.ip.t15.ownership` | 2 | `ds.card.ip.t15.owner`<br>`ds.card.ip.t15.try-resources` |
| IP_SK16_01_LAMBDA | Write/use lambdas | `ds.block.ip.t16.lambda` | 2 | `ds.card.ip.t16.functional-type`<br>`ds.card.ip.t16.lambda-state` |
| IP_SK16_02_STREAM_PIPE | Build and trace stream pipelines | `ds.block.ip.t16.pipeline` | 2 | `ds.card.ip.t16.lazy`<br>`ds.card.ip.t16.reuse` |
| IP_SK16_03_OPTIONAL | Use Optional appropriately | `ds.block.ip.t16.optional` | 2 | `ds.card.ip.t16.empty`<br>`ds.card.ip.t16.of-null` |
| IP_SK17_01_DOMAIN_MODEL | Derive a domain model from a specification | `ds.block.ip.t17.model` | 2 | `ds.card.ip.t17.has-is`<br>`ds.card.ip.t17.invariant-owner` |
| IP_SK17_02_DECOMPOSE | Decompose a complete application | `ds.block.ip.t17.decompose` | 2 | `ds.card.ip.t17.separate-ui`<br>`ds.card.ip.t17.alternative-design` |
| IP_SK18_01_MODERN_MODEL | Choose modern Java modeling constructs | `ds.block.ip.t18.model` | 2 | `ds.card.ip.t18.record-depth`<br>`ds.card.ip.t18.sealed-final` |
| IP_SK18_02_MODERN_USE | Use modern syntax correctly | `ds.block.ip.t18.syntax`<br>`ds.block.ip.t18.compare` | 2 | `ds.card.ip.t18.var`<br>`ds.card.ip.t18.ordering` |
| IP_SK19_01_THREAD_RUN | Create and coordinate threads | `ds.block.ip.t19.lifecycle` | 2 | `ds.card.ip.t19.start-run`<br>`ds.card.ip.t19.join` |
| IP_SK19_02_SYNC | Diagnose and protect shared state | `ds.block.ip.t19.synchronized`<br>`ds.block.ip.t19.race` | 2 | `ds.card.ip.t19.lost-update`<br>`ds.card.ip.t19.same-monitor` |
| IP_SK20_01_EXAM_SYNTHESIS | Build a full Delft-style program | `ds.block.ip.t20.requirements`<br>`ds.block.ip.t20.component-evidence`<br>`ds.block.ip.t20.threads` | 2 | `ds.card.ip.t20.vertical-slice`<br>`ds.card.ip.t20.evidence` |
| IP_SK20_02_EXAM_PRIORITIZE | Prioritize exam implementation | `ds.block.ip.t20.priorities` | 2 | `ds.card.ip.t20.prioritize`<br>`ds.card.ip.t20.final-check` |

## Every skill: practice classification and coverage

A = deterministic fixed prediction; B = structured multiple-valid-answer; C = open/rubric; D = specialized coding workspace; E = not safely autogradable. Categories describe the selected practice surface. The IDs below are actual activities, not claims of student achievement.

| Skill | Class | Safe scope / reason | Fixed exercise IDs | Unscored guide IDs | Coding task IDs |
|---|---|---|---|---|---|
| IP_SK01_01_DECLARE_ASSIGN | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-narrow-assignment` | `ds.guided.ip.t01.numeric-audit` | — |
| IP_SK01_02_REASON_TYPES | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-reference-type` | `ds.guided.ip.t01.numeric-audit` | — |
| IP_SK01_03_EVAL_EXPRESSIONS | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-division` | `ds.guided.ip.t01.numeric-audit` | — |
| IP_SK01_04_CAST_CONVERT | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-cast` | `ds.guided.ip.t01.numeric-audit` | — |
| IP_SK01_05_NUMERIC_EDGE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-overflow` | `ds.guided.ip.t01.numeric-audit` | — |
| IP_SK02_01_BOOLEAN_CONDITIONS | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t02.filtered-loop` | — |
| IP_SK02_02_BRANCH_TRACE | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t02.filtered-loop` | — |
| IP_SK02_03_LOOP_TRACE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-for-sum`<br>`ds.practice.ip-while-even` | `ds.guided.ip.t02.filtered-loop` | — |
| IP_SK02_04_LOOP_IMPLEMENT | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t02.filtered-loop` | `ds.assignment.ip.array-window` |
| IP_SK03_01_DEFINE_METHOD | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t03.call-audit` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.array-window` |
| IP_SK03_02_TRACE_CALLS | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-method-return` | `ds.guided.ip.t03.call-audit` | — |
| IP_SK03_03_SCOPE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-scope` | `ds.guided.ip.t03.call-audit` | — |
| IP_SK03_04_PASS_BY_VALUE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-pass-value` | `ds.guided.ip.t03.call-audit` | — |
| IP_SK04_01_MODEL_CLASS | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t04.quota-model` | `ds.assignment.ip.material-ledger` |
| IP_SK04_02_CONSTRUCTOR_STATE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-constructor` | `ds.guided.ip.t04.quota-model` | `ds.assignment.ip.alert-policies`<br>`ds.assignment.ip.material-ledger` |
| IP_SK04_03_INSTANCE_STATIC | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-static` | `ds.guided.ip.t04.quota-model` | — |
| IP_SK04_04_ENCAPSULATION | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t04.quota-model` | `ds.assignment.ip.capacity-shelf`<br>`ds.assignment.ip.grid-key` |
| IP_SK05_01_ARRAY_TRAVERSE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-array-bound` | `ds.guided.ip.t05.filter-and-prefix` | `ds.assignment.ip.array-window` |
| IP_SK05_02_ARRAY_PROCESS | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t05.filter-and-prefix` | `ds.assignment.ip.array-window`<br>`ds.assignment.ip.capacity-shelf` |
| IP_SK05_03_ARRAY_ALIAS | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-alias` | `ds.guided.ip.t05.filter-and-prefix` | `ds.assignment.ip.array-window`<br>`ds.assignment.ip.capacity-shelf` |
| IP_SK05_04_RECURSION | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-recursion` | `ds.guided.ip.t05.filter-and-prefix` | — |
| IP_SK06_01_CONTAINER_IMPL | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t06.set-invariant` | `ds.assignment.ip.capacity-shelf` |
| IP_SK06_02_REP_INVARIANT | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t06.set-invariant` | `ds.assignment.ip.capacity-shelf` |
| IP_SK06_03_COLLECTION_SEMANTICS | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-list-set` | `ds.guided.ip.t06.set-invariant` | `ds.assignment.ip.capacity-shelf`<br>`ds.assignment.ip.material-ledger` |
| IP_SK07_01_COMPOSE_MODEL | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t07.session-model` | `ds.assignment.ip.alert-policies`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index` |
| IP_SK07_02_API_USE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-api-remove` | `ds.guided.ip.t07.session-model` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.capacity-shelf`<br>`ds.assignment.ip.material-ledger` |
| IP_SK08_01_WRITE_TESTS | B | Structured test or debugging evidence can have several valid responses; compare requirements and reference reasoning without automatic scoring. | — | `ds.guided.ip.t08.tests-before-code` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.alert-policies`<br>`ds.assignment.ip.boundary-tests`<br>`ds.assignment.ip.capacity-shelf`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index`<br>`ds.assignment.ip.reading-export` |
| IP_SK08_02_TEST_BOUNDARIES | B | Structured test or debugging evidence can have several valid responses; compare requirements and reference reasoning without automatic scoring. | — | `ds.guided.ip.t08.tests-before-code` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.batch-token`<br>`ds.assignment.ip.boundary-tests`<br>`ds.assignment.ip.capacity-shelf`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index`<br>`ds.assignment.ip.reading-export` |
| IP_SK08_03_TESTABILITY | B | Structured test or debugging evidence can have several valid responses; compare requirements and reference reasoning without automatic scoring. | — | `ds.guided.ip.t08.tests-before-code` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.alert-policies`<br>`ds.assignment.ip.boundary-tests`<br>`ds.assignment.ip.material-ledger` |
| IP_SK09_01_DESIGN_HIERARCHY | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t09.hierarchy-review` | `ds.assignment.ip.alert-policies` |
| IP_SK09_02_INHERITANCE_TRACE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-constructor-chain` | `ds.guided.ip.t09.hierarchy-review` | `ds.assignment.ip.alert-policies` |
| IP_SK10_01_POLY_DESIGN | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t10.dispatch-review` | `ds.assignment.ip.alert-policies` |
| IP_SK10_02_DISPATCH_TRACE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-dispatch` | `ds.guided.ip.t10.dispatch-review` | `ds.assignment.ip.alert-policies` |
| IP_SK11_01_EQUALS_IMPL | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-equality` | `ds.guided.ip.t11.contract-review` | `ds.assignment.ip.grid-key`<br>`ds.assignment.ip.material-ledger` |
| IP_SK11_02_HASH_CONTRACT | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-hash-collision` | `ds.guided.ip.t11.contract-review` | `ds.assignment.ip.grid-key`<br>`ds.assignment.ip.material-ledger` |
| IP_SK11_03_EQUALITY_EDGE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-equals-overload` | `ds.guided.ip.t11.contract-review` | `ds.assignment.ip.grid-key`<br>`ds.assignment.ip.material-ledger` |
| IP_SK12_01_CLASSIFY_FAILURE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-checked-exception` | `ds.guided.ip.t12.failure-boundary` | `ds.assignment.ip.air-audit` |
| IP_SK12_02_EXCEPTION_FLOW | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-exception-flow` | `ds.guided.ip.t12.failure-boundary` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.batch-token`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.reading-export` |
| IP_SK13_01_DEBUG_SYSTEMATIC | B | Structured test or debugging evidence can have several valid responses; compare requirements and reference reasoning without automatic scoring. | — | `ds.guided.ip.t13.localize` | `ds.assignment.ip.boundary-tests` |
| IP_SK14_01_REFACTOR | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t14.parse-review` | — |
| IP_SK14_02_STRING_PARSE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-trailing-field` | `ds.guided.ip.t14.parse-review` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.batch-token`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.reading-export` |
| IP_SK14_03_GENERIC_REASON | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-generic-invariance` | `ds.guided.ip.t14.parse-review` | — |
| IP_SK15_01_PARSE_FILE | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t15.import-contract` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index`<br>`ds.assignment.ip.reading-export` |
| IP_SK15_02_WRITE_FILE | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t15.import-contract` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index`<br>`ds.assignment.ip.reading-export` |
| IP_SK15_03_RESOURCE_SAFETY | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t15.import-contract` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index`<br>`ds.assignment.ip.reading-export` |
| IP_SK16_01_LAMBDA | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-lambda` | `ds.guided.ip.t16.pipeline-design` | `ds.assignment.ip.label-stream` |
| IP_SK16_02_STREAM_PIPE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-stream` | `ds.guided.ip.t16.pipeline-design` | `ds.assignment.ip.label-stream` |
| IP_SK16_03_OPTIONAL | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-optional` | `ds.guided.ip.t16.pipeline-design` | `ds.assignment.ip.label-stream` |
| IP_SK17_01_DOMAIN_MODEL | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t17.roof-design` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.alert-policies`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index` |
| IP_SK17_02_DECOMPOSE | C | Open implementation/design obligations require a rubric and component evidence. Similar text or syntax cannot establish correctness. | — | `ds.guided.ip.t17.roof-design` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index` |
| IP_SK18_01_MODERN_MODEL | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-record` | `ds.guided.ip.t18.choose-model` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.reading-export` |
| IP_SK18_02_MODERN_USE | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-var` | `ds.guided.ip.t18.choose-model` | — |
| IP_SK19_01_THREAD_RUN | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-direct-run`<br>`ds.practice.ip-missing-join` | `ds.guided.ip.t19.race-review` | `ds.assignment.ip.note-index` |
| IP_SK19_02_SYNC | A | Only the authored fixed prediction has a deterministic answer. Implementation/design alternatives remain unscored guided or coding self-check. | `ds.practice.ip-joined-sync`<br>`ds.practice.ip-race` | `ds.guided.ip.t19.race-review` | `ds.assignment.ip.note-index` |
| IP_SK20_01_EXAM_SYNTHESIS | D | The coding workbench supports an integrated program and explicit component rubric/tests. It does not execute learner code or infer whole-course skill correctness. | — | `ds.guided.ip.t20.integration-plan` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index` |
| IP_SK20_02_EXAM_PRIORITIZE | D | The coding workbench supports an integrated program and explicit component rubric/tests. It does not execute learner code or infer whole-course skill correctness. | — | `ds.guided.ip.t20.integration-plan`<br>`ds.guided.ip.t20.prioritization` | `ds.assignment.ip.air-audit`<br>`ds.assignment.ip.material-ledger`<br>`ds.assignment.ip.note-index` |

## Guided and coding activity inventory

| Guide | Topic | Title | Canonical skills | Rubric items |
|---|---|---|---|---|
| `ds.guided.ip.t02.filtered-loop@1` | IP_T02_CONTROL_FLOW | Build a loop with an exact boundary | `IP_SK02_01_BOOLEAN_CONDITIONS`<br>`IP_SK02_02_BRANCH_TRACE`<br>`IP_SK02_03_LOOP_TRACE`<br>`IP_SK02_04_LOOP_IMPLEMENT` | 4 |
| `ds.guided.ip.t01.numeric-audit@1` | IP_T01_JAVA_BASICS | Audit a grouped measurement | `IP_SK01_01_DECLARE_ASSIGN`<br>`IP_SK01_02_REASON_TYPES`<br>`IP_SK01_03_EVAL_EXPRESSIONS`<br>`IP_SK01_04_CAST_CONVERT`<br>`IP_SK01_05_NUMERIC_EDGE` | 4 |
| `ds.guided.ip.t03.call-audit@1` | IP_T03_METHODS_SCOPE | Separate a calculation from a mutation | `IP_SK03_01_DEFINE_METHOD`<br>`IP_SK03_02_TRACE_CALLS`<br>`IP_SK03_03_SCOPE`<br>`IP_SK03_04_PASS_BY_VALUE` | 4 |
| `ds.guided.ip.t04.quota-model@1` | IP_T04_CLASSES_OBJECTS | Model a bounded resource allowance | `IP_SK04_01_MODEL_CLASS`<br>`IP_SK04_02_CONSTRUCTOR_STATE`<br>`IP_SK04_03_INSTANCE_STATIC`<br>`IP_SK04_04_ENCAPSULATION` | 4 |
| `ds.guided.ip.t05.filter-and-prefix@1` | IP_T05_ARRAYS_RECURSION | Filter safely and trace a recursive prefix | `IP_SK05_01_ARRAY_TRAVERSE`<br>`IP_SK05_02_ARRAY_PROCESS`<br>`IP_SK05_03_ARRAY_ALIAS`<br>`IP_SK05_04_RECURSION` | 4 |
| `ds.guided.ip.t06.set-invariant@1` | IP_T06_CONTAINER_CLASSES | Turn a bounded list into a bounded set | `IP_SK06_01_CONTAINER_IMPL`<br>`IP_SK06_02_REP_INVARIANT`<br>`IP_SK06_03_COLLECTION_SEMANTICS` | 4 |
| `ds.guided.ip.t07.session-model@1` | IP_T07_COMPOSITION_LIBRARIES | Design a session roster around documented APIs | `IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK07_02_API_USE` | 4 |
| `ds.guided.ip.t08.tests-before-code@1` | IP_T08_TESTING | Design tests that reject plausible bugs | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK08_03_TESTABILITY` | 4 |
| `ds.guided.ip.t09.hierarchy-review@1` | IP_T09_INHERITANCE | Review a useful hierarchy and a misleading one | `IP_SK09_01_DESIGN_HIERARCHY`<br>`IP_SK09_02_INHERITANCE_TRACE` | 4 |
| `ds.guided.ip.t10.dispatch-review@1` | IP_T10_POLYMORPHISM_BINDING | Explain an interchangeable formatter call | `IP_SK10_01_POLY_DESIGN`<br>`IP_SK10_02_DISPATCH_TRACE` | 4 |
| `ds.guided.ip.t11.contract-review@1` | IP_T11_EQUALITY_HASHING | Review a key contract | `IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_02_HASH_CONTRACT`<br>`IP_SK11_03_EQUALITY_EDGE` | 3 |
| `ds.guided.ip.t12.failure-boundary@1` | IP_T12_EXCEPTIONS | Design an error boundary | `IP_SK12_01_CLASSIFY_FAILURE`<br>`IP_SK12_02_EXCEPTION_FLOW` | 3 |
| `ds.guided.ip.t13.localize@1` | IP_T13_DEBUGGING | Localize an off-by-one error | `IP_SK13_01_DEBUG_SYSTEMATIC` | 3 |
| `ds.guided.ip.t14.parse-review@1` | IP_T14_CODE_QUALITY_STRINGS_GENERICS | Review a delimiter parser | `IP_SK14_01_REFACTOR`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK14_03_GENERIC_REASON` | 3 |
| `ds.guided.ip.t15.import-contract@1` | IP_T15_IO_PARSING | Design a failure-aware importer | `IP_SK15_01_PARSE_FILE`<br>`IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY` | 4 |
| `ds.guided.ip.t16.pipeline-design@1` | IP_T16_FUNCTIONAL_JAVA | Describe a pipeline before coding | `IP_SK16_01_LAMBDA`<br>`IP_SK16_02_STREAM_PIPE`<br>`IP_SK16_03_OPTIONAL` | 3 |
| `ds.guided.ip.t17.roof-design@1` | IP_T17_PROGRAM_DESIGN | Design a roof-inspection report | `IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE` | 4 |
| `ds.guided.ip.t18.choose-model@1` | IP_T18_MODERN_JAVA | Choose constructs for a booking label | `IP_SK18_01_MODERN_MODEL`<br>`IP_SK18_02_MODERN_USE` | 3 |
| `ds.guided.ip.t19.race-review@1` | IP_T19_THREADS_CONCURRENCY | Review a counter trace without guessing the scheduler | `IP_SK19_01_THREAD_RUN`<br>`IP_SK19_02_SYNC` | 4 |
| `ds.guided.ip.t20.integration-plan@1` | IP_T20_EXAM_PROGRAM_SYNTHESIS | Plan a complete repair-supply log | `IP_SK20_01_EXAM_SYNTHESIS`<br>`IP_SK20_02_EXAM_PRIORITIZE` | 4 |
| `ds.guided.ip.t20.prioritization@1` | IP_T20_EXAM_PROGRAM_SYNTHESIS | Recover from a blocked component | `IP_SK20_02_EXAM_PRIORITIZE` | 4 |

## Fixed exercise and feedback inventory

Every new item binds the shared feedback profile to the exact exercise/grader fingerprint. Only the listed answer pattern triggers its authoring label; other wrong answers get the explicit fallback. Correct answers do not receive a false misconception label. No learner misconception history is stored. The two preserved pilot items remain under their original bindings.

| Exercise | Skill | Mechanism | Reference prediction | Feedback profile | Supported answer-pattern label | Reminder |
|---|---|---|---|---|---|---|
| `ds.practice.ip-for-sum@1` | IP_SK02_03_LOOP_TRACE | Trace a for-loop sum | ['sum-10'] | Preserved pilot feedback | No new IP profile | Published contract unchanged |
| `ds.practice.ip-while-even@1` | IP_SK02_03_LOOP_TRACE | Trace a while-loop with a condition | ['even-6'] | Preserved pilot feedback | No new IP profile | Published contract unchanged |
| `ds.practice.ip-division@1` | IP_SK01_03_EVAL_EXPRESSIONS | Integer operations happen before assignment | 6 | `ds.feedback.ip.division@1` | `ds.misconception.ip.division`: Integer division; answer 7; 7 treats integer division as exact real arithmetic. | Determine operand types before evaluating each operator. |
| `ds.practice.ip-cast@1` | IP_SK01_04_CAST_CONVERT | Place the widening conversion | 3.0 | `ds.feedback.ip.cast@1` | `ds.misconception.ip.cast`: Conversion timing; answer 3.5; 3.5 would require converting an operand before division. | A later cast cannot recover a fraction already discarded. |
| `ds.practice.ip-overflow@1` | IP_SK01_05_NUMERIC_EDGE | An int at its upper boundary | -2147483648 | `ds.feedback.ip.overflow@1` | `ds.misconception.ip.overflow`: Integer overflow; answer 2147483648; 2147483648 is the mathematical sum, outside the int range. | The variable and operands determine the arithmetic width. |
| `ds.practice.ip-narrow-assignment@1` | IP_SK01_01_DECLARE_ASSIGN | An assignment requiring narrowing | Compile-time error | `ds.feedback.ip.narrow-assignment@1` | `ds.misconception.ip.narrow-assignment`: Implicit narrowing; answer 3; 3 assumes an implicit double-to-int conversion that Java does not permit. | Separate compiler rejection from the behavior of a compiling program. |
| `ds.practice.ip-reference-type@1` | IP_SK01_02_REASON_TYPES | Two references, one array | 9 | `ds.feedback.ip.reference-type@1` | `ds.misconception.ip.reference-type`: Reference aliasing; answer 4; 4 would require an independent array copy. | A reference variable holds a reference, not an inline object copy. |
| `ds.practice.ip-method-return@1` | IP_SK03_02_TRACE_CALLS | Follow a returned value | 8 | `ds.feedback.ip.method-return@1` | `ds.misconception.ip.method-return`: Return versus caller state; answer 10; 10 incorrectly changes x to the method result. | A returned value does not itself reassign the caller variable. |
| `ds.practice.ip-pass-value@1` | IP_SK03_04_PASS_BY_VALUE | Mutation and parameter reassignment | 4:9 | `ds.feedback.ip.pass-value@1` | `ds.misconception.ip.pass-value`: Pass by value; answer 8:7; 8:7 treats both parameter reassignments as writes to the caller variables. | Java always passes values, including reference values. |
| `ds.practice.ip-scope@1` | IP_SK03_03_SCOPE | Field and local names | 2:5 | `ds.feedback.ip.scope@1` | `ds.misconception.ip.scope`: Local shadowing; answer 2:2; 2:2 conflates the local variable with the instance field. | Scope chooses a binding; identical spelling does not make two storage locations identical. |
| `ds.practice.ip-constructor@1` | IP_SK04_02_CONSTRUCTOR_STATE | Initialize the current object | 5 | `ds.feedback.ip.constructor@1` | `ds.misconception.ip.constructor`: Constructor initialization; answer 0; 0 overlooks the explicit assignment to this.value. | this identifies the current object; unqualified parameter names may shadow fields. |
| `ds.practice.ip-static@1` | IP_SK04_03_INSTANCE_STATIC | Separate shared and per-object state | 2:5:2 | `ds.feedback.ip.static@1` | `ds.misconception.ip.static`: Static versus instance; answer 5:5:2; 5:5:2 treats value as shared even though it is not static. | static state belongs to the class; instance fields belong to each object. |
| `ds.practice.ip-array-bound@1` | IP_SK05_01_ARRAY_TRAVERSE | The last valid index | Runtime error before output | `ds.feedback.ip.array-bound@1` | `ds.misconception.ip.array-bound`: Array boundary; answer 9; 9 stops the trace before the invalid final iteration. | For zero-based arrays, the last valid index is length-1. |
| `ds.practice.ip-alias@1` | IP_SK05_03_ARRAY_ALIAS | An update through an alias | 6 | `ds.feedback.ip.alias@1` | `ds.misconception.ip.alias`: Array aliasing; answer 4; 4 assumes assigning a reference cloned the array. | Draw one array and two reference arrows before tracing mutations. |
| `ds.practice.ip-recursion@1` | IP_SK05_04_RECURSION | Accumulate recursive return values | 10 | `ds.feedback.ip.recursion@1` | `ds.misconception.ip.recursion`: Recursion unwinding; answer 4; 4 keeps only the outer n and discards the recursive sum. | Check termination first, then unwind each return expression. |
| `ds.practice.ip-list-set@1` | IP_SK06_03_COLLECTION_SEMANTICS | Duplicates in a list and set | 3:2 | `ds.feedback.ip.list-set@1` | `ds.misconception.ip.list-set`: List versus set semantics; answer 3:3; 3:3 assumes the set preserves duplicate values. | A collection contract determines whether duplicates are retained. |
| `ds.practice.ip-api-remove@1` | IP_SK07_02_API_USE | Choose the intended remove overload | [7, 4] | `ds.feedback.ip.api-remove@1` | `ds.misconception.ip.api-remove`: Overloaded collection API; answer [4, 7]; [4, 7] removes the last entry rather than the first matching value. | Read the parameter types and return contract of overloaded library methods. |
| `ds.practice.ip-constructor-chain@1` | IP_SK09_02_INHERITANCE_TRACE | Constructor order | PC | `ds.feedback.ip.constructor-chain@1` | `ds.misconception.ip.constructor-chain`: Constructor chaining; answer CP; CP reverses the superclass-before-subclass order. | Superclass construction precedes the subclass constructor body. |
| `ds.practice.ip-dispatch@1` | IP_SK10_02_DISPATCH_TRACE | Overload selection and overriding | child-object | `ds.feedback.ip.dispatch@1` | `ds.misconception.ip.dispatch`: Overload versus override; answer child-string; child-string uses the dynamic type to choose an overload, which Java does not do. | Choose a signature using static types, then dispatch an overridden instance method using the runtime object. |
| `ds.practice.ip-equality@1` | IP_SK11_01_EQUALS_IMPL | Identity and logical value | false:true:1 | `ds.feedback.ip.equality@1` | `ds.misconception.ip.equality`: Identity versus equality; answer true:true:1; The first true equates equal field values with object identity. | Identity and domain-defined equality answer different questions. |
| `ds.practice.ip-hash-collision@1` | IP_SK11_02_HASH_CONTRACT | A collision does not prove equality | true:false | `ds.feedback.ip.hash-collision@1` | `ds.misconception.ip.hash-collision`: Hash implication direction; answer true:true; true:true treats equal hash codes as sufficient evidence of equality. | Hash collisions are permitted; collections still check equality. |
| `ds.practice.ip-equals-overload@1` | IP_SK11_03_EQUALITY_EDGE | An equals overload is not an override | true:false | `ds.feedback.ip.equals-overload@1` | `ds.misconception.ip.equals-overload`: Equality overloading; answer true:true; true:true assumes the Key-only overload replaces Object.equals(Object). | Override public boolean equals(Object), and pair it with a compatible hashCode. |
| `ds.practice.ip-exception-flow@1` | IP_SK12_02_EXCEPTION_FLOW | Catch, then finally | CF | `ds.feedback.ip.exception-flow@1` | `ds.misconception.ip.exception-flow`: Exception control flow; answer ACF; ACF executes a statement that the thrown exception bypasses. | Trace the first thrown exception; skip the remaining statements in that try body. |
| `ds.practice.ip-checked-exception@1` | IP_SK12_01_CLASSIFY_FAILURE | A checked exception obligation | Compile-time error | `ds.feedback.ip.checked-exception@1` | `ds.misconception.ip.checked-exception`: Checked exception handling; answer Runtime IOException; Runtime IOException skips the compile-time obligation to catch or declare the checked exception. | Compilation requirements and runtime exception flow are separate questions. |
| `ds.practice.ip-trailing-field@1` | IP_SK14_02_STRING_PARSE | Keep an empty final field | 3 | `ds.feedback.ip.trailing-field@1` | `ds.misconception.ip.trailing-field`: Trailing-field parsing; answer 2; 2 assumes the default split behavior that discards trailing empty fields. | A parser must deliberately choose how to handle empty fields. |
| `ds.practice.ip-generic-invariance@1` | IP_SK14_03_GENERIC_REASON | A generic assignment | Compile-time error | `ds.feedback.ip.generic-invariance@1` | `ds.misconception.ip.generic-invariance`: Generic invariance; answer Compiles successfully; This choice incorrectly transfers the Integer-is-a-Number relation to mutable lists. | Generic type arguments are invariant; use a suitable API type for the required reads and writes. |
| `ds.practice.ip-stream@1` | IP_SK16_02_STREAM_PIPE | Read the pipeline in order | [6, 12] | `ds.feedback.ip.stream@1` | `ds.misconception.ip.stream`: Pipeline ordering; answer [12, 6]; [12, 6] omits the explicit sorted operation. | Follow each intermediate transformation and the final ordering contract. |
| `ds.practice.ip-optional@1` | IP_SK16_03_OPTIONAL | An absent stream result | 7 | `ds.feedback.ip.optional@1` | `ds.misconception.ip.optional`: Optional absence; answer null; null ignores the explicit fallback in orElse. | Handle absence explicitly instead of calling get without checking. |
| `ds.practice.ip-lambda@1` | IP_SK16_01_LAMBDA | A predicate returns a Boolean result | false | `ds.feedback.ip.lambda@1` | `ds.misconception.ip.lambda`: Predicate result type; answer 1; 1 reports the remainder rather than the Boolean predicate result. | The functional-interface method signature constrains the lambda result. |
| `ds.practice.ip-var@1` | IP_SK18_02_MODERN_USE | var still gives a static type | 3 | `ds.feedback.ip.var@1` | `ds.misconception.ip.var`: var and static types; answer 3.5; 3.5 treats var as a dynamically chosen real-number representation. | Local type inference still chooses one compile-time type. |
| `ds.practice.ip-record@1` | IP_SK18_01_MODERN_MODEL | A record with immutable components | true | `ds.feedback.ip.record@1` | `ds.misconception.ip.record`: Record equality; answer false; false substitutes reference identity for generated component equality. | Choose record value semantics only when its component-based contract fits the model. |
| `ds.practice.ip-direct-run@1` | IP_SK19_01_THREAD_RUN | Calling run directly | WM | `ds.feedback.ip.direct-run@1` | `ds.misconception.ip.direct-run`: start versus run; answer Either WM or MW; The nondeterministic answer assumes run starts a separate thread. | start schedules a worker; a direct run call is an ordinary method call. |
| `ds.practice.ip-joined-sync@1` | IP_SK19_02_SYNC | Wait for synchronized workers | 200 | `ds.feedback.ip.joined-sync@1` | `ds.misconception.ip.joined-sync`: Synchronization plus join; answer An unpredictable value less than 200; An unpredictable smaller value would require missing mutual exclusion or reading before completion. | Protect the shared update and wait for every worker before reading the final result. |
| `ds.practice.ip-race@1` | IP_SK19_02_SYNC | A lost update is possible | 1 and 2 are possible; 2 is not guaranteed | `ds.feedback.ip.race@1` | `ds.misconception.ip.race`: Race nondeterminism; answer 2 is guaranteed after join; The guaranteed-2 choice assumes join makes the earlier increments atomic. | Separate waiting for completion from protecting a read-modify-write operation. |
| `ds.practice.ip-missing-join@1` | IP_SK19_01_THREAD_RUN | Reading before waiting | 0 and 1 are possible; no final value is guaranteed here | `ds.feedback.ip.missing-join@1` | `ds.misconception.ip.missing-join`: Missing join; answer 1 is guaranteed immediately after start; The guaranteed-1 choice assumes start blocks until the worker finishes. | Join a worker before relying on its completed result; do not infer an execution order from source-line order across threads. |

## 15/30/60-minute coding tasks

All tasks use editable ephemeral drafts. They expose requirements, test specifications, component rubrics and an original authored reference; they do not compile/run learner Java or assign a numeric correctness score. Reset/copy/reveal are workbench actions, not validation of the learner’s program.

### 15-minute authored practice

| Task | Title | Primary topic | Skills | Starter files | Requirements | Rubric components | Test specifications | Reference |
|---|---|---|---|---|---|---|---|---|
| `ds.assignment.ip.array-window@1` | Count threshold crossings in a window | IP_T05_ARRAYS_RECURSION | 5 | `WindowCounts.java` | 2 | 2 | 2 | `ds.reference.ip.array-window@1` |
| `ds.assignment.ip.batch-token@1` | Parse one strictly specified token | IP_T14_CODE_QUALITY_STRINGS_GENERICS | 3 | `BatchToken.java` | 2 | 2 | 2 | `ds.reference.ip.batch-token@1` |
| `ds.assignment.ip.boundary-tests@1` | Design tests that expose boundary bugs | IP_T08_TESTING | 4 | `Clamp.java`<br>`ClampTest.java` | 3 | 3 | 3 | `ds.reference.ip.boundary-tests@1` |
| `ds.assignment.ip.grid-key@1` | A value key with an honest equality contract | IP_T11_EQUALITY_HASHING | 4 | `GridKey.java` | 3 | 3 | 2 | `ds.reference.ip.grid-key@1` |
| `ds.assignment.ip.label-stream@1` | Transform labels and handle an empty result | IP_T16_FUNCTIONAL_JAVA | 3 | `LabelStream.java` | 2 | 2 | 2 | `ds.reference.ip.label-stream@1` |

### 30-minute authored practice

| Task | Title | Primary topic | Skills | Starter files | Requirements | Rubric components | Test specifications | Reference |
|---|---|---|---|---|---|---|---|---|
| `ds.assignment.ip.alert-policies@1` | Compose and dispatch alert policies | IP_T10_POLYMORPHISM_BINDING | 9 | `AlertRule.java`<br>`ThresholdAlert.java`<br>`HighAlert.java`<br>`LowAlert.java`<br>`RuleSet.java` | 4 | 4 | 2 | `ds.reference.ip.alert-policies@1` |
| `ds.assignment.ip.capacity-shelf@1` | Build a bounded shelf with a clear invariant | IP_T06_CONTAINER_CLASSES | 9 | `CapacityShelf.java` | 4 | 4 | 3 | `ds.reference.ip.capacity-shelf@1` |
| `ds.assignment.ip.reading-export@1` | Validate readings before exporting a file | IP_T15_IO_PARSING | 8 | `Reading.java`<br>`ReadingFormatException.java`<br>`ReadingExport.java`<br>`readings.data` | 4 | 4 | 3 | `ds.reference.ip.reading-export@1` |

### 60-minute authored practice

| Task | Title | Primary topic | Skills | Starter files | Requirements | Rubric components | Test specifications | Reference |
|---|---|---|---|---|---|---|---|---|
| `ds.assignment.ip.air-audit@1` | Air-quality batch audit with explicit failure rules | IP_T20_EXAM_PROGRAM_SYNTHESIS | 16 | `Sample.java`<br>`SampleFormatException.java`<br>`AirAudit.java`<br>`AirAuditCli.java`<br>`air-samples.data` | 5 | 5 | 4 | `ds.reference.ip.air-audit@1` |
| `ds.assignment.ip.material-ledger@1` | Workshop material ledger | IP_T20_EXAM_PROGRAM_SYNTHESIS | 21 | `MaterialKey.java`<br>`StockEntry.java`<br>`LedgerParser.java`<br>`LedgerTotals.java`<br>`LedgerCli.java`<br>`workshop.data` | 6 | 6 | 4 | `ds.reference.ip.material-ledger@1` |
| `ds.assignment.ip.note-index@1` | Coordinate a parallel note index | IP_T20_EXAM_PROGRAM_SYNTHESIS | 12 | `TokenCounter.java`<br>`NoteWorker.java`<br>`NoteIndex.java`<br>`NoteIndexCli.java`<br>`note-a.data`<br>`note-b.data` | 5 | 5 | 4 | `ds.reference.ip.note-index@1` |

## Component requirement → rubric → test → skill mapping

These are authored review obligations, not historical component locators and not aggregate grading. Test specifications are displayed references; actual development execution is reported separately. For integrated assignments, satisfying one component does not automatically satisfy its neighbours.

### Air-quality batch audit with explicit failure rules — `ds.assignment.ip.air-audit@1`

Authored 60-minute task. Source IDs: `ref-15f80f1f4bb2f1f3`<br>`ref-18b7de6140eaf782`<br>`ref-5469f9c870013b80`<br>`ref-8c6eff249b686f68`<br>`ref-cc566cb126fff995`<br>`ref-517a35b992dabf40`<br>`ref-7034e3454bddea79`<br>`ref-51fd7d38d2311986`<br>`ref-f7af58ce8943d54b`<br>`ref-556a1c1cc39b369a`. Supplemental observations: `ip-t20`<br>`ip-t17`<br>`ip-t08`<br>`ip-t18`<br>`ip-t15`<br>`ip-t14`<br>`ip-t12`<br>`ip-t03`<br>`ip-t07`<br>`ip-integrated-current`<br>`ip-integrated-recent`<br>`ip-exam-workflow`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| decompose | Keep immutable validated sample data, parsing, report logic and CLI separate so processing can be tested without files or console input. | `IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK18_01_MODERN_MODEL` | `rubric-decompose` | `air-normal` |
| input | Validate all fields, reject duplicate zone/sample pairs and use a checked exception with the exact line number for malformed data. | `IP_SK15_01_PARSE_FILE`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK12_01_CLASSIFY_FAILURE`<br>`IP_SK12_02_EXCEPTION_FLOW` | `rubric-input` | `air-invalid` |
| report | Compute count, peak and strict-above-threshold alerts and format sorted output exactly; reject invalid thresholds. | `IP_SK03_01_DEFINE_METHOD`<br>`IP_SK07_02_API_USE`<br>`IP_SK15_02_WRITE_FILE` | `rubric-report` | `air-normal`<br>`air-cli` |
| resources | Preserve borrowed-reader ownership, close owned resources, propagate I/O errors and keep existing output unchanged when parse validation fails. | `IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS` | `rubric-resources` | `air-ownership`<br>`air-cli` |
| testplan | Build meaningful positive/boundary/negative component tests; prioritize parsing plus one report example before connecting the full CLI. | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` | `rubric-testplan` | `air-normal`<br>`air-invalid`<br>`air-ownership`<br>`air-cli` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-decompose | Review evidence for: Keep immutable validated sample data, parsing, report logic and CLI separate so processing can be tested without files or console input. | `decompose` | `air-normal` | `IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK18_01_MODERN_MODEL` |
| rubric-input | Review evidence for: Validate all fields, reject duplicate zone/sample pairs and use a checked exception with the exact line number for malformed data. | `input` | `air-invalid` | `IP_SK15_01_PARSE_FILE`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK12_01_CLASSIFY_FAILURE`<br>`IP_SK12_02_EXCEPTION_FLOW` |
| rubric-report | Review evidence for: Compute count, peak and strict-above-threshold alerts and format sorted output exactly; reject invalid thresholds. | `report` | `air-normal`<br>`air-cli` | `IP_SK03_01_DEFINE_METHOD`<br>`IP_SK07_02_API_USE`<br>`IP_SK15_02_WRITE_FILE` |
| rubric-resources | Review evidence for: Preserve borrowed-reader ownership, close owned resources, propagate I/O errors and keep existing output unchanged when parse validation fails. | `resources` | `air-ownership`<br>`air-cli` | `IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS` |
| rubric-testplan | Review evidence for: Build meaningful positive/boundary/negative component tests; prioritize parsing plus one report example before connecting the full CLI. | `testplan` | `air-normal`<br>`air-invalid`<br>`air-ownership`<br>`air-cli` | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| air-normal | For sample input and threshold 700, derive each zone result manually. | LAB count=2 peak=800 alerts=1; STUDIO count=2 peak=900 alerts=1. | `decompose`<br>`report`<br>`testplan` | `IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK18_01_MODERN_MODEL`<br>`IP_SK03_01_DEFINE_METHOD`<br>`IP_SK07_02_API_USE`<br>`IP_SK15_02_WRITE_FILE`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| air-invalid | Reject duplicate zone/sample, blank second line, malformed field count, invalid integers and out-of-range values. | SampleFormatException identifies the failing line; identical sample numbers in different zones are valid. | `input`<br>`testplan` | `IP_SK15_01_PARSE_FILE`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK12_01_CLASSIFY_FAILURE`<br>`IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| air-ownership | Use borrowed close-tracking and failing readers; run generate on valid and malformed files with an existing destination. | Borrowed reader stays open; IOException propagates; malformed input leaves destination unchanged. | `resources`<br>`testplan` | `IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| air-cli | Exercise correct paths, missing path, malformed source, bad threshold and wrong argument count. | 0 for success, 1 for I/O/data failure and 2 for invalid arguments/threshold. | `report`<br>`resources`<br>`testplan` | `IP_SK03_01_DEFINE_METHOD`<br>`IP_SK07_02_API_USE`<br>`IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |

### Compose and dispatch alert policies — `ds.assignment.ip.alert-policies@1`

Authored 30-minute task. Source IDs: `ref-1b96953ab28fb39d`<br>`ref-6faf9172baf75824`<br>`ref-596f95ae721fb59e`<br>`ref-f7af58ce8943d54b`<br>`ref-18b7de6140eaf782`<br>`ref-15f80f1f4bb2f1f3`. Supplemental observations: `ip-t10`<br>`ip-t09`<br>`ip-t04`<br>`ip-t07`<br>`ip-t08`<br>`ip-t17`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| hierarchy | Use the interface and an abstract shared-state base correctly, including super constructor chaining and immutable threshold state. | `IP_SK09_01_DESIGN_HIERARCHY`<br>`IP_SK09_02_INHERITANCE_TRACE`<br>`IP_SK04_02_CONSTRUCTOR_STATE` | `rubric-hierarchy` | `alert-dispatch` |
| dispatch | Override matches(int) with strict high/low behavior and explain why a call through AlertRule uses the actual object implementation. | `IP_SK10_01_POLY_DESIGN`<br>`IP_SK10_02_DISPATCH_TRACE` | `rubric-dispatch` | `alert-dispatch` |
| composition | Compose a defensive list of rules; reject null rules and keep matching independent of console input. | `IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK17_01_DOMAIN_MODEL` | `rubric-composition` | `alert-composition` |
| tests | Test threshold equality, mixed rules, an empty rule list and caller mutation of the original list. | `IP_SK08_01_WRITE_TESTS` | `rubric-tests` | `alert-composition` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-hierarchy | Review evidence for: Use the interface and an abstract shared-state base correctly, including super constructor chaining and immutable threshold state. | `hierarchy` | `alert-dispatch` | `IP_SK09_01_DESIGN_HIERARCHY`<br>`IP_SK09_02_INHERITANCE_TRACE`<br>`IP_SK04_02_CONSTRUCTOR_STATE` |
| rubric-dispatch | Review evidence for: Override matches(int) with strict high/low behavior and explain why a call through AlertRule uses the actual object implementation. | `dispatch` | `alert-dispatch` | `IP_SK10_01_POLY_DESIGN`<br>`IP_SK10_02_DISPATCH_TRACE` |
| rubric-composition | Review evidence for: Compose a defensive list of rules; reject null rules and keep matching independent of console input. | `composition` | `alert-composition` | `IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK17_01_DOMAIN_MODEL` |
| rubric-tests | Review evidence for: Test threshold equality, mixed rules, an empty rule list and caller mutation of the original list. | `tests` | `alert-composition` | `IP_SK08_01_WRITE_TESTS` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| alert-dispatch | Call HighAlert(10) and LowAlert(10) through AlertRule for 9,10,11. | High: false,false,true. Low: true,false,false. | `hierarchy`<br>`dispatch` | `IP_SK09_01_DESIGN_HIERARCHY`<br>`IP_SK09_02_INHERITANCE_TRACE`<br>`IP_SK04_02_CONSTRUCTOR_STATE`<br>`IP_SK10_01_POLY_DESIGN`<br>`IP_SK10_02_DISPATCH_TRACE` |
| alert-composition | Use HighAlert(5), LowAlert(10) at reading 7, then clear the caller list; also test empty rules. | Two matches remain after caller mutation; empty rules produce zero. | `composition`<br>`tests` | `IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK08_01_WRITE_TESTS` |

### Count threshold crossings in a window — `ds.assignment.ip.array-window@1`

Authored 15-minute task. Source IDs: `ref-51fd7d38d2311986`<br>`ref-3f69452c7af0560e`<br>`ref-c6ef6c6bd94aa16c`. Supplemental observations: `ip-t05`<br>`ip-t03`<br>`ip-t02`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| range | Reject a null array with NullPointerException and reject from < 0, to > length, or from > to with IllegalArgumentException. | `IP_SK03_01_DEFINE_METHOD`<br>`IP_SK05_01_ARRAY_TRAVERSE` | `rubric-range` | `window-errors` |
| count | Count the half-open window with an inclusive threshold; accept an empty window and leave the original array unchanged. | `IP_SK02_04_LOOP_IMPLEMENT`<br>`IP_SK05_02_ARRAY_PROCESS`<br>`IP_SK05_03_ARRAY_ALIAS` | `rubric-count` | `window-boundaries` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-range | Review evidence for: Reject a null array with NullPointerException and reject from < 0, to > length, or from > to with IllegalArgumentException. | `range` | `window-errors` | `IP_SK03_01_DEFINE_METHOD`<br>`IP_SK05_01_ARRAY_TRAVERSE` |
| rubric-count | Review evidence for: Count the half-open window with an inclusive threshold; accept an empty window and leave the original array unchanged. | `count` | `window-boundaries` | `IP_SK02_04_LOOP_IMPLEMENT`<br>`IP_SK05_02_ARRAY_PROCESS`<br>`IP_SK05_03_ARRAY_ALIAS` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| window-boundaries | Use [4,7,7,2,9], window [1,4), threshold 7; then [0,5), threshold 7; then [3,3). | 2, then 3, then 0; the original array is unchanged. | `count` | `IP_SK02_04_LOOP_IMPLEMENT`<br>`IP_SK05_02_ARRAY_PROCESS`<br>`IP_SK05_03_ARRAY_ALIAS` |
| window-errors | Try null; negative from; to beyond length; reversed endpoints. | NullPointerException for null; IllegalArgumentException for each invalid range. | `range` | `IP_SK03_01_DEFINE_METHOD`<br>`IP_SK05_01_ARRAY_TRAVERSE` |

### Parse one strictly specified token — `ds.assignment.ip.batch-token@1`

Authored 15-minute task. Source IDs: `ref-517a35b992dabf40`<br>`ref-7034e3454bddea79`<br>`ref-18b7de6140eaf782`. Supplemental observations: `ip-t14`<br>`ip-t12`<br>`ip-t08`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| parse | Separate exactly two fields and validate the tag and decimal quantity against the stated format before conversion. | `IP_SK14_02_STRING_PARSE` | `rubric-parse` | `token-valid` |
| failure | Reject every stated malformed-input category with IllegalArgumentException and explain the validation order. | `IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK08_02_TEST_BOUNDARIES` | `rubric-failure` | `token-invalid` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-parse | Review evidence for: Separate exactly two fields and validate the tag and decimal quantity against the stated format before conversion. | `parse` | `token-valid` | `IP_SK14_02_STRING_PARSE` |
| rubric-failure | Review evidence for: Reject every stated malformed-input category with IllegalArgumentException and explain the validation order. | `failure` | `token-invalid` | `IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK08_02_TEST_BOUNDARIES` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| token-valid | Parse A@0, PULSE@007 and ZZZZZZZZ@999. | 0, 7 and 999. | `parse` | `IP_SK14_02_STRING_PARSE` |
| token-invalid | Try null, A@, @1, a@2, A@+2, A@1000, A@1@2, A @2 and A@2 followed by a space. | Every input is rejected; none is silently corrected. | `failure` | `IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK08_02_TEST_BOUNDARIES` |

### Design tests that expose boundary bugs — `ds.assignment.ip.boundary-tests@1`

Authored 15-minute task. Source IDs: `ref-18b7de6140eaf782`<br>`ref-34e225f008e41f8b`. Supplemental observations: `ip-t08`<br>`ip-t13`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| cases | Select below, lower-bound, inside, upper-bound, above and degenerate-interval inputs with explicit expected values. | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` | `rubric-cases` | `clamp-cases` |
| exceptions | Use an exception assertion for a reversed interval and avoid swallowing a missing exception. | `IP_SK08_02_TEST_BOUNDARIES` | `rubric-exceptions` | `clamp-throws` |
| design | Keep the pure clamp function testable without console input; explain why executing every line does not establish a strong test suite. | `IP_SK08_03_TESTABILITY`<br>`IP_SK13_01_DEBUG_SYSTEMATIC` | `rubric-design` | `clamp-review` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-cases | Review evidence for: Select below, lower-bound, inside, upper-bound, above and degenerate-interval inputs with explicit expected values. | `cases` | `clamp-cases` | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` |
| rubric-exceptions | Review evidence for: Use an exception assertion for a reversed interval and avoid swallowing a missing exception. | `exceptions` | `clamp-throws` | `IP_SK08_02_TEST_BOUNDARIES` |
| rubric-design | Review evidence for: Keep the pure clamp function testable without console input; explain why executing every line does not establish a strong test suite. | `design` | `clamp-review` | `IP_SK08_03_TESTABILITY`<br>`IP_SK13_01_DEBUG_SYSTEMATIC` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| clamp-cases | For [2,8], try -4,2,5,8,12; for [3,3], try -1,3,9. | 2,2,5,8,8; then 3,3,3. | `cases` | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` |
| clamp-throws | Call clamp(5,8,2). | IllegalArgumentException must be thrown. | `exceptions` | `IP_SK08_02_TEST_BOUNDARIES` |
| clamp-review | Review tests against the requirements and a mutant that returns min+1 for value == min. | The lower-bound assertion rejects the mutant; branch coverage alone would not. | `design` | `IP_SK08_03_TESTABILITY`<br>`IP_SK13_01_DEBUG_SYSTEMATIC` |

### Build a bounded shelf with a clear invariant — `ds.assignment.ip.capacity-shelf@1`

Authored 30-minute task. Source IDs: `ref-f8f42116f140d764`<br>`ref-3f69452c7af0560e`<br>`ref-6faf9172baf75824`<br>`ref-f7af58ce8943d54b`<br>`ref-18b7de6140eaf782`. Supplemental observations: `ip-t06`<br>`ip-t05`<br>`ip-t04`<br>`ip-t07`<br>`ip-t08`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| invariant | Maintain 0 <= size <= capacity; occupied labels are non-null, non-empty and unique, and unused cells are null. | `IP_SK06_01_CONTAINER_IMPL`<br>`IP_SK06_02_REP_INVARIANT` | `rubric-invariant` | `shelf-cycle`<br>`shelf-boundaries` |
| mutation | Preserve insertion order across successful adds and removals and handle duplicates, full capacity and absent removal according to contract. | `IP_SK06_03_COLLECTION_SEMANTICS`<br>`IP_SK05_02_ARRAY_PROCESS` | `rubric-mutation` | `shelf-cycle` |
| isolation | Return a defensive array copy and keep backing state private. | `IP_SK05_03_ARRAY_ALIAS`<br>`IP_SK04_04_ENCAPSULATION`<br>`IP_SK07_02_API_USE` | `rubric-isolation` | `shelf-alias` |
| boundaries | Test zero capacity, negative capacity, invalid labels, first/last removal and a reused slot. | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` | `rubric-boundaries` | `shelf-boundaries` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-invariant | Review evidence for: Maintain 0 <= size <= capacity; occupied labels are non-null, non-empty and unique, and unused cells are null. | `invariant` | `shelf-cycle`<br>`shelf-boundaries` | `IP_SK06_01_CONTAINER_IMPL`<br>`IP_SK06_02_REP_INVARIANT` |
| rubric-mutation | Review evidence for: Preserve insertion order across successful adds and removals and handle duplicates, full capacity and absent removal according to contract. | `mutation` | `shelf-cycle` | `IP_SK06_03_COLLECTION_SEMANTICS`<br>`IP_SK05_02_ARRAY_PROCESS` |
| rubric-isolation | Review evidence for: Return a defensive array copy and keep backing state private. | `isolation` | `shelf-alias` | `IP_SK05_03_ARRAY_ALIAS`<br>`IP_SK04_04_ENCAPSULATION`<br>`IP_SK07_02_API_USE` |
| rubric-boundaries | Review evidence for: Test zero capacity, negative capacity, invalid labels, first/last removal and a reused slot. | `boundaries` | `shelf-boundaries` | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| shelf-cycle | With capacity 3 add ink, chalk, wax; remove chalk; add clay. | Snapshots progress to [ink, wax, clay] with size 3; adding a fourth distinct label returns false. | `invariant`<br>`mutation` | `IP_SK06_01_CONTAINER_IMPL`<br>`IP_SK06_02_REP_INVARIANT`<br>`IP_SK06_03_COLLECTION_SEMANTICS`<br>`IP_SK05_02_ARRAY_PROCESS` |
| shelf-alias | Change element 0 in a snapshot and request a new snapshot. | The shelf still starts with ink. | `isolation` | `IP_SK05_03_ARRAY_ALIAS`<br>`IP_SK04_04_ENCAPSULATION`<br>`IP_SK07_02_API_USE` |
| shelf-boundaries | Try zero/negative capacity, duplicate labels, null/empty labels and removing missing/first/last labels. | No invariant violation; specified exceptions and booleans hold. | `boundaries`<br>`invariant` | `IP_SK06_01_CONTAINER_IMPL`<br>`IP_SK06_02_REP_INVARIANT`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` |

### A value key with an honest equality contract — `ds.assignment.ip.grid-key@1`

Authored 15-minute task. Source IDs: `ref-6faf9172baf75824`<br>`ref-f3d7a5431ab68a61`. Supplemental observations: `ip-t11`<br>`ip-t04`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| state | Store both coordinates privately and immutably; expose their values without setters. | `IP_SK04_04_ENCAPSULATION` | `rubric-state` | `key-contract` |
| equality | Implement reflexive, symmetric, transitive and consistent value equality; reject null and unrelated types. | `IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_03_EQUALITY_EDGE` | `rubric-equality` | `key-contract` |
| hash | Equal keys must have equal hash codes and behave as one logical key in a HashSet; hash collisions must not imply equality. | `IP_SK11_02_HASH_CONTRACT` | `rubric-hash` | `key-hash` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-state | Review evidence for: Store both coordinates privately and immutably; expose their values without setters. | `state` | `key-contract` | `IP_SK04_04_ENCAPSULATION` |
| rubric-equality | Review evidence for: Implement reflexive, symmetric, transitive and consistent value equality; reject null and unrelated types. | `equality` | `key-contract` | `IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_03_EQUALITY_EDGE` |
| rubric-hash | Review evidence for: Equal keys must have equal hash codes and behave as one logical key in a HashSet; hash collisions must not imply equality. | `hash` | `key-hash` | `IP_SK11_02_HASH_CONTRACT` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| key-contract | Compare one object to itself, two distinct equal keys, a third equal key, keys differing in either field, null and a String. | The first equal-coordinate cases are true; differing fields, null and unrelated types are false. | `state`<br>`equality` | `IP_SK04_04_ENCAPSULATION`<br>`IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_03_EQUALITY_EDGE` |
| key-hash | Add (0,31), an equal copy and (1,0) to a HashSet using hash = 31*row+column. | Size 2; the two unequal keys collide at hash 31 without becoming equal. | `hash` | `IP_SK11_02_HASH_CONTRACT` |

### Transform labels and handle an empty result — `ds.assignment.ip.label-stream@1`

Authored 15-minute task. Source IDs: `ref-25062da4a98e2927`. Supplemental observations: `ip-t16`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| pipeline | Apply trim before the length filter, preserve duplicate qualifying labels and sort the result without mutating the input list. | `IP_SK16_01_LAMBDA`<br>`IP_SK16_02_STREAM_PIPE` | `rubric-pipeline` | `labels-order` |
| optional | Represent absence using Optional.empty rather than a made-up string or an unchecked get call. | `IP_SK16_03_OPTIONAL` | `rubric-optional` | `labels-optional` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-pipeline | Review evidence for: Apply trim before the length filter, preserve duplicate qualifying labels and sort the result without mutating the input list. | `pipeline` | `labels-order` | `IP_SK16_01_LAMBDA`<br>`IP_SK16_02_STREAM_PIPE` |
| rubric-optional | Review evidence for: Represent absence using Optional.empty rather than a made-up string or an unchecked get call. | `optional` | `labels-optional` | `IP_SK16_03_OPTIONAL` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| labels-order | Use [" elm ", "oak", " cedar", "ash", "birch", "birch"]. | [birch, birch, cedar]; input list unchanged. | `pipeline` | `IP_SK16_01_LAMBDA`<br>`IP_SK16_02_STREAM_PIPE` |
| labels-optional | Find the first cleaned label for the above list, then for ["a", " b "]. | Optional[birch], then Optional.empty. | `optional` | `IP_SK16_03_OPTIONAL` |

### Workshop material ledger — `ds.assignment.ip.material-ledger@1`

Authored 60-minute task. Source IDs: `ref-6faf9172baf75824`<br>`ref-f7af58ce8943d54b`<br>`ref-15f80f1f4bb2f1f3`<br>`ref-5469f9c870013b80`<br>`ref-f3d7a5431ab68a61`<br>`ref-517a35b992dabf40`<br>`ref-8c6eff249b686f68`<br>`ref-cc566cb126fff995`<br>`ref-7034e3454bddea79`<br>`ref-f8f42116f140d764`<br>`ref-556a1c1cc39b369a`<br>`ref-18b7de6140eaf782`. Supplemental observations: `ip-t20`<br>`ip-t04`<br>`ip-t07`<br>`ip-t17`<br>`ip-t18`<br>`ip-t11`<br>`ip-t14`<br>`ip-t15`<br>`ip-t12`<br>`ip-t06`<br>`ip-t08`<br>`ip-integrated-current`<br>`ip-integrated-mock`<br>`ip-exam-workflow`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| model | Separate immutable key, entry, parser, aggregation and CLI responsibilities; validate key grammar and nonnegative bounded entry units. | `IP_SK04_01_MODEL_CLASS`<br>`IP_SK04_02_CONSTRUCTOR_STATE`<br>`IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK18_01_MODERN_MODEL` | `rubric-model` | `ledger-model`<br>`ledger-cli` |
| equality | Use both key fields in equals/hashCode; equal independently constructed keys must aggregate together without treating a hash collision as equality. | `IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_02_HASH_CONTRACT`<br>`IP_SK11_03_EQUALITY_EDGE` | `rubric-equality` | `ledger-model`<br>`ledger-totals` |
| parser | Read all lines into model objects; reject malformed data with its physical line number and do not silently repair it. | `IP_SK14_02_STRING_PARSE`<br>`IP_SK15_01_PARSE_FILE`<br>`IP_SK12_02_EXCEPTION_FLOW` | `rubric-parser` | `ledger-parser` |
| processing | Sum units per value key using long totals and produce the specified deterministic area/material order. | `IP_SK07_02_API_USE`<br>`IP_SK06_03_COLLECTION_SEMANTICS` | `rubric-processing` | `ledger-totals` |
| cli | Implement the declared argument/status/output contract and resource ownership; malformed input must leave an existing output unchanged. | `IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS` | `rubric-cli` | `ledger-cli` |
| testing | Use component tests for equality, model validation, repeated keys, empty data, malformed input, resource boundaries and CLI status; prioritize a working vertical slice before optional cleanup. | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK20_02_EXAM_PRIORITIZE` | `rubric-testing` | `ledger-model`<br>`ledger-parser`<br>`ledger-totals`<br>`ledger-cli` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-model | Review evidence for: Separate immutable key, entry, parser, aggregation and CLI responsibilities; validate key grammar and nonnegative bounded entry units. | `model` | `ledger-model`<br>`ledger-cli` | `IP_SK04_01_MODEL_CLASS`<br>`IP_SK04_02_CONSTRUCTOR_STATE`<br>`IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK18_01_MODERN_MODEL` |
| rubric-equality | Review evidence for: Use both key fields in equals/hashCode; equal independently constructed keys must aggregate together without treating a hash collision as equality. | `equality` | `ledger-model`<br>`ledger-totals` | `IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_02_HASH_CONTRACT`<br>`IP_SK11_03_EQUALITY_EDGE` |
| rubric-parser | Review evidence for: Read all lines into model objects; reject malformed data with its physical line number and do not silently repair it. | `parser` | `ledger-parser` | `IP_SK14_02_STRING_PARSE`<br>`IP_SK15_01_PARSE_FILE`<br>`IP_SK12_02_EXCEPTION_FLOW` |
| rubric-processing | Review evidence for: Sum units per value key using long totals and produce the specified deterministic area/material order. | `processing` | `ledger-totals` | `IP_SK07_02_API_USE`<br>`IP_SK06_03_COLLECTION_SEMANTICS` |
| rubric-cli | Review evidence for: Implement the declared argument/status/output contract and resource ownership; malformed input must leave an existing output unchanged. | `cli` | `ledger-cli` | `IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS` |
| rubric-testing | Review evidence for: Use component tests for equality, model validation, repeated keys, empty data, malformed input, resource boundaries and CLI status; prioritize a working vertical slice before optional cleanup. | `testing` | `ledger-model`<br>`ledger-parser`<br>`ledger-totals`<br>`ledger-cli` | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK20_02_EXAM_PRIORITIZE` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| ledger-model | Compare distinct EAST/resin keys, null, unrelated/different keys; reject invalid model fields. | Equal logical keys compare equal and share hashes; invalid fields are rejected; different keys stay different. | `model`<br>`equality`<br>`testing` | `IP_SK04_01_MODEL_CLASS`<br>`IP_SK04_02_CONSTRUCTOR_STATE`<br>`IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK18_01_MODERN_MODEL`<br>`IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_02_HASH_CONTRACT`<br>`IP_SK11_03_EQUALITY_EDGE`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| ledger-parser | Parse the sample and reject malformed second lines, signs, leading zeros and out-of-range units. | Four entries on the sample; checked error identifies the failing 1-based line. | `parser`<br>`testing` | `IP_SK14_02_STRING_PARSE`<br>`IP_SK15_01_PARSE_FILE`<br>`IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| ledger-totals | Process sample data with repeated EAST/resin keys and an empty dataset. | EAST/resin=11, EAST/wire=0, WEST/wire=9; empty dataset has zero totals. | `processing`<br>`equality`<br>`testing` | `IP_SK11_01_EQUALS_IMPL`<br>`IP_SK11_02_HASH_CONTRACT`<br>`IP_SK11_03_EQUALITY_EDGE`<br>`IP_SK07_02_API_USE`<br>`IP_SK06_03_COLLECTION_SEMANTICS`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| ledger-cli | Run with two paths, wrong argument count, missing input and malformed input with existing output. | Status 0 and Wrote 3 totals. on success; 2 for argument count; 1 for I/O/format errors; malformed input preserves output. | `cli`<br>`model`<br>`testing` | `IP_SK04_01_MODEL_CLASS`<br>`IP_SK04_02_CONSTRUCTOR_STATE`<br>`IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK18_01_MODERN_MODEL`<br>`IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK08_03_TESTABILITY`<br>`IP_SK20_02_EXAM_PRIORITIZE` |

### Coordinate a parallel note index — `ds.assignment.ip.note-index@1`

Authored 60-minute task. Source IDs: `ref-15f80f1f4bb2f1f3`<br>`ref-f7af58ce8943d54b`<br>`ref-ea0f1a1b1d127fd4`<br>`ref-8c6eff249b686f68`<br>`ref-cc566cb126fff995`<br>`ref-556a1c1cc39b369a`<br>`ref-18b7de6140eaf782`. Supplemental observations: `ip-t20`<br>`ip-t17`<br>`ip-t07`<br>`ip-t19`<br>`ip-t15`<br>`ip-t08`<br>`ip-integrated-current`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| design | Separate token validation, shared counter, per-batch Runnable, coordinator and CLI; copy/validate batches before starting workers. | `IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK07_01_COMPOSE_MODEL` | `rubric-design` | `index-isolation` |
| lifecycle | Call Thread.start for every worker and join every worker before returning totals; distinguish start from a direct run call and propagate interruption without claiming completion, including an already-interrupted coordinator before workers start. | `IP_SK19_01_THREAD_RUN` | `rubric-lifecycle` | `index-counts`<br>`index-race` |
| atomicity | Use the same shared counter monitor for atomic read-modify-write and snapshot; explain a lost-update interleaving and avoid claiming a fixed schedule. | `IP_SK19_02_SYNC` | `rubric-atomicity` | `index-counts`<br>`index-isolation`<br>`index-race` |
| io | Read validated UTF-8 token files with owned resource cleanup and print one sorted token=count line per token after completion. | `IP_SK15_01_PARSE_FILE`<br>`IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS` | `rubric-io` | `index-cli` |
| tests | Test multiple batches, empty batches, repeated tokens, malformed input, snapshot isolation and CLI failures; use reasoning about synchronization rather than repeated lucky runs as the guarantee. | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` | `rubric-tests` | `index-counts`<br>`index-isolation`<br>`index-cli`<br>`index-race` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-design | Review evidence for: Separate token validation, shared counter, per-batch Runnable, coordinator and CLI; copy/validate batches before starting workers. | `design` | `index-isolation` | `IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK07_01_COMPOSE_MODEL` |
| rubric-lifecycle | Review evidence for: Call Thread.start for every worker and join every worker before returning totals; distinguish start from a direct run call and propagate interruption without claiming completion, including an already-interrupted coordinator before workers start. | `lifecycle` | `index-counts`<br>`index-race` | `IP_SK19_01_THREAD_RUN` |
| rubric-atomicity | Review evidence for: Use the same shared counter monitor for atomic read-modify-write and snapshot; explain a lost-update interleaving and avoid claiming a fixed schedule. | `atomicity` | `index-counts`<br>`index-isolation`<br>`index-race` | `IP_SK19_02_SYNC` |
| rubric-io | Review evidence for: Read validated UTF-8 token files with owned resource cleanup and print one sorted token=count line per token after completion. | `io` | `index-cli` | `IP_SK15_01_PARSE_FILE`<br>`IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS` |
| rubric-tests | Review evidence for: Test multiple batches, empty batches, repeated tokens, malformed input, snapshot isolation and CLI failures; use reasoning about synchronization rather than repeated lucky runs as the guarantee. | `tests` | `index-counts`<br>`index-isolation`<br>`index-cli`<br>`index-race` | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| index-counts | Process batches [lumen,ink,lumen], [ink,glow], [glow,lumen]. | glow=2, ink=2, lumen=3 after all joins; no worker execution order is specified. | `lifecycle`<br>`atomicity`<br>`tests` | `IP_SK19_01_THREAD_RUN`<br>`IP_SK19_02_SYNC`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| index-isolation | Change a returned snapshot; reject malformed or null tokens before starting workers; process no batches. | Counter remains unchanged; invalid data is rejected; no batches yield an empty completed map. | `design`<br>`atomicity`<br>`tests` | `IP_SK17_01_DOMAIN_MODEL`<br>`IP_SK17_02_DECOMPOSE`<br>`IP_SK07_01_COMPOSE_MODEL`<br>`IP_SK19_02_SYNC`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| index-cli | Read authored note files, verify sorted output, then try missing file, bad token and no arguments. | Only complete sorted totals print on success; status 1 for I/O/format failure and 2 for missing arguments. | `io`<br>`tests` | `IP_SK15_01_PARSE_FILE`<br>`IP_SK15_02_WRITE_FILE`<br>`IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK20_01_EXAM_SYNTHESIS`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |
| index-race | Explain the conceptual two-increment unsynchronized counter and direct run versus start. | Two reads of 0 followed by two writes of 1 lose one update; serial read/write pairs yield 2. No unique schedule is promised, and join alone does not protect the increment. | `atomicity`<br>`lifecycle`<br>`tests` | `IP_SK19_01_THREAD_RUN`<br>`IP_SK19_02_SYNC`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES`<br>`IP_SK20_02_EXAM_PRIORITIZE` |

### Validate readings before exporting a file — `ds.assignment.ip.reading-export@1`

Authored 30-minute task. Source IDs: `ref-8c6eff249b686f68`<br>`ref-cc566cb126fff995`<br>`ref-517a35b992dabf40`<br>`ref-7034e3454bddea79`<br>`ref-5469f9c870013b80`<br>`ref-18b7de6140eaf782`. Supplemental observations: `ip-t15`<br>`ip-t14`<br>`ip-t12`<br>`ip-t18`<br>`ip-t08`.

| Requirement | Observable obligation | Requirement skill IDs | Rubric component IDs | Reference test IDs |
|---|---|---|---|---|
| parse | Validate each line, construct Reading values and reject malformed syntax/range with its physical line number. | `IP_SK15_01_PARSE_FILE`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK18_01_MODERN_MODEL` | `rubric-parse` | `reading-output`<br>`reading-malformed` |
| ownership | Keep borrowed readers open; close owned file readers/writers using try-with-resources and propagate I/O failures. | `IP_SK15_03_RESOURCE_SAFETY` | `rubric-ownership` | `reading-resources` |
| output | Validate the whole input before opening output, then write exact uppercase CHANNEL:value lines in source order. | `IP_SK15_02_WRITE_FILE` | `rubric-output` | `reading-output` |
| tests | Test malformed second line, empty input, range boundaries, underlying I/O failure and preservation of a pre-existing destination on parse failure. | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` | `rubric-tests` | `reading-malformed`<br>`reading-resources` |

| Rubric component | Review criterion | Requirement IDs | Test IDs | Mapped skill IDs |
|---|---|---|---|---|
| rubric-parse | Review evidence for: Validate each line, construct Reading values and reject malformed syntax/range with its physical line number. | `parse` | `reading-output`<br>`reading-malformed` | `IP_SK15_01_PARSE_FILE`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK18_01_MODERN_MODEL` |
| rubric-ownership | Review evidence for: Keep borrowed readers open; close owned file readers/writers using try-with-resources and propagate I/O failures. | `ownership` | `reading-resources` | `IP_SK15_03_RESOURCE_SAFETY` |
| rubric-output | Review evidence for: Validate the whole input before opening output, then write exact uppercase CHANNEL:value lines in source order. | `output` | `reading-output` | `IP_SK15_02_WRITE_FILE` |
| rubric-tests | Review evidence for: Test malformed second line, empty input, range boundaries, underlying I/O failure and preservation of a pre-existing destination on parse failure. | `tests` | `reading-malformed`<br>`reading-resources` | `IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` |


| Reference test | Specified case | Expected behavior | Requirement IDs | Mapped skill IDs |
|---|---|---|---|---|
| reading-output | Convert north\|12, south\|-4, north\|0 on three lines. | NORTH:12\nSOUTH:-4\nNORTH:0\n. | `parse`<br>`output` | `IP_SK15_01_PARSE_FILE`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK18_01_MODERN_MODEL`<br>`IP_SK15_02_WRITE_FILE` |
| reading-malformed | Try blank line 2, extra separators, invalid name, non-canonical integer and out-of-range number. | ReadingFormatException with the failing line number; malformed input does not truncate output. | `parse`<br>`tests` | `IP_SK15_01_PARSE_FILE`<br>`IP_SK14_02_STRING_PARSE`<br>`IP_SK12_02_EXCEPTION_FLOW`<br>`IP_SK18_01_MODERN_MODEL`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` |
| reading-resources | Use a close-tracking Reader and a Reader that throws IOException; read/write a temporary UTF-8 file. | Borrowed readers remain open, I/O failure propagates, owned operations complete and resources close. | `ownership`<br>`tests` | `IP_SK15_03_RESOURCE_SAFETY`<br>`IP_SK08_01_WRITE_TESTS`<br>`IP_SK08_02_TEST_BOUNDARIES` |

## Optional mental-map cues

These cues add explanations only. Canonical containment and prerequisite edges remain generated from the pack.

| Cue | Topic / skills | Message | Supplemental evidence |
|---|---|---|---|
| `ds.cue.ip.t03.copy@1` | IP_T03_METHODS_SCOPE<br>`IP_SK03_04_PASS_BY_VALUE` | The parameter receives a copied value. Mutating a shared object differs from assigning that local parameter a new reference. | `ip-t03` |
| `ds.cue.ip.t05.alias@1` | IP_T05_ARRAYS_RECURSION<br>`IP_SK05_03_ARRAY_ALIAS` | Two variables can refer to one array. Copying the reference does not copy the elements; inspect which object each mutation reaches. | `ip-t05` |
| `ds.cue.ip.t10.dispatch@1` | IP_T10_POLYMORPHISM_BINDING<br>`IP_SK10_02_DISPATCH_TRACE` | Select the overload from declared types, then dispatch an overridable instance method using the receiver’s runtime class. | `ip-t10` |
| `ds.cue.ip.t11.hash@1` | IP_T11_EQUALITY_HASHING<br>`IP_SK11_02_HASH_CONTRACT` | Equal values require matching hashes; a matching hash does not prove equality. Keep value-key identity stable while stored in a hash collection. | `ip-t11` |
| `ds.cue.ip.t15.ownership@1` | IP_T15_IO_PARSING<br>`IP_SK15_03_RESOURCE_SAFETY` | Name the resource owner. Borrowed readers stay with the caller; the boundary that opens a file closes it, including on failure. | `ip-t15` |
| `ds.cue.ip.t17.boundaries@1` | IP_T17_PROGRAM_DESIGN<br>`IP_SK17_02_DECOMPOSE` | Keep parsing, processing and UI responsibilities distinct so each required behavior has a testable boundary. | `ip-t17` |
| `ds.cue.ip.t19.race@1` | IP_T19_THREADS_CONCURRENCY<br>`IP_SK19_02_SYNC` | Starting first does not guarantee finishing first. Use a common synchronization strategy for compound shared updates and wait before claiming completion. | `ip-t19` |
| `ds.cue.ip.t20.integration@1` | IP_T20_EXAM_PROGRAM_SYNTHESIS<br>`IP_SK20_01_EXAM_SYNTHESIS` | One complete program remains an integrated task. Verify each requirement with component tests or a rubric; launching it is not broad skill correctness. | `ip-t20` |

## Canonical assessment policy inventory

Pack v1.0.1 contains **7 IP assessments**, **7 integrated whole-assessment mappings**, and **38 mappings with UNKNOWN locators**. Supplemental physical-page review never replaces those canonical UNKNOWN values. Each whole mapping retains `REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE` and cannot award child-skill correctness from whole-task completion.

| Assessment | Era | Status | Whole mapping | Granularity | Component-evidence policy | UNKNOWN mappings |
|---|---|---|---|---|---|---|
| ASM_IP_RESIT_2024 | RECENT | OFFICIAL_ASSESSMENT | IP_RESIT_2024_WHOLE | INTEGRATED_MULTI_SKILL | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | 5 |
| ASM_IP_MOCK_2024 | CURRENT | OFFICIAL_PRACTICE_MATERIAL | IP_MOCK_2024_WHOLE | INTEGRATED_MULTI_SKILL | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | 5 |
| ASM_IP_MOCK_2023 | RECENT | OFFICIAL_PRACTICE_MATERIAL | IP_MOCK_2023_WHOLE | INTEGRATED_MULTI_SKILL | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | 6 |
| ASM_IP_END_2024 | CURRENT | OFFICIAL_ASSESSMENT | IP_END_2024_WHOLE | INTEGRATED_MULTI_SKILL | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | 5 |
| ASM_IP_END_2023 | RECENT | OFFICIAL_ASSESSMENT | IP_END_2023_WHOLE | INTEGRATED_MULTI_SKILL | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | 5 |
| ASM_IP_END_2021 | HISTORICAL | OFFICIAL_ASSESSMENT | IP_END_2021_WHOLE | INTEGRATED_MULTI_SKILL | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | 6 |
| ASM_IP_END_2020 | HISTORICAL | OFFICIAL_ASSESSMENT | IP_END_2020_WHOLE | INTEGRATED_MULTI_SKILL | REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE | 6 |

Source authority, filenames, exact physical pages inspected and blocked claims are recorded in [ip-source-review.md](ip-source-review.md). This inventory makes no PASS claim for browser behavior, tests, source-copy review or production bundles; use the final status report’s executed evidence.
