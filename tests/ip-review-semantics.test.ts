import {describe,expect,it} from 'vitest';
import topic from '../src/ip/topics/IP_T03_METHODS_SCOPE.json';

describe('adversarial IP teaching semantics regressions',()=>{
 it('separates a method header and result type from Java method signature terminology',()=>{
  const contract=topic.lesson.blocks.find(b=>b.id==='ds.block.ip.t03.contract')!;
  const card=topic.cards.find(c=>c.id==='ds.card.ip.t03.signature')!;
  expect(contract.title).not.toMatch(/signature/i);
  expect(contract.paragraphs.join(' ')).toMatch(/header.*static int countPositive/);
  expect(contract.paragraphs.join(' ')).toMatch(/signature.*name.*parameter types/);
  expect(contract.paragraphs.join(' ')).toMatch(/return type.*not.*signature/);
  expect(contract.paragraphs.join(' ')).toMatch(/cannot overload.*return type/);
  expect(card.prompt).toMatch(/header|declaration/);
  expect(card.answer).toMatch(/return type.*not.*signature/);
 });
});
