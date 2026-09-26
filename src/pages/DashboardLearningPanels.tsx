import {Link} from 'react-router';
import {academicIndex,courses,trimesters,topicPath} from '../academic/navigation';
import {useI18n} from '../i18n/i18n';
import {useLearning} from '../learning/LearningProvider';
import {allExercises} from '../practice/catalog';
import {deriveCourseCompletion} from '../progress/completion';
import {CourseCard} from '../shell/PageParts';
import {ShellIcon} from '../shell/ShellIcon';
import {NextBestAction} from './NextBestAction';
import {useCurrentTrimester} from './useCurrentTrimester';
import './dashboard-curriculum.css';

const copy={
 en:{current:'Current trimester',other:'Other trimesters',trimester:'Trimester',continue:'Continue studying'},
 it:{current:'Trimestre attuale',other:'Altri trimestri',trimester:'Trimestre',continue:'Continua a studiare'},
 es:{current:'Trimestre actual',other:'Otros trimestres',trimester:'Trimestre',continue:'Continuar estudiando'},
 fr:{current:'Trimestre actuel',other:'Autres trimestres',trimester:'Trimestre',continue:'Continuer à étudier'},
 de:{current:'Aktuelles Trimester',other:'Weitere Trimester',trimester:'Trimester',continue:'Weiterlernen'},
};

export function DashboardNextAction(){return <NextBestAction/>;}

export function DashboardCourses(){
 const {language,lt}=useI18n(),text=copy[language];
 const [selected,select]=useCurrentTrimester();
 const learning=useLearning();
 const completion=deriveCourseCompletion(allExercises,learning?.snapshot?.data.attempts??[]);
 const current=courses.filter(course=>course.trimester===selected);
 const resume=learning?.snapshot?.data.resume;
 const topic=resume&&academicIndex.topics.find(item=>item.subject_id===resume.subjectId&&item.topic_id===resume.topicId&&current.some(course=>course.subject_id===item.subject_id));
 const nextCourse=current.find(course=>{const value=completion.find(item=>item.subjectId===course.subject_id);return !value||value.percentage!==100;})??current[0];
 return <>
 <section id="courses" className="ds-current-trimester ds-dash-courses" data-tour="courses-panel" aria-labelledby="courses-title">
  <div className="ds-current-heading"><h2 id="courses-title">{text.current}</h2><label className="ds-current-select"><span>{text.trimester}</span><select aria-label={text.current} value={selected} onChange={event=>select(Number(event.target.value))}>{trimesters.map(value=><option key={value} value={value}>{text.trimester} {value}</option>)}</select></label></div>
  <div className="ds-current-action"><div><span>{text.continue}</span><strong>{topic?lt(topic.name):nextCourse.publicName}</strong></div><Link className="ds-button ds-button-primary" to={topic?topicPath(topic):nextCourse.path}>{text.continue}<ShellIcon name="arrow" size={18}/></Link></div>
  <div className="ds-course-grid" aria-label={`${text.trimester} ${selected} courses`}>{current.map(course=><CourseCard key={course.subject_id} course={course} completion={completion.find(item=>item.subjectId===course.subject_id)??{completed:0,eligible:0,percentage:null}}/>)}</div>
 </section>
 <section className="ds-other-trimesters" aria-labelledby="other-trimesters-title"><h2 id="other-trimesters-title">{text.other}</h2>{trimesters.filter(value=>value!==selected).map(value=><div className="ds-other-trimester" key={value}><h3>{text.trimester} {value}</h3><ul>{courses.filter(course=>course.trimester===value).map(course=><li key={course.subject_id}><Link to={course.path}><ShellIcon name={course.icon} size={20}/><span>{course.publicName}</span><ShellIcon name="arrow" size={16}/></Link></li>)}</ul></div>)}</section>
 </>;
}
