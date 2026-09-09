import { Link } from 'react-router';
import { catalog,exercisePath,attemptPath } from '../practice/catalog';
import { resolveAttempt } from '../practice/service';
import { useLearning } from '../learning/LearningProvider';
import { EmptyState } from '../shell/PageParts';
export function TopicPractice({topicId}:{topicId:string}){
 const learning=useLearning();const exercises=catalog.filter(e=>e.topicId===topicId);
 if(!exercises.length)return <EmptyState title="Topic practice is not available yet"><p>No authored exercises are available for this topic.</p></EmptyState>;
 return <section><h2>Practice</h2><p>Two authored exercises from the shared Practice catalog. Saved work opens in the same runner; these are not official exam questions.</p><div className="ds-practice-grid">{exercises.map(exercise=>{
 const attempts=learning?.snapshot?.data.attempts.filter(a=>a.templateRef===exercise.id&&a.topicId===topicId)??[];
 return <article className="ds-practice-card" key={exercise.id}><h3>{exercise.title}</h3><Link className="ds-button" to={exercisePath(exercise)}>Open exercise<span className="sr-only">: {exercise.title}</span></Link>{attempts.length>0&&<ul>{[...attempts].reverse().map(a=><li key={a.attemptId}><Link className="ds-text-link" to={attemptPath(exercise,a.attemptId)}>{resolveAttempt(a).status!=='AVAILABLE'?'Original version unavailable':a.status==='DRAFT'?'Resume draft':a.status==='SUBMITTED'?'Review submission':'View saved attempt'} · {new Date(a.createdAt).toLocaleString()}</Link></li>)}</ul>}</article>;
 })}</div><Link className="ds-text-link" to="/practice">Open full Practice catalog</Link></section>;
}
