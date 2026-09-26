# Calculus practice expansion

Baseline: production v31, `820febc7fa08cff5beffc5ca905f2ec6bb2fecbd`.

## Scope and sources

The imported course already contained 100 questions, ten per topic, and 20
skills. The expansion adds 20 original questions, two per topic, for 120 total.
The original 100 prompts, solutions, source bindings and grader fingerprint
are unchanged. Existing choice and integer exercises supply fundamentals;
the additions supply standard, hard and multipart exam-style reasoning.

Source scope is the imported `calculus.json` lessons and their lecture locators,
not a newly verified university syllabus. The original lecture files were not
available at their former Downloads paths during this expansion. The request's
textual exam-panel example was available, but no exam screenshot was attached.
No examination wording was copied. Existing source limitations remain visible.

## Mathematical review

All original topic prompts and explanations were read; the additions were
independently worked through, including boundary and convergence conditions.

| Topic / additions | Reference checks |
| --- | --- |
| Functions / 101-102 | Both limits are 3; left slope is 0, so a=3, b=0. Domain excludes endpoints +/-3 and the pole 1, leaving four integers. |
| Derivatives / 103-104 | Quotient and chain rules give 2x/(1+x^2)^2 and 2(1-3x^2)/(1+x^2)^3. Inflections have y=1/4. Implicit differentiation at (0,2) gives slope -6 with nonzero y coefficient. |
| Integrals / 105-106 | Substitution then parts gives ln(2)-1/2. Positive integrand comparison proves both strict bounds. The second integrand is the derivative of x^3/(1+x^2), with endpoint difference 1. |
| Improper integrals / 107-108 | x=exp(t) gives t exp(-(p-1)t), converging exactly for p>1 to 1/(p-1)^2. Rationalization of the sequence gives 6/(sqrt(1+3/n)+1), tending to 3. |
| Series / 109-110 | Magnitudes decrease from n=1 and tend to zero; harmonic limit comparison excludes absolute convergence. Next-term bounds fail at N=98 and succeed at N=99. Differentiated geometric series at 1/3 equals 3/4, hence scaled answer 9. |
| Taylor / 111-112 | Product coefficients through degree four are 1,1,0,-1/3,-1/6; fourth derivative -4. The x^6 coefficient of ln(1+x^2) is 1/3, giving 720/3=240. |
| Partial derivatives / 113-114 | Axis restrictions are zero, but x=y^2 gives 1/2. Partials exist without continuity/differentiability. Differentiating x exp(xy) in both variables yields x exp(xy)(2+xy), giving 2. |
| Gradients / 115-116 | All three triangle edges checked; unique minimum 0 at origin, maximum 4 at (2,0),(0,2). The composed path expands as t+t^2+O(t^3), giving second derivative 2. |
| Complex roots / 117-118 | Roots have modulus 2 and angles -pi/6+2k pi/3; product -8i, sum zero. Disjoint conjugate roots give z^6+64. Dividing the unity equations gives z^2=1 and both roots satisfy both originals. |
| Double integrals / 119-120 | Reversed bounds y^2<=x<=y on [0,1] give integral 1/12, area 1/6 and average 1/2. Triangle area 2 and integral of x+y equal 8/3 give mass 24-8=16. |

## Assessment boundaries

Ten new integer responses are automatically graded by the unchanged exact
integer grader. Signed values and leading zeros are equivalent; fractions,
decimals and arbitrary symbolic expressions are not silently treated as
equivalent. Such derivations belong in the ten new open multipart responses.
Open answers have saved per-part text and solution rubrics, but no correctness
score, Mistake Book entry, or mastery evidence. Their nominal points support
self-review only. Existing graded mistakes, retry, progress and Study Path
use the existing immutable attempt bindings.

Three mini sets (25/35/25 minutes, 13/19/13 nominal points) and one mixed
revision set (60 minutes, 25 nominal points) cover all twenty additions.
These are practice estimates, not a timed university-exam simulation or a
prediction of exam readiness. No new timer or exam-score persistence is added.

## Rendering and preservation

KaTeX is a build-only dependency. Trusted authored formulas become a restricted
MathML JSON tree; React creates the elements without raw HTML insertion.
Unrecognized formulas and all learner text remain escaped text. The build
checks the generated math against authored content. The original curriculum
grader fingerprint and all 100 old Calculus binding hashes are regression-tested.

## Browser verification

Local browser inspection covered one multipart question in each of the ten
topics (101, 103, 105, 107, 109, 111, 113, 115, 117, 119), including a 390px
mobile viewport. Formulas rendered and the document did not overflow sideways.
Question 101's three-part draft survived reload and submission displayed the
rubric without a score. An intentionally wrong response to 120 displayed the
reference 16 and appeared in Mistake Book / Review now, including rendered
integrals in its reasoning. No browser console warnings or errors were observed
in these checks. A separate binding comparison preserved all 820 historical
curriculum identities, not only the original Calculus identities.
