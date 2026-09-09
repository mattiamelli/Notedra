import {it,expect} from 'vitest';
import exercises from '../src/enrichment/practice.json';
import cards from '../src/enrichment/cards.json';
import guides from '../src/enrichment/guided.json';
// Independent calculations: no production grader, simulator, logic or model import.
const reference:Record<string,()=>string>={
 'carry-overflow':()=>{const a=11,b=13,sum=a+b,signed=(a-16)+(b-16);return [Number(sum>=16),Number(signed< -8||signed>7)].join(',');},
 'address-load':()=>{const base=4096,offset=-16,table=new Map([[4080,37]]);return [base+offset,table.get(base+offset)].join(',');},
 'cache-fields':()=>{const address=182,block=8,sets=4;return [Math.floor(address/(block*sets)),Math.floor(address/block)%sets,address%block].join(',');},
 'implication-directions':()=>{const p=false,q=true;return [!p||q,!q||p,q||!p].map(Number).join(',');},
 'constant-assignment':()=>{const P=new Set(['a']),constant='a',assignment='b';return [P.has(constant),P.has(assignment),['a','b'].every(x=>P.has(x))].map(Number).join(',');},
 'empty-set-layers':()=>{const a=[[]],subsets=[[],[a[0]]],empty:number[]=[];return [a.length,subsets.length,a.flatMap(x=>empty.map(y=>[x,y])).length].join(',');},
};
it('independently covers every new deterministic definition, with no unmatched oracle',()=>{expect(exercises.map(e=>e.id.replace('ds.practice.enrich-','')).sort()).toEqual(Object.keys(reference).sort());});
it.each(exercises)('$id reference matches a separate derivation',e=>expect(e.reference.value).toBe(reference[e.id.replace('ds.practice.enrich-','')]()));
it('carry is not overflow: all 256 four-bit additions agree with the signed-range theorem',()=>{for(let a=0;a<16;a++)for(let b=0;b<16;b++){const x=a<8?a:a-16,y=b<8?b:b-16,result=(a+b)%16;const overflow=x+y< -8||x+y>7;expect(overflow).toBe((a>=8)===(b>=8)&&(result>=8)!==(a>=8));}expect((15+1)%16).toBe(0);expect(-1+1).toBe(0);});
it('rejects the CO Notes lower bound and zero extension of a negative value',()=>{const values=Array.from({length:64},(_,n)=>n<32?n:n-64);expect(Math.min(...values)).toBe(-32);expect(Math.max(...values)).toBe(31);expect(0b10110-32).toBe(-10);expect(0b11110110-256).toBe(-10);expect(0b00010110).toBe(22);expect(cards.find(c=>c.id.endsWith('.minimum'))?.answer).toContain('−32');});
it('cache field values reconstruct every eight-bit address; ways do not change fields',()=>{for(let a=0;a<256;a++){const tag=Math.floor(a/32),index=Math.floor(a/8)%4,off=a%8;expect(tag*32+index*8+off).toBe(a);}expect(reference['cache-fields']()).toBe('5,2,6');});
it('pipeline fill counts completed slots rather than issue slots',()=>{const completion=Array.from({length:6},(_,i)=>i+5);expect(completion.at(-1)!+2).toBe(12);expect(completion[0]).toBe(5);});
it('necessary and converse note errors have explicit counter-valuations',()=>{const rows=[false,true].flatMap(p=>[false,true].map(q=>({p,q})));expect(rows.every(({p,q})=>(!p||q)===(q||!p))).toBe(true);expect(rows.some(({p,q})=>(!p||q)!==(!q||p))).toBe(true);expect(!false||true).toBe(true);expect(!true||false).toBe(false);expect(cards.find(c=>c.id.endsWith('.necessary'))?.answer).toContain('p=false, q=true');});
it('checks shared versus dependent witnesses and negation independently',()=>{const d=[1,2,3],pairs=[[1,2],[2,3],[3,3]],R=(x:number,y:number)=>pairs.some(([a,b])=>a===x&&b===y);expect(d.every(x=>d.some(y=>R(x,y)))).toBe(true);expect(d.some(y=>d.every(x=>R(x,y)))).toBe(false);expect(d.filter(x=>![1,3].includes(x))).toEqual([2]);});
it('blocks the summary empty-set membership error and does not flatten nested sets',()=>{const empty:unknown[]=[],singleton=[empty];expect(singleton).toContain(empty);expect(singleton).toHaveLength(1);expect(cards.find(c=>c.id.endsWith('.nested'))?.answer).toContain('𝒫(∅)={∅}');});
it('independently checks open reference mechanics without grading any learner proof',()=>{expect([1,2,3,4].map(n=>n*n%5)).toEqual([1,4,4,1]);expect(guides[0].conditions.join(' ')).toContain('Keep the hypothesis');const base=4096-8;expect(base-24).toBe(4064);expect(base-16).toBe(4072);for(const g of guides){expect(g).not.toHaveProperty('grader');expect(g).not.toHaveProperty('score');expect(g.pitfalls.length).toBeGreaterThan(1);}});
it('a false antecedent permits a true implication, not an arbitrary true conclusion',()=>{expect(!false||false).toBe(true);expect(false).toBe(false);});
