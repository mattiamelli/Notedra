# DelftStudy — x86-64 Assembly Visualizer

A browser-based study workbench for a first-year Computer Science & Engineering student learning Computer Organization at TU Delft. Paste a small AT&T assembly program and see what each instruction does to the registers, stack, and execution path.

DelftStudy makes stack frames and function calls visible. It uses a real, deterministic simulation engine; no AI service, backend, database, account, or login is needed to run the application.

## Features

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

`npm run build` type-checks the project and creates a static application in `dist/`. Serve that directory through any static HTTP host. No server-side application code is required. The optional `.openai/hosting.json` is deployment metadata for the prepared Sites preview and is not needed for local development.

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
  App.tsx
  main.tsx
  index.css
tests/
  parser.test.ts
  instructions.test.ts
  executor.test.ts
  visualization.test.ts
```

The engine imports no React or browser APIs. The UI renders engine snapshots; it never implements instruction behavior. Runtime dependencies are limited to React and React DOM. Vite, strict TypeScript, Tailwind CSS, and Vitest provide development tooling.

## Testing

```bash
npm test
npm run test:watch
npm run typecheck
npm run build
```

The suite covers operand parsing, labels and errors, every supported instruction, memory/register transfers, RSP ordering, signed overflow, nested calls, return-address metadata, transactional failures, immutable history, all three complete examples, bounded stack rendering, and storage failures. It avoids component-render-only tests.

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

No roadmap features or Content Pack integrations are included in this MVP.
