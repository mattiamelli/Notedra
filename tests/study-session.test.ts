import {describe,expect,it} from 'vitest';
import {deriveEvidence} from '../src/adaptive/evidence';
import {buildStudySession,EXTENDED_SESSION_MINUTES,STUDY_TIME_PRESETS,studyTimeLabel} from '../src/adaptive/session';
import {CLOCK,record,text} from './helpers/adaptive';

const empty=()=>deriveEvidence([],[],CLOCK);
describe('Study Path session budgets',()=>{
 it('publishes exactly the six student-facing presets and a bounded extended budget',()=>{
  expect(STUDY_TIME_PRESETS).toEqual([15,30,45,60,90,120]);
  expect(EXTENDED_SESSION_MINUTES).toBe(120);
  expect(studyTimeLabel(120)).toBe('2h+');
 });
 it.each(STUDY_TIME_PRESETS)('builds a coherent authored session for %i minutes without learner evidence',minutes=>{
  const path=buildStudySession(empty(),{minutes,subjectId:'CSE1400_CO',topicId:'CO_T11_CACHE'});
  expect(path.length).toBeGreaterThan(0);
  expect(path.reduce((sum,item)=>sum+item.minutes,0)).toBe(minutes);
  expect(new Set(path.map(item=>item.to)).size).toBe(path.length);
  expect(path.every(item=>item.subjectId==='CSE1400_CO')).toBe(true);
  expect(path.every(item=>item.reason.length>30)).toBe(true);
  expect(path.every(item=>!item.to.includes('/mistakes'))).toBe(true);
 });
 it('changes structure across short, medium and extended sessions',()=>{
  const options={subjectId:'CSE1400_CO',topicId:'CO_T11_CACHE'};
  const short=buildStudySession(empty(),{...options,minutes:15});
  const medium=buildStudySession(empty(),{...options,minutes:60});
  const extended=buildStudySession(empty(),{...options,minutes:120});
  expect(short).toHaveLength(2);
  expect(medium.length).toBeGreaterThan(short.length);
  expect(extended.length).toBeGreaterThan(medium.length);
  expect(new Set(short.map(item=>item.kind))).not.toEqual(new Set(medium.map(item=>item.kind)));
 });
 it('makes 2h+ materially richer than 90 minutes without duplicated filler',()=>{
  const options={subjectId:'CSE1100_IP',topicId:'IP_T02_CONTROL_FLOW'};
  const ninety=buildStudySession(empty(),{...options,minutes:90});
  const extended=buildStudySession(empty(),{...options,minutes:120});
  expect(extended.length).toBeGreaterThan(ninety.length);
  expect(new Set(extended.map(item=>item.to)).size).toBe(extended.length);
  expect(extended.some(item=>!ninety.some(short=>short.to===item.to))).toBe(true);
 });
 it('uses saved mistakes only inside the chosen course and topic',()=>{
  const evidence=deriveEvidence([record('wrong','enrich-carry-overflow',text('1,1'),1)],[],CLOCK);
  const path=buildStudySession(evidence,{minutes:45,subjectId:'CSE1400_CO',topicId:'CO_T04_DATA_REP_RADIX_INTEGER'});
  expect(path.every(item=>item.subjectId==='CSE1400_CO')).toBe(true);
  expect(path.some(item=>item.reason.includes('incorrect submission'))).toBe(true);
 });
 it('uses only documented prerequisites and adds one in a deeper session',()=>{
  const path=buildStudySession(empty(),{minutes:90,subjectId:'CSE1400_CO',topicId:'CO_T11_CACHE'});
  expect(path.some(item=>item.topicId==='CO_T10_DMA_MEMORY'&&item.reason.includes('canonical prerequisite'))).toBe(true);
  expect(path.some(item=>item.to==='/exams/CSE1400_CO/setup')).toBe(true);
  expect(path.every(item=>!item.reason.includes('prerequisite')||item.topicId==='CO_T10_DMA_MEMORY'||item.topicId==='CO_T11_CACHE')).toBe(true);
 });
 it('produces course-specific real routes for CO, R&L and IP',()=>{
  const cases=[['CSE1400_CO','CO_T11_CACHE','/co/'],['CSE1300_RL','RL_T03_PROOF_METHODS','/rl/'],['CSE1100_IP','IP_T02_CONTROL_FLOW','/ip/']] as const;
  const paths=cases.map(([subjectId,topicId,prefix])=>{const path=buildStudySession(empty(),{minutes:45,subjectId,topicId});expect(path.every(item=>item.subjectId===subjectId)).toBe(true);expect(path.some(item=>item.to.startsWith(prefix))).toBe(true);return path.map(item=>item.to);});
  expect(paths[0]).not.toEqual(paths[1]);expect(paths[1]).not.toEqual(paths[2]);
 });
 it('rejects missing or mismatched required selections without changing evidence',()=>{
  const evidence=empty(),before=JSON.stringify(evidence);
  expect(()=>buildStudySession(evidence,{minutes:30,subjectId:''})).toThrow('Choose a course');
  expect(()=>buildStudySession(evidence,{minutes:30,subjectId:'CSE1400_CO',topicId:'IP_T02_CONTROL_FLOW'})).toThrow('does not belong');
  expect(JSON.stringify(evidence)).toBe(before);
 });
});
