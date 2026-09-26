import type {ReactNode,Ref} from 'react';
import {ExercisePanel} from '../practice/ExercisePanel';
import {ExercisePrompt} from '../practice/ExerciseParts';
import {MathText} from '../math/MathText';
import {practiceFor} from './evaluation';
import type {ExamItem} from './types';

export function ExamAssignment({item,children,headingRef,actions}:{item:ExamItem;children?:ReactNode;headingRef?:Ref<HTMLHeadingElement>;actions?:ReactNode}){
 const fixed=practiceFor(item);
 return <ExercisePanel title={item.title} headingRef={headingRef} actions={actions} metadata={<>{item.difficulty} · {item.weight} {item.evaluation==='RUBRIC'?'rubric weight · self-check':'objective points'} · Exam-style</>}>
  {item.context&&<details open><summary>Shared programming specification</summary><p className="ds-exam-stem"><MathText text={item.context}/></p></details>}
  {fixed?<ExercisePrompt exercise={fixed} mode="exam" embedded/>:<p className="ds-exam-stem"><MathText text={item.prompt??''}/></p>}
  {children}
 </ExercisePanel>;
}
