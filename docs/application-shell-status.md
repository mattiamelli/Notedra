# Step 2 — Application shell and academic navigation

Baseline: clean Git commit `e93a16e`. Step 1 is preserved: 144 passing tests, trusted Content Pack v1.0.1/schema 1.1.0, validated production build. The Step 1 verification report, application structure, Assembly integration/tests, and content/build gates were inspected before changes.

Scope: application shell, routing, generated academic navigation, course/topic shells, neutral product-area placeholders, and integration of the existing Assembly tool. No study engines, invented progress, academic data changes, cloud services, or Step 3.

Completed checkpoint: deterministic academic-index generator, development/build commands, production freshness gate and 14 new tests. Generated output: 3 subjects, 43 topics, 7,462 bytes. All 158 tests, typecheck and production build pass. The existing application still runs unchanged at this checkpoint.

React Router 7.18.3 is installed for the upcoming shell; jsdom 26.1.0 is a development-only dependency for routing/UI tests. Installation reported one deprecated transitive package, `whatwg-encoding@3.1.1`, used by jsdom; it is not a browser dependency.

Next: connect the global shell and routes, reuse the Assembly workbench, add routing/UI tests, then verify production navigation/responsiveness and finish documentation. Do not start Step 3.
