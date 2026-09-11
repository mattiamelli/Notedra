# Assembly Visualizer — Maintenance Patch 1

Accepted implementation and local verification; no merge, push or deployment. This is not roadmap Step 16.

## Behavior and supported subset

The existing parser, instruction dispatcher, CPU/memory model, session snapshots and editor remain the single semantic source of truth for examples and custom programs.

- `shlq $count, destination`: immediate count 0–255, masked with 63; qword register/memory destination; low 64 result bits retained. Zero effective count preserves the destination and return-address metadata. The existing register model has no byte-register aliases, so variable `%cl` counts are not added. There was no prior shift/SAL implementation to duplicate.
- `mulq source`: one register or supported memory operand. Both unsigned 64-bit inputs are read before either implicit destination changes. BigInt retains the full 128-bit product; RAX gets the low word and RDX the high word. Stored words remain signed for existing decimal formatting; HEX shows their full unsigned bit patterns. No flags model is introduced.
- Addressing: `(%rsp)`, `8(%rbp)`, `-8(%rbp)`, `(%rsp,%rcx)`, `(%rsp,%rcx,4)`, `16(%rbp,%rcx,8)`, with whitespace and signed decimal/hex displacements. Scales are exactly 1/2/4/8. Invalid scales, missing/extra components, nested/unbalanced parentheses, trailing junk and RSP as index are rejected. Base-free addressing is outside this subset.
- Memory remains 1 MiB of initialized, aligned 8-byte cells. LEA still permits an unaligned address without reading memory. Existing stack, RSP/RBP and call/ret behavior is unchanged.
- Custom multiline programs use the existing textarea and Load Program, Next Instruction, Run, Previous, history seeking and Reset controls. Examples are editable. Source edits pause and clear the old session immediately; even edit-then-revert cannot revive its history. Failed loads keep execution locked and show line-number errors without an old next-instruction preview.
- `call foo:` is invalid. `call foo` with a separate `foo:` definition works. Bare top-level `ret` still requires an initialized return address: the simulator does not invent a caller. Place helpers before main and let main fall off the instruction list, as in the existing examples.

## Verification

| Gate | Result |
| --- | --- |
| Original Assembly baseline | PASS — 101 tests / 4 files |
| Original RED regression evidence | 33 failures / 61 tests before implementation |
| Follow-up UI RED evidence | 1 failure / 9 editor tests: old next-instruction preview |
| Final focused suite | PASS — 182 tests / 7 files (171 Assembly + 11 preservation) |
| Full Vitest suite | PASS — 2,008 tests / 87 files, exit 0 |
| TypeScript | PASS — tsc --noEmit |
| Production build | PASS — existing package.json build script |
| Content, preservation, hardening, static security | PASS — exact commands in the final report |
| Production bundle checks | PASS — Assembly remains outside the initial graph |
| Chromium desktop | PASS — 1440 × 1000 |
| Chromium mobile | PASS — 390 × 844; document width and scrollWidth both 390 |

One intermediate full-suite run passed all assertions but exited 1 for a Controlled network failure unhandled rejection in the unchanged IP test. That file then passed alone (7 tests), and the unchanged full command passed all 2,008 tests without unhandled errors. No IP implementation, tests, assertions or runner settings were changed. Existing non-fatal React act warnings and the existing >500 kB build warning remain.

Browser checks used the actual production UI at http://localhost:4173/co/CO_T06_ASSEMBLY_X86_64/visualizer. Custom indexed-memory/call/ret execution produced 48, then unsigned (2^64−1) × 2 produced RDX=1 and signed RAX=−2. Previous restored both RDX=77 and RAX=−1. All three examples produced 8/15/7; the edited function-call example produced 8. Reset cleared memory/history. Invalid instruction, operand, memory, scale, label and colon-call errors were readable and blocked execution. Desktop/mobile screenshots were inspected; controls wrap and panels fit the mobile viewport. Browser console error/warning collection was empty. Initial 127.0.0.1 navigation failed in the in-app browser; the same verified local service loaded at localhost without changing any security setting.

## Bundle comparison against saved baseline

| Asset | Before bytes / gzip | After bytes / gzip | Delta bytes / gzip |
| --- | --- | --- | --- |
| Initial JavaScript | 502263 / 132816 | 502263 / 132832 | 0 / +16 |
| Lazy Assembly workbench | 29502 / 10204 | 31394 / 10851 | +1892 / +647 |
| CSS | 78672 / 16962 | 78672 / 16962 | 0 / 0 |

The initial gzip difference is hash-reference churn; no Assembly code entered the initial dependency graph and no dependency was added. Baseline dist was preserved before implementation and compared using actual emitted bytes and Node gzip. Validation-generated historical bundle reports were saved outside the repository and restored to their accepted bytes, avoiding unrelated report churn in this patch.

## Exact preservation audit

Only these metadata files changed:

- `scripts/hardening-preservation.json`: eight exact before/after SHA-256 entries added. Every prior entry is byte-for-byte equivalent.
- `scripts/ip-baseline.json` and `scripts/enrichment-baseline.json`: seven existing source-file values updated in each, with no path removals. These older consumers do not route non-storage files through hardeningHash, so their direct exact hashes require the same approved update.

The hardening, progress and visual consumers already call beforeHardening; they need no code or manifest changes. The exam-content consumer uses that same mechanism but does not protect these Assembly paths. The original Step 9/10 storage chain and dependency lock are unchanged. The three new test files and this document have no historical entries and need no exemptions.

Every old hash below was verified against both accepted release 6f59a44f484a95bf974bd2b6e25710030ff5dbc1 and the Step 13 reference 6d1b9dfd3fb148ba7097e7ed238e600da2a81deb. Each diff was inspected before its exact current hash was pinned. The guards, equality rules and protected inventories remain intact; future unapproved Assembly edits still fail. Eleven preservation regressions check all eight files, mutated bytes, wrong predecessor hashes, unchanged historical entries and unchanged unrelated dependent hashes.

### src/components/CodeEditor.tsx

Highlight shlq and mulq in the existing editable textarea overlay.

- Before: `ccb8c44411e69ff7490c59dcd2cc60eef36f8e90ddba32374a39cf80ef5d2d86`
- After: `c9a7c3a3ffd154aa88ae2a6122a0a2dd88d8e746738d5eeba5df986c4b2e6f35`

### src/engine/instructions.ts

Execute shlq and unsigned mulq through the existing dispatcher; explain indexed LEA.

- Before: `e9f3019f074755d58e551458f20e366c04bc2890140380138e125f19d50a5ebb`
- After: `2ed062a86207d0e1a3a2ddee9cc80b7da01786dc2ab6a7d71ee7a304324c6bf7`

### src/engine/memory.ts

Evaluate displacement + base + index * scale in the shared address helper.

- Before: `dd3511a45c53208509d45c6f001c1aff98a1a8d89f71ffadd1f0da642af853ea`
- After: `19b4239cb30661742783b26e5c243e5cac90a1acb653f307b3b5e6affb71d5f5`

### src/engine/parser.ts

Split operands around parentheses, validate indexed addressing and new instruction operands.

- Before: `68964719108f09f165cb58867b98ca1a2856e6ada13f527ac0facdbb81d800c3`
- After: `ba684c04d0ab65858a27e2e735fafb67e6ffa93f37af0b9ff6c7c9d6afd302a8`

### src/engine/types.ts

Add the two opcodes and optional memory index/scale to the existing model.

- Before: `eef0357429ec5053122e40e562ae1a70aadcd7b99c9a022f29fa1860882898dd`
- After: `78f1ec371d538c2df7bf0c8a7927814404688374821ea9a6eceeb2202d586b12`

### src/utils/useSimulator.ts

Invalidate old sessions on edit/load failure and guard immediate step/seek actions.

- Before: `3503ba5e3effeb881a93cb2bece1f4523637e58babc8f98ca18250dedb43006a`
- After: `ece92c76dbba55453d79a9b022fc7041748db53af8fa5b5b3681bca79dd84584`

### tests/parser.test.ts

Replace rejection of the newly supported indexed form with exact acceptance and retain illegal-scale rejection.

- Before: `2193caf7d8ed87b4e380b3e6d7a2967f5d734b2586fd485c1e6e1642e504805b`
- After: `351a71787cc8790a9ace5c99d6c11b2bcffcefd29909624725998171d31ae9b5`

### src/AssemblyWorkbench.tsx

Hide the previous source instruction while dirty; remove misleading cleared-history error guidance.

- Before: `e054a84c05c2ef77eafc9f69e50863f6600bbaada15c00db7c0b267ad4a3c0c5`
- After: `77d63974e0d083035d3b422146a78c68d7064d0e611d512d3acfcecf2d336b50`
