import expansionGuides from '../expansion/guided-capabilities.json';
import expansionCapabilities from '../expansion/capabilities.json';
import interactiveCapabilities from '../interactive/capabilities.json';
import advancedCapabilities from '../advanced/capabilities.json';
import {ProgressLoader} from '../progress/ProgressLoader';
import ipCapabilities from '../ip/capabilities.json';
import enrichmentCapabilities from '../enrichment/capabilities.json';
import '../co/co.css';
import '../rl/rl.css';
import rlCapabilities from '../rl/capabilities.json';
import capabilities from '../co/capabilities.json';
import {topicStudy} from '../topic-study/content';
import {CanonicalLink} from '../topic-study/AcademicViews';
import { Link } from 'react-router';
import { ASSEMBLY_TOPIC_ID, type Course, topicPath, topicsFor } from '../academic/navigation';
import { AssemblyToolCard, PageHeading } from '../shell/PageParts';
import { ShellIcon } from '../shell/ShellIcon';
import {useI18n} from '../i18n/i18n';
import {track} from '../analytics/analytics';
import {useTrackOnce} from '../analytics/react';
import {lazy, Suspense} from 'react';
const CurriculumCourseContent=lazy(()=>import('../curriculum/CourseContent'));
const advancedCounts=new Map(advancedCapabilities.map(item=>[item.topicId,item.count]));
const advancedCount=(topicId:string)=>advancedCounts.get(topicId)??0;
export function CoursePage({course}: {course: Course}) {
  const {t}=useI18n();
  useTrackOnce(course.subject_id,()=>track('course_opened',{course_id:course.subject_id,activity_type:'course',source_surface:'course'}));
  const topics = topicsFor(course.subject_id);
  if(course.trimester!==1)return <Suspense fallback={<p role="status">Loading course...</p>}><CurriculumCourseContent course={course}/></Suspense>;
  return <div data-course={course.subject_id}>
    <div className="ds-course-intro"><PageHeading eyebrow={course.compactName} title={course.publicName}><p>{t('course.catalogueCount',{count:topics.length})}</p>{['CSE1400_CO','CSE1300_RL'].includes(course.subject_id)&&<p>{t('course.orderHelp')}</p>}</PageHeading><div className="ds-study-next"><a className="ds-button" href="#topics-title">{t('course.explore')} <ShellIcon name="arrow" size={17}/></a><Link className="ds-text-link" to={`/study-plan?course=${course.subject_id}`}>{t('course.next')}</Link></div></div>
    <section className={`ds-section ds-tone-${course.tone}`} aria-labelledby="topics-title"><div className="ds-section-heading"><h2 id="topics-title">{t('course.topics')}</h2></div>
      <ol className="ds-topic-list">{topics.map(topic => <li key={topic.topic_id}><Link to={topicPath(topic)}><span className="ds-topic-order">{String(topic.order).padStart(2, '0')}</span><span className="ds-topic-name">{topic.name}{topic.topic_id === ASSEMBLY_TOPIC_ID && <span className="ds-topic-tool">{t('course.assemblyAvailable')}</span>}</span><ShellIcon name="arrow" size={18}/></Link>{['CSE1400_CO','CSE1300_RL'].includes(course.subject_id)&&<div className={course.subject_id==='CSE1300_RL'?'ds-rl-capability':'ds-co-capability'}>{(()=>{const c=(course.subject_id==='CSE1300_RL'?rlCapabilities:capabilities).find(c=>c.topicId===topic.topic_id)!;const p=topicStudy.topics.find(t=>t.id===topic.topic_id)!.prerequisites;const extra=enrichmentCapabilities.find(e=>e.topicId===topic.topic_id);return <><p>{t('course.guidedStats',{cards:c.cardCount+(extra?.cards??0),exercises:c.exerciseCount+(extra?.exercises??0)+(interactiveCapabilities.find(i=>i.topicId===topic.topic_id)?.count??0)+(expansionCapabilities.find(i=>i.topicId===topic.topic_id)?.count??0)+advancedCount(topic.topic_id),activities:c.guidedCount+(extra?.guides??0)+(expansionGuides.find(i=>i.topicId===topic.topic_id)?.count??0)})}{c.toolName&&<> · {t('course.toolAvailable',{tool:c.toolName})}</>}</p><p>{t('course.prerequisites')} {p.length?p.map((id,i)=><span key={id}>{i>0?', ':''}<CanonicalLink id={id}/></span>):t('course.none')}</p></>;})()}</div>}{course.subject_id==='CSE1100_IP'&&<div className="ds-co-capability">{(()=>{const c=ipCapabilities.find(c=>c.topicId===topic.topic_id)!;const prerequisites=topicStudy.topics.find(t=>t.id===topic.topic_id)!.prerequisites;return <><p>{t('course.programmingStats',{cards:c.cardCount,exercises:c.exerciseCount+(expansionCapabilities.find(i=>i.topicId===topic.topic_id)?.count??0)+advancedCount(topic.topic_id),activities:c.guidedCount+(expansionGuides.find(i=>i.topicId===topic.topic_id)?.count??0),tasks:c.assignmentCount})}</p><p>{t('course.prerequisites')} {prerequisites.length?prerequisites.map((id,i)=><span key={id}>{i>0?', ':''}<CanonicalLink id={id}/></span>):t('course.none')}</p></>;})()}</div>}</li>)}</ol>
    </section>
    {topics.some(topic => topic.topic_id === ASSEMBLY_TOPIC_ID) && <section className="ds-section" aria-labelledby="course-tools-title"><div className="ds-section-heading"><h2 id="course-tools-title">{t('course.tools')}</h2></div><AssemblyToolCard/></section>}
    <ProgressLoader courseId={course.subject_id}/>
  </div>;
}
