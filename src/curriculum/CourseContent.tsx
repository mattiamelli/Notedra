import {Link} from 'react-router';
import {type Course, topicsFor, topicPath} from '../academic/navigation';
import {curriculumCourseFor} from './registry';
import {PageHeading} from '../shell/PageParts';
import {ShellIcon} from '../shell/ShellIcon';
import {ProgressLoader} from '../progress/ProgressLoader';
import {CanonicalLink} from '../topic-study/AcademicViews';
import './curriculum.css';
import {allExercises, exercisePath} from '../practice/catalog';
import {useI18n} from '../i18n/i18n';
import {CalculusExamPractice} from './CalculusExamPractice';
import {MathText} from '../math/MathText';

export function CurriculumRevision({courseId,topicId}:{courseId:string;topicId:string}) {
  const {t}=useI18n();
  const course=curriculumCourseFor(courseId);
  const topic=course?.topics.find(item=>item.id===topicId);
  if(!topic)return null;
  const selected=topic.exercises.filter(item=>item.kind!=='open');
  const reasoning=topic.exercises.filter(item=>item.kind==='open');
  const exerciseLink=(id:string)=>{
    const exercise=allExercises.find(item=>item.id===id&&item.topicId===topicId);
    return exercise?<Link className="ds-button" to={exercisePath(exercise)}>{t('practice.openExercise')} <ShellIcon name="arrow" size={16}/></Link>:<p>Practice is not available for this item.</p>;
  };
  return <section className="ds-curriculum-revision"><h2>Authored revision</h2><p>Independent revision, not an official mock exam. These questions revisit the topic's practice material. Open reasoning uses self-review rubrics and does not establish exam readiness.</p>
    {selected.length>0&&<><h3>Mixed practice</h3><ol className="ds-curriculum-revision-list">{selected.map(item=><li key={item.id}><h4>{item.title}</h4><p><MathText text={item.prompt}/></p>{exerciseLink(item.id)}</li>)}</ol></>}
    {reasoning.length>0&&<><h3>Open reasoning</h3><ol className="ds-curriculum-revision-list">{reasoning.map(item=><li key={item.id}><h4>{item.title}</h4><p><MathText text={item.prompt}/></p>{exerciseLink(item.id)}<details><summary>Self-review rubric</summary><ul>{item.rubric?.map((criterion,index)=><li key={index}><MathText text={criterion}/></li>)}</ul><p><MathText text={item.explanation}/></p></details></li>)}</ol></>}
    <Link className="ds-text-link" to={course?`/${course.slug}`:'/dashboard'}>Course coverage and source limitations</Link>
  </section>;
}

export default function CourseContent({course}:{course:Course}) {
  const {t}=useI18n();
  const content=curriculumCourseFor(course.subject_id);
  if(!content)return null;
  const topics=topicsFor(course.subject_id);
  return <div className="ds-curriculum-course" data-course={course.subject_id}>
    <PageHeading eyebrow={`Trimester ${course.trimester} · ${course.code}`} title={course.publicName}><p>{content.description}</p></PageHeading>
    <div className="ds-study-next"><a className="ds-button" href="#curriculum-topics">{t('course.explore')} <ShellIcon name="arrow" size={17}/></a><Link className="ds-text-link" to={`/study-plan?course=${course.subject_id}`}>{t('studyPath.title')}</Link></div>
    <section className="ds-curriculum-scope" aria-label="Course sources"><p>Independent study material. Not affiliated with or endorsed by a university.</p><details><summary>Coverage and limitations</summary><ul>{content.limitations.map((limitation,index)=><li key={index}>{limitation}</li>)}</ul></details><details><summary>Source references ({content.sources.length})</summary><ul>{content.sources.map(source=><li key={source.id}><strong>{source.filename}</strong><span>{source.locator}</span></li>)}</ul></details></section>
    {course.subject_id==='CSE12A_CALC'&&<CalculusExamPractice/>}
    <section className={`ds-section ds-tone-${course.tone}`} aria-labelledby="curriculum-topics"><div className="ds-section-heading"><h2 id="curriculum-topics">{t('course.topics')}</h2><span>{t('course.topicCount',{count:topics.length})}</span></div><ol className="ds-topic-list">{topics.map(topic=>{
      const authored=content.topics.find(item=>item.id===topic.topic_id);
      return <li key={topic.topic_id}><Link to={topicPath(topic)}><span className="ds-topic-order">{String(topic.order).padStart(2,'0')}</span><span className="ds-topic-name">{topic.name}</span><ShellIcon name="arrow" size={18}/></Link>{authored&&<div className="ds-curriculum-topic-summary"><p>{authored.description}</p><p>{authored.skills.length} skills · {authored.lesson.length} lesson sections · {authored.exercises.length} exercises</p><p>{t('course.prerequisites')} {authored.prerequisites.length?authored.prerequisites.map((id,index)=><span key={id}>{index>0?', ':''}<CanonicalLink id={id}/></span>):t('course.none')}</p><Link className="ds-text-link" to={`${topicPath(topic)}/learn`}>{t('topic.openLearn')} <ShellIcon name="arrow" size={15}/></Link></div>}</li>;
    })}</ol></section><ProgressLoader courseId={course.subject_id}/>
  </div>;
}
