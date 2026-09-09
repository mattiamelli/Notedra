# Step 7 — Complete Reasoning & Logic

**COMPLETE — Step 7 acceptance passed on 9 September 2026.** All 45 canonical skills have teaching and flashcards. All required command gates and isolated Chromium production scenarios passed. No known correctness defect or unresolved critical acceptance failure remains. Environment and source-verification limits are recorded below.

## Baseline and protected boundaries

Started from clean `59e190a` (Step 6), following Step 5 `da12065`. Before any edits, all required baseline gates passed: content/manifest/policy validation, academic/student/topic projection checks, original Practice/pilot/CO validators, CO bundle inspection, 614 tests in 25 files, strict typecheck, production build and diff whitespace check. The baseline log is `/tmp/ds-step7-baseline.log`. Initial JS was 470,777 bytes (124,236 gzip).

Checkpoint `4160ae1` adds the verified typed logic/finite models and 116 model/reference/boundary tests. Implementation checkpoint `9b62153` completes the content, Practice integration, tools, UI and guards. The final documentation commit is the HEAD carrying this report; use `git log -3 --oneline` to resolve that commit without a self-referential hash. Final clean status is checked after that commit.

The protected v1.0.1 pack and schema 1.1.0, generated academic/reference/topic projections, published T01 lesson and eight cards, all CO sources/content/graders/locks, all Assembly sources/examples and student schema 1 / IndexedDB version 1 remain byte-identical to the baseline. v1.0.0 is unused. No new dependency or lockfile change. The old six exercise/grader bindings and 28 Step 6 additions remain intact.

## Exact canonical scope and factual capabilities

Confirmed directly from the normalized pack: **9 topics, 29 subtopics, 45 atomic skills**. All nine topics are CURRENT_CORE. No taxonomy was created, merged, reconstructed or reordered. Topic/skill prerequisites remain exactly the generated canonical relationships.

| Topic | Lesson | Blocks | Cards | Graded items | Guided activities | Workspace |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `RL_T01_PROP_LOGIC` | `ds.lesson.rl@1` | 9 | 8 | 9 | 2 | Propositional logic workspace |
| `RL_T02_FOL` | `ds.lesson.rl.t02@1` | 9 | 9 | 4 | 3 | Finite first-order structure workspace |
| `RL_T03_PROOF_METHODS` | `ds.lesson.rl.t03@1` | 10 | 9 | 1 | 4 | Proof planning workspace |
| `RL_T04_INDUCTION_RECURSION` | `ds.lesson.rl.t04@1` | 9 | 10 | 2 | 4 | Recursion and induction workspace |
| `RL_T05_TREES_GRAPHS` | `ds.lesson.rl.t05@1` | 8 | 7 | 3 | 3 | Tree and graph workspace |
| `RL_T06_SET_THEORY` | `ds.lesson.rl.t06@1` | 9 | 8 | 5 | 2 | Finite sets workspace |
| `RL_T07_FUNCTIONS_RELATIONS` | `ds.lesson.rl.t07@1` | 8 | 8 | 3 | 2 | Finite functions and relations workspace |
| `RL_T08_LIMITS_COUNTABILITY` | `ds.lesson.rl.t08@1` | 8 | 5 | 1 | 2 | Guided self-check only |
| `RL_T09_TRANSFER_CONSTRAINT_PUZZLES` | `ds.lesson.rl.t09@1` | 6 | 3 | 1 | 1 | Guided self-check only |

Eight new lessons have 67 blocks and 59 cards; the preserved T01 adds nine blocks and eight cards. Total R&L: **9 lessons, 76 blocks, 67 cards, 29 graded items (27 new + 2 existing), 23 guided activities, seven workspaces (six calculators + proof planning)**. Every skill has meaningful non-introduction/non-recap teaching and at least one card. Zero uncovered skills. Across the whole app there are 154 cards and 61 exact/controlled exercises. Reading and exploration are not completion or evidence.

## Every skill: teaching, cards, prerequisites and practice classification

A = reliably deterministic; B = structured/multiple valid answers; C = open/rubric; D = specialized tool; E = unsafe to autograde. Primary classifications are A=13, B=16, C=16, D=0, E=0. Tools supplement these categories; a B/C skill may also have a bounded exact subproblem. An exact subproblem never certifies the whole skill or its proof.

| Skill | Teaching blocks (excluding intro/recap) | Cards | Class | Prerequisite skills |
| --- | --- | --- | --- | --- |
| `RL_SK01_01_CONNECTIVE` | ds.block.rl.connectives | ds.card.rl.or | A | None |
| `RL_SK01_02_NEC_SUFF` | ds.block.rl.connectives; ds.block.rl.pitfall | ds.card.rl.necessary | A | None |
| `RL_SK01_03_TRUTH_TABLE` | ds.block.rl.table; ds.block.rl.demorgan; ds.block.rl.forms | ds.card.rl.rows | A | None |
| `RL_SK01_04_PROP_VALIDITY` | ds.block.rl.validity; ds.block.rl.pitfall | ds.card.rl.validity | A | RL_SK01_03_TRUTH_TABLE |
| `RL_SK01_05_EQUIV` | ds.block.rl.demorgan; ds.block.rl.forms | ds.card.rl.equivalence | A | RL_SK01_03_TRUTH_TABLE |
| `RL_SK01_06_NORMAL_FORM` | ds.block.rl.forms | ds.card.rl.normal | B | RL_SK01_01_CONNECTIVE |
| `RL_SK01_07_SAT_PROP` | ds.block.rl.sat; ds.block.rl.pitfall | ds.card.rl.sat; ds.card.rl.explosion | A | None |
| `RL_SK02_01_NL_TO_FOL` | ds.block.rl.t02.vocabulary; ds.block.rl.t02.translation; ds.block.rl.t02.scope | ds.card.rl.t02.nl; ds.card.rl.t02.restrict | B | RL_SK01_01_CONNECTIVE |
| `RL_SK02_02_FOL_TO_NL` | ds.block.rl.t02.vocabulary; ds.block.rl.t02.translation; ds.block.rl.t02.scope | ds.card.rl.t02.dependency | C | None |
| `RL_SK02_03_NEGATE_FOL` | ds.block.rl.t02.negation; ds.block.rl.t02.scope | ds.card.rl.t02.negate | B | RL_SK02_01_NL_TO_FOL |
| `RL_SK02_04_TARSKI` | ds.block.rl.t02.finite; ds.block.rl.t02.tarski; ds.block.rl.t02.scope | ds.card.rl.t02.world | B | None |
| `RL_SK02_05_FORMAL_STRUCTURE` | ds.block.rl.t02.vocabulary; ds.block.rl.t02.finite; ds.block.rl.t02.tarski; ds.block.rl.t02.countermodel; ds.block.rl.t02.scope | ds.card.rl.t02.structure; ds.card.rl.t02.vacuous | B | RL_SK02_01_NL_TO_FOL |
| `RL_SK02_06_COUNTERMODEL` | ds.block.rl.t02.countermodel; ds.block.rl.t02.scope | ds.card.rl.t02.countermodel; ds.card.rl.t02.witness | B | RL_SK02_05_FORMAL_STRUCTURE |
| `RL_SK03_01_GENERALIZE` | ds.block.rl.t03.direct; ds.block.rl.t03.existence; ds.block.rl.t03.obligations | ds.card.rl.t03.arbitrary; ds.card.rl.t03.witness | C | None |
| `RL_SK03_02_DIRECT` | ds.block.rl.t03.direct; ds.block.rl.t03.existence; ds.block.rl.t03.obligations | ds.card.rl.t03.witness; ds.card.rl.t03.direct | C | RL_SK03_01_GENERALIZE |
| `RL_SK03_03_CASES` | ds.block.rl.t03.cases; ds.block.rl.t03.obligations | ds.card.rl.t03.cases | C | None |
| `RL_SK03_04_CONTRADICTION` | ds.block.rl.t03.contradiction; ds.block.rl.t03.existence; ds.block.rl.t03.obligations | ds.card.rl.t03.contradiction | C | RL_SK02_03_NEGATE_FOL |
| `RL_SK03_05_CONTRAPOSITIVE` | ds.block.rl.t03.contrapositive; ds.block.rl.t03.obligations | ds.card.rl.t03.contra | C | RL_SK01_02_NEC_SUFF; RL_SK03_01_GENERALIZE |
| `RL_SK03_06_IDENTIFY_PROOF` | ds.block.rl.t03.identify; ds.block.rl.t03.debug; ds.block.rl.t03.obligations | ds.card.rl.t03.identify | C | None |
| `RL_SK03_07_DEBUG_PROOF` | ds.block.rl.t03.identify; ds.block.rl.t03.debug; ds.block.rl.t03.obligations | ds.card.rl.t03.debug; ds.card.rl.t03.circular | C | None |
| `RL_SK04_01_DEFINE_RECURSIVE` | ds.block.rl.t04.recurrence; ds.block.rl.t04.language; ds.block.rl.t04.pitfalls | ds.card.rl.t04.definition | B | None |
| `RL_SK04_02_EVAL_RECURSIVE` | ds.block.rl.t04.recurrence; ds.block.rl.t04.pitfalls | ds.card.rl.t04.evaluation | A | None |
| `RL_SK04_03_INDUCTION` | ds.block.rl.t04.induction; ds.block.rl.t04.setup; ds.block.rl.t04.pitfalls | ds.card.rl.t04.ih; ds.card.rl.t04.finite-check | C | RL_SK03_01_GENERALIZE; RL_SK03_02_DIRECT |
| `RL_SK04_04_INDUCTION_SETUP` | ds.block.rl.t04.setup; ds.block.rl.t04.pitfalls | ds.card.rl.t04.setup; ds.card.rl.t04.step-size | C | None |
| `RL_SK04_05_RECURSIVE_SET` | ds.block.rl.t04.language; ds.block.rl.t04.structural; ds.block.rl.t04.pitfalls | ds.card.rl.t04.exclusion | B | None |
| `RL_SK04_06_STRUCT_INDUCTION` | ds.block.rl.t04.structural; ds.block.rl.t04.pitfalls | ds.card.rl.t04.constructor | C | RL_SK04_03_INDUCTION; RL_SK04_05_RECURSIVE_SET |
| `RL_SK04_07_INVARIANT` | ds.block.rl.t04.invariant; ds.block.rl.t04.pitfalls | ds.card.rl.t04.invariant; ds.card.rl.t04.termination | C | RL_SK03_02_DIRECT; RL_SK04_03_INDUCTION |
| `RL_SK05_01_TREE_CONSTRUCT` | ds.block.rl.t05.tree; ds.block.rl.t05.pitfalls | ds.card.rl.t05.construct | B | None |
| `RL_SK05_02_TREE_TRAVERSE` | ds.block.rl.t05.tree; ds.block.rl.t05.traverse; ds.block.rl.t05.pitfalls | ds.card.rl.t05.traversal; ds.card.rl.t05.height | A | None |
| `RL_SK05_03_TREE_FUNC` | ds.block.rl.t05.recursive-function; ds.block.rl.t05.pitfalls | ds.card.rl.t05.tree-function | B | RL_SK04_01_DEFINE_RECURSIVE; RL_SK05_01_TREE_CONSTRUCT |
| `RL_SK05_04_GRAPH_CONSTRUCT` | ds.block.rl.t05.graph; ds.block.rl.t05.topology; ds.block.rl.t05.pitfalls | ds.card.rl.t05.dag-build | B | None |
| `RL_SK05_05_TOPO` | ds.block.rl.t05.topology; ds.block.rl.t05.pitfalls | ds.card.rl.t05.topo; ds.card.rl.t05.cycle | B | None |
| `RL_SK06_01_SET_CALC` | ds.block.rl.t06.membership; ds.block.rl.t06.operations; ds.block.rl.t06.pitfalls | ds.card.rl.t06.membership; ds.card.rl.t06.complement | A | None |
| `RL_SK06_02_VENN` | ds.block.rl.t06.venn; ds.block.rl.t06.pitfalls | ds.card.rl.t06.venn | A | None |
| `RL_SK06_03_POWER_CART` | ds.block.rl.t06.powerset; ds.block.rl.t06.pitfalls | ds.card.rl.t06.power; ds.card.rl.t06.product; ds.card.rl.t06.empty | A | None |
| `RL_SK06_04_SET_PROOF` | ds.block.rl.t06.proof; ds.block.rl.t06.pitfalls | ds.card.rl.t06.proof | C | RL_SK03_01_GENERALIZE; RL_SK06_01_SET_CALC |
| `RL_SK06_05_SET_COUNTER` | ds.block.rl.t06.counterexample; ds.block.rl.t06.pitfalls | ds.card.rl.t06.counter | B | None |
| `RL_SK07_01_WELL_DEFINED` | ds.block.rl.t07.well-defined; ds.block.rl.t07.mapping; ds.block.rl.t07.pitfalls | ds.card.rl.t07.function; ds.card.rl.t07.image | A | RL_SK06_03_POWER_CART |
| `RL_SK07_02_CONSTRUCT_FUNC` | ds.block.rl.t07.construct; ds.block.rl.t07.pitfalls | ds.card.rl.t07.construct | B | None |
| `RL_SK07_03_INJ_SURJ` | ds.block.rl.t07.mapping; ds.block.rl.t07.construct; ds.block.rl.t07.pitfalls | ds.card.rl.t07.injective; ds.card.rl.t07.surjective | B | RL_SK07_01_WELL_DEFINED |
| `RL_SK07_04_REL_PROPS` | ds.block.rl.t07.relations; ds.block.rl.t07.relation-example; ds.block.rl.t07.pitfalls | ds.card.rl.t07.equivalence; ds.card.rl.t07.transitive; ds.card.rl.t07.vacuous | B | RL_SK06_03_POWER_CART |
| `RL_SK08_01_NUMBER_SETS` | ds.block.rl.t08.numbers; ds.block.rl.t08.pitfalls | ds.card.rl.t08.hierarchy | A | None |
| `RL_SK08_02_COUNTABLE` | ds.block.rl.t08.listing; ds.block.rl.t08.rational; ds.block.rl.t08.cantor; ds.block.rl.t08.pitfalls | ds.card.rl.t08.countability; ds.card.rl.t08.finite | C | RL_SK07_03_INJ_SURJ; RL_SK08_01_NUMBER_SETS |
| `RL_SK08_03_LIMITS` | ds.block.rl.t08.cantor; ds.block.rl.t08.limits; ds.block.rl.t08.pitfalls | ds.card.rl.t08.diagonal; ds.card.rl.t08.paradox | C | None |
| `RL_SK09_01_TRANSFER` | ds.block.rl.t09.process; ds.block.rl.t09.docks; ds.block.rl.t09.uniqueness; ds.block.rl.t09.pitfalls | ds.card.rl.t09.model; ds.card.rl.t09.elimination; ds.card.rl.t09.nonunique | C | RL_SK01_04_PROP_VALIDITY; RL_SK03_03_CASES |

| Skill | Classification rationale | Exact item IDs | Guided IDs | Tool |
| --- | --- | --- | --- | --- |
| `RL_SK01_01_CONNECTIVE` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-implication-rows; ds.practice.rl-biconditional-rows | ds.guided.rl.t01.normal-form | proposition |
| `RL_SK01_02_NEC_SUFF` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-necessary-rows | ds.guided.rl.t01.argument | proposition |
| `RL_SK01_03_TRUTH_TABLE` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-conjunction; ds.practice.rl-not-or | ds.guided.rl.t01.normal-form | proposition |
| `RL_SK01_04_PROP_VALIDITY` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-argument-counterrows | ds.guided.rl.t01.argument | proposition |
| `RL_SK01_05_EQUIV` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-equivalence-rows | ds.guided.rl.t01.normal-form | proposition |
| `RL_SK01_06_NORMAL_FORM` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-normal-form-check | ds.guided.rl.t01.normal-form | proposition |
| `RL_SK01_07_SAT_PROP` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-satisfying-rows | ds.guided.rl.t01.argument | proposition |
| `RL_SK02_01_NL_TO_FOL` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t02.translation | finite-model |
| `RL_SK02_02_FOL_TO_NL` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t02.translation | finite-model |
| `RL_SK02_03_NEGATE_FOL` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-negation-witnesses | ds.guided.rl.t02.translation | finite-model |
| `RL_SK02_04_TARSKI` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t02.world | finite-model |
| `RL_SK02_05_FORMAL_STRUCTURE` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-forall-exists; ds.practice.rl-exists-forall | ds.guided.rl.t02.world | finite-model |
| `RL_SK02_06_COUNTERMODEL` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-finite-countermodel | ds.guided.rl.t02.countermodel | finite-model |
| `RL_SK03_01_GENERALIZE` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t03.direct | proof |
| `RL_SK03_02_DIRECT` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t03.direct | proof |
| `RL_SK03_03_CASES` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t03.cases | proof |
| `RL_SK03_04_CONTRADICTION` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t03.contradiction | proof |
| `RL_SK03_05_CONTRAPOSITIVE` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t03.contrapositive | proof |
| `RL_SK03_06_IDENTIFY_PROOF` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t03.cases; ds.guided.rl.t03.contrapositive | proof |
| `RL_SK03_07_DEBUG_PROOF` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | ds.practice.rl-arbitrary-step | ds.guided.rl.t03.contradiction | proof |
| `RL_SK04_01_DEFINE_RECURSIVE` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t04.recursion | induction |
| `RL_SK04_02_EVAL_RECURSIVE` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-recurrence-affine; ds.practice.rl-recurrence-two-base | ds.guided.rl.t04.recursion | induction |
| `RL_SK04_03_INDUCTION` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t04.induction | induction |
| `RL_SK04_04_INDUCTION_SETUP` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t04.induction | induction |
| `RL_SK04_05_RECURSIVE_SET` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t04.structural | induction |
| `RL_SK04_06_STRUCT_INDUCTION` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t04.structural | induction |
| `RL_SK04_07_INVARIANT` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t04.invariant | induction |
| `RL_SK05_01_TREE_CONSTRUCT` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t05.tree | tree-graph |
| `RL_SK05_02_TREE_TRAVERSE` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-preorder-third | ds.guided.rl.t05.tree | tree-graph |
| `RL_SK05_03_TREE_FUNC` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-recursive-tree-cost | ds.guided.rl.t05.function | tree-graph |
| `RL_SK05_04_GRAPH_CONSTRUCT` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t05.graph | tree-graph |
| `RL_SK05_05_TOPO` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-topological-count | ds.guided.rl.t05.graph | tree-graph |
| `RL_SK06_01_SET_CALC` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-set-difference; ds.practice.rl-nested-membership | None | sets |
| `RL_SK06_02_VENN` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-venn-region | None | sets |
| `RL_SK06_03_POWER_CART` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-power-product; ds.practice.rl-cartesian-filter | None | sets |
| `RL_SK06_04_SET_PROOF` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t06.proof | sets |
| `RL_SK06_05_SET_COUNTER` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t06.counterexample | sets |
| `RL_SK07_01_WELL_DEFINED` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-finite-function-total | None | functions-relations |
| `RL_SK07_02_CONSTRUCT_FUNC` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | None | ds.guided.rl.t07.construct | functions-relations |
| `RL_SK07_03_INJ_SURJ` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-mapping-properties | ds.guided.rl.t07.construct | functions-relations |
| `RL_SK07_04_REL_PROPS` | Constructions, equivalent representations or broader property justifications can have multiple valid answers. Check requirements with an unscored rubric; linked bounded drills or tools check only their declared finite subproblem. | ds.practice.rl-relation-properties | ds.guided.rl.t07.relations | functions-relations |
| `RL_SK08_01_NUMBER_SETS` | Fixed, explicitly bounded instances have unique independently checked answers. Automatic feedback covers the stated item, not aggregate mastery or every possible task in this skill. | ds.practice.rl-number-membership | None | None |
| `RL_SK08_02_COUNTABLE` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t08.listing; ds.guided.rl.t08.diagonal | None |
| `RL_SK08_03_LIMITS` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | None | ds.guided.rl.t08.diagonal | None |
| `RL_SK09_01_TRANSFER` | The central skill requires open reasoning, a proof or an explanation. Guided work is unscored and not stored as academic evidence; any linked bounded answer check does not grade the justification. | ds.practice.rl-dock-setting | ds.guided.rl.constraint-docks | None |

## Exact graded-practice inventory

All new items use `rl-exact@1` through the existing PracticeService and StudentRepository. References are independently checked without importing the grader/model under test. Responses are only integers, exact binary rows or bounded flat integer sets. Set order/duplicates normalize mathematically; submitted text itself remains immutable. Empty/malformed/wrong/technical/unavailable outcomes stay distinct.

| Exercise @1 | Skill | Format | Reference |
| --- | --- | --- | --- |
| `ds.practice.rl-implication-rows` | `RL_SK01_01_CONNECTIVE` | binary | `1101` |
| `ds.practice.rl-biconditional-rows` | `RL_SK01_01_CONNECTIVE` | binary | `1001` |
| `ds.practice.rl-necessary-rows` | `RL_SK01_02_NEC_SUFF` | binary | `1011` |
| `ds.practice.rl-argument-counterrows` | `RL_SK01_04_PROP_VALIDITY` | binary | `0100` |
| `ds.practice.rl-equivalence-rows` | `RL_SK01_05_EQUIV` | binary | `1001` |
| `ds.practice.rl-normal-form-check` | `RL_SK01_06_NORMAL_FORM` | binary | `1111` |
| `ds.practice.rl-satisfying-rows` | `RL_SK01_07_SAT_PROP` | binary | `0100` |
| `ds.practice.rl-forall-exists` | `RL_SK02_05_FORMAL_STRUCTURE` | binary | `1` |
| `ds.practice.rl-exists-forall` | `RL_SK02_05_FORMAL_STRUCTURE` | binary | `0` |
| `ds.practice.rl-negation-witnesses` | `RL_SK02_03_NEGATE_FOL` | integer-set | `{2}` |
| `ds.practice.rl-finite-countermodel` | `RL_SK02_06_COUNTERMODEL` | binary | `110` |
| `ds.practice.rl-arbitrary-step` | `RL_SK03_07_DEBUG_PROOF` | integer-set | `{0,2,4}` |
| `ds.practice.rl-recurrence-affine` | `RL_SK04_02_EVAL_RECURSIVE` | integer | `63` |
| `ds.practice.rl-recurrence-two-base` | `RL_SK04_02_EVAL_RECURSIVE` | integer | `26` |
| `ds.practice.rl-preorder-third` | `RL_SK05_02_TREE_TRAVERSE` | integer | `1` |
| `ds.practice.rl-recursive-tree-cost` | `RL_SK05_03_TREE_FUNC` | integer | `17` |
| `ds.practice.rl-topological-count` | `RL_SK05_05_TOPO` | integer | `2` |
| `ds.practice.rl-set-difference` | `RL_SK06_01_SET_CALC` | integer-set | `{0,3,5}` |
| `ds.practice.rl-nested-membership` | `RL_SK06_01_SET_CALC` | binary | `0111` |
| `ds.practice.rl-venn-region` | `RL_SK06_02_VENN` | integer-set | `{2}` |
| `ds.practice.rl-power-product` | `RL_SK06_03_POWER_CART` | integer | `16` |
| `ds.practice.rl-cartesian-filter` | `RL_SK06_03_POWER_CART` | integer | `5` |
| `ds.practice.rl-finite-function-total` | `RL_SK07_01_WELL_DEFINED` | binary | `0` |
| `ds.practice.rl-mapping-properties` | `RL_SK07_03_INJ_SURJ` | binary | `100` |
| `ds.practice.rl-relation-properties` | `RL_SK07_04_REL_PROPS` | binary | `110` |
| `ds.practice.rl-number-membership` | `RL_SK08_01_NUMBER_SETS` | binary | `0011` |
| `ds.practice.rl-dock-setting` | `RL_SK09_01_TRANSFER` | integer | `1` |

## Guided activity inventory

Each activity has stable versioned ownership/source IDs, 3–4 labelled working-note fields, explicit rubric requirements and separate reference reasoning. Notes/reveals/reset live only in the mounted page. They are not saved Practice attempts and never yield a score, proof correctness, checked-box evidence, mastery or readiness. The UI tells learners to copy notes before leaving. Equivalent formulations and alternative satisfying constructions are allowed.

| Activity @1 | Topic | Title | Fields |
| --- | --- | --- | ---: |
| `ds.guided.rl.t01.normal-form` | `RL_T01_PROP_LOGIC` | Build and justify a normal form | 3 |
| `ds.guided.rl.t01.argument` | `RL_T01_PROP_LOGIC` | Explain validity and satisfiability separately | 3 |
| `ds.guided.rl.t02.translation` | `RL_T02_FOL` | Formalize a dependency | 3 |
| `ds.guided.rl.t02.world` | `RL_T02_FOL` | Construct and inspect a relational world | 3 |
| `ds.guided.rl.t02.countermodel` | `RL_T02_FOL` | Refute the converse-style argument | 3 |
| `ds.guided.rl.t03.direct` | `RL_T03_PROOF_METHODS` | Prove an even-sum claim | 3 |
| `ds.guided.rl.t03.cases` | `RL_T03_PROOF_METHODS` | Prove a product claim by cases | 3 |
| `ds.guided.rl.t03.contrapositive` | `RL_T03_PROOF_METHODS` | Prove by the correct contrapositive | 3 |
| `ds.guided.rl.t03.contradiction` | `RL_T03_PROOF_METHODS` | Use a contradiction and diagnose a gap | 3 |
| `ds.guided.rl.t04.recursion` | `RL_T04_INDUCTION_RECURSION` | Define and inspect a recurrence | 3 |
| `ds.guided.rl.t04.induction` | `RL_T04_INDUCTION_RECURSION` | Prove the recurrence formula | 4 |
| `ds.guided.rl.t04.structural` | `RL_T04_INDUCTION_RECURSION` | Prove a recursive-language property | 3 |
| `ds.guided.rl.t04.invariant` | `RL_T04_INDUCTION_RECURSION` | Structure a complete process proof | 4 |
| `ds.guided.rl.t05.tree` | `RL_T05_TREES_GRAPHS` | Construct and justify a constrained tree | 3 |
| `ds.guided.rl.t05.function` | `RL_T05_TREES_GRAPHS` | Define a mirror transformation | 3 |
| `ds.guided.rl.t05.graph` | `RL_T05_TREES_GRAPHS` | Construct a DAG with two valid orders | 3 |
| `ds.guided.rl.t06.proof` | `RL_T06_SET_THEORY` | Write a distributivity proof | 3 |
| `ds.guided.rl.t06.counterexample` | `RL_T06_SET_THEORY` | Build and explain a set counterexample | 3 |
| `ds.guided.rl.t07.construct` | `RL_T07_FUNCTIONS_RELATIONS` | Construct two different valid mappings | 3 |
| `ds.guided.rl.t07.relations` | `RL_T07_FUNCTIONS_RELATIONS` | Justify an equivalence relation | 4 |
| `ds.guided.rl.t08.listing` | `RL_T08_LIMITS_COUNTABILITY` | Justify an infinite listing | 3 |
| `ds.guided.rl.t08.diagonal` | `RL_T08_LIMITS_COUNTABILITY` | Explain the diagonal contradiction | 3 |
| `ds.guided.rl.constraint-docks` | `RL_T09_TRANSFER_CONSTRAINT_PUZZLES` | Explain every calibration-dock elimination | 3 |

## Interactive tools and semantic limits

- **Propositional logic workspace** (`proposition@1`): Build bounded structured formulas, enumerate valuations, compare equivalence and inspect argument counterexamples. Explicit variable order; false before true and the final variable changes fastest. Classical NOT/AND/OR/implication/biconditional. Structured input only; no arbitrary text parsing or theorem proving.
- **Finite first-order structure workspace** (`finite-model@1`): Evaluate structured sentences in a fully declared finite interpretation and inspect witnesses or counterexamples. Finite nonempty domain, named constants and explicitly interpreted predicates/relations. No invented Tarski geometry, arbitrary FOL theorem proving or automatic grading of open translations/constructions.
- **Proof planning workspace** (`proof@1`): Organize assumptions, goals and justified steps, then reveal a rubric and reference reasoning. Open proof self-check only. Fields and reference reveal do not establish correctness, receive a numeric score or persist as verified evidence.
- **Recursion and induction workspace** (`induction@1`): Evaluate a bounded recurrence and organize induction or invariant obligations. Numeric sequence evaluation is finite and deterministic. Induction, structural and invariant proofs are unscored self-checks; a finite trace is not a universal proof.
- **Tree and graph workspace** (`tree-graph@1`): Inspect ordered binary traversals and finite directed topological constraints. Explicit adjacency and left/right child structure determine meaning. Height counts edges: leaf 0, empty −1. Any proposed topological order must be checked against every edge; graph/tree construction is not compared to one drawing.
- **Finite sets workspace** (`sets@1`): Inspect finite set operations, powersets and Cartesian products. Finite explicit objects only, with set and ordered-pair structure kept distinct. Complement needs an explicit universe. Open set proofs remain unscored.
- **Finite functions and relations workspace** (`functions-relations@1`): Check finite mapping well-definedness and injection/surjection, plus relation properties. Finite declared domain/codomain and explicit ordered pairs. Function validity is checked before properties. These finite checks do not prove arbitrary infinite-domain statements.

The model limits are explicit: propositional formulas ≤8 variables,127 nodes,depth16; FOL nonempty domains ≤8 objects, unary/binary predicates/functions, total function interpretations,20,000 evaluation steps. Quantifier evidence includes assignments/witnesses/refutations and correct shadowing; no arbitrary FOL proof claim. Ambiguous variable/constant display names reject rather than silently changing meaning. UI uses a declared three-object world and trusted sentences. Recurrences use earlier values and exact safe-integer bounds (UI indices0–30). Trees are ordered binary with distinct labels and edge-height convention. Graph semantics are adjacency, not geometry; all satisfying topological orders are accepted. Tagged set/tuple/atom structures are distinct; powersets are limited to8 input elements. Function properties are unclassified until the candidate is a total single-valued mapping into its codomain. Infinite countability proofs remain unscored.

## Source authority, assessment style and uncertainty

**Original PDF pages inspected: none.** No original lecture or selected 2025 assessment PDFs were supplied in this run. Direct PDF notation, original diagrams and official page/rubric verification are NOT RUN. This limits fidelity claims to the normalized pack and explicit new authored conventions. No Tarski geometry, exact slide attribution or verbatim assessment surface was invented. No web curriculum was used.

Lecture associations remain HIGH/DOCUMENT_RANGE. RL_LEC_08 is historical (2022–23); no new lesson/card/guide/tool/item cites it. T04 uses current L6/L7 and T05 L11/L14. The taxonomy still retains its original associations.

Normalized current assessment mechanisms inspected: END2025 Q9 (invariant), Q10 (recursive set/structural induction), Q12 (recursive tree functions); RESIT2025 Q10/Q11/Q13; MID2025 Q9. These are HIGH/CURRENT but TOPIC_LEVEL_BROAD; they support topic mechanism/style and do not award child-skill evidence. Most are RUBRIC; RESIT Q13 is DETERMINISTIC in the pack. No direct inspection of those PDF pages is claimed.

The only puzzle authorization is `RL_END_2025_Q14`: HIGH, CURRENT, VERY_HIGH current-style weight, SKILL_LEVEL, source-analogue generation allowed. Its canonical validator remains RUBRIC. The new calibration-dock surface/values and final-setting item are separate authored data. All24 permutations are independently enumerated; only (A,B,C,D)=(3,2,4,1) satisfies all constraints. Removing the inequality gives multiple candidates and fails the gate. Its justification remains open/self-check. The metadata projection is build-only `source-policy.json`, not an embedded PDF or runtime exam.

**99 uncertain R&L mappings remain blocked** for generation, mastery, readiness and verified frequency. **135 broad R&L mappings remain topic-only**. The original global policy validator checks the pack and all copies/edges; new negative tests explicitly attempt each promotion and reject it. No casual reverification occurred.

Current open-response style was retained: 23 writing/self-check activities across all nine topics,16 B and16 C skill classifications;27 new bounded direct-response calculations, no new MCQ bank, keyword proof scorer, translation string-equality checker, drawing-equality scorer or official-exam claim.

## Independent correctness and separate reviews

`rl-reference.test.ts` independently checks every mechanically decidable new worked example and registers all27 worked-example blocks. Reference methods use Boolean enumeration, native finite sets, arithmetic, explicit edge lists and full permutations, not the production RL models/graders. `rl-practice-reference.test.ts` independently computes every one of27 exact references. Universal proofs were separately reviewed for their logical obligations; checking finite examples is not represented as a proof.

Collaborative pre-publication review found and regression-tested sparse-array acceptance; a large union wrongly checked the pre-deduplication bound; ambiguous FOL constant/binder display; reversed English R(x,y) direction in UI/card; structure versus assignment confusion; an overclaimed induction-setup link; missing necessary/sufficient prompt; and rubrics that overrequired one quantifier syntax, puzzle case split or invariant. Red tests were recorded before fixes; published prior content was not modified.

A distinct root adversarial SELF-review followed the first green920-test/typecheck/build run. It reviewed logical scope, vacuity, proof obligations, open/graded separation, source authorization, binding/storage paths, payload and accessibility. It found the tool/topic-registration gate gap: swapping tool IDs and coverage passed despite routing to the wrong calculator. A new test failed, then an explicit tool/topic binding fixed it. This is a self-review with collaborative assistance, not an independent audit.

Production responsive review found two inherited nowrap headings: the guided heading produced 403px scroll width in a 390px viewport, and the FOL workspace heading produced 406px. These browser failures preceded the R&L-only heading wrapping fixes. The final browser regression passed all nine Learn and all nine Practice pages at each of three widths (54 page/width combinations); the full command suite was rerun after both fixes. A test-harness lazy-module warning was resolved by explicitly awaiting compilation, with no warning suppression or product behavior change.

## Acceptance evidence

### Baseline and final commands

All commands ran from the existing repository. Baseline was clean `59e190a`; final production source is `9b62153` (documentation/report changes only follow it). Runtime: Node 24.19.0, pnpm 11.19.0, TypeScript 5.9.3, Vitest 4.0.18, Vite 7.3.6. Final run log: `/tmp/ds-step7-final-gates.log` (ephemeral local log; durable outcomes are recorded here).

| Command | Baseline | Final actual result |
| --- | --- | --- |
| `pnpm run validate:content` | PASS | PASS; schema, canonical counts, all relations, policies, eight payload checksums and independently pinned manifest |
| `pnpm run check:academic` | PASS | PASS; 3 subjects, 43 topics, 7,462 bytes; unchanged artifact |
| `pnpm run check:references` | PASS | PASS; 3/43/105/147/489 canonical references, 69,985 bytes; unchanged artifact |
| `pnpm run validate:practice` | PASS | PASS; six original immutable exercises and bindings |
| `pnpm run check:topics` | PASS | PASS; 43 topics / 105 subtopics / 147 skills; 84,049 bytes; unchanged artifact |
| `pnpm run validate:topics` | PASS | PASS; three published lessons and 24 published cards unchanged |
| `pnpm run validate:co` | PASS | PASS; 14 topics / 32 subtopics / 46 skills; 79 cards, 28 extension items, 17 guided activities, 10 tools |
| `pnpm run validate:rl` | New gate | PASS; 9/29/45, nine lessons, 67 cards, 27 new exact items, 23 guided activities, seven workspaces, zero uncovered teaching/card skills; 99 uncertain and 135 broad mappings protected |
| `pnpm test` | PASS; 614 tests / 25 files | PASS; **921 tests / 35 files**, none skipped, zero test warnings in final run |
| `pnpm run typecheck` | PASS | PASS; strict TypeScript, exit 0 |
| `pnpm run build` | PASS | PASS; all validators, generators, typecheck and mandatory direct-Vite guards; 149 modules transformed |
| `pnpm run check:co-bundle` | PASS | PASS; all 13 CO topic chunks and protected import boundaries |
| `pnpm run check:rl-bundle` | New gate | PASS; eight new topic chunks, six calculator chunks and all runtime exclusion checks |
| `git diff --check` | PASS | PASS; no whitespace errors |

Canonical pack totals remain: 90 documents (CO 29, RL 33, IP 28), 43 topics, 105 subtopics, 147 atomic skills, 37 assessments, 489 mapped questions, 17 question types, 22 exam patterns, 29 common error tags. Relations remain: 62 topic prerequisites, 69 skill prerequisites, 105 topic–subtopic, 147 subtopic–skill, 306 document–topic, 37 assessment–document, 538 question–topic and 2,005 question–skill edges. All memberships, duplicate-edge checks, prerequisite graphs and course boundaries pass. Content Pack v1.0.0 is unused; the application's existing package version `1.0.0` is unrelated to pack selection.

### Requirement-to-evidence table

Test names below are exact names or explicitly identified parameterized suites. All automated rows were executed by the final `pnpm test`, rather than merely inspected.

| Requirement | Test file / test or scenario | Command / execution | Actual result |
| --- | --- | --- | --- |
| Canonical coverage, cards, ownership and immutable versions | `rl-content.test.ts`: `9 lessons,29 subtopics,45 taught/card-covered skills,67 cards,27 new exact items,23 guided activities,7 tools validate`; parameterized negative mutations | `pnpm test`; `pnpm run validate:rl` | PASS; all 45 skills taught and card-covered; 237 new immutable records |
| No misleading course progress | `rl-content.test.ts`: `capabilities preserve canonical order and have no learner state`; `rl-topic-ui.test.tsx`: `shows factual capabilities in canonical topic order with the actual prerequisite links` | `pnpm test` | PASS |
| Direct build cannot bypass R&L validation | `rl-content.test.ts`: `direct Vite builds use the same mandatory R&L validator`; tool-ID reassignment self-review regression | `pnpm test`; `pnpm run build` | PASS; deliberately invalid content throws |
| Uncertain/broad mappings and older-source restrictions | `rl-content.test.ts`: `all99 uncertain mappings remain blocked and135 broad mappings cannot credit child skills`, promotion/source mutation cases; existing `content-validation.test.ts` | `pnpm test`; `pnpm run validate:content`; `pnpm run validate:rl` | PASS; no L8-only authored association; no generation/frequency/skill-credit promotion |
| Propositional semantics, row order, equivalence, validity and bounds | `rl-logic.test.ts`: `compares semantics despite different surface formula structures`, `checks premise-true/conclusion-false rows for validity, including explosion`, connective cases and invalid AST cases | `pnpm test` | PASS; 54 logic tests including FOL |
| FOL scope, witnesses, vacuity, constants/functions and invalid models | `rl-logic.test.ts`: `distinguishes quantifier alternation with independently identified witnesses`, `restores shadowed variables across sibling formulas and leaves the assignment untouched`, `supports empty extensions without allowing empty classical domains` | `pnpm test` | PASS |
| Bounded recurrence, trees/graphs, sets/functions/relations | `rl-models.test.ts`: hand reference cases, `cross-checks all 64 loop-free three-vertex digraphs against all six orders`, empty and malformed cases; `rl-model-boundaries.test.ts`; `rl-review.test.ts` | `pnpm test` | PASS; 62 model/boundary/review tests |
| Independently checked authored worked examples and proof obligations | `rl-reference.test.ts`: `registers every new worked example for a mathematical or separate logical-obligation review` and independent arithmetic/Boolean/finite-set/edge/permutation tests | `pnpm test` plus separate logical review | PASS; all 27 new worked examples registered; universal proofs reviewed as proofs, not inferred from samples |
| Independent exact answers; errors differ from incorrect | `rl-practice-reference.test.ts`: independent reference cases for every new exact item and invalid/incomplete/error boundary cases | `pnpm test` | PASS; 71 tests, 27 new exact answers covered |
| Puzzle uniqueness and authorization | `rl-content.test.ts`: `the new puzzle has one complete solution; deleting a constraint yields multiple and cannot pass`; `rl-reference.test.ts`: `independently exhausts all 24 puzzle candidates and checks each stated elimination` | `pnpm test`; `pnpm run validate:rl` | PASS; unique (3,2,4,1); final D=1; weakened puzzle rejected |
| No automatic proof/construction score | `rl-ui.test.tsx`: `keeps proof notes and rubric reveals ephemeral, unscored and resettable`; `rl-content.test.ts`: open-proof registry/grade rejection; all guided definitions checked | `pnpm test`; production writing/reveal scenarios below | PASS; open responses never earn item points or saved academic evidence |
| Reuse immutable Practice and exact version binding | `rl-practice.test.ts`: `$id saves, submits, reloads and resolves only its exact definition and grader` (27 items), `open proof IDs never enter the shared auto-grading registry` | `pnpm test` with fake-indexeddb | PASS; new retry ID, idempotency, immutable submission and forged-binding rejection |
| Student schema and database semantics preserved | Existing `learning-contracts.test.ts`, `learning-repository.test.ts`, `learning-ui.test.tsx`; protected Git diff; native browser harness below | `pnpm test`; native Chromium UI | PASS; schema 1 / DB 1; transaction-completion and stale-epoch checks preserved |
| All topic modes, placeholders, tools and cards | `rl-topic-ui.test.tsx` all nine topic flows; all ten `rl-ui.test.tsx` scenarios; existing routing/topic suites | `pnpm test`; production direct links and navigation | PASS; Exam-style remains unavailable; cards do not mutate student evidence |
| CO and Assembly regression | All existing CO tests and 101 original Assembly tests; production cache and three Assembly examples below | `pnpm test`; actual production UI | PASS; protected source trees unchanged |
| Mobile and keyboard accessibility | Real Learn/Practice pages at 390/768/1280; tab ArrowRight, navigation Enter/Escape/focus; textual world/tree/graph outputs | Chromium production UI | PASS; 54 page/width combinations, no page overflow; labels and keyboard controls exercised |
| Frontend exclusion and lazy chunks | `scripts/inspect-rl-build.ts` plus preserved CO inspector, all final emitted modules and assets | `pnpm run build`; both bundle commands | PASS; full Handoff, PDFs, validators and build-only records absent |

### Test inventory and preservation

All **614 baseline tests in 25 files** remain and pass. No test was deleted, skipped or weakened. Four existing files were adapted for the larger catalog: `application-routing.test.tsx` (61 items), `co-practice.test.ts` (preserves the original 34 non-RL items), `practice-ui.test.tsx` (61 total / 29 RL, explicit lazy-module preload in the test harness), and `topic-ui.test.tsx` (nine T01 items while asserting the original two still exist). Product storage and CO/Assembly tests retain their original semantics.

| New file | Passed tests |
| --- | ---: |
| `tests/rl-logic.test.ts` | 54 |
| `tests/rl-models.test.ts` | 56 |
| `tests/rl-model-boundaries.test.ts` | 4 |
| `tests/rl-review.test.ts` | 2 |
| `tests/rl-reference.test.ts` | 30 |
| `tests/rl-practice-reference.test.ts` | 71 |
| `tests/rl-content.test.ts` | 41 |
| `tests/rl-practice.test.ts` | 28 |
| `tests/rl-ui.test.tsx` | 10 |
| `tests/rl-topic-ui.test.tsx` | 11 |
| **New total** | **307** |

### Real-browser acceptance (separate from mocked-storage tests)

**Chromium 152.0.7977.64 on macOS**, exact version returned by the browser's full-version metadata. Application production build served on isolated `http://127.0.0.1:4194`; fresh origin isolated its student database from the user's existing 4173 application. Native storage harness used separate origin 4195 and its own named databases. No existing user data was cleared, replaced or seeded. Mocked tests above use jsdom/fake-indexeddb and are not represented as real-browser evidence.

All nine topics were opened through actual production deep links. Each passed Learn block rendering, card reveal/next, and Practice capability/count checks. The course page displayed all nine topics with canonical order and prerequisite links. Actual workflows:

| Topic | Production UI result |
| --- | --- |
| T01 | Preserved lesson/cards; p→q truth rows T,T,F,T; q→p comparison not equivalent; affirming-the-consequent counterexample; existing conjunction exercise submission and reload — PASS |
| T02 | Directed three-cycle: ∀x∃y R(x,y) true with b/c/a witnesses; ∃y∀x R(x,y) false; empty P extension distinct from empty domain; reset; finite-model exact item — PASS |
| T03 | Typed assumption/target, steps and conclusion; revealed proof rubric/reference with no correctness or point score — PASS |
| T04 | Recurrence index 31 shows bounded 0–30 error; odd recurrence index 7 gives 15; induction and invariant fields attempted and rubrics revealed unscored; affine exact exercise gives 63 — PASS |
| T05 | Hand-checked preorder ABDEC, inorder DBEAC, postorder DEBCA; five nodes, three leaves, height two; alternate valid order A,C,B,D accepted; added edge exposes A→B→D→A cycle; empty tree 0/0/−1; construction attempted/self-checked — PASS |
| T06 | Empty A gives powerset {∅}, cardinality one and empty Cartesian product; set-proof fields attempted/revealed with no grade; normalized set-difference exact response — PASS |
| T07 | Adding (a,b) to identity creates multiple outputs: function properties become not applicable; relation reflexive yes, symmetric no, antisymmetric yes, transitive yes; reset — PASS |
| T08 | Countability lesson and listing/bijection proof fields/rubric; finite checks never called an infinite proof — PASS |
| T09 | New dock-constraint modeling, exhaustive elimination and verification fields attempted; rubric unscored; final D=1 exact exercise submitted/reviewed/reloaded — PASS |

Five actual saved submissions completed start → answer → submit → item review → actual reload. Four new text items also explicitly saved their drafts; the original conjunction item used its existing row controls and direct Submit. Each reloaded with `Correct · 1 / 1 item point`: `rl-conjunction` (F,F,F,T), `rl-forall-exists` (1), `rl-recurrence-affine` (63), `rl-set-difference` ({5,0,3,5}, normalized to {0,3,5}) and `rl-dock-setting` (1). All five still resolved after the final production rebuild. These are isolated test attempts, not fabricated user progress.

Navigation acceptance: direct topic/tool/practice links and reload; Practice → ArrowRight → Exam-style updates the URL and focus; Back/Forward restores the correct mode; Exam-style reload stays an honest placeholder. At 390px, Enter opens navigation, Escape closes it and returns focus to Open navigation. All nine Learn pages and all nine Practice pages passed at **390 / 768 / 1280 CSS px** with actual `clientWidth` verified and `scrollWidth` no greater than it (54 combinations). Course layouts were visually inspected on mobile and desktop. Inspected production console errors/warnings: **zero**.

Representative preserved CO cache flow: three reads produce a hit with LRU 1→0; fourth read at address16 misses and evicts tag1, LRU0→2; Previous restores the third state and Reset empties the cache. PASS.

| Existing Assembly example | Actual executed steps | Final RAX | Final RSP / RBP | Previous → Next / Reset |
| --- | ---: | ---: | --- | --- |
| Basic arithmetic | 3 | 8 | 0x1000 / 0x1000 | PASS |
| Stack frame | 9 | 15 | 0x1000 / 0x1000 | PASS |
| Function call | 10 | 7 | 0x1000 / 0x1000 | PASS |

The existing native IndexedDB harness (`tests/browser/verification.ts`) was rebuilt with `node --import tsx scripts/build-learning-browser-check.ts` and served separately in production mode. Its 13 initial checks passed, then an actual page reload and reload-check action passed the 14th check: fresh installation; committed resume on a new connection; concurrent distinct attempts; stale-draft rejection; immutable/idempotent submission; request success followed by abort not acknowledged as saved; atomic restore/recovery and stale-connection rejection; aborted replacement preserves active/recovery data; invalid import causes no mutation; corruption preserved with explicit error; blocked upgrade rejection; injected permission failure propagation; preparation of reload record; actual reload retains committed record. **14 PASS / 0 FAIL**, native Chromium IndexedDB. The permission denial and transaction aborts were controlled injections; real device/OS crashes were not simulated.

**NOT RUN:** Safari, Firefox, actual Safari/WebKit, hardware screen-reader interaction, browser-data deletion/device-failure durability, and direct original-PDF page/rubric verification. No WebKit run is claimed as Safari. Browser interoperability and assistive-technology behavior beyond the inspected Chromium controls remain unverified. Original source fidelity is limited as stated in the source section; explicit normalized provenance and new authored conventions avoid claiming missing page verification. No required critical Chromium or command acceptance check is left unexecuted.

### Production payload and imports

Sizes below are final emitted bytes, measured after Vite preload rewriting, and gzip bytes calculated per emitted file. [Full chunk/module/file inventory](rl-bundle-report.json); [preserved CO guard's current application report](co-bundle-report.json). The latter is regenerated because it inventories the entire application; its changes do not indicate modified CO content.

| Payload | Bytes | Gzip bytes |
| --- | ---: | ---: |
| Baseline initial JS | 470,777 | 124,236 |
| Final initial JS | 474,089 | 124,886 |
| Initial JS increase | 3,312 | 650 |
| CSS | 49,206 | 11,487 |
| `assets/RL_T02_FOL-CPbVtDo6.js` | 15,292 | 4,506 |
| `assets/RL_T03_PROOF_METHODS-Dyog5d7L.js` | 15,936 | 4,289 |
| `assets/RL_T04_INDUCTION_RECURSION-_WIOYeu9.js` | 17,916 | 5,101 |
| `assets/RL_T05_TREES_GRAPHS-CIHz8klu.js` | 13,625 | 4,050 |
| `assets/RL_T06_SET_THEORY-Cvt6P7Nr.js` | 12,356 | 3,535 |
| `assets/RL_T07_FUNCTIONS_RELATIONS-BW77OxQa.js` | 11,902 | 3,460 |
| `assets/RL_T08_LIMITS_COUNTABILITY-B2E1EBNK.js` | 10,869 | 3,529 |
| `assets/RL_T09_TRANSFER_CONSTRAINT_PUZZLES-Bk7ZJOkn.js` | 8,140 | 2,725 |
| `assets/Workspace-B1qlT9am.js` | 2,025 | 835 |
| `assets/PropositionWorkspace-BUItmxhf.js` | 5,150 | 1,803 |
| `assets/logic-DTFjvJ0t.js` | 8,365 | 3,053 |
| `assets/FolWorkspace-B9JvJkJt.js` | 4,077 | 1,661 |
| `assets/RecurrenceWorkspace-tAjROSeJ.js` | 2,531 | 1,146 |
| `assets/models-8GyK5YA1.js` | 7,879 | 3,021 |
| `assets/TreeGraphWorkspace-Ce-jmiI1.js` | 3,912 | 1,642 |
| `assets/SetsWorkspace-BjhcxWHw.js` | 2,348 | 1,021 |
| `assets/RelationsWorkspace-CuBtZ12t.js` | 3,125 | 1,263 |
| All emitted JS/CSS assets | 932,078 | 267,272 |
| All production files including HTML/favicon | 933,074 | 267,922 |

Initial JS grew 3,312 bytes (0.70%) / 650 gzip bytes (0.52%). All eight new R&L topic JSON bundles are separate dynamic chunks, totaling 106,036 emitted bytes. The six calculator components, wrapper and shared bounded logic/model modules load on demand. R&L capability metadata and shared routing/CSS are small initial dependencies. Practice definitions and compact immutable definition/grader fingerprints load in the existing shared Practice service chunk; they are deliberately runtime data for exact old-attempt resolution. Full lesson/content locks, coverage, source policy and validators remain build-only.

Raw authored new R&L topic JSON is 141,314 bytes; new Practice definitions are 35,853 bytes. No math renderer, graph library, formula-image asset or new dependency was added. The 13 CO topic chunks still total 104,952 bytes; Assembly remains a separate 29,502-byte lazy chunk. All emitted files and module ownership, including shared service and original pilot content, are enumerated in the linked JSON report.

The frontend includes no complete Handoff JSON, PDF binary/full text, source-policy metadata, content-validator code or build-only content locks. Module-graph checks apply to all runtime chunks, not just the initial bundle. Student storage code, schema/DB version, pack payloads, projections, published pilot content, original/CO graders and all Assembly sources have an empty Git diff against `59e190a`.

### Changed-file inventory and Git checkpoint

The model checkpoint is `4160ae1`; final implementation is `9b62153`. The final report/README and both measured bundle reports form the subsequent documentation-only HEAD. The complete Step 7 inventory relative to `59e190a` follows; no unrelated source tree was rewritten.

```text
README.md
docs/co-bundle-report.json
docs/reasoning-logic-status.md
docs/rl-bundle-report.json
package.json
scripts/inspect-rl-build.ts
scripts/rl-content.ts
scripts/rl-source-policy.ts
scripts/validate-rl.ts
src/pages/CoursePage.tsx
src/pages/TopicPage.tsx
src/practice/AttemptPage.tsx
src/practice/ExerciseParts.tsx
src/practice/PracticePage.tsx
src/practice/catalog.ts
src/practice/registered-types.ts
src/practice/runtime.ts
src/practice/service.ts
src/rl/FolWorkspace.tsx
src/rl/GuidedPractice.tsx
src/rl/IntroTopicContent.tsx
src/rl/PropositionWorkspace.tsx
src/rl/RLStudyMode.tsx
src/rl/RecurrenceWorkspace.tsx
src/rl/RelationsWorkspace.tsx
src/rl/SetsWorkspace.tsx
src/rl/TopicContent.tsx
src/rl/TreeGraphWorkspace.tsx
src/rl/Workspace.tsx
src/rl/capabilities.json
src/rl/content-lock.json
src/rl/coverage.json
src/rl/grader-lock.json
src/rl/grading.ts
src/rl/intro-guided.json
src/rl/logic.ts
src/rl/models.ts
src/rl/practice-lock.json
src/rl/practice-types.ts
src/rl/practice.json
src/rl/rl.css
src/rl/source-policy.json
src/rl/tools.json
src/rl/topics/RL_T02_FOL.json
src/rl/topics/RL_T03_PROOF_METHODS.json
src/rl/topics/RL_T04_INDUCTION_RECURSION.json
src/rl/topics/RL_T05_TREES_GRAPHS.json
src/rl/topics/RL_T06_SET_THEORY.json
src/rl/topics/RL_T07_FUNCTIONS_RELATIONS.json
src/rl/topics/RL_T08_LIMITS_COUNTABILITY.json
src/rl/topics/RL_T09_TRANSFER_CONSTRAINT_PUZZLES.json
src/rl/types.ts
tests/application-routing.test.tsx
tests/co-practice.test.ts
tests/practice-ui.test.tsx
tests/rl-content.test.ts
tests/rl-logic.test.ts
tests/rl-model-boundaries.test.ts
tests/rl-models.test.ts
tests/rl-practice-reference.test.ts
tests/rl-practice.test.ts
tests/rl-reference.test.ts
tests/rl-review.test.ts
tests/rl-topic-ui.test.tsx
tests/rl-ui.test.tsx
tests/topic-ui.test.tsx
vite.config.ts
```

Total: **67 files added or modified**. Git status and `git diff --check` are verified after the final documentation commit. Build output, dependency directories, the native test artifact and temporary logs are ignored/untracked outside the commit; no secrets or generated student data are committed.

## Scope and limitations

No Step8 or later work was started: no complete IP course, global Exam Engine, mastery/readiness, adaptive study, Mistake Book, Supabase, deployment, new storage schema, proof grading or persisted learning-completion fields. Existing placeholders remain. The next planned course step is Complete Introduction to Programming, requiring separate authorization. Local browser persistence is not a guarantee against browser-data deletion or device failure.
