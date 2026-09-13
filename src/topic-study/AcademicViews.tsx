import { useRef,useState } from 'react';
import { Link } from 'react-router';
import { courses } from '../academic/navigation';
import { topicStudy,mapStructure } from './content';
import type { StudyTopic } from './types';
import {useI18n} from '../i18n/i18n';
export function studyPath(topic:StudyTopic,mode='overview'){const base=`${courses.find(c=>c.subject_id===topic.subjectId)!.path}/${topic.id}`;return mode==='overview'?base:`${base}/${mode}`;}
export function CanonicalLink({id}:{id:string}){
  const topic=topicStudy.topics.find(t=>t.id===id||t.subtopics.some(s=>s.id===id||s.skills.some(k=>k.id===id)));
  if(!topic)return <code>{id}</code>;
  const item=topic.id===id?topic:topic.subtopics.flatMap(s=>[s,...s.skills]).find(s=>s.id===id)!;
  return <Link className="ds-text-link" to={`${studyPath(topic)}${id===topic.id?'':`#${id}`}`}>{item.name}</Link>;
}
export function Prerequisites({ids}:{ids:string[]}){return ids.length?<ul>{ids.map(id=><li key={id}><CanonicalLink id={id}/></li>)}</ul>:<p className="ds-study-muted">No prerequisites listed in the canonical pack.</p>;}
export function Sources({ids,label='Sources and scope'}:{ids:string[];label?:string}){
  return <details className="ds-study-sources"><summary>{label}</summary><ul>{ids.map(id=>{
    const source=topicStudy.sources.find(s=>s.id===id)!;
    return <li key={id}><strong>{source.filename}</strong><p>{source.precision==='DOCUMENT_RANGE'?'This reference covers a broad part of the document.':source.precision==='UNKNOWN'?'An exact supporting page is not recorded.':'An exact source location is recorded.'}</p></li>;
  })}</ul><p>Original PDFs are not included. These references show where the academic scope came from.</p></details>;
}
export function TopicOverview({topic}:{topic:StudyTopic}){
 return <div className="ds-study-overview"><section className="ds-study-intro"><h2>Overview</h2><p>{topic.description}</p><h3>Prerequisite topics</h3><Prerequisites ids={topic.prerequisites}/><Sources ids={topic.sources} label="Source documents"/></section>
 <section aria-labelledby="topic-scope-heading"><h2 id="topic-scope-heading">Subtopics and skills</h2><div className="ds-study-scope">{topic.subtopics.map(sub=><article key={sub.id} id={sub.id} className="ds-study-subtopic"><h3>{sub.name}</h3><h4>Prerequisites</h4><Prerequisites ids={sub.prerequisites}/><ul className="ds-study-skills">{sub.skills.map(skill=><li key={skill.id} id={skill.id}><h4>{skill.name}</h4><p>{skill.description}</p>{skill.prerequisites.length>0&&<><p>Prerequisites</p><Prerequisites ids={skill.prerequisites}/></>}<Sources ids={skill.sources} label={`Sources for ${skill.name}`}/></li>)}</ul><Sources ids={sub.sources} label={`Sources for ${sub.name}`}/></article>)}</div></section></div>;
}
export function MentalMap({topic}:{topic:StudyTopic}){
 const {t}=useI18n();const map=mapStructure(topic);const canvas=useRef<HTMLDivElement>(null);const [reversed,setReversed]=useState(false);const [focused,setFocused]=useState(false);const branches=reversed?[...topic.subtopics].reverse():topic.subtopics;
 const target=(id:string)=>`${studyPath(topic,'learn')}#${id}`;
 function center(){canvas.current?.scrollIntoView({behavior:'smooth',block:'center'});canvas.current?.querySelector<HTMLAnchorElement>('.ds-map-root a')?.focus({preventScroll:true});}
 return <section className={`ds-concept-map${focused?' is-focused':''}`} data-subject={topic.subjectId} aria-labelledby="mental-map-heading"><header className="ds-map-heading"><div><p className="ds-study-eyebrow">{t('learning.visualGuide')}</p><h2 id="mental-map-heading">{t('topic.mentalMap')}</h2><p>{t('learning.mapDescription')}</p></div><div className="ds-map-toolbar" role="toolbar" aria-label={t('learning.mapTools')}><button type="button" onClick={()=>setReversed(value=>!value)}>{t('learning.reorganize')}</button><button type="button" onClick={center}>{t('learning.fitCenter')}</button><button type="button" aria-pressed={focused} onClick={()=>setFocused(value=>!value)}>{t('learning.focusMode')}</button></div></header>
 <div ref={canvas} className="ds-study-map" aria-label={t('learning.canonicalMap')}><div className="ds-map-root"><span>{t('learning.topicNode')}</span><Link to={studyPath(topic,'learn')}>{topic.name}</Link></div><div className="ds-map-trunk" aria-hidden="true"/><ol className="ds-map-branches">{branches.map(sub=><li key={sub.id}><article className="ds-map-node ds-map-subtopic"><span>{t('learning.subtopicNode')}</span><Link to={target(sub.id)}>{sub.name}</Link></article><ol className="ds-map-skills">{sub.skills.map(skill=><li key={skill.id} className="ds-map-node ds-map-skill"><span>{t('learning.skillNode')}</span><Link to={target(skill.id)}>{skill.name}</Link>{skill.prerequisites.length>0&&<small>{t('learning.requires',{count:skill.prerequisites.length})}</small>}</li>)}</ol></li>)}</ol></div>
 <aside className="ds-map-relations" aria-labelledby="map-prerequisites"><h3 id="map-prerequisites">{t('learning.prerequisiteLinks')}</h3>{map.prerequisites.length?<ul>{map.prerequisites.map(e=><li key={e.from+e.to}><CanonicalLink id={e.from}/> <span>{t('learning.isPrerequisiteFor')}</span> <CanonicalLink id={e.to}/></li>)}</ul>:<p>{t('learning.noPrerequisites')}</p>}</aside>
 <nav className="ds-map-actions" aria-label={t('learning.relatedActions')}><Link to={studyPath(topic,'learn')}>{t('topic.learn')}</Link><Link to={studyPath(topic,'flashcards')}>{t('topic.flashcards')}</Link><Link to={studyPath(topic,'practice')}>{t('practice.title')}</Link><Link to={studyPath(topic,'exam-style')}>{t('topic.examStyle')}</Link></nav>
 <details className="ds-study-sources"><summary>{t('learning.textOutline')}</summary><ul>{topic.subtopics.map(sub=><li key={sub.id}>{topic.name} contains {sub.name}<ul>{sub.skills.map(skill=><li key={skill.id}>{skill.name}</li>)}</ul></li>)}</ul></details></section>;
}
