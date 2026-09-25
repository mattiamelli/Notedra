// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {BrowserRouter} from 'react-router';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {AppRoutes} from '../src/App';
import {LearningProvider} from '../src/learning/LearningProvider';
import {repository} from './helpers/learning';
import {emptyBackup,success,mock,CLOCK} from './helpers/progress';
import type {Backup} from '../src/learning/contracts';
import {courses} from '../src/academic/navigation';
import {curriculumCourses} from '../src/curriculum/registry';
let host:HTMLDivElement,root:Root;
async function settle(){for(let n=0;n<60;n++)await act(async()=>{await new Promise(r=>setTimeout(r,5));});}
beforeEach(()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});vi.spyOn(Date,'now').mockReturnValue(CLOCK);vi.spyOn(window,'scrollTo').mockImplementation(()=>{});host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
async function mount(path:string,data:Backup=emptyBackup()){
 const repo=repository();const saved=await repo.load();await repo.restore(data,saved.data);
 window.history.replaceState(null,'',path);await import('../src/progress/ProgressPage');await import('../src/progress/ProgressSummary');
 await act(async()=>root.render(<BrowserRouter><LearningProvider createRepository={()=>repo}><AppRoutes/></LearningProvider></BrowserRouter>));await settle();return repo;
}
it('empty Progress reports unknown and actionable next steps, not failure',async()=>{await mount('/progress');expect(host.textContent).toContain('Not enough practice yet');expect(host.textContent).toContain('Missing practice stays unknown; this is not a zero score.');expect(host.textContent).toContain('Complete graded practice in more skills');expect(host.textContent).toContain('Not enough exam practice yet');expect(host.textContent).toContain('Complete graded exam-style questions across more topics.');expect(host.textContent).toContain('Confidence: Insufficient');expect(host.textContent).not.toMatch(/0%|0 \/ 100/);expect(host.querySelector('select')).not.toBeNull();});
it('exact normal evidence exposes skill, topic and course context plus explanation',async()=>{const d=emptyBackup(),a=success('ui');d.attempts=[a];const repo=await mount('/progress?course='+a.subjectId+'&topic='+a.topicId,d);expect(host.textContent).toContain('55 / 100');expect(host.textContent).toContain('1 completed practice records');expect(host.textContent).toContain('How is this calculated?');expect(host.textContent).toContain('Confidence: Low');expect((await repo.load()).data.attempts).toEqual(d.attempts);});
it('course filters write URL state and topic filters preserve mapped skills',async()=>{await mount('/progress');const course=host.querySelector('.progress-page select')!;await act(async()=>{(course as HTMLSelectElement).value='CSE1100_IP';course.dispatchEvent(new Event('change',{bubbles:true}));});await settle();expect(location.search).toBe('?course=CSE1100_IP');expect(host.textContent).toContain('Integrated programming');const topic=host.querySelectorAll<HTMLSelectElement>('.progress-page select')[1];await act(async()=>{topic.value=topic.options[1].value;topic.dispatchEvent(new Event('change',{bubbles:true}));});expect(location.search).toContain('&topic=IP_');expect(host.querySelector('section[aria-label="Topic and skill progress"]')!.children).toHaveLength(1);});
it('offers every course in Progress and filters curriculum topics independently of sidebar trimester',async()=>{
 await mount('/progress');
 const course=host.querySelector<HTMLSelectElement>('.progress-page select')!;
 expect([...course.options].map(option=>option.value)).toEqual(courses.map(item=>item.subject_id));
 const sidebar=host.querySelector<HTMLSelectElement>('#sidebar-trimester')!;
 const trimester=sidebar.value;
 for(const curriculum of curriculumCourses){
  await act(async()=>{course.value=curriculum.id;course.dispatchEvent(new Event('change',{bubbles:true}));});
  expect(location.search).toBe('?course='+curriculum.id);expect(sidebar.value).toBe(trimester);
  const topic=host.querySelectorAll<HTMLSelectElement>('.progress-page select')[1];
  expect([...topic.options].slice(1).map(option=>option.value)).toEqual(curriculum.topics.map(item=>item.id));
  await act(async()=>{topic.value=curriculum.topics[0].id;topic.dispatchEvent(new Event('change',{bubbles:true}));});
  expect(new URLSearchParams(location.search).get('topic')).toBe(curriculum.topics[0].id);
  const section=host.querySelector('section[aria-label="Topic and skill progress"]')!;
  expect(section.children).toHaveLength(1);expect(section.textContent).toContain(curriculum.topics[0].name);
  for(const skill of curriculum.topics[0].skills)expect(section.textContent).toContain(skill.name);
  expect(section.textContent).toContain('Not enough practice yet');
 }
});
it('unavailable historical exams keep normal evidence and disclose excluded records',async()=>{const d=emptyBackup();d.attempts=[success('ui')];const s=mock(d,0,0,'history');s.blueprint.version='missing';await mount('/progress',d);expect(host.textContent).toContain('1 /');expect(host.textContent).toContain('unresolved historical records');expect(host.textContent).toContain('Not enough exam practice yet');});
it('exam readiness explains evidence without presenting a predicted grade',async()=>{const d=emptyBackup();mock(d,0,0,'readiness-copy');await mount('/progress',d);expect(host.textContent).toContain('An estimate from recent exam-style evidence, not a predicted grade.');expect(host.textContent).toMatch(/Reliable evidence includes 1 exam sessions, \d+ different items and \d+ \/ \d+ assessed topics\./);expect(host.textContent).toContain('correctness is not automatically verified');});
it.each(['/dashboard','/co','/co/CO_T06_ASSEMBLY_X86_64'])('summaries on %s remain plain-language and link to Progress',async path=>{await mount(path);expect(host.textContent).toContain('Learning Mastery');expect(host.querySelector('a[href^="/progress?"]')).not.toBeNull();if(!path.includes('CO_T06'))expect(host.textContent).toContain('Exam Readiness');});
it('self-review regression: submitted practice explains the separate Progress derivation',async()=>{const d=emptyBackup();d.attempts=[success('wording')];await mount('/practice/ds.practice.co-binary-45/attempts/wording',d);expect(host.textContent).toContain('Eligible saved evidence is interpreted separately in Progress');expect(host.textContent).not.toContain('No learning score is calculated');expect(host.textContent).not.toContain('does not update mastery');});
it('browser regression: long Progress headings override the Assembly nowrap rule',async()=>{const {readFileSync}=await import('node:fs');const css=document.createElement('style');css.textContent=readFileSync('src/index.css','utf8').match(/^h2 \{.*\}$/m)![0]+'\n'+readFileSync('src/progress/progress.css','utf8');document.head.append(css);try{await mount('/progress');expect(getComputedStyle(host.querySelector('.progress-page h2')!).whiteSpace).toBe('normal');}finally{css.remove();}});
it('browser regression: exam landing and review point to separate contextual Progress indices',async()=>{const d=emptyBackup(),s=mock(d,0,0,'copy-exam');await mount('/exams',d);expect(host.textContent).toContain('See Progress for separate evidence indices');await act(async()=>{window.history.pushState(null,'','/exams/review/'+s.sessionId);window.dispatchEvent(new PopStateEvent('popstate'));});await settle();expect(host.textContent).toContain('See Progress for separate evidence indices');});
it('final-review regression: topic explanations identify strongest and recent-review skills',async()=>{const d=emptyBackup(),a=success('topic-context');d.attempts=[a];await mount('/progress?course='+a.subjectId+'&topic='+a.topicId,d);const topic=host.querySelector('section[aria-label="Topic and skill progress"]')!;expect(topic.textContent).toContain('Strongest recorded skills: Convert between number bases');expect(topic.textContent).toContain('Recent mistakes to review: None recorded');});
it('keeps policy secondary and moves backup controls from Progress to Account',async()=>{await mount('/progress');expect(host.querySelector('details > summary')?.textContent).toBe('How is this calculated?');expect(host.textContent).not.toContain('Export student backup');await import('../src/accounts/AccountPage');await act(async()=>{window.history.pushState(null,'','/account');window.dispatchEvent(new PopStateEvent('popstate'));});await settle();expect(host.textContent).toContain('Data & Privacy');expect(host.textContent).toContain('Export student backup');expect(host.textContent).toContain('Choose student backup');});
it('hides curriculum machine IDs while retaining mapped routes',async()=>{await mount('/rl/RL_T02_FOL/learn');expect(host.textContent).not.toMatch(/RL_(?:SK|ST)\d/);expect(host.querySelector('[id^="RL_SK"]')).not.toBeNull();expect(host.querySelector('a[href*="RL_T02_FOL"]')).not.toBeNull();});
