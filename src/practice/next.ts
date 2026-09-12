import {allExercises} from './catalog';
import type {PracticeExercise} from './registered-types';
import type {Attempt} from '../learning/contracts';

/** Same-topic, unseen authored work first. Exhaustion is explicit, never an automatic retry loop. */
export function nextExercise(current:PracticeExercise,attempts:readonly Attempt[]){
 const seen=new Set(attempts.map(attempt=>attempt.templateRef));
 return allExercises.filter(item=>item.id!==current.id&&item.subjectId===current.subjectId&&item.topicId===current.topicId&&!seen.has(item.id))
  .sort((a,b)=>Number(b.skillId===current.skillId)-Number(a.skillId===current.skillId)||(a.id<b.id?-1:a.id>b.id?1:0))[0]??null;
}
