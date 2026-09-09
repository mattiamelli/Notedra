# Supplemental learning sources and explanatory feedback

**IMPLEMENTATION COMPLETE — final production acceptance in progress.** This is the maintenance patch between Steps 7 and 8. Step 8 has not started.

## Git and protected baseline

Started from clean `e08b7a3` (921 passing cases in 35 files). The interrupted working changes were preserved; no reset, restore or rewrite of the baseline. The final documentation commit is the HEAD carrying this report; resolve its hash with `git log -1 --oneline` to avoid a self-referential hash. Clean status is verified after the final commit.

`scripts/enrichment-baseline.json` records SHA-256 values taken from `e08b7a3`, covering the protected Content Pack v1.0.1/schema 1.1.0, generated navigation/reference/topic projections, existing CO/R&L/pilot content and their locks/graders, the Assembly engine/components/examples, student storage and dependency locks. Every validation/build checks these bytes. Student Schema 1 (`src/learning/contracts.ts:3`) and database version 1 (`src/learning/repository.ts:50`) are unchanged. No migrations, learner misconception records, Mistake Book, mastery, readiness, scheduling, completion percentages, cloud sync or deployment were added. v1.0.0 remains unused.

## Supplemental inventory

Exact uploaded names, sizes, SHA-256 digests and every archive member are recorded in [enrichment-source-inventory.json](enrichment-source-inventory.json). Four uploads: `CSE 11C Computer Organisation (CO).zip`, `Delftse Foundations of Computation.pdf`, `Delftse Foundations of Computation Summary.pdf`, `R&L Notes.pdf`. ZIP contains 16 lectures (0–15), 14 assessments, the CO reference textbook, CO Notes, README and seven LLM/knowledge markdown files. Inventory is not a claim to have read all their content. The three R&L PDFs have 229, 19 and 8 physical pages respectively; CO reference textbook 735 and CO Notes 39. Raw sources and temporary extraction/rendering artifacts stayed outside the repository. Original uploads were not modified.

## Source authority and review checkpoint

Authority: Content Pack v1.0.1/schema1.1.0 and its operating rules; current/recent official lectures/assessments; course textbook; scope-corroborating broad textbook. Notes, summaries and generated knowledge files never establish facts or change canonical source confidence, era, eligibility or UNKNOWN fields.

Direct evidence read: CO Lecture 5 physical29 (printed30, two's-complement range); Lecture6 physical3/9 (sign extension/overflow, printed3/10); Lecture2 physical36/37/39/44/45/48/51/56–58 (address versus contents, AT&T, stack and frames); Lecture13 physical25/26/29 (fields/set count/LRU); Lecture14 physical5/6/11/12 (latency, throughput, fill timing); Midterm2025 Solutions physical7/11/14/17/18 (carry, stack unknown bytes, reasoning rubric); Endterm2025 Solutions physical7–9 (cache parameters and stated policies). “2025” filenames contain exams dated2024-10-04/2024-11-08; preserve the pack's academic-year identities rather than relabeling them.

Delftse Foundations textbook: contents physical7–8 and syllabus notice13; implication24; quantifiers52–54/56; structures57; negation59; proof obligations83–84; sets120–121/123/132–133. Starred sections are excluded; no starred section is used to expand R&L. CO reference textbook physical35–37/39 reviewed for arithmetic corroboration; official lectures take precedence.

Blocked note claims: R&L Notes physical2 reverses the parenthetical explanation of a necessary condition; physical6 describes contradiction by negating the hypotheses and writes irrational numbers as Q−R. CO Notes physical14 gives the wrong negative endpoint for two's complement; physical33 says remove what was last accessed, unsafe if read as most-recent eviction. Summary physical3 conflates a false antecedent with unrestricted proof; physical6 overstates that an unquantified variable has no meaning; physical13 shorthand about Russell's paradox is not an adequate proof. Correct responses are grounded in trusted semantics, not the notes. Summary's2022–23 blue headings never override canonical current scope.

No confirmed defect in an existing published lesson/exercise has been established. Student Schema1 / IndexedDB1, CO/RL/Assembly behavior, taxonomy and pack remain protected. No Mistake Book, mastery, adaptive state, cloud or deployment work.


Additional targeted inspection: CO Lecture 7 physical 14 endianness diagram; R&L textbook physical 124 section 4.1.7 Cartesian product. Summary physical 13 also incorrectly excludes ∅ from {∅}; independently tested and blocked by the nested-set card. CO Notes physical 11/13 register/pop shorthand was reviewed but not adopted. R&L Notes physical 4/5 DNF/quantifier shorthand was not used as formal semantics.

Visual verification specifically included CO Lecture 6 physical 9, Lecture 2 physical 57–58, Endterm 2025 Solutions physical 8, Lecture 14 physical 11 (four instructions/four stages complete in seven cycles), Lecture 7 physical 14, CO Notes physical 14/33, R&L Notes physical 2/6, R&L textbook physical 24/54/121 and Summary physical 13. Other listed pages were inspected textually. No complete-source review is claimed. The textbook syllabus notice excludes starred sections; none expands the canonical scope. Original R&L lectures/assessments were not supplied, so R&L direct supplemental verification uses the course textbook and preserves existing canonical lecture mappings and uncertainty.

## Architecture and preservation

`src/enrichment/` contains typed versioned authoring records, independent six-item controlled-tuple grading, supplemental sources, cards, optional cues, guided references and shared answer-aware explanations. Every new authored card/cue/misconception/profile/guide has a stable ID and version; records are SHA-256 locked. Each feedback profile binds the exact exercise content/grader fingerprint. Existing 61 exercise definitions, their three graders and historical bindings remain unchanged. Six new items append to the shared catalogue. The existing attempt service and storage lifecycle are reused without edits.

Feedback presents the submitted answer, independently checked reference, a concise error-specific explanation, reasoning and reminder, followed by the existing retry action. Eighteen exact wrong-answer paths across 16 items use a cautiously labelled “Answer pattern to check”; unmatched valid wrong answers receive a verified fallback without a misconception label. Correct answers have no error category. INCOMPLETE, INVALID, ERROR and NOT_AUTOGRADABLE remain unscored/distinct. No evaluation or misconception state is persisted. Repeated identical submission stays idempotent, conflicting operation content fails, and retry creates a new attempt while retaining the immutable submitted answer. Six new service tests cover these distinctions.

Two open reasoning supplements require an attempt before revealing conditions, common failure modes and one valid reference. No learner text is compared with that reference, no keyword scoring exists, and alternative proofs/design reasoning are welcome. These temporary textareas are explicitly unsaved. Published course lessons/cards remain intact; supplemental cards appear below the existing decks. Topic/course counts include additions through a validated tiny capability index. Six optional map cues link existing canonical skills without new topology or prerequisites.

## Flashcards: course and topic counts

CO: **79 → 85**. R&L: **67 → 73**. Preserved IP pilot: **8 → 8**. Whole application: **154 → 166**. All areas were selected for high-risk distinctions, not total card count; no lesson expansion or new canonical skill was introduced.

| Course/topic | Before | Added | After |
| --- | ---: | ---: | ---: |
| `CO_T01_HISTORY` | 3 | 0 | 3 |
| `CO_T02_BOOLEAN_KMAP` | 7 | 0 | 7 |
| `CO_T03_DIGITAL_CMOS_SEQUENTIAL` | 6 | 0 | 6 |
| `CO_T04_DATA_REP_RADIX_INTEGER` | 8 | 3 | 11 |
| `CO_T05_DATA_REP_FIXED_FLOAT` | 6 | 0 | 6 |
| `CO_T06_ASSEMBLY_X86_64` | 7 | 1 | 8 |
| `CO_T07_ISA` | 5 | 0 | 5 |
| `CO_T08_BPU_MICROCODE` | 7 | 0 | 7 |
| `CO_T09_IO_INTERRUPTS` | 5 | 0 | 5 |
| `CO_T10_DMA_MEMORY` | 5 | 0 | 5 |
| `CO_T11_CACHE` | 6 | 1 | 7 |
| `CO_T12_PIPELINE` | 6 | 1 | 7 |
| `CO_T13_PARALLELISM` | 4 | 0 | 4 |
| `CO_T14_VIRTUAL_MEMORY` | 4 | 0 | 4 |
| `RL_T01_PROP_LOGIC` | 8 | 2 | 10 |
| `RL_T02_FOL` | 9 | 2 | 11 |
| `RL_T03_PROOF_METHODS` | 9 | 1 | 10 |
| `RL_T04_INDUCTION_RECURSION` | 10 | 0 | 10 |
| `RL_T05_TREES_GRAPHS` | 7 | 0 | 7 |
| `RL_T06_SET_THEORY` | 8 | 1 | 9 |
| `RL_T07_FUNCTIONS_RELATIONS` | 8 | 0 | 8 |
| `RL_T08_LIMITS_COUNTABILITY` | 5 | 0 | 5 |
| `RL_T09_TRANSFER_CONSTRAINT_PUZZLES` | 3 | 0 | 3 |

| New card (all v1) | Canonical skills | Selection reason |
| --- | --- | --- |
| `ds.enrichment.card.carry` | CO_SK04_04_OVERFLOW | Separate two independent interpretations of the same bit addition. |
| `ds.enrichment.card.minimum` | CO_SK04_03_SIGNED_ENCODE | Blocks the incorrect lower bound found in CO Notes. |
| `ds.enrichment.card.extension` | CO_SK04_03_SIGNED_ENCODE | Shows why copying bits with the wrong extension changes meaning. |
| `ds.enrichment.card.address` | CO_SK06_03_STACK_TRACE | Targets the address-versus-value distinction without extending the simulator. |
| `ds.enrichment.card.cache-fields` | CO_SK11_01_CACHE_BITS | Distinguishes number of sets from total cache lines. |
| `ds.enrichment.card.pipeline` | CO_SK12_01_PIPE_PERF | Separates latency, steady-state throughput and fill/drain cost. |
| `ds.enrichment.card.necessary` | RL_SK01_02_NEC_SUFF | Blocks the reversed parenthetical claim in R&L Notes. |
| `ds.enrichment.card.contrapositive` | RL_SK01_05_EQUIV | Uses operation-level recall rather than memorizing one story. |
| `ds.enrichment.card.quantifier` | RL_SK02_03_NEGATE_FOL | Separates one counterexample from failure at every object. |
| `ds.enrichment.card.assignment` | RL_SK02_05_FORMAL_STRUCTURE | Corrects the summary’s overstatement that unquantified variables have no meaning. |
| `ds.enrichment.card.nested` | RL_SK06_01_SET_CALC | Adds an explicit nested-set boundary case. |
| `ds.enrichment.card.proof` | RL_SK03_04_CONTRADICTION | Blocks a misleading proof-method note without scoring proof text. |

## Misconception authoring inventory

All categories are authored content, never learner history. Rules and evidence are independently reviewed; category selection only follows an exact valid wrong-answer pattern.

| ID (all v1) | Canonical skills | Verified rule |
| --- | --- | --- |
| `ds.enrichment.misconception.carry-overflow` | CO_SK04_04_OVERFLOW | Check carry out and signed representability separately. |
| `ds.enrichment.misconception.ones-complement` | CO_SK04_03_SIGNED_ENCODE | After inverting the positive representation, add 1 at the chosen width. |
| `ds.enrichment.misconception.byte-order` | CO_SK04_06_ENDIAN | Little-endian places the least-significant byte at the lowest address. |
| `ds.enrichment.misconception.address-value` | CO_SK06_03_STACK_TRACE | Address arithmetic locates memory; only a load reads its contents. |
| `ds.enrichment.misconception.cache-index` | CO_SK11_01_CACHE_BITS | Index bits select sets, not individual ways. |
| `ds.enrichment.misconception.pipeline-fill` | CO_SK12_01_PIPE_PERF | Ideal total cycles=k+N−1; then add the stated extra stalls. |
| `ds.enrichment.misconception.converse` | RL_SK01_05_EQUIV | p→q is equivalent to ¬q→¬p, not generally q→p. |
| `ds.enrichment.misconception.necessary` | RL_SK01_02_NEC_SUFF | If r is necessary for s, the direction is s→r. |
| `ds.enrichment.misconception.implication` | RL_SK01_01_CONNECTIVE | Only a true antecedent with false consequent makes an implication false. |
| `ds.enrichment.misconception.quantifier-order` | RL_SK02_05_FORMAL_STRUCTURE | ∃y∀x requires one common y; ∀x∃y permits a different y for each x. |
| `ds.enrichment.misconception.quantifier-negation` | RL_SK02_03_NEGATE_FOL | A witness for ∃x¬P(x) must make P false, not true. |
| `ds.enrichment.misconception.constant-assignment` | RL_SK02_05_FORMAL_STRUCTURE | Interpret constants in the structure; assign objects to free variables. |
| `ds.enrichment.misconception.nested-membership` | RL_SK06_01_SET_CALC | A set containing {2} need not contain the integer 2. |
| `ds.enrichment.misconception.empty-layers` | RL_SK06_03_POWER_CART | {∅} has one element, so its powerset has two elements. |

## Practice and explanatory feedback inventory

Six new mechanisms produce ordered integer tuples; this small parser does not grade general formulas, translations or proofs. Spaces, leading zeros and negative zero normalize; malformed/oversized responses do not become incorrect submissions. Every new reference has a separate oracle in `tests/enrichment-reference.test.ts`, which imports no production grader/model/simulator.

| New exercise | Topic/skill | Expected | Independent method |
| --- | --- | --- | --- |
| `ds.practice.enrich-carry-overflow` | CO_T04_DATA_REP_RADIX_INTEGER / CO_SK04_04_OVERFLOW | `1,0` | Unsigned addition and signed range check |
| `ds.practice.enrich-address-load` | CO_T06_ASSEMBLY_X86_64 / CO_SK06_03_STACK_TRACE | `4080,37` | Separate address arithmetic and memory lookup |
| `ds.practice.enrich-cache-fields` | CO_T11_CACHE / CO_SK11_01_CACHE_BITS | `5,2,6` | Division/remainder and bit reconstruction |
| `ds.practice.enrich-implication-directions` | RL_T01_PROP_LOGIC / RL_SK01_05_EQUIV | `1,0,1` | Boolean valuation enumeration |
| `ds.practice.enrich-constant-assignment` | RL_T02_FOL / RL_SK02_05_FORMAL_STRUCTURE | `1,0,0` | Explicit domain, predicate, constant and assignment |
| `ds.practice.enrich-empty-set-layers` | RL_T06_SET_THEORY / RL_SK06_03_POWER_CART | `1,2,0` | List elements, subsets and Cartesian product |

| Profile exercise | Exact incorrect pattern(s) | Reminder |
| --- | --- | --- |
| `ds.practice.enrich-carry-overflow` | `1,1` | Carry tracks unsigned range; signed overflow tracks −8 through 7 here. |
| `ds.practice.enrich-address-load` | `37,37`, `4080,4080` | LEA computes an address; MOV from memory reads its stored value. |
| `ds.practice.enrich-cache-fields` | `2,6,6` | Split address bits as tag | set | byte offset; ways share a set. |
| `ds.practice.enrich-implication-directions` | `1,1,1` | Contrapositive: reverse AND negate; converse: reverse only. |
| `ds.practice.enrich-constant-assignment` | `1,1,0` | A constant’s interpretation is not replaced by a free-variable assignment. |
| `ds.practice.enrich-empty-set-layers` | `0,1,0` | Count elements at each brace level; an empty product has no pairs. |
| `ds.practice.co-overflow-four` | `0` | Same-sign inputs plus opposite-sign result mean signed overflow. |
| `ds.practice.co-signed-five` | `11001` | Invert the fixed-width positive representation, then add 1. |
| `ds.practice.co-little-byte` | `A1` | Little-endian stores the least-significant byte first. |
| `ds.practice.co-cache-tag-width` | `8` | Tag bits=address bits −offset bits −set-index bits. |
| `ds.practice.co-pipeline-total` | `8`, `13` | N instructions in k ideal stages take N+k −1 cycles before extra stalls. |
| `ds.practice.rl-implication-rows` | `0001` | Only the (true,false) row makes p→q false. |
| `ds.practice.rl-necessary-rows` | `1101` | r necessary for s means s→r. |
| `ds.practice.rl-exists-forall` | `1` | One y must work for every x when ∃y is outside ∀x. |
| `ds.practice.rl-negation-witnesses` | `{1,3}` | Negate the predicate as well as changing ∀ to ∃. |
| `ds.practice.rl-nested-membership` | `1111` | An object and a singleton containing it are distinct. |

Examples: `1,1` for carry/overflow keeps the correct carry but explains why −5−3=−8 fits; `37,37` for LEA/MOV identifies the loaded value in the address field; `2,6,6` for cache fields explains incorrectly counting ways as sets. The converse pattern `1,1,1` points to the middle true→false implication. Unknown wrong tuples get field-specific worked reasoning without a diagnosis.

The independent checks additionally enumerate all 256 four-bit additions and all 256 eight-bit cache addresses, compare logical equivalence/counter-valuations, distinguish common/dependent witnesses, derive quantifier negation, enumerate nested sets, and verify ideal pipeline completion and both open references. Authoring uses original values/wording and no copied source diagram, question story or worked solution.

## Distinct adversarial self-review

Performed after an initial full green implementation (1,013 tests, strict typecheck and build). This was a **self-review**, not an independent audit. Reviewed wrong-path explanations against prompts/reference calculations; normalization versus valid alternatives; carry/overflow, endian, stack offsets, cache fields, pipeline timing, implication/quantifier/set semantics; notes exclusion; provenance and syllabus boundaries; copying; immutable bindings/storage; lazy payloads and responsive feedback.

Two confirmed defects were reproduced before fixing:

1. Shared feedback displayed `sum-9`, the Java option ID, instead of selected output `9`. Regression: `enrichment-ui.test.tsx` “review regression: shows the selected Java output rather than an internal option ID”. Fix formats submitted choices with the same visible representation as the reference; the existing Java grader/content/attempts are unchanged.
2. One FOL explanation asserted an unobserved learner procedure (“treats free x like c”). Regression: `enrichment.test.ts` “review regression: exact patterns do not assert an unobserved learner procedure”. Fix describes the observed field agreeing with P(c), then gives the required P(x) calculation.

Both failed in the recorded red run; both passed in the targeted rerun (85 cases in three files, plus typecheck). New content was finalized/locked before publication; no old lock was rewritten. Capability consistency and emitted-source/lazy-graph negative tests also protect the new integration. Under unrestricted parallel load, the existing 43-route test once exceeded its 5-second limit and caused cascading act warnings. The final suite limits workers to two without changing/skipping assertions or timeouts. The new UI harness waits sequentially for storage/button readiness rather than overlapping act polling.

## Acceptance evidence and final results

Final results are completed below after the command suite and isolated production browser checks.
