import { describe,it,expect } from 'vitest';
import { lessons } from '../src/topic-study/content';
const block=(id:string)=>lessons.flatMap(l=>l.blocks).find(b=>b.id===`ds.block.${id}`)!;
describe('independently checked authored examples',()=>{
 it('checks radix conversion and addition using explicit positional arithmetic',()=>{
  expect(16+2+1).toBe(19);expect(1*16+3).toBe(19);expect(11+7).toBe(18);expect(16+2).toBe(18);
  expect(block('co.radix-example').table?.rows).toEqual([['10011₂','19'],['13₁₆','19'],['10010₂','18']]);
  expect(block('co.radix-example').paragraphs[1]).toContain('1011₂ + 0111₂ = 10010₂');
 });
 it('checks the three signed encodings, range and overflow independently',()=>{
  expect(block('co.signed-example').table?.rows).toEqual([['Sign-and-magnitude','1101'],['Ones’ complement','1010'],['Twos’ complement','1011']]);
  expect(-(4+1)).toBe(-5);expect(15-10).toBe(5);expect(-8+2+1).toBe(-5);
  expect(6+3).toBeGreaterThan(7);expect(-8+1).toBe(-7);expect(block('co.overflow').paragraphs[1]).toContain('0110 + 0011');
 });
 it('checks BCD, bias and byte reconstruction separately from the authored text',()=>{
  expect(2*10+7).toBe(27);expect(2*16+7).toBe(39);expect(-2+7).toBe(5);
  expect(block('co.encodings').paragraphs[0]).toContain('0010 0111');expect(block('co.encodings').paragraphs[1]).toContain('0101');
  expect(0x12*256+0x34).toBe(0x1234);expect(block('co.endian').table?.rows).toEqual([['Big-endian','0x12','0x34'],['Little-endian','0x34','0x12']]);
 });
 it('independently enumerates De Morgan and DNF/CNF equivalences in all four rows',()=>{
  const rows=[[false,false],[false,true],[true,false],[true,true]];
  expect(rows.map(([p,q])=>[!(p&&q),!p||!q])).toEqual([[true,true],[true,true],[true,true],[false,false]]);
  expect(block('rl.demorgan').table?.rows).toEqual([['F','F','T','T'],['F','T','T','T'],['T','F','T','T'],['T','T','F','F']]);
  expect(rows.map(([p,q])=>[(p&&!q)||(!p&&q),(p||q)&&(!p||!q)])).toEqual([[false,false],[true,true],[true,true],[false,false]]);
  expect(block('rl.forms').paragraphs[1]).toContain('(p ∨ q) ∧ (¬p ∨ ¬q)');expect(block('rl.forms').paragraphs[1]).toContain('F, T, T, F');
 });
 it('checks implication, contrapositive, converse/inverse and both argument examples',()=>{
  const rows=[[false,false],[false,true],[true,false],[true,true]];
  expect(rows.map(([p,q])=>!p||q)).toEqual([true,true,false,true]);
  expect(rows.map(([p,q])=>q||!p)).toEqual([true,true,false,true]);
  expect(rows.map(([p,q])=>!q||p)).toEqual([true,false,true,true]);expect(rows.map(([p,q])=>p||!q)).toEqual([true,false,true,true]);
  expect(rows.filter(([p,q])=>(!p||q)&&p&&!q)).toEqual([]);expect(rows.filter(([p,q])=>(!p||q)&&q&&!p)).toEqual([[false,true]]);
  expect(block('rl.validity').paragraphs[1]).toContain('p = F and q = T');
  expect(rows.some(([p])=>p&&!p)).toBe(false);
 });
 it('checks four trusted Java examples against independent hand traces',()=>{
  expect(block('ip.branch').code).toContain('int score = 7;');expect(block('ip.branch').paragraphs[0]).toContain('prints pass');expect([7<0,7>=6]).toEqual([false,true]);
  expect(block('ip.switch').code).toContain('int choice = 2;');expect(block('ip.switch').code).toContain('System.out.println("middle");\n        break;');expect(block('ip.switch').paragraphs[0]).toContain('prints middle');
  const trace=[[1,1],[1,1],[4,2],[4,2],[9,3]];let sum=0,count=0;expect([1,2,3,4,5].map(i=>{if(i%2!==0){sum+=i;count++;}return [sum,count];})).toEqual(trace);
  expect(block('ip.aggregate').code).toContain('i <= 5');expect(block('ip.aggregate').paragraphs[0]).toContain('9 3');expect([1,2,3,4].map(i=>i%4===0)).toEqual([false,false,false,true]);expect(block('ip.search').paragraphs[0]).toContain('prints 4');
 });
});
