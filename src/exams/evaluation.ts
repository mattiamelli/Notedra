import {CONTENT, LearningError, type Attempt} from '../learning/contracts';
import {getExercise, versionBinding} from '../practice/catalog';
import {gradeResponse} from '../practice/runtime';
import {eligibleSkill} from '../adaptive/evidence';
import {answered} from './records';
import {resolveSession} from './engine';
import type {Evaluation, ExamBank, ExamItem, ExamSession} from './types';
export function practiceFor(item: ExamItem) {
  const exercise = item.practiceRef && getExercise(item.practiceRef.id);
  return exercise && versionBinding(exercise)===item.practiceRef!.version && exercise.grader.id===item.evaluator.id && versionBinding(exercise)===item.evaluator.version ? exercise : null;
}
/** Exact existing graders and feedback remain the only objective oracles. */
export function evaluateSubmission(session:ExamSession,bank:ExamBank,submittedAt:string):{evaluations:Evaluation[];attempts:Attempt[];evidence:{itemId:string;attemptId:string}[]} {
  const resolved=resolveSession(session,bank);if(resolved.status!=='AVAILABLE')throw new LearningError('INCOMPATIBLE',resolved.message);
  const attempts:Attempt[]=[],evidence:{itemId:string;attemptId:string}[]=[];
  const evaluations=resolved.items.map((item):Evaluation=>{
    const answer=session.responses.find(r=>r.itemId===item.id)!.answer;
    if(!answered(answer))return {itemId:item.id,status:'UNANSWERED',reason:'No response was submitted. This is distinct from an incorrect answer.'};
    if(item.evaluation==='RUBRIC')return {itemId:item.id,status:'RUBRIC_REVIEW_REQUIRED',reason:'Open work requires the component rubric. No automatic points or skill evidence are assigned.'};
    const exercise=practiceFor(item);if(!exercise)throw new LearningError('INCOMPATIBLE','The exact fixed-item grader is unavailable. Submission was not saved.');
    const grade=gradeResponse(exercise,answer);
    if(grade.status!=='GRADED')return {itemId:item.id,status:'NOT_AUTOGRADABLE',reason:'The submitted response does not meet the declared structured format. It is preserved without automatic points or mistake evidence.'};
    // Atomic components are binary; partial credit only arises by summing separately verified components.
    const result:Evaluation={itemId:item.id,status:'AUTO_SCORED',earned:grade.correct?item.weight:0,max:item.weight};
    if(eligibleSkill(exercise)){
      const attemptId=`exam:${session.sessionId}:${session.items.findIndex(i=>i.id===item.id)}`;
      attempts.push({attemptId,contentVersion:CONTENT.version,subjectId:exercise.subjectId,topicId:exercise.topicId,subtopicId:exercise.subtopicId,targetedSkillIds:[exercise.skillId],templateRef:exercise.id,exercise:{id:'ds.instance.'+attemptId,version:versionBinding(exercise)},status:'SUBMITTED',answer:structuredClone(answer),hintsUsed:0,solutionViewed:null,createdAt:session.startedAt,updatedAt:submittedAt,revision:1,submission:{operationId:'submit:'+attemptId,submittedAt}});
      evidence.push({itemId:item.id,attemptId});
    }
    return result;
  });
  return {evaluations,attempts,evidence};
}
