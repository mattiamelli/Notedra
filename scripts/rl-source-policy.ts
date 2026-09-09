import {readFileSync} from 'node:fs';
import {canonical} from './practice-catalog';
import {checkPolicies,isUncertainMapping} from './content/policies';
import type {ContentPack} from './content/types';
import type {RLExercise} from '../src/rl/practice-types';
import type {GuidedActivity} from '../src/rl/types';
import type policy from '../src/rl/source-policy.json';
export type RLSourcePolicy=typeof policy;
const need=(condition:unknown,message:string)=>{if(!condition)throw new Error('RL source policy: '+message);};
export function readRLCanonicalPack():ContentPack{return JSON.parse(readFileSync(new URL('../content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json',import.meta.url),'utf8')) as ContentPack;}
/** A four-object teaching instance; this is deliberately not a general constraint engine. */
export function puzzleSolutions(instance:RLSourcePolicy['puzzles'][number]['instance']){
 need(instance.kind==='distinct-integer-assignment'&&instance.allDifferent===true,'bounded puzzle kind');
 need(canonical(instance.variables)===canonical(['A','B','C','D'])&&canonical(instance.domain)===canonical([1,2,3,4]),'explicit four-object puzzle domain');
 need(instance.variables.includes(instance.requestedVariable),'requested variable');
 need(instance.constraints.length>0&&instance.constraints.length<=8,'constraint bounds');
 for(const c of instance.constraints){need(instance.variables.includes(c.left)&&instance.variables.includes(c.right),'constraint variables');need(c.kind==='sum'&&Number.isSafeInteger(c.value)||c.kind==='greater-than','constraint operation');}
 const result:Record<string,number>[]=[];
 function visit(values:number[]){if(values.length===4){const assignment=Object.fromEntries(instance.variables.map((name,i)=>[name,values[i]]));if(instance.constraints.every(c=>c.kind==='sum'?assignment[c.left]+assignment[c.right]===c.value:assignment[c.left]>assignment[c.right]))result.push(assignment);return;}for(const n of instance.domain)if(!values.includes(n))visit([...values,n]);}
 visit([]);return result;
}
export function checkRLSourcePolicy(policy:RLSourcePolicy,exercises:RLExercise[],guides:GuidedActivity[],pack=readRLCanonicalPack()){
 const issues:string[]=[];checkPolicies(pack,(code,path,message)=>issues.push(`${code}: ${path}: ${message}`));need(!issues.length,issues.join('\n'));
 need(policy.version==='1'&&policy.puzzles.length===1,'policy inventory/version');
 const rlAssessments=pack.assessment_model.assessments.filter(a=>a.subject_id==='CSE1300_RL');const questions=rlAssessments.flatMap(a=>a.question_map);
 const uncertain=questions.filter(isUncertainMapping),broad=questions.filter(q=>q.mapping_granularity==='TOPIC_LEVEL_BROAD');
 need(uncertain.length>0&&broad.length>0,'canonical uncertainty and broad evidence remain present');
 for(const p of policy.puzzles){const mapping=questions.find(q=>q.question_ref===p.mapping.question_ref);need(mapping,'unknown puzzle mapping');need(Object.entries(p.mapping).every(([key,value])=>canonical(value)===canonical(mapping![key])),'mapping metadata differs from canonical pack');need(!isUncertainMapping(mapping!)&&mapping!.can_generate_variants&&mapping!.mapping_granularity==='SKILL_LEVEL'&&mapping!.evidence_era==='CURRENT'&&mapping!.current_style_weight==='VERY_HIGH'&&mapping!.validator_type==='RUBRIC','only verified current rubric-backed puzzle mechanism');
  const exercise=exercises.find(e=>e.id===p.exerciseId),guide=guides.find(g=>g.id===p.guidedId);need(exercise&&guide,'puzzle must have both exact conclusion and unscored justification');need(mapping!.topic_ids.includes(exercise!.topicId)&&mapping!.skill_ids.includes(exercise!.skillId)&&guide!.topicId===exercise!.topicId&&guide!.skillIds.includes(exercise!.skillId),'mapping ownership');
  const solutions=puzzleSolutions(p.instance);need(solutions.length===1,'puzzle must have exactly one independently enumerated assignment');need(canonical(solutions)===canonical(p.reference.assignments)&&p.reference.enumerationSize===24,'puzzle reference enumeration');need(exercise!.reference.kind==='text'&&exercise!.reference.value===String(solutions[0][p.instance.requestedVariable]),'puzzle conclusion reference');
 }
 need(exercises.filter(e=>e.topicId==='RL_T09_TRANSFER_CONSTRAINT_PUZZLES').every(e=>policy.puzzles.some(p=>p.exerciseId===e.id)),'unauthorized puzzle');
 return {uncertainMappings:uncertain.length,broadMappings:broad.length,puzzles:policy.puzzles.length};
}
