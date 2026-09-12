import interactiveCapabilities from '../interactive/capabilities.json';
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
export function CoursePage({course}: {course: Course}) {
  const topics = topicsFor(course.subject_id);
  return <div data-course={course.subject_id}>
    <div className="ds-course-intro"><PageHeading eyebrow={`${course.code} · ${course.short}`} title={course.name}><p>{topics.length} topics in the academic catalogue.</p>{['CSE1400_CO','CSE1300_RL'].includes(course.subject_id)&&<p>Follow the canonical topic order and check each topic’s prerequisites. Lessons, cards and tools are available for study; reading does not mark a topic complete.</p>}</PageHeading><div className="ds-study-next"><a className="ds-button" href="#topics-title">Explore course topics <ShellIcon name="arrow" size={17}/></a><Link className="ds-text-link" to={`/study-plan?course=${course.subject_id}`}>Find a next activity</Link></div></div>
    <section className={`ds-section ds-tone-${course.tone}`} aria-labelledby="topics-title"><div className="ds-section-heading"><h2 id="topics-title">Course topics</h2><span>{course.code}</span></div>
      <ol className="ds-topic-list">{topics.map(topic => <li key={topic.topic_id}><Link to={topicPath(topic)}><span className="ds-topic-order">{String(topic.order).padStart(2, '0')}</span><span className="ds-topic-name">{topic.name}{topic.topic_id === ASSEMBLY_TOPIC_ID && <span className="ds-topic-tool">Assembly workbench available</span>}</span><ShellIcon name="arrow" size={18}/></Link>{['CSE1400_CO','CSE1300_RL'].includes(course.subject_id)&&<div className={course.subject_id==='CSE1300_RL'?'ds-rl-capability':'ds-co-capability'}>{(()=>{const c=(course.subject_id==='CSE1300_RL'?rlCapabilities:capabilities).find(c=>c.topicId===topic.topic_id)!;const p=topicStudy.topics.find(t=>t.id===topic.topic_id)!.prerequisites;const extra=enrichmentCapabilities.find(e=>e.topicId===topic.topic_id);return <><p>Guided lesson available · {c.cardCount+(extra?.cards??0)} flashcards · {c.exerciseCount+(extra?.exercises??0)+(interactiveCapabilities.find(i=>i.topicId===topic.topic_id)?.count??0)} graded exercises · {c.guidedCount+(extra?.guides??0)} unscored activities{c.toolName&&<> · {c.toolName} available</>}</p><p>Prerequisites: {p.length?p.map((id,i)=><span key={id}>{i>0?', ':''}<CanonicalLink id={id}/></span>):'No topic prerequisites'}</p></>;})()}</div>}{course.subject_id==='CSE1100_IP'&&<div className="ds-co-capability">{(()=>{const c=ipCapabilities.find(c=>c.topicId===topic.topic_id)!;const prerequisites=topicStudy.topics.find(t=>t.id===topic.topic_id)!.prerequisites;return <><p>Guided lesson · {c.cardCount} flashcards · {c.exerciseCount} fixed predictions · {c.guidedCount} guided self-checks · {c.assignmentCount} coding tasks</p><p>Prerequisites: {prerequisites.length?prerequisites.map((id,i)=><span key={id}>{i>0?', ':''}<CanonicalLink id={id}/></span>):'No topic prerequisites'}</p></>;})()}</div>}</li>)}</ol>
    </section>
    {topics.some(topic => topic.topic_id === ASSEMBLY_TOPIC_ID) && <section className="ds-section" aria-labelledby="course-tools-title"><div className="ds-section-heading"><h2 id="course-tools-title">Available tools</h2></div><AssemblyToolCard/></section>}
    <ProgressLoader courseId={course.subject_id}/>
  </div>;
}
