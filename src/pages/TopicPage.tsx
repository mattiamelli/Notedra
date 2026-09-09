import { useState, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router';
import { ASSEMBLY_TOPIC_ID, type Course, topicsFor } from '../academic/navigation';
import type { AcademicTopic } from '../academic/types';
import { AssemblyToolCard, EmptyState, PageHeading } from '../shell/PageParts';
import { NotFoundPage } from './NotFoundPage';
const studyModes = [
  {label: 'Overview', title: 'Study materials are not available yet', message: 'This topic has a place in your course catalogue. Study materials will be added in a future update.'},
  {label: 'Mental Map', title: 'Mental maps are not available yet', message: 'Visual topic maps will appear here in a future update.'},
  {label: 'Flashcards', title: 'Flashcards are not available yet', message: 'Topic flashcards will appear here when the flashcard tools are ready.'},
  {label: 'Practice', title: 'Topic practice is not available yet', message: 'Exercises for this topic will appear here when practice is available.'},
  {label: 'Exam-style', title: 'Exam-style practice is not available yet', message: 'Exam-style questions for this topic will be available in a future update.'},
  {label: 'Mistakes', title: 'Topic mistake review is not available yet', message: 'You will be able to revisit mistakes here once practice attempts can be recorded.'},
] as const;
export function TopicPage({course}: {course: Course}) {
  const {topicId} = useParams();
  const topic = topicsFor(course.subject_id).find(item => item.topic_id === topicId);
  return topic ? <TopicContent key={topic.topic_id} course={course} topic={topic}/> : <NotFoundPage/>;
}
function TopicContent({course, topic}: {course: Course; topic: AcademicTopic}) {
  const [selected, setSelected] = useState(0);
  const current = studyModes[selected];
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % studyModes.length;
    else if (event.key === 'ArrowLeft') next = (index + studyModes.length - 1) % studyModes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = studyModes.length - 1;
    else return;
    event.preventDefault(); setSelected(next);
    document.getElementById(`study-mode-${next}`)?.focus();
  }
  return <>
    <PageHeading eyebrow={`${course.code} · TOPIC ${String(topic.order).padStart(2, '0')}`} title={topic.name}><p><Link to={course.path} className="ds-text-link">{course.name}</Link></p><code className="ds-topic-id">{topic.topic_id}</code></PageHeading>
    <div className="ds-mode-tabs" role="tablist" aria-label="Topic study modes">{studyModes.map((mode, i) => <button key={mode.label} id={`study-mode-${i}`} role="tab" aria-selected={selected === i} aria-controls="study-mode-panel" tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={event => moveTab(event, i)}>{mode.label}</button>)}</div>
    <section id="study-mode-panel" className="ds-mode-panel" role="tabpanel" aria-labelledby={`study-mode-${selected}`} tabIndex={0}>
      {selected === 0 && topic.topic_id === ASSEMBLY_TOPIC_ID && <AssemblyToolCard/>}
      <EmptyState title={current.title}><p>{current.message}</p></EmptyState>
    </section>
  </>;
}
