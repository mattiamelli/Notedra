import {useId,type ReactNode,type Ref} from 'react';
import {MathText} from '../math/MathText';
import type {ExamQuestion} from '../curriculum/calculus-expansion';
import './exam-question.css';

type PresentedQuestion=Pick<ExamQuestion,'stem'|'parts'> & Partial<Pick<ExamQuestion,'points'|'selfCheck'>>;
export function ExamQuestionContent({question}:{question:PresentedQuestion}){
 return <>
  {question.stem&&<p className="ds-exam-stem"><MathText text={question.stem}/></p>}
  {question.parts&&<ol className="ds-exam-parts">{question.parts.map((part,index)=><li key={index}><span className="ds-exam-part-label">{String.fromCharCode(97+index)})</span><div><MathText text={part.prompt}/></div><span className="ds-exam-points">{part.points} {part.points===1?'pt':'pts'}</span></li>)}</ol>}
 </>;
}
export function ExamQuestionPanel({question,number,metadata,children,headingLevel=2,headingRef,actions,className=''}:{question:PresentedQuestion;number:number;metadata?:ReactNode;children?:ReactNode;headingLevel?:1|2|3;headingRef?:Ref<HTMLHeadingElement>;actions?:ReactNode;className?:string}){
 const id=useId(),Heading=headingLevel===1?'h1':headingLevel===3?'h3':'h2';
 const labels=<>{question.points!==undefined&&<>{question.points} {question.points===1?'pt':'pts'}</>}{question.selfCheck&&<>{question.points!==undefined?' · ':''}self-check</>}{metadata&&<>{question.points!==undefined||question.selfCheck?' · ':''}{metadata}</>}</>;
 return <section className={`ds-exam-question ds-assignment ${className}`} aria-labelledby={id}>
  <header className="ds-assignment-header"><Heading id={id} ref={headingRef} tabIndex={headingRef?-1:undefined}>Question {number}</Heading><span className="ds-assignment-meta">{labels}</span>{actions&&<div className="ds-assignment-header-actions">{actions}</div>}</header>
  <div className="ds-assignment-body"><ExamQuestionContent question={question}/>{children}</div>
 </section>;
}
