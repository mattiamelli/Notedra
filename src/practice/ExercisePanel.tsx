import {useId,type ReactNode,type Ref} from 'react';
import './exam-question.css';
import './exercise-ui.css';

export function ExercisePanel({title,metadata,children,headingLevel=2,headingRef,actions,className=''}:{title:ReactNode;metadata?:ReactNode;children:ReactNode;headingLevel?:2|3;headingRef?:Ref<HTMLHeadingElement>;actions?:ReactNode;className?:string}){
 const id=useId();
 const Heading=headingLevel===3?'h3':'h2';
 return <section className={`ds-exam-question ds-assignment ${className}`} aria-labelledby={id}><header className="ds-assignment-header"><Heading id={id} ref={headingRef} tabIndex={headingRef?-1:undefined}>{title}</Heading>{metadata&&<span className="ds-assignment-meta">{metadata}</span>}{actions&&<div className="ds-assignment-header-actions">{actions}</div>}</header><div className="ds-assignment-body">{children}</div></section>;
}
