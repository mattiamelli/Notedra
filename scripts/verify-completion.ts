import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import definitions from '../src/expansion/completion.json';
import oracles from './completion-oracles.json';
import {getExercise} from '../src/practice/catalog';
import {gradeResponse} from '../src/practice/runtime';
const range=(n:number)=>Array.from({length:n},(_,i)=>i);
const set=(xs:number[])=>'{'+xs.join(',')+'}';
const bits=(n:number,k=3)=>range(k).map(i=>Boolean(n&(1<<(k-i-1))));
const implies=(a:boolean,b:boolean)=>!a||b;
const permutations=(xs:number[]):number[][]=>xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(p=>[x,...p])):[[]];
/** Independent bounded derivations, without consulting task references or grader implementation. */
export function derived(id:string):string {
 const slug=id.replace('ds.practice.p7-complete-','');
 switch(slug){
 case 'cmos-dual':return range(8).map(n=>{const [a,b,c]=bits(n);return Number(!(a&&(b||c)));}).join('');
 case 'latch-hold':{let q=0;return [[0,1],[1,1],[1,0],[0,1],[1,1]].map(([c,d])=>q=c?d:q).join('');}
 case 'shift-simultaneous':{let q=[0,1,0,1];for(const d of [1,0,1])q=[d,...q.slice(0,3)];return q.join('');}
 case 'loadstore-reuse':return ['load A','load B','add','subtract','store S','store D'].reduce((r,s)=>{if(s.startsWith('load'))r[0]++;if(s.startsWith('store'))r[1]++;return r;},[0,0]).join(',');
 case 'immediate-range':return [5,7].map(op=>2**(24-op-2*Math.log2(32)-1)-1).join(',');
 case 'bus-old-z':{const x=8;let r2=5,z=x+r2;r2=z;z=x-r2;return [r2,z].join(',');}
 case 'bus-fanout':{const initial=[1,2,3,4,5],goal=(s:number[])=>s[0]===1&&s[1]===1&&s[2]===1&&s[3]===2;let states=[initial];for(let depth=0;depth<3;depth++){if(states.some(goal))return String(depth);states=states.flatMap(s=>range(5).flatMap(src=>range(32).map(mask=>s.map((v,d)=>mask&(1<<d)?s[src]:v))));}throw Error('No bus sequence');}
 case 'encoded-idle':return String(Math.ceil(Math.log2(7+1))+Math.ceil(Math.log2(4+1))+3);
 case 'microbranch':{let pc=10,r=6,count=0;while(true){count++;if(pc===30)break;if(pc===10)pc=20;else if(pc===11){r=0;pc=30;}else {r++;pc=pc===20?21:30;}}return [r,count].join(',');}
 case 'poll-latency':{const t=range(10).map(i=>i*8).find(t=>t>=19)!;return [t,t-19].join(',');}
 case 'irq-order':return [1,2,3].filter(id=>new Set([2,3]).has(id)).join('');
 case 'bus-ready-edge':return String(range(10).map(i=>10*i).find(t=>t-23>=2));
 case 'word-boundary':{const lines=[...new Set(range(10).map(i=>Math.floor((14+i)/8)))];return [lines[0],lines.at(-1),lines.length].join(',');}
 case 'bank-stride':return [new Set([2,6,10,14].map(x=>x%4)).size,Math.floor(14/4)].join(',');
 case 'dma-overlap':return [12+9+1,Math.max(12,9)+1].join(',');
 case 'amdahl-inverse':return String(Math.round(100*(1/2.5-1/4)/(1-1/4)));
 case 'process-translation':return [9,4].map(frame=>frame*256+777%256).join(',');
 case 'necessary-chain':return set(range(8).filter(n=>{const [p,r,s]=bits(n);return !(implies(p,r)&&implies(r,s));}));
 case 'connective-completion':return String(range(16).filter(table=>{const out=(a:number,b:number)=>(table>>(2*a+b))&1;return out(0,0)===0&&out(1,1)===1&&out(0,1)===out(1,0);}).length);
 case 'equivalence-disagreement':return range(4).map(n=>{const [p,q]=bits(n,2);return Number(implies(p,q)!==implies(q,p));}).join('');
 case 'dnf-contradictory-term':return set(range(4).filter(n=>{const [p,q]=bits(n,2);return (p&&!p&&q)||(p&&!q)||(!p&&q);}));
 case 'cnf-unit-propagation':return String(range(8).filter(n=>{const [p,q,r]=bits(n);return (p||q)&&(!p||q)&&(!q||r);}).length);
 case 'argument-counterrows':return set(range(8).filter(n=>{const [p,q,r]=bits(n);return implies(p,q)&&(q||r)&&!(p||r);}));
 case 'quantifier-order':{const d=range(3),r=(x:number,y:number)=>y===(x+1)%3;return [d.every(x=>d.some(y=>r(x,y))),d.some(y=>d.every(x=>r(x,y)))].map(Number).join('');}
 case 'restricted-witness':return String([0,2].filter(x=>[1,2].some(y=>x!==y&&[[0,1],[0,2],[2,2],[2,3],[3,1]].some(([a,b])=>a===x&&b===y))).length);
 case 'difference-recurrence':{let a=2,old=0;for(let n=0;n<4;n++){old=a;a+=2*n+3;}return [a,a-old].join(',');}
 case 'traversal-position':{type T={v:number;l?:T;r?:T};const t:T={v:8,l:{v:3,r:{v:5}},r:{v:12,l:{v:10},r:{v:14}}};const pre=(t?:T):number[]=>t?[t.v,...pre(t.l),...pre(t.r)]:[];const post=(t?:T):number[]=>t?[...post(t.l),...post(t.r),t.v]:[];return [pre(t).indexOf(5)+1,post(t).indexOf(5)+1].join(',');}
 case 'tree-height-capacity':{let max=1;for(let level=0;level<3;level++)max=Math.max(1,2*max);return String(max);}
 case 'nested-set-membership':{type S=S[];const eq=(a:S,b:S):boolean=>a.length===b.length&&a.every(x=>b.some(y=>eq(x,y)));const member=(a:S,b:S)=>b.some(x=>eq(a,x));const a:S=[[],[[]]];return [member([],a),[[]].every(x=>member(x,a)),member([[[]]],a)].map(Number).join('');}
 case 'symmetric-membership':return set(range(5).filter(x=>[[0,1,2,3],[1,2,4],[2,3,4]].filter(s=>s.includes(x)).length===2));
 case 'product-diagonal':return String([0,1,2].flatMap(x=>[1,2,3,4].filter(y=>x!==y)).length);
 case 'product-intersection':return String([0,1,2].flatMap(x=>[1,2,3].filter(y=>[1,2,3].includes(x)&&[2,3,4].includes(y))).length);
 case 'directed-degrees':{const e=[[1,2],[1,3],[3,2],[2,4],[4,3]];return [e.filter(([,y])=>y===2).length,e.filter(([x])=>x===3).length,range(4).reduce((n,x)=>n+e.filter(([,y])=>y===x+1).length,0)].join(',');}
 case 'topological-freedom':return String(permutations([1,2,3,4,5]).filter(p=>[[1,3],[2,3],[3,4],[3,5]].every(([a,b])=>p.indexOf(a)<p.indexOf(b))).length);
 case 'relation-closure':{const r=new Set([0,4,8,1,5]),old=new Set(r);for(const k of range(3))for(const i of range(3))for(const j of range(3))if(r.has(3*i+k)&&r.has(3*k+j))r.add(3*i+j);return set([...r].filter(x=>!old.has(x)).sort());}
 case 'fiber-profile':{const outputs=range(6).map(x=>x%3);return [new Set(outputs).size,Math.max(...range(4).map(y=>outputs.filter(x=>x===y).length))].join(',');}
 case 'tree-leaf-weight':{type T={v:number;c:T[]};const f=(t:T):number=>t.c.length?t.v+t.c.reduce((s,t)=>s+f(t),0):t.v**2;return String(f({v:2,c:[{v:-3,c:[]},{v:4,c:[{v:1,c:[]},{v:-2,c:[]}]}]}));}
 case 'weight-not-degree':{const e=[['a','b',9],['a','c',2],['b','c',4],['c','d',7]] as const;const incident=e.filter(([a,b])=>a==='c'||b==='c');return [incident.length,incident.reduce((s,e)=>s+e[2],0)].join(',');}
 default:throw Error('Missing independent derivation '+id);
 }
}
export function verifyCompletion(){
 assert.deepEqual(definitions.map(e=>e.id).sort(),oracles.map(e=>e.exerciseId).sort());
 for(const o of oracles){const result=derived(o.exerciseId),e=getExercise(o.exerciseId)!;assert.equal(result,o.expected,o.exerciseId);assert.deepEqual(e.reference,{kind:'text',value:result});assert.deepEqual(gradeResponse(e,{kind:'text',value:result}).status,'GRADED');}
 return {exercises:definitions.length,independentDerivations:'PASS'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(verifyCompletion());
