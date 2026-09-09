import {lazy,Suspense} from 'react';
import {Link} from 'react-router';
import {FlashcardMode,LearnMode} from '../topic-study/AuthoredViews';
import {studyPath} from '../topic-study/AcademicViews';
import type {RLTopicContent} from './types';
import type {RLStudyProps} from './RLStudyMode';
import {GuidedPractice} from './GuidedPractice';
import tools from './tools.json';
import './rl.css';
const TopicPractice=lazy(()=>import('../topic-study/TopicPractice').then(m=>({default:m.TopicPractice})));
const Workspace=lazy(()=>import('./Workspace'));
export function TopicContent({topic,mode,content}:{content:RLTopicContent}&RLStudyProps){
 const tool=tools.find(t=>t.topicId===topic.id);
 if(mode==='flashcards')return <FlashcardMode topic={topic} content={content.cards}/>;
 if(mode==='learn')return <>{tool&&<p className="ds-co-tool-link"><Link className="ds-button" to={studyPath(topic,'practice')+'#rl-workspace'}>Explore {tool.name}</Link></p>}<LearnMode topic={topic} content={content.lesson}/></>;
 return <div className="ds-rl-practice">{tool&&<Suspense fallback={<p role="status">Loading interactive workspace…</p>}><Workspace tool={tool}/></Suspense>}<Suspense fallback={<p role="status">Loading shared Practice…</p>}><TopicPractice topicId={topic.id} hasStudyActivities={content.guided.length>0||Boolean(tool)}/></Suspense>{content.guided.length>0&&<GuidedPractice activities={content.guided}/>}</div>;
}
