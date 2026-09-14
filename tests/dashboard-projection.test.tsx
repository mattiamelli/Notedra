// @vitest-environment jsdom
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router';
import {beforeEach,expect,it,vi} from 'vitest';
import {deriveProgress} from '../src/progress/derive';
import {deriveEvidence} from '../src/adaptive/evidence';
import {recommend} from '../src/adaptive/engine';
import {emptyBackup,CLOCK,success,mock,banks} from './helpers/progress';
import {record} from './helpers/adaptive';
import {useEvidence} from '../src/adaptive/useEvidence';
import {useProgress} from '../src/progress/useProgress';
import DashboardInsights from '../src/pages/DashboardInsights';
import {presentAction} from '../src/adaptive/presentation';
import {translate} from '../src/i18n/i18n';
vi.mock('../src/adaptive/useEvidence');
vi.mock('../src/progress/useProgress');
let data=emptyBackup();
beforeEach(()=>{data=emptyBackup();});
function render(){
 const evidence=deriveEvidence(data.attempts,data.reviews,CLOCK);
 const result=deriveProgress(data,CLOCK,banks);
 // Only availability is used from the repository context; no storage method is mocked or invoked.
 vi.mocked(useEvidence).mockReturnValue({evidence,refresh:()=>{},learning:{snapshot:{data}} as ReturnType<typeof useEvidence>['learning']});
 vi.mocked(useProgress).mockReturnValue({result,message:''});
 const host=document.createElement('div');host.innerHTML=renderToStaticMarkup(<MemoryRouter><DashboardInsights/></MemoryRouter>);
 return {host,evidence,result};
}
it('keeps empty mastery/readiness unknown and supplies no invented plan or percentages',()=>{
 const {host}=render();expect(host.textContent).toContain('Complete a few exercises');
 expect(host.querySelectorAll('.ds-readiness-value')).toHaveLength(3);
 for(const value of host.querySelectorAll('.ds-readiness-value'))expect(value.textContent).toBe('Not enough evidence');
 expect(host.textContent).not.toMatch(/\d%|0 \/ 100|tasks done|day streak/);
});
it('projects actual per-course indices and coverage separately without changing the source records',()=>{
 data.attempts=[success('normal')];mock(data,0,0,'exam');const before=structuredClone(data);
 const {host,result}=render();
 for(const course of result.courses){const row=host.querySelector(`.ds-mastery-list [data-course="${course.id}"]`)!;expect(row.textContent).toContain(`${course.covered}/${course.total} skills with reliable practice`);expect(row.textContent).toContain(course.index===null?'Not enough practice yet':`${course.index} / 100`);}
 for(const value of result.readiness){const row=host.querySelector(`.ds-readiness-list [data-course="${value.courseId}"]`)!;expect(row.getAttribute('href')).toBe('/progress?course='+value.courseId);expect(row.textContent).toContain(`Objective coverage: ${value.objectiveTopics}/${value.totalTopics} topics`);}
 expect(data).toEqual(before);
});
it('shows the existing recommender order, reasons, durations and destinations without inventing completion',()=>{
 data.attempts=[record('wrong','ds.practice.co-binary-45',{kind:'text',value:'00000000'})];
 const {host,evidence}=render();const expected=recommend(evidence,{minutes:20,subjectId:'',topicId:''});expect(expected.length).toBeGreaterThan(0);
 const rows=[...host.querySelectorAll('.ds-dashboard-plan li')];expect(rows).toHaveLength(expected.length);
 rows.forEach((row,i)=>{const shown=presentAction(expected[i],(key,values)=>translate('en',key,values),text=>text);expect(row.textContent).toContain(shown.reason);expect(row.textContent).toContain(`${expected[i].minutes} min`);expect(row.querySelector('a')!.getAttribute('href')).toBe(expected[i].to);});
});
