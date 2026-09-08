export const examplePrograms = [
  {id: 'arithmetic', name: 'Basic arithmetic', description: 'Move values and add two registers.', expected: 'RAX = 8', source: `# Add two numbers using registers
main:
    movq $5, %rax
    movq $3, %rdi
    addq %rdi, %rax`},
  {id: 'stack-frame', name: 'Stack frame', description: 'Reserve space, store locals, and restore the frame.', expected: 'RAX = 15 · RSP = 0x1000', source: `# Build a stack frame with two local variables
main:
    pushq %rbp
    movq %rsp, %rbp
    subq $16, %rsp
    movq $5, -8(%rbp)
    movq $10, -16(%rbp)
    movq -8(%rbp), %rax
    addq -16(%rbp), %rax
    movq %rbp, %rsp
    popq %rbp`},
  {id: 'function-call', name: 'Function call', description: 'Pass an argument in RDI and return a result in RAX.', expected: 'RAX = RBX = 7 · RSP = 0x1000', source: `# Execution starts at main, below the helper
add_two:
    pushq %rbp
    movq %rsp, %rbp
    movq %rdi, %rax
    addq $2, %rax
    movq %rbp, %rsp
    popq %rbp
    ret

main:
    movq $5, %rdi
    call add_two
    movq %rax, %rbx`},
] as const;
