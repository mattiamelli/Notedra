import {it,expect} from 'vitest';
import {performance} from 'node:perf_hooks';
import {deriveEvidence} from '../src/adaptive/evidence';
import {recommend} from '../src/adaptive/engine';
import {CLOCK,record,text} from './helpers/adaptive';
it.each([100,1000,5000])('derives and ranks %i immutable submissions deterministically within a 5-second safety ceiling',size=>{
 const records=Array.from({length:size},(_,i)=>record('performance-'+i,i%2?'enrich-carry-overflow':'enrich-implication-directions',text(i%2?'1,1':'1,1,1'),i%100));
 const before=JSON.stringify(records),start=performance.now();const e=deriveEvidence(records,[],CLOCK),path=recommend(e,{minutes:45});const elapsed=performance.now()-start;
 expect(e.mistakes).toHaveLength(size);expect(recommend(deriveEvidence([...records].reverse(),[],CLOCK),{minutes:45})).toEqual(path);expect(JSON.stringify(records)).toBe(before);expect(elapsed).toBeLessThan(5000);console.info(`Adaptive ${size}: ${elapsed.toFixed(2)} ms (derive + rank)`);
},15_000);
