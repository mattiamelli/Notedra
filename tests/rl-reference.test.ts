import {describe, expect, it} from 'vitest';
import {readFileSync, readdirSync} from 'node:fs';
import type {Flashcard, Lesson, LessonBlock} from '../src/topic-study/types';

// Independent reference checks use native sets, direct logic and exhaustive small
// domains. They intentionally import no R&L calculator, evaluator or grader.
interface Guided {id:string; skillIds:string[]; prompt:string; rubric:string[]; reference:string[]; fields:{id:string;label:string}[]}
interface Topic {lesson:Lesson;cards:Flashcard[];guided:Guided[]}
const dir=new URL('../src/rl/topics/',import.meta.url);
const topics=readdirSync(dir).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync(new URL(n,dir),'utf8')) as Topic);
const blocks=topics.flatMap(t=>t.lesson.blocks);
const cards=topics.flatMap(t=>t.cards);
const intro=JSON.parse(readFileSync(new URL('../src/rl/intro-guided.json',import.meta.url),'utf8')) as Guided[];
const guided=[...intro,...topics.flatMap(t=>t.guided)];
const block=(slug:string):LessonBlock=>{const found=blocks.find(b=>b.id==='ds.block.rl.'+slug);expect(found,slug).toBeDefined();return found!;};
const prose=(slug:string)=>block(slug).paragraphs.join('\n');
const card=(slug:string)=>{const found=cards.find(c=>c.id==='ds.card.rl.'+slug);expect(found).toBeDefined();return found!.answer;};
function permutations<T>(xs:T[]):T[][] {return xs.length===0?[[]]:xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest]));}
const sorted=(xs:Iterable<number>)=>[...xs].sort((a,b)=>a-b);
const subsets=(xs:number[])=>Array.from({length:2**xs.length},(_,mask)=>xs.filter((_,i)=>(mask&(2**i))!==0));
const reviewedWorkedExamples=[
 't02.negation','t02.finite','t02.countermodel','t03.direct','t03.cases','t03.contradiction','t03.contrapositive','t03.debug',
 't04.recurrence','t04.induction','t04.language','t04.structural','t04.invariant','t05.tree','t05.traverse','t05.recursive-function','t05.topology',
 't06.membership','t06.operations','t06.powerset','t06.proof','t06.counterexample','t07.mapping','t07.relation-example','t08.listing','t08.cantor','t09.docks',
];

describe('independent R&L authored-content references',()=>{
 it('registers every new worked example for a mathematical or separate logical-obligation review',()=>{
  expect(blocks.filter(b=>b.kind==='worked_example').map(b=>b.id).sort()).toEqual(reviewedWorkedExamples.map(s=>'ds.block.rl.'+s).sort());
 });
 it('checks quantified negation exhaustively in every two-object unary/relation interpretation',()=>{
  const domain=[0,1];
  for(let pMask=0;pMask<4;pMask++)for(let rMask=0;rMask<16;rMask++){
   const P=(x:number)=>(pMask&(1<<x))!==0;
   const R=(x:number,y:number)=>(rMask&(1<<(2*x+y)))!==0;
   const original=domain.every(x=>!P(x)||domain.some(y=>R(x,y)));
   const negation=domain.some(x=>P(x)&&domain.every(y=>!R(x,y)));
   expect(negation).toBe(!original);
  }
  expect(prose('t02.negation')).toContain('∃x(P(x) ∧ ∀y¬R(x,y))');
  expect(card('t02.negate')).toContain('∃x(P(x) ∧ ∀y¬R(x,y))');
 });
 it('independently traces every object, witness and vacuous case in the authored finite world',()=>{
  const d=['u','v','w'];const p=new Set(['u','v']);const r=new Set(['u,v','v,w']);
  const successors=d.map(x=>d.filter(y=>r.has(x+','+y)));
  expect(successors).toEqual([['v'],['w'],[]]);
  expect(d.every((x,i)=>!p.has(x)||successors[i].length>0)).toBe(true);
  expect(d.some(y=>d.every(x=>r.has(x+','+y)))).toBe(false);
  expect(block('t02.finite').table?.rows).toEqual([['u','true','v','true'],['v','true','w','true'],['w','false','none','true']]);
  expect(prose('t02.finite')).toContain('∃y∀x R(x,y) is false');
  const emptyP=new Set<string>();const q=new Set(['v']);
  expect(d.every(x=>!emptyP.has(x)||q.has(x))).toBe(true);
  expect(d.some(x=>emptyP.has(x)&&q.has(x))).toBe(false);
  // Quantifier order is not interchangeable, even with every sender having a recipient.
  const swap=(x:number,y:number)=>x!==y;
  expect([0,1].every(x=>[0,1].some(y=>swap(x,y)))).toBe(true);
  expect([0,1].some(y=>[0,1].every(x=>swap(x,y)))).toBe(false);
 });
 it('checks all premises and the false conclusion in the SAME countermodel',()=>{
  const d=['u'];const p=new Set<string>();const q=new Set(['u']);
  expect(d.every(x=>!p.has(x)||q.has(x))).toBe(true);
  expect(d.some(x=>q.has(x))).toBe(true);
  expect(d.some(x=>p.has(x))).toBe(false);
  expect(prose('t02.countermodel')).toContain('domain {u}, P=∅ and Q={u}');
  const g=guided.find(g=>g.id==='ds.guided.rl.t02.countermodel')!;
  expect(g.reference.join(' ')).toContain('P=∅, Q={u}');
 });
 it('checks algebra in the proof examples and the separately reviewed proof obligations',()=>{
  // Finite arithmetic checks catch transcription mistakes; the universal proofs
  // rest on the displayed algebra and arbitrary-integer reasoning, reviewed separately.
  for(let a=-10;a<=10;a++)for(let b=-10;b<=10;b++) expect(2*a+2*b).toBe(2*(a+b));
  for(let k=-10;k<=10;k++){
   const odd=2*k+1;expect(odd*odd).toBe(2*(2*k*k+2*k)+1);
   expect(Math.abs((2*k)*(2*k+1)%2)).toBe(0);
   expect(Math.abs(((2*k+1)*(2*k+2))%2)).toBe(0);
   expect(k+1).toBeGreaterThan(k);
  }
  expect(prose('t03.direct')).toContain('arbitrary even integers');
  expect(prose('t03.direct')).toContain('m+n=2(a+b)');
  expect(prose('t03.cases')).toContain('these cases exhaust the integers');
  expect(prose('t03.contradiction')).toContain('g+1>g');
  expect(prose('t03.contrapositive')).toContain('2(2k²+2k)+1');
 });
 it('checks the invalid inference independently of the truth of its arithmetic conclusion',()=>{
  const P=false,Q=true;
  expect((!P||Q)&&Q).toBe(true);expect(P).toBe(false);
  expect(prose('t03.debug')).toContain('P=false and Q=true');
  expect(prose('t03.debug')).toContain('separate proof');
  expect(prose('t03.identify')).toContain('correct starting assumption is ¬Q');
  for(const p of [false,true])for(const q of [false,true]) expect(!p||q).toBe(q||!p); // ¬Q→¬P
 });
 it('checks recurrence values, closed-form substitutions and index bases without the model layer',()=>{
  const values=[2,5,11,23];
  expect(values.slice(1)).toEqual(values.slice(0,-1).map(n=>2*n+1));
  expect(values).toEqual([0,1,2,3].map(n=>3*2**n-1));
  expect(block('t04.recurrence').table?.rows).toEqual([['aₙ','2','5','11','23']]);
  expect(card('t04.evaluation')).toContain('a₂=2·5+1=11');
  expect(prose('t04.induction')).toContain('aₖ₊₁=2aₖ+1=2(3·2ᵏ−1)+1=3·2ᵏ⁺¹−1');
  expect(prose('t04.induction')).toContain('arbitrary k≥0');
  for(let k=0;k<12;k++) expect(2*(3*2**k-1)+1).toBe(3*2**(k+1)-1);
  expect(prose('t04.setup')).toContain('bases must cover each reachable parity class');
 });
 it('checks finite recursive-language examples and the limitation of the proved invariant',()=>{
  let word='';const words=[word];for(let i=0;i<3;i++){word='a'+word+'b';words.push(word);}
  expect(words).toEqual(['','ab','aabb','aaabbb']);
  for(const w of words)expect(w.split('a').length).toBe(w.split('b').length);
  expect(words).not.toContain('ba');expect('ba'.split('a').length).toBe('ba'.split('b').length);
  expect(prose('t04.language')).toContain('ε, ab, aabb and aaabbb');
  expect(prose('t04.structural')).toContain('ba has equal counts but is not generated');
 });
 it('checks invariant preservation and every state of several bounded process instances',()=>{
  for(let n=0;n<=12;n++){
   let r=n,q=0,steps=0;expect(3*r+q).toBe(3*n);
   while(r>0){r--;q+=3;steps++;expect(r).toBeGreaterThanOrEqual(0);expect(3*r+q).toBe(3*n);}
   expect(steps).toBe(n);expect(q).toBe(3*n);
  }
  expect(prose('t04.invariant')).toContain('3(r−1)+(q+3)=3r+q=3n');
  for(const obligation of ['Initialization:','Preservation:','Termination:','Conclusion:']) expect(prose('t04.invariant')).toContain(obligation);
  expect(prose('t04.invariant')).toContain('does not establish termination');
 });
 it('checks the authored tree against an independent edge list and hand-derived traversals',()=>{
  const edges=[['M','G'],['M','T'],['G','J'],['T','P'],['T','W']];
  const nodes=new Set(edges.flat());const parents=new Set(edges.map(e=>e[0]));
  expect(nodes.size).toBe(6);expect([...nodes].filter(n=>!parents.has(n)).sort()).toEqual(['J','P','W']);
  // Root-to-leaf paths explicitly establish edge height two.
  expect([['M','G','J'],['M','T','P'],['M','T','W']].map(p=>p.length-1)).toEqual([2,2,2]);
  expect(block('t05.traverse').table?.rows).toEqual([['Preorder','M,G,J,T,P,W'],['Inorder','G,J,M,P,T,W'],['Postorder','J,G,P,W,T,M']]);
  expect(prose('t05.tree')).toContain('six nodes, three leaves (J,P,W), and height two edges');
  expect(prose('t05.recursive-function')).toContain('N(M)=1+2+3=6');
  expect(1+(1+0+1)+(1+1+1)).toBe(6);
  expect(1+Math.max(1+Math.max(-1,0),1+Math.max(0,0))).toBe(2);
  expect(prose('t05.model')).toContain('empty tree height −1');
  expect(guided.find(g=>g.id==='ds.guided.rl.t05.function')!.reference.join(' ')).toContain('node(v,M(R),M(L))');
 });
 it('exhausts all topological candidates and verifies the introduced cycle',()=>{
  const edges=[['A','C'],['B','C'],['C','D']];
  const orders=permutations(['A','B','C','D']);
  const allowed=orders.filter(order=>edges.every(([a,b])=>order.indexOf(a)<order.indexOf(b)));
  expect(allowed).toEqual([['A','B','C','D'],['B','A','C','D']]);
  expect(orders.filter(order=>[...edges,['D','A']].every(([a,b])=>order.indexOf(a)<order.indexOf(b)))).toEqual([]);
  expect(prose('t05.topology')).toContain('exactly two: A,B,C,D and B,A,C,D');
  expect(prose('t05.topology')).toContain('A→C→D→A');
 });
 it('checks finite set calculations and every Venn truth region',()=>{
  const u=[1,2,3,4,5],a=new Set([1,3,5]),b=new Set([3,4]);
  expect(sorted(new Set([...a,...b]))).toEqual([1,3,4,5]);
  expect(sorted([...a].filter(x=>b.has(x)))).toEqual([3]);
  expect(sorted([...a].filter(x=>!b.has(x)))).toEqual([1,5]);
  expect(u.filter(x=>!b.has(x))).toEqual([1,2,5]);
  expect(u.filter(x=>a.has(x)!==b.has(x))).toEqual([1,4,5]);
  expect(block('t06.operations').table?.rows).toEqual([['A∪B','{1,3,4,5}'],['A∩B','{3}'],['A∖B','{1,5}'],['U∖B','{1,2,5}']]);
  for(const x of [false,true])for(const y of [false,true]) expect((x||y)&&!(x&&y)).toBe(x!==y);
  expect(prose('t06.venn')).toContain('{1,4,5}');
 });
 it('preserves the element/subset/tuple distinctions in all authored examples',()=>{
  // JSON tags are independent reference representations, unrelated to the runtime set model.
  const oneSet={set:[1]};const c:unknown[]=[oneSet,2];
  const has=(x:unknown)=>c.some(v=>JSON.stringify(v)===JSON.stringify(x));
  expect(has(oneSet)).toBe(true);expect(has(1)).toBe(false);expect(has(2)).toBe(true);
  expect([1].every(has)).toBe(false);expect([2].every(has)).toBe(true);expect([].every(has)).toBe(true);
  expect(JSON.stringify({tuple:['a','b']})).not.toBe(JSON.stringify({set:['a','b']}));
  expect(JSON.stringify({set:['a','b']})).not.toBe(JSON.stringify({set:[{set:['a','b']}]}));
  expect(prose('t06.membership')).toContain('{1}⊆C is false');
  expect(prose('t06.membership')).toContain('{2}⊆C is true');
 });
 it('enumerates every powerset and Cartesian-product element in the worked example',()=>{
  expect(subsets([0,1])).toEqual([[],[0],[1],[0,1]]);
  expect(['a','b'].flatMap(x=>[0,1].map(y=>[x,y]))).toEqual([['a',0],['a',1],['b',0],['b',1]]);
  expect(subsets([])).toEqual([[]]);
  expect(['a','b'].flatMap(x=>([] as number[]).map(y=>[x,y]))).toEqual([]);
  expect(prose('t06.powerset')).toContain('𝒫(S)={∅,{a},{b},{a,b}}');
  expect(prose('t06.powerset')).toContain('S×T={(a,0),(a,1),(b,0),(b,1)}');
  expect(card('t06.empty')).toContain('{∅}');
 });
 it('checks set-proof membership logic exhaustively and the premise-true counterexample',()=>{
  for(const a of [false,true])for(const b of [false,true])for(const c of [false,true]) expect(a&&(b||c)).toBe((a&&b)||(a&&c));
  expect(prose('t06.proof')).toContain('Every step is an equivalence for an arbitrary x');
  const a=[2],b=[2,7];expect(a.filter(x=>b.includes(x))).toEqual(a);expect(b.every(x=>a.includes(x))).toBe(false);
  expect(prose('t06.counterexample')).toContain('A={2} and B={2,7}');
  expect(prose('t06.counterexample')).toContain('7∈B and 7∉A');
 });
 it('checks every authored finite-function classification and both permitted constructions',()=>{
  const outputs=[2,1,3],codomain=[1,2,3,4];
  expect(outputs.every(v=>codomain.includes(v))).toBe(true);
  expect(new Set(outputs).size).toBe(3);expect(codomain.every(v=>outputs.includes(v))).toBe(false);
  expect([1,2,3].every(v=>outputs.includes(v))).toBe(true);
  for(const mapping of [[0,1,1],[1,0,0]]){
   expect(mapping.length).toBe(3);expect(mapping.every(v=>[0,1].includes(v))).toBe(true);
   expect([0,1].every(v=>mapping.includes(v))).toBe(true);expect(new Set(mapping).size).toBeLessThan(mapping.length);
  }
  expect(prose('t07.mapping')).toContain('f(a)=2, f(b)=1, f(c)=3');
  expect(prose('t07.mapping')).toContain('4 has no preimage');
  expect(prose('t07.construct')).toContain('a↦0, b↦1, c↦1');
  expect(prose('t07.construct')).toContain('a↦1, b↦0, c↦0');
 });
 it('exhaustively checks parity equivalence and each negative relation example',()=>{
  const d=[0,1,2];const pairs=d.flatMap(x=>d.filter(y=>x%2===y%2).map(y=>[x,y]));
  expect(pairs).toEqual([[0,0],[0,2],[1,1],[2,0],[2,2]]);
  const R=(x:number,y:number)=>x%2===y%2;
  expect(d.every(x=>R(x,x))).toBe(true);
  expect(d.every(x=>d.every(y=>!R(x,y)||R(y,x)))).toBe(true);
  expect(d.every(x=>d.every(y=>d.every(z=>!(R(x,y)&&R(y,z))||R(x,z))))).toBe(true);
  expect(d.filter(x=>R(0,x))).toEqual([0,2]);expect(d.filter(x=>R(1,x))).toEqual([1]);
  const bad=new Set(['0,1','1,2']);expect(bad.has('0,1')&&bad.has('1,2')&&!bad.has('0,2')).toBe(true);
  const empty=()=>false;
  expect(d.every(()=>empty())).toBe(false);
  expect(d.every(()=>d.every(()=>!empty()||empty()))).toBe(true);
  expect(d.every(()=>d.every(()=>d.every(()=>!(empty()&&empty())||empty())))).toBe(true);
  expect(prose('t07.relation-example')).toContain('{(0,0),(0,2),(1,1),(2,0),(2,2)}');
  expect(prose('t07.relation-example')).toContain('not reflexive');
 });
 it('checks finite number-membership examples without pretending to certify infinite cardinality',()=>{
  expect(Number.isInteger(-3)).toBe(true);expect(-3>=0).toBe(false);
  expect(Number.isInteger(3/2)).toBe(false);expect(3/2).toBe(1.5);
  expect(prose('t08.numbers')).toContain('−3 belongs to ℤ,ℚ,ℝ,ℂ but not ℕ₀');
  expect(prose('t08.numbers')).toContain('i belongs to ℂ but not ℝ');
  expect(prose('t08.numbers')).toContain('ℕ₀={0,1,2,…}');
  expect(prose('t08.pitfalls')).toContain('Printing many elements cannot verify an infinite bijection');
 });
 it('checks the listing formulas and separately asserts the infinite-proof obligations',()=>{
  const f=(n:number)=>n===0?0:n%2===1?(n+1)/2:-(n/2);
  const inverse=(z:number)=>z===0?0:z>0?2*z-1:-2*z;
  expect([0,1,2,3,4,5,6].map(f)).toEqual([0,1,-1,2,-2,3,-3]);
  for(let z=-25;z<=25;z++)expect(f(inverse(z))).toBe(z);
  for(let n=0;n<=50;n++)expect(inverse(f(n))).toBe(n);
  expect(prose('t08.listing')).toContain('f(2k−1)=k, and f(2k)=−k');
  expect(prose('t08.listing')).toContain('Every integer has exactly one described index');
  expect(prose('t08.listing')).toContain('only an illustration');
  expect(prose('t08.rational')).toContain('at a finite diagonal');
  expect(prose('t08.rational')).toContain('1/2 and 2/4');expect(1/2).toBe(2/4);
 });
 it('checks the diagonal contradiction on every Boolean membership case and all tiny maps',()=>{
  for(const member of [false,true])expect(member===!member).toBe(false);
  // Exhaust all 4^2 candidate functions from a two-element set to its powerset.
  const power=subsets([0,1]);
  for(const image0 of power)for(const image1 of power){
   const images=[image0,image1];const diagonal=[0,1].filter(a=>!images[a].includes(a));
   expect(images.some(image=>JSON.stringify(image)===JSON.stringify(diagonal))).toBe(false);
  }
  expect(prose('t08.cantor')).toContain('d∈D exactly when d∉D');
  expect(prose('t08.cantor')).toContain('any proposed surjection');
  expect(prose('t08.limits')).toContain('R∈R exactly when R∉R');
  expect(prose('t08.limits')).toContain('unrestricted set formation');
 });
 it('independently exhausts all 24 puzzle candidates and checks each stated elimination',()=>{
  const all=permutations([1,2,3,4]);expect(all).toHaveLength(24);
  const matches=all.filter(([a,b,c,d])=>a+b===5&&b+c===6&&c>d);
  expect(matches).toEqual([[3,2,4,1]]);
  expect(all.filter(([a,b,c])=>a+b===5&&b+c===6)).toEqual([[1,4,2,3],[3,2,4,1]]); // dropped inequality is nonunique
  expect([1+4,4+2,2>3]).toEqual([5,6,false]);
  expect(5-2).toBe(3);expect(6-(5-2)).toBe(3);expect(4+1).toBe(5);
  expect(prose('t09.docks')).toContain('A=3, B=2, C=4, D=1');
  expect(block('t09.docks').table?.rows).toEqual([['1','B=4, C=2, D=3','Reject: C>D fails'],['2','B=3, C=3','Reject: duplicate setting'],['3','B=2, C=4, D=1','All constraints hold'],['4','C=5','Reject: outside domain']]);
  expect(guided.find(g=>g.id==='ds.guided.rl.constraint-docks')!.reference.join(' ')).toContain('(3,2,4,1)');
 });
 it('checks T01 adjunct normal forms and validity without changing the published pilot',()=>{
  const rows=[[false,false],[false,true],[true,false],[true,true]];
  const dnf=rows.map(([p,q])=>(!p&&q)||(p&&!q));
  const cnf=rows.map(([p,q])=>(p||q)&&(!p||!q));
  expect(dnf).toEqual([false,true,true,false]);expect(cnf).toEqual(dnf);
  expect(rows.some(([p,q])=>(!p||q)&&p&&!q)).toBe(false);
  expect(rows.some(([p])=>p&&!p)).toBe(false);
  const normal=intro.find(g=>g.id==='ds.guided.rl.t01.normal-form')!;
  expect(normal.reference.join(' ')).toContain('(¬p∧q)∨(p∧¬q)');
  expect(normal.reference.join(' ')).toContain('(p∨q)∧(¬p∨¬q)');
  expect(intro.find(g=>g.id==='ds.guided.rl.t01.argument')!.reference.join(' ')).toContain('does not make q a tautology');
 });
 it('all guided activities have explicit requirements and reference reasoning without a score field',()=>{
  expect(guided).toHaveLength(23);
  for(const activity of guided){
   expect(activity.fields.length).toBeGreaterThanOrEqual(1);expect(activity.fields.length).toBeLessThanOrEqual(6);
   expect(new Set(activity.fields.map(f=>f.id)).size).toBe(activity.fields.length);
   expect(activity.rubric.length).toBeGreaterThanOrEqual(3);expect(activity.reference.length).toBeGreaterThanOrEqual(2);
   expect(activity).not.toHaveProperty('score');expect(activity).not.toHaveProperty('grader');expect(activity).not.toHaveProperty('correct');
  }
 });
 it('keeps the relation argument order when explaining a shared FOL witness',()=>{
  expect(card('t02.dependency')).toContain('one fixed y makes R(x,y) true for every x');
 });
 it('does not attribute induction setup to the recurrence-only guided task',()=>{
  const recursion=guided.find(g=>g.id==='ds.guided.rl.t04.recursion')!;
  expect(recursion.skillIds).not.toContain('RL_SK04_04_INDUCTION_SETUP');
  const induction=guided.find(g=>g.id==='ds.guided.rl.t04.induction')!;
  expect(induction.skillIds).toContain('RL_SK04_04_INDUCTION_SETUP');
  const coverage=JSON.parse(readFileSync(new URL('../src/rl/coverage.json',import.meta.url),'utf8')) as {skillId:string;guidedIds:string[]}[];
  expect(coverage.find(c=>c.skillId==='RL_SK04_04_INDUCTION_SETUP')!.guidedIds).not.toContain(recursion.id);
 });
 it('asks and explains necessary/sufficient direction for the linked T01 skill',()=>{
  const argument=intro.find(g=>g.id==='ds.guided.rl.t01.argument')!;
  expect(argument.prompt).toContain('identify which condition is sufficient and which is necessary');
  expect(argument.rubric.join(' ')).toContain('p is sufficient for q and q is necessary for p');
  expect(argument.reference.join(' ')).toContain('p is sufficient for q and q is necessary for p');
 });

 it('distinguishes symbol interpretations from assignments to free variables',()=>{
  expect(card('t02.structure')).toContain('The structure supplies the domain and symbol interpretations.');
  expect(card('t02.structure')).toContain('A variable assignment supplies domain objects to free variables');
 });
 it('allows equivalent quantified formulations with the same witness dependency',()=>{
  const translation=guided.find(g=>g.id==='ds.guided.rl.t02.translation')!;
  expect(translation.rubric.join(' ')).toContain('Any logically equivalent formulation is allowed');
  expect(translation.reference.join(' ')).toContain('An equivalent form is ¬∃x(P(x) ∧ ∀y¬R(x,y))');
  for(let pMask=0;pMask<4;pMask++)for(let rMask=0;rMask<16;rMask++){
   const d=[0,1],p=(x:number)=>(pMask&(1<<x))!==0,r=(x:number,y:number)=>(rMask&(1<<(2*x+y)))!==0;
   expect(d.every(x=>!p(x)||d.some(y=>r(x,y)))).toBe(!d.some(x=>p(x)&&d.every(y=>!r(x,y))));
  }
 });
 it('allows any exhaustive puzzle justification rather than one reference case split',()=>{
  const puzzle=guided.find(g=>g.id==='ds.guided.rl.constraint-docks')!;
  expect(puzzle.rubric.join(' ')).toContain('Any exhaustive method is allowed');
  expect(puzzle.rubric.join(' ')).toContain('not a required form');
  const byB=[1,2,3,4].map(b=>[5-b,b,6-b,b-1]);
  expect(byB.filter(values=>values.every(n=>[1,2,3,4].includes(n))&&new Set(values).size===4&&values[2]>values[3])).toEqual([[3,2,4,1]]);
 });
 it('allows sufficient alternate invariants while preserving all four proof obligations',()=>{
  const invariant=guided.find(g=>g.id==='ds.guided.rl.t04.invariant')!;
  expect(invariant.rubric.join(' ')).toContain('Equivalent or alternative sufficient invariants are allowed');
  expect(invariant.reference.join(' ')).toContain('r=n−k and q=3k');
  for(let n=0;n<=10;n++)for(let k=0;k<=n;k++){
   const r=n-k,q=3*k;expect(3*r+q).toBe(3*n);
   if(r>0){expect(r-1).toBe(n-(k+1));expect(q+3).toBe(3*(k+1));}
   else expect(q).toBe(3*n);
  }
  expect(invariant.rubric.join(' ')).toContain('preserves the chosen invariant');
  expect(invariant.rubric.join(' ')).toContain('termination argument');
 });

});
