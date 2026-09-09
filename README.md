# DelftStudy — Practice & x86-64 Assembly Visualizer

A browser-based study workspace for a first-year Computer Science & Engineering student at TU Delft. Browse the canonical Computer Organisation, Reasoning and Logic, and Introduction to Programming topics, practise six authored exercises with deterministic feedback, or open the working x86-64 Assembly Visualizer to inspect registers, stack frames, and execution.

DelftStudy makes stack frames and function calls visible. It uses a real, deterministic simulation engine; no AI service, backend, remote database, account, or login is needed to run the application.

## Application navigation

The Dashboard links to three courses, all 43 canonical topics, the Assembly workbench, and the future study areas. Course/topic names and relationships come from a generated navigation index derived from the trusted academic pack. There are no invented mastery, readiness, grade, completion, or streak values.

| Route | Page |
| --- | --- |
| `/` | Dashboard (`/dashboard` redirects here) |
| `/co` | CSE1400 — Computer Organisation; 14 topics |
| `/rl` | CSE1300 — Reasoning and Logic; 9 topics |
| `/ip` | CSE1100 — Introduction to Programming; 20 topics |
| `/co/:topicId`, `/rl/:topicId`, `/ip/:topicId` | Canonical topic shell; IDs are case-sensitive and must belong to the course |
| `/co/CO_T06_ASSEMBLY_X86_64/visualizer` | Full Assembly workbench |
| `/practice` | Six authored exercises, course filter and actual saved attempts |
| `/practice/:exerciseId` | Exercise preview and explicit Start |
| `/practice/:exerciseId/attempts/:attemptId` | Saved draft or immutable submitted-answer review |
| `/exams`, `/mistakes`, `/study-plan` | Neutral, navigable placeholders for future study tools |
| `/progress` | Unassessed progress placeholder plus local student backup/restore controls |
| Any unknown route or invalid course/topic association | Not Found, with a working Dashboard link |

React Router's declarative `BrowserRouter` provides clean URLs and native Back/Forward navigation. Desktop pages use a sidebar; mobile/tablet navigation is an expandable menu with an accessible expanded state, Escape-to-close and focus handling. Page titles and breadcrumbs follow the current route. The three relevant topic pages link to authored practice. Other study modes remain explicit placeholders.

The Assembly workbench opens at full viewport width so the shell does not change its responsive breakpoints. The menu, breadcrumbs and **Back to Assembly topic** link connect it to the surrounding application. Leaving the tool stops its running timer and removes its keyboard listeners. Returning starts a fresh execution using the locally saved source/preferences; existing history remains in memory only. Pending editor autosave is flushed on departure so a quick navigation cannot lose the current draft. Student records use the separate IndexedDB repository described below; the Assembly namespace and format are unchanged.

Vite development and production-preview servers support refreshing deep links. A different static host must serve `index.html` for application routes (SPA fallback); no backend is required. Hosting configuration/deployment is outside this local-only task.

## Assembly features

- Editable, syntax-colored assembly with line numbers and a clear next-instruction marker.
- Load, step forwards, step backwards, run, pause, and reset.
- Eight 64-bit registers represented with `bigint`, with signed decimal and hexadecimal display.
- A downward-growing stack showing addresses, RSP/RBP markers, local variables, return addresses, writes, pushes, and pops.
- Deterministic explanations of each instruction, including stack-frame setup and teardown.
- Immutable CPU snapshots and clickable execution history, including the initial state.
- Three built-in examples: arithmetic, local stack variables, and a function call.
- Responsive dark interface, keyboard controls, visible focus, and reduced-motion support.
- Device-local program and number-format preferences using `localStorage`.

## Screenshots

Screenshot placeholder: add a desktop workbench image showing the Stack frame example after storing both local variables.

## Installation

Use Node.js 22.13 or newer and npm. From this project directory:

```bash
npm install
```

The repository also includes a `pnpm-lock.yaml` for reproducible installation with pnpm:

```bash
pnpm install --frozen-lockfile
```

## Development

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173/`.

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run dev` generates the academic navigation and student-reference projections and validates the practice catalog before starting Vite. `npm run build` validates the trusted Content Pack, regenerates both projections, validates the six exercise definitions and grader locks, type-checks the project, and creates a static application in `dist/`. Vite independently enforces content validation and index consistency for direct production builds. Serve `dist/` through a static HTTP host with SPA fallback. No server-side application code is required. The existing `.openai/hosting.json` is retained deployment metadata and is not needed for local development.

## Academic Content Source of Truth

The supported academic source is **DelftStudy Content Pack v1.0.1**, using **schema 1.1.0 (JSON Schema 2020-12)**. The nine original release files are preserved byte-for-byte in [`content-pack/v1.0.1/`](content-pack/v1.0.1/).

- Academic source of truth: [`DelftStudy_Codex_Handoff_Pack.json`](content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json).
- Operational rules: [`INSTRUCTIONS_FOR_CODEX.md`](content-pack/v1.0.1/INSTRUCTIONS_FOR_CODEX.md).
- Schema: [`DelftStudy_Content_Pack.schema.json`](content-pack/v1.0.1/DelftStudy_Content_Pack.schema.json).
- **v1.0.0 must not be used**, merged, or used to infer missing data.
- `UNKNOWN`, `UNVERIFIED`, `PARTIALLY_UNVERIFIED`, and `LOW` values must remain unresolved unless verified against an original source. Uncertain mappings cannot generate source-derived variants, update individual skill mastery, contribute weighted exam readiness, or count as verified historical evidence. Uncertainty in a source locator or difficulty component remains distinct from mapping confidence.
- Source-document records and PDF hashes are embedded; the **90 original PDF binaries and full PDF text are not**. The validator does not open or hash those PDFs.

Step 1 established the trusted source and development safeguards. Step 2 added navigation and page shells. Step 3 added local student storage and a resume link. Step 4 adds six separately authored exercises and deterministic item feedback. The Assembly engine, parser, memory, stack/history semantics and examples remain unchanged. The full handoff JSON is not imported into the frontend; the production guard continues rejecting browser imports from the pack and validation-tooling directories.

```bash
npm run validate:content
npm test
npm run typecheck
npm run build
```

These scripts also work with `pnpm` in place of `npm`. Release/CI jobs must run the tests and production build; a failing content check exits unsuccessfully and blocks production output.

Validation checks the exact canonical counts, canonical IDs and references, all eight relation tables, prerequisite cycles/course boundaries, uncertainty policies, and historical frequency aggregated by unique eligible assessment documents. Practice/example documents never count as official sittings. Diagnostic fields explicitly including low-confidence or practice evidence are kept separate from verified counts; fields explicitly named reference counts remain reference counts.

All eight manifest payload checksums and file sizes are checked. Because the supplied manifest deliberately omits its self-checksum, its SHA-256 is independently pinned in the validator. `.gitattributes` prevents line-ending conversion of the release files. Do not fix validation failures by editing academic data or regenerating hashes; obtain and review a new audited release as a separate change.

Ajv and tsx are development-only dependencies. Ajv's 2020-12 implementation validates the supplied schema directly. Its optional `strictRequired` lint is disabled because conditional requirements refer to properties declared in parent schemas; required-field validation stays enabled. Schema compilation is cached by content hash, so repeated validation is safe and a changed schema cannot reuse a stale compiled schema merely by retaining its `$id`.

The mutation tests operate on in-memory copies. Separate build tests prove that Vite rejects invalid content and full handoff imports, including raw imports. See the [Step 1 verification report](docs/content-integration-status.md) for exact results and the complete file inventory.

### Generated academic navigation

[`scripts/generate-academic-index.ts`](scripts/generate-academic-index.ts) validates the immutable release before generating [`src/generated/academic-index.json`](src/generated/academic-index.json). This **7,462-byte** projection contains exactly 3 subjects and 43 topics, with an explicit allowlist: canonical subject ID, course code/name/short name, topic ID/name/subject ID, and display order. No questions, assessments, provenance, frequency tables or full relations are included.

Ordering uses a locale-independent sort of canonical IDs; the course's zero-padded topic identifiers provide its stable order. Generation is byte-deterministic even if source-array order changes, contains no timestamp, and replaces the generated artifact atomically. Do not hand-edit the generated file. It is committed for reproducibility and generated again before development/production builds. The index has a 16 KB size budget.

```bash
npm run generate:academic
npm run check:academic
```

`check:academic` verifies the trusted source and fails if the artifact is missing, stale or edited. Direct `vite build` also checks freshness. Academic navigation types and selectors are separate from the Assembly engine. Only the generated projection is imported by browser code; the Assembly component is loaded as a separate chunk when its route is opened.

See the [Step 2 verification report](docs/application-shell-status.md) for the full file inventory, route/UI tests, bundle analysis and responsive checks. The Step 3 storage foundation and Step 4 practice flow are documented below.

## Local student data — Step 3

Visiting a valid topic saves a **Resume last topic** link on the Dashboard. It stores canonical course/topic identity and a timestamp, never an arbitrary URL. It does not redirect automatically or count visits as learning evidence. The Progress page contains the storage status, student backup export, validated restore preview, explicit replacement confirmation and recovery export.

Three independent layers remain separate:

1. Immutable Content Pack **1.0.1**, academic schema **1.1.0**.
2. Generated navigation and minimal canonical reference projections.
3. Mutable student schema **1**, in native IndexedDB database `delftstudy-student-v1` (database version 1).

The new **69,985-byte** student projection contains pack version/SHA-256, 3 subject IDs, 43 topic/course associations, 105 subtopic/topic associations, 147 skill/subtopic associations, and 489 source mapping locators with their owning course/topic IDs. Source locators are used only to validate optional attempt references; they are not runnable exercises. No assessment content, mapping-confidence payloads, provenance or historical-frequency tables are included. The existing navigation projection remains 7,462 bytes. Both artifacts are deterministic and checked during direct Vite builds.

```bash
pnpm run generate:references
pnpm run check:references
```

`StudentRepository` is a small asynchronous interface. The native implementation provides `load`, `saveResume`, `createDraft`, `editDraft`, `submit`, `abandon`, `exportBackup`, `exportRecovery` and `restore`. Step 4 uses these existing methods through a small PracticeService adapter. Tests use isolated fixtures; real student storage is never seeded with demonstration attempts.

Drafts have canonical identity, explicit targeted skills, optional exercise identity/version and source/template references, bounded text/choice/code answers, timestamps, revisions, and nullable hint/solution exposure. Unknown exposure stays unknown. Code is stored as text and never executed. Draft edits require the current revision; submitted/abandoned attempts cannot be edited. Repeating an identical submission operation is idempotent; conflicting reuse rejects. Retrying creates a new attempt ID. Future evaluation must use a separate evidence contract/store without rewriting original submissions.

**Every raw attempt remains UNASSESSED and ineligible for derived evidence**, including ungraded submissions, uncertain mappings, broad topic mappings and integrated IP work. Step 4 computes only per-item feedback in memory; it stores no evaluation and calculates no readiness or skill credit. Imported confidence, correctness, eligibility and mastery fields are rejected. Unknown source-page locators/difficulty are not reinterpreted as mapping confidence.

### Local saving, conflicts and backups

- Essential student writes happen immediately through IndexedDB transactions; no unload/beforeunload handler is required. Save success is reported only after transaction completion. Aborts, quota/permission failures, corruption and incompatible versions are surfaced; storage errors never silently reset data or return a successful empty dataset.
- The bounded dataset (at most 1,000 attempts and 4 MB per backup) is stored as one active record in a small object store. Transactions serialize read/validate/write operations. Distinct concurrent attempts are preserved; stale record revisions conflict. This favors straightforward correctness over a generalized synchronization system.
- Backup replacement validates everything before mutation, checks the persisted dataset generation and revision inside the write transaction, retains the prior snapshot, and replaces active data atomically. A fresh generation rejects pre-restore tabs even without cross-tab notifications. Use **Reload saved data** after a conflict. Blocked upgrades require closing other tabs; connection/permission failures may require a full page reload.
- **Export student backup**, then keep the downloaded JSON somewhere safe. To transfer or restore, choose that file, review the contents, check the replacement confirmation and press **Replace student data**. Cancellation changes nothing. No automatic merge occurs.
- **Export pre-restore recovery** downloads the immediately preceding dataset. Choose that file through the same confirmed restore flow to recover it. Each successful restore replaces the previous recovery snapshot; export an older recovery file before another restore if you need to retain it.
- Backups cover only the student namespace. Assembly editor/preferences remain under `delftstudy:v1:` in localStorage; CPU execution history remains in memory. No blanket clear-browser-storage action exists.
- Browser, device, hostname and port each define separate local storage. This is not cloud synchronization. Browser-data deletion, device failure and some crashes can lose local data even after a completed save. Exported backups provide a separate recovery copy.
- Only the actual new schema is supported. Unknown student/database versions, different academic fingerprints and malformed persisted data are preserved and refused; no speculative migrations or automatic corruption repair are implemented. Preserve existing browser data and use a compatible application/backup when incompatibility is reported.

The only new dependency is **fake-indexeddb 6.2.5**, development-only for reproducible storage tests. Runtime dependencies remain React, React DOM and React Router. The existing deprecated **whatwg-encoding 3.1.1** is transitive through development-only jsdom 26.1.0 (also through html-encoding-sniffer 4.0.0); no broad upgrade was performed.

The [Step 3 acceptance report](docs/learning-state-status.md) records exact tests, browser versions, the separate adversarial self-review, limitations and final verification. Native-browser checks can be reproduced with:

```bash
node --import tsx scripts/build-learning-browser-check.ts
pnpm exec vite preview --outDir .verification-dist --host 127.0.0.1 --port 4186 --strictPort
```

Open the printed URL, press **Run native storage checks**, reload the page, then press **Verify committed record after reload**. This is a separate production-mode test artifact with uniquely named test databases; it is never shipped in `dist/`. For actual UI tests, serve the application preview on an unused port and keep that origin isolated from your own data.

Step 4 adds Practice only. Exams, Mistakes and Study Planner remain placeholders. Step 5 has not been started.

## Shared practice — Step 4

Open **Practice**, filter by course if needed, choose an exercise, then press **Start exercise**. Browsing alone creates no attempt. Use **Save draft** before leaving; unsaved changes are clearly labelled. **Submit answer** saves the exact final response through the existing IndexedDB transaction and shows feedback only after it completes. Saved attempts have stable deep links. **Retry as new attempt** preserves the submitted record and marks prior solution exposure as known.

The catalog contains exactly six authored study items, two per course:

| Course | Exercises | Response format |
| --- | --- | --- |
| CO | Decimal 45 to eight binary digits; decimal 173 to two hexadecimal digits | Exact-width digits, outer whitespace ignored, hex case accepted |
| R&L | `(p ∧ q)`; `(¬p ∨ q)` | Four labelled rows, one T/F choice per row |
| IP | For-loop sum; while-loop with an even-number condition | Stable output choices for fixed Java snippets |

Each item shows its canonical topic/skill and lecture filename with the pack's actual whole-document page range. These are not official TU Delft questions, exact-slide citations, calibrated difficulty estimates or official grading weights. Only submitted graded responses reveal the reference explanation. Frontend answer keys are acceptable for this personal tool; it is not an anti-cheat examination system.

Definitions, attempts and feedback are separate. `templateRef` identifies the authored definition; `exercise.id` identifies a unique attempt instance; `exercise.version` locks the definition and executable grader SHA-256. Published versions must not be edited in place. New content/grading behavior requires a new version and lock, with old support retained or an explicit original-version-unavailable state. Builds verify fingerprints and source ownership; **do not regenerate locks merely to silence a failure**.

Pure graders return GRADED (0 or 1 raw item point), INCOMPLETE, INVALID, NOT_AUTOGRADABLE or ERROR. Only GRADED has points. No proof/keyword grading, free-form formula parser, learner-code execution, backend or AI is involved. Feedback is recomputed from the exact saved answer and locked definition; no feedback/evaluation fields are persisted, and raw attempts never become mastery/readiness evidence.

Writes are serialized. A failed save/submission retains the form answer, and a stale revision or restore generation blocks further writes until a safe reload. Copy the displayed recovery text before reloading a conflicted form. Unknown original versions preserve the answer without grading it as incorrect. Existing schema 1, database version 1, 1,000-attempt/4 MB limits and atomic recovery remain unchanged. Unknown imported hint/solution exposure stays unknown.

```bash
pnpm run validate:practice
pnpm test
pnpm run typecheck
pnpm run build
```

The [Step 4 acceptance report](docs/practice-engine-status.md) records all 370 tests, native-browser checks, source and version contracts, bundle sizes, self-review findings and intentionally untested environments. No Step 5 feature is implemented.

## Using the workbench

1. Choose an example, or paste AT&T assembly into the editor.
2. Press **Load Program** after editing. Loading validates the entire program and starts a fresh execution.
3. Press **Next Instruction**. The highlighted source line is always the instruction that will execute next; the explanation describes the instruction that just executed.
4. Inspect the changed registers and stack cells. **DEC / HEX** changes value formatting; stack addresses are always hexadecimal. RSP and RBP always show both formats.
5. Press **Run** to advance approximately every 650 ms. **Pause** stops between instructions.
6. Use **Previous** or select a history entry to restore its exact CPU state. Stepping forward through retained history restores the recorded snapshots.
7. **Reset** restores the loaded program's initial state and clears its execution history. Edited source is preserved; load it explicitly to execute the edits.

Keyboard shortcuts:

| Shortcut | Action |
| --- | --- |
| Ctrl/⌘ + Enter | Load the editor's program |
| Alt + Right arrow | Next instruction |
| Alt + Left arrow | Previous instruction |
| Escape | Pause |
| Tab in editor | Insert four spaces |
| Shift + Tab in editor | Move keyboard focus out of the editor |

The last edited source and display preference are stored on this browser and origin. Execution history is deliberately kept in memory and starts fresh after a reload. If browser storage is unavailable, the simulator continues working and reports the save limitation.

## Supported instructions

All instructions operate on 64-bit values in AT&T source-then-destination order.

| Instruction | Supported form | Meaning |
| --- | --- | --- |
| `movq` | `movq source, destination` | Copy a value |
| `pushq` | `pushq source` | Decrease RSP by 8, then store the source value |
| `popq` | `popq destination` | Read the stack top, increase RSP by 8, then write the destination |
| `addq` | `addq source, destination` | Add to the destination |
| `subq` | `subq source, destination` | Subtract from the destination |
| `imulq` | `imulq source, %register` | Keep the low 64 bits of a signed product |
| `incq` | `incq destination` | Add one |
| `decq` | `decq destination` | Subtract one |
| `leaq` | `leaq displacement(%base), %register` | Compute an address without reading memory |
| `call` | `call label` | Push the next instruction index and jump to a label |
| `ret` | `ret` | Pop an instruction index and return to it |

Supported operands:

```asm
$5                  # Decimal immediate
$-3                 # Negative immediate
$0x10               # Hexadecimal immediate
%rax                # Register
-8(%rbp)            # Base register plus displacement
8(%rsp)
(%rbp)              # Zero displacement
(%rsp)
```

Registers: `%rax`, `%rbx`, `%rcx`, `%rdx`, `%rdi`, `%rsi`, `%rsp`, `%rbp`. Any supported register may be a memory base. Blank lines and `#` comments are ignored; labels may share a line with an instruction. Labels are case-sensitive.

Invalid forms are rejected rather than silently accepted. Examples include immediate destinations, memory-to-memory arithmetic or moves, indirect calls, unsupported directives, and unknown registers. Two-operand `imulq` accepts immediate, register, or memory sources and requires a register destination.

## Execution and memory model

- Initial RSP and RBP are `0x1000`; the other registers start at zero.
- Execution begins at `main` when present, otherwise at the first instruction.
- Execution finishes when RIP reaches the end of the instruction list. Labels do not stop fall-through.
- `call` stores a **zero-based instruction index**, not a real machine-code address. The interface's instruction counter is one-based.
- A bare top-level `ret` has no caller: it raises an uninitialized-memory error unless the program has supplied a valid return address.
- Registers and memory words wrap to signed 64 bits using `BigInt.asIntN(64, value)`. Hexadecimal displays the same 64-bit bit pattern as unsigned.
- Memory is a sparse dictionary of aligned 8-byte words inside a simplified 1 MiB address space (`0x0000` through `0xFFFF8`). Unaligned, out-of-range, and uninitialized reads fail clearly.
- Reserving stack space does not initialize it. Popping a value does not erase the old memory cell.
- `pushq %rsp` uses the old RSP value. `popq %rsp` leaves the popped value in RSP. An RSP-relative pop destination is resolved after incrementing RSP.
- Register, memory, return-address metadata, and execution-position snapshots are frozen. A failed instruction leaves the last successful state unchanged.
- Automatic and manual execution stop at 2,000 recorded instructions to bound history memory usage. Reset after correcting unintended recursion or fall-through.

## Example programs

| Example | Expected result |
| --- | --- |
| Basic arithmetic | RAX = 8 |
| Stack frame | RAX = 15; RSP = RBP = `0x1000` |
| Function call | RAX = RBX = 7; RSP = RBP = `0x1000` |

The function example takes its input in RDI and returns its result in RAX. Its helper is placed **before** `main`: execution starts at `main`, calls the helper, returns, and then reaches the end cleanly. Placing a helper immediately after the caller would otherwise fall through into the helper again; jumps are outside this MVP.

## Project structure

```text
src/
  academic/
    types.ts
    navigation.ts     # Canonical selectors, stable course routes and page context
  generated/
    academic-index.json
    student-references.json
  learning/
    contracts.ts       # Bounded runtime validation and unassessed policy
    repository.ts      # Native IndexedDB, revisions, epochs and atomic restore
    LearningProvider.tsx
    StudentDataPanel.tsx
  practice/
    catalog.json       # Six authored definitions; immutable definition/grader locks
    catalog.ts
    validation.ts
    grading.ts         # Pure bounded graders; no code execution
    service.ts         # Adapter over the existing StudentRepository
    PracticePage.tsx
    ExercisePage.tsx
    AttemptPage.tsx
    ExerciseParts.tsx
    practice.css
  shell/
    AppShell.tsx
    PageParts.tsx
    ShellIcon.tsx
    shell.css
  pages/
    DashboardPage.tsx
    CoursePage.tsx
    TopicPage.tsx
    ProductAreaPage.tsx
    NotFoundPage.tsx
  components/
    CodeEditor.tsx
    ControlPanel.tsx
    RegisterPanel.tsx
    StackVisualizer.tsx
    InstructionExplanation.tsx
    ExecutionHistory.tsx
    Header.tsx
    Icon.tsx
  engine/
    types.ts          # Typed operands, instructions, CPU state, errors
    parser.ts         # Syntax and operand validation, labels, source lines
    cpu.ts            # Initial state, 64-bit normalization, freezing
    memory.ts         # Address validation and operand reads
    instructions.ts   # Instruction semantics and explanations
    executor.ts       # Transactional single-instruction execution
    session.ts        # Immutable history, seek, reset, safety limit
  examples/
    examplePrograms.ts
  utils/
    useSimulator.ts   # React execution controller and timer lifecycle
    stackRows.ts      # Bounded stack viewport around pointers
    storage.ts        # Local preferences and value formatting
  App.tsx            # BrowserRouter and application routes
  AssemblyWorkbench.tsx # Existing workbench, extracted from the former App
  main.tsx
  index.css
tests/
  parser.test.ts
  instructions.test.ts
  executor.test.ts
  visualization.test.ts
  content-validation.test.ts
  content-build.test.ts
  academic-index.test.ts
  application-routing.test.tsx
  learning-contracts.test.ts
  learning-repository.test.ts
  learning-ui.test.tsx
  student-references.test.ts
  practice-catalog.test.ts
  practice-grading.test.ts
  practice-service.test.ts
  practice-ui.test.tsx
  browser/             # Separate production-mode native browser acceptance harness
scripts/
  validate-content.ts
  validate-practice.ts
  practice-catalog.ts
  generate-academic-index.ts
  academic-index.ts
  academic-index-guard.ts
  generate-student-references.ts
  student-references.ts
  student-references-guard.ts
  build-learning-browser-check.ts
  content/           # Development-only schema, integrity, policy, frequency and build checks
content-pack/
  v1.0.1/            # Nine immutable audited release files
docs/
  content-integration-status.md
  application-shell-status.md
  learning-state-status.md
  practice-engine-status.md
```

The engine imports no React or browser APIs. The UI renders engine snapshots; it never implements instruction behavior. Runtime dependencies are React, React DOM and React Router. Vite, strict TypeScript, Tailwind CSS, Vitest, and jsdom provide development/testing tooling; Ajv and tsx support content validation and generation only.

## Testing

```bash
npm test
npm run test:watch
npm run validate:content
npm run typecheck
npm run build
```

The suite covers operand parsing, labels and errors, every supported instruction, memory/register transfers, RSP ordering, signed overflow, nested calls, return-address metadata, transactional failures, immutable history, all three complete examples, bounded stack rendering, and storage failures. It also tests content integrity, deterministic generation, all 43 topic routes, course associations, product routes, Not Found, browser Back/Forward, mobile navigation state/focus, topic tabs, and the existing Assembly controls within the router.

For an end-to-end check, run each built-in example and compare its registers with the table above. Also check Previous, history selection, Reset, Run/Pause, the current-line marker, decimal/hex display, invalid source, and restoration of source/preferences after refreshing.

## Limitations

This is a small educational interpreter, not a complete assembler or CPU emulator. It does not emit machine code, load executables, handle operating-system calls, implement register aliases, model flags, or simulate byte-addressable/overlapping memory. No assembler directives, data sections, indexed/scaled operands, indirect calls, or additional instruction forms are supported. Integer immediates are simplified 64-bit values rather than validated against each real encoding's narrower immediate field. Stack usage is visualized relative to the default `0x1000` origin, not an operating-system stack allocation.

The app has no TU Delft affiliation and is intended as a personal study aid.

## Educational purpose

This simulator intentionally implements a simplified subset of x86-64.
It is designed for learning stack frames, registers, memory and basic
function calls rather than perfectly emulating a physical CPU.

## Roadmap

- Flags register, `cmpq`, and conditional jumps: `jmp`, `je`, `jne`, `jg`, `jl`.
- Interactive memory inspector.
- Custom initial register values.
- Shareable programs through URLs.
- Exercises / challenge mode.
- Delft Computer Organization practice questions.
- Logic Trainer.
- Java exercise tracker.
- A complete DelftStudy dashboard.

A natural next feature is `cmpq` plus flags and conditional jumps, making loops and branches visible within the existing execution model.

## Verified MVP status

Final verification completed on 9 September 2026:

- **101 tests passed** across parser, instruction, execution/history, and visualization/storage suites.
- Strict TypeScript checking passed; the Vite production build passed.
- All three built-in examples were executed through the **production browser UI** and produced the expected final registers and restored stack pointers.
- Load, Next, Previous, Run, Pause, Reset, history selection, decimal/hex display, syntax-error recovery, transactional runtime errors, and persistence after reload were checked.
- Responsive layouts were checked at 360, 768, and 1440 pixels, with no page or stack-cell horizontal overflow.
- The production browser reported no console warnings or errors during these checks.

This records the original Assembly MVP baseline. Step 1 subsequently added the trusted Content Pack and development validation infrastructure described above; it did not change Assembly behavior or add roadmap features.
