import {describe,it,expect} from 'vitest';
import co from '../src/exams/banks/co.json';
import rl from '../src/exams/banks/rl.json';
import ip from '../src/exams/banks/ip.json';
import {startSession,resolveSession} from '../src/exams/engine';
import type {ExamBank} from '../src/exams/types';
const banks=[co,rl,ip] as ExamBank[],now=Date.parse('2026-09-10T10:00:00.000Z');
describe('cloud exam binding preservation',()=>{
 for(const bank of banks)for(const blueprint of bank.blueprints){
  const label=bank.course+'/'+blueprint.mode;
  it(label+' resolves unchanged bindings after JSONB property reordering',()=>{
   const session=startSession(blueprint,bank,'step15-public-smoke','cloud-roundtrip',now);
   session.items=session.items.map(item=>({weight:item.weight,responseType:item.responseType,evaluation:item.evaluation,evaluator:{version:item.evaluator.version,id:item.evaluator.id},version:item.version,id:item.id}));
   const before=structuredClone(session);
   expect(resolveSession(session,bank).status).toBe('AVAILABLE');
   expect(session).toEqual(before);
  });
  it(label+' still rejects changed binding values and component order',()=>{
   const original=startSession(blueprint,bank,'step15-public-smoke','cloud-roundtrip',now);
   for(const mutate of [
    (s:typeof original)=>{s.items[0].id+='-different';},
    (s:typeof original)=>{s.items[0].version='future';},
    (s:typeof original)=>{s.items[0].evaluator.id+='-different';},
    (s:typeof original)=>{s.items[0].evaluator.version='future';},
    (s:typeof original)=>{s.items[0].weight+=1;},
    (s:typeof original)=>{s.items[0].evaluation=s.items[0].evaluation==='RUBRIC'?'DETERMINISTIC':'RUBRIC';},
    (s:typeof original)=>{s.items[0].responseType=s.items[0].responseType==='text'?'code':'text';},
    (s:typeof original)=>{s.items.reverse();},
    (s:typeof original)=>{s.items.pop();},
   ]){const changed=structuredClone(original);mutate(changed);expect(resolveSession(changed,bank).status).toBe('UNAVAILABLE');}
  });
 }
});
