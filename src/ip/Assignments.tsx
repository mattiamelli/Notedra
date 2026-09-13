import {lazy,Suspense} from 'react';
import {Link,useSearchParams} from 'react-router';
import index from './assignment-index.json';
import type {IPAssignment} from './types';
const files=import.meta.glob<IPAssignment>('./assignments/*.json',{import:'default'});
const views=Object.fromEntries(Object.entries(files).map(([path,load])=>[path,lazy(async()=>{
 const [assignment,module]=await Promise.all([load(),import('./CodingWorkbench')]);
 return {default:()=> <module.default assignment={assignment}/>};
})]));
export default function Assignments({topicId,examOnly=false}:{topicId:string;examOnly?:boolean}){
 const [params]=useSearchParams();const options=index.filter(a=>a.relatedTopicIds.includes(topicId)&&(!examOnly||a.minutes===60));
 const selected=options.find(a=>a.id===params.get('task'));const View=selected?views[`./assignments/${selected.file}`]:undefined;
 return <section className="ds-section ds-ip-assignments" aria-labelledby="ip-assignments-title"><h2 id="ip-assignments-title">{examOnly?'Authored exam-style practice':'Coding practice · 15 / 30 / 60 minutes'}</h2><p>Original Notedra tasks. Suggested time is a practice design choice, not official exam timing. Work through requirements and review component evidence; there is no overall score.</p>
 {options.length?<ul className="ds-ip-task-list">{options.map(a=><li key={a.id}><Link className="ds-button" aria-current={selected?.id===a.id?'page':undefined} to={`?task=${encodeURIComponent(a.id)}`}><span>{a.minutes} min</span>{a.title}</Link></li>)}</ul>:<p>{examOnly?'No authored 60-minute assignment targets this topic. Use its Practice mode for focused training.':'No coding assignment is mapped to this topic. Use the fixed predictions and guided practice below.'}</p>}
 {params.has('task')&&!selected&&<p role="status">That assignment is not available in this topic and mode. Choose a listed task.</p>}
 {View&&<Suspense fallback={<p role="status">Loading coding workbench…</p>}><View key={selected!.id}/></Suspense>}
 </section>;
}
