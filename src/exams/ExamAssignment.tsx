import type {ReactNode,Ref} from 'react';
import {ExamQuestionPanel} from '../practice/ExamQuestionPanel';
import {ExercisePrompt} from '../practice/ExerciseParts';
import {MathText} from '../math/MathText';
import {practiceFor} from './evaluation';
import type {ExamItem} from './types';

export function ExamAssignment({item,number,children,headingRef,actions}:{item:ExamItem;number:number;children?:ReactNode;headingRef?:Ref<HTMLHeadingElement>;actions?:ReactNode}){
 const fixed=practiceFor(item);
 return <ExamQuestionPanel number={number} question={{stem:'',selfCheck:item.evaluation==='RUBRIC'}} headingRef={headingRef} actions={actions} metadata={<>{item.difficulty} · {item.weight} {item.evaluation==='RUBRIC'?'rubric weight':'objective points'} · Exam-style</>}>
  {item.context&&<details open><summary>Shared programming specification</summary><p className="ds-exam-stem"><MathText text={item.context}/></p></details>}
  {fixed?<ExercisePrompt exercise={fixed} mode="exam" embedded/>:<p className="ds-exam-stem"><MathText text={item.prompt??''}/></p>}
  {children}
  <p className="ds-study-muted">{item.title}</p>
 </ExamQuestionPanel>;
}
