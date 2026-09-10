import {it,expect} from 'vitest';
import {validateMastery,validateReadiness} from '../scripts/progress-validation';
import {validateProgressBundle} from '../scripts/progress-bundle';
const exam=['ExamsPage.tsx','ExamSessionPage.tsx','ExamReviewPage.tsx','ExamOpenAnswer.tsx','banks/co.json','banks/rl.json','banks/ip.json','references/co.json','references/rl.json','references/ip.json'];
const progress=['ProgressPage.tsx','ProgressSummary.tsx','mastery.ts','readiness.ts','evidence.ts','derive.ts'];
function bundle(){const names=[...exam.map(n=>'exams/'+n),...progress.map(n=>'progress/'+n)];return [{file:'entry',entry:true,modules:['/src/App.tsx'],imports:[] as string[],dynamicImports:names},...names.map(file=>({file,entry:false,modules:['/src/'+file],imports:[] as string[],dynamicImports:[] as string[]}))];}
it('progress gates preserve 229 protected files, schemas, canonical counts and open policies',()=>{expect(validateMastery().protectedFiles).toBe(229);expect(validateReadiness().unknown).toBe(true);});
it('progress graph accepts reachable lazy derivation without charts or raw sources',()=>expect(Object.keys(validateProgressBundle(bundle(),[]).owners)).toHaveLength(6));
it.each(['eager','missing','unreachable','duplicate','development','raw'])('progress bundle rejects %s',kind=>{const b=bundle();if(kind==='eager')b[0].imports=['progress/mastery.ts'];if(kind==='missing')b.pop();if(kind==='unreachable')b[0].dynamicImports.pop();if(kind==='duplicate')b[1].modules.push('/src/progress/mastery.ts');if(kind==='development')b[1].modules.push('/tests/helpers/progress.ts');expect(()=>validateProgressBundle(b,kind==='raw'?[{file:'source.zip',prefix:'PK\x03\x04'}]:[])).toThrow();});
