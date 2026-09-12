import type {PracticeExercise} from './registered-types';

/** Presentation contract only. Persisted IDs, versions and grader bindings are unchanged. */
export const exerciseFormats={
 radix:{label:'Base conversion',renderer:'digits',validator:'radix-exact',feedback:'normalized reference'},
 truth:{label:'Truth table',renderer:'truth-rows',validator:'truth-rows',feedback:'row values'},
 'java-output':{label:'Code prediction',renderer:'single-choice',validator:'fixed-output-choice',feedback:'option text'},
 'ip-fixed':{label:'Code reading and prediction',renderer:'single-choice',validator:'ip-fixed-choice',feedback:'authored option explanation'},
 'co-exact':{label:'Numeric or state prediction',renderer:'declared-number',validator:'co-exact',feedback:'normalized reference'},
 'rl-exact':{label:'Structured logic answer',renderer:'declared-number-or-set',validator:'rl-exact',feedback:'normalized reference'},
 'enrichment-exact':{label:'Ordered result',renderer:'ordered-fields',validator:'enrichment-exact',feedback:'ordered components'},
} as const satisfies Record<PracticeExercise['task']['kind'],{label:string;renderer:string;validator:string;feedback:string}>;
export function exerciseFormat(kind:string){return Object.hasOwn(exerciseFormats,kind)?exerciseFormats[kind as keyof typeof exerciseFormats]:null;}

/** Do not normalize or discard an old malformed draft merely by displaying it. */
export function tupleFields(value:string,parts:number):string[]|null {
 if(!value)return Array<string>(parts).fill('');
 const tokens=value.split(',');
 return tokens.length===parts?tokens:null;
}

/** Human-readable answer values; persisted canonical option identifiers stay internal. */
export function displayAnswer(exercise:PracticeExercise,answer:import('../learning/contracts').Answer):string {
 const task=exercise.task;
 if(typeof answer.value==='string'){
  if(task.kind==='enrichment-exact'&&answer.value.split(',').length===task.parts)return answer.value.split(',').map((part,index)=>`Part ${index+1}: ${part.trim()}`).join('\n');
  return answer.value;
 }
 if(task.kind==='java-output'||task.kind==='ip-fixed')return answer.value.map(id=>task.options.find(option=>option.id===id)?.output??'Original option unavailable').join('\n');
 if(task.kind==='truth')return task.rows.map(row=>`${row.p?'T':'F'}, ${row.q?'T':'F'} → ${answer.value.includes(`${row.id}:T`)?'T':answer.value.includes(`${row.id}:F`)?'F':'Unanswered'}`).join('\n');
 return 'Original answer format unavailable';
}
