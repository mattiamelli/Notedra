import {useId,type ReactNode} from 'react';
import './exam-question.css';
import './exercise-ui.css';

export function ExercisePanel({title,metadata,children}:{title:ReactNode;metadata?:ReactNode;children:ReactNode}){
 const id=useId();
 return <section className="ds-exam-question" aria-labelledby={id}><header><h2 id={id}>{title}</h2>{metadata&&<span>{metadata}</span>}</header>{children}</section>;
}
