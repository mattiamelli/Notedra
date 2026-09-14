import { useState } from 'react';
import { Link } from 'react-router';
import { cardsFor,lessonFor,shuffledIds } from './content';
import { CanonicalLink,Sources,studyPath } from './AcademicViews';
import type { AuthoredScope,StudyTopic,Lesson,Flashcard } from './types';
import { EmptyState } from '../shell/PageParts';
import {useI18n} from '../i18n/i18n';
import type {MessageKey} from '../i18n/messages';
import type {BlockKind,LessonBlock} from './types';
export function AuthoredSources({item}:{item:AuthoredScope}){const {t}=useI18n();return <div className="ds-authored-scope"><Sources ids={item.sourceIds}/><details><summary>{t('learning.skillsCovered')}</summary><ul>{item.skillIds.map(id=><li key={id}><CanonicalLink id={id}/></li>)}</ul></details></div>;}
const kindKeys:Record<BlockKind,MessageKey>={introduction:'learning.introduction',concept:'learning.concept',procedure:'learning.procedure',worked_example:'learning.workedExample',important_rule:'learning.importantRule',common_pitfall:'learning.commonPitfall',code_example:'learning.codeExample',recap:'learning.recap'};
function LessonSection({block,anchorIds}:{block:LessonBlock;anchorIds:string[]}){
 const {t,lt}=useI18n();const takeaway=['important_rule','recap'].includes(block.kind)&&block.paragraphs.length>1?block.paragraphs.at(-1):null;const paragraphs=takeaway?block.paragraphs.slice(0,-1):block.paragraphs;
 return <article className={`ds-lesson-block ds-lesson-${block.kind}`} id={block.id} aria-labelledby={`${block.id}-title`}>{anchorIds.map(id=><span className="ds-learning-anchor" id={id} key={id} aria-hidden="true"/>)}<p className="ds-study-eyebrow">{t(kindKeys[block.kind])}</p><h3 id={`${block.id}-title`}>{lt(block.title)}</h3><div className="ds-lesson-copy">{paragraphs.map((p,i)=><p key={i}>{lt(p)}</p>)}</div>{block.code&&<pre aria-label={`Java example: ${block.title}`}><code>{block.code}</code></pre>}{block.table&&<div className="ds-study-table-wrap"><table><caption>{block.title} — reference table</caption><thead><tr>{block.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{block.table.rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}{takeaway&&<aside className="ds-key-takeaway"><strong>{t('learning.keyTakeaway')}</strong><p>{lt(takeaway)}</p></aside>}<AuthoredSources item={block}/></article>;
}
export function LearnMode({topic,content}:{topic:StudyTopic;content?:Lesson}){
 const {t,lt}=useI18n();
 const lesson=content??lessonFor(topic.id);
 if(!lesson)return <EmptyState title="Guided learning is not available yet"><p>Explore this topic’s canonical Overview and Mental Map. A guided lesson has not been authored for this topic.</p></EmptyState>;
 const introduction=lesson.blocks.find(block=>block.kind==='introduction');const sections=lesson.blocks.filter(block=>block!==introduction);const anchors=new Map<string,string[]>();
 for(const id of topic.subtopics.flatMap(subtopic=>[subtopic.id,...subtopic.skills.map(skill=>skill.id)])){const block=sections.find(item=>item.subtopicIds.includes(id)||item.skillIds.includes(id));if(block)anchors.set(block.id,[...(anchors.get(block.id)??[]),id]);}
 return <section className="ds-study-reading"><header className="ds-learn-intro ds-lesson-block ds-lesson-introduction" id={introduction?.id}><p className="ds-study-eyebrow">{t('topic.learn')}</p><h2>{t('learning.learnTopic',{topic:topic.name})}</h2>{introduction&&<h3>{lt(introduction.title)}</h3>}{(introduction?.paragraphs??[topic.description,topic.relevance]).slice(0,2).map((p,i)=><p key={i}>{lt(p)}</p>)}<div className="ds-key-concepts"><strong>{t('learning.keyConcepts')}</strong><ul>{topic.subtopics.map(subtopic=><li key={subtopic.id}>{lt(subtopic.name)}</li>)}</ul></div>{introduction&&<AuthoredSources item={introduction}/>}</header>
 <nav aria-label={t('learning.lessonSections')} className="ds-lesson-outline"><strong>{t('learning.inThisLesson')}</strong><ol>{sections.map(b=><li key={b.id}><a href={`#${b.id}`}>{lt(b.title)}</a></li>)}</ol></nav>
 {sections.map(block=><LessonSection block={block} anchorIds={anchors.get(block.id)??[]} key={block.id}/>)}
 <p className="ds-study-provenance">{t('learning.provenance',{version:lesson.version})}</p><div className="ds-study-next"><h3>{t('learning.putToWork')}</h3><Link className="ds-button" to={studyPath(topic,'flashcards')}>{t('learning.reviewFlashcards')}</Link><Link className="ds-button ds-practice-primary" to={studyPath(topic,'practice')}>{t('learning.openPractice')}</Link></div></section>;
}
export function FlashcardMode({topic,content}:{topic:StudyTopic;content?:Flashcard[]}){
 const {t,lt}=useI18n();
 const cards=content??cardsFor(topic.id);const initial=cards.map(c=>c.id);
 const [order,setOrder]=useState(initial);const [position,setPosition]=useState(0);const [revealed,setRevealed]=useState(false);
 const card=cards.find(c=>c.id===order[position]);
 if(!card)return <EmptyState title={t('flashcards.unavailable')}><p>{t('flashcards.unavailableBody')}</p></EmptyState>;
 const move=(delta:number)=>{setPosition(p=>(p+delta+order.length)%order.length);setRevealed(false);};
 const percent=((position+1)/cards.length)*100;
 return <section className="ds-study-reading ds-flashcards"><header className="ds-flashcard-heading"><div><p className="ds-study-eyebrow">{t('flashcards.studySession')}</p><h2>{t('topic.flashcards')}</h2><p>{t('flashcards.description')}</p></div><p role="status" className="ds-card-position">{t('flashcards.position',{current:position+1,total:cards.length})}</p></header><div className="ds-flashcard-progress" role="progressbar" aria-label={t('flashcards.progress')} aria-valuemin={1} aria-valuemax={cards.length} aria-valuenow={position+1}><span style={{width:`${percent}%`}}/></div>
 <article className={`ds-study-card${revealed?' is-revealed':''}`} aria-labelledby="card-prompt"><button type="button" className="ds-flashcard-flip" aria-pressed={revealed} aria-label={revealed?t('flashcards.showFront'):t('flashcards.showBack')} onClick={()=>setRevealed(value=>!value)}><span className="ds-flashcard-face ds-flashcard-front" aria-hidden={revealed}><small>{t('flashcards.front')}</small><strong id="card-prompt">{lt(card.prompt)}</strong><em>{t('flashcards.tapToFlip')}</em></span><span className="ds-flashcard-face ds-flashcard-back" id="card-answer" aria-hidden={!revealed}><small>{t('flashcards.back')}</small><strong>{lt(card.answer)}</strong><em>{t('flashcards.tapToReturn')}</em></span></button></article>
 <div className="ds-card-controls"><button className="ds-button" onClick={()=>move(-1)}>← {t('flashcards.previous')}</button><button className="ds-button ds-practice-primary" onClick={()=>move(1)}>{t('flashcards.next')} →</button><button className="ds-button ds-card-utility" onClick={()=>{setOrder(shuffledIds(initial));setPosition(0);setRevealed(false);}}>{t('flashcards.shuffle')}</button><button className="ds-button ds-card-utility" onClick={()=>{setOrder(initial);setPosition(0);setRevealed(false);}}>{t('flashcards.reset')}</button></div><AuthoredSources item={card}/><Link className="ds-text-link" to={studyPath(topic,'practice')}>{t('flashcards.continue')} →</Link></section>;
}
