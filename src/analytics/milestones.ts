import type {Attempt} from '../learning/contracts';
export const isFirstPracticeStart=(attempts:readonly Attempt[])=>attempts.length===0;
export const isFirstPracticeCompletion=(attempts:readonly Attempt[],attemptId:string)=>!attempts.some(attempt=>attempt.status==='SUBMITTED'&&attempt.attemptId!==attemptId);
