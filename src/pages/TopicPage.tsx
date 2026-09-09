import { type KeyboardEvent } from 'react';
import { Link,useNavigate,useParams } from 'react-router';
import { ASSEMBLY_TOPIC_ID,type Course } from '../academic/navigation';
import { AssemblyToolCard,EmptyState,PageHeading } from '../shell/PageParts';
import { NotFoundPage } from './NotFoundPage';
import { topicStudy } from '../topic-study/content';
import { isStudyMode,studyModes,type StudyMode,type StudyTopic } from '../topic-study/types';
import { MentalMap,TopicOverview,studyPath } from '../topic-study/AcademicViews';
import { FlashcardMode,LearnMode } from '../topic-study/AuthoredViews';
import { TopicPractice } from '../topic-study/TopicPractice';
import '../topic-study/topic-study.css';
export function TopicPage({course}:{course:Course}){
 const {topicId,mode='overview'}=useParams();const topic=topicStudy.topics.find(t=>t.id===topicId&&t.subjectId===course.subject_id);
 return topic&&isStudyMode(mode)?<TopicContent key={topic.id} course={course} topic={topic} mode={mode}/>:<NotFoundPage/>;
}
function TopicContent({course,topic,mode}:{course:Course;topic:StudyTopic;mode:StudyMode}){
 const navigate=useNavigate();const selected=studyModes.findIndex(m=>m.id===mode);
 function choose(index:number){navigate(studyPath(topic,studyModes[index].id));}
 function move(event:KeyboardEvent<HTMLButtonElement>,index:number){let next=index;
  if(event.key==='ArrowRight')next=(index+1)%studyModes.length;else if(event.key==='ArrowLeft')next=(index+studyModes.length-1)%studyModes.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=studyModes.length-1;else return;
  event.preventDefault();choose(next);document.getElementById(`study-mode-${next}`)?.focus();
 }
 return <div className="ds-topic-study"><PageHeading eyebrow={`${course.code} · TOPIC ${topic.id.match(/_T(\d+)/)?.[1]??''}`} title={topic.name}><p><Link className="ds-text-link" to={course.path}>{course.name}</Link></p><code className="ds-topic-id">{topic.id}</code></PageHeading>
 <div className="ds-study-mode-tabs" role="tablist" aria-label="Topic study modes">{studyModes.map((m,i)=><button key={m.id} id={`study-mode-${i}`} role="tab" aria-selected={mode===m.id} aria-controls="study-mode-panel" tabIndex={mode===m.id?0:-1} onClick={()=>choose(i)} onKeyDown={e=>move(e,i)}>{m.label}</button>)}</div>
 <section id="study-mode-panel" className="ds-mode-panel" role="tabpanel" aria-labelledby={`study-mode-${selected}`} tabIndex={0}>
 {mode==='overview'&&<>{topic.id===ASSEMBLY_TOPIC_ID&&<AssemblyToolCard/>}<TopicOverview topic={topic}/><div className="ds-study-next"><Link className="ds-button" to={studyPath(topic,'learn')}>Open Learn</Link><Link className="ds-text-link" to={studyPath(topic,'mental-map')}>Explore Mental Map</Link></div></>}
 {mode==='learn'&&<LearnMode topic={topic}/>}{mode==='mental-map'&&<MentalMap topic={topic}/>}{mode==='flashcards'&&<FlashcardMode key={topic.id} topic={topic}/>}{mode==='practice'&&<TopicPractice topicId={topic.id}/>}
 {mode==='exam-style'&&<EmptyState title="Exam-style practice is not available yet"><p>Exam-style exercises have not been authored for this topic. The shared Practice items are introductory authored study exercises.</p></EmptyState>}
 {mode==='mistakes'&&<EmptyState title="Topic mistake review is not available yet"><p>Saved answers are not used to infer a mistake profile. Topic mistake review is not available.</p></EmptyState>}
 </section></div>;
}
