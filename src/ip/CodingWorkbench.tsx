import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {CanonicalLink,Sources} from '../topic-study/AcademicViews';
import {EvidenceView} from '../enrichment/EvidenceView';
import type {IPAssignment,IPReference} from './types';
const references=import.meta.glob<IPReference>('./references/*.json',{import:'default'});
export default function CodingWorkbench({assignment}:{assignment:IPAssignment}){
 const [drafts,setDrafts]=useState(()=>assignment.starterFiles.map(f=>f.content));const [active,setActive]=useState(0);
 const [reference,setReference]=useState<IPReference|null>(null);const [solution,setSolution]=useState(false);const [tests,setTests]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 const generation=useRef(0);
 useEffect(()=>()=>{generation.current++;},[]);
 const file=assignment.starterFiles[active];
 async function reveal(kind:'solution'|'tests'){
  if(kind==='solution'&&solution){setSolution(false);return;}if(kind==='tests'&&tests){setTests(false);return;}
  const operationGeneration=generation.current;setBusy(true);setMessage('');
  try{
   let data=reference;
   if(!data){const key=assignment.referenceId.replace('ds.reference.ip.','');const load=references[`./references/${key}.json`];if(!load)throw new Error('Reference unavailable.');data=await load();
    if(data.assignmentId!==assignment.id||data.id!==assignment.referenceId||data.version!==assignment.version)throw new Error('Original reference version unavailable.');
    if(operationGeneration!==generation.current)return;
    setReference(data);
   }
   if(kind==='solution')setSolution(true);else setTests(true);
  }catch{if(operationGeneration===generation.current)setMessage('The reference could not be loaded. Your working code is unchanged. Try revealing it again.');}finally{if(operationGeneration===generation.current)setBusy(false);}
 }
 async function copy(){const operationGeneration=generation.current;try{await navigator.clipboard.writeText(drafts[active]);if(operationGeneration===generation.current)setMessage(`Copied ${file.name}.`);}catch{if(operationGeneration===generation.current)setMessage('Clipboard access was unavailable. Select the code and copy it with your keyboard.');}}
 function reset(){generation.current++;setDrafts(assignment.starterFiles.map(f=>f.content));setActive(0);setSolution(false);setTests(false);setBusy(false);setMessage('All starter files restored.');}
 function move(event:KeyboardEvent<HTMLButtonElement>,index:number){
  const length=assignment.starterFiles.length;let next=index;
  if(event.key==='ArrowRight')next=(index+1)%length;else if(event.key==='ArrowLeft')next=(index+length-1)%length;else if(event.key==='Home')next=0;else if(event.key==='End')next=length-1;else return;
  event.preventDefault();setActive(next);document.getElementById(`ip-file-${next}`)?.focus();
 }
 return <article className="ds-ip-workbench" aria-labelledby="ip-workbench-title"><p className="ds-study-eyebrow">Coding workbench · unscored self-check · {assignment.minutes} minutes</p><h3 id="ip-workbench-title">{assignment.title}</h3>
 <p className="ds-ip-boundary">Drafts stay on this page only. Copy each file before changing task, navigating or reloading. Java code is not executed or automatically graded here. No tests have been run on your answer.</p>
 {assignment.instructions.map((p,i)=><p key={i}>{p}</p>)}<h4>Requirements</h4><ol>{assignment.requirements.map(r=><li key={r.id}><strong>{r.id}</strong> — {r.text}</li>)}</ol>
 <div className="ds-ip-files" role="tablist" aria-label="Starter files">{assignment.starterFiles.map((f,i)=><button key={f.name} id={`ip-file-${i}`} role="tab" aria-selected={active===i} aria-controls="ip-code-panel" tabIndex={active===i?0:-1} onClick={()=>{setActive(i);setMessage('');}} onKeyDown={e=>move(e,i)}>{f.name}</button>)}</div>
 <div role="tabpanel" id="ip-code-panel" aria-labelledby={`ip-file-${active}`}><label htmlFor="ip-source-editor">Working file: {file.name}</label><textarea id="ip-source-editor" className="ds-ip-editor" rows={18} spellCheck={false} autoCapitalize="off" autoComplete="off" maxLength={30000} wrap="soft" value={drafts[active]} onChange={e=>{setDrafts(d=>d.map((s,i)=>i===active?e.target.value:s));setMessage('');}}/></div>
 <div className="ds-storage-actions"><button className="ds-button" onClick={()=>void copy()}>Copy current file</button><button className="ds-button" onClick={reset}>Reset starter files</button><button className="ds-button" disabled={busy} aria-expanded={tests} aria-controls="ip-reference-tests" onClick={()=>void reveal('tests')}>{tests?'Hide':'Reveal'} test specifications</button><button className="ds-button ds-practice-primary" disabled={busy} aria-expanded={solution} aria-controls="ip-reference-solution" onClick={()=>void reveal('solution')}>{solution?'Hide':'Reveal'} reference solution</button></div>
 <p role="status">{busy?'Loading reference…':message}</p><p>Try an implementation before revealing a reference. Multiple correct implementations and test suites are possible.</p>
 <h4>Component self-check</h4><p>Use each criterion to review a requirement. This checklist does not verify your code or award skill correctness.</p><ul>{assignment.rubric.map(r=><li key={r.id}><strong>{r.id}</strong> — {r.text}<small>Requirements: {r.requirementIds.join(', ')} · Test specifications: {r.testIds.join(', ')}</small><details><summary>Component skills</summary>{r.skillIds.map(id=><p key={id}><CanonicalLink id={id}/></p>)}</details></li>)}</ul>
 <section id="ip-reference-tests" hidden={!tests}>{reference&&<><h4>Reference test specifications · not executed on your code</h4>{reference.tests.map(t=><article key={t.id}><h5>{t.id} · {t.name}</h5><p>{t.description}</p><p>Expected: {t.expected}</p><small>Requirements: {t.requirementIds.join(', ')}</small></article>)}</>}</section>
 <section id="ip-reference-solution" hidden={!solution}>{reference&&<><h4>One reference implementation</h4>{reference.reasoning.map((p,i)=><p key={i}>{p}</p>)}{reference.files.map(f=><details key={f.name} open><summary>{f.name}</summary><pre><code>{f.content}</code></pre></details>)}</>}</section>
 <Sources ids={assignment.sourceIds}/><EvidenceView ids={assignment.evidenceIds}/><p className="ds-study-muted">{assignment.id} · version {assignment.version}. Integrated work stays integrated; revealing a solution does not imply mastery of its component skills.</p>
 </article>;
}
