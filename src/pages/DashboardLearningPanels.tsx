import {academicIndex,courses} from '../academic/navigation';
import {useI18n} from '../i18n/i18n';
import {useLearning} from '../learning/LearningProvider';
import {allExercises} from '../practice/catalog';
import {deriveCourseCompletion} from '../progress/completion';
import {CourseCard} from '../shell/PageParts';
import {ShellIcon} from '../shell/ShellIcon';
import {NextBestAction} from './NextBestAction';

export function DashboardNextAction(){return <NextBestAction/>;}

export function DashboardCourses(){
 const {t}=useI18n();
 const learning=useLearning();
 const completion=deriveCourseCompletion(allExercises,learning?.snapshot?.data.attempts??[]);
 return <section id="courses" className="ds-dash-panel ds-dash-courses" data-tour="courses-panel" aria-labelledby="courses-title"><div className="ds-section-heading"><h2 id="courses-title"><ShellIcon name="book"/>{t('dashboard.courses')}</h2><span>{t('dashboard.courseCount',{courses:courses.length,topics:academicIndex.topics.length})}</span></div><div className="ds-course-grid">{courses.map(course=><CourseCard key={course.subject_id} course={course} completion={completion.find(item=>item.subjectId===course.subject_id)??{completed:0,eligible:0,percentage:null}}/>)}</div></section>;
}
