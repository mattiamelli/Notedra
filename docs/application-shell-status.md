# Step 2 — Application shell and academic navigation

## Final status

**Step 2 complete and verified on 9 September 2026.** All required application-shell, navigation, routing, index, regression and production acceptance checks pass. Step 3 was not started.

## Baseline and completed checkpoints

- Baseline: clean Git commit `e93a16e`, with 144 passing tests and validated Content Pack v1.0.1 / schema 1.1.0.
- Before changes: inspected Git status, the Step 1 verification report, application structure, Assembly integration/tests, and content/build gates. Step 1 was not restarted.
- `b90671f`: deterministic navigation projection, generator commands, production freshness gate, 14 new tests and routing/test dependencies. All 158 tests, typecheck and build passed at that checkpoint.
- `c3a887f`: complete shell and routes, generated course/topic pages, dashboard, neutral future-area placeholders, full-width Assembly integration, 72 new routing/UI tests and documentation. All 230 tests, typecheck and build passed before final production-browser verification.
- Final work: production deep links, browser Back/Forward, responsive checks, Assembly control regression, console and bundle inspection, final documentation and full command verification.

## Routing and UI architecture

React Router **7.18.3**, in declarative `BrowserRouter` mode, supplies standard History API navigation, nested route layouts, URL parameters, active navigation and Not Found routing. It fits the existing client-only React/Vite architecture without introducing a server or a new framework. Vite dev/preview supplies SPA fallback for deep links.

`src/App.tsx` defines routes; `src/shell/AppShell.tsx` provides navigation, breadcrumbs, document titles, skip-to-content, responsive layout and focus handling. Academic labels come from the generated index, while the small explicit route mapping associates the three canonical course IDs with `/co`, `/rl` and `/ip`. No topic paths are inferred from display names.

| Route | Verified behavior |
| --- | --- |
| `/` | Dashboard with canonical course cards and working tool/area links |
| `/dashboard` | Redirects to `/` using replace navigation |
| `/co` | Computer Organisation, 14 topics |
| `/rl` | Reasoning and Logic, 9 topics |
| `/ip` | Introduction to Programming, 20 topics |
| `/co/:topicId`, `/rl/:topicId`, `/ip/:topicId` | All 43 canonical topic shells; exact ID, title and course association |
| `/co/CO_T06_ASSEMBLY_X86_64/visualizer` | Existing complete Assembly workbench |
| `/practice`, `/exams`, `/progress`, `/mistakes`, `/study-plan` | Navigable neutral placeholders, each explaining its future purpose |
| Unknown URL, wrong-course topic or unknown topic ID | Deliberate Not Found with Dashboard recovery |

Topic pages include Overview, Mental Map, Flashcards, Practice, Exam-style and Mistakes tabs. Tabs support keyboard navigation and show explicit unavailable states. They contain no fabricated academic teaching content or working study engines.

The workbench is a lazy-loaded route and retains full viewport width. Its global header is supplied by DelftStudy; the simulator body is extracted from the former App rather than rebuilt. Menu, breadcrumbs and **Back to Assembly topic** connect it to the application. The original engine, parser, instruction logic, stack/memory/history semantics, UI panels, examples, stylesheet and tests remain unchanged.

One minimal change to the existing `useSimulator` autosave cleanup flushes the existing program draft before route unmount. A regression test first demonstrated that navigating within the 250 ms autosave delay could otherwise lose the draft. This fix uses the existing localStorage program key; it adds no persistence engine or new learning data. Leaving Assembly clears the execution timer and removes its keyboard listeners. Returning starts fresh execution from saved source/preferences; CPU history remains memory-only as before.

## Generated academic index

The trusted source is still the untouched v1.0.1 handoff JSON. The generator validates the complete release, then explicitly selects only navigation metadata. It writes `src/generated/academic-index.json` atomically and deterministically, with no timestamps.

- **Subjects: 3** — CSE1400_CO, CSE1300_RL and CSE1100_IP.
- **Topics: 43** — CO 14, R&L 9, IP 20.
- **Generated artifact: 7,462 bytes**, below the enforced 16,000-byte budget.
- Allowed subject fields: `subject_id`, `code`, `name`, `short`.
- Allowed topic fields: `subject_id`, `topic_id`, `name`, `order`.
- Every canonical topic is present exactly once and keeps its source name/course association. No invented IDs.
- A locale-independent canonical-ID sort gives reproducible ordering even if input arrays are reordered. Topic numbering comes from this stable per-course order.
- No questions, assessments, provenance, historical-frequency data, full relations, or complete handoff object is projected.

`generate:academic` regenerates the artifact; `check:academic` fails on missing, stale or edited output. Development and production commands generate it before use; direct Vite production builds also check freshness. The original content validation and browser-import guards remain unchanged and active. Only the generated projection is imported into browser modules.

## Exact final automated results

Final checks used the existing pnpm runner (the same package scripts as the requested npm commands), Node.js 24.19.0, Vitest 4.0.18, TypeScript 5.9.3 and Vite 7.3.6.

| Command | Result |
| --- | --- |
| `pnpm run validate:content` | PASS; zero integrity violations |
| `pnpm run check:academic` | PASS; exact 3-subject/43-topic artifact, 7,462 bytes |
| `pnpm test` | PASS; **230 tests in 8 files** |
| `pnpm run typecheck` | PASS; zero TypeScript errors |
| `pnpm run build` | PASS; content validation, generation, typecheck, freshness guard and bundling |
| `git diff --check` | PASS |

| Test suite | Passing tests |
| --- | ---: |
| Existing parser | 49 |
| Existing instructions | 34 |
| Existing execution/history/examples | 10 |
| Existing visualization/storage | 8 |
| Step 1 content validation | 39 |
| Step 1 production content gate | 4 |
| New academic index | 14 |
| New application routing/UI/integration | 72 |
| **Total** | **230** |

**86 new tests; all 144 Step 1 tests retained and passing.** New tests cover the exact index invariants, deterministic output despite input reordering, allowed fields/size, stale/missing output, atomic writing, frontend import restrictions, all 43 topic routes, all primary destinations, wrong-course/unknown routes, active navigation, browser Back/Forward, mobile menu state/focus, topic-tab keyboard interaction and routed Assembly behavior.

Assembly integration tests execute all three examples, test Previous/Next/Reset, loading errors, running/pausing, timer cleanup on departure, and preservation of an editor draft during immediate navigation. No existing Assembly or Step 1 tests were weakened or replaced.

Content validation again passed JSON Schema 2020-12; all canonical counts (90 documents, 28 IP / 29 CO / 33 R&L, 43 topics, 105 subtopics, 147 skills, 37 assessments, 489 questions, 17 question types, 22 patterns, 29 error tags); all eight relation counts (62, 69, 105, 147, 306, 37, 538, 2005); unique IDs/references and memberships; no orphan skills/duplicate edges; all prerequisite cycle and course-boundary checks; uncertainty/eligibility safety; unique-document historical frequency; all eight payload checksums and the pinned manifest. The full Step 1 report remains available unchanged.

## Production browser verification

Verified the actual built application at `http://127.0.0.1:4173/`, separate from the development preview:

- Direct deep links for all three course pages and all five product areas rendered their expected headings and canonical course topic counts.
- `/dashboard` resolved to `/`; a topic deep-link refresh worked; native browser Back returned to the course and Forward restored the topic.
- Wrong-course and unknown routes displayed Not Found and recovered to Dashboard.
- Course → Assembly topic → full workbench → topic navigation worked.
- Topic Flashcards selected its explicit unavailable state.
- Mobile/tablet navigation opened, closed with Escape, returned keyboard focus to its button, closed after selecting a course, and focused the new page content.
- Browser console inspection reported **no runtime errors or warnings** during the final production checks.

All three built-in Assembly examples were also executed through the production browser controls:

| Example | Actual result |
| --- | --- |
| Basic arithmetic | RAX = 8; RSP/RBP = 0x1000 |
| Stack frame | RAX = 15; RSP/RBP = 0x1000 |
| Function call | RAX = RBX = 7; RSP/RBP = 0x1000 |

Previous, Next, history restoration to the initial state, DEC/HEX, Run, Pause, automatic completion and Reset were checked in the production workbench. The function-call example was left reset after verification.

## Responsive verification

- Production shell: desktop at **1440 and 1024 pixels**, tablet at **768 pixels**, and mobile at **360 pixels**.
- All course/product-area deep links were checked at 360 pixels; the Assembly topic and mode tabs also fit at that width.
- Production workbench: **1440, 1024, 768 and 360 pixels**. Existing three-, two- and one-column responsive layouts were retained.
- At every checked width, document scroll width matched viewport width. Stack-cell overflow was **0 pixels**. The editor's intentional internal horizontal scrolling remains available.
- Screenshots and live DOM/layout checks were used; temporary viewport overrides were reset afterward.

## Bundle and preservation checks

The production output contains only HTML, CSS, favicon and two JavaScript chunks. The shell imports the small navigation projection; the workbench is loaded separately on demand.

- Main JavaScript: **252,625 bytes**.
- Lazy Assembly workbench JavaScript: **29,502 bytes**.
- Total JavaScript: **282,127 bytes**, versus the full handoff's approximately 4.28 MB.
- The original guard's real-build rejection tests still prove that full JSON and raw handoff imports are rejected.
- Frontend import scanning and production output inspection found no full handoff, question mappings, assessment/provenance payload, historical-frequency tables, or validation tooling.
- Academic source files, all Step 1 validation code/tests, Assembly engine/components/examples/styles and original tests have no diff from `e93a16e`.
- No v1.0.0 academic pack is used. No UNKNOWN/UNVERIFIED data was edited or promoted.

## Complete file inventory

Relative to baseline `e93a16e`: **27 added/modified files**. Generated output and installed dependencies remain ignored by Git.

| File | Status |
| --- | --- |
| `.gitattributes` | Modified |
| `README.md` | Modified |
| `docs/application-shell-status.md` | Added |
| `index.html` | Modified |
| `package.json` | Modified |
| `pnpm-lock.yaml` | Modified |
| `scripts/academic-index-guard.ts` | Added |
| `scripts/academic-index.ts` | Added |
| `scripts/generate-academic-index.ts` | Added |
| `src/App.tsx` | Modified |
| `src/AssemblyWorkbench.tsx` | Added |
| `src/academic/navigation.ts` | Added |
| `src/academic/types.ts` | Added |
| `src/generated/academic-index.json` | Added |
| `src/pages/CoursePage.tsx` | Added |
| `src/pages/DashboardPage.tsx` | Added |
| `src/pages/NotFoundPage.tsx` | Added |
| `src/pages/ProductAreaPage.tsx` | Added |
| `src/pages/TopicPage.tsx` | Added |
| `src/shell/AppShell.tsx` | Added |
| `src/shell/PageParts.tsx` | Added |
| `src/shell/ShellIcon.tsx` | Added |
| `src/shell/shell.css` | Added |
| `src/utils/useSimulator.ts` | Modified |
| `tests/academic-index.test.ts` | Added |
| `tests/application-routing.test.tsx` | Added |
| `vite.config.ts` | Modified |

## Warnings, limits and handoff

- No outstanding acceptance failures or unfinished Step 2 functionality remain.
- One development-only transitive dependency, jsdom's `whatwg-encoding@3.1.1`, emitted a deprecation warning during installation. No browser/build/runtime warning was reported; it is not bundled into the app.
- A static host other than the verified Vite dev/preview environment must provide SPA fallback to `index.html`. No deployment, server, authentication, database or cloud service was added.
- The inherited Assembly minimum viewport is 360 pixels. Execution history is not persisted across route departure; the existing program and display preferences are preserved locally.
- Topic modes and the five future product areas are intentionally shells. **No fake user data, percentages, mastery, readiness, streaks, grades, recommendations or completion values were added.**
- No learning-state/persistence engine, adaptive study logic, grading, question generation, analytics or other Step 3 functionality was implemented.

**Stop after Step 2. Step 3 was not started.**
