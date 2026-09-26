# Calculus: complete twenty-per-topic practice bank

Baseline: v33, source `88e44b5630ec368c892421c0c3dfe89f958f1069`.
The previous Calculus content release was v32; v33's shared exercise UI is retained.

## Inventory and scope

120 existing exercises become 200: eight new authored problems in each of ten
topics, with 20 exercises per topic. IDs CALC_E121 through CALC_E200 are new;
the 120 existing Calculus records and all 840 existing curriculum bindings are
preserved. The four existing mini/revision sets remain unchanged.

Each topic adds four exact-integer questions and four guided open responses.
The complete banks retain fundamentals and add standard, conceptual, harder and
multipart practice. No random parameter templates or copied exam questions are
used. Integer outputs sometimes explicitly scale a fractional result; the
scaling is stated in both prompt and solution. Arbitrary symbolic expressions
are not accepted by the integer grader. Open responses stay ungraded self-check
work: nominal points do not create correctness, mastery or mistake evidence.

## Source boundaries

All ten imported lessons, skill definitions, source locators, original 100
questions and earlier 20 additions were inspected for coverage and duplication.
The sources are the imported course lessons in `src/curriculum/calculus.json`,
grounded in the already inventoried lecture transcription. Original Downloads
files were not available at the previous path in this run. This is not a fresh
verification of the original PDFs, university syllabus, exam archive or official
answer keys. Existing source IDs and limitation copy remain unchanged.

## Mathematical review by topic

Each new prompt, its reference derivation and its rubric was worked through.
This is author review with regression calculations, not an independent human
review or a symbolic proof of all answers. Tests independently recompute all 40
integer references and additionally check selected open-problem identities,
numerical integrals, sequence formulas, bounds and roots. Numerical quadrature
checks corroborate, rather than replace, the analytical explanations.

| Topic | IDs | Distinct coverage and checked edge cases |
| --- | --- | --- |
| Functions | 121-128 | Fractional inverse and excluded range; ordered composition domains; removable hole versus pole and one-sided signs; bounded oscillation; nonlinear epsilon-delta proof; principal inverse-trig signs; cusp continuity; negative-infinity rationalization. Composition excludes exactly two integer inputs; the rationalized limit is 3. |
| Derivatives | 129-136 | Variable exponent; cusp minimum; strict logarithmic MVT bounds; Newton two-cycle; geometric area optimization; inverse derivative; tangent-error certification; second-order cancellation. Rectangle maximum is 32 at half-width 2; square-root tangent error is bounded by 1/6400. |
| Integrals | 137-144 | Noninjective substitution; second derivative of an accumulation; cyclic parts; translated bounds; displacement versus distance; boundary data in parts; reflection symmetry; Riemann width. Branch contributions are 1/3 each; travel is 4 versus displacement 4/3; reflection integral is pi squared / 4. |
| Improper integrals / sequences | 145-152 | Separate zero and infinite endpoints; logarithmic singularity; principal value distinction; derivative-limit sequence; shrinking alternating error; tail tolerance; reciprocal recurrence; vanishing oscillation. Parameter range is strictly 0<p<1; negative and positive divergent halves cannot cancel; nonlinear recurrence is 1/(n+1). |
| Series | 153-160 | Factorial/exponential ratio; gap-two telescope; two-sided integral remainder; difference of geometric sums; failed alternating hypothesis; zero-based error indexing; logarithmic parameter test; partial sums. Ratio limit is 1/e; certified tail indices distinguish inclusive thresholds from exact-error minima; eventual decrease suffices for any real p. |
| Taylor | 161-168 | Differentiated endpoints; removable quotient derivative; shifted geometric remainder; parity; sparse integrated powers and both endpoints; cancellation order; signed Taylor remainder; sparse-power radius. Endpoint convergence need not survive differentiation; fifth-scaled fourth derivative is 1; exact reciprocal remainder is h^4/[16(2+h)]; radius is 2, not 4. |
| Partials | 169-176 | Intersected domain and deleted logarithmic curve; plane evaluation versus exact function; all lines versus a parabola; vector orthogonality; differentiability remainder; coupled logarithmic second partial; degenerate level set; independent coordinate. The curved path is 1/2 despite all line limits being zero; linearization remainder is bounded uniformly by 4r^2+r^3. |
| Gradients | 177-184 | Path speed versus unit direction; stationary-point count; parameterized Hessian including degeneracies; level-curve velocity; boundary extrema without stationary points; second-order path change; disk extrema; gradient reconstruction. Speed is 10; degenerate quadratics have entire minimum lines; disk extrema occur at all four equality cases. |
| Complex numbers | 185-192 | Conjugate linear equation; quotient modulus; translated roots; multiplicity versus distinct count; purely imaginary unit-circle quotient; strict half-plane count; reconstruct real polynomial; quarter-turn coordinate. Translated roots lie radius 2 from 1; conjugate identity excludes z=1; cubic constant term is 5. |
| Double integrals | 193-200 | Three-piece order reversal; partial odd cancellation; nonrectangular nonseparability; density normalization; nonlinear average versus centroid; curved area; order reversal enabling substitution; average with unknown constant. Reversed widths total area 2; triangular product integral is 1/8; average x squared is 1/6, not 1/9; reversed cosine integral is sin(1)/3. |

## Preservation and acceptance

The existing exact grader, open/self-check pathway, routes, UI, learning state,
source bindings, analytics and cloud configuration are not edited. Generated
binding and restricted MathML artifacts are refreshed from authored source.
Regression checks require 20 exercises per topic, unique IDs/prompts, source
references, rendered math, all prior binding hashes, signed/zero-padded integer
equivalence, invalid-fraction rejection, draft retention and ungraded open work.
Release acceptance also requires full tests, typecheck, build, hardening, CI and
live topic-level inspection before reporting completion.
