import {describe,expect,it} from 'vitest';
import {parseProgram} from '../src/engine/parser';
import {createSession,currentCPU,nextSession} from '../src/engine/session';
import {readMemory} from '../src/engine/memory';

function execute(source:string,input=''){
  const program=parseProgram(source);
  let session=createSession(program,input);
  for(let guard=0;guard<500&&!currentCPU(session).halted;guard++)session=nextSession(program,session);
  const cpu=currentCPU(session);
  if(!cpu.halted)throw new Error('Fixture did not halt within 500 steps.');
  return {program,cpu,session};
}

describe('Assembly Visualizer V2 parser and data image',()=>{
  it('assembles sections, constants, lists, strings, skips and little-endian data',()=>{
    const {program,cpu}=execute(`
      .equ COUNT, 3
      .data
      values: .word 0x1234, COUNT
      message: .asciz "Hi\\n"
      raw: .ascii "AZ"
      .bss
      space: .skip 4
      .text
      .global main
      main:
        movw values, %ax
        ret
    `);
    expect(cpu.registers.rax).toBe(0x1234n);
    expect(program.exports.has('main')).toBe(true);
    expect(program.initialBytes[0x2000]).toBe(0x34);
    expect(program.initialBytes[0x2001]).toBe(0x12);
    expect(program.variables.map(item=>item.name)).toEqual(['values','message','raw','space']);
  });

  it('reports unsupported include and malformed operands with source lines',()=>{
    expect(()=>parseProgram('.text\n.include "x.s"\nmain: ret')).toThrow(/external GNU assembler/i);
    expect(()=>parseProgram('.text\nmain:\n movq 4(%rax,%rbx,3), %rcx')).toThrow(/scale/i);
  });
});

describe('Assembly Visualizer V2 execution core',()=>{
  it('implements register aliases and 32-bit zero extension',()=>{
    const {cpu}=execute(`main:
      movq $-1, %rax
      movb $0x12, %al
      movb $0x34, %ah
      movl $7, %eax
      ret`);
    expect(cpu.registers.rax).toBe(7n);
  });

  it('reads and writes unaligned byte-addressable memory with indexed addressing',()=>{
    const {cpu}=execute(`.data
      bytes: .byte 1, 2, 3, 4, 5
      .text
      main:
        movq $1, %rax
        movb bytes(,%rax,2), %bl
        movb $9, 1+bytes
        ret`);
    expect(cpu.registers.rbx).toBe(3n);
    expect(cpu.bytes[0x2001]).toBe(9);
  });

  it('updates flags and follows signed conditional branches',()=>{
    const {cpu,session}=execute(`main:
      movq $2, %rax
      cmpq $3, %rax
      jl lower
      movq $0, %rbx
      ret
      lower:
      movq $1, %rbx
      ret`);
    expect(cpu.registers.rbx).toBe(1n);
    expect(session.steps.some(step=>step.changedFlags.length>0)).toBe(true);
  });

  it('supports arithmetic, logic, shifts, multiplication and division',()=>{
    const {cpu}=execute(`main:
      movq $6, %rax
      imulq $7, %rax
      xorq %rdx, %rdx
      movq $5, %rbx
      divq %rbx
      shlq $1, %rax
      orq $1, %rax
      andq $0xff, %rax
      ret`);
    expect(cpu.registers.rax).toBe(17n);
    expect(cpu.registers.rdx).toBe(2n);
  });

  it('supports calls, stack frames, lea and indirect calls',()=>{
    const {cpu}=execute(`.data
      target: .quad helper
      .text
      main:
        pushq %rbp
        movq %rsp, %rbp
        leaq target, %rax
        movq (%rax), %rbx
        call *%rbx
        popq %rbp
        ret
      helper:
        movq $42, %rax
        ret`);
    expect(cpu.registers.rax).toBe(42n);
    expect(cpu.registers.rsp).toBe(4096n);
  });

  it('supports loop with a finite counter',()=>{
    const {cpu}=execute(`main:
      movq $3, %rcx
      xorq %rax, %rax
      again:
        incq %rax
        loop again
      ret`);
    expect(cpu.registers.rax).toBe(3n);
    expect(cpu.registers.rcx).toBe(0n);
  });
});

describe('Assembly Visualizer V2 simulated I/O',()=>{
  it('simulates printf formats without executing host code',()=>{
    const {cpu}=execute(`.data
      fmt: .asciz "%ld %lx %c %s %%"
      word: .asciz "ok"
      .text
      main:
        movq $fmt, %rdi
        movq $42, %rsi
        movq $255, %rdx
        movq $65, %rcx
        movq $word, %r8
        call printf
        ret`);
    expect(cpu.terminal).toBe('42 ff A ok %');
  });

  it('simulates scanf against an explicit local input queue',()=>{
    const {program,cpu}=execute(`.data
      fmt: .asciz "%ld"
      value: .quad 0
      .text
      main:
        movq $fmt, %rdi
        movq $value, %rsi
        call scanf
        movq value, %rax
        ret`,'  -27');
    const address=program.symbols.get('value')!.value;
    expect(cpu.registers.rax).toBe(-27n);
    expect(readMemory(cpu.bytes,address,64)).toBe(BigInt.asUintN(64,-27n));
  });

  it('simulates write and exit syscalls',()=>{
    const {cpu}=execute(`.data
      text: .ascii "OK"
      .text
      main:
        movq $1, %rax
        movq $1, %rdi
        movq $text, %rsi
        movq $2, %rdx
        syscall
        movq $60, %rax
        movq $9, %rdi
        syscall`);
    expect(cpu.terminal).toBe('OK');
    expect(cpu.exitCode).toBe(9n);
  });

  it('rejects unsupported syscalls and unmapped memory safely',()=>{
    expect(()=>execute('main:\n movq $99, %rax\n syscall')).toThrow(/Unsupported simulated syscall/i);
    expect(()=>execute('main:\n movq 999999(%rax), %rbx\n ret')).toThrow(/memory/i);
  });
});

describe('Assembly Visualizer V2 manual capability fixtures',()=>{
  it('move-widths and register-aliases preserve shared register semantics',()=>{
    const {cpu}=execute(`main:
      movq $-1, %rax
      movw $0x1234, %ax
      movb $0x56, %ah
      movb $0x78, %al
      movl $0x89abcdef, %eax
      movq $0x1122334455667788, %r8
      movw $0xabcd, %r8w
      movb $0xee, %r8b
      ret`);
    expect(cpu.registers.rax).toBe(0x89abcdefn);
    expect(BigInt.asUintN(64,cpu.registers.r8)).toBe(0x112233445566abeen);
  });

  it('move-zero-extend, xchg-lea and att-order execute exact operand semantics',()=>{
    const {cpu}=execute(`.data
      value: .byte 255
      .text
      main:
        movzbq value, %rax
        movq $7, %rbx
        xchgq %rax, %rbx
        leaq value, %rcx
        ret`);
    expect(cpu.registers.rax).toBe(7n);
    expect(cpu.registers.rbx).toBe(255n);
    expect(cpu.registers.rcx).toBe(0x2000n);
  });

  it('memory-bss allocates zero bytes and supports normal variable writes',()=>{
    const {program,cpu}=execute(`.bss
      slot: .skip 8
      .text
      main:
        movq slot, %rax
        movq $0x1122334455667788, slot
        ret`);
    const address=Number(program.symbols.get('slot')!.value);
    expect(cpu.registers.rax).toBe(0n);
    expect(Array.from({length:8},(_,index)=>cpu.bytes[address+index])).toEqual([0x88,0x77,0x66,0x55,0x44,0x33,0x22,0x11]);
  });

  it('signed-branches verifies JE JNE JG JGE JL and JLE formulas',()=>{
    const cases:[string,bigint,bigint][]=[['je',2n,2n],['jne',2n,3n],['jg',3n,2n],['jge',2n,2n],['jl',2n,3n],['jle',2n,2n]];
    for(const [branch,left,right] of cases){
      const {cpu}=execute(`main:
        movq $${left}, %rax
        cmpq $${right}, %rax
        ${branch} taken
        movq $0, %rbx
        ret
        taken:
        movq $1, %rbx
        ret`);
      expect(cpu.registers.rbx,branch).toBe(1n);
    }
  });

  it('calls-recursion keeps independent frames in a synthetic triangular sum',()=>{
    const {cpu}=execute(`main:
      movq $5, %rdi
      call sum
      ret
      sum:
      cmpq $0, %rdi
      je base
      pushq %rdi
      decq %rdi
      call sum
      popq %rbx
      addq %rbx, %rax
      ret
      base:
      xorq %rax, %rax
      ret`);
    expect(cpu.registers.rax).toBe(15n);
    expect(cpu.registers.rsp).toBe(4096n);
  });

  it('abi-arguments exposes six register arguments, a stack argument and RAX return',()=>{
    const {cpu}=execute(`main:
      movq $1, %rdi
      movq $2, %rsi
      movq $3, %rdx
      movq $4, %rcx
      movq $5, %r8
      movq $6, %r9
      pushq $7
      call total
      addq $8, %rsp
      ret
      total:
      movq %rdi, %rax
      addq %rsi, %rax
      addq %rdx, %rax
      addq %rcx, %rax
      addq %r8, %rax
      addq %r9, %rax
      addq 8(%rsp), %rax
      ret`);
    expect(cpu.registers.rax).toBe(28n);
  });

  it('abi-alignment emits a non-destructive warning for a misaligned call',()=>{
    const program=parseProgram('helper: ret\nmain: pushq $1\ncall helper\naddq $8, %rsp\nret');
    let session=createSession(program);
    session=nextSession(program,session);
    session=nextSession(program,session);
    expect(session.steps.at(-1)!.warnings).toContain('Stack is not 16-byte aligned for this call.');
  });

  it('indirect-dispatch resolves a synthetic function table safely',()=>{
    const {cpu}=execute(`.data
      functions: .quad worker
      .text
      main:
        movq $functions, %rax
        movq (%rax), %rbx
        call *%rbx
        ret
      worker:
        movq $73, %rax
        ret`);
    expect(cpu.registers.rax).toBe(73n);
  });

  it('binary-capabilities transforms an unrelated byte buffer with indexed XOR',()=>{
    const {program,cpu}=execute(`.data
      buffer: .byte 1, 2, 3, 4
      .text
      main:
        movq $buffer, %rbx
        movq $0, %rcx
      again:
        xorb $0xff, (%rbx,%rcx,1)
        incq %rcx
        cmpq $4, %rcx
        jl again
        ret`);
    const address=Number(program.symbols.get('buffer')!.value);
    expect([0,1,2,3].map(index=>cpu.bytes[address+index])).toEqual([254,253,252,251]);
  });

  it('ansi-bytes remain inert terminal text and never become host control',()=>{
    const {cpu}=execute(`.data
      text: .byte 27, 91, 51, 49, 109, 88
      .text
      main:
        movq $1, %rax
        movq $1, %rdi
        movq $text, %rsi
        movq $6, %rdx
        syscall
        movq $60, %rax
        xorq %rdi, %rdi
        syscall`);
    expect([...cpu.terminal].map(char=>char.codePointAt(0))).toEqual([27,91,51,49,109,88]);
  });

  it('coverage-boundaries reject host directives, arbitrary syscalls and source injection',()=>{
    expect(()=>parseProgram('.include "/tmp/host.s"\nmain: ret')).toThrow(/external GNU assembler/i);
    expect(()=>execute('main:\n movq $2, %rax\n syscall')).toThrow(/Unsupported simulated syscall/i);
    expect(()=>parseProgram('main: <script>alert(1)</script>')).toThrow(/Unsupported instruction/i);
  });
});
