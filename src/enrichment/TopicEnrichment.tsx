import {useState} from 'react';
import cards from './cards.json';
import cues from './cues.json';
import guides from './guided.json';
import {StudyCues} from './StudyCues';
import {EvidenceView} from './EvidenceView';
import type {GuidedSupplement} from './types';
import type {StudyMode} from '../topic-study/types';
import './enrichment.css';
export default function TopicEnrichment({topicId,mode}:{topicId:string;mode:StudyMode}){
 if(mode==='flashcards'){
  const selected=cards.filter(c=>c.topicId===topicId);if(!selected.length)return null;
  return <section className="ds-study-reading ds-enrichment" aria-label="Supplemental flashcards"><h2>Distinctions worth remembering</h2><p>{selected.length} additional study cards. The published deck above stays unchanged. Answers and self-checks are not saved or scored.</p>{selected.map(c=><article className="ds-lesson-block" key={c.id}><h3>{c.prompt}</h3><details><summary>Reveal supplemental answer</summary><p>{c.answer}</p></details><EvidenceView ids={c.evidenceIds}/></article>)}</section>;
 }
 if(mode==='mental-map'){
  const selected=cues.filter(c=>c.topicId===topicId);if(!selected.length)return null;
  return <StudyCues cues={selected}/>;
 }
 if(mode==='practice'){
  const selected=guides.filter(g=>g.topicId===topicId);return selected.length?<section className="ds-study-reading ds-enrichment" aria-label="Supplemental guided self-check"><h2>Guided self-check / rubric</h2><p>Open reasoning has no automatic grade. Different valid approaches are welcome.</p>{selected.map(g=><Guided key={g.id} item={g}/>)}</section>:null;
 }
 return null;
}
function Guided({item}:{item:GuidedSupplement}){
 const [answer,setAnswer]=useState('');const [show,setShow]=useState(false);
 return <article className="ds-lesson-block"><h3>{item.title}</h3><p>{item.prompt}</p><label htmlFor={item.id}>Your reasoning<textarea id={item.id} rows={5} maxLength={8000} value={answer} onChange={e=>setAnswer(e.target.value)}/></label><p>Temporary notes only. Copy before leaving; nothing here is graded or saved as evidence.</p><div className="ds-storage-actions"><button className="ds-button" aria-expanded={show} aria-controls={item.id+'-rubric'} disabled={!answer.trim()} onClick={()=>setShow(v=>!v)}>{show?'Hide self-check':'Reveal self-check and reference'}</button><button className="ds-button" onClick={()=>{setAnswer('');setShow(false);}}>Reset reasoning</button></div><div id={item.id+'-rubric'} hidden={!show}><h4>What a valid solution must establish</h4><ul>{item.conditions.map(c=><li key={c}>{c}</li>)}</ul><h4>Common failure modes — check your own reasoning</h4><ul>{item.pitfalls.map(c=><li key={c}>{c}</li>)}</ul><h4>One valid reference approach</h4>{item.reference.map(c=><p key={c}>{c}</p>)}<p>This reference does not reject alternative solutions. No automatic correctness or numeric score is assigned.</p></div><EvidenceView ids={item.evidenceIds}/></article>;
}
