import { describe, expect, it } from 'vitest';
import { parseOperand, parseProgram } from '../src/engine/parser';

describe('AT&T operands', () => {
  it.each([['$5', 5n], ['$-3', -3n], ['$0xFF', 255n], ['$-0x10', -16n], ['$+10', 10n]])('parses %s', (source, value) => {
    expect(parseOperand(source)).toEqual({kind: 'immediate', value});
  });
  it.each(['rax','rbx','rcx','rdx','rdi','rsi','rsp','rbp'])('parses %s', name => {
    expect(parseOperand(`%${name}`)).toEqual({kind: 'register', name});
  });
  it.each([['-8(%rbp)', 'rbp', -8n], ['8(%rsp)', 'rsp', 8n], ['(%rbp)', 'rbp', 0n], ['(%rsp)', 'rsp', 0n], ['-0x10(%rax)', 'rax', -16n]])('parses %s', (source, base, displacement) => {
    expect(parseOperand(source)).toEqual({kind: 'memory', base, displacement});
  });
  it('reports unknown registers with original line numbers', () => expect(() => parseOperand('%rxx', 7)).toThrow('Line 7: Unknown register "%rxx"'));
  it.each(['$abc', '8(%rbp', '(%rbp,%rax,8)', '%%rax', '$', ''])('rejects invalid operand %s', value => expect(() => parseOperand(value)).toThrow('Invalid operand'));
});

describe('program parsing', () => {
  it('ignores blank lines/comments and supports inline labels', () => {
    const program = parseProgram('# heading\n\nmain: movq $5, %rax # five\n addq $3, %rax');
    expect(program.instructions).toHaveLength(2);
    expect(program.instructions[0].line).toBe(3);
    expect(program.labels.get('main')).toBe(0);
  });
  it('enters main, supports forward labels, and preserves case-sensitive labels', () => {
    const program = parseProgram('helper: ret\nmain: call Later\nLater: movq $1, %rax');
    expect(program.entry).toBe(1);
    expect(program.labels.get('Later')).toBe(2);
  });
  it('safely handles object-prototype label names', () => expect(parseProgram('main: call constructor\nconstructor: ret').labels.get('constructor')).toBe(1));
  it.each([
    ['\n\n\nxorq %rax, %rax', 'Line 4: Unsupported instruction "xorq"'],
    ['main:\nmain: ret', 'Duplicate label'],
    ['call calculate', 'label "calculate"'],
    ['call end\nend:', 'label "end"'],
    ['# nothing\n', 'No instructions'],
    ['movq $1, %rax\nmain:', 'main label has no instructions'],
    ['movq $1', 'expects 2 operands'],
    ['ret %rax', 'expects 0 operands'],
    ['movq %rax, $1', 'destination'],
    ['movq (%rax), (%rbp)', 'two memory operands'],
    ['addq (%rax), (%rbp)', 'two memory operands'],
    ['subq (%rax), (%rbp)', 'two memory operands'],
    ['imulq %rax, (%rbp)', 'register destination'],
    ['leaq $8, %rax', 'memory address'],
    ['leaq (%rbp), (%rsp)', 'destination register'],
    ['call %rax', 'requires a label'],
    ['popq $1', 'destination'],
    ['incq $1', 'destination'],
    ['movq 5, %rax', 'Invalid operand'],
    ['movq $1,, %rax', 'Invalid operand'],
    ['.globl main', 'Unsupported instruction'],
  ])('rejects %s', (source, message) => expect(() => parseProgram(source)).toThrow(message));
});
