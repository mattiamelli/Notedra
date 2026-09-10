import {Link} from 'react-router';
import {courses} from '../academic/navigation';
import {useProgress} from './useProgress';
import {MasteryCard,ReadinessCard} from './IndexCard';
import './progress.css';
export default function ProgressSummary({courseId,topicId}:{courseId?:string;topicId?:string}){
 const {result,message}=useProgress();
 if(!result)return <p role="status">{message}</p>;
 if(topicId){const topic=result.topics.find(t=>t.id===topicId)!;return <section className="progress-summary" aria-label="Topic learning evidence"><MasteryCard value={topic}/><p>{topic.missing.length} skills need evidence. {topic.review.length?`Review: ${topic.review.join('; ')}`:'No recent eligible mistakes recorded.'}</p><Link to={`/progress?course=${courseId}&topic=${topicId}`}>Explore skill evidence →</Link></section>;}
 return <section className="progress-summary" aria-label="Learning and exam evidence"><h2>Your evidence, in context</h2><p>Local, deterministic study indices—not grades or pass predictions. Missing evidence stays unknown.</p>{courses.filter(c=>!courseId||c.subject_id===courseId).map(c=><article key={c.subject_id}><h3>{c.name}</h3><div className="progress-grid"><MasteryCard value={result.courses.find(v=>v.id===c.subject_id)!}/><ReadinessCard value={result.readiness.find(v=>v.courseId===c.subject_id)!}/></div><p>{result.courses.find(v=>v.id===c.subject_id)!.missing.length} skills still need learning evidence.</p><p>Recent mistakes to review: {result.courses.find(v=>v.id===c.subject_id)!.review.join('; ')||'None recorded'}. Exam evidence gaps are listed under Why this readiness index.</p><Link to={`/progress?course=${c.subject_id}`}>Explore evidence and gaps →</Link> · <Link to={`/study-plan?course=${c.subject_id}`}>Choose a next activity →</Link></article>)}</section>;
}
