import {lazy,Suspense} from 'react';
import {Link} from 'react-router';
import {AuthoredSources,FlashcardMode,LearnMode} from '../topic-study/AuthoredViews';
import {AssemblyToolCard} from '../shell/PageParts';
import {studyPath} from '../topic-study/AcademicViews';
import type {COTopicContent} from './types';
import type {COStudyProps} from './COStudyMode';
import tools from './tools.json';
import {useI18n} from '../i18n/i18n';
import {assemblyPresetVisualizerPath} from '../assembly-practice/navigation';
import './co.css';
const TopicPractice=lazy(()=>import('../topic-study/TopicPractice').then(m=>({default:m.TopicPractice})));
const Workspace=lazy(()=>import('./Workspace'));
const assemblyLessonPresets={'ds.block.co.t06.frame':'stack-frame','ds.block.co.t06.calls':'function-call'} as const;
export function TopicContent({topic,mode,content}:{content:COTopicContent}&COStudyProps){
 const {t,lt}=useI18n();
 const tool=tools.find(t=>t.topicId===topic.id);
 if(mode==='flashcards')return <FlashcardMode topic={topic} content={content.cards}/>;
 if(mode==='learn'){const blockActions=tool?.id==='assembly'?Object.fromEntries(Object.entries(assemblyLessonPresets).map(([blockId,presetId])=>[blockId,<p><Link className="ds-text-link" to={assemblyPresetVisualizerPath(presetId)}>{t('assembly.exploreExample')}</Link></p>])):undefined;return <>{tool?.id==='assembly'?<AssemblyToolCard/>:tool&&<p className="ds-co-tool-link"><Link className="ds-button" to={studyPath(topic,'practice')+'#co-workspace'}>{t('course.exploreTool',{tool:lt(tool.name)})}</Link></p>}<LearnMode topic={topic} content={content.lesson} blockActions={blockActions}/></>;}
 return <div className="ds-co-practice">
 {tool?.id==='assembly'?<AssemblyToolCard/>:tool&&<Suspense fallback={<p role="status">{t('common.loadingWorkspace')}</p>}><Workspace tool={tool}/></Suspense>}
 <Suspense fallback={<p role="status">{t('common.loadingPractice')}</p>}><TopicPractice topicId={topic.id} hasStudyActivities={content.guided.length>0||Boolean(tool)}/></Suspense>
 {content.guided.length>0&&<section className="ds-section ds-study-reading" aria-labelledby="guided-heading"><h2 id="guided-heading">{t('practice.guided')}</h2><p>{t('practice.guidedBody')}</p>{content.guided.map(g=><article className="ds-lesson-block" key={g.id}><h3>{lt(g.title)}</h3><p>{lt(g.prompt)}</p><details><summary>{t('practice.selfCheck')}</summary><ul>{g.rubric.map((r,i)=><li key={i}>{lt(r)}</li>)}</ul></details><AuthoredSources item={g}/></article>)}</section>}
 </div>;
}
