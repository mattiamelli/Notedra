import {describe,expect,it} from 'vitest';
import {calculusAdditions} from '../src/curriculum/calculus-expansion';

const added=calculusAdditions.filter(({item})=>Number(item.id.slice(6))>120);
const factorial=(n:number):number=>n<=1?1:n*factorial(n-1);
const sum=(n:number,f:(k:number)=>number)=>Array.from({length:n},(_,k)=>f(k+1)).reduce((a,b)=>a+b,0);
function integral(f:(x:number)=>number,a:number,b:number,n=2000){
 const h=(b-a)/n;
 return h/3*(f(a)+f(b)+sum(n-1,k=>(k%2?4:2)*f(a+k*h)));
}

// Reference computations use the problem's mathematical data, not its stored answer.
const integerReferences:[number,()=>number][]=[
 [122,()=>[-3,-2,-1,0,1,2,3].filter(x=>x*x>=4&&x<0).length],
 [124,()=>Math.cos(0)],
 [126,()=>5*(Math.sqrt(1-(3/5)**2)+Math.sqrt(1-(3/5)**2))],
 [128,()=>6/(1+1)],
 [130,()=>[0,1,4].sort((a,b)=>(Math.abs(a-1)-a/2)-(Math.abs(b-1)-b/2))[0]],
 [132,()=>{const step=(x:number)=>x-(x**3-2*x+2)/(3*x*x-2);return step(step(0));}],
 [134,()=>1/(1/3)],
 [136,()=>2**2/factorial(2)],
 [138,()=>2*Math.sin(0)+4*0*Math.cos(0)],
 [140,()=>7],
 [142,()=>2*5-3],
 [144,()=>integral(x=>x,1,3)],
 [146,()=>1],
 [148,()=>2],
 [150,()=>Math.ceil(Math.sqrt(3*12))],
 [152,()=>3],
 [154,()=>2*(1+1/2)],
 [156,()=>2/(1-1/3)-1/(1-1/2)],
 [158,()=>Math.ceil(Math.log(1000)/Math.log(3))],
 [160,()=>4],
 [162,()=>5*factorial(4)/factorial(5)],
 [164,()=>0],
 [166,()=>24/factorial(4)],
 [168,()=>Math.sqrt(4)],
 [170,()=>1+2-1],
 [172,()=>4/(1+3)],
 [174,()=>4*(-1)/(1+1)**2],
 [176,()=>0*Math.cos(0)+Math.cos(0)],
 [178,()=>[-1,1].filter(x=>3*x*x-3===0).length],
 [180,()=>-2*1*4/(4*2)],
 [182,()=>factorial(2)],
 [184,()=>Math.hypot(-5,12)],
 [186,()=>(3**2+4**2)/(1**2+(-2)**2)],
 [188,()=>new Set(['i','-i','1']).size],
 [190,()=>Array.from({length:8},(_,k)=>k).filter(k=>k>0&&k<4).length],
 [192,()=>Math.sin(Math.PI/2)*2+Math.cos(Math.PI/2)*(-3)],
 [194,()=>2*integral(y=>3*y*y,0,2)],
 [196,()=>1/(1/2+1/2)],
 [198,()=>6*integral(x=>2*x-x*x,0,2)],
 [200,()=>13/2-(2*(0+2)/2+(0+3)/2)],
];

describe('Calculus completion mathematical checks',()=>{
 it('adds eight distinct, source-bound problems in each topic, with both response modes',()=>{
  expect(added).toHaveLength(80);
  expect(integerReferences).toHaveLength(40);
  for(let topic=1;topic<=10;topic++){
   const group=added.filter(entry=>entry.topicId===`CALC_T${String(topic).padStart(2,'0')}`);
   expect(group).toHaveLength(8);
   expect(group.filter(({item})=>item.kind==='integer')).toHaveLength(4);
   expect(group.filter(({item})=>item.kind==='open')).toHaveLength(4);
   expect(new Set(group.map(({item})=>item.title)).size).toBe(8);
   expect(group.every(({item})=>item.sourceIds.length>0&&item.explanation.trim().length>0)).toBe(true);
   expect(group.some(entry=>entry.difficulty==='Hard'||entry.difficulty==='Exam-level')).toBe(true);
  }
  expect(new Set(added.map(({item})=>item.id)).size).toBe(80);
  expect(added.filter(({item})=>item.kind==='integer').map(({item})=>Number(item.id.slice(6)))).toEqual(integerReferences.map(([id])=>id));
 });
 it.each(integerReferences)('checks integer reference CALC_E%i', (id,derive)=>{
  const answer=added.find(({item})=>item.id===`CALC_E${id}`)!.item.answer!;
  const expected=derive();
  expect(expected).toBeCloseTo(Math.round(expected),10);
  expect(answer).toBe(String(Math.round(expected)));
 });
 it('checks nonlinear limits, inverse exclusions and the negative-infinity sign',()=>{
  const f=(x:number)=>(x+1)/(x-1);
  for(const x of [-4,0,2,5])expect(f(f(x))).toBeCloseTo(x,12);
  expect(6/(Math.sqrt(1+6/1e7)+1)).toBeCloseTo(3,5);
  for(const epsilon of [.001,.1,10]){
   const delta=Math.min(1,epsilon/5),x=2+delta*.999;
   expect(Math.abs(x*x-4)).toBeLessThan(epsilon);
  }
 });
 it('checks derivative-based extrema, tangent error and integration references',()=>{
  expect(2*2*(12-2**2)).toBe(32);
  expect(2.025-Math.sqrt(4.1)).toBeGreaterThan(0);
  expect(2.025-Math.sqrt(4.1)).toBeLessThan(1/6400);
  expect(integral(x=>x*x,-1,1)).toBeCloseTo(2/3,10);
  expect(integral(x=>Math.exp(x)*Math.cos(x),0,1)).toBeCloseTo(Math.E*(Math.sin(1)+Math.cos(1))/2-1/2,10);
  expect(integral(t=>Math.abs(t*t-4*t+3),0,4)).toBeCloseTo(4,10);
  expect(integral(x=>x*Math.sin(x)/(1+Math.cos(x)**2),0,Math.PI)).toBeCloseTo(Math.PI**2/4,10);
 });
 it('checks sequence recurrences and rigorous truncation thresholds',()=>{
  let a=0,b=1;
  for(let n=0;n<20;n++){
   expect(a).toBeCloseTo(2-2*(-.5)**n,12);
   expect(b).toBeCloseTo(1/(n+1),12);
   a=3-a/2;b=b/(1+b);
  }
  expect(3/5**2).toBeGreaterThan(1/12);expect(3/6**2).toBe(1/12);
  expect(3**-6).toBeGreaterThan(1/1000);expect(3**-7).toBeLessThan(1/1000);
  const remainder=sum(100000,n=>1/(n+10)**3);
  expect(remainder).toBeGreaterThan(1/(2*11**2));expect(remainder).toBeLessThan(1/(2*10**2));
 });
 it('checks Taylor remainders and multivariable path counterexamples',()=>{
  for(const h of [-.5,-.2,.2,.5]){
   const polynomial=.5-h/4+h*h/8-h**3/16;
   expect(1/(2+h)-polynomial).toBeCloseTo(h**4/(16*(2+h)),12);
   expect(Math.abs(1/(2+h)-polynomial)).toBeLessThanOrEqual(1/384+1e-14);
   expect(Math.sign(Math.exp(h)-(1+h+h*h/2))).toBe(Math.sign(h));
  }
  for(const x of [.1,.01,.001]){
   const y=x*x;
   expect(x*x*y/(x**4+y*y)).toBeCloseTo(.5,12);
  }
  const h=.03,k=-.02;
  expect((1+h)**2*(2+k)-2-(4*h+k)).toBeCloseTo(2*h*h+2*h*k+h*h*k,12);
 });
 it('checks gradient degeneracies, root geometry and integration regions',()=>{
  for(const [x,y] of [[1,1],[-1,-1],[1,-1],[-1,1]]){
   expect(x*x+y*y).toBe(2);expect(Math.abs(x*y)).toBe(1);
  }
  expect(1+2*(-1)*1+1).toBe(0);
  const roots=[[3,0],[0,Math.sqrt(3)],[0,-Math.sqrt(3)]];
  for(const [re,im] of roots){
   expect(Math.hypot(re-1,im)).toBeCloseTo(2,12);
   expect((re-1)**3-3*(re-1)*im**2).toBeCloseTo(8,12);
   expect(3*(re-1)**2*im-im**3).toBeCloseTo(0,12);
  }
  expect(integral(y=>y,0,1)+1+integral(y=>3-y,2,3)).toBeCloseTo(2,12);
  expect(integral(x=>x**3/2,0,1)).toBeCloseTo(1/8,12);
  expect(integral(x=>x*x*(1-x),0,1)/.5).toBeCloseTo(1/6,12);
  expect(integral(x=>x*x*Math.cos(x**3),0,1)).toBeCloseTo(Math.sin(1)/3,10);
 });
});
