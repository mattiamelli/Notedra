import { Link } from 'react-router';
import { courses } from '../academic/navigation';
import { topicStudy,mapStructure } from './content';
import type { StudyTopic } from './types';
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
    return <li key={id}><strong>{source.filename}</strong><p>{source.documentId} · Provenance confidence: {source.confidence}</p><p>{source.locator} · {source.kind}</p><p>{source.precision==='DOCUMENT_RANGE'?'Broad document-level provenance, not an exact supporting slide or page.':source.precision==='UNKNOWN'?'Source precision is UNKNOWN; no exact page support is claimed.':`Recorded precision: ${source.precision}.`}</p></li>;
  })}</ul><p>Original PDFs are not included. These references locate the academic scope.</p></details>;
}
export function TopicOverview({topic}:{topic:StudyTopic}){
 return <div className="ds-study-overview"><section className="ds-study-intro"><h2>Overview</h2><p>{topic.description}</p><p className="ds-study-muted">Curriculum relevance: {topic.relevance.replaceAll('_',' ')} · Learning state: UNASSESSED</p><h3>Prerequisite topics</h3><Prerequisites ids={topic.prerequisites}/><Sources ids={topic.sources} label="Source documents"/></section>
 <section aria-labelledby="topic-scope-heading"><h2 id="topic-scope-heading">Subtopics and atomic skills</h2><div className="ds-study-scope">{topic.subtopics.map(sub=><article key={sub.id} id={sub.id} className="ds-study-subtopic"><h3>{sub.name}</h3><code className="ds-study-id">{sub.id}</code><h4>Subtopic prerequisites</h4><Prerequisites ids={sub.prerequisites}/><ul className="ds-study-skills">{sub.skills.map(skill=><li key={skill.id} id={skill.id}><h4>{skill.name}</h4><p>{skill.description}</p><code className="ds-study-id">{skill.id}</code>{skill.prerequisites.length>0&&<><p>Skill prerequisites</p><Prerequisites ids={skill.prerequisites}/></>}<Sources ids={skill.sources} label={`Sources for ${skill.name}`}/></li>)}</ul><Sources ids={sub.sources} label={`Sources for ${sub.name}`}/></article>)}</div></section></div>;
}
export function MentalMap({topic}:{topic:StudyTopic}){
 const map=mapStructure(topic);
 return <section><h2>Mental Map</h2><p>Read from topic to subtopics to skills. Lines show containment; prerequisites are listed separately. This map describes the curriculum, not your progress.</p>
 <div className="ds-study-map" aria-label="Canonical topic map"><div className="ds-map-root"><span>Topic</span><strong>{topic.name}</strong></div><ul className="ds-map-branches">{topic.subtopics.map(sub=><li key={sub.id}><div className="ds-map-node"><span>Subtopic</span><CanonicalLink id={sub.id}/></div><ul>{sub.skills.map(skill=><li key={skill.id} className="ds-map-node"><span>Skill</span><CanonicalLink id={skill.id}/></li>)}</ul></li>)}</ul></div>
 <h3>Canonical prerequisites</h3>{map.prerequisites.length?<ul>{map.prerequisites.map(e=><li key={e.from+e.to}><CanonicalLink id={e.from}/> <span>is a prerequisite for</span> <CanonicalLink id={e.to}/></li>)}</ul>:<p>No prerequisite relationships are listed for these nodes.</p>}
 <details className="ds-study-sources"><summary>Text outline of this map</summary><ul>{topic.subtopics.map(sub=><li key={sub.id}>{topic.name} contains {sub.name}<ul>{sub.skills.map(skill=><li key={skill.id}>{skill.name} <code>{skill.id}</code></li>)}</ul></li>)}</ul></details></section>;
}
