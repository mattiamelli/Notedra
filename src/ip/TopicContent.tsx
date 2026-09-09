import {lazy,Suspense} from 'react';
import {Link} from 'react-router';
import {FlashcardMode,LearnMode} from '../topic-study/AuthoredViews';
import {studyPath} from '../topic-study/AcademicViews';
import {GuidedPractice} from '../rl/GuidedPractice';
import type {IPTopicContent} from './types';
import type {IPStudyProps} from './IPStudyMode';
import './ip.css';
const TopicPractice=lazy(()=>import('../topic-study/TopicPractice').then(m=>({default:m.TopicPractice})));
const Assignments=lazy(()=>import('./Assignments'));
export function TopicContent({topic,mode,content}:{content:IPTopicContent}&IPStudyProps){
 if(mode==='flashcards')return <FlashcardMode topic={topic} content={content.cards}/>;
 if(mode==='learn')return <><p><Link className="ds-button" to={studyPath(topic,'practice')}>Apply this in Java practice</Link></p><LearnMode topic={topic} content={content.lesson}/></>;
 if(mode==='exam-style')return <Suspense fallback={<p role="status">Loading authored assignments…</p>}><Assignments topicId={topic.id} examOnly/></Suspense>;
 return <div className="ds-ip-practice"><Suspense fallback={<p role="status">Loading programming tasks…</p>}><Assignments topicId={topic.id}/><TopicPractice topicId={topic.id} hasStudyActivities/></Suspense><GuidedPractice activities={content.guided}/></div>;
}
