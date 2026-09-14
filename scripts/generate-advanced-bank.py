#!/usr/bin/env python3
"""Author the immutable advanced exercise pack.

This is an authoring-time generator. The application imports only the emitted JSON;
no question or answer is generated at runtime.
"""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACK = json.loads((ROOT / "content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json").read_text())
STUDY = json.loads((ROOT / "src/generated/topic-study.json").read_text())


def exact(title, prompt, answer, explanation, fmt="integer", width=None, demand=None):
    return {
        "title": title,
        "prompt": prompt,
        "answer": str(answer),
        "explanation": explanation,
        "format": fmt,
        "width": width,
        "demand": demand or title,
    }


def binary_signature(values):
    return "".join("1" if value else "0" for value in values)


def co_specs(unit):
    if unit == "CO_LEC_01":
        return [
            exact("Separate architecture from implementation", "Six claims are listed in order. Mark 1 exactly when the claim describes an architectural capability rather than a particular physical implementation: (1) instructions can select different computations; (2) relays switch contacts; (3) data and instructions can share stored representation; (4) vacuum tubes dissipate heat; (5) a conditional branch changes control flow; (6) transistors are smaller than valves. Enter six bits.", "101010", "Claims 1, 3 and 5 describe programmer-visible computational capabilities. Relays, heat and transistor size are implementation technologies or costs.", "binary", 6, "Classify architecture, implementation and control-flow claims without confusing chronology with abstraction"),
            exact("Track two independent performance claims", "A successor completes a job in 18 ms instead of 72 ms while drawing 3 times the power. By what integer percentage did energy per job fall?", 25, "Speedup is 72/18=4. Energy is power×time, so the ratio is 3×18/72=0.75; energy per job fell by 25%.", demand="Combine latency, power and energy reasoning"),
            exact("Identify stored-program consequences", "For each consequence, enter 1 if it follows directly from a stored-program organization and 0 if it needs an additional assumption: load a different program without rewiring; execute every program faster; treat an instruction word as stored bits; guarantee reliable hardware; branch to an address computed at run time. Enter five bits.", "10101", "Reprogrammability, bit-level storage and computed control transfer follow. Speed and reliability require implementation assumptions.", "binary", 5, "Distinguish direct stored-program consequences from performance claims"),
            exact("Compare throughput and latency", "Machine A finishes one job every 12 ms. Machine B has a four-stage pipeline, accepts one job every 4 ms after filling, and takes 20 ms for one isolated job. For a stream of 21 jobs, by how many milliseconds does B finish earlier?", 152, "A needs 21×12=252 ms. B needs 20 ms for the first job and 20 further starts at 4 ms, for 100 ms. The difference is 152 ms.", demand="Separate single-job latency from steady-state throughput over a finite batch"),
            exact("Choose the reliability mechanism", "A machine must run unattended for 400 hours. Independent modules fail on average once per 1000 hours. A duplicated design continues only if both modules work; a triplicated majority design continues if at least two work. Under the simplified independent model, which design tolerates exactly one module failure? Enter 2 for duplication or 3 for triplication.", 3, "A two-module design with both required has no failure tolerance. Three modules with majority voting continue after one failure.", demand="Reason from an explicit reliability requirement rather than historical prestige"),
            exact("Decode an adoption argument", "A processor family succeeds because compatible software runs on later implementations, even though several competitors have faster individual chips. Enter 1 if this is primarily an ecosystem/compatibility explanation, or 0 if it is primarily a device-physics explanation.", 1, "Compatibility preserves accumulated software value. The claim concerns adoption and ecosystem effects, not the switching technology inside a chip.", demand="Distinguish ecosystem adoption from component performance"),
            exact("Reverse a speedup claim", "A historical report says a new system is 12 times as fast on a workload, and the new run takes 35 seconds. How many seconds did the old run take?", 420, "Speedup=old/new, so old=12×35=420 seconds.", demand="Reverse a performance ratio under exam pressure"),
            exact("Audit a mixed historical explanation", "Enter four bits, one per statement, marking whether it is logically supported: (1) smaller switches can improve density; (2) higher density alone proves every program is faster; (3) standardized interfaces can encourage an ecosystem; (4) an ecosystem alone proves lower energy per operation.", "1010", "Density can improve and standards can support adoption. Neither density nor ecosystem success alone proves the separate performance or energy claim.", "binary", 4, "Reject two plausible but unsupported causal leaps in a historical argument"),
        ]
    if unit == "CO_LEC_02":
        return [
            exact("Trace a dependent AT&T arithmetic chain", "In x86-64 AT&T syntax, %rax=5 and %rbx=9. Execute `addq %rax,%rbx; imulq $3,%rbx,%rcx; subq %rax,%rcx`. What decimal value remains in %rcx?", 37, "%rbx becomes 14, %rcx becomes 42, then subtracting the unchanged %rax gives 37.", demand="Track source/destination order and dependent register state across three instructions"),
            exact("Combine a 32-bit write with a byte write", "Initially %rax=0xffffffffffffffff. Execute `movl $0x12345678,%eax; movb $0xab,%al`. Enter the final 16 hexadecimal digits of %rax, without 0x.", "00000000123456ab", "Writing %eax clears the upper 32 bits. The later byte write replaces only the low byte, leaving 0x123456 in the other low bytes.", "hex", 16, "Combine x86-64 zero-extension with a later partial-register update"),
            exact("Resolve a scaled address after mutation", "Initially %rbx=0x1000 and %rcx=3. Execute `incq %rcx; leaq 8(%rbx,%rcx,4),%rax`. Enter %rax in hexadecimal without 0x, using exactly 4 digits.", "1018", "%rcx becomes 4. The effective address is 0x1000+8+4×4=0x1018.", "hex", 4, "Track an index mutation before base-index-scale addressing"),
            exact("Follow nested stack restoration", "Assume %rsp=0x8000. The caller executes `pushq %rbx`, calls f, f executes `pushq %rbp`, calls g, g returns without local stack use, then f executes `popq %rbp` and returns, and the caller executes `popq %rbx`. A call pushes an 8-byte return address and ret removes it. Enter final %rsp in hexadecimal without 0x.", "8000", "Every push/call has a matching pop/ret: −8−8−8+8+8+8=0 net bytes.", "hex", 4, "Track four distinct stack records across nested calls and restoration"),
            exact("Recover a caller-saved value", "A caller needs the value 23 after calling f. It stores 23 at 16(%rsp), f overwrites %rax with 91, and the caller reloads 16(%rsp) into %rcx then computes `subq %rcx,%rax`. What decimal value is in %rax?", 68, "The reload restores 23 into %rcx. AT&T subtraction computes destination minus source: 91−23=68.", demand="Combine call clobbering, memory restoration and operand order"),
            exact("Track an unsigned wide product", "Before `mulq %rbx`, %rax=0x1000000000000003 and %rbx=16. The unsigned 128-bit product is placed in %rdx:%rax. Enter the low 16 hexadecimal digits in %rax.", "0000000000000030", "Multiplication by 16 shifts left four bits. The high 1 moves out of the low half; 3×16 leaves low half 0x30.", "hex", 16, "Track the low half of a product that also produces a nonzero high half"),
            exact("Diagnose an aliased memory update", "Let %rbx=0x2000 and %rcx=2. Memory[0x2018]=11. Execute `addq $5,8(%rbx,%rcx,8)` followed by `movq 24(%rbx),%rax`. What decimal value is loaded into %rax?", 16, "Both addresses are 0x2018: 8+2×8=24. The add writes 16, and the later load observes that same location.", demand="Recognize address aliasing across two syntactically different operands"),
            exact("Separate frame base from temporary stack space", "A function begins with %rsp=0x9000, executes `pushq %rbp; movq %rsp,%rbp; subq $40,%rsp; pushq %rax`. Enter the decimal distance in bytes from the current %rsp to %rbp.", 48, "After establishing %rbp, the function reserves 40 bytes and then pushes 8 more. The stable frame base is 48 bytes above current %rsp.", demand="Reason about a stable frame base after locals and a temporary push"),
        ]
    if unit == "CO_LEC_03":
        vals=[(a,b,c) for a in (0,1) for b in (0,1) for c in (0,1)]
        return [
            exact("Evaluate a three-stage Boolean network", "For F=(A∧¬B)∨(B∧C)∨(¬A∧¬C), enter the eight output bits in ABC order 000,001,…,111.", binary_signature((a and not b) or (b and c) or (not a and not c) for a,b,c in vals), "Evaluate all eight assignments; overlapping products still produce one output bit through OR.", "binary", 8, "Evaluate overlapping product terms over a complete truth table"),
            exact("Find the odd-parity map", "Enter the eight Karnaugh-map cell values for F=A⊕B⊕C in assignment order ABC=000,001,010,011,100,101,110,111.", binary_signature((a+b+c)%2 for a,b,c in vals), "Odd parity is true for assignments with one or three input ones.", "binary", 8, "Translate a parity rule into an exact map signature"),
            exact("Check a consensus simplification", "For F=AB∨¬AC∨BC, enter its eight output bits in ABC binary order.", binary_signature((a and b) or ((not a) and c) or (b and c) for a,b,c in vals), "The BC term is the consensus of AB and ¬AC; evaluating all rows confirms it adds no new true row.", "binary", 8, "Validate a consensus relation by full semantic evaluation"),
            exact("Count essential prime implicants", "A four-variable map has 1-cells at minterms {0,2,5,7,8,10,13,15}. The only legal size-four groups are {0,2,8,10} and {5,7,13,15}. How many essential groups are required?", 2, "The two groups are disjoint and together cover every 1-cell; each covers cells no other stated group covers.", demand="Recognize required wraparound groups from an explicit legal-group set"),
            exact("Reverse a multiplexer function", "A 2-to-1 selector emits X when S=0 and Y when S=1. Enter the eight outputs in SXY order 000,001,…,111.", binary_signature(y if s else x for s,x,y in vals), "For the first four rows S=0 so output is X; for the last four S=1 so output is Y.", "binary", 8, "Reconstruct selector semantics without confusing data and select inputs"),
            exact("Propagate carry through a full adder", "A full adder receives A=1, B=1, Cin=1. Enter two bits in order Sum,Cout.", "11", "1+1+1=3, whose two-bit binary form is 11: sum bit 1 and carry 1.", "binary", 2, "Combine XOR-like sum and majority carry behavior"),
            exact("Detect a hazard-sensitive transition", "F=A B ∨ ¬A C. During an A transition with B=C=1, both steady-state outputs are 1. Enter 1 if the two-level implementation can exhibit a static-1 hazard without the consensus term BC, otherwise 0.", 1, "The two product paths have different delays; when A changes, both can briefly be false. Adding BC covers the transition.", demand="Relate Boolean cover structure to a static hazard"),
            exact("Audit an invalid K-map group", "A proposed four-cell group contains minterms {0,1,2,3}; another contains {0,1,4,5}; a third contains {0,1,2,4}. Enter three bits marking which groups are valid four-cell K-map rectangles.", "110", "The first two sets vary in exactly two coordinates and form adjacent rectangles. The third is not a power-of-two rectangle under Gray adjacency.", "binary", 3, "Distinguish valid Gray-adjacent groups from a visually plausible nonrectangle"),
        ]
    if unit == "CO_LEC_04":
        return [
            exact("Trace a transparent-high latch", "A level-sensitive D latch is transparent while E=1 and holds while E=0. Starting Q=0, samples (E,D) are (1,1),(1,0),(0,1),(1,1). Enter Q after each sample.", "1001", "Q follows D for the first two and last samples, but holds 0 during the disabled third sample.", "binary", 4, "Separate transparent updates from held state across multiple samples"),
            exact("Apply simultaneous shift-register updates", "A four-bit register Q3Q2Q1Q0 starts 1011. On each rising edge it updates simultaneously as Q3←Q2,Q2←Q1,Q1←Q0,Q0←Sin. Sin values are 0 then 1. Enter the final four bits.", "1101", "First edge gives 0110; second gives 1101. Each edge uses the entire pre-edge state.", "binary", 4, "Apply simultaneous rather than sequential state updates over two clocks"),
            exact("Compose decoder and OR plane", "A 3-to-8 decoder drives active-high outputs D0…D7. F=D1∨D2∨D5∨D7. Enter F for input codes 000 through 111.", "01100101", "Only decoder indices 1,2,5,7 feed the OR gate, producing ones exactly in those rows.", "binary", 8, "Translate a decoder/OR implementation into a truth signature"),
            exact("Trace a ripple carry", "Two 4-bit adders compute 1011+0110 with Cin=1. Enter five bits Cout,S3S2S1S0.", "10010", "11+6+1=18, which is 10010 in five-bit binary.", "binary", 5, "Propagate an incoming carry through a complete multi-bit sum"),
            exact("Detect CMOS contention", "In a static CMOS gate, the pull-up network conducts for input 01 and the pull-down network also conducts for 01 because one transistor was wired with the wrong polarity. Enter 1 if this input creates contention, else 0.", 1, "Simultaneous conducting paths to VDD and ground create a direct current path and an undefined/unsafe output.", demand="Diagnose complementary-network failure from conduction conditions"),
            exact("Decode an enabled register trace", "An edge-triggered 3-bit register starts 010. At four edges, enable/input are (0,111),(1,101),(0,000),(1,011). Enter the state after each edge as 12 consecutive bits.", "010101101011", "Disabled edges retain the previous state; enabled edges load 101 and later 011.", "binary", 12, "Track gated state across load and hold cycles"),
            exact("Reason about setup timing", "A flip-flop samples at 20 ns and requires 3 ns setup. Data last changed at 18 ns. Enter the setup-time violation in nanoseconds; enter 0 if none.", 1, "Data was stable for only 2 ns, one nanosecond less than the required 3 ns.", demand="Compute timing slack and identify a setup violation"),
            exact("Combine state and output logic", "A two-bit state Q1Q0 starts 01. Each edge applies Q1←Q0 and Q0←¬Q1 using old values. Output Z=Q1∧Q0 after the edge. Enter Z for the next six edges.", "010010", "States cycle 11,10,00,01,11,10; Z is 1 only in state 11.", "binary", 6, "Trace a sequential recurrence and evaluate its combinational output"),
        ]
    if unit in {"CO_LEC_05", "CO_LEC_06"}:
        return data_rep_specs(unit)
    if unit in {"CO_LEC_07", "CO_LEC_08"}:
        return isa_specs(unit)
    if unit in {"CO_LEC_09", "CO_LEC_10"}:
        return micro_specs(unit)
    if unit == "CO_LEC_11":
        return io_specs()
    if unit == "CO_LEC_12":
        return memory_specs()
    if unit == "CO_LEC_13":
        return cache_specs()
    if unit == "CO_LEC_14":
        return pipeline_specs()
    if unit == "CO_LEC_15":
        return vm_parallel_specs()
    raise KeyError(unit)


def data_rep_specs(unit):
    if unit == "CO_LEC_05":
        return [
            exact("Reverse a wrapped addition", "Eight-bit unsigned addition produces 0x2D with carry-out 1. One operand is 0xB7. Enter the other operand as two hexadecimal digits.", "76", "The full sum is 0x12D. Subtracting 0xB7 gives 0x76.", "hex", 2, "Recover an operand from low bits and carry-out"),
            exact("Separate signed overflow from carry", "Add 0x6D and 0x35 as eight-bit patterns. Enter two bits: carry-out, then signed overflow.", "01", "109+53=162 fits unsigned without carry beyond 255, but two positive signed operands produce negative pattern 0xA2, so signed overflow is 1.", "binary", 2, "Evaluate unsigned carry and signed overflow independently"),
            exact("Decode mixed-endian fields", "Bytes at increasing addresses are 12 34 56 78. A 16-bit little-endian load starts at the second byte. Enter the four hexadecimal result digits.", "5634", "The bytes used are 34 then 56; little endian makes 34 the low byte and 56 the high byte.", "hex", 4, "Track an unaligned subword under little-endian order"),
            exact("Perform BCD correction", "Packed BCD bytes 0x58 and 0x67 represent decimal numbers. Add them in decimal and enter the three BCD digits with no spaces.", "125", "58+67=125. BCD correction propagates a carry from the ones and tens digits.", "integer", None, "Carry across multiple decimal digits before re-encoding"),
            exact("Recover an excess-biased code", "A six-bit exponent uses excess-31. The represented exponent is −12. Enter the six encoded bits.", "010011", "Add the bias: −12+31=19, whose six-bit representation is 010011.", "binary", 6, "Reverse a biased representation at a negative exponent"),
            exact("Compare sign extensions", "The byte pattern 0x96 is sign-extended and zero-extended to 16 bits. Enter the XOR of the two 16-bit results as four hexadecimal digits.", "ff00", "Sign extension gives FF96 and zero extension gives 0096; their XOR differs exactly in the upper byte, FF00.", "hex", 4, "Combine sign interpretation, extension and bitwise comparison"),
            exact("Encode a negative two's-complement boundary", "Enter −73 as exactly eight two's-complement bits.", "10110111", "73 is 01001001; invert to 10110110 and add one to obtain 10110111.", "binary", 8, "Perform a complete negative encoding rather than pattern recognition"),
            exact("Audit three interpretations of one word", "Pattern 11110110 is interpreted as unsigned, two's complement and sign-magnitude. Enter the sum of those three decimal values.", 118, "Unsigned is 246; two's complement is −10; sign-magnitude is −118. Their sum is 118.", demand="Combine three representation rules on one stored pattern"),
        ]
    return [
        exact("Rescale a signed fixed-point value", "An eight-bit two's-complement fixed-point number has four fractional bits and pattern 11011000. Multiply its value by 2 and re-encode with four fractional bits. Enter eight bits.", "10110000", "11011000 represents −40/16=−2.5. Times two is −5, whose scaled integer is −80 and whose eight-bit two's-complement encoding is 10110000.", "binary", 8, "Combine signed decoding, scaling and fixed-point re-encoding"),
        exact("Decode a compact normal float", "A custom 8-bit float has sign 1 bit, excess-3 exponent 3 bits, and fraction 4 bits with implicit leading 1. Decode 1 101 0110 and enter the decimal value.", "-5.5", "Exponent is 5−3=2. Significand 1.0110₂=1.375. Applying sign and 2² gives −5.5.", "decimal", None, "Decode sign, biased exponent and fractional significand"),
        exact("Locate the representable gap", "In a normalized binary format with 5 stored fraction bits and an implicit leading 1, what is the spacing between adjacent values in the interval [16,32)? Enter a decimal.", "0.5", "The exponent is 4, so one fraction ulp is 2^(4−5)=0.5.", "decimal", None, "Relate significand precision to spacing at a power-of-two boundary"),
        exact("Round to nearest even", "Round binary 1.010110₂ to four significant binary bits (including the leading 1), using round-to-nearest ties-to-even. Enter the four bits without a point.", "1011", "Keeping 1.010 leaves discarded 110, greater than half an ulp, so the kept field rounds upward to 1.011.", "binary", 4, "Apply binary rounding after locating guard information"),
        exact("Detect fixed-point saturation need", "A signed 10-bit fixed-point format has three fractional bits. Compute 47.5+19.25. Enter 1 if the exact result fits, otherwise 0.", 0, "The range is −64 through 63.875. The result 66.75 exceeds the maximum.", demand="Combine fixed-point range with exact arithmetic"),
        exact("Compare two evaluation orders", "Using a format that truncates after each operation to two fractional bits, evaluate (1.75×1.75)+0.25. Enter the final decimal value.", "3.25", "1.75²=3.0625 truncates to 3.00 at two fractional bits; adding 0.25 gives 3.25.", "decimal", None, "Track quantization at an intermediate operation"),
        exact("Classify a special exponent pattern", "An IEEE-style format reserves an all-ones exponent. The exponent is all ones, fraction is nonzero. Enter 1 for NaN and 0 for infinity.", 1, "Infinity requires a zero fraction. A nonzero fraction with the reserved exponent encodes NaN.", demand="Distinguish two special encodings using both fields"),
        exact("Accumulate floating-point cancellation", "Assume decimal arithmetic with three significant digits and rounding after each operation. Evaluate (1000+1)−1000. Enter the result.", 0, "1000+1 rounds back to 1000 at three significant digits; subtracting 1000 then gives 0, exposing loss of significance.", demand="Reason through rounded intermediate state and cancellation"),
    ]


def isa_specs(unit):
    if unit == "CO_LEC_08":
        return [
            exact("Budget an expanding register format", "A 32-bit three-register instruction has 7 opcode bits. Expanding from 16 to 64 registers adds two bits to each register field. How many bits remain for other fields after the expansion?", 7, "Six register bits per operand use 18 bits; with 7 opcode bits, 32−25=7 remain.", demand="Quantify the encoding effect of a larger register namespace"),
            exact("Count load/store reuse", "A load/store sequence computes (a+b)+(a+c). With three registers, load a once and retain it; b and c each load once and the final result stores once. How many data-memory accesses are required?", 4, "Loads fetch a,b,c exactly once and one store writes the result; register reuse avoids reloading a.", demand="Exploit register reuse when counting memory traffic"),
            exact("Compare code density after expansion", "A compact ISA encodes 70% of 100 instructions in 2 bytes and the rest in 6 bytes. A fixed ISA uses 4 bytes each. How many bytes does the compact program save?", 80, "Compact size=70×2+30×6=320 bytes; fixed size=400 bytes, saving 80.", demand="Weight instruction lengths by an explicit dynamic mix"),
            exact("Recover a branch reach", "A signed 12-bit displacement is measured in 4-byte instruction units from the next instruction. What is the maximum positive byte displacement?", 8188, "Maximum signed field is 2047; scaling by four gives 8188 bytes.", demand="Combine signed range, scaling and PC-relative interpretation"),
            exact("Audit a complex-instruction trade-off", "A new instruction replaces 5 old instructions but increases clock period by 10%. It affects 8% of executed old instructions, grouped in blocks of five. For an old count of 1000 at CPI 1, what is the new instruction count?", 936, "Eighty old instructions form 16 groups and become 16 new instructions, reducing count by 64 to 936.", demand="Translate a local instruction replacement into global count"),
            exact("Count spill traffic", "A computation needs 10 live temporary values but the ISA exposes 7 usable registers. Each excess value is stored once and later loaded once. What is the minimum additional data-memory access count?", 6, "Three values spill; each costs one store and one reload, totaling six accesses.", demand="Convert register pressure into a lower bound on spill traffic"),
            exact("Decode an aligned jump target", "A 26-bit jump field stores target bits 27..2; the top 4 bits come from the next PC. If next PC is 0xA1234568 and the field is 0x000003, enter the eight-digit target hex value.", "a000000c", "Top bits are A; field 3 shifted left two gives C, producing A000000C.", "hex", 8, "Reconstruct a pseudo-direct target from two sources"),
            exact("Compare operand-stack depth", "For postfix expression `a b + c d - * e +`, what maximum number of values are simultaneously on the operand stack?", 3, "Depths after tokens are 1,2,1,2,3,2,1,2,1; maximum is three.", demand="Trace zero-address evaluation resources over a full expression"),
        ]
    offset = 0 if unit == "CO_LEC_07" else 1
    return [
        exact("Budget a three-field instruction", f"A fixed {32+8*offset}-bit instruction needs {64 if not offset else 128} opcodes, three register fields for {32 if not offset else 16} registers, and a signed immediate. How many immediate bits remain?", (32+8*offset) - (6 if not offset else 7) - 3*(5 if not offset else 4), "Subtract opcode and register fields from the fixed instruction width.", demand="Combine opcode and multiple register-field budgets"),
        exact("Recover opcode capacity", "A 24-bit format reserves two 5-bit register fields and a 9-bit signed displacement. How many distinct opcodes can the remaining bits encode?", 32, "24−10−9=5 opcode bits, yielding 2^5=32 opcodes.", demand="Reverse an instruction-format allocation"),
        exact("Count stack-machine traffic", "Evaluate (a−b)×(c+d) on a zero-address stack machine using PUSH for each variable, one arithmetic instruction per operator, and one final POP result. How many explicit instructions are needed?", 8, "Four PUSH instructions, three arithmetic operations and one POP give eight.", demand="Translate an expression tree into zero-address execution"),
        exact("Preserve a destructive operand", "A two-address ISA computes destination←destination op source. Values x and y must remain available after computing z=(x+y)−(x−y). With MOV, ADD and SUB only, what is the minimum instruction count assuming x,y already in registers and one free register?", 5, "Copy x twice, form x+y and x−y in separate registers, then subtract: two MOV plus two inner operations plus final SUB.", demand="Plan around destructive updates while retaining both inputs"),
        exact("Compare fixed and variable encodings", "A program has 40 one-byte operations and 24 five-byte operations. A fixed-width alternative uses four bytes for every operation. How many bytes smaller is the variable-width program?", 96, "Variable size is 40+120=160 bytes; fixed size is 64×4=256 bytes; difference 96.", demand="Aggregate a mixed instruction stream before comparison"),
        exact("Infer signed immediate range", "A 36-bit instruction uses 8 opcode bits and two 6-bit register fields. The remainder is a signed two's-complement immediate. Enter its maximum positive value.", 32767, "The immediate has 36−8−12=16 bits; maximum signed value is 2^15−1=32767.", demand="Derive field width and then its signed numeric range"),
        exact("Count load/store memory operations", "A load/store machine computes r=(a+b)+(c+d). It has two temporary registers and values begin in memory; the final result returns to memory. No spilling is needed. How many data-memory accesses occur?", 5, "Four loads fetch a,b,c,d and one store writes r. Arithmetic uses registers only.", demand="Separate data-memory traffic from register arithmetic"),
        exact("Audit an addressing proposal", "An ISA expands its register file from 16 to 64 registers while retaining three register operands and a fixed instruction width. How many additional encoding bits are consumed per instruction?", 6, "Each register field grows from 4 to 6 bits, two extra bits across three fields: six total.", demand="Quantify a register-file design trade-off across all operands"),
    ]


def micro_specs(unit):
    if unit == "CO_LEC_10":
        return [
            exact("Compress a control field", "Sixteen mutually exclusive register-output signals are replaced by one encoded field plus an idle code. How many field bits are required?", 5, "Seventeen states require ceil(log2 17)=5 bits.", demand="Include the idle state when compressing horizontal control"),
            exact("Detect illegal parallel transfers", "A single-bus datapath microinstruction asserts R1out and R2out simultaneously. Enter 1 if this is a legal two-source transfer on the stated bus, else 0.", 0, "A single bus cannot be driven by two sources simultaneously.", demand="Apply an electrical datapath constraint to a control word"),
            exact("Count dispatch table entries", "A microsequencer dispatches on a 7-bit opcode with a complete direct lookup table. How many entry addresses must the table contain?", 128, "Seven opcode bits select 2^7=128 possible entries.", demand="Relate opcode width to microcode dispatch storage"),
            exact("Schedule a read-modify-write microroutine", "A memory operand must be read, incremented and written back. Read request, wait/receive, ALU increment, and write request each occupy a distinct microcycle. What is the minimum microcycle count?", 4, "The stated four phases cannot overlap and each consumes one cycle, so four are required.", demand="Respect memory handshake and ALU phase ordering"),
            exact("Measure vertical decoding delay", "A vertical control path adds 2 ns decode delay to a 6 ns datapath, while horizontal control drives the same datapath directly. By what integer percentage is the vertical microcycle longer?", 33, "Vertical is 8 ns versus 6 ns; 2/6=33.3%, rounded to 33%.", demand="Quantify a control-encoding timing trade-off"),
            exact("Share a microcode tail", "Four microroutines each contain an identical final sequence of 5 microinstructions. Replacing the four copies with one shared tail plus one branch from each routine saves how many microinstructions?", 11, "Old tails use 20 words. New structure uses 5 shared words plus 4 branch words, saving 11.", demand="Account for branches when deduplicating control-store sequences"),
            exact("Trace a return-address register", "A microcall at address 40 stores return address 41 and jumps to 90. The subroutine executes 90,91 then returns. Enter the next microaddress.", 41, "The call saved the sequential address 41; the return restores it after the two subroutine words.", demand="Track microcode call and return control state"),
            exact("Audit wait-loop side effects", "A microroutine asserts READ once, then loops on READY using a side-effect-free test word for 7 cycles before loading MDR. How many read requests are issued?", 1, "Only the initial request word asserts READ; the seven test cycles repeat no device side effect.", demand="Separate request issuance from a safe handshake wait loop"),
        ]
    second = unit == "CO_LEC_10"
    return [
        exact("Count encoded control states", f"A datapath has {12 if second else 9} mutually exclusive source gates, {10 if second else 7} destination gates, and 4 ALU functions. With independent encoded fields plus one idle code in each gate field, how many total control bits are required?", (4 if second else 4)+(4 if second else 3)+2, "Each exclusive group needs enough codes for its choices plus idle; the ALU needs two bits.", demand="Encode several mutually exclusive control groups including idle"),
        exact("Trace a staging register", "At cycle 1, Y←R1=7. At cycle 2, R1 changes to 12 while Z←Y+R2 with R2=5. At cycle 3, R3←Z. Enter R3.", 12, "Y retained the old 7, so Z=7+5=12; the later R1 update does not write through Y.", demand="Track explicit datapath staging rather than current source values"),
        exact("Follow a conditional microbranch", "Microaddresses execute 20→21. At 21, if Z=1 go to 30 else 22. At 30, if N=1 go to 40 else 31. With Z=1,N=0, enter the third executed microaddress.", 30, "The sequence is 20,21,30,31; counting 20 as the first executed address, the third is 30.", demand="Resolve nested microbranches with precise sequence counting"),
        exact("Prevent repeated memory side effects", "A memory-write microinstruction is held for four wait cycles while READY=0. If its write-enable remains asserted every cycle, how many write events can the device observe under the stated level-sensitive model?", 4, "A level-sensitive enable presented across four cycles can request four writes. The control must separate one request from waiting.", demand="Identify repeated side effects in a wait-state loop"),
        exact("Calculate horizontal control width", "A horizontal control word directly controls 14 independent one-bit gates, chooses one of 8 ALU operations, and includes two independent condition bits. How many bits are required?", 19, "Fourteen direct bits + three ALU-select bits + two condition bits =19.", demand="Combine direct and encoded fields in a horizontal organization"),
        exact("Compare control-store footprints", "A horizontal design uses 48-bit words and 96 microinstructions. A vertical design uses 21-bit words but needs 180 microinstructions. How many fewer bits does the smaller control store use?", 828, "Horizontal: 4608 bits. Vertical: 3780 bits. Difference: 828 bits.", demand="Compare width against extra sequencing depth"),
        exact("Schedule a single-bus addition", "On a single internal bus with Y and Z staging registers, compute R3←R1+R2. One transfer may drive the bus per cycle; ALU output must first enter Z before reaching R3. What is the minimum cycle count?", 3, "Cycle 1 loads Y from R1; cycle 2 drives R2, computes and latches Z; cycle 3 transfers Z to R3.", demand="Respect single-bus and staging constraints"),
        exact("Separate ISA from microcode", "A faulty microroutine implements an already documented ADD instruction with subtraction, while instruction encoding and programmer-visible behavior remain specified. Enter 1 if replacing only the microroutine is an ISA change, otherwise 0.", 0, "The repair restores the existing architectural contract. It changes implementation, not the documented ISA.", demand="Distinguish implementation repair from architecture change"),
    ]


def io_specs():
    return [
        exact("Bound polling detection latency", "A device is polled every 18 μs. A request can arrive at any time and service starts only at the next poll. Enter the worst-case detection delay in μs.", 18, "An arrival just after a poll waits almost one full polling interval.", demand="Distinguish worst-case from average polling latency"),
        exact("Resolve fixed-priority interrupts", "Pending interrupt levels are 2,5,6. The current mask blocks levels below 5, and larger numbers have higher priority. Which level is accepted?", 6, "Level 2 is masked; among 5 and 6, fixed priority chooses 6.", demand="Combine masking and arbitration order"),
        exact("Count ignored-address aliases", "An I/O device decodes 6 of 16 address bits and ignores the other 10. How many processor addresses select the same register?", 1024, "Every assignment of the ten ignored bits aliases: 2^10=1024.", demand="Translate ignored lines into an alias count"),
        exact("Account for clocked bus sampling", "A synchronous receiver samples READY at 10 ns clock edges. READY rises at 31 ns and remains high. At what time in ns is it first observed?", 40, "The 30 ns edge has passed; the next sampling edge is 40 ns.", demand="Align an asynchronous event with discrete sampling edges"),
        exact("Preserve interrupted state", "An ISR changes three caller-visible registers and the status flags, but saves/restores only two registers. How many distinct machine-state components can remain corrupted after return?", 2, "One unsaved register plus the flags can differ after return.", demand="Audit complete architectural state preservation"),
        exact("Compare interrupt and polling work", "A processor polls a device 50,000 times per second at 24 cycles per poll. Interrupt service occurs 400 times per second at 900 cycles each. How many cycles per second does polling consume beyond interrupts?", 840000, "Polling costs 1,200,000 cycles/s; interrupts cost 360,000; excess is 840,000.", demand="Compare two I/O strategies using event frequency and per-event work"),
        exact("Trace nested interrupt masks", "While servicing level 4, levels ≤4 are masked. Level 6 arrives, begins service, then level 5 arrives. Enter the service order as three digits including the original handler.", 465, "Level 4 starts, level 6 preempts it, and level 5 waits until level 6 finishes before preempting/resuming relative to level 4.", demand="Track nested service under dynamic masking"),
        exact("Reject two simultaneous bus drivers", "Two devices simultaneously drive complementary 8-bit values 0xAA and 0x55 onto a shared tri-state bus. Enter 1 if the bus value is safely defined, otherwise 0.", 0, "Opposing active drivers cause electrical contention; the logical bus value is not safely defined.", demand="Recognize an illegal bus state despite individually valid values"),
    ]


def memory_specs():
    return [
        exact("Compute chip organization", "Build 64 KiB of byte-addressable memory from 8 KiB×4-bit chips. How many chips are required?", 16, "Eight chips are needed for depth and two in parallel for byte width: 8×2=16.", demand="Combine depth expansion and word-width expansion"),
        exact("Count rows touched by an unaligned request", "Memory rows are 8 bytes. A 14-byte request starts at byte address 29. How many rows are touched?", 3, "Addresses 29–42 span rows 24–31, 32–39 and 40–47.", demand="Track an unaligned interval across row boundaries"),
        exact("Diagnose bank stride", "Eight interleaved banks select by address modulo 8. A loop reads addresses 0,24,48,72,96. How many distinct banks are used?", 1, "Every address is 0 modulo 8, so all accesses hit bank 0.", demand="Relate a stride to low-order bank selection"),
        exact("Overlap CPU and DMA work", "A DMA transfer needs 14 μs setup plus 80 bursts of 3 μs. The CPU performs 190 μs of independent work after setup, then waits. How many μs elapse from setup start until both are complete?", 254, "DMA completes at 14+240=254 μs. CPU work after the setup completes at 204 μs, so DMA determines completion.", demand="Compose setup, transfer and overlapping CPU timelines"),
        exact("Calculate address pins", "A chip stores 2 Mi × 16 bits and is word-addressed. How many address input pins are required?", 21, "There are 2 Mi=2^21 word locations; width does not change the word-address count.", demand="Separate address depth from data width"),
        exact("Measure refresh occupancy", "A DRAM needs 8192 refresh operations every 64 ms. Each occupies the memory for 90 ns. What integer percentage of time is occupied, rounded to the nearest whole percent?", 1, "8192×90 ns=737.28 μs in 64,000 μs, about 1.15%, which rounds to 1%.", demand="Aggregate refresh work and normalize it to an interval"),
        exact("Detect DMA ownership failure", "The CPU fills a buffer, starts DMA reading it, then overwrites half the buffer before completion. Under no-copy DMA with no coherence protocol, enter 1 if the device is guaranteed to see the original full buffer, else 0.", 0, "Without ownership or snapshot protection, the device can observe mixed old and new data.", demand="Reason about asynchronous ownership rather than transfer arithmetic"),
        exact("Compare burst and cycle stealing", "A DMA controller transfers 64 words. Burst mode holds the bus for all 64 cycles. Cycle stealing takes one cycle then releases the bus for two CPU cycles. How many total bus/CPU cycles elapse until the last word transfers in cycle-stealing mode?", 190, "The first word takes one cycle. The remaining 63 words each add two CPU cycles plus one DMA cycle: 1+63×3=190.", demand="Model interleaved ownership over a complete transfer"),
    ]


def cache_specs():
    return [
        exact("Split a cache address", "A 32-bit byte address uses a 32 KiB, 4-way cache with 64-byte blocks. How many tag bits remain?", 19, "Offset=6 bits. Sets=32768/(4×64)=128, so index=7 bits. Tag=32−6−7=19.", demand="Derive offset, set count and tag in sequence"),
        exact("Trace direct-mapped conflicts", "A direct-mapped cache has four one-word lines and starts empty. Access block sequence 0,4,0,4,1,5,1. How many hits occur?", 0, "Blocks 0/4 and 1/5 map to the same lines and alternate, evicting each other before reuse.", demand="Track repeated conflict replacement across two sets"),
        exact("Apply LRU inside a set", "A 2-way set starts empty. Access tags A,B,A,C,B,C in that set using LRU. How many hits occur?", 2, "A,B miss; A hits; C misses and evicts B; B misses and evicts A; C hits. Two hits total.", demand="Update recency on hits as well as misses"),
        exact("Count compulsory blocks in a matrix row", "A row-major int matrix uses 4-byte ints and 32-byte cache blocks. A row starts on a block boundary and contains 50 ints. How many distinct blocks does one sequential row touch?", 7, "The row occupies 200 bytes; ceil(200/32)=7 blocks.", demand="Convert element footprint to compulsory block count"),
        exact("Reverse an average-memory-time budget", "Hit time is 2 ns and miss penalty 62 ns. What maximum integer miss percentage keeps AMAT at or below 5.1 ns?", 5, "2 + m×62 ≤5.1 gives m≤0.05, so 5%.", demand="Invert the AMAT equation under a bound"),
        exact("Measure tag overhead", "A 64 KiB 2-way cache uses 32-byte blocks and 32-bit addresses. Each line also has valid and dirty bits. How many metadata bits are stored in total?", 38912, "There are 2048 lines and 1024 sets: offset 5, index 10, tag 17. Metadata per line=19 bits; total=38,912 bits.", demand="Combine organization, tag width and status bits"),
        exact("Diagnose a stride-conflict repair", "A direct-mapped 1 KiB cache has 64-byte blocks. A loop alternates addresses 0 and 1024. If associativity becomes 2-way at the same capacity with LRU, how many hits occur in the sequence 0,1024,0,1024 after cold start?", 2, "Both blocks can coexist in the same 2-way set. The first two miss and the repeats hit.", demand="Compare conflict behavior after changing associativity"),
        exact("Separate write policies", "Under write-back/write-allocate, a write miss fetches a block and marks it dirty. Later eviction writes it back. Counting one block transfer each way, how many block transfers result from that miss plus eviction?", 2, "One transfer reads the allocated block and one writes the dirty victim back.", demand="Account for both allocation and deferred write-back traffic"),
    ]


def pipeline_specs():
    return [
        exact("Compute an unbalanced pipeline clock", "Stage logic delays are 90,130,80,110 ps and each pipeline register adds 20 ps. What clock period in ps is required?", 150, "The slowest logic stage is 130 ps; adding register overhead gives 150 ps.", demand="Use the bottleneck stage plus register overhead"),
        exact("Count completion cycles", "A five-stage pipeline issues one instruction per cycle after filling. With no stalls, how many cycles complete 37 instructions?", 41, "Completion takes depth+n−1=5+37−1=41 cycles.", demand="Separate fill latency from steady-state throughput"),
        exact("Schedule a load consumer", "A five-stage pipeline has forwarding, but a load result is available only after MEM. A dependent ALU instruction immediately follows. One bubble is required. How many cycles complete these two instructions?", 7, "Without a stall two instructions take 6 cycles; one required bubble makes 7.", demand="Insert exactly the unresolved load-use stall"),
        exact("Account for branch penalties", "A program executes 800 instructions at base CPI 1. Twenty percent are branches; 15% of branches mispredict with a 4-cycle penalty. How many total cycles are expected?", 896, "Mispredictions=800×0.20×0.15=24. Penalty=96 cycles, total 896.", demand="Combine instruction mix, prediction rate and penalty"),
        exact("Compare clock and CPI", "Machine A: 2.4 GHz, CPI 1.2. Machine B: 3.0 GHz, CPI 1.6. For the same instruction count, enter B's execution time as an integer percentage of A's, rounded nearest.", 107, "Time ratio=(1.6/3.0)/(1.2/2.4)=1.0667, about 107%.", demand="Compare performance when clock and CPI move in opposite directions"),
        exact("Find a forwarding source", "Instructions are `add r1,r2→r3; sub r3,r4→r5; and r5,r3→r6`. With full forwarding and no loads, how many RAW dependencies require forwarding?", 3, "sub reads r3; and reads r5 and r3. All three are RAW edges, though r3 has two consumers.", demand="Count dependency edges rather than dependent instructions"),
        exact("Use a delay slot correctly", "A machine always executes one branch delay-slot instruction. A taken branch is followed by `add r1,r2→r3` in the delay slot and target code uses r3. Enter 1 if the add executes, else 0.", 1, "By definition the delay slot executes regardless of branch direction.", demand="Apply architectural delay-slot semantics rather than speculative intuition"),
        exact("Calculate superscalar lower bound", "A dual-issue processor can issue at most one memory operation and one ALU operation per cycle. A basic block has 5 independent loads and 7 independent ALU operations. Ignoring latency, what is the minimum issue-cycle count?", 7, "Loads require 5 cycles, ALU operations 7; pairing can overlap five, so the larger count 7 is the lower bound and is achievable.", demand="Respect issue-class constraints in a width-two schedule"),
    ]


def vm_parallel_specs():
    return [
        exact("Invert Amdahl's law", "A workload reaches speedup 2.5 on 4 ideal processors. Enter the serial fraction as a decimal.", "0.2", "2.5=1/(s+(1−s)/4). Solving gives denominator 0.4 and s=0.2.", "decimal", None, "Recover a serial fraction from measured finite-processor speedup"),
        exact("Translate through a page table", "Pages are 4 KiB. Virtual address 0x6ABC maps virtual page 6 to physical frame 0x31. Enter the physical address as five hexadecimal digits without 0x.", "31abc", "Offset is the low 12 bits ABC; replace VPN 6 with frame 31 to obtain 0x31ABC.", "hex", 5, "Split and recombine a virtual address"),
        exact("Count page-table entries", "A 39-bit virtual address uses 8 KiB pages. How many virtual page number bits are present?", 26, "8 KiB=2^13 bytes, so 39−13=26 VPN bits.", demand="Derive offset width before the page-table size"),
        exact("Distinguish TLB miss from page fault", "A valid page-table entry exists in memory, but the translation is absent from the TLB. Enter two bits: TLB miss, page fault.", "10", "The TLB misses, then the valid page-table entry supplies the translation; no page fault occurs.", "binary", 2, "Separate translation-cache state from residency"),
        exact("Compare process translations", "Processes A and B both access virtual address 0x2345 with 4 KiB pages. A maps VPN 2 to frame 9; B maps it to frame 12. Enter the decimal difference between physical addresses B−A.", 12288, "Offsets are identical; frame difference 3 times 4096 bytes gives 12288.", demand="Keep per-process page tables separate while preserving offset"),
        exact("Find ideal parallel limit", "Eighteen percent of a workload is serial. Enter the maximum speedup as processors approach infinity, rounded to two decimals.", "5.56", "Amdahl's limit is 1/0.18=5.555…, rounded to 5.56.", "decimal", None, "Apply the infinite-processor bound"),
        exact("Classify shared-memory streams", "Four processors execute different instruction streams on different data while communicating through shared memory. Enter 1 for MIMD and 0 for SIMD.", 1, "Different instruction and data streams are MIMD; shared memory does not make the instruction streams identical.", demand="Classify parallelism without confusing memory organization"),
        exact("Combine TLB and memory timing", "A TLB lookup takes 2 ns, memory access 40 ns, and TLB hit rate is 95%. On a miss one page-table memory access precedes the data access. What is effective access time in ns?", 44, "Every access pays 2+40=42 ns; 5% also pays an extra 40 ns, adding 2 ns on average, for 44 ns.", demand="Compose hit and miss translation paths into effective time"),
    ]


def rl_specs(unit):
    if unit == "RL_LEC_00":
        return constraint_specs("intro")
    if unit in {"RL_LEC_01", "RL_LEC_02"}:
        return prop_specs(unit)
    if unit == "RL_LEC_03":
        return fol_specs()
    if unit in {"RL_LEC_04", "RL_LEC_05"}:
        return proof_specs(unit)
    if unit in {"RL_LEC_06", "RL_LEC_07", "RL_LEC_08"}:
        return induction_specs(unit)
    if unit in {"RL_LEC_09", "RL_LEC_10"}:
        return set_specs(unit)
    if unit == "RL_LEC_11":
        return tree_set_specs()
    if unit == "RL_LEC_12":
        return relation_specs()
    if unit == "RL_LEC_13":
        return limits_specs()
    if unit == "RL_LEC_14":
        return tree_function_specs()
    if unit == "RL_LEC_15":
        return exam_logic_specs()
    if unit == "RL_LEC_16":
        return constraint_specs("final")
    raise KeyError(unit)


def constraint_specs(flavour):
    if flavour == "final":
        return [
            exact("Solve a constrained placement", "Place A,B,C,D in slots 1–4. A and B are not adjacent; C is before A; D is immediately after B. Which slot contains A?", 4, "B,D must be consecutive. Only B,D,C,A satisfies the remaining constraints, so A is fourth.", demand="Combine adjacency, exclusion and precedence to a unique placement"),
            exact("Certify an invariant solution", "A move transfers exactly 3 tokens from one pile to the other. Starting pile sizes are 11 and 4. Enter 1 if equal piles are reachable, else 0.", 0, "The total is 15, so two integer piles cannot be equal; the invariant total alone rules out the target.", demand="Use a global invariant before exploring moves"),
            exact("Count constrained colorings", "A path has four vertices. Adjacent vertices need different colors chosen from three colors, and the first and last must match. How many colorings exist?", 6, "Choose the first color in 3 ways, the second in 2, and the third must differ from both its neighbors, so it has 1 choice; the last is fixed to the first: 6.", demand="Count colorings under local and endpoint constraints"),
            exact("Minimize a crossing schedule", "Times are 1,2,7,10 minutes; at most two cross with one torch and a pair takes the slower time. What is the minimum total time?", 17, "Use 1&2 across (2), 1 back (1), 7&10 across (10), 2 back (2), 1&2 across (2): total 17.", demand="Compare bridge strategies and select the optimal schedule"),
            exact("Propagate a Latin constraint", "A 3×3 Latin square uses 1,2,3 once per row/column. First row is 1,2,3 and second row begins 2,3. What is the bottom-right entry?", 2, "Second row completes with 1. Column 3 is then 3,1, so the missing bottom entry is 2.", demand="Propagate row and column uniqueness constraints"),
            exact("Count linear extensions", "Dependencies are A before D, B before D, and C independent. How many valid orders of A,B,C,D exist?", 8, "Among A,B,D, D must be last, leaving two orders; insert C in any of four positions, giving 8.", demand="Count a partial order by insertion of an independent element"),
            exact("Detect uniqueness failure", "Digits x,y satisfy x+y=9 and x<y. How many ordered digit pairs satisfy the constraints?", 5, "Pairs are (0,9),(1,8),(2,7),(3,6),(4,5), so the solution is not unique.", demand="Enumerate all models before claiming uniqueness"),
            exact("Solve a parity-and-bound system", "An integer n satisfies 20<n<40, n is divisible by 6, and n+1 is divisible by 5. What is n?", 24, "Multiples of 6 in range are 24,30,36; only 25 is divisible by 5 after adding one.", demand="Intersect arithmetic constraints over a finite range"),
        ]
    tail = " The final lecture perspective requires checking both existence and uniqueness." if flavour == "final" else ""
    return [
        exact("Resolve a chained schedule", "Four talks A,B,C,D occupy slots 1–4. A is before C; B is immediately after A; D is not in slot 4; C is after D. What slot contains C?"+tail, 4, "A,B must be consecutive. The only order satisfying D before C and D not fourth is A,B,D,C, so C is in slot 4.", demand="Propagate ordering and adjacency constraints to a forced position"),
        exact("Find the unique transfer count", "A jug holds 8 units and another 5. Starting (8,0), each move fills, empties, or pours until one jug is full or empty. What is the minimum number of moves needed to reach exactly 4 units in the 5-unit jug?", 11, "A shortest sequence is (8,0)→(3,5)→(0,5)→(5,0)→(5,5)→(8,2)→(0,2)→(2,0)→(2,5)→(7,0)→(7,5)→(8,4), requiring 11 moves. A breadth-first enumeration finds no earlier target state.", demand="Search a bounded transfer-state graph and certify minimality"),
        exact("Count assignments under exclusions", "Three distinct tasks are assigned to three distinct people. Ada cannot take task 1, Bo cannot take task 2, and Cy cannot take task 3. How many complete assignments satisfy all restrictions?", 2, "The derangements of three elements are (2,3,1) and (3,1,2), so there are two.", demand="Count complete bijective assignments rather than local choices"),
        exact("Detect an inconsistent policy", "Rules are P→Q, Q→R, R→¬P, and P. How many of Q, R and ¬P can be derived before the contradiction with P is complete?", 3, "P forces Q, Q forces R, and R forces ¬P. All three listed consequences are derived, and ¬P contradicts the given P.", demand="Propagate implications and keep the derived conflict explicit"),
        exact("Recover a hidden number", "A two-digit integer has digit sum 11. Reversing its digits increases it by 27. What is the original integer?", 47, "Let tens a and ones b. b−a=3 and a+b=11, giving a=4,b=7.", demand="Translate two constraints into a solvable system"),
        exact("Certify a shortest crossing plan", "Two people take 1 and 4 minutes to cross a bridge with one torch; at most two cross, a pair moves at the slower time, and someone must return the torch. What is the minimum total time for both to cross?", 4, "With only two people, they cross together once in four minutes; no return is needed after both reach the far side.", demand="Avoid importing unnecessary steps from a larger familiar puzzle"),
        exact("Track parity through moves", "A move flips exactly two of five coins. Starting with zero heads, enter 1 if a state with exactly three heads is reachable, otherwise 0.", 0, "Flipping two coins preserves the parity of the number of heads. Starting even, an odd count is unreachable.", demand="Use an invariant to reject a tempting target state"),
        exact("Count topological orders", "Tasks obey A before C, B before C, and C before D. How many valid orders of A,B,C,D exist?", 2, "A and B may appear in either order, then C, then D: ABCD or BACD.", demand="Count all schedules satisfying a dependency partial order"),
    ]


def prop_specs(unit):
    vals=[(p,q,r) for p in (0,1) for q in (0,1) for r in (0,1)]
    if unit == "RL_LEC_01":
        return [
            exact("Evaluate a nested implication", "Enter the eight truth values of (p→q)→(¬q→¬p) in pqr assignment order 000,001,…,111; r is intentionally irrelevant.", binary_signature(((not p) or q) <= (q or (not p)) for p,q,r in vals), "The consequent ¬q→¬p is q∨¬p, identical to p→q, so X→X is true on every row.", "binary", 8, "Recognize a contrapositive equivalence inside a larger formula"),
            exact("Count satisfying assignments", "How many assignments of p,q,r satisfy (p∨q)∧(¬p∨r)∧(¬q∨r)?", sum((p or q) and ((not p) or r) and ((not q) or r) for p,q,r in vals), "At least one of p,q is true, and either one forces r. Thus r=true and (p,q) has three nonzero assignments.", demand="Combine three clauses and count models"),
            exact("Find the unique counterexample", "For implication ((p→q)∧(q→r))→(p→r), how many of the eight assignments are counterexamples?", 0, "Implication is transitive; whenever both premises hold and p is true, q and then r are true.", demand="Test validity by searching all counterexample conditions"),
            exact("Separate necessity from sufficiency", "Let S mean a number is divisible by 12 and N mean it is divisible by 3. Enter two bits: S is sufficient for N; N is sufficient for S.", "10", "Every multiple of 12 is a multiple of 3, but 6 is a multiple of 3 and not 12.", "binary", 2, "Evaluate both directions of a condition relation"),
            exact("Audit De Morgan transformations", "Enter four bits marking which equivalences are valid: ¬(p∧q)≡¬p∨¬q; ¬(p∨q)≡¬p∧¬q; ¬(p→q)≡p∧¬q; ¬(p↔q)≡¬p↔¬q.", "1110", "The first three are standard truth-functional equivalences. Negating both sides of a biconditional preserves, rather than negates, its truth value.", "binary", 4, "Reject an equivalence that looks symmetric but has the wrong polarity"),
            exact("Recover a formula from false rows", "A formula is false exactly on (p,q)=(1,0). Enter its four truth values in row order 00,01,10,11.", "1101", "Only the third row is false; this is the implication pattern p→q.", "binary", 4, "Reverse a semantic specification into a truth signature"),
            exact("Count exclusive-or models", "For four propositions p,q,r,s, how many assignments make exactly one proposition true?", 4, "Choose which one of the four propositions is true; the other three are then fixed false.", demand="Translate an exact-one condition into a combinatorial count"),
            exact("Check a resolution consequence", "Clauses are (p∨q),(¬p∨r),(¬q∨r),(¬r∨s). Enter 1 if s is a logical consequence, else 0.", 1, "The first clause makes p or q true; either forces r via the next clauses, and r forces s.", demand="Chain resolution-style consequences across four clauses"),
        ]
    return [
        exact("Compare CNF and DNF semantics", "Enter the eight truth values of (p∧q)∨(¬p∧r) in pqr order 000 through 111.", binary_signature((p and q) or ((not p) and r) for p,q,r in vals), "Evaluate the p=0 and p=1 cases: when p=0 output follows r; when p=1 output follows q.", "binary", 8, "Use case structure to evaluate a two-product DNF"),
        exact("Count models of an equivalence chain", "How many assignments of p,q,r,s satisfy p↔q, q↔r, and r↔¬s?", 2, "p,q,r must share one value and s must be its opposite. Choose that shared value in two ways.", demand="Propagate equivalences and one negation through four variables"),
        exact("Locate satisfiable clause combinations", "Enter four bits marking satisfiability: p∧¬p; (p∨q)∧¬p; (p↔q)∧(p↔¬q); (p→q)∧p∧¬q.", "0100", "Only the second has a model, p=false and q=true. The others contain direct or derived contradictions.", "binary", 4, "Distinguish local consistency from hidden contradiction"),
        exact("Test entailment by a countermodel", "Premises p∨q and p→r are given. Enter 1 if r∨q follows, otherwise 0.", 1, "If p then r; if not p, the first premise forces q. In either case r∨q holds.", demand="Prove a disjunctive consequence by exhaustive cases"),
        exact("Count false rows after normalization", "How many of the eight p,q,r assignments make (p→q)∧(q→r) false?", 4, "The conjunction fails when p∧¬q or q∧¬r. These sets have two rows each and cannot overlap because q cannot be both false and true.", demand="Count a union of disjoint failure conditions"),
        exact("Identify valid dualization", "Enter three bits marking valid equivalences: p→q≡¬p∨q; p↔q≡(p∧q)∨(¬p∧¬q); ¬(p↔q)≡(p∧q)∨(¬p∧¬q).", "110", "The first expands implication; the second lists equal-value cases. The third expression is the biconditional itself, not its negation.", "binary", 3, "Separate biconditional from exclusive-or during transformation"),
        exact("Find prime implicant coverage", "A Boolean function is true on minterms {1,3,5,7}. How many literals are needed in its simplest product expression?", 1, "All listed minterms are exactly the assignments with the least-significant variable true, so one literal suffices.", demand="Recognize a regular model set after semantic enumeration"),
        exact("Reverse a clause consequence", "Formula (p∨q)∧(¬p∨q) is simplified. Enter its four truth values in pq order 00,01,10,11.", "0101", "Resolution and absorption reduce the formula to q, which is true exactly in rows 01 and 11.", "binary", 4, "Validate a resolution-based simplification semantically"),
    ]


def fol_specs():
    return [
        exact("Negate nested quantifiers", "Domain {1,2,3}; R(x,y) means x<y. Enter 1 if ¬∀x∃y R(x,y) is true, otherwise 0.", 1, "For x=3 there is no larger y. Therefore the universal-existential statement is false and its negation true.", demand="Evaluate a negated nested-quantifier claim in a finite structure"),
        exact("Distinguish witness scopes", "Domain {1,2,3}; R(x,y) means x≤y. Enter two bits for ∀x∃y R(x,y) and ∃y∀x R(x,y).", "11", "Each x can choose itself, and y=3 is a single witness at least as large as every x.", "binary", 2, "Compare dependent and global witnesses"),
        exact("Count satisfying witnesses", "Domain {0,1,2,3,4}; P(x) means x is even; Q(x) means x>1. How many x satisfy P(x)∧Q(x)?", 2, "The even elements are 0,2,4; applying x>1 leaves 2 and 4.", demand="Evaluate predicates then count their intersection"),
        exact("Evaluate a vacuous restriction", "Domain integers −2 through 2. Enter 1 if ∀x(x²<0→x=0) is true, else 0.", 1, "No integer has x²<0, so the antecedent is always false and every implication is true.", demand="Recognize vacuous truth inside a bounded model"),
        exact("Construct a countermodel size", "What is the smallest domain size for which ∀x∃y(x≠y) is true?", 2, "A one-element domain has no different witness. With two elements, each chooses the other.", demand="Find the smallest finite structure satisfying a quantified constraint"),
        exact("Track quantifier negation", "Enter four bits marking equivalence to ¬∀x(P(x)→Q(x)): ∃x(P(x)∧¬Q(x)); ∀x(P(x)∧¬Q(x)); ∃x(¬P(x)∨Q(x)); ¬∃x(P(x)∧¬Q(x)).", "1000", "Negate the universal to an existential and negate implication to P∧¬Q.", "binary", 4, "Apply quantifier and connective negation without losing scope"),
        exact("Compare relation properties in a model", "On {1,2,3}, R(x,y) means x divides y. Enter three bits: reflexive, symmetric, transitive.", "101", "Every number divides itself and divisibility is transitive. It is not symmetric because 1 divides 2 but 2 does not divide 1.", "binary", 3, "Evaluate three relation properties from one finite interpretation"),
        exact("Reject a global-witness inference", "Premise ∀x∃y R(x,y) is true in a two-element structure with only R(1,2) and R(2,1). Enter 1 if ∃y∀x R(x,y) follows, else 0.", 0, "Each x has a witness, but the witnesses differ; neither element receives R from both x values.", demand="Build a small countermodel to quantifier reversal"),
    ]


def proof_specs(unit):
    if unit == "RL_LEC_04":
        return [
            exact("Audit a divisibility proof", "Enter four bits marking valid steps for proving: if 6|n then 3|n. (1) write n=6k; (2) set n=3(2k); (3) assume 3|n before deriving it; (4) conclude with integer witness 2k.", "1101", "Steps 1,2,4 form a direct proof. Step 3 would assume the target.", "binary", 4, "Separate derivation from circular assumption"),
            exact("Choose a contrapositive", "For the claim ‘if n² is even then n is even’, enter 1 if ‘if n is odd then n² is odd’ is its contrapositive, else 0.", 1, "The contrapositive of P→Q is ¬Q→¬P. Here ¬(n even) means n odd, and ¬(n² even) means n² odd.", demand="Form the exact contrapositive with both predicates negated"),
            exact("Find a hidden division error", "A proof derives (a−b)(a+b)=b(a−b), cancels a−b, and concludes a+b=b, under the assumption a=b≠0. At which numbered operation does the first invalid step occur if cancellation is step 3?", 3, "Because a=b, the cancelled factor a−b is zero. Cancelling it divides by zero.", demand="Locate the first invalid inference in a plausible algebraic proof"),
            exact("Count necessary sign cases", "To prove |xy|=|x||y| by elementary sign cases, how many combinations of signs x≥0/x<0 and y≥0/y<0 must be covered?", 4, "Two exhaustive cases for each variable produce four combinations.", demand="Construct an exhaustive two-variable case split"),
            exact("Check arbitrary-element generalization", "Enter three bits marking whether a universal proof may: choose an arbitrary domain element; use a property stated for all elements; assume the arbitrary element has a special value not given.", "110", "Arbitrary choice and universal premises are valid; imposing an unproved special value destroys generality.", "binary", 3, "Preserve arbitrariness through universal generalization"),
            exact("Separate existence and uniqueness", "A derivation exhibits x=2 satisfying an equation, then concludes exactly one solution exists. Enter two bits: existence established; uniqueness established.", "10", "A witness proves existence. Uniqueness requires ruling out every different solution.", "binary", 2, "Identify the missing half of an existence-and-uniqueness proof"),
            exact("Select contradiction assumptions", "To prove √3 irrational by contradiction, enter two bits marking the starting assumptions required: √3=a/b in lowest terms; a and b are both even.", "10", "Assume a reduced rational representation. Both-even is derived later and contradicts lowest terms; it cannot be assumed initially.", "binary", 2, "Distinguish contradiction assumption from derived contradiction"),
            exact("Validate proof by cases", "Integers are split into n≤0 and n≥0 to prove a claim for all n. Enter 1 if the cases are exhaustive, and a second bit if they are disjoint.", "10", "Every integer satisfies at least one case, but n=0 lies in both. Overlap does not invalidate an exhaustive case proof.", "binary", 2, "Separate exhaustiveness from disjointness"),
        ]
    return [
        exact("Prove an odd-product contrapositive", "For ‘if ab is odd then a and b are odd’, enter four bits marking valid contrapositive cases: a even; b even; a=0; a,b both odd.", "1110", "The contrapositive assumes a even or b even and shows ab even; a=0 is covered by a even. Both odd is the original positive case.", "binary", 4, "Organize a disjunctive contrapositive without reversing implication"),
        exact("Audit absolute-value boundaries", "A case proof for |x|≥0 uses x>0 and x<0. Enter 1 if an additional boundary case is missing, else 0.", 1, "The split omits x=0. Using x≥0 and x<0 would cover it without a third case.", demand="Detect a non-exhaustive sign split"),
        exact("Preserve irrationality under shift", "Let r be rational and x irrational. Enter 1 if x+r can be rational, else 0.", 0, "If x+r were rational, subtracting rational r would make x rational, a contradiction.", demand="Use closure of rationals inside a contradiction argument"),
        exact("Check direct-proof dependencies", "To prove the sum of two multiples of 5 is a multiple of 5, enter the number of independent integer witnesses introduced before combining them.", 2, "Write a=5k and b=5m. The inputs may have different witnesses, so two are required.", demand="Keep existential witnesses distinct during a closure proof"),
        exact("Classify a proof technique", "A proof assumes the desired conclusion is false, derives an impossibility with a given premise, then concludes the original claim. Enter 1 for contradiction and 0 for direct proof.", 1, "The proof temporarily assumes the negation of the goal and derives an impossibility.", demand="Identify a technique from its logical structure"),
        exact("Reject converse reasoning", "Given n divisible by 8 implies n even, a proof observes n=6 is even and concludes 8 divides 6. Enter 1 if valid, else 0.", 0, "The proof uses the converse. Evenness is necessary but not sufficient for divisibility by 8.", demand="Diagnose implication reversal with a concrete counterexample"),
        exact("Find the rational midpoint", "For rational a=5/7 and b=9/7, the midpoint is p/q in lowest terms. Enter p+q.", 2, "The midpoint is (14/7)/2=1=1/1, so p+q=2.", demand="Construct and reduce a rational point strictly between ordered inputs"),
        exact("Audit uniqueness subtraction", "Two proposed solutions x and y satisfy 3x+4=3y+4. After subtracting 4, what nonzero factor must be cancelled to prove x=y?", 3, "The equation becomes 3x=3y; cancelling nonzero 3 gives x=y.", demand="Complete a uniqueness proof while checking cancellation legality"),
    ]


def induction_specs(unit):
    if unit == "RL_LEC_07":
        return [
            exact("Preserve a parity invariant", "A state begins (x,y)=(5,8). Each move replaces (x,y) by (x+2,y−2). Enter the parity bits of x,y after 17 moves, with 1 for odd.", "10", "Adding or subtracting two preserves parity, so x stays odd and y stays even.", "binary", 2, "Use parity preservation without simulating every move"),
            exact("Choose a termination variant", "A loop repeatedly replaces positive n by floor(n/2). Starting n=100, how many iterations occur before n=0?", 7, "Values are 100,50,25,12,6,3,1,0: seven strict decreases.", demand="Apply a well-founded decreasing variant"),
            exact("Verify invariant initialization", "A loop invariant is s=i² before the body. Initial state is i=3,s=8. Enter the integer adjustment to s required to establish the invariant.", 1, "The invariant requires s=9, so add one.", demand="Check initialization numerically before preservation"),
            exact("Trace Euclid's invariant", "Euclid steps from (84,30) by (a,b)←(b,a mod b). How many updates reach a pair with b=0?", 3, "(84,30)→(30,24)→(24,6)→(6,0): three updates.", demand="Trace an invariant-preserving terminating recurrence"),
            exact("Count strong-induction bases", "A recurrence for n≥8 uses values at n−2 and n−5. If the theorem begins at n=3, how many consecutive base cases must be proved before the first step?", 5, "The definition's first derived value is n=8, so n=3,4,5,6,7 are bases.", demand="Align induction bases with recurrence domain and offsets"),
            exact("Prove preservation algebraically", "Invariant x+2y=17. A move sets x←x+4 and y←y−2. Enter the invariant value after the move.", 17, "The change is +4+2(−2)=0, so the expression remains 17.", demand="Verify algebraic preservation under simultaneous update"),
            exact("Find a loop postcondition", "Invariant 0≤i≤n and s=2i holds. The loop exits when i=n. If n=13, what is s?", 26, "Substitute the exit condition into the invariant: s=2n=26.", demand="Combine invariant and exit condition to derive the result"),
            exact("Reject a nondecreasing variant", "A proposed termination variant is |x| for update x←x−2 while x≠0, with arbitrary integer x. Enter 1 if it strictly decreases on every iteration, else 0.", 0, "For negative x, subtracting two increases |x|; the proposal is not globally decreasing.", demand="Test a termination measure on adversarial states"),
        ]
    if unit == "RL_LEC_08":
        return [
            exact("Evaluate a recursive tree size", "A root has two children; its left child has two leaves and its right child has one left leaf. How many nonempty nodes does the tree contain?", 6, "Count root, two children and three leaves: six nodes.", demand="Apply a structural definition to an asymmetric tree"),
            exact("Count null subtrees", "A binary tree has 14 nonempty nodes. How many empty child subtrees occur in its full recursive representation?", 15, "Every n-node binary tree has n+1 null child pointers, so 15.", demand="Use a structural invariant for recursive base cases"),
            exact("Trace mutually recursive parity", "even(0)=true, odd(0)=false, even(n)=odd(n−1), odd(n)=even(n−1). Enter two bits for even(7), odd(7).", "01", "Seven is odd, so even is false and odd is true.", "binary", 2, "Follow mutual recursion to complementary results"),
            exact("Compute expression-tree value", "An expression tree has root subtraction; left subtree is 4×5 and right subtree is 3+6. What value does it evaluate to?", 11, "Left evaluates to 20 and right to 9; root gives 20−9=11.", demand="Evaluate a recursive syntax tree bottom-up"),
            exact("Count full-tree leaves", "A full binary tree contains 23 total nodes. How many leaves does it have?", 12, "For full binary trees total=2I+1, so I=11 and leaves=I+1=12.", demand="Invert the full-tree node relation"),
            exact("Measure recursion depth", "A recursive function calls f(n−3) until n≤0. Starting at n=14, how many non-base calls execute?", 5, "Positive arguments are 14,11,8,5,2 before the base call at −1.", demand="Separate productive recursive calls from the base call"),
            exact("Reconstruct a binary tree", "A tree has preorder 3142 and inorder 1324. Enter its postorder traversal as four digits.", 2143, "Root 3 splits inorder into 1,2 on the left and 4 on the right; left preorder 1,2 makes 1 with right child 2. Postorder is 2,1,4,3 =2143.", demand="Reconstruct structure from two traversals before producing a third"),
            exact("Check structural induction coverage", "A proof handles empty trees and assumes the property for both children before proving it for a node. Enter 1 if this covers every finite binary tree, else 0.", 1, "Every finite binary tree is empty or a node with two smaller binary subtrees, matching the constructors.", demand="Match induction cases to a recursive data definition"),
        ]
    phase={"RL_LEC_06":0,"RL_LEC_07":1,"RL_LEC_08":2}[unit]
    return [
        exact("Evaluate a two-step recurrence", f"Sequence a0={2+phase}, a1={5+phase}, and an=2a(n−1)−a(n−2). What is a6?", (2+phase)+6*((5+phase)-(2+phase)), "The recurrence has constant first difference a1−a0=3, so a6=a0+18.", demand="Recognize structure before expanding six recursive steps"),
        exact("Choose sufficient base cases", "A strong-induction step for P(n) uses both P(n−1) and P(n−3), and the theorem starts at n=4. How many consecutive base cases are needed before the step applies uniformly?", 3, "The first step at n=7 requires P6 and P4; establishing P4,P5,P6 supplies all earlier cases for subsequent steps.", demand="Derive base-case range from dependency offsets"),
        exact("Check an induction step algebra", "Assume 1+3+…+(2k−1)=k². After adding the next odd number 2k+1, what polynomial in k is obtained? Enter its value at k=7.", 64, "k²+2k+1=(k+1)²; at k=7 this is 64.", demand="Connect the hypothesis to the successor expression"),
        exact("Trace mutual recursion", "Functions satisfy f(0)=1, g(0)=2, f(n)=f(n−1)+g(n−1), g(n)=2f(n−1)+g(n−1). What is f(4)?", 41, "Pairs evolve (1,2)→(3,4)→(7,10)→(17,24)→(41,58), so f(4)=41.", demand="Track two interdependent recursive states"),
        exact("Verify a loop invariant boundary", "Before each iteration, invariant s=0+…+(i−1). The loop adds i then increments i. Starting i=1,s=0, what is s when the loop exits at i=7?", 21, "The loop has added 1 through 6. The invariant at exit gives s=0+…+6=21.", demand="Use initialization, preservation and exit condition together"),
        exact("Count nodes in a full binary tree", "A full binary tree has 37 internal nodes. How many total nodes does it have?", 75, "A full binary tree has leaves=internal+1=38, so total=37+38=75.", demand="Combine the full-tree invariant with total count"),
        exact("Evaluate a structural measure", "Define size(empty)=0 and size(node(l,r))=1+size(l)+size(r). A root has a leaf on the left and a node with two leaves on the right. What is its size?", 5, "There are five nonempty nodes: root, left leaf, right internal node and two right leaves.", demand="Evaluate a recursively defined tree function on nested structure"),
        exact("Separate invariant from termination", "A loop preserves x+y=20 and repeatedly sets x←x+1,y←y−1 while y≠0. Starting (3,17), how many iterations occur before termination?", 17, "The invariant proves the sum but termination follows because nonnegative y decreases by one. It reaches zero after 17 iterations.", demand="Use both a conserved quantity and a decreasing variant"),
    ]


def set_specs(unit):
    if unit == "RL_LEC_10":
        return [
            exact("Prove by double inclusion", "Sets A,B satisfy A⊆B and B⊆A. Enter 1 if A=B follows, else 0.", 1, "Extensional equality follows because every element of either set belongs to the other.", demand="Apply the double-inclusion criterion"),
            exact("Count inclusion-exclusion overlap", "|A|=18, |B|=15 and |A∪B|=25. What is |A∩B|?", 8, "Inclusion-exclusion gives 18+15−25=8.", demand="Invert the two-set inclusion-exclusion formula"),
            exact("Evaluate a complement identity", "Enter 1 if (A−B)∪(B−A) equals (A∪B)−(A∩B) for all sets, else 0.", 1, "Both sides contain exactly elements in one of A,B but not both.", demand="Compare two definitions of symmetric difference"),
            exact("Count constrained subsets", "How many subsets of {1,2,3,4,5,6} contain 1 but do not contain 2?", 16, "Membership of 1 and 2 is fixed; each of the other four elements is independently chosen, giving 2^4=16.", demand="Count a powerset slice under fixed membership constraints"),
            exact("Distribute product over union", "A={1,2}, B={3}, C={4,5}. How many ordered pairs are in A×(B∪C)?", 6, "The right set has three elements, so the product has 2×3=6 pairs.", demand="Combine union cardinality with Cartesian-product order"),
            exact("Find a minimal counterexample", "For the false claim A∈P(A) for every set A, enter 1 if A={1} is a counterexample, else 0.", 1, "P(A) contains ∅ and {1}; the element 1 is not itself a subset, so A={1} is not an element of P(A).", demand="Separate membership from subsethood in a powerset claim"),
            exact("Count a three-set union", "|A|=12,|B|=10,|C|=9; pairwise intersections have sizes 4,3,2 and the triple intersection has size 1. What is |A∪B∪C|?", 23, "Inclusion-exclusion gives 31−9+1=23.", demand="Apply all terms of three-set inclusion-exclusion"),
            exact("Translate a quantified set claim", "Enter 1 if A⊆B is equivalent to A∩B=A for all sets, else 0.", 1, "If every A-element lies in B, intersection keeps all of A; conversely equality forces every A-element into B.", demand="Prove a subset identity in both directions"),
        ]
    second=unit=="RL_LEC_10"
    return [
        exact("Evaluate a nested set expression", "Let A={1,2,4,7}, B={2,3,4,8}, C={1,3,4,9}. Enter (A∪B)∩C as an integer set.", "{1,3,4}", "A∪B={1,2,3,4,7,8}; intersecting C keeps 1,3,4.", "integer-set", None, "Evaluate union before intersection without dropping membership"),
        exact("Apply difference after intersection", "Let A={1,2,3,4,5}, B={2,4,6}, C={1,4,5}. Enter A−(B∩C).", "{1,2,3,5}", "B∩C={4}; remove only 4 from A.", "integer-set", None, "Respect parentheses in a mixed set operation"),
        exact("Count a powerset product", "If |A|=4 and |B|=3, what is |P(A)×P(B)|?", 128, "|P(A)|=16 and |P(B)|=8; Cartesian product size is 16×8=128.", demand="Combine powerset growth with Cartesian-product counting"),
        exact("Find a symmetric difference", "Enter {1,2,3,5} △ {2,4,5,6} as an integer set.", "{1,3,4,6}", "Remove the shared elements 2 and 5; retain elements belonging to exactly one set.", "integer-set", None, "Compute exclusive set membership"),
        exact("Audit a three-set identity", "Enter 1 if A−(B∪C)=(A−B)∩(A−C) for all sets, else 0.", 1, "Membership requires being in A and in neither B nor C, exactly the right-hand condition.", demand="Translate both sides to elementwise membership conditions"),
        exact("Count onto subset choices", f"A set has {6+int(second)} elements. How many nonempty proper subsets does it have?", 2**(6+int(second))-2, "All subsets minus the empty set and the whole set gives 2^n−2.", demand="Exclude two boundary subsets from a powerset count"),
        exact("Track ordered-pair filtering", "A={1,2,3}, B={2,4}. How many pairs (a,b) in A×B satisfy a<b?", 4, "For b=2 only a=1 works; for b=4 all three a values work, totaling four.", demand="Count a predicate over a Cartesian product without flattening pairs"),
        exact("Find a counterexample universe", "For claim P(A∪B)=P(A)∪P(B), let A={1},B={2}. How many subsets of A∪B are missing from the right side?", 1, "The mixed subset {1,2} belongs to P(A∪B) but neither P(A) nor P(B). All other subsets appear.", demand="Construct and quantify a minimal counterexample to a powerset identity"),
    ]


def tree_set_specs():
    return [
        exact("Decode a preorder traversal", "A binary tree has root 4; left child 2 with children 1 and 3; right child 6 with left child 5. Enter its preorder traversal as a six-digit integer.", 421365, "Preorder visits root, left subtree, then right subtree: 4,2,1,3,6,5.", demand="Traverse a non-complete tree without confusing visit order"),
        exact("Decode a postorder traversal", "For the same tree with root 4, left 2(1,3), right 6(5,empty), enter postorder as a six-digit integer.", 132564, "Postorder is left subtree 1,3,2; right subtree 5,6; then root 4.", demand="Track recursive return order across asymmetric subtrees"),
        exact("Count edges in a forest", "A forest has 18 vertices and 4 connected components, each a tree. How many edges does it have?", 14, "A forest with n vertices and c components has n−c edges: 18−4=14.", demand="Generalize the tree edge invariant to a forest"),
        exact("Count full ternary leaves", "Every internal node of a rooted tree has exactly three children. If there are 11 internal nodes, how many leaves are there?", 23, "Edges=3I and also I+L−1; hence L=2I+1=23.", demand="Derive a nonbinary full-tree counting relation"),
        exact("Verify a topological order", "Graph edges are 1→3,1→4,2→4,3→5,4→5. Enter 1 if order 2,1,4,3,5 is topological, else 0.", 1, "Each source appears before its destination: 1 before 3/4, 2 before 4, and 3/4 before 5.", demand="Check every dependency in a plausible ordering"),
        exact("Find minimum cycle breaking", "A directed graph has disjoint cycles (1→2→1) and (3→4→5→3), plus edge 2→3. What is the minimum number of edges to remove to make it acyclic?", 2, "At least one edge from each disjoint cycle is required, and removing one from each suffices.", demand="Prove a lower bound and exhibit a matching repair"),
        exact("Count relation pairs from a graph", "A directed graph on four vertices has outdegrees 3,1,2,0. How many ordered pairs are in its edge relation?", 6, "Each directed edge contributes once to total outdegree; 3+1+2=6.", demand="Translate a graph degree summary into relation size"),
        exact("Combine reachability and acyclicity", "Edges are A→B,A→C,B→D,C→D,D→E. How many distinct directed paths lead from A to E?", 2, "The only paths are A-B-D-E and A-C-D-E.", demand="Enumerate paths through a converging DAG without double counting"),
    ]


def relation_specs():
    return [
        exact("Classify a finite relation", "On {1,2,3}, R={(1,1),(2,2),(3,3),(1,2),(2,1)}. Enter three bits: reflexive, symmetric, transitive.", "111", "All loops give reflexivity; the only off-diagonal pair has its reverse; composing within {1,2} or loops stays in R.", "binary", 3, "Check three relation properties including nontrivial compositions"),
        exact("Detect failed transitivity", "On {1,2,3}, R contains all loops plus (1,2),(2,3), but not (1,3). Enter 1 if transitive, else 0.", 0, "The chain 1R2 and 2R3 requires 1R3, which is missing.", demand="Find a specific witness against transitivity"),
        exact("Infer injectivity from an inverse", "A function f has a left inverse g, so g(f(x))=x for every x. Enter 1 if f must be injective, else 0.", 1, "If f(x)=f(y), applying g yields x=y.", demand="Derive a mapping property from a composition equation"),
        exact("Infer surjectivity from an inverse", "A function f has a right inverse h, so f(h(y))=y for every y. Enter 1 if f must be surjective, else 0.", 1, "Every codomain y is reached by input h(y).",
        demand="Derive surjectivity from a global preimage witness"),
        exact("Count functions and injections", "How many injective functions exist from a 3-element set to a 5-element set?", 60, "Choose distinct images in order: 5×4×3=60.", demand="Count functions under an injectivity constraint"),
        exact("Count equivalence classes", "An equivalence relation partitions 12 elements into classes of sizes 2,3,3,4. How many ordered pairs belong to the relation?", 38, "Each class contributes size² pairs: 4+9+9+16=38.", demand="Translate a partition into the full equivalence relation"),
        exact("Test well-definedness modulo classes", "Define f([x]₄)=[2x]₆. Enter 1 if f is well-defined, else 0.", 0, "Replacing x by x+4 changes 2x by 8, not always a multiple of 6, so representatives can yield different mod-6 classes.", demand="Check representative independence across two moduli"),
        exact("Compose two finite mappings", "f maps 1→2,2→3,3→1; g maps 1→3,2→1,3→2. Enter g∘f on inputs 1,2,3 as a three-digit integer.", 123, "f outputs 2,3,1; applying g gives 1,2,3, so the encoding is 123.", demand="Respect composition order across every input"),
    ]


def limits_specs():
    return [
        exact("Interleave two enumerations fairly", "Two infinite lists A and B are enumerated by alternating one new item from each, skipping duplicates. If the first duplicate occurs at A3=B2, how many distinct outputs have appeared after reading A1,B1,A2,B2,A3,B3?", 5, "Six positions were inspected and exactly one repeated an earlier element, leaving five distinct outputs.", demand="Preserve fairness while accounting for overlap"),
        exact("Diagonalize a finite prefix", "Binary rows begin 0001,1010,1110,0101. Flip the diagonal bits in order. Enter the resulting four-bit prefix.", "1100", "Diagonal bits are 0,0,1,1; flipping gives 1,1,0,0.", "binary", 4, "Construct a diagonal sequence without confusing rows and columns"),
        exact("Countable union schedule", "At diagonal stage n, pairs (i,j) with i+j=n are emitted for positive i,j. How many pairs are emitted through stage n=8 inclusive?", 28, "Stages 2 through 8 contain 1+2+…+7=28 pairs.", demand="Count a diagonal enumeration prefix"),
        exact("Reject decimal diagonal ambiguity", "A diagonal construction over infinite decimal expansions avoids digit 9 and replaces each diagonal digit d with 1 if d≠1, otherwise 2. Enter 1 if the constructed sequence can equal a listed sequence through alternate 0.999… representation, else 0.", 0, "The construction uses only 1 and 2, so it never ends in repeating 9s; the chosen representation avoids that ambiguity.", demand="Check the representation condition behind diagonalization"),
        exact("Locate Russell-style self-reference", "Let R={x | x∉x}. Enter two bits for assumptions R∈R and R∉R being individually consistent with the defining equivalence.", "00", "R∈R implies R∉R, and R∉R implies R∈R; either assumption contradicts itself.", "binary", 2, "Apply a self-membership definition in both directions"),
        exact("Bound a timeout decider", "A proposed halting decider runs a program for one million steps and says ‘does not halt’ if unfinished. Enter 1 if this decides halting for all programs, else 0.", 0, "Some halting programs legitimately require more than the fixed timeout; the negative answer is unsound.", demand="Distinguish practical timeout from universal decision"),
        exact("Compare finite and countable products", "Enter three bits marking countability: finite×countable; countable×countable; powerset of a countably infinite set.", "110", "The first two admit enumerations; Cantor's theorem makes the powerset uncountable.", "binary", 3, "Classify constructions using enumeration and diagonal arguments"),
        exact("Find missing diagonal witness", "A list claims to contain all five-bit binary strings but includes only 30 distinct rows. At least how many five-bit strings are missing?", 2, "There are 2^5=32 possible strings, so with 30 distinct rows at least two are absent.", demand="Apply finite counting as a bounded analogue of non-surjectivity"),
    ]


def tree_function_specs():
    return [
        exact("Evaluate total depth", "A root has children at depth 1: one leaf and one internal node; that internal node has two leaf children at depth 2. What is the sum of all node depths?", 6, "Depths are 0,1,1,2,2, summing to 6.", demand="Aggregate a recursive structural measure"),
        exact("Mirror a traversal", "A tree has preorder 421365 and inorder 123456. After mirroring, enter the preorder traversal.", 465231, "The original tree is root 4, left 2(1,3), right 6(5). Mirroring visits 4,6,5,2,3,1: 465231.", demand="Reconstruct a tree from traversals before applying a structural transformation"),
        exact("Count recursive calls", "Function size visits each nonempty node and also calls itself on every empty child. A binary tree has 9 nonempty nodes. How many total calls occur?", 19, "A binary tree with 9 nodes has 10 empty child positions, so calls total 9+10=19.", demand="Count base-case calls as well as productive recursive calls"),
        exact("Evaluate tree height convention", "Using height(empty)=−1 and height(node)=1+max(child heights), what is the height of a root whose left child is a leaf and right child is a chain of three nodes below the root?", 3, "The longest root-to-leaf path has three edges, so height is 3 under the stated convention.", demand="Apply an explicit base convention to an asymmetric tree"),
        exact("Count DAG paths recursively", "DAG edges are 1→2,1→3,2→4,2→5,3→4,4→5. How many directed paths go from 1 to 5?", 3, "Paths are 1-2-5, 1-2-4-5 and 1-3-4-5.", demand="Evaluate a recursive path-count function with shared subproblems"),
        exact("Check mirror involution", "Enter 1 if mirror(mirror(t))=t for every ordered binary tree under recursive child swapping, else 0.", 1, "Each node swaps its children twice and recursive subtrees are restored by the induction hypothesis.", demand="Recognize and justify a structural involution"),
        exact("Combine size and leaves", "A full binary tree has height 4 and exactly 6 internal nodes. How many leaves does it have?", 7, "Full binary trees satisfy leaves=internal+1 regardless of height, so there are seven leaves.", demand="Select the relevant invariant and ignore insufficient shape information"),
        exact("Reject local topological choice", "A topological-sort algorithm always chooses the smallest currently zero-indegree label. For edges 1→4,2→4,2→3, the vertex set is {1,2,3,4}. Enter the resulting order as four digits.", 1234, "Initially 1,2 are available, so choose 1 then 2. This releases 3 and 4; choose 3 then 4.", demand="Update the available frontier after each greedy choice"),
    ]


def exam_logic_specs():
    return [
        exact("Combine recurrence and induction setup", "A recurrence uses a(n)=a(n−2)+4 for n≥4 and defines a0,a1,a2,a3. How many base values must a proof for all n≥0 retain?", 4, "Although the step uses a two-step offset, it begins only at n=4, so all four earlier values are part of the definition and theorem base.", demand="Read a recurrence domain before choosing induction bases"),
        exact("Compose set and relation reasoning", "On A={1,2,3}, relation R contains (x,y) exactly when x+y is even. How many equivalence classes does R have?", 2, "Parity partitions A into odd class {1,3} and even class {2}.", demand="Recognize an equivalence relation and derive its quotient"),
        exact("Find a countermodel assignment", "Premises are p→q, r→¬q, and p∨r. Enter the set of indices of assignments pqr (binary indices 0–7) that satisfy premises and make q false.", "{1}", "With q=false, p→q forces p=false. Then p∨r forces r=true, leaving only 001 (index 1).", "integer-set", None, "Conjoin premises with a negated candidate conclusion and enumerate models"),
        exact("Audit a proof and its converse", "Claim: if n is divisible by 12 then n is divisible by 4. Enter two bits: original claim true; converse true.", "10", "12k=4(3k), so the original holds. The converse fails at n=4.", "binary", 2, "Prove one direction and construct a counterexample to the converse"),
        exact("Count constrained functions", "How many surjective functions exist from a 3-element set onto a 2-element set?", 6, "There are 2^3=8 functions; subtract the two constant functions to get six surjections.", demand="Use complement counting for surjectivity"),
        exact("Trace a recursive set", "S is the smallest integer set containing 2 and closed under x↦3x−1. Enter the first four elements generated along the single chain as an integer set.", "{2,5,14,41}", "Starting from 2 gives 5, then 14, then 41. Minimal closure adds exactly these iterates and their successors.", "integer-set", None, "Evaluate a recursive closure without adding unsupported inverse steps"),
        exact("Count valid schedules with a tie", "Tasks satisfy A before C, B before C, and C before D,E. How many topological orders exist?", 4, "A/B can swap in two ways and D/E can swap in two ways, with C fixed between them: 2×2=4.", demand="Factor independent ordering choices around a forced separator"),
        exact("Distinguish truth from validity", "An argument has true premises and a true conclusion in one interpretation, but another interpretation makes the premises true and conclusion false. Enter 1 if the argument is valid, else 0.", 0, "Validity requires preservation of truth in every interpretation; one countermodel refutes it.", demand="Apply semantic validity rather than checking one favorable case"),
    ]


def java(title, source, output, explanation, demand):
    return {
        "title": title,
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": source.strip() + "\n",
        "output": output,
        "explanation": explanation,
        "demand": demand,
    }


def ip_specs(unit):
    n = int(unit[-2:])
    builders = {
        1: ip_basics_specs, 2: ip_control_specs, 3: ip_methods_specs,
        4: ip_classes_specs, 5: ip_arrays_specs, 6: ip_container_specs,
        7: ip_composition_specs, 8: ip_testing_specs, 9: ip_inheritance_specs,
        10: ip_polymorphism_specs, 11: ip_equality_specs, 12: ip_exception_specs,
        13: ip_debug_specs, 14: ip_quality_specs, 15: ip_io_one_specs,
        16: ip_io_two_specs, 17: ip_functional_specs, 18: ip_design_specs,
        19: ip_modern_specs, 20: ip_thread_specs, 21: ip_exam_specs,
    }
    return builders[n]()


def wrap(main, members=""):
    return f"""public class Program {{
{members}
  public static void main(String[] args) throws Exception {{
    {main}
  }}
}}"""


def ip_basics_specs():
    return [
        java("Trace promotion before assignment", wrap('byte a=100,b=27; int c=a+b; System.out.println(c+":"+(c/9));'), "127:14\n", "Both bytes promote to int; integer division then yields 14.", "Combine numeric promotion with later integer division"),
        java("Separate compound assignment casting", wrap('short x=32000; x+=1000; System.out.println(x);'), "-32536\n", "Compound assignment includes an implicit narrowing cast; 33000 wraps to the shown short.", "Apply compound-assignment narrowing and signed wrap"),
        java("Evaluate mixed division", wrap('double x=7/2+7/2.0; System.out.printf(java.util.Locale.ROOT,"%.1f%n",x);'), "6.5\n", "The first division is integer 3 and the second is floating 3.5.", "Track operand types across two similar divisions"),
        java("Track post-increment values", wrap('int x=4; int y=x++ + ++x; System.out.println(x+":"+y);'), "6:10\n", "The left operand contributes 4, then x becomes 5; pre-increment makes it 6 and contributes 6.", "Respect left-to-right evaluation with pre/post increment"),
        java("Decode character arithmetic", wrap("char c='A'; int n=c+('d'-'a'); System.out.println((char)n+\":\"+n);"), "D:68\n", "Character operands promote to integers: 65+(100-97)=68, character D.", "Combine character codes and numeric promotion"),
        java("Distinguish string concatenation order", wrap('System.out.println(2+3+"4"+(5+6));'), "5411\n", "2+3 is numeric 5; after the string operand, 4 is concatenated, while parentheses compute 11.", "Partition numeric addition from string concatenation"),
        java("Trace a narrowing cast", wrap('double d=-3.9; int i=(int)d; System.out.println(i+":"+(i%2));'), "-3:-1\n", "Casting truncates toward zero to -3; Java remainder keeps the dividend sign.", "Combine floating truncation with signed remainder"),
        java("Evaluate shift and mask", wrap('int x=-1; System.out.println((x>>>29)&5);'), "5\n", "Unsigned shift produces 7 in the low bits; 7 AND 5 is 5.", "Combine unsigned right shift and bit masking"),
    ]


def ip_control_specs():
    return [
        java("Trace short-circuit mutation", wrap('int x=2; boolean b=(x++>2)&&(++x>3); System.out.println(x+":"+b);'), "3:false\n", "The left comparison is false after x increments to 3, so the right side is skipped.", "Track side effects through short-circuit evaluation"),
        java("Accumulate a filtered loop", wrap('int s=0; for(int i=1;i<=8;i++){if(i%3==0)continue; s+=i;} System.out.println(s);'), "27\n", "The sum 1..8 is 36; skipping 3 and 6 leaves 27.", "Combine loop bounds, continue and aggregation"),
        java("Resolve nested break scope", wrap('int c=0; for(int i=0;i<3;i++){for(int j=0;j<4;j++){if(i+j==3)break;c++;}} System.out.println(c);'), "6\n", "The inner loop counts 3,2,1 iterations for i=0,1,2.", "Distinguish an inner break from termination of both loops"),
        java("Trace switch fall-through", wrap('int n=2,r=0; switch(n){case 1:r+=1; case 2:r+=2; case 3:r+=4;break;default:r=9;} System.out.println(r);'), "6\n", "Case 2 adds 2 and falls through case 3, which adds 4.", "Follow selected entry and fall-through to break"),
        java("Evaluate a shrinking while loop", wrap('int n=37,c=0; while(n>1){n=(n%2==0)?n/2:n-5;c++;} System.out.println(n+":"+c);'), "1:6\n", "Values are 37,32,16,8,4,2,1: six transitions, so the printed count is 6.", "Trace a branch-dependent loop variant"),
        java("Preserve do-while execution", wrap('int x=5,s=0; do{s+=x;x-=2;}while(x>5); System.out.println(s+":"+x);'), "5:3\n", "The body executes once before the false condition is tested.", "Apply do-while semantics at a false initial guard"),
        java("Combine labeled continue", wrap('int c=0; outer:for(int i=0;i<4;i++){for(int j=0;j<4;j++){if(i+j==4)continue outer;c++;}} System.out.println(c);'), "10\n", "The rows count 4,3,2 and 1 completed iterations before the labeled continue, totaling 10.", "Trace a labeled continue across nested loops"),
        java("Audit chained conditions", wrap('int x=9; if(x%2==0)x/=2; else if(x%3==0)x+=4; if(x>10)x-=3; System.out.println(x);'), "10\n", "The else-if adds four to 13; the separate final if then subtracts three.", "Separate one conditional chain from a following independent test"),
    ]


def ip_methods_specs():
    m1='''static int f(int x){return x++ + x;}'''
    m2='''static void f(int[] a,int x){a[0]+=x;x=99;}'''
    m3='''static int f(int n){return n<2?n:f(n-1)+f(n-2);}'''
    m4='''static int f(int x){return x*2;} static int f(int x,int y){return f(x)+y;}'''
    m5='''static int x=3; static int f(int x){x+=2;return x;}'''
    m6='''static int f(int n,int acc){return n==0?acc:f(n-1,acc+n);}'''
    m7='''static String f(String s){s+="!";return s;}'''
    m8='''static int f(int a,int b){if(a==0)return b;return f(b%a,a);}'''
    return [
        java("Trace parameter-local increment",wrap('int x=5; System.out.println(f(x)+":"+x);',m1),"11:5\n","The parameter is a copy; f returns 5+6 while caller x remains 5.","Combine evaluation order with pass-by-value"),
        java("Separate reference and primitive passing",wrap('int[] a={4}; int x=3; f(a,x); System.out.println(a[0]+":"+x);',m2),"7:3\n","The copied reference reaches the same array, while assigning the copied primitive parameter does not affect x.","Distinguish mutation through a copied reference from parameter reassignment"),
        java("Trace branching recursion",wrap('System.out.println(f(6));',m3),"8\n","The recurrence is Fibonacci with bases 0 and 1, so f(6)=8.","Evaluate a branching recursive call tree"),
        java("Resolve an overloaded call",wrap('System.out.println(f(3,4)+":"+f(3));',m4),"10:6\n","The two-argument overload calls the one-argument overload: 6+4=10.","Resolve overloads and nested method calls"),
        java("Track field shadowing",wrap('int x=7; System.out.println(f(x)+":"+x+":"+Program.x);',m5),"9:7:3\n","The parameter shadows the field; only the local parameter copy changes.","Distinguish a parameter, caller local and shadowed static field"),
        java("Evaluate tail-style recursion",wrap('System.out.println(f(5,2));',m6),"17\n","The accumulator receives 5+4+3+2+1 in addition to its initial 2.","Track a recursive accumulator and base return"),
        java("Trace immutable argument handling",wrap('String s="go"; String t=f(s); System.out.println(s+":"+t);',m7),"go:go!\n","String concatenation creates a new object assigned only to the local parameter.","Combine pass-by-value with String immutability"),
        java("Follow Euclid recursion",wrap('System.out.println(f(42,30));',m8),"6\n","Calls reduce (42,30) to (30,42), (12,30), (6,12), (0,6), returning 6.","Trace parameter permutation and modulo recursion"),
    ]


def ip_classes_specs():
    return [
        java("Count constructor chaining",wrap('A a=new A(); System.out.println(a.x+":"+A.count);','''static class A{static int count;int x;A(){this(3);x++;}A(int x){this.x=x;count++;}}'''),"4:1\n","The no-argument constructor delegates to the integer constructor, which increments count once, then x increments.","Trace constructor delegation and static state"),
        java("Separate object state",wrap('Box a=new Box(2),b=new Box(5);a.add(b.v);System.out.println(a.v+":"+b.v);','''static class Box{private int v;Box(int v){this.v=v;}void add(int n){v+=n;}}'''),"7:5\n","The method mutates only receiver a; reading b contributes 5 without changing b.","Track receiver-specific encapsulated state"),
        java("Evaluate a defensive copy",wrap('int[] a={1,2}; Bag b=new Bag(a);a[0]=9;System.out.println(b.sum());','''static class Bag{private final int[] xs;Bag(int[] xs){this.xs=xs.clone();}int sum(){return xs[0]+xs[1];}}'''),"3\n","The constructor cloned the array before the caller mutation.","Recognize ownership established by a defensive copy"),
        java("Trace shared static state",wrap('Counter a=new Counter(),b=new Counter();a.hit();b.hit();a.hit();System.out.println(a.local+":"+b.local+":"+Counter.total);','''static class Counter{static int total;int local;void hit(){local++;total++;}}'''),"2:1:3\n","Each receiver has its own local count, while total is shared by all instances.","Combine instance fields with class-wide state"),
        java("Apply an invariant-preserving setter",wrap('Meter m=new Meter(8);m.set(-3);m.set(12);System.out.println(m.get());','''static class Meter{private int v;Meter(int v){set(v);}void set(int n){if(n>=0)v=n;}int get(){return v;}}'''),"12\n","The negative update is rejected; the later valid update stores 12.","Trace encapsulation through validated state transitions"),
        java("Resolve this-field assignment",wrap('Point p=new Point(2,3);p.move(p.y,p.x);System.out.println(p.x+":"+p.y);','''static class Point{int x,y;Point(int x,int y){this.x=x;this.y=y;}void move(int x,int y){this.x+=x;this.y+=y;}}'''),"5:5\n","Arguments are evaluated from old fields (3,2), then added to the receiver fields.","Separate parameter names from receiver fields and argument evaluation"),
        java("Count factory-created instances",wrap('Pair p=Pair.twice(4);System.out.println(p.a+p.b+":"+Pair.made);','''static class Pair{static int made;int a,b;Pair(int a,int b){this.a=a;this.b=b;made++;}static Pair twice(int x){return new Pair(x,2*x);}}'''),"12:1\n","The factory creates one Pair with fields 4 and 8.","Trace a static factory into constructor state"),
        java("Preserve an immutable value",wrap('Value a=new Value(5);Value b=a.plus(3);System.out.println(a.n+":"+b.n);','''static final class Value{final int n;Value(int n){this.n=n;}Value plus(int x){return new Value(n+x);}}'''),"5:8\n","plus creates a new value and leaves the original final field unchanged.","Reason about immutable object updates"),
    ]


def ip_arrays_specs():
    return [
        java("Trace overlapping array updates",wrap('int[] a={1,2,3,4};for(int i=1;i<a.length;i++)a[i]+=a[i-1];System.out.println(java.util.Arrays.toString(a));'),"[1, 3, 6, 10]\n","Each update reads the already updated predecessor, producing prefix sums.","Distinguish in-place prefix accumulation from pairwise addition"),
        java("Separate shallow and deep copies",wrap('int[][] a={{1},{2}};int[][] b=a.clone();b[0][0]=7;b[1]=new int[]{9};System.out.println(a[0][0]+":"+a[1][0]);'),"7:2\n","The outer array is cloned, but row 0 remains shared; replacing b row 1 does not replace a row 1.","Trace aliasing at two array dimensions"),
        java("Reverse a range in place",wrap('int[] a={0,1,2,3,4};for(int l=1,r=4;l<r;l++,r--){int t=a[l];a[l]=a[r];a[r]=t;}System.out.println(java.util.Arrays.toString(a));'),"[0, 4, 3, 2, 1]\n","Indices 1..4 are reversed through symmetric swaps.","Follow paired indices and in-place mutation"),
        java("Trace recursive array reduction",wrap('int[] a={3,1,4,1,5};System.out.println(sum(a,1));','''static int sum(int[] a,int i){return i==a.length?0:a[i]+sum(a,i+2);}'''),"2\n","Indices 1 and 3 contribute 1+1; the next index 5 reaches the base case.","Track a non-unit recursive index stride"),
        java("Count a stable partition",wrap('int[] a={4,1,3,2,6};int k=0;for(int x:a)if(x%2==0)a[k++]=x;System.out.println(k+":"+java.util.Arrays.toString(a));'),"3:[4, 2, 6, 2, 6]\n","Even values overwrite the first three positions in encounter order; untouched suffix cells retain prior values.","Separate logical length from backing-array residue"),
        java("Rotate through a cloned snapshot",wrap('int[] a={1,2,3,4};int[] old=a.clone();for(int i=0;i<a.length;i++)a[(i+1)%a.length]=old[i];System.out.println(java.util.Arrays.toString(a));'),"[4, 1, 2, 3]\n","Reading the snapshot avoids feedback while each value moves one index right.","Use a snapshot to reason about cyclic array mutation"),
        java("Evaluate ragged traversal",wrap('int[][] a={{1,2},{3},{4,5,6}};int s=0;for(int i=0;i<a.length;i++)s+=a[i][a[i].length-1];System.out.println(s);'),"11\n","The last elements are 2,3,6, totaling 11.","Traverse row-dependent bounds in a ragged array"),
        java("Trace recursive binary search",wrap('int[] a={2,5,8,11,14,17};System.out.println(find(a,0,a.length-1,14));','''static int find(int[]a,int l,int r,int x){if(l>r)return -1;int m=(l+r)/2;return a[m]==x?m:(a[m]<x?find(a,m+1,r,x):find(a,l,m-1,x));}'''),"4\n","Midpoints 2 then 4 locate value 14 at index 4.","Trace recursive interval narrowing"),
    ]


def ip_container_specs():
    return [
        java("Trace logical size after removals",wrap('Bag b=new Bag();b.add(4);b.add(7);b.add(9);System.out.println(b.remove()+":"+b.remove()+":"+b.size);','''static class Bag{int[]a=new int[4];int size;void add(int x){a[size++]=x;}int remove(){return a[--size];}}'''),"9:7:1\n","The LIFO removal decrements logical size before reading; backing cells need not be cleared.","Track logical size independently of backing capacity"),
        java("Trigger geometric resize",wrap('Vec v=new Vec();for(int i=0;i<5;i++)v.add(i);System.out.println(v.a.length+":"+v.size);','''static class Vec{int[]a=new int[2];int size;void add(int x){if(size==a.length)a=java.util.Arrays.copyOf(a,a.length*2);a[size++]=x;}}'''),"8:5\n","Capacity grows 2→4 before the third item and 4→8 before the fifth.","Trace resize thresholds and logical size"),
        java("Preserve queue wraparound",wrap('Q q=new Q();q.add(1);q.add(2);q.take();q.add(3);q.add(4);System.out.println(q.take()+":"+q.take());','''static class Q{int[]a=new int[3];int h,t,n;void add(int x){a[t]=x;t=(t+1)%3;n++;}int take(){int x=a[h];h=(h+1)%3;n--;return x;}}'''),"2:3\n","After removing 1, later insertions wrap but FIFO order remains 2,3,4.","Track circular indices through wraparound"),
        java("Distinguish set and list semantics",wrap('var xs=new java.util.ArrayList<Integer>();xs.add(3);xs.add(3);var s=new java.util.LinkedHashSet<>(xs);s.add(2);System.out.println(xs.size()+":"+s);'),"2:[3, 2]\n","The list retains the duplicate; the set keeps first insertion order and rejects duplicate membership.","Compare duplicate and order contracts across collections"),
        java("Maintain a sorted insertion invariant",wrap('S s=new S();s.add(5);s.add(2);s.add(4);System.out.println(java.util.Arrays.toString(java.util.Arrays.copyOf(s.a,s.n)));','''static class S{int[]a=new int[5];int n;void add(int x){int i=n;while(i>0&&a[i-1]>x){a[i]=a[i-1];i--;}a[i]=x;n++;}}'''),"[2, 4, 5]\n","Each insertion shifts larger stored values right before placing x.","Trace an array-backed sorted representation invariant"),
        java("Apply iterator removal semantics",wrap('var xs=new java.util.ArrayList<>(java.util.List.of(1,2,3,4));var it=xs.iterator();while(it.hasNext())if(it.next()%2==0)it.remove();System.out.println(xs);'),"[1, 3]\n","Removing through the iterator safely deletes the even elements.","Use the collection iterator mutation contract"),
        java("Count multiset frequencies",wrap('var m=new java.util.HashMap<String,Integer>();for(String s:java.util.List.of("a","b","a","c","a"))m.merge(s,1,Integer::sum);System.out.println(m.get("a")+":"+m.size());'),"3:3\n","Key a occurs three times and the map has keys a,b,c.","Build frequency state with map merge"),
        java("Respect deque endpoint choices",wrap('var d=new java.util.ArrayDeque<Integer>();d.addLast(2);d.addFirst(1);d.addLast(3);System.out.println(d.removeLast()+":"+d.removeFirst()+":"+d.peek());'),"3:1:2\n","Operations explicitly use opposite ends, leaving 2.","Trace a double-ended container contract"),
    ]


def ip_composition_specs():
    return [
        java("Delegate through a composed object",wrap('Order o=new Order(new Price(7));o.add(3);System.out.println(o.total());','''static class Price{int unit;Price(int u){unit=u;}int forCount(int n){return unit*n;}}static class Order{Price p;int n;Order(Price p){this.p=p;}void add(int k){n+=k;}int total(){return p.forCount(n);}}'''),"21\n","Order delegates pricing to its composed Price object after accumulating three units.","Trace responsibility across composition boundaries"),
        java("Observe shared composition",wrap('Engine e=new Engine();Car a=new Car(e),b=new Car(e);a.run();b.run();System.out.println(e.cycles);','''static class Engine{int cycles;void tick(){cycles+=2;}}static class Car{Engine e;Car(Engine e){this.e=e;}void run(){e.tick();}}'''),"4\n","Both cars reference the same engine, so each call mutates the shared cycle count.","Recognize aliasing in a composed object graph"),
        java("Compose comparators",wrap('var xs=new java.util.ArrayList<>(java.util.List.of("aa","b","cc","a"));xs.sort(java.util.Comparator.comparingInt(String::length).thenComparing(java.util.Comparator.naturalOrder()));System.out.println(xs);'),"[a, b, aa, cc]\n","Length is primary; natural order breaks equal-length ties.","Apply a composed library comparator"),
        java("Defensively expose a view",wrap('Box b=new Box();var x=b.items();x.add(9);System.out.println(b.items().size());','''static class Box{private final java.util.List<Integer> xs=new java.util.ArrayList<>();java.util.List<Integer> items(){return new java.util.ArrayList<>(xs);}}'''),"0\n","Each accessor returns a copy, so mutating x does not mutate Box state.","Trace an API ownership boundary"),
        java("Chain library transformations",wrap('String s="  A,b,A  ";var r=java.util.Arrays.stream(s.trim().split(",")).map(String::toLowerCase).distinct().sorted().toList();System.out.println(r);'),"[a, b]\n","Trim and split yield A,b,A; normalization, distinct and sorting yield a,b.","Compose several library operations in order"),
        java("Separate aggregate ownership",wrap('Team t=new Team();Member m=new Member(2);t.add(m);m.score=8;System.out.println(t.total());','''static class Member{int score;Member(int s){score=s;}}static class Team{java.util.List<Member>ms=new java.util.ArrayList<>();void add(Member m){ms.add(m);}int total(){return ms.stream().mapToInt(x->x.score).sum();}}'''),"8\n","Team stores the Member reference, so the later member mutation is visible in the aggregate.","Reason about reference ownership in composition"),
        java("Apply Optional API composition",wrap('var m=java.util.Map.of("x",4);int r=java.util.Optional.ofNullable(m.get("y")).map(v->v*2).orElseGet(()->7);System.out.println(r);'),"7\n","The missing map value becomes empty, so map is skipped and the fallback supplier returns 7.","Compose map lookup with Optional fallback"),
        java("Use immutable library results",wrap('var a=java.util.List.of(3,1,2);var b=a.stream().sorted().toList();System.out.println(a+":"+b);'),"[3, 1, 2]:[1, 2, 3]\n","The stream creates a new sorted result; the original immutable list remains unchanged.","Separate a source collection from a derived library result"),
    ]


def ip_testing_specs():
    return [
        java("Expose an upper-bound defect",wrap('int[] a={2,4,6};System.out.println(sumPrefix(a,3));','''static int sumPrefix(int[]a,int n){int s=0;for(int i=0;i<n;i++)s+=a[i];return s;}'''),"12\n","The boundary n=array length is valid because the loop's last index is n-1.","Evaluate an exact boundary case rather than an interior example"),
        java("Separate setup from assertions",wrap('Counter c=new Counter();c.inc();int first=c.value();c.inc();System.out.println(first+":"+c.value());','''static class Counter{int n;void inc(){n++;}int value(){return n;}}'''),"1:2\n","Capturing the first observation before the second action distinguishes the two states.","Trace arrange-act-observe state across sequential checks"),
        java("Detect an off-by-one mutant",wrap('System.out.println(count(new int[]{1,3,5},5));','''static int count(int[]a,int x){int c=0;for(int i=0;i<a.length-1;i++)if(a[i]==x)c++;return c;}'''),"0\n","The loop omits the last element, exactly where 5 appears.","Use a boundary-focused input to reveal a loop mutant"),
        java("Control a nondeterministic dependency",wrap('Clock c=()->40;System.out.println(expired(35,c));','''interface Clock{int now();}static boolean expired(int deadline,Clock c){return c.now()>deadline;}'''),"true\n","Injecting the clock fixes now at 40; 40 is strictly greater than 35.","Evaluate behavior with an injected deterministic dependency"),
        java("Partition exceptional inputs",wrap('for(int x:new int[]{-1,0,1}){try{System.out.print(f(x)+" ");}catch(IllegalArgumentException e){System.out.print("E ");}}System.out.println();','''static int f(int x){if(x<0)throw new IllegalArgumentException();return 10/(x+1);}'''),"E 10 5 \n","Negative is rejected; zero and one exercise the smallest valid values and yield 10 and 5.","Trace representative equivalence classes including failure"),
        java("Verify call isolation",wrap('Fake f=new Fake();Service s=new Service(f);System.out.println(s.twice()+":"+f.calls);','''interface Port{int read();}static class Fake implements Port{int calls;public int read(){calls++;return calls;}}static class Service{Port p;Service(Port p){this.p=p;}int twice(){return p.read()+p.read();}}'''),"3:2\n","The fake returns 1 then 2 and records exactly two calls.","Use a test double to observe interaction count and result"),
        java("Test an empty aggregate",wrap('System.out.println(avg(new int[]{}));','''static int avg(int[]a){return a.length==0?0:java.util.Arrays.stream(a).sum()/a.length;}'''),"0\n","The explicit empty guard returns zero before division.","Exercise the empty boundary of an aggregation contract"),
        java("Distinguish exact from tolerant comparison",wrap('double x=0.1+0.2;System.out.println((x==0.3)+":"+(Math.abs(x-0.3)<1e-9));'),"false:true\n","Binary floating representation defeats exact equality, while the stated tolerance accepts the tiny error.","Compare exact and tolerance-based numeric assertions"),
    ]


def ip_inheritance_specs():
    return [
        java("Trace constructor order",wrap('new B();','''static class A{A(){System.out.print("A");}}static class B extends A{B(){System.out.println("B");}}'''),"AB\n","The superclass constructor runs before the subclass constructor body.","Follow implicit super construction order"),
        java("Resolve inherited field hiding",wrap('B b=new B();A a=b;System.out.println(a.x+":"+b.x+":"+b.value());','''static class A{int x=1;int value(){return x;}}static class B extends A{int x=2;}'''),"1:2:1\n","Fields are selected by reference/class expression; inherited value executes A and reads A.x.","Separate field hiding from method inheritance"),
        java("Chain overridden behavior",wrap('System.out.println(new B().f(3));','''static class A{int f(int x){return x+1;}}static class B extends A{int f(int x){return super.f(x)*2;}}'''),"8\n","The override calls A.f(3)=4, then doubles it.","Trace an override that explicitly composes superclass behavior"),
        java("Apply protected state through subclass",wrap('B b=new B();b.bump();System.out.println(b.read());','''static class A{protected int n=4;int read(){return n;}}static class B extends A{void bump(){n+=3;}}'''),"7\n","The subclass can mutate the inherited protected field; the inherited reader observes 7.","Track inherited state and visibility"),
        java("Count initialization phases",wrap('B b=new B();System.out.println(":"+b.n);','''static class A{int n=one();int one(){System.out.print("A");return 1;}A(){n++;}}static class B extends A{int m=two();int two(){System.out.print("B");return 2;}B(){n+=m;}}'''),"AB:4\n","A field then A constructor set n to 2; B field prints B and sets m=2; B constructor makes n=4.","Order superclass and subclass field/constructor initialization"),
        java("Use a final inherited method",wrap('System.out.println(new B().id()+":"+new B().extra());','''static class A{final int id(){return 5;}}static class B extends A{int extra(){return id()+2;}}'''),"5:7\n","The final method is inherited and callable; the subclass adds two without overriding it.","Distinguish inheritance from overriding prohibition"),
        java("Trace instanceof across a hierarchy",wrap('A x=new C();System.out.println((x instanceof B)+":"+(x instanceof C)+":"+(x instanceof A));','''static class A{}static class B extends A{}static class C extends B{}'''),"true:true:true\n","A C object is also an instance of each superclass despite the static reference type A.","Reason over runtime hierarchy membership"),
        java("Apply covariant construction",wrap('A a=new B().copy();System.out.println(a.getClass().getSimpleName());','''static class A{A copy(){return new A();}}static class B extends A{@Override B copy(){return new B();}}'''),"B\n","Dynamic dispatch selects B.copy, whose covariant return still creates a B object.","Combine overriding, covariant return and runtime type"),
    ]


def ip_polymorphism_specs():
    return [
        java("Resolve dynamic dispatch in a loop",wrap('A[]xs={new A(),new B(),new C()};int s=0;for(A x:xs)s+=x.f();System.out.println(s);','''static class A{int f(){return 1;}}static class B extends A{int f(){return 3;}}static class C extends B{int f(){return super.f()+2;}}'''),"9\n","Dispatch yields 1,3 and C's 3+2=5, totaling 9.","Dispatch through a common static type including a super call"),
        java("Separate static and dynamic binding",wrap('A x=new B();System.out.println(x.label()+":"+x.value());','''static class A{static String label(){return "A";}int value(){return 1;}}static class B extends A{static String label(){return "B";}int value(){return 2;}}'''),"A:2\n","Static label is selected from reference type A; instance value dispatches to B.","Contrast method hiding with dynamic dispatch"),
        java("Dispatch through an interface default",wrap('I x=new B();System.out.println(x.f());','''interface I{default int f(){return 2;}}static class B implements I{public int f(){return I.super.f()+3;}}'''),"5\n","B overrides the interface default and adds three to I's implementation.","Resolve interface default and class override"),
        java("Trace polymorphic callback",wrap('System.out.println(apply(new Twice(),4));','''interface Op{int run(int x);}static class Twice implements Op{public int run(int x){return 2*x;}}static int apply(Op op,int x){return op.run(x)+1;}'''),"9\n","The callback dispatches to Twice.run(4)=8, then apply adds one.","Follow behavior passed through an interface"),
        java("Apply pattern matching after dispatch",wrap('A x=new B(6);int r=x.f();if(x instanceof B b)r+=b.n;System.out.println(r);','''static class A{int f(){return 1;}}static class B extends A{int n;B(int n){this.n=n;}int f(){return n/2;}}'''),"9\n","Dispatch gives 3; successful pattern matching exposes n=6, totaling 9.","Combine dynamic dispatch and safe runtime refinement"),
        java("Choose the most specific overload statically",wrap('A x=new B();System.out.println(f(x)+":"+f((B)x));','''static class A{}static class B extends A{}static String f(A x){return "A";}static String f(B x){return "B";}'''),"A:B\n","Overload resolution uses compile-time argument types; the cast changes the second call's selected overload.","Separate overload resolution from overriding"),
        java("Dispatch from a template method",wrap('System.out.println(new B().run());','''static class A{int run(){return step()+step();}int step(){return 1;}}static class B extends A{int n;int step(){return ++n;}}'''),"3\n","Both template calls dispatch to B.step, returning 1 then 2.","Track mutable state through repeated polymorphic hooks"),
        java("Aggregate heterogeneous implementations",wrap('var xs=java.util.List.<Shape>of(new Sq(3),new Rect(2,4));System.out.println(xs.stream().mapToInt(Shape::area).sum());','''interface Shape{int area();}record Sq(int s)implements Shape{public int area(){return s*s;}}record Rect(int w,int h)implements Shape{public int area(){return w*h;}}'''),"17\n","Interface dispatch computes square area 9 and rectangle area 8.","Use a common interface over heterogeneous records"),
    ]


def ip_equality_specs():
    return [
        java("Compare identity and value equality",wrap('String a=new String("xy"),b=new String("xy");System.out.println((a==b)+":"+a.equals(b));'),"false:true\n","Separate objects have different identities but equal character content.","Distinguish reference identity from value equality"),
        java("Honor equals and hashCode together",wrap('var s=new java.util.HashSet<Key>();s.add(new Key(3));s.add(new Key(3));System.out.println(s.size());','''record Key(int n){}'''),"1\n","A record supplies value-based equals and a consistent hash code, so the duplicate is rejected.","Apply the equality/hash contract in a hashed collection"),
        java("Expose an asymmetric equals method",wrap('A a=new A(2);B b=new B(2);System.out.println(a.equals(b)+":"+b.equals(a));','''static class A{int n;A(int n){this.n=n;}public boolean equals(Object o){return o instanceof A a&&a.n==n;}}static class B extends A{B(int n){super(n);}public boolean equals(Object o){return o instanceof B b&&b.n==n;}}'''),"true:false\n","A accepts subclass instances while B only accepts B, violating symmetry.","Detect equality-contract failure across inheritance"),
        java("Track mutable hashed keys",wrap('var k=new Key(1);var s=new java.util.HashSet<Key>();s.add(k);k.n=2;System.out.println(s.contains(k));','''static class Key{int n;Key(int n){this.n=n;}public boolean equals(Object o){return o instanceof Key k&&k.n==n;}public int hashCode(){return n;}}'''),"false\n","Mutation changes the lookup bucket hash after insertion, so normal lookup no longer finds the key.","Reason about mutable keys and hash-based invariants"),
        java("Apply deep array equality",wrap('int[]a={1,2},b={1,2};System.out.println(a.equals(b)+":"+java.util.Arrays.equals(a,b));'),"false:true\n","Array inherits identity equality, while Arrays.equals compares elements.","Choose the correct equality operation for arrays"),
        java("Compare normalized values",wrap('Name a=new Name(" Ada "),b=new Name("ada");System.out.println(a.equals(b)+":"+(a.hashCode()==b.hashCode()));','''static class Name{String n;Name(String n){this.n=n.trim().toLowerCase();}public boolean equals(Object o){return o instanceof Name x&&n.equals(x.n);}public int hashCode(){return n.hashCode();}}'''),"true:true\n","Both constructors normalize to ada, so equality and hashes agree.","Trace normalization into a consistent equality contract"),
        java("Use map replacement by equal key",wrap('var m=new java.util.HashMap<K,String>();m.put(new K(1),"a");m.put(new K(1),"b");System.out.println(m.size()+":"+m.get(new K(1)));','''record K(int x){}'''),"1:b\n","The second equal key replaces the existing value; a third equal key retrieves b.","Apply value equality to map insertion and lookup"),
        java("Separate compareTo from equals",wrap('var a=new java.math.BigDecimal("2.0");var b=new java.math.BigDecimal("2.00");System.out.println(a.equals(b)+":"+(a.compareTo(b)==0));'),"false:true\n","BigDecimal equals includes scale, while compareTo compares numeric value.","Recognize differing library equality and ordering contracts"),
    ]


def ip_exception_specs():
    return [
        java("Trace finally over return",wrap('System.out.println(f());','''static int f(){try{return 2;}finally{System.out.print("F:");}}'''),"F:2\n","The finally block prints before the pending return value is delivered.","Order return evaluation and finally execution"),
        java("Override a pending return in finally",wrap('System.out.println(f());','''static int f(){try{return 2;}finally{return 5;}}'''),"5\n","A return in finally replaces the earlier pending return.","Trace competing control transfers through finally"),
        java("Select the matching catch",wrap('try{throw new IllegalArgumentException();}catch(IllegalArgumentException e){System.out.print("I");}catch(RuntimeException e){System.out.print("R");}finally{System.out.println("F");}'),"IF\n","The most specific matching catch runs, followed by finally.","Resolve ordered exception handlers and cleanup"),
        java("Propagate after local cleanup",wrap('try{f();}catch(Exception e){System.out.println("C");}','''static void f(){try{throw new RuntimeException();}finally{System.out.print("F");}}'''),"FC\n","f executes finally while unwinding, then the caller catch handles the propagated exception.","Follow stack unwinding across method boundaries"),
        java("Use try-with-resources close order",wrap('try(A a=new A("1");A b=new A("2")){System.out.print("B");}','''static class A implements AutoCloseable{String s;A(String s){this.s=s;}public void close(){System.out.print(s);}}'''),"B21","Resources close in reverse acquisition order after the body.","Track deterministic resource cleanup order"),
        java("Preserve the primary exception",wrap('try(A a=new A()){throw new Exception("body");}catch(Exception e){System.out.println(e.getMessage()+":"+e.getSuppressed().length);}','''static class A implements AutoCloseable{public void close()throws Exception{throw new Exception("close");}}'''),"body:1\n","The body exception remains primary and the close exception is suppressed.","Distinguish primary and suppressed exceptions"),
        java("Classify an unchecked failure",wrap('try{System.out.println(3/0);}catch(ArithmeticException e){System.out.println("arithmetic");}'),"arithmetic\n","Integer division by zero throws ArithmeticException, which the matching catch handles.","Identify and handle a runtime arithmetic failure"),
        java("Translate an exception at a boundary",wrap('try{parse("x");}catch(IllegalArgumentException e){System.out.println(e.getCause().getClass().getSimpleName());}','''static int parse(String s){try{return Integer.parseInt(s);}catch(NumberFormatException e){throw new IllegalArgumentException("bad",e);}}'''),"NumberFormatException\n","The boundary wraps the parsing failure while preserving it as the cause.","Trace exception translation and causal chaining"),
    ]


def ip_debug_specs():
    return [
        java("Localize a stale accumulator",wrap('int s=0;for(int round=0;round<2;round++){for(int x:new int[]{1,2})s+=x;System.out.print(s+" ");}System.out.println();'),"3 6 \n","The accumulator is outside the outer loop, so the second round continues from 3.","Trace state lifetime to locate a reset defect"),
        java("Reveal integer division in an average",wrap('int sum=5,count=2;double avg=sum/count;System.out.printf(java.util.Locale.ROOT,"%.1f%n",avg);'),"2.0\n","Integer division occurs before conversion to double, losing the .5 fraction.","Diagnose a type-driven numerical defect"),
        java("Trace an aliasing symptom",wrap('var a=new java.util.ArrayList<>(java.util.List.of(1,2));var b=a;b.add(3);System.out.println(a.size());'),"3\n","Both variables reference the same list, so mutation through b changes a's observed state.","Connect an unexpected mutation to reference aliasing"),
        java("Expose a binary-search boundary bug",wrap('System.out.println(find(new int[]{2,4,6},6));','''static boolean find(int[]a,int x){int l=0,r=a.length-1;while(l<r){int m=(l+r)/2;if(a[m]<x)l=m+1;else r=m;}return l<r&&a[l]==x;}'''),"false\n","The loop converges to the target index, but the final l<r guard is false; the intended check should allow l==r.","Trace state to identify a faulty postcondition"),
        java("Observe a swallowed failure",wrap('int x=4;try{x/=0;}catch(Exception ignored){}System.out.println(x);'),"4\n","The failed assignment never completes and the empty catch hides the ArithmeticException.","Explain preserved state after a swallowed exception"),
        java("Find a missing mutation",wrap('String s="a";s.toUpperCase();System.out.println(s);'),"a\n","String methods return new values; ignoring the result leaves s unchanged.","Diagnose an immutability-related missing assignment"),
        java("Trace a wrong comparison boundary",wrap('int c=0;for(int i=0;i<=3;i++)c+=i;System.out.println(c);'),"6\n","The inclusive condition executes for 0,1,2,3; the result helps distinguish <= from < behavior.","Use a minimal trace to inspect loop boundaries"),
        java("Confirm a repaired invariant",wrap('int[]a={3,1,2};java.util.Arrays.sort(a);boolean ok=true;for(int i=1;i<a.length;i++)ok&=a[i-1]<=a[i];System.out.println(ok+":"+java.util.Arrays.toString(a));'),"true:[1, 2, 3]\n","Sorting establishes the nondecreasing invariant checked across adjacent pairs.","Verify a repair with an explicit invariant check"),
    ]


def ip_quality_specs():
    return [
        java("Build a string without quadratic mutation",wrap('var b=new StringBuilder();for(String s:java.util.List.of("a","bb","c"))b.append(s.length()).append(s);System.out.println(b);'),"1a2bb1c\n","Each element contributes its length followed by its text in encounter order.","Trace an efficient structured string construction"),
        java("Use a bounded generic method",wrap('System.out.println(max(java.util.List.of(3,8,5)));','''static <T extends Comparable<T>>T max(java.util.List<T>xs){T m=xs.get(0);for(T x:xs)if(x.compareTo(m)>0)m=x;return m;}'''),"8\n","The bound permits compareTo; iteration retains the greatest value.","Apply a generic type bound to an algorithm"),
        java("Distinguish substring boundaries",wrap('String s="architecture";System.out.println(s.substring(2,6)+":"+s.indexOf("tect"));'),"chit:5\n","substring includes index 2 and excludes 6, giving chit; tect starts at 5.","Coordinate two String index conventions"),
        java("Apply wildcard aggregation",wrap('System.out.println(sum(java.util.List.of(1,2,3))+":"+sum(java.util.List.of(1.5,2.5)));','''static double sum(java.util.List<? extends Number>xs){double s=0;for(Number x:xs)s+=x.doubleValue();return s;}'''),"6.0:4.0\n","The producer-extends list supports reading Numbers from integer and double lists.","Reason about a generic producer bound"),
        java("Normalize a delimited string",wrap('String s=" a::b : c ";var r=java.util.Arrays.stream(s.split(":" )).map(String::trim).filter(x->!x.isEmpty()).toList();System.out.println(r);'),"[a, b, c]\n","Splitting creates an empty field, then trimming and filtering remove it while preserving the three values.","Compose parsing cleanup steps"),
        java("Preserve generic type inference",wrap('var xs=pair(2,"x");System.out.println(xs.get(0).getClass().getSimpleName()+":"+xs.get(1));','''static <A,B>java.util.List<Object>pair(A a,B b){return java.util.List.of(a,b);}'''),"Integer:x\n","Inference selects Integer and String parameters; the returned object list retains the runtime values.","Follow generic inference into heterogeneous storage"),
        java("Compare immutable string stages",wrap('''String a="ab";String b=a.concat("c");String c=b.replace('a','x');System.out.println(a+":"+b+":"+c);'''),"ab:abc:xbc\n","Each transformation returns a separate String; prior values remain unchanged.","Track several immutable String results"),
        java("Refactor duplicate predicates",wrap('java.util.function.Predicate<String> useful=s->s!=null&&!s.isBlank();long n=java.util.stream.Stream.of("a"," ",null,"bb").filter(useful).count();System.out.println(n);'),"2\n","Only a and bb are non-null and nonblank.","Apply one named predicate consistently across edge cases"),
    ]


def ip_io_one_specs():
    return [
        java("Parse and aggregate lines",wrap('String data="3\\n-2\\n5\\n";int s=new java.io.BufferedReader(new java.io.StringReader(data)).lines().mapToInt(Integer::parseInt).filter(x->x>0).sum();System.out.println(s);'),"8\n","The line stream parses 3,-2,5; filtering positive values leaves 3+5.","Compose line reading, parsing and filtering"),
        java("Scan mixed tokens",wrap('var s=new java.util.Scanner("4 x 7 2");int total=0;while(s.hasNext()){if(s.hasNextInt())total+=s.nextInt();else s.next();}System.out.println(total);'),"13\n","The scanner adds integer tokens 4,7,2 and consumes x separately.","Control token parsing across valid and invalid fields"),
        java("Write through a buffered wrapper",wrap('var w=new java.io.StringWriter();try(var b=new java.io.BufferedWriter(w)){b.write("ab");b.newLine();b.write("c");}System.out.print(w.toString().replace("\\n","|"));'),"ab|c","Closing the buffer flushes both writes into the StringWriter; the newline is replaced for visible output.","Trace buffered output and resource closure"),
        java("Parse a structured record",wrap('String line="Ada,7,true";String[]p=line.split(",");System.out.println(p[0]+":"+(Integer.parseInt(p[1])*2)+":"+Boolean.parseBoolean(p[2]));'),"Ada:14:true\n","The three fields are parsed under their respective types and the integer is doubled.","Translate delimited text into typed fields"),
        java("Handle a missing numeric field",wrap('for(String s:new String[]{"8","","x"}){try{System.out.print(Integer.parseInt(s)+" ");}catch(NumberFormatException e){System.out.print("? ");}}System.out.println();'),"8 ? ? \n","Only 8 parses; empty and nonnumeric strings both raise NumberFormatException.","Classify multiple parsing failure shapes"),
        java("Preserve source order when reading",wrap('String data="b\\na\\nb\\n";var r=new java.io.BufferedReader(new java.io.StringReader(data)).lines().distinct().toList();System.out.println(r);'),"[b, a]\n","Distinct on an ordered stream retains the first b, then a, and removes the later b.","Combine sequential I/O order with stream distinctness"),
        java("Format fixed-width output",wrap('var w=new java.io.StringWriter();try(var p=new java.io.PrintWriter(w)){p.printf(java.util.Locale.ROOT,"%04d:%5.1f",23,2.5);}System.out.println("["+w+"]");'),"[0023:  2.5]\n","The integer is zero-padded to width four and the decimal occupies width five with two leading spaces.","Apply two independent formatted-output width rules"),
        java("Count fields with a limit",wrap('String[]p="a,b,,".split(",",-1);System.out.println(p.length+":"+java.util.Arrays.toString(p));'),"4:[a, b, , ]\n","A negative split limit preserves both trailing empty fields.","Reason about delimiter parsing and retained empty fields"),
    ]


def ip_io_two_specs():
    return [
        java("Read binary values in order",wrap('var out=new java.io.ByteArrayOutputStream();try(var d=new java.io.DataOutputStream(out)){d.writeInt(258);d.writeBoolean(true);}try(var in=new java.io.DataInputStream(new java.io.ByteArrayInputStream(out.toByteArray()))){System.out.println(in.readInt()+":"+in.readBoolean()+":"+in.available());}'),"258:true:0\n","Reading with matching operations consumes the integer and boolean exactly, leaving no bytes.","Match binary write and read protocols"),
        java("Observe character decoding",wrap('byte[]b={(byte)0x41,(byte)0xC3,(byte)0xA9};String s=new String(b,java.nio.charset.StandardCharsets.UTF_8);System.out.println(s.codePointAt(1)+":"+b.length);'),"233:3\n","UTF-8 decodes the second character as code point 233 from two bytes, while the byte array length remains three.","Distinguish encoded bytes from decoded characters"),
        java("Resolve a normalized path",wrap('var p=java.nio.file.Path.of("a","b","..","c",".").normalize();System.out.println(p+":"+p.getNameCount());'),"a/c:2\n","Normalization removes b/.. and the dot segment, leaving two names a and c.","Apply lexical path normalization"),
        java("Copy a byte stream",wrap('byte[]src={1,2,3,4,5};var in=new java.io.ByteArrayInputStream(src);var out=new java.io.ByteArrayOutputStream();in.transferTo(out);System.out.println(java.util.Arrays.toString(out.toByteArray())+":"+in.available());'),"[1, 2, 3, 4, 5]:0\n","transferTo copies all remaining bytes and exhausts the input.","Trace complete stream transfer and remaining input"),
        java("Mark and reset a stream",wrap('var in=new java.io.ByteArrayInputStream(new byte[]{4,5,6});System.out.print(in.read());in.mark(3);System.out.print(in.read());in.reset();System.out.println(in.read());'),"455\n","After reading 4, the mark precedes 5; reset returns to that marked position, so 5 is read twice.","Follow stream position through mark and reset"),
        java("Layer text over bytes",wrap('var out=new java.io.ByteArrayOutputStream();try(var w=new java.io.OutputStreamWriter(out,java.nio.charset.StandardCharsets.UTF_8)){w.write("Aé");}System.out.println(out.size());'),"3\n","UTF-8 encodes A in one byte and é in two bytes; closing flushes the writer.","Account for encoding at an I/O layer boundary"),
        java("Read a bounded buffer",wrap('var in=new java.io.ByteArrayInputStream(new byte[]{9,8,7});byte[]b=new byte[5];int n=in.read(b,1,3);System.out.println(n+":"+b[0]+":"+b[1]+":"+b[3]+":"+b[4]);'),"3:0:9:7:0\n","Three bytes fill indices 1..3; untouched indices retain zero.","Track offset, length and actual read count"),
        java("Compose readers with pushback",wrap('var r=new java.io.PushbackReader(new java.io.StringReader("ab"),1);int a=r.read();int b=r.read();r.unread(b);System.out.println((char)a+":"+(char)r.read()+":"+r.read());'),"a:b:-1\n","The second character is pushed back then read again; the stream is exhausted afterward.","Trace a pushback reader position exactly"),
    ]


def ip_functional_specs():
    return [
        java("Order a stream pipeline",wrap('var r=java.util.stream.Stream.of(5,2,4,1).filter(x->x%2==0).map(x->x*3).sorted().toList();System.out.println(r);'),"[6, 12]\n","Even values 2 and 4 map to 6 and 12, already in sorted order.","Compose filtering, mapping and ordering"),
        java("Flatten nested collections",wrap('var xs=java.util.List.of(java.util.List.of(1,2),java.util.List.of(3),java.util.List.<Integer>of());System.out.println(xs.stream().flatMap(java.util.Collection::stream).mapToInt(Integer::intValue).sum());'),"6\n","flatMap exposes 1,2,3; the empty nested list contributes nothing.","Flatten variable-sized nested streams"),
        java("Apply lazy short-circuiting",wrap('int[]c={0};boolean r=java.util.stream.IntStream.range(1,10).peek(x->c[0]++).anyMatch(x->x%4==0);System.out.println(r+":"+c[0]);'),"true:4\n","anyMatch stops after values 1,2,3,4; peek ran four times.","Trace laziness and terminal short-circuiting"),
        java("Reduce with a non-neutral identity",wrap('int r=java.util.stream.IntStream.of(2,3,4).reduce(1,(a,b)->a*b);System.out.println(r);'),"24\n","Starting from identity 1, multiplication produces 1×2×3×4=24.","Evaluate an ordered primitive reduction"),
        java("Chain Optional transformations",wrap('var r=java.util.Optional.of(" 42 ").map(String::trim).filter(s->s.length()==2).map(Integer::parseInt).map(x->x+1).orElse(-1);System.out.println(r);'),"43\n","Each stage succeeds: trim, length filter, parse, then increment.","Follow a multi-stage Optional data flow"),
        java("Group stream elements",wrap('var m=java.util.stream.Stream.of("a","bb","c","dd","eee").collect(java.util.stream.Collectors.groupingBy(String::length,java.util.TreeMap::new,java.util.stream.Collectors.counting()));System.out.println(m);'),"{1=2, 2=2, 3=1}\n","The TreeMap orders length keys and counting records frequencies.","Combine grouping, downstream collection and ordered map selection"),
        java("Compose functions",wrap('java.util.function.Function<Integer,Integer>f=x->x+2,g=x->x*3;System.out.println(f.andThen(g).apply(4)+":"+f.compose(g).apply(4));'),"18:14\n","andThen computes (4+2)×3=18; compose computes 4×3+2=14.","Distinguish two function composition orders"),
        java("Partition by a predicate",wrap('var m=java.util.stream.IntStream.rangeClosed(1,6).boxed().collect(java.util.stream.Collectors.partitioningBy(x->x%2==0,java.util.stream.Collectors.summingInt(Integer::intValue)));System.out.println(m.get(false)+":"+m.get(true));'),"9:12\n","Odd values sum to 1+3+5=9; even values sum to 2+4+6=12.","Combine partitioning with a downstream numeric collector"),
    ]


def ip_design_specs():
    return [
        java("Separate policy from storage",wrap('Cart c=new Cart(new Half());c.add(8);c.add(4);System.out.println(c.total());','''interface Discount{int apply(int x);}record Half()implements Discount{public int apply(int x){return x/2;}}static class Cart{java.util.List<Integer>xs=new java.util.ArrayList<>();Discount d;Cart(Discount d){this.d=d;}void add(int x){xs.add(x);}int total(){return d.apply(xs.stream().mapToInt(Integer::intValue).sum());}}'''),"6\n","Cart aggregates 12 then delegates the pricing policy, which halves it.","Trace a decomposed domain service and injected policy"),
        java("Coordinate repository and service",wrap('Repo r=new Repo();Service s=new Service(r);s.record("a");s.record("a");System.out.println(s.count()+":"+r.xs);','''static class Repo{java.util.Set<String>xs=new java.util.LinkedHashSet<>();void save(String x){xs.add(x);}}static class Service{Repo r;Service(Repo r){this.r=r;}void record(String x){r.save(x);}int count(){return r.xs.size();}}'''),"1:[a]\n","The service delegates both records; repository set semantics retain one value.","Follow responsibilities across service and repository layers"),
        java("Enforce a domain invariant",wrap('Account a=new Account(10);System.out.println(a.take(7)+":"+a.take(5)+":"+a.balance);','''static class Account{int balance;Account(int b){balance=b;}boolean take(int n){if(n>balance)return false;balance-=n;return true;}}'''),"true:false:3\n","The first operation leaves 3; the second is rejected without changing the balance.","Trace accepted and rejected domain transitions"),
        java("Aggregate value objects",wrap('var o=new Order(java.util.List.of(new Line(3,2),new Line(4,1)));System.out.println(o.total());','''record Line(int price,int count){int total(){return price*count;}}record Order(java.util.List<Line>lines){int total(){return lines.stream().mapToInt(Line::total).sum();}}'''),"10\n","Line totals are 6 and 4; Order composes them to 10.","Evaluate a domain aggregate built from value objects"),
        java("Route a command",wrap('App a=new App();a.run("inc");a.run("inc");a.run("reset");a.run("inc");System.out.println(a.n);','''static class App{int n;void run(String c){switch(c){case "inc"->n++;case "reset"->n=0;default->throw new IllegalArgumentException();}}}'''),"1\n","Two increments reach 2, reset returns to 0, and the final increment reaches 1.","Trace application command routing into domain state"),
        java("Compose validation results",wrap('var r=User.create(" Ada ",19);System.out.println(r.name()+":"+r.adult());','''record User(String name,int age){static User create(String n,int a){if(n==null||n.isBlank()||a<0)throw new IllegalArgumentException();return new User(n.trim(),a);}boolean adult(){return age>=18;}}'''),"Ada:true\n","The factory validates, normalizes the name, and the domain query evaluates the age.","Follow validation and normalization into a value model"),
        java("Notify independent observers",wrap('Bus b=new Bus();int[]x={0};b.add(v->x[0]+=v);b.add(v->x[0]*=v);b.send(3);System.out.println(x[0]);','''interface Listener{void on(int v);}static class Bus{java.util.List<Listener>ls=new java.util.ArrayList<>();void add(Listener l){ls.add(l);}void send(int v){ls.forEach(l->l.on(v));}}'''),"9\n","Observers run in insertion order: 0+3=3, then 3×3=9.","Trace event dispatch where observer order affects shared state"),
        java("Use a boundary adapter",wrap('Port p=new Adapter(new Legacy());System.out.println(p.read());','''interface Port{int read();}static class Legacy{String value(){return "07";}}static class Adapter implements Port{Legacy x;Adapter(Legacy x){this.x=x;}public int read(){return Integer.parseInt(x.value());}}'''),"7\n","The adapter converts the legacy string representation to the domain integer contract.","Follow representation conversion at an architectural boundary"),
    ]


def ip_modern_specs():
    return [
        java("Match a sealed hierarchy",wrap('System.out.println(area(new Rect(3,4))+":"+area(new Circle(2)));','''sealed interface Shape permits Rect,Circle{}record Rect(int w,int h)implements Shape{}record Circle(int r)implements Shape{}static int area(Shape s){return switch(s){case Rect(int w,int h)->w*h;case Circle(int r)->3*r*r;};}'''),"12:12\n","The exhaustive pattern switch deconstructs each record and applies its branch.","Use sealed exhaustiveness and record patterns"),
        java("Apply a switch expression",wrap('int day=6;String t=switch(day){case 1,7->"weekend";case 2,3,4,5,6->"work";default->throw new IllegalArgumentException();};System.out.println(t);'),"work\n","Value 6 matches the grouped work-day label and the switch expression yields work.","Resolve a grouped switch-expression arm"),
        java("Compare record values",wrap('var a=new P(1,2);var b=new P(1,2);System.out.println(a.equals(b)+":"+a.x()+":"+a);','''record P(int x,int y){}'''),"true:1:P[x=1, y=2]\n","Records synthesize component accessors, value equality and a structural string form.","Apply three generated record members"),
        java("Use local variable inference",wrap('var xs=new java.util.ArrayList<String>();xs.add("ab");var n=xs.get(0).length();System.out.println(n+":"+xs.getClass().getSimpleName());'),"2:ArrayList\n","var preserves the inferred static types; runtime objects are a String and ArrayList.","Reason about inference without treating var as dynamic typing"),
        java("Match null explicitly",wrap('String s=null;String r=switch(s){case null->"N";case String x when x.isBlank()->"B";default->"V";};System.out.println(r);'),"N\n","The explicit null case runs before guarded String patterns.","Trace null handling in a modern pattern switch"),
        java("Deconstruct nested records",wrap('var p=new Box(new P(2,5));System.out.println(switch(p){case Box(P(int x,int y))->x*y;});','''record P(int x,int y){}record Box(P p){}'''),"10\n","Nested record patterns bind 2 and 5, whose product is 10.","Apply nested record deconstruction"),
        java("Choose an enum branch",wrap('Mode m=Mode.FAST;int x=switch(m){case SAFE->2;case FAST->5;};System.out.println(x);','''enum Mode{SAFE,FAST}'''),"5\n","The exhaustive enum switch chooses FAST and yields five.","Evaluate an exhaustive enum switch expression"),
        java("Use an immutable collection factory",wrap('var xs=java.util.List.of(1,2,3);var ys=xs.stream().map(x->x*x).toList();System.out.println(ys);'),"[1, 4, 9]\n","The stream maps each immutable source element to its square and returns a new list.","Compose modern immutable collection creation and stream transformation"),
    ]


def ip_thread_specs():
    return [
        java("Join before observing",wrap('int[]x={0};Thread t=new Thread(()->x[0]=7);t.start();t.join();System.out.println(x[0]);'),"7\n","join establishes completion before the read, so the worker's write is visible.","Use join to establish a happens-before relation"),
        java("Combine independent worker results",wrap('int[]x={0,0};Thread a=new Thread(()->x[0]=3),b=new Thread(()->x[1]=4);a.start();b.start();a.join();b.join();System.out.println(x[0]+x[1]);'),"7\n","Workers own separate cells; joining both makes their results visible before summing.","Combine independent state after two joins"),
        java("Protect a compound update",wrap('C c=new C();Thread a=new Thread(()->{for(int i=0;i<1000;i++)c.inc();}),b=new Thread(()->{for(int i=0;i<1000;i++)c.inc();});a.start();b.start();a.join();b.join();System.out.println(c.n);','''static class C{int n;synchronized void inc(){n++;}}'''),"2000\n","The synchronized method serializes each read-modify-write; joins wait for all 2000 increments.","Combine mutual exclusion with completion ordering"),
        java("Coordinate with a latch",wrap('var l=new java.util.concurrent.CountDownLatch(2);int[]x={0};for(int v:new int[]{2,5})new Thread(()->{synchronized(x){x[0]+=v;}l.countDown();}).start();l.await();System.out.println(x[0]);'),"7\n","The synchronized additions preserve both updates and await waits for both countdowns.","Coordinate completion and shared-state protection"),
        java("Use an executor result",wrap('try(var e=java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()){var f=e.submit(()->6*7);System.out.println(f.get());}'),"42\n","Future.get waits for the submitted task and returns its computed value.","Trace task submission through future completion"),
        java("Preserve transfer invariants",wrap('Pair p=new Pair();Thread a=new Thread(()->p.move(true,30)),b=new Thread(()->p.move(false,20));a.start();b.start();a.join();b.join();System.out.println(p.a+p.b);','''static class Pair{int a=50,b=50;synchronized void move(boolean ab,int n){if(ab){a-=n;b+=n;}else{b-=n;a+=n;}}}'''),"100\n","Each synchronized transfer preserves the sum, so any serial order leaves total 100.","Reason from an invariant protected by one monitor"),
        java("Observe ordered thread stages",wrap('var q=new java.util.concurrent.ArrayBlockingQueue<Integer>(1);Thread t=new Thread(()->{try{q.put(9);}catch(InterruptedException e){throw new RuntimeException(e);}});t.start();System.out.println(q.take());t.join();'),"9\n","take blocks until the worker places 9; join then confirms termination.","Coordinate producer and consumer through a blocking queue"),
        java("Use atomic accumulation",wrap('var n=new java.util.concurrent.atomic.AtomicInteger();Thread[]ts=new Thread[4];for(int i=0;i<4;i++){ts[i]=new Thread(()->n.addAndGet(3));ts[i].start();}for(Thread t:ts)t.join();System.out.println(n.get());'),"12\n","Four atomic additions of three cannot lose updates; joining all workers precedes the read.","Combine atomic updates and lifecycle completion"),
    ]


def ip_exam_specs():
    return [
        java("Integrate parsing and aggregation",wrap('String data="a:2,b:3,a:4";var m=new java.util.LinkedHashMap<String,Integer>();for(String part:data.split(",")){String[]p=part.split(":");m.merge(p[0],Integer.parseInt(p[1]),Integer::sum);}System.out.println(m);'),"{a=6, b=3}\n","Each record is parsed; merge adds the second a value while preserving first-key order.","Synthesize parsing, maps and aggregation"),
        java("Integrate objects and polymorphism",wrap('var xs=java.util.List.<Cost>of(new Fixed(3),new Scaled(2,4));System.out.println(xs.stream().mapToInt(Cost::value).sum());','''interface Cost{int value();}record Fixed(int n)implements Cost{public int value(){return n;}}record Scaled(int n,int k)implements Cost{public int value(){return n*k;}}'''),"11\n","Polymorphic calls yield 3 and 8; the stream sums them.","Combine a domain interface, records and aggregation"),
        java("Integrate validation and recovery",wrap('for(String s:new String[]{"5","x","-2"}){try{System.out.print(parse(s)+" ");}catch(IllegalArgumentException e){System.out.print("E ");}}System.out.println();','''static int parse(String s){try{int n=Integer.parseInt(s);if(n<0)throw new IllegalArgumentException();return n*2;}catch(NumberFormatException e){throw new IllegalArgumentException(e);}}'''),"10 E E \n","Five maps to ten; malformed and negative inputs both cross the public boundary as IllegalArgumentException.","Integrate parsing, domain validation and exception translation"),
        java("Integrate recursion and collections",wrap('var xs=new java.util.ArrayList<Integer>();walk(4,xs);System.out.println(xs);','''static void walk(int n,java.util.List<Integer>out){if(n==0)return;out.add(n);walk(n-2,out);out.add(n); }'''),"[4, 2, 2, 4]\n","The list records descent 4,2 and then unwind 2,4.","Combine recursive control flow with observable collection mutation"),
        java("Integrate equality and lookup",wrap('var m=new java.util.HashMap<K,Integer>();m.put(new K("A"),2);m.merge(new K("a"),3,Integer::sum);System.out.println(m.size()+":"+m.get(new K("A")));','''record K(String raw){K{raw=raw.toLowerCase();}}'''),"1:5\n","The compact constructor normalizes both keys, so merge updates one map entry to five.","Combine record normalization, equality and map merge"),
        java("Integrate async computation",wrap('try(var e=java.util.concurrent.Executors.newFixedThreadPool(2)){var a=e.submit(()->3);var b=e.submit(()->4);System.out.println(a.get()*b.get());}'),"12\n","Both futures complete independently; get retrieves 3 and 4 before multiplication.","Combine executor lifecycle, futures and result composition"),
        java("Integrate stream grouping",wrap('var r=java.util.stream.Stream.of("ant","ape","bee","bat").collect(java.util.stream.Collectors.groupingBy(s->s.charAt(0),java.util.TreeMap::new,java.util.stream.Collectors.mapping(String::length,java.util.stream.Collectors.summingInt(Integer::intValue))));System.out.println(r);'),"{a=6, b=6}\n","Words group by initial; lengths sum to 3+3 in each ordered key group.","Combine classification, downstream mapping and aggregation"),
        java("Integrate state and invariants",wrap('Stack s=new Stack();s.push(2);s.push(5);int a=s.pop();s.push(a+1);System.out.println(s.pop()+":"+s.pop()+":"+s.n);','''static class Stack{int[]a=new int[4];int n;void push(int x){a[n++]=x;}int pop(){if(n==0)throw new IllegalStateException();return a[--n];}}'''),"6:2:0\n","Pop returns 5, pushing 6 restores two elements; later pops yield 6 then 2 and size zero.","Integrate an array-backed invariant with a multi-step client trace"),
    ]


def canonical_bytes(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()


TOP_TIER_OVERRIDES = {
    "ds.practice.advanced-co-lec-01-07": exact(
        "Reconstruct an accelerated historical workload",
        "A legacy system takes 600 seconds. A successor accelerates the 80% parallelizable part by a factor of 10, leaves the other 20% unchanged, and adds 12 seconds of fixed startup work. What is the successor's total runtime in seconds?",
        180,
        "The accelerated part takes 0.80×600/10=48 seconds; the serial part remains 0.20×600=120 seconds; startup adds 12 seconds. Total: 48+120+12=180 seconds.",
        demand="Separate workload fractions, apply a partial speedup, then include fixed overhead",
    ),
    "ds.practice.advanced-co-lec-02-08": exact(
        "Trace two nested stack frames",
        "Start with %rsp=0x9000. A call pushes an 8-byte return address. The callee executes `pushq %rbp; movq %rsp,%rbp; subq $40,%rsp; pushq %r12`, calls a nested function, and that function executes `pushq %rbp; subq $24,%rsp`. Before any restoration, what is the decimal distance from the current %rsp to the outer callee's %rbp?",
        88,
        "The outer frame base is 0x8ff0 after the first call and saved %rbp. From there: 40 bytes of locals, 8 for %r12, 8 for the nested return address, 8 for its saved %rbp, and 24 nested local bytes. The distance is 40+8+8+8+24=88 bytes.",
        demand="Track return addresses, saved frame pointers, locals and a nested call relative to a stable frame base",
    ),
    "ds.practice.advanced-co-lec-04-07": exact(
        "Derive the safe clock period",
        "A source flip-flop has clock-to-Q delay 2 ns. The longest combinational path is 7 ns, the destination setup time is 3 ns, and worst-case clock skew makes the destination edge arrive 1 ns early. Ignoring jitter, what minimum integer clock period in ns avoids a setup violation?",
        13,
        "Data can arrive after 2+7=9 ns. It must then satisfy 3 ns setup, and the 1 ns early destination edge removes another nanosecond of available time. Therefore T≥2+7+3+1=13 ns.",
        demand="Combine clock-to-Q, path delay, setup time and adverse skew into one timing bound",
    ),
    "ds.practice.advanced-co-lec-06-07": exact(
        "Add and re-encode two compact floats",
        "A custom 8-bit normalized float has one sign bit, a 3-bit excess-3 exponent, and four fraction bits after an implicit leading 1. Decode 1 101 0110 and 0 011 1000, add their values exactly, then encode the sum in the same format. Enter all eight result bits.",
        "11010000",
        "The first pattern is −1.0110₂×2²=−5.5. The second is 1.1000₂×2⁰=1.5. Their sum is −4.0=−1.0000₂×2²; exponent 2 is stored as 5=101, giving 1 101 0000.",
        "binary", 8,
        "Decode two biased floats, align their values, add signs and re-encode the normalized result",
    ),
    "ds.practice.advanced-co-lec-07-08": exact(
        "Budget conditional extension words",
        "A 32-bit ISA uses 6 opcode bits and three 6-bit register fields; the remaining bits form a signed byte-scaled displacement. An extra 16-bit extension word is emitted only when the required signed displacement does not fit. For displacements −20, 120, 128, −129 and 300, how many total instruction bytes are emitted?",
        26,
        "The base format leaves 32−6−18=8 signed bits, covering −128 through 127. The values 128, −129 and 300 need extensions. Five base words use 20 bytes and three extensions add 6, totaling 26 bytes.",
        demand="Derive a field width and signed range, classify five operands, then total variable-length code size",
    ),
    "ds.practice.advanced-co-lec-09-07": exact(
        "Schedule a single-bus memory operation",
        "On a single-bus datapath with Y, Z, MAR and MDR, execute R3←M[R1+R2]. Only one register may drive the bus per cycle; an ALU result must enter Z before MAR; READ is asserted with the MAR transfer; memory then consumes exactly two full wait cycles and loads MDR at the end of the second; MDR must drive the bus to load R3. What is the minimum cycle count?",
        6,
        "Cycle 1 loads Y from R1; cycle 2 drives R2 and latches the sum in Z; cycle 3 transfers Z to MAR and starts READ; cycles 4–5 are the two memory waits ending with MDR loaded; cycle 6 transfers MDR to R3.",
        demand="Construct a legal micro-operation schedule while respecting bus, ALU staging and memory latency",
    ),
    "ds.practice.advanced-co-lec-10-08": exact(
        "Count a side-effect-safe memory microroutine",
        "A microroutine spends one cycle placing an address in MAR and asserting READ, seven cycles in a side-effect-free READY test loop, one cycle transferring MDR to Y, one cycle adding R4 on the bus into Z, and one cycle transferring Z back to R4. How many microcycles execute from request through write-back?",
        11,
        "The READ request executes once. The seven tests add no repeated device action. The final data path uses three more cycles: MDR→Y, R4+Y→Z, and Z→R4. Total: 1+7+3=11.",
        demand="Separate one-shot control signals from wait-loop tests and then schedule the dependent datapath stages",
    ),
    "ds.practice.advanced-co-lec-12-08": exact(
        "Locate CPU completion under cycle stealing",
        "A CPU performs 90 identical groups, each containing two bus-free cycles followed by one CPU bus cycle. A DMA controller steals one bus cycle immediately after every second CPU bus use, including after the 90th use before completion is observed. The DMA has at least 45 words pending. In which cycle does the CPU completion become observable?",
        315,
        "Without DMA the 90 groups take 90×3=270 cycles. There are 90/2=45 scheduled steals, each adding one cycle before completion is observed. Thus completion occurs at cycle 270+45=315.",
        demand="Expand a repeated CPU schedule, place periodic DMA steals and distinguish program completion from later DMA work",
    ),
    "ds.practice.advanced-co-lec-14-07": exact(
        "Count a forwarded pipeline with a taken branch",
        "A five-stage IF/ID/EX/MEM/WB pipeline has full forwarding. A load-use dependency costs one stall; a taken branch resolved in EX flushes the two younger instructions. Execute `lw r1,0(r2); add r3,r1,r4; beq r3,r0,T` (taken); two fall-through instructions; then `T: sub r5,r6,r7`. How many cycles elapse until the four non-flushed instructions retire?",
        11,
        "Four retired instructions need 4+4=8 cycles in an ideal five-stage pipeline. The load-use pair adds one stall. The taken EX-stage branch discards two younger instructions, adding two cycles. Forwarding avoids another add-to-branch stall, so 8+1+2=11.",
        demand="Combine pipeline fill, a load-use stall, forwarding and an EX-stage branch flush",
    ),
    "ds.practice.advanced-co-lec-15-08": exact(
        "Average a two-level translation path",
        "A TLB lookup takes 2 ns and each memory access takes 40 ns. The TLB hit rate is 90%. A hit needs the TLB plus one data access. A miss needs the TLB, two page-table memory accesses, then the data access; assume no page faults and no overlap. What is the effective access time in ns?",
        50,
        "A hit costs 2+40=42 ns. A miss costs 2+2×40+40=122 ns. The weighted mean is 0.90×42+0.10×122=37.8+12.2=50 ns.",
        demand="Build hit and miss paths for a multilevel page table and combine them probabilistically",
    ),
    "ds.practice.advanced-rl-lec-00-07": exact(
        "Count schedules with a block and precedence constraints",
        "Five talks A,B,C,D,E occupy slots 1–5. B is immediately after A; A is before D; C is before D; and E is in neither slot 1 nor slot 5. How many complete schedules satisfy every constraint?",
        4,
        "Treat AB as an ordered block, then test its possible positions against C<D and the endpoint restriction on E. The four valid schedules are ABCED, ABECD, CABED and CEABD.",
        demand="Combine adjacency, two precedence constraints and an endpoint exclusion without double-counting",
    ),
    "ds.practice.advanced-rl-lec-02-07": exact(
        "Derive a chained-implication truth signature",
        "For F=((p→q)∧(q→r))∨(p∧¬r), enter all eight truth values in pqr order 000 through 111.",
        "11011011",
        "Evaluate the implication chain and the exceptional p∧¬r term on every row. Rows 010 and 101 are the only false rows, so the ordered signature is 11011011.",
        "binary", 8,
        "Transform implications, track a competing disjunct and preserve canonical row order",
    ),
    "ds.practice.advanced-rl-lec-03-08": exact(
        "Separate four nested-quantifier claims",
        "The domain is {1,2} and R contains exactly (1,2) and (2,1). Enter four bits for: (1) ∀x∃y R(x,y); (2) ∃y∀x R(x,y); (3) ∀x∃!y R(x,y); (4) ∃x R(x,x).",
        "1010",
        "Each x has exactly one opposite-element witness, so (1) and (3) hold. No single y works for both x values, and there is no self-loop, so (2) and (4) fail.",
        "binary", 4,
        "Distinguish local, global and unique witnesses and then test a diagonal existential",
    ),
    "ds.practice.advanced-rl-lec-05-08": exact(
        "Construct the minimal divisibility counterexample",
        "A proposed proof claims: for integers a,b,c>1, if a divides bc then a divides b or a divides c. Find the counterexample with the smallest possible a, breaking remaining ties by smallest b then c, and enter a+b+c.",
        8,
        "No a=2 or a=3 counterexample exists because both are prime. For a=4, choose b=2 and c=2: 4 divides bc=4, while 4 divides neither factor. The requested sum is 4+2+2=8.",
        demand="Audit a missing primality assumption and prove minimality of a concrete counterexample",
    ),
    "ds.practice.advanced-rl-lec-07-08": exact(
        "Evaluate a nonlocal recurrence",
        "Let f(0)=1, f(1)=2, f(2)=3, and for n≥3 let f(n)=f(n−1)+f(n−3). Compute f(10).",
        60,
        "Successive values are f3=4, f4=6, f5=9, f6=13, f7=19, f8=28, f9=41 and f10=60. Each step must use the current n−1 and n−3 values.",
        demand="Maintain a multi-base recurrence across eight dependent induction-style steps",
    ),
    "ds.practice.advanced-rl-lec-09-07": exact(
        "Reduce a nested set construction",
        "Let A={1,2,3,4}, B={2,3,5}, and C={1,3,4,5}. Enter ((A∪B)∩C) △ ((A\\C)∪(B\\A)) as an integer set.",
        "{1,2,3,4}",
        "The left operand is {1,3,4,5}. The right is {2}∪{5}={2,5}. Symmetric difference removes shared 5 and retains 1,2,3,4.",
        "integer-set", None,
        "Evaluate union, intersection, two differences and a final symmetric difference in the correct nesting",
    ),
    "ds.practice.advanced-rl-lec-11-07": exact(
        "Count length-four directed walks",
        "A directed graph has edges 1→2, 1→3, 2→3, 2→4, 3→1, 3→4 and 4→2. How many directed walks of exactly four edges start at 1 and end at 4? Vertices and edges may repeat.",
        4,
        "Propagate walk counts for four steps (equivalently compute the (1,4) entry of A⁴). The counts from vertex 1 after four edges are (1,2,4,4), so four walks end at 4.",
        demand="Translate a graph into repeated adjacency-count propagation while retaining walks rather than simple paths",
    ),
    "ds.practice.advanced-rl-lec-13-07": exact(
        "Locate a pair in a diagonal enumeration",
        "Positive-integer pairs are enumerated by increasing i+j. Within each diagonal, i increases from 1. The enumeration begins (1,1),(1,2),(2,1),…. At what one-based position does (5,3) appear?",
        26,
        "Diagonals with sums 2 through 7 contain 1+2+3+4+5+6=21 pairs. On sum 8, (5,3) is the fifth pair, so its position is 21+5=26.",
        demand="Convert a countability construction into a finite prefix count and within-diagonal offset",
    ),
    "ds.practice.advanced-rl-lec-14-08": exact(
        "Count all linear extensions of a DAG",
        "A DAG on A,B,C,D,E has edges A→D, B→D, B→E and C→E. How many topological orders does it have?",
        16,
        "Enumerate only orders respecting both prerequisites of D and both prerequisites of E, or use a zero-indegree recurrence over subsets. The valid recurrence yields 16 complete orders; choosing a single greedy order would miss the other extensions.",
        demand="Count every legal topological ordering under overlapping prerequisite sets",
    ),
    "ds.practice.advanced-rl-lec-16-08": exact(
        "Solve a bounded congruence system",
        "Find the integer n with 100<n<300 such that n is divisible by 12, n+1 is divisible by 7, and n−2 is divisible by 5.",
        132,
        "Write n=12k. The other conditions give 12k≡−1 (mod 7), so 5k≡6 and k≡4 (mod 7), while 12k≡2 (mod 5) gives 2k≡2 and k≡1 (mod 5). In the bound, k=11 satisfies both, hence n=132; the combined modulus excludes another solution below 300.",
        demand="Reduce three arithmetic constraints, solve simultaneous congruences and enforce a strict bound",
    ),
    "ds.practice.advanced-ip-lec-01-07": {
        "title": "Trace narrowing, signed shift and masking",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  public static void main(String[] args) {\n    int x=0b10110110;\n    byte b=(byte)x;\n    int y=(b>>2)&0x0f;\n    int z=(x>>>3)+2*y;\n    System.out.println(b+\":\"+y+\":\"+z);\n  }\n}\n",
        "output": "-74:13:48\n",
        "explanation": "Narrowing keeps low byte 10110110, which is −74. Arithmetic right shift gives −19; masking keeps low nibble 13. Unsigned 182>>>3 is 22, and 22+2×13=48.",
        "demand": "Combine binary narrowing, sign extension, arithmetic and logical shifts, masking and precedence",
    },
    "ds.practice.advanced-ip-lec-03-08": {
        "title": "Trace recursive calls with aliased state",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  static int calls;\n  static int f(int n,int[] box){\n    calls++;\n    if(n<=1)return box[0]++;\n    int a=f(n-1,box),b=f(n-2,box);\n    return a+b+n;\n  }\n  public static void main(String[] args){\n    int[] box={1};\n    System.out.println(f(3,box)+\":\"+box[0]+\":\"+calls);\n  }\n}\n",
        "output": "11:4:5\n",
        "explanation": "f(2) receives leaf values 1 and 2 and returns 5; the final f(1) returns 3. Thus f(3)=5+3+3=11. The shared array reaches 4 and five calls occurred.",
        "demand": "Expand a recursion tree while tracking evaluation order, a shared array and a static counter",
    },
    "ds.practice.advanced-ip-lec-05-08": {
        "title": "Trace an unsuccessful recursive binary search",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  static int find(int[] a,int l,int r,int x,int[] probes){\n    if(l>r)return -1;\n    probes[0]++; int m=(l+r)>>>1;\n    return a[m]==x?m:(a[m]<x?find(a,m+1,r,x,probes):find(a,l,m-1,x,probes));\n  }\n  public static void main(String[] args){\n    int[] p={0}; int[] a={1,3,5,7,9,11,13,15,17};\n    System.out.println(find(a,0,a.length-1,8,p)+\":\"+p[0]);\n  }\n}\n",
        "output": "-1:4\n",
        "explanation": "The inspected values are 9, 3, 5 and 7. The next interval is empty, so the search returns −1 after four counted probes.",
        "demand": "Follow recursive interval updates, midpoint arithmetic and aliased probe state through a failed search",
    },
    "ds.practice.advanced-ip-lec-08-07": {
        "title": "Execute a boundary-focused test table",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  static int clamp(int x,int lo,int hi){\n    if(x<=lo)return lo;\n    if(x>=hi)return hi-1;\n    return x;\n  }\n  public static void main(String[] args){\n    int[] in={2,3,5,6,7,8}, expected={3,3,5,6,7,7}; int failed=0;\n    for(int i=0;i<in.length;i++)if(clamp(in[i],3,7)!=expected[i])failed++;\n    System.out.println(failed+\":\"+in.length);\n  }\n}\n",
        "output": "2:6\n",
        "explanation": "Inputs below/at 3 and interior 5 and 6 pass. The faulty upper branch returns 6 for both 7 and 8, while the inclusive specification expects 7, so two of six tests fail.",
        "demand": "Apply an explicit oracle across lower, interior and upper boundary classes and count distinct failures",
    },
    "ds.practice.advanced-ip-lec-10-07": {
        "title": "Separate dispatched methods from hidden fields",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  static class A{\n    int n=1; int step(){return ++n;}\n    int run(){int a=step();return a+step()+n;}\n  }\n  static class B extends A{int n=5;@Override int step(){return --n;}}\n  public static void main(String[] args){\n    A x=new B();\n    System.out.println(x.run()+\":\"+x.n+\":\"+((B)x).n);\n  }\n}\n",
        "output": "8:1:3\n",
        "explanation": "Both step calls dispatch to B and return 4 then 3. The unqualified field n inside A.run is A.n=1, so run returns 8. Field access through x yields A.n=1, while the cast exposes B.n=3.",
        "demand": "Track two dynamic dispatches, mutable subclass state and compile-time field selection",
    },
    "ds.practice.advanced-ip-lec-12-08": {
        "title": "Preserve a primary exception and its suppressed close failure",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  static class R implements AutoCloseable{public void close(){throw new IllegalStateException(\"C\");}}\n  static String f(){\n    try(R r=new R()){throw new IllegalArgumentException(\"B\");}\n    catch(Exception e){return e.getMessage()+\":\"+e.getSuppressed()[0].getMessage();}\n    finally{System.out.print(\"F\");}\n  }\n  public static void main(String[] args){System.out.println(\":\"+f());}\n}\n",
        "output": "F:B:C\n",
        "explanation": "The body exception B remains primary and close failure C is suppressed. The catch prepares B:C, then finally prints F before f returns; main prefixes the returned value with a colon.",
        "demand": "Combine try-with-resources suppression, catch return evaluation, finally order and call-site concatenation",
    },
    "ds.practice.advanced-ip-lec-14-08": {
        "title": "Compose generic filtering with string normalization",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  static <T>java.util.List<T> pick(java.util.List<T> xs,java.util.function.Predicate<T> p){\n    return xs.stream().filter(p).toList();\n  }\n  public static void main(String[] args){\n    var clean=java.util.List.of(\" a \",\"\",\"bb\",\" ccc \").stream().map(String::strip).toList();\n    var kept=pick(clean,s->!s.isBlank()).stream().sorted(java.util.Comparator.comparingInt(String::length).reversed()).toList();\n    System.out.println(String.join(\"|\",kept)+\":\"+kept.stream().mapToInt(String::length).sum());\n  }\n}\n",
        "output": "ccc|bb|a:6\n",
        "explanation": "Stripping yields a, empty, bb and ccc. Generic pick removes the blank string; reverse length order is ccc,bb,a; their lengths sum to six.",
        "demand": "Follow immutable string normalization, a generic predicate helper, comparator order and a terminal reduction",
    },
    "ds.practice.advanced-ip-lec-17-07": {
        "title": "Compose functions inside a filtered reduction",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  public static void main(String[] args){\n    java.util.function.Function<Integer,Integer> f=x->x+2,g=x->x*3;\n    int a=java.util.stream.IntStream.rangeClosed(1,4).map(f.andThen(g)::apply).filter(x->x%2==0).sum();\n    int b=f.compose(g).apply(2);\n    System.out.println(a+b);\n  }\n}\n",
        "output": "38\n",
        "explanation": "andThen maps 1..4 to 9,12,15,18; filtering retains 12 and 18, summing to 30. compose computes f(g(2))=8, so the final result is 38.",
        "demand": "Distinguish composition direction, trace a primitive stream pipeline and combine two results",
    },
    "ds.practice.advanced-ip-lec-19-07": {
        "title": "Aggregate guarded record patterns",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  record Item(String name,int score){}\n  static int value(Object o){return switch(o){\n    case null->0;\n    case Item i when i.score()>5->i.name().length()+i.score();\n    case Item i->i.score();\n    default->-1;\n  };}\n  public static void main(String[] args){\n    var xs=java.util.List.of(new Item(\"alpha\",7),new Item(\"b\",5),\"x\");\n    int sum=xs.stream().mapToInt(x->value(x)).sum()+value(null);\n    System.out.println(sum);\n  }\n}\n",
        "output": "16\n",
        "explanation": "The guarded record contributes 5+7=12, the unguarded Item contributes 5, the String contributes −1, and the explicit null case contributes 0. Total: 16.",
        "demand": "Apply record deconstruction context, guarded switch order, a default branch and stream aggregation",
    },
    "ds.practice.advanced-ip-lec-21-08": {
        "title": "Integrate mutable state, removal and a checksum",
        "prompt": "What exactly does this Java 21 program print? Choose the single matching output.",
        "code": "public class Program {\n  static class Ledger{\n    final java.util.Map<String,Integer> m=new java.util.LinkedHashMap<>();\n    void add(String k,int d){int n=m.getOrDefault(k,0)+d;if(n==0)m.remove(k);else m.put(k,n);}\n    int checksum(){return m.values().stream().mapToInt(Integer::intValue).sum()+m.size();}\n  }\n  public static void main(String[] args){\n    Ledger x=new Ledger();\n    x.add(\"A\",3);x.add(\"B\",2);x.add(\"A\",-1);x.add(\"C\",4);x.add(\"B\",-2);x.add(\"A\",2);\n    System.out.println(x.m+\":\"+x.checksum());\n  }\n}\n",
        "output": "{A=4, C=4}:10\n",
        "explanation": "A evolves 3→2→4. B reaches zero and is removed; C remains 4. LinkedHashMap preserves surviving insertion order A,C. Values sum to 8 and two entries make checksum 10.",
        "demand": "Trace object state through six operations, removal semantics, insertion order and a stream-derived invariant",
    },
}


TOP_TIER_IDS = frozenset(TOP_TIER_OVERRIDES)


def slug(unit):
    return unit.lower().replace("_", "-")


def task_rules(fmt, width):
    if fmt == "binary":
        return f"Enter exactly {width} binary digits with no prefix or internal spaces."
    if fmt == "hex":
        return f"Enter exactly {width} hexadecimal digits with no 0x prefix. Letter case is ignored."
    if fmt == "integer-set":
        return "Enter a finite integer set in braces. Order and whitespace are ignored; duplicates are not allowed."
    if fmt == "decimal":
        return "Enter the exact decimal value without units. A leading minus sign and decimal point are allowed."
    return "Enter an integer without units, exponent notation or internal spaces."


def distract_outputs(output):
    shown = output.rstrip("\n")
    numeric = re.fullmatch(r"-?\d+", shown)
    if numeric:
        n = int(shown)
        values = [str(n + 1), str(n - 1)]
    elif ":" in shown:
        parts = shown.split(":")
        values = [":".join(reversed(parts)), shown.replace("true", "false", 1) if "true" in shown else shown + ":0"]
    elif shown.startswith("["):
        values = [shown.replace(", ", " ", 1), "[]"]
    else:
        values = [shown[::-1], "A runtime exception is thrown"]
    unique = []
    for value in values + ["The program does not compile"]:
        if value and value != shown and value not in unique:
            unique.append(value)
    return unique[:2]


def load_expansion_metadata():
    items = []
    for path in sorted((ROOT / "src/expansion").glob("*.json")):
        data = json.loads(path.read_text())
        if isinstance(data, list):
            items.extend(x for x in data if isinstance(x, dict) and x.get("unitId"))
    by_unit = {}
    for item in items:
        by_unit.setdefault(item["unitId"], []).append(item)
    return by_unit


def source_locator(unit, filename):
    for topic in PACK["taxonomy"]["topics"]:
        for ref in topic.get("lecture_references", []):
            if ref.get("document_id") == unit:
                return ref.get("source_page_or_slide", "UNKNOWN")
    for ref in STUDY["sources"]:
        if ref.get("documentId") == unit and ref.get("locator") != "UNKNOWN":
            return ref["locator"]
    raise ValueError(f"No canonical document-range locator for {unit} {filename}")


def build_pack():
    availability = json.loads((ROOT / "docs/maintenance-patch-7-source-availability.json").read_text())
    metadata = load_expansion_metadata()
    output = []
    topic_subject = {topic["id"]: topic["subjectId"] for topic in STUDY["topics"]}
    for unit_index, source_row in enumerate(availability):
        unit = source_row["unit"]
        candidates = metadata.get(unit, [])
        if not candidates:
            raise ValueError(f"No accepted Patch 7 metadata for {unit}")
        specs = ip_specs(unit) if unit.startswith("IP_") else co_specs(unit) if unit.startswith("CO_") else rl_specs(unit)
        if len(specs) != 8:
            raise ValueError(f"{unit}: expected 8 specs, got {len(specs)}")
        for index, spec in enumerate(specs):
            candidate = candidates[index % len(candidates)]
            skills = candidate.get("skillIds") or [candidate.get("skillId")]
            # Harder items retain multiple evidence-backed skill links when the unit supplies them.
            if index >= 3:
                for other in candidates:
                    if other.get("topicId") != candidate.get("topicId"):
                        continue
                    for skill in other.get("skillIds") or [other.get("skillId")]:
                        if skill and skill not in skills:
                            skills.append(skill)
            primary_skill = skills[0]
            topic = next(item for item in STUDY["topics"] if item["id"] == candidate["topicId"])
            primary_subtopic = next(item["id"] for item in topic["subtopics"] if any(skill["id"] == primary_skill for skill in item["skills"]))
            exercise_id = f"ds.practice.advanced-{slug(unit)}-{index + 1:02d}"
            spec = TOP_TIER_OVERRIDES.get(exercise_id, spec)
            proposed = (["Medium"] * 3 + ["Hard"] * 5)[index] if unit_index < 21 else (["Medium"] * 2 + ["Hard"] * 6)[index]
            difficulty = "Exam-level" if exercise_id in TOP_TIER_IDS else proposed
            common = {
                "id": exercise_id,
                "version": "1",
                "title": spec["title"],
                "prompt": spec["prompt"],
                "subjectId": topic_subject[candidate["topicId"]],
                "topicId": candidate["topicId"],
                "subtopicId": primary_subtopic,
                "skillId": primary_skill,
                "skillIds": skills,
                "unitId": unit,
                "mode": "practice" if index < 4 else "exam",
                "difficulty": difficulty,
                "demand": spec["demand"],
                "authorship": "AUTHORED_PRACTICE",
                "source": {
                    "kind": "LECTURE",
                    "documentId": unit,
                    "filename": source_row["filename"],
                    "locator": source_locator(unit, source_row["filename"]),
                    "precision": "DOCUMENT_RANGE",
                },
                "sourceSha256": source_row["canonicalSha256"],
                "explanation": spec["explanation"],
            }
            if unit.startswith("IP_"):
                correct = spec["output"].rstrip("\n")
                traps = distract_outputs(spec["output"])
                common.update({
                    "rules": "Read the complete program using Java 21 semantics. Select exactly one stated output; do not run learner-supplied code.",
                    "grader": {"id": "ip-fixed-choice", "version": "1"},
                    "task": {"kind": "ip-fixed", "code": spec["code"], "options": [
                        {"id": "reference", "output": correct},
                        {"id": "near-miss", "output": traps[0]},
                        {"id": "alternate", "output": traps[1]},
                    ]},
                    "reference": {"kind": "choice", "value": ["reference"]},
                    "oracleStdout": spec["output"],
                })
            else:
                common.update({
                    "rules": task_rules(spec["format"], spec["width"]),
                    "grader": {"id": "co-exact" if unit.startswith("CO_") else "rl-exact", "version": "1"},
                    "task": {"kind": "co-exact" if unit.startswith("CO_") else "rl-exact", "format": spec["format"], "width": spec["width"]},
                    "reference": {"kind": "text", "value": spec["answer"]},
                })
            output.append(common)
    return output


def main():
    exercises = build_pack()
    out_dir = ROOT / "src/advanced"
    out_dir.mkdir(exist_ok=True)
    (out_dir / "practice.json").write_text(json.dumps(exercises, ensure_ascii=False, indent=2) + "\n")
    lock = {f'{x["id"]}@{x["version"]}': hashlib.sha256(canonical_bytes(x)).hexdigest() for x in exercises}
    (out_dir / "practice-lock.json").write_text(json.dumps(lock, indent=2) + "\n")
    print(f"Wrote {len(exercises)} advanced exercises and immutable fingerprints.")


if __name__ == "__main__":
    main()
