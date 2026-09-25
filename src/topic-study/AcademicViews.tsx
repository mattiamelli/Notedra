import { useRef,useState } from 'react';
import { Link } from 'react-router';
import { courses } from '../academic/navigation';
import { topicStudy,mapStructure,overviewIntroduction } from './content';
import type { StudyTopic } from './types';
import {useI18n} from '../i18n/i18n';
export function studyPath(topic:StudyTopic,mode='overview'){const base=`${courses.find(c=>c.subject_id===topic.subjectId)!.path}/${topic.id}`;return mode==='overview'?base:`${base}/${mode}`;}
export function CanonicalLink({id}:{id:string}){
  const {lt}=useI18n();
  const topic=topicStudy.topics.find(t=>t.id===id||t.subtopics.some(s=>s.id===id||s.skills.some(k=>k.id===id)));
  if(!topic)return <code>{id}</code>;
  const item=topic.id===id?topic:topic.subtopics.flatMap(s=>[s,...s.skills]).find(s=>s.id===id)!;
  return <Link className="ds-text-link" to={`${studyPath(topic)}${id===topic.id?'':`#${id}`}`}>{id===topic.id?topic.name:lt(item.name)}</Link>;
}
export function Prerequisites({ids}:{ids:string[]}){const {t}=useI18n();return ids.length?<ul>{ids.map(id=><li key={id}><CanonicalLink id={id}/></li>)}</ul>:<p className="ds-study-muted">{t('learning.noCanonicalPrerequisites')}</p>;}
export function Sources({ids,label}:{ids:string[];label?:string}){
  const {t}=useI18n();
  return <details className="ds-study-sources"><summary>{label??t('learning.sourcesScope')}</summary><ul>{ids.map(id=>{
    const source=topicStudy.sources.find(s=>s.id===id)!;
    return <li key={id}><strong>{source.filename}</strong>{source.kind==='DOCUMENT_SECTION'&&<p>{source.locator}</p>}<p>{t(source.precision==='DOCUMENT_RANGE'?'learning.sourceBroad':source.precision==='UNKNOWN'?'learning.sourceUnknown':'learning.sourceExact')}</p></li>;
  })}</ul><p>{t('learning.sourcesNote')}</p></details>;
}
export function TopicOverview({topic}:{topic:StudyTopic}){
 const {t,lt}=useI18n();const introduction=overviewIntroduction(topic.id);
 const paragraphs=introduction?.paragraphs??[topic.description,topic.relevance];
 return <div className="ds-study-overview"><section className="ds-study-intro"><p className="ds-study-eyebrow">{t('learning.introduction')}</p><h2>{t('topic.overview')}</h2><div className="ds-overview-copy">{paragraphs.map((paragraph,index)=><p key={index}>{lt(paragraph)}</p>)}</div><Sources ids={introduction?.sourceIds.length?introduction.sourceIds:topic.sources} label={t('learning.sourceDocuments')}/></section></div>;
}
type MapPoint={x:number;y:number};
type MapBranch={subtopic:StudyTopic['subtopics'][number];point:MapPoint;skills:Array<{skill:StudyTopic['subtopics'][number]['skills'][number];point:MapPoint}>};
function mapAngles(count:number){if(count===1)return [-18];if(count===2)return [-155,25];if(count===3)return [-145,-25,95];if(count===4)return [-140,-50,40,130];return Array.from({length:count},(_,i)=>-150+i*(300/(count-1)));}
function point(angle:number,xRadius:number,yRadius:number):MapPoint{const radians=angle*Math.PI/180;return{x:500+Math.cos(radians)*xRadius,y:320+Math.sin(radians)*yRadius};}
function mapLayout(topic:StudyTopic,reorganized:boolean):MapBranch[]{
 const subtopics=reorganized?[...topic.subtopics].reverse():topic.subtopics;const rotation=reorganized?22:0;
 return subtopics.map((subtopic,index)=>{const angle=mapAngles(subtopics.length)[index]+rotation,branch=point(angle,285,178);const count=subtopic.skills.length;
  const skills=subtopic.skills.map((skill,skillIndex)=>{const spread=count===1?0:(skillIndex-(count-1)/2)*22;const raw=point(angle+spread,410,270);return{skill,point:{x:Math.max(64,Math.min(936,raw.x)),y:Math.max(52,Math.min(588,raw.y))}};});
  return{subtopic,point:branch,skills};
 });
}
function curve(from:MapPoint,to:MapPoint){const dx=to.x-from.x,dy=to.y-from.y;return`M ${from.x} ${from.y} C ${from.x+dx*.42} ${from.y+dy*.08}, ${to.x-dx*.28} ${to.y-dy*.08}, ${to.x} ${to.y}`;}
export function MentalMap({topic}:{topic:StudyTopic}){
 const {t,lt}=useI18n();const map=mapStructure(topic);const canvas=useRef<HTMLDivElement>(null);const [reversed,setReversed]=useState(false);const [focused,setFocused]=useState(false);const branches=mapLayout(topic,reversed);const root={x:500,y:320};
 const target=(id:string)=>`${studyPath(topic,'learn')}#${id}`;
 function center(){canvas.current?.scrollIntoView({behavior:'smooth',block:'center'});canvas.current?.querySelector<HTMLAnchorElement>('.ds-map-root a')?.focus({preventScroll:true});}
 return <section className={`ds-concept-map${focused?' is-focused':''}`} data-subject={topic.subjectId} aria-labelledby="mental-map-heading"><header className="ds-map-heading"><div><p className="ds-study-eyebrow">{t('learning.visualGuide')}</p><h2 id="mental-map-heading">{t('topic.mentalMap')}</h2><p>{t('learning.mapDescription')}</p></div><div className="ds-map-toolbar" role="toolbar" aria-label={t('learning.mapTools')}><button type="button" onClick={()=>setReversed(value=>!value)}>{t('learning.reorganize')}</button><button type="button" onClick={center}>{t('learning.fitCenter')}</button><button type="button" aria-pressed={focused} onClick={()=>setFocused(value=>!value)}>{t('learning.focusMode')}</button></div></header>
 <div ref={canvas} className="ds-study-map" aria-label={t('learning.canonicalMap')}><svg className="ds-map-connectors" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">{branches.map(branch=><g key={branch.subtopic.id}><path className="ds-map-main-branch" d={curve(root,branch.point)}/>{branch.skills.map(({skill,point})=><path className="ds-map-skill-branch" key={skill.id} d={curve(branch.point,point)}/>)}</g>)}</svg><div className="ds-map-root"><span>{t('learning.topicNode')}</span><Link to={studyPath(topic,'learn')}>{topic.name}</Link></div><div className="ds-map-nodes">{branches.flatMap((branch,branchIndex)=>[<article className="ds-map-node ds-map-subtopic" data-branch={branchIndex} key={branch.subtopic.id} style={{left:`${branch.point.x/10}%`,top:`${branch.point.y/6.4}%`}}><span>{t('learning.subtopicNode')}</span><Link to={target(branch.subtopic.id)}>{lt(branch.subtopic.name)}</Link></article>,...branch.skills.map(({skill,point})=><article className="ds-map-node ds-map-skill" data-branch={branchIndex} key={skill.id} style={{left:`${point.x/10}%`,top:`${point.y/6.4}%`}}><span>{t('learning.skillNode')}</span><Link to={target(skill.id)}>{lt(skill.name)}</Link>{skill.prerequisites.length>0&&<small>{t('learning.requires',{count:skill.prerequisites.length})}</small>}</article>)])}</div></div>
 <aside className="ds-map-relations" aria-labelledby="map-prerequisites"><h3 id="map-prerequisites">{t('learning.prerequisiteLinks')}</h3>{map.prerequisites.length?<ul>{map.prerequisites.map(e=><li key={e.from+e.to}><CanonicalLink id={e.from}/> <span>{t('learning.isPrerequisiteFor')}</span> <CanonicalLink id={e.to}/></li>)}</ul>:<p>{t('learning.noPrerequisites')}</p>}</aside>
 <nav className="ds-map-actions" aria-label={t('learning.relatedActions')}><Link to={studyPath(topic,'learn')}>{t('topic.learn')}</Link><Link to={studyPath(topic,'flashcards')}>{t('topic.flashcards')}</Link><Link to={studyPath(topic,'practice')}>{t('practice.title')}</Link><Link to={studyPath(topic,'exam-style')}>{t('topic.examStyle')}</Link></nav>
 <details className="ds-study-sources"><summary>{t('learning.textOutline')}</summary><ul>{topic.subtopics.map(sub=><li key={sub.id}>{t('learning.contains',{topic:topic.name,subtopic:lt(sub.name)})}<ul>{sub.skills.map(skill=><li key={skill.id}>{lt(skill.name)}</li>)}</ul></li>)}</ul></details></section>;
}
