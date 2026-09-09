import {lazy,Suspense} from 'react';
import type {RLTool} from './types';
const Proposition=lazy(()=>import('./PropositionWorkspace'));
const Fol=lazy(()=>import('./FolWorkspace'));
const Recurrence=lazy(()=>import('./RecurrenceWorkspace'));
const TreeGraph=lazy(()=>import('./TreeGraphWorkspace'));
const Sets=lazy(()=>import('./SetsWorkspace'));
const Relations=lazy(()=>import('./RelationsWorkspace'));
export default function Workspace({tool}:{tool:RLTool}){
 return <section id="rl-workspace" className="ds-rl-workspace" aria-labelledby="rl-workspace-title"><h2 id="rl-workspace-title">{tool.name}</h2><p>{tool.summary}</p><p className="ds-rl-assumptions">{tool.assumptions}</p><Suspense fallback={<p role="status">Loading learning workspace…</p>}>
 {tool.id==='proposition'&&<Proposition/>}{tool.id==='finite-model'&&<Fol/>}{tool.id==='induction'&&<Recurrence/>}{tool.id==='tree-graph'&&<TreeGraph/>}{tool.id==='sets'&&<Sets/>}{tool.id==='functions-relations'&&<Relations/>}{tool.id==='proof'&&<p>Use the structured writing fields in Guided reasoning below. Each activity separates the logical obligations and provides reference reasoning. No text is automatically judged as a proof.</p>}
 </Suspense><p className="ds-study-muted">Local exploration only. Workspace changes are not saved as Practice attempts or learning evidence.</p></section>;
}
