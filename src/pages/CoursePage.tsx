import { Link } from 'react-router';
import { ASSEMBLY_TOPIC_ID, type Course, topicPath, topicsFor } from '../academic/navigation';
import { AssemblyToolCard, PageHeading } from '../shell/PageParts';
import { ShellIcon } from '../shell/ShellIcon';
export function CoursePage({course}: {course: Course}) {
  const topics = topicsFor(course.subject_id);
  return <>
    <PageHeading eyebrow={`${course.code} · ${course.short}`} title={course.name}><p>{topics.length} topics in the academic catalogue.</p></PageHeading>
    <section className={`ds-section ds-tone-${course.tone}`} aria-labelledby="topics-title"><div className="ds-section-heading"><h2 id="topics-title">Course topics</h2><span>{course.code}</span></div>
      <ol className="ds-topic-list">{topics.map(topic => <li key={topic.topic_id}><Link to={topicPath(topic)}><span className="ds-topic-order">{String(topic.order).padStart(2, '0')}</span><span className="ds-topic-name">{topic.name}{topic.topic_id === ASSEMBLY_TOPIC_ID && <span className="ds-topic-tool">Assembly workbench available</span>}</span><ShellIcon name="arrow" size={18}/></Link></li>)}</ol>
    </section>
    {topics.some(topic => topic.topic_id === ASSEMBLY_TOPIC_ID) && <section className="ds-section" aria-labelledby="course-tools-title"><div className="ds-section-heading"><h2 id="course-tools-title">Available tools</h2></div><AssemblyToolCard/></section>}
  </>;
}
