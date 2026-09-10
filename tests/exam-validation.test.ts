import {it,expect} from 'vitest';
import {examBanks,validateExamContent,validateExam} from '../scripts/exam-validation';
import {validateExamBundle} from '../scripts/exam-bundle';
import type {ExamBank} from '../src/exams/types';
it('exam gates enforce six blueprints, 46 fixed authored components and 34 open references',()=>{expect(validateExamContent()).toEqual({courses:3,blueprints:6,items:46,openReferences:34});expect(validateExam()).toEqual({schema:3,db:3,blueprints:6});});
it.each<[string,(b:ExamBank[])=>void]>([
 ['duplicate course',b=>{b[1]=structuredClone(b[0]);}],['missing blueprint',b=>{b[0].blueprints.pop();}],['missing item',b=>{b[0].items.pop();}],
 ['foreign course',b=>{b[0].items[0].course='CSE1300_RL';}],['foreign topic',b=>{b[0].items[0].topicId='RL_T01_PROP_LOGIC';}],['foreign skill',b=>{b[0].items[0].skillIds=['RL_SK01_01_CONNECTIVE'];}],
 ['invented question type',b=>{b[0].items[0].questionType='made-up';}],['invented pattern',b=>{b[0].items[0].patternId='made-up';}],['wrong source',b=>{b[0].items[0].provenance[0].filename='wrong.pdf';}],
 ['promoted source era',b=>{b[0].items[0].provenance[0].era='RECENT';}],['invalid physical page',b=>{b[0].items[0].provenance[0].pages=[0];}],['missing provenance',b=>{b[0].items[0].provenance=[];}],
 ['new fixed grader',b=>{b[0].items[0].evaluator.version='new';}],['new fixed definition',b=>{b[0].items[0].practiceRef!.version='new';}],['wrong response type',b=>{b[0].items[0].responseType='code';}],
 ['fake proof grading',b=>{b[1].items[2].evaluation='DETERMINISTIC';}],['empty rubric',b=>{b[1].items[2].rubric=[];}],['false rubric skill',b=>{b[2].items[2].rubric![0].skillIds=['wrong'];}],
 ['wrong count',b=>{b[0].blueprints[0].difficultyMix.Hard++;}],['duplicate slot',b=>{b[0].blueprints[0].slots[1]=b[0].blueprints[0].slots[0];}],['unknown candidate version',b=>{b[0].blueprints[0].slots[0].candidates[0].version='2';}],
 ['missing coverage',b=>{b[0].blueprints[0].constraints.topics.push('CO_T01_HISTORY');}],['invalid weight',b=>{b[0].items[0].weight=-1;}],
])('content gate rejects %s',(_name,change)=>{const b=structuredClone(examBanks);change(b);expect(()=>validateExamContent(b)).toThrow();});
function bundle(){const modules=['ExamsPage.tsx','ExamSessionPage.tsx','ExamReviewPage.tsx','ExamOpenAnswer.tsx','banks/co.json','banks/rl.json','banks/ip.json','references/co.json','references/rl.json','references/ip.json'];return [{file:'entry',entry:true,modules:['/src/App.tsx'],imports:[] as string[],dynamicImports:modules},...modules.map(file=>({file,entry:false,modules:['/src/exams/'+file],imports:[] as string[],dynamicImports:[] as string[]}))];}
it('exam bundle gate accepts separately reachable lazy banks and review references',()=>expect(Object.keys(validateExamBundle(bundle(),[]).owners)).toHaveLength(10));
it.each(['eager','unreachable','merged reference','development','raw'])('exam bundle rejects %s',kind=>{const c=bundle();if(kind==='eager')c[0].imports=['banks/co.json'];if(kind==='unreachable')c[0].dynamicImports.pop();if(kind==='merged reference'){c[5].modules.push('/src/exams/references/co.json');c[8].modules=[];}if(kind==='development')c[1].modules.push('/scripts/exam-validation.ts');expect(()=>validateExamBundle(c,kind==='raw'?[{file:'pack.pdf',prefix:'%PDF-'}]:[])).toThrow();});
