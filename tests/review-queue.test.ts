import {describe,expect,it} from 'vitest';
import {deriveEvidence} from '../src/adaptive/evidence';
import {selectReviewNow} from '../src/adaptive/review-queue';
import {CLOCK,record,text} from './helpers/adaptive';

const co=(id:string,days:number)=>record(id,'enrich-carry-overflow',text('1,1'),days);
const rl=(id:string,days:number)=>record(id,'enrich-implication-directions',text('1,1,1'),days);

describe('Review now selector',()=>{
 it('limits actionable skills and deterministically prioritizes repeated recent evidence',()=>{const evidence=deriveEvidence([co('co-old',3),co('co-new',1),rl('rl',0)],[],CLOCK);const first=selectReviewNow(evidence,{limit:1}),second=selectReviewNow(evidence,{limit:1});expect(first).toEqual(second);expect(first).toHaveLength(1);expect(first[0]).toMatchObject({reason:'repeated-pattern',mistake:{attempt:{attemptId:'co-new'}}});});
 it('excludes reviewed mistakes without treating review as correctness',()=>{const evidence=deriveEvidence([co('reviewed',1)],[{attemptId:'reviewed',reviewedAt:new Date(CLOCK).toISOString(),revision:1}],CLOCK);expect(selectReviewNow(evidence)).toEqual([]);expect(evidence.mistakes).toHaveLength(1);expect(evidence.groups[0].laterSuccesses).toBe(0);});
 it('removes a skill after later success while preserving its historical mistake',()=>{const evidence=deriveEvidence([co('wrong',2),record('correct','enrich-carry-overflow',text('1,0'),1)],[],CLOCK);expect(selectReviewNow(evidence)).toEqual([]);expect(evidence.mistakes.map(item=>item.attempt.attemptId)).toEqual(['wrong']);expect(evidence.groups[0].laterSuccesses).toBe(1);});
 it('returns a truthful empty queue when no mistakes exist',()=>{expect(selectReviewNow(deriveEvidence([],[],CLOCK))).toEqual([]);});
});
