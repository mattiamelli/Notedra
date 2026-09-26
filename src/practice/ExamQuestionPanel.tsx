import {type ReactNode} from 'react';
import {MathText} from '../math/MathText';
import type {ExamQuestion} from '../curriculum/calculus-expansion';
import {ExercisePanel} from './ExercisePanel';

export function ExamQuestionPanel({question,number,children}:{question:ExamQuestion;number:number;children?:ReactNode}){
 return <ExercisePanel title={<>Question {number}</>} metadata={<>{question.points} {question.points===1?'pt':'pts'}{question.selfCheck?' · self-check':''}</>}>
  <p className="ds-exam-stem"><MathText text={question.stem}/></p>
  {question.parts&&<ol className="ds-exam-parts">{question.parts.map((part,index)=><li key={index}><span className="ds-exam-part-label">{String.fromCharCode(97+index)})</span><div><MathText text={part.prompt}/></div><span className="ds-exam-points">{part.points} {part.points===1?'pt':'pts'}</span></li>)}</ol>}
  {children}
 </ExercisePanel>;
}
