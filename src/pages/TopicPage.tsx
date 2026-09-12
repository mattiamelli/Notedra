import {ProgressLoader} from '../progress/ProgressLoader';
import {SummaryLoader} from '../adaptive/SummaryLoader';
import {IPStudyMode} from '../ip/IPStudyMode';
import { lazy, Suspense, type KeyboardEvent } from 'react';
import { Link,useNavigate,useParams } from 'react-router';
import { ASSEMBLY_TOPIC_ID,type Course } from '../academic/navigation';
import { AssemblyToolCard,EmptyState,PageHeading } from '../shell/PageParts';
import { NotFoundPage } from './NotFoundPage';
import { topicStudy } from '../topic-study/content';
import { isStudyMode,studyModes,type StudyMode,type StudyTopic } from '../topic-study/types';
import { MentalMap,TopicOverview,studyPath } from '../topic-study/AcademicViews';
import { FlashcardMode,LearnMode } from '../topic-study/AuthoredViews';
import { RLStudyMode } from '../rl/RLStudyMode';
import { COStudyMode } from '../co/COStudyMode';
const TopicMistakes=lazy(()=>import('../adaptive/MistakesPage').then(m=>({default:m.MistakesPage})));
const IPCues=lazy(()=>import('../ip/MapCues'));
const TopicEnrichment=lazy(()=>import('../enrichment/TopicEnrichment'));
const TopicPractice=lazy(()=>import('../topic-study/TopicPractice').then(m=>({default:m.TopicPractice})));

import '../topic-study/topic-study.css';
export function TopicPage({course}:{course:Course}){
 const {topicId,mode='overview'}=useParams();const topic=topicStudy.topics.find(t=>t.id===topicId&&t.subjectId===course.subject_id);
 return topic&&isStudyMode(mode)?<TopicContent key={topic.id} course={course} topic={topic} mode={mode}/>:<NotFoundPage/>;
}
function TopicContent({course,topic,mode}:{course:Course;topic:StudyTopic;mode:StudyMode}){
 const ip=topic.subjectId==='CSE1100_IP';
 const rl=topic.subjectId==='CSE1300_RL';
 const co=topic.subjectId==='CSE1400_CO'&&topic.id!=='CO_T04_DATA_REP_RADIX_INTEGER';
 const navigate=useNavigate();const selected=studyModes.findIndex(m=>m.id===mode);
 function choose(index:number){navigate(studyPath(topic,studyModes[index].id));}
 function move(event:KeyboardEvent<HTMLButtonElement>,index:number){let next=index;
  if(event.key==='ArrowRight')next=(index+1)%studyModes.length;else if(event.key==='ArrowLeft')next=(index+studyModes.length-1)%studyModes.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=studyModes.length-1;else return;
  event.preventDefault();choose(next);document.getElementById(`study-mode-${next}`)?.focus();
 }
 return <div className="ds-topic-study"><PageHeading eyebrow={`${course.code} · TOPIC ${topic.id.match(/_T(\d+)/)?.[1]??''}`} title={topic.name}><p><Link className="ds-text-link" to={course.path}>{course.name}</Link></p></PageHeading>
 {mode==='overview'&&<ProgressLoader courseId={course.subject_id} topicId={topic.id}/>}
 {mode!=='mistakes'&&<SummaryLoader topicId={topic.id}/>}
 <div className="ds-study-mode-tabs" role="tablist" aria-label="Topic study modes">{studyModes.map((m,i)=><button key={m.id} id={`study-mode-${i}`} role="tab" aria-selected={mode===m.id} aria-controls="study-mode-panel" tabIndex={mode===m.id?0:-1} onClick={()=>choose(i)} onKeyDown={e=>move(e,i)}>{m.label}</button>)}</div>
 <section id="study-mode-panel" className="ds-mode-panel" role="tabpanel" aria-labelledby={`study-mode-${selected}`} tabIndex={0}>
 {mode==='overview'&&<>{topic.id===ASSEMBLY_TOPIC_ID&&<AssemblyToolCard/>}<TopicOverview topic={topic}/><div className="ds-study-next"><Link className="ds-button" to={studyPath(topic,'learn')}>Open Learn</Link><Link className="ds-text-link" to={studyPath(topic,'mental-map')}>Explore Mental Map</Link></div></>}
 {mode==='learn'&&(ip?<IPStudyMode topic={topic} mode={mode}/>:rl?<RLStudyMode topic={topic} mode={mode}/>:co?<COStudyMode topic={topic} mode={mode}/>:<LearnMode topic={topic}/>)}{mode==='mental-map'&&<><MentalMap topic={topic}/>{ip&&<Suspense fallback={<p role="status">Loading study cues…</p>}><IPCues topicId={topic.id}/></Suspense>}</>}{mode==='flashcards'&&(ip?<IPStudyMode topic={topic} mode={mode}/>:rl?<RLStudyMode topic={topic} mode={mode}/>:co?<COStudyMode topic={topic} mode={mode}/>:<FlashcardMode key={topic.id} topic={topic}/>)}{mode==='practice'&&(ip?<IPStudyMode topic={topic} mode={mode}/>:rl?<RLStudyMode topic={topic} mode={mode}/>:co?<COStudyMode topic={topic} mode={mode}/>:<Suspense fallback={<p role="status">Loading Practice…</p>}><TopicPractice topicId={topic.id}/></Suspense>)}
 {mode==='exam-style'&&(ip?<IPStudyMode topic={topic} mode={mode}/>:<EmptyState title="Exam-style practice is not available yet"><p>Exam-style exercises have not been authored for this topic. The shared Practice items are introductory authored study exercises.</p></EmptyState>)}
 {mode==='mistakes'&&<Suspense fallback={<p role="status">Loading mistakes…</p>}><TopicMistakes topicId={topic.id}/></Suspense>}
 {['flashcards','mental-map','practice'].includes(mode)&&!topic.id.startsWith('IP_')&&<Suspense fallback={<p role="status">Loading supplemental study…</p>}><TopicEnrichment key={topic.id+mode} topicId={topic.id} mode={mode}/></Suspense>}
 </section></div>;
}
