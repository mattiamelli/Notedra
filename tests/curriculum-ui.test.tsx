// @vitest-environment jsdom
import {act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {courses,topicPath,topicsFor,resolveStudyRoute,pageContext} from '../src/academic/navigation';
import {curriculumCourses} from '../src/curriculum/registry';
import CourseContent,{CurriculumRevision} from '../src/curriculum/CourseContent';
import {DashboardCourses} from '../src/pages/DashboardLearningPanels';
import {ExamsPage} from '../src/exams/ExamsPage';
import {studyModes} from '../src/topic-study/types';
import {allExercises,exercisePath} from '../src/practice/catalog';
vi.mock('../src/progress/ProgressLoader',()=>({ProgressLoader:()=>null}));
vi.mock('../src/learning/LearningProvider',()=>({useLearning:()=>({snapshot:{data:{attempts:[],exams:[],examReviews:[]}}})}));
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let container:HTMLDivElement,root:Root;
beforeEach(()=>{container=document.createElement('div');document.body.append(container);root=createRoot(container);});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();});

it('keeps original paths and resolves every new topic mode and breadcrumb',()=>{
  expect(courses.filter(course=>course.trimester===1).map(course=>course.path)).toEqual(['/co','/rl','/ip']);
  expect(courses).toHaveLength(11);
  for(const course of courses.filter(course=>course.trimester!==1))for(const topic of topicsFor(course.subject_id))for(const mode of studyModes){
    const path=topicPath(topic)+(mode.id==='overview'?'':`/${mode.id}`);
    expect(resolveStudyRoute(path)).toEqual({topic,mode:mode.id});
    expect(pageContext(path).breadcrumbs.some(crumb=>crumb.to===course.path)).toBe(true);
  }
});

it('switches the dashboard course group and restores a linked trimester',async()=>{
  await act(async()=>root.render(<MemoryRouter initialEntries={['/dashboard?trimester=3']}><DashboardCourses/></MemoryRouter>));
  const links=()=>[...container.querySelectorAll<HTMLAnchorElement>('.ds-course-grid > a')].map(link=>link.getAttribute('href'));
  expect(links()).toEqual(courses.filter(course=>course.trimester===3).map(course=>course.path));
  const button=[...container.querySelectorAll('button')].find(button=>button.textContent?.startsWith('Trimester 4'))!;
  await act(async()=>button.click());
  expect(button.getAttribute('aria-pressed')).toBe('true');
  expect(links()).toEqual(['/probability','/networks']);
});

it('shows source limitations and topic links for every new course',async()=>{
  for(const authored of curriculumCourses){
    const course=courses.find(course=>course.subject_id===authored.id)!;
    await act(async()=>root.render(<MemoryRouter><CourseContent course={course}/></MemoryRouter>));
    expect(container.querySelector('h1')?.textContent).toBe(authored.name);
    for(const limitation of authored.limitations)expect(container.textContent).toContain(limitation);
    for(const source of authored.sources)expect(container.textContent).toContain(source.filename);
    expect(container.querySelectorAll('.ds-topic-list > li')).toHaveLength(authored.topics.length);
  }
});

it('provides real practice links and open rubrics for every authored revision topic',async()=>{
  for(const course of curriculumCourses)for(const topic of course.topics){
    await act(async()=>root.render(<MemoryRouter><CurriculumRevision courseId={course.id} topicId={topic.id}/></MemoryRouter>));
    expect(container.textContent).toContain('not an official mock exam');
    expect(container.querySelectorAll('.ds-curriculum-revision-list > li')).toHaveLength(topic.exercises.length);
    expect(container.textContent?.includes('Mixed practice')).toBe(topic.exercises.some(item=>item.kind!=='open'));
    expect(container.textContent?.includes('Open reasoning')).toBe(topic.exercises.some(item=>item.kind==='open'));
    for(const item of topic.exercises){
      const exercise=allExercises.find(exercise=>exercise.id===item.id)!;
      expect(exercise).toBeDefined();
      expect(container.querySelector(`a[href="${exercisePath(exercise)}"]`)).not.toBeNull();
      for(const criterion of item.rubric??[])expect(container.textContent).toContain(criterion);
    }
  }
});

it('offers mock setup only for the three supported exam banks',async()=>{
  await act(async()=>root.render(<MemoryRouter><ExamsPage/></MemoryRouter>));
  expect(container.querySelectorAll('a[href$="/setup"]')).toHaveLength(3);
  for(const course of curriculumCourses)expect(container.querySelector(`a[href="/exams/${course.id}/setup"]`)).toBeNull();
  expect(container.textContent).toContain('readiness remains unknown');
});
