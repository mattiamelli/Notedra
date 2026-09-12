# Patch 7 adversarial content review

Current source-completion review is appended below; the first section preserves the original 112-item checkpoint. The current gate is in [finalization](maintenance-patch-7-finalization.md).

Review boundary: authoring stopped after the automated 2,255-test PASS. This is a separate review pass by the same agent, not an independent human endorsement. No official calibration or whole-lecture learning completion is claimed.

- All 112 added records checked for canonical unit/skill mapping, declared answer form, original prompt and differentiated demand. Exact new-prompt duplicates: zero. Repeated formats are explicit: 76 bounded Java prediction tasks, not a new free-code grader.
- Four near-variant candidates were replaced during earlier authoring review: method shadowing with nested argument evaluation; a second return-value calculation with an early void return; a class counter with construction-time versus shared state; a filter/map calculation with lazy stream consumption. Final JDK evidence verifies those replacements.
- CO pairs compare representations, reversible arithmetic, address aliases, call/stack restoration, full unsigned multiplication, destructive operands, cache policies/locality, and finite pipeline costs. Explicit toy delay-slot behavior does not claim x86 semantics. Float spacing uses an integer denominator response, matching the accepted tuple validator.
- Visual review found adjacent single-variable bars could touch and resemble one grouped complement. Added small spacing between literal bars; semantic mappings unchanged.
- Boolean exercises distinguish reverse minterm recovery, forward overlapping products, four-variable wrapping and selector reconstruction. No fifth minterm clone was retained. Formula equivalence is checked, not minimality; Gray order and original care-row rules are unchanged.
- IP per-unit demands are listed below. Distractors correspond to alternative execution/state interpretations; each declared choice is checked and the trusted reference output is JDK verified. This bank has limited interaction-format diversity: fixed predictions remain the accepted safe IP objective format. Eight design/implementation activities use explicit unscored rubrics instead.
- Open solutions have multiple valid implementations. Their criteria and examples do not assign correctness, points, mastery or readiness. Practice uses several scaffolded fields; exam-style uses broader response fields and distinct integrated tasks. Objective exam-style records omit preparation and use separately authored harder tasks; they are not automatically inserted into timed mock blueprints.
- New questions use original scenarios and authored code, with source concepts and physical pages recorded. No source question wording, official answer key, PDF page, or full source text was embedded. Whole-document source locators remain honestly labelled as such in the UI.
- Source check: all 27 available canonical PDFs were rehashed against the accepted index. CO03 uses the inspected accepted topic content, not a falsely claimed raw lecture. No new R&L source coverage is claimed. All 25 uncovered units remain failed coverage rows, not academic exceptions.
- Original attempt bindings and grading files remain unchanged; new IDs have dedicated definition/grader locks. New content by itself creates no learner performance evidence. Same-topic next selection reaches new records after older ones without changing the existing Study Path priority policy. Mastery/readiness and cloud/auth code were not edited.

At this review checkpoint, complete lecture coverage and the 2,000,000-byte total asset budget failed. Subsequent source/bundle-only finalization is recorded in maintenance-patch-7-finalization.md; the authoring review remains unchanged.

## Reviewed demands and physical source pages

Page numbers below identify inspected physical PDF pages, not necessarily printed slide labels, and are internal provenance rather than claims of official questions.

| Unit | New activity | Distinct demand | Inspected physical pages / accepted material |
|---|---|---|---|
| CO_LEC_03 | ds.practice.p7-boolean-minterm | Recover an exact minterm | Accepted local CO Boolean/K-map lesson; original PDF missing |
| CO_LEC_03 | ds.practice.p7-boolean-products-map | Trace two overlapping products | Accepted local CO Boolean/K-map lesson; original PDF missing |
| CO_LEC_03 | ds.practice.p7-boolean-wrap-product | Recover a wraparound product | Accepted local CO Boolean/K-map lesson; original PDF missing |
| CO_LEC_03 | ds.practice.p7-boolean-selector | Reconstruct a selector from its map | Accepted local CO Boolean/K-map lesson; original PDF missing |
| IP_LEC_01 | ds.practice.p7-ip-signed-remainder | Reconstruct a negative dividend | 28, 29 |
| IP_LEC_01 | ds.practice.p7-ip-concat-boundary | Locate the switch from arithmetic to text | 26, 27 |
| IP_LEC_01 | ds.practice.p7-ip-narrow-lowbits | Follow a narrowing conversion and its later promotion | 18, 19, 30 |
| IP_LEC_01 | ds.practice.p7-ip-cast-versus-scale | Compare truncating before and after scaling | 29, 30 |
| IP_LEC_02 | ds.practice.p7-ip-short-circuit-state | Trace a guarded state update | 4, 5, 6, 7 |
| IP_LEC_02 | ds.practice.p7-ip-branch-recheck | Distinguish sequential tests from one exclusive branch | 12, 13, 17 |
| IP_LEC_02 | ds.practice.p7-ip-triangle-state | Accumulate an inner loop with a changing bound | 18, 19, 28, 29, 30 |
| IP_LEC_02 | ds.practice.p7-ip-loop-exit-state | Distinguish the last body state from the exit test | 21, 28, 32 |
| IP_LEC_03 | ds.practice.p7-ip-ignored-return | Separate a returned value from caller state | 10, 15, 21 |
| IP_LEC_03 | ds.practice.p7-ip-nested-argument-order | Evaluate an inner call before its enclosing call | 10, 11, 12, 13 |
| IP_LEC_03 | ds.practice.p7-ip-two-value-call | Pass the same expression into independent parameters | 20, 21, 22 |
| IP_LEC_03 | ds.practice.p7-ip-void-return-path | Follow output around an early void return | 14, 15 |
| IP_LEC_04 | ds.practice.p7-ip-constructor-chain | Trace delegated construction without creating a second object | 7, 8, 9, 10 |
| IP_LEC_04 | ds.practice.p7-ip-alias-versus-instance | Separate one shared object from one independent object | 23, 24, 25, 26, 27, 28 |
| IP_LEC_04 | ds.practice.p7-ip-validated-setter | Preserve an invariant across accepted and rejected updates | 31, 32, 33, 34, 35 |
| IP_LEC_04 | ds.practice.p7-ip-shared-limit-snapshot | Separate construction-time state from a later shared limit | 14, 15, 31, 35 |
| IP_LEC_05 | ds.practice.p7-ip-prefix-in-place | Track reads after earlier array writes | 18, 19, 20, 21 |
| IP_LEC_05 | ds.practice.p7-ip-loop-value-copy | Distinguish changing a loop variable from changing an element | 5, 6, 7, 13, 14, 15 |
| IP_LEC_05 | ds.practice.p7-ip-branching-recursion | Combine two recursive subresults with different base cases | 24, 25, 26, 27 |
| IP_LEC_05 | ds.practice.p7-ip-search-no-match | Trace a safe failed search without reading past the end | 22, 23 |
| IP_LEC_06 | ds.practice.p7-ip-capacity-versus-size | Keep occupied slots separate from storage capacity | 3, 4, 9 |
| IP_LEC_06 | ds.practice.p7-ip-remove-gap | Check compaction after removing an internal element | 29, 35, 36, 37 |
| IP_LEC_06 | ds.practice.p7-ip-duplicate-before-capacity | Preserve set semantics while space remains | 11, 12, 13, 44, 45, 47 |
| IP_LEC_06 | ds.practice.p7-ip-intersection-count | Distinguish intersection from union and storage slots | 45, 48, 49 |
| IP_LEC_07 | ds.practice.p7-ip-shared-component | Observe a shared component through two owners | 3, 6, 8, 12 |
| IP_LEC_07 | ds.practice.p7-ip-list-insert-index | Follow index changes after insertion | 16, 17, 18, 28 |
| IP_LEC_07 | ds.practice.p7-ip-copy-list-share-elements | Distinguish copying a container from copying its elements | 13, 16, 18, 27, 28 |
| IP_LEC_07 | ds.practice.p7-ip-replace-component | Distinguish replacing a component reference from mutating it | 8, 9, 10, 11, 12 |
| IP_LEC_08 | ds.practice.p7-ip-boundary-test-exposes | Identify which boundary check exposes the defect | 28, 31, 44 |
| IP_LEC_08 | ds.practice.p7-ip-fresh-fixture | Detect test interference caused by shared mutable state | 10, 12, 13, 24 |
| IP_LEC_08 | ds.practice.p7-ip-observation-contract | Compare weak and precise tests of the same wrong result | 28, 31, 37, 41 |
| IP_LEC_08 | ds.practice.p7-ip-collaboration-test | Separate a component test from a collaboration test | 24, 25, 26, 27, 41 |
| IP_LEC_09 | ds.practice.p7-ip-super-and-override | Combine inherited state with an explicit parent call | 22, 36 |
| IP_LEC_09 | ds.practice.p7-ip-field-hiding | Separate a hidden field from an overridden method | 26, 36 |
| IP_LEC_09 | ds.practice.p7-ip-inherited-mutator | Trace inherited mutation used by a specialized calculation | 4, 6, 8, 10 |
| IP_LEC_09 | ds.practice.p7-ip-cast-keeps-object | Understand that a reference cast does not construct an object | 25, 26, 28, 35 |
| IP_LEC_10 | ds.practice.p7-ip-interface-array | Dispatch a common operation across different implementations | 2, 9, 10, 11 |
| IP_LEC_10 | ds.practice.p7-ip-template-dispatch | Trace an abstract hook called by inherited code | 5, 9 |
| IP_LEC_10 | ds.practice.p7-ip-static-versus-dynamic | Separate static method hiding from instance dispatch | 4, 5 |
| IP_LEC_10 | ds.practice.p7-ip-covariant-result | Follow a covariant return through a base reference | 3, 4, 5 |
| IP_LEC_11 | ds.practice.p7-ip-equality-symmetry | Expose a broken symmetry rule across a hierarchy | 6, 11, 14 |
| IP_LEC_11 | ds.practice.p7-ip-equal-key-replacement | Track equal keys replacing one map entry | 16, 18, 20, 25 |
| IP_LEC_11 | ds.practice.p7-ip-contract-projection | Check whether the hash depends on exactly the equality state | 11, 20, 24, 25 |
| IP_LEC_11 | ds.practice.p7-ip-null-value-equality | Separate nullable fields from a null compared object | 5, 6, 11 |
| IP_LEC_12 | ds.practice.p7-ip-finally-return-value | Separate a captured primitive return from cleanup state | 20, 21 |
| IP_LEC_12 | ds.practice.p7-ip-catch-specific-path | Follow propagation to the first compatible handler | 18, 19, 20, 21 |
| IP_LEC_12 | ds.practice.p7-ip-rethrow-cleanup | Trace nested cleanup when a handler rethrows | 16, 18, 20, 21, 23 |
| IP_LEC_12 | ds.practice.p7-ip-numeric-failure-kinds | Distinguish a floating-point special value from an exception | 4, 27 |
| IP_LEC_13 | ds.practice.p7-ip-trace-first-divergence | Locate the effect of updating the wrong accumulator | 21, 23, 24 |
| IP_LEC_13 | ds.practice.p7-ip-watch-state-change | Identify which operations actually change the observed field | 27, 30, 35 |
| IP_LEC_13 | ds.practice.p7-ip-conditional-observation | Predict values at a conditional observation point | 23, 24, 34, 35 |
| IP_LEC_13 | ds.practice.p7-ip-parameter-evidence | Use caller and callee observations to isolate a failed swap | 21, 23, 25, 27 |
| IP_LEC_14 | ds.practice.p7-ip-token-line-boundary | Track the boundary between token and line reads | 47, 49, 50, 51, 52, 53, 54 |
| IP_LEC_14 | ds.practice.p7-ip-immutable-text | Separate a returned transformed string from its receiver | 47, 48, 55, 56 |
| IP_LEC_14 | ds.practice.p7-ip-generic-storage | Follow typed values through a generic container | 64, 65, 66, 67, 68, 71, 79 |
| IP_LEC_14 | ds.practice.p7-ip-refactor-side-effect | Check whether extracting a calculation preserves observable behavior | 8, 9, 10, 23 |
| IP_LEC_15 | ds.practice.p7-ip-records-and-empty-lines | Distinguish an empty line from end of input | 73, 74, 75 |
| IP_LEC_15 | ds.practice.p7-ip-validated-records | Reject malformed records without losing earlier accepted data | 43, 44, 46, 50, 51 |
| IP_LEC_15 | ds.practice.p7-ip-flush-buffer | Observe buffered output before and after flushing | 81, 82, 83 |
| IP_LEC_15 | ds.practice.p7-ip-resource-cleanup-order | Follow cleanup after an exception inside a resource scope | 73, 75 |
| IP_LEC_16 | ds.practice.p7-ip-character-eof | Keep an EOF marker distinct from a character code | 20, 21, 22, 23 |
| IP_LEC_16 | ds.practice.p7-ip-typed-roundtrip | Read typed fields in the same order they were written | 10, 43, 44, 45 |
| IP_LEC_16 | ds.practice.p7-ip-bounded-read | Use the returned count instead of the whole destination array | 21, 22, 23, 24 |
| IP_LEC_16 | ds.practice.p7-ip-closed-reader | Distinguish EOF from using a closed buffered reader | 26, 27, 28, 29 |
| IP_LEC_17 | ds.practice.p7-ip-pipeline-order | Compare slicing before and after removing duplicates | 31, 32, 35, 36 |
| IP_LEC_17 | ds.practice.p7-ip-lambda-capture-object | Distinguish a fixed captured reference from mutable captured state | 17, 18, 19, 20 |
| IP_LEC_17 | ds.practice.p7-ip-optional-chain | Propagate absence through a mapped optional value | 45, 48, 49, 50, 51 |
| IP_LEC_17 | ds.practice.p7-ip-lazy-terminal | Distinguish constructing a pipeline from consuming it | 30, 31, 34, 36, 37 |
| IP_LEC_19 | ds.practice.p7-ip-exhaustive-enum-switch | Return one value from each enum case without fallthrough | 12, 16, 17 |
| IP_LEC_19 | ds.practice.p7-ip-record-shallow-state | Distinguish final record components from mutable referenced data | 21, 22, 23, 24 |
| IP_LEC_19 | ds.practice.p7-ip-custom-order | Apply a lexicographic comparison with a secondary key | 26, 27, 28, 29 |
| IP_LEC_19 | ds.practice.p7-ip-inferred-reference | Track a reassigned inferred variable separately from an earlier alias | 3, 4, 5, 6, 7 |
| IP_LEC_20 | ds.practice.p7-ip-joined-dependency | Establish a happens-before chain between two workers | 16, 17, 19, 20 |
| IP_LEC_20 | ds.practice.p7-ip-separate-workers | Combine independently owned results after both workers finish | 16, 17, 19, 20, 23 |
| IP_LEC_20 | ds.practice.p7-ip-locked-transfer | Preserve a shared invariant during compound transfers | 27, 28, 29, 31, 32 |
| IP_LEC_20 | ds.practice.p7-ip-reentrant-monitor | Recognize a synchronized call on the same object as reentrant | 29, 30, 31, 32 |
| CO_LEC_02 | ds.practice.p7-co-address-alias-write | Detect two address expressions naming one location | 35, 36, 37, 39 |
| CO_LEC_02 | ds.practice.p7-co-nested-restoration | Preserve a caller value across nested calls | 42, 44, 45, 47, 51, 52, 56, 58 |
| CO_LEC_02 | ds.practice.p7-co-wide-product | Keep the high half of an unsigned product | 24, 25, 27, 38, 40 |
| CO_LEC_02 | ds.practice.p7-co-stable-frame-base | Separate the frame base from temporary stack storage | 42, 44, 45, 55, 56, 57, 58 |
| CO_LEC_05 | ds.practice.p7-co-interpretation-triple | Separate representation rules for one stored word | 25, 27, 28, 29 |
| CO_LEC_05 | ds.practice.p7-co-decimal-carry-bcd | Carry between decimal digits before encoding BCD | 18, 19, 20, 26 |
| CO_LEC_05 | ds.practice.p7-co-inverse-wrap-add | Recover a missing operand from a wrapped unsigned result | 17, 18, 19, 20, 23 |
| CO_LEC_05 | ds.practice.p7-co-biased-range | Count a subrange in a biased encoding | 25, 31 |
| CO_LEC_06 | ds.practice.p7-co-narrowing-boundary | Find the smallest lossless signed width | 3, 7 |
| CO_LEC_06 | ds.practice.p7-co-fixed-rescale | Rescale a signed fixed-point value exactly | 3, 11, 12, 13, 14 |
| CO_LEC_06 | ds.practice.p7-co-normal-float-decode | Combine sign exponent and fraction fields | 15, 18, 19, 20, 21, 24 |
| CO_LEC_06 | ds.practice.p7-co-precision-boundary | Compare representable gaps across an exponent boundary | 15, 20, 21, 25, 26 |
| CO_LEC_07 | ds.practice.p7-co-format-footprint | Compare code size after preserving a destructive source | 15, 16, 17, 18, 19 |
| CO_LEC_07 | ds.practice.p7-co-destructive-destination | Trace the overwritten operand of a two-address ISA | 17, 18, 19 |
| CO_LEC_07 | ds.practice.p7-co-stack-operand-order | Recover subtraction order on a zero-address machine | 20, 21 |
| CO_LEC_07 | ds.practice.p7-co-instruction-boundaries | Track variable-length instruction locations | 9, 10, 11, 12 |
| CO_LEC_13 | ds.practice.p7-co-policy-divergence | Distinguish recency from arrival order | 14, 23, 28, 29, 30, 31, 33 |
| CO_LEC_13 | ds.practice.p7-co-associativity-overhead | Measure the tag-storage cost of extra associativity | 20, 24, 25, 26, 27 |
| CO_LEC_13 | ds.practice.p7-co-stride-conflicts | Contrast spatial locality with a conflicting access order | 8, 9, 14, 20, 21 |
| CO_LEC_13 | ds.practice.p7-co-miss-budget | Derive a maximum miss count from a latency budget | 9, 10, 11 |
| CO_LEC_14 | ds.practice.p7-co-unbalanced-stages | Account for the slowest stage and pipeline-register overhead | 5, 7, 8, 10, 11, 12 |
| CO_LEC_14 | ds.practice.p7-co-ready-cycle | Schedule a consumer after an explicitly timed producer | 18, 19, 20, 21, 22 |
| CO_LEC_14 | ds.practice.p7-co-branch-slot-state | Respect an always-executed branch delay slot | 23, 24, 25 |
| CO_LEC_14 | ds.practice.p7-co-clock-versus-cpi | Compare a faster clock with more lost cycles | 5, 18, 27, 28, 29, 32 |
| IP_LEC_18 | ds.guided.p7-reservation-conflicts | Model reservations with explicit overlap rules | 7, 13, 16, 17 |
| IP_LEC_18 | ds.guided.p7-pricing-strategies | Compose pricing rules without a type-switching UI | 7, 9, 17 |
| IP_LEC_18 | ds.guided.p7-transactional-import | Exam-style: Design an atomic import with a testable failure boundary | 4, 13, 16, 17 |
| IP_LEC_18 | ds.guided.p7-snapshot-versus-live | Exam-style: Choose ownership for a report that must not change later | 7, 13, 17 |
| IP_LEC_21 | ds.guided.p7-delimiter-implementation | Implement a formatter with an empty-input contract | 6, 7 |
| IP_LEC_21 | ds.guided.p7-stream-reconstruction | Replace an imperative transformation without changing order | 29, 30 |
| IP_LEC_21 | ds.guided.p7-polymorphic-extension | Exam-style: Implement and explain a polymorphic report calculation | 25, 26, 31, 32 |
| IP_LEC_21 | ds.guided.p7-failure-path-integration | Exam-style: Build a recoverable command-processing slice | 16, 21, 25, 30, 32 |


## Supplied-source completion review — 100 additional activities

The two explicitly supplied archives restore all 25 pending units: eight CO and seventeen R&L. All 32 canonical PDFs match the accepted index hashes. Relevant physical pages were inspected, including visual inspection of the CMOS topology and formal tree definition. Page numbers are physical PDF indices (animation frames can differ from printed slide numbers); UI whole-document source locators remain honestly broad.

Exactly four original activities were authored for each newly available unit: 38 bounded objective tasks and 62 unscored guided arguments/designs. No fifth activity was retained solely for volume. The prior 112 records and their content/grader locks remain byte-for-byte pinned by `scripts/expansion-accepted-checkpoint.json`. New definitions use separate version and grader locks, leaving all historical IDs/bindings intact.

All 38 objective answers are independently derived by `scripts/verify-completion.ts`: truth/quantifier enumeration, control/state simulation, graph permutation/closure checks, tree recursion, set construction and explicit memory/timing arithmetic. Tests include syntactically valid wrong answers, incomplete/malformed responses and saved-bound-version reload/retry. Open arguments are reviewed against authored criteria and reference constructions; this is an agent source/math review, not independent human certification or automatic proof verification.

During review, an imprecise new CMOS title was corrected from floating output to contention. Two draft proof variants were replaced before acceptance: a mirrored rational-extremum proof became rational-shift irrationality with a necessary-hypothesis counterexample; a shifted divisibility example became a complete sign-case repair including zero. These changes affect only newly authored records, not any previously accepted exercise. Original scenarios and countermodels develop source mechanisms without reproducing official question wording/answer keys or padding with number substitutions.

Practice guides use scaffolded fields; exam guides use a broad argument field and distinct tasks. The existing accessible GuidedPractice renderer is reused with a unique heading ID. New CO/R&L guides are lazy-loaded into both topic modes. Exam-style links now expose the actual tagged challenges instead of the obsolete placeholder; they do not create timed-mock readiness evidence. All 62 open tasks explicitly retain unsaved working-note and unscored boundaries.

The full regression initially found obsolete catalogue counts, the now-obsolete exam placeholder assertion, and two adaptive test fixtures selecting an arbitrary first matching exercise with the wrong answer arity. Counts/expectations now include new records while retaining explicit historical counts. The adaptive tests pin historical fixtures, preserving their original prerequisite-evidence assertions; no adaptive, mastery, readiness, grading, cloud or engine algorithm was altered.

### Newly supplied units and differentiated demands

- **CO_LEC_01**: Identify the architectural change behind reprogrammability; Separate elapsed-time improvement from energy use; Choose a technology under unattended-operation constraints; Distinguish architectural innovation from ecosystem adoption.
- **CO_LEC_04**: Determine a CMOS network through conduction paths; Separate transparent and held latch intervals; Apply simultaneous updates in a shift register; Diagnose output contention after a pull-up wiring error.
- **CO_LEC_08**: Count data-memory traffic after register reuse; Recover signed immediate capacity after opcode expansion; Design a load/store sequence under a register constraint; Evaluate a proposal to add a complex instruction.
- **CO_LEC_09**: Trace staging registers without write-through; Use one source with multiple destination gates; Repair a read that captures stale memory data; Reject an illegal single-bus optimization.
- **CO_LEC_10**: Reserve idle states in encoded control fields; Follow a conditional microprogram path; Separate a microcode repair from an ISA change; Prevent repeated side effects while waiting for memory.
- **CO_LEC_11**: Bound detection delay in periodic polling; Follow fixed-priority interrupt arbitration; Account for a ready signal arriving between clock edges; Explain a corrupted computation after returning from an ISR.
- **CO_LEC_12**: Find word lines touched by an unaligned byte request; Diagnose an access stride that loses interleaving; Calculate block completion with CPU/DMA overlap; Find the ownership bug in an asynchronous transfer.
- **CO_LEC_15**: Recover a serial fraction from a measured ideal speedup; Translate the same virtual address in two processes; Distinguish a translation-cache miss from a page fault; Classify instruction streams without confusing shared memory.
- **RL_LEC_00**: Supply the missing bridge in a practical argument; Track which conclusions follow from chained rules; Distinguish a true conclusion from a valid justification; Locate inconsistency before applying the policy.
- **RL_LEC_01**: Find assignments violating a two-part requirement; Count Boolean operators under a semantic restriction; Find where an implication differs from its converse; Resolve the meaning of an ambiguous “or”.
- **RL_LEC_02**: Discard an impossible product without discarding the formula; Propagate a forced literal through CNF; Separate premise satisfiability from argument validity; Repair a mistaken dualization of a normal form.
- **RL_LEC_03**: Compare one shared witness with separate witnesses; Count witnesses subject to two restrictions; Negate a restricted universal without losing its scope; Disprove a global witness claim using a small model.
- **RL_LEC_04**: Prove closure under an integer linear combination; Prove a rational construction lies strictly between two inputs; Locate a hidden zero-divisor in an algebraic proof; Separate finding a solution from proving uniqueness.
- **RL_LEC_05**: Choose a contrapositive for an odd product; Use sign cases to justify a basic absolute-value bound; Keep a rational shift from hiding irrationality; Repair a sign-case argument with a missing boundary.
- **RL_LEC_06**: Prove a reciprocal sum with an explicit successor term; Find the base cases needed for a two-step argument; Choose the starting index that makes an induction step valid; Diagnose using the successor claim inside its own proof.
- **RL_LEC_07**: Evaluate a recurrence with a changing increment; Prove a repeated-subtraction division loop; Use a conserved quantity to reject a target state; Explain why a preserved equation does not prove termination.
- **RL_LEC_08**: Locate a node using two traversal orders; Bound leaves under a height limit; Reconstruct a tree and explain why the split is forced; Disprove a mistaken full-tree criterion.
- **RL_LEC_09**: Keep an empty set distinct from its singleton; Find elements lying in exactly two of three sets; Prove a difference identity by tracking an arbitrary element; Explain why pairwise overlap is not a common witness.
- **RL_LEC_10**: Remove the diagonal from an overlapping product; Count a shared set of ordered pairs; Prove distribution without flattening ordered pairs; Prove a prefix condition for a recursively defined language.
- **RL_LEC_11**: Separate incoming and outgoing edges; Count valid orders after a fork and join; Prove a minimum edge removal rather than guessing; Derive a count for a nonbinary full tree.
- **RL_LEC_12**: Repair a missing transitive pair; Compute a finite function’s image and largest fiber; Infer the property forced by a left inverse; Distinguish inconsistent equations from underdetermined ones.
- **RL_LEC_13**: Build a fair enumeration of two overlapping lists; Construct the missing sequence without decimal ambiguity; Locate the assumption behind a self-membership contradiction; Reject a timeout as a universal halting decider.
- **RL_LEC_14**: Evaluate a function that treats leaves separately; Separate edge count from incident weight; Define total node depth with enough recursive information; Prove that mirroring twice restores an ordered tree.
- **RL_LEC_15**: Prove a shortest derivation claim with a length invariant; Certify an optimum when total volume gives a weak bound; Give both soundness and completeness of a recursive definition; Prove a product loop with its boundary input.
- **RL_LEC_16**: Enumerate a constrained infinite language fairly; Separate complete assignment from one shared destination; Repair a type-confused implication about subsets; Show why sharing a tag does not partition records.
