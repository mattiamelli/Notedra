import expansionGuides from '../expansion/guided.json';
import {lazy,Suspense} from 'react';
import {Link} from 'react-router';
import {FlashcardMode,LearnMode} from '../topic-study/AuthoredViews';
import {studyPath} from '../topic-study/AcademicViews';
import {GuidedPractice} from '../rl/GuidedPractice';
import {useI18n} from '../i18n/i18n';
import type {IPTopicContent} from './types';
import type {IPStudyProps} from './IPStudyMode';
import './ip.css';
const TopicPractice=lazy(()=>import('../topic-study/TopicPractice').then(m=>({default:m.TopicPractice})));
const Assignments=lazy(()=>import('./Assignments'));
const learnTasks:Record<string,string>={
 'ds.block.ip.t05.process':'ds.assignment.ip.array-window',
 'ds.block.ip.t08.boundaries':'ds.assignment.ip.boundary-tests',
 'ds.block.ip.t11.value':'ds.assignment.ip.grid-key',
};
export function TopicContent({topic,mode,content}:{content:IPTopicContent}&IPStudyProps){
 const {t}=useI18n();
 if(mode==='flashcards')return <FlashcardMode topic={topic} content={content.cards}/>;
 if(mode==='learn'){
  const blockActions=Object.fromEntries(Object.entries(learnTasks).map(([blockId,taskId])=>[blockId,<Link className="ds-text-link" to={`${studyPath(topic,'practice')}?task=${encodeURIComponent(taskId)}`}>{t('ip.openCodingTask')}</Link>]));
  return <><p><Link className="ds-button" to={studyPath(topic,'practice')}>Apply this in Java practice</Link></p><LearnMode topic={topic} content={content.lesson} blockActions={blockActions}/></>;
 }
 if(mode==='exam-style')return <Suspense fallback={<p role="status">Loading authored assignments…</p>}><Assignments topicId={topic.id} examOnly/>{expansionGuides.some(g=>g.topicId===topic.id&&g.mode==='exam')&&<GuidedPractice activities={expansionGuides.filter(g=>g.topicId===topic.id&&g.mode==='exam')}/>}</Suspense>;
 return <div className="ds-ip-practice"><Suspense fallback={<p role="status">Loading programming tasks…</p>}><Assignments topicId={topic.id}/><TopicPractice topicId={topic.id} hasStudyActivities/></Suspense><GuidedPractice activities={[...content.guided,...expansionGuides.filter(g=>g.topicId===topic.id&&g.mode==='practice')]}/></div>;
}
