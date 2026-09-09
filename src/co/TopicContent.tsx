import {lazy,Suspense} from 'react';
import {Link} from 'react-router';
import {AuthoredSources,FlashcardMode,LearnMode} from '../topic-study/AuthoredViews';
import {AssemblyToolCard} from '../shell/PageParts';
import {studyPath} from '../topic-study/AcademicViews';
import type {COTopicContent} from './types';
import type {COStudyProps} from './COStudyMode';
import tools from './tools.json';
import './co.css';
const TopicPractice=lazy(()=>import('../topic-study/TopicPractice').then(m=>({default:m.TopicPractice})));
const Workspace=lazy(()=>import('./Workspace'));
export function TopicContent({topic,mode,content}:{content:COTopicContent}&COStudyProps){
 const tool=tools.find(t=>t.topicId===topic.id);
 if(mode==='flashcards')return <FlashcardMode topic={topic} content={content.cards}/>;
 if(mode==='learn')return <>{tool?.id==='assembly'?<AssemblyToolCard/>:tool&&<p className="ds-co-tool-link"><Link className="ds-button" to={studyPath(topic,'practice')+'#co-workspace'}>Explore {tool.name}</Link></p>}<LearnMode topic={topic} content={content.lesson}/></>;
 return <div className="ds-co-practice">
 {tool?.id==='assembly'?<AssemblyToolCard/>:tool&&<Suspense fallback={<p role="status">Loading interactive workspace…</p>}><Workspace tool={tool}/></Suspense>}
 <Suspense fallback={<p role="status">Loading shared Practice…</p>}><TopicPractice topicId={topic.id} hasStudyActivities={content.guided.length>0||Boolean(tool)}/></Suspense>
 {content.guided.length>0&&<section className="ds-section ds-study-reading" aria-labelledby="guided-heading"><h2 id="guided-heading">Unscored guided practice</h2><p>Work through these prompts, then compare your reasoning with the criteria. Multiple valid answers may exist. No automatic grade or saved attempt is created.</p>{content.guided.map(g=><article className="ds-lesson-block" key={g.id}><h3>{g.title}</h3><p>{g.prompt}</p><details><summary>Show self-check criteria</summary><ul>{g.rubric.map((r,i)=><li key={i}>{r}</li>)}</ul></details><AuthoredSources item={g}/></article>)}</section>}
 </div>;
}
