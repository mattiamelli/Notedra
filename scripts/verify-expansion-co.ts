import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import exercises from '../src/expansion/co.json';
import oracles from './expansion-co-oracles.json';
import {createCPU} from '../src/engine/cpu';
import {parseProgram} from '../src/engine/parser';
import {executeStep} from '../src/engine/executor';
import type {RegisterName} from '../src/engine/types';
import {cacheFields,cacheTrace} from '../src/co/models';
export function verifyExpansionCO(){
 const checked=new Map<string,string>();
 for(const o of oracles){if(!('program' in o)||!o.program)continue;
  const program=parseProgram(o.program);let state=createCPU(program.entry),steps=0;
  while(!state.halted){if(o.id.endsWith('nested-restoration')&&state.rip===4)break;if(++steps>100)throw Error('Unbounded trusted fragment');state=executeStep(program,state).state;}
  const result=o.registers!.map(r=>String(state.registers[r as RegisterName])).join(',');assert.equal(result,o.answer,o.id);checked.set(o.id,result);
 }
 const record=(slug:string,result:string|number)=>checked.set('ds.practice.p7-co-'+slug,String(result));
 record('interpretation-triple',[-(29&15),-(29^31),29-32].join(','));
 record('decimal-carry-bcd',String(59+73).split('').map(d=>Number(d).toString(2).padStart(4,'0')).join(''));
 const x=(17-41+256)%256;record('inverse-wrap-add',[x,Math.floor((x+41)/256)].join(','));
 record('biased-range',Array.from({length:32},(_,u)=>u-20).filter(n=>n>=0).length);
 const signed=0b11101000-256;record('narrowing-boundary',[Array.from({length:8},(_,i)=>i+1).find(n=>signed>=-(2**(n-1))&&signed<2**(n-1)),signed].join(','));
 record('fixed-rescale',((0b11101100-256)/8*4+256).toString(2));
 record('normal-float-decode',-(1+3/8)*2**(5-3));record('precision-boundary',[2**4,2**3].join(','));
 record('format-footprint',[6+3*10,2*(6+2*10)].join(','));let A=3,B=7,C=B;C+=A;B+=C;record('destructive-destination',[B,C].join(','));record('stack-operand-order',(9-4)*3);record('instruction-boundaries',[200+3+5,200+3+5+2].join(','));
 const lru=cacheTrace({addressBits:8,blockBytes:1,sets:1,ways:2},[0,1,0,2,1]).filter(s=>s.hit).length;
 // FIFO arrival sequence: [A], [A,B], hit A leaves order unchanged, [B,C], hit B.
 record('policy-divergence',[lru,2].join(','));
 record('associativity-overhead',32*(cacheFields({addressBits:20,blockBytes:16,sets:8,ways:4},0).tagBits-cacheFields({addressBits:20,blockBytes:16,sets:32,ways:1},0).tagBits));
 record('stride-conflicts',[[0,1,4,5,0,1],[0,4,1,5,0,4]].map(trace=>cacheTrace({addressBits:8,blockBytes:2,sets:2,ways:1},trace).filter(s=>s.hit).length).join(','));record('miss-budget',Math.floor((500-100*2)/30));
 record('unbalanced-stages',[4*(2+5+3),(3+4-1)*(Math.max(2,5,3)+1)].join(','));record('ready-cycle',Math.max(3,4));record('branch-slot-state',2+3);record('clock-versus-cpi',[100*2,100+140].join(','));
 assert.equal(checked.size,exercises.length);for(const e of exercises)assert.equal(e.reference.value,checked.get(e.id),e.id);
 return {exercises:checked.size,assembly:4,engine:'accepted, unchanged',cache:'accepted model',reasoning:'Independent arithmetic, representation and explicitly stated toy-model rules'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('CO expansion references PASS',verifyExpansionCO());
