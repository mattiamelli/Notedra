import { useState } from 'react';
import { Link } from 'react-router';
import { cardsFor,lessonFor,shuffledIds } from './content';
import { CanonicalLink,Sources,studyPath } from './AcademicViews';
import type { AuthoredScope,StudyTopic,Lesson,Flashcard } from './types';
import { EmptyState } from '../shell/PageParts';
export function AuthoredSources({item}:{item:AuthoredScope}){return <div className="ds-authored-scope"><Sources ids={item.sourceIds}/><details><summary>Target skills</summary><ul>{item.skillIds.map(id=><li key={id}><CanonicalLink id={id}/></li>)}</ul><p>Authored content {item.id} · Version {item.version}</p></details></div>;}
export function LearnMode({topic,content}:{topic:StudyTopic;content?:Lesson}){
 const lesson=content??lessonFor(topic.id);
 if(!lesson)return <EmptyState title="Guided learning is not available yet"><p>Explore this topic’s canonical Overview and Mental Map. A guided lesson has not been authored for this topic.</p></EmptyState>;
 return <section className="ds-study-reading"><h2>Learn</h2><p className="ds-study-muted">Authored DelftStudy learning content · Version {lesson.version}. Explanations are not official TU Delft wording.</p><nav aria-label="Lesson sections" className="ds-lesson-outline"><ol>{lesson.blocks.map(b=><li key={b.id}><a href={`#${b.id}`}>{b.title}</a></li>)}</ol></nav>
 {lesson.blocks.map(block=><article className={`ds-lesson-block ds-lesson-${block.kind}`} key={block.id} id={block.id}><p className="ds-study-eyebrow">{block.kind.replaceAll('_',' ')}</p><h3>{block.title}</h3>{block.paragraphs.map((p,i)=><p key={i}>{p}</p>)}{block.code&&<pre aria-label={`Java example: ${block.title}`}><code>{block.code}</code></pre>}{block.table&&<div className="ds-study-table-wrap"><table><caption>{block.title} — reference table</caption><thead><tr>{block.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{block.table.rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}<AuthoredSources item={block}/></article>)}
 <div className="ds-study-next"><h3>Put the ideas to work</h3><Link className="ds-button" to={studyPath(topic,'flashcards')}>Review flashcards</Link><Link className="ds-button ds-practice-primary" to={studyPath(topic,'practice')}>Open topic Practice</Link></div></section>;
}
export function FlashcardMode({topic,content}:{topic:StudyTopic;content?:Flashcard[]}){
 const cards=content??cardsFor(topic.id);const initial=cards.map(c=>c.id);
 const [order,setOrder]=useState(initial);const [position,setPosition]=useState(0);const [revealed,setRevealed]=useState(false);
 const card=cards.find(c=>c.id===order[position]);
 if(!card)return <EmptyState title="Flashcards are not available yet"><p>No authored cards are available for this topic. Use its Overview and Mental Map to explore the academic scope.</p></EmptyState>;
 const move=(delta:number)=>{setPosition(p=>(p+delta+order.length)%order.length);setRevealed(false);};
 return <section className="ds-study-reading"><h2>Flashcards</h2><p>Authored study cards. Revealing an answer does not measure mastery or schedule a review.</p>
 <p role="status" className="ds-card-position">Card {position+1} of {cards.length}</p><article className="ds-study-card" aria-labelledby="card-prompt"><span className="ds-study-eyebrow">Recall, then reveal</span><h3 id="card-prompt">{card.prompt}</h3><button className="ds-button ds-practice-primary" aria-expanded={revealed} aria-controls="card-answer" onClick={()=>setRevealed(v=>!v)}>{revealed?'Hide answer':'Reveal answer'}</button><div id="card-answer" hidden={!revealed}><h4>Answer</h4><p>{card.answer}</p></div><p className="ds-study-id">{card.id} · v{card.version}</p></article>
 <div className="ds-card-controls"><button className="ds-button" onClick={()=>move(-1)}>Previous card</button><button className="ds-button" onClick={()=>move(1)}>Next card</button><button className="ds-button" onClick={()=>{setOrder(shuffledIds(initial));setPosition(0);setRevealed(false);}}>Shuffle cards</button><button className="ds-button" onClick={()=>{setOrder(initial);setPosition(0);setRevealed(false);}}>Reset order</button></div><AuthoredSources item={card}/><Link className="ds-text-link" to={studyPath(topic,'practice')}>Continue to Practice →</Link></section>;
}
