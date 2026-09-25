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
import {courses} from '../src/academic/navigation';
vi.mock('../src/adaptive/useEvidence');
vi.mock('../src/progress/useProgress');
let data=emptyBackup();
beforeEach(()=>{data=emptyBackup();});
function render(trimester=1){
 const evidence=deriveEvidence(data.attempts,data.reviews,CLOCK);
 const result=deriveProgress(data,CLOCK,banks);
 // Only availability is used from the repository context; no storage method is mocked or invoked.
 vi.mocked(useEvidence).mockReturnValue({evidence,refresh:()=>{},learning:{snapshot:{data}} as ReturnType<typeof useEvidence>['learning']});
 vi.mocked(useProgress).mockReturnValue({result,message:''});
 const host=document.createElement('div');host.innerHTML=renderToStaticMarkup(<MemoryRouter initialEntries={['/dashboard?trimester='+trimester]}><DashboardInsights/></MemoryRouter>);
 return {host,evidence,result};
}
it('keeps empty mastery/readiness unknown and supplies no invented plan or percentages',()=>{
 const {host}=render();expect(host.textContent).toContain('Build a study session');
 expect(host.querySelectorAll('.ds-dashboard-plan li')).toHaveLength(0);
 expect(host.querySelectorAll('.ds-readiness-value')).toHaveLength(courses.filter(course=>course.trimester===1).length);
 for(const value of host.querySelectorAll('.ds-readiness-value'))expect(value.textContent).toBe('Not enough evidence');
 expect(host.textContent).not.toMatch(/\d%|0 \/ 100|tasks done|day streak/);
});
it('projects actual per-course indices and coverage separately without changing the source records',()=>{
 data.attempts=[success('normal')];mock(data,0,0,'exam');const before=structuredClone(data);
 for(const trimester of [1,2,3,4]){
 const {host,result}=render(trimester);
 const visible=new Set(courses.filter(course=>course.trimester===trimester).map(course=>course.subject_id));
 for(const course of result.courses.filter(course=>visible.has(course.id))){const row=host.querySelector(`.ds-mastery-list [data-course="${course.id}"]`)!;expect(row.textContent).toContain(`${course.covered}/${course.total} skills with reliable practice`);expect(row.textContent).toContain(course.index===null?'Not enough practice yet':`${course.index} / 100`);}
 for(const value of result.readiness.filter(course=>visible.has(course.courseId))){const row=host.querySelector(`.ds-readiness-list [data-course="${value.courseId}"]`)!;expect(row.getAttribute('href')).toBe('/progress?course='+value.courseId);expect(row.textContent).toContain(`Objective coverage: ${value.objectiveTopics}/${value.totalTopics} topics`);}
 }
 expect(data).toEqual(before);
});
it('keeps Study Path secondary even when adaptive recommendations exist',()=>{
 data.attempts=[record('wrong','ds.practice.co-binary-45',{kind:'text',value:'00000000'})];
 const {host,evidence}=render();const expected=recommend(evidence,{minutes:20,subjectId:'',topicId:''});expect(expected.length).toBeGreaterThan(0);
 expect(host.querySelectorAll('.ds-dashboard-plan li')).toHaveLength(0);
 expect(host.textContent).toContain('Build a study session');
 expect(host.querySelector<HTMLAnchorElement>('.ds-dash-plan a')?.getAttribute('href')).toBe('/study-plan');
});
