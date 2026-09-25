import {useId} from 'react';
import type {Answer} from '../learning/contracts';
import type {CurriculumTask} from './practice';

export function CurriculumControls({task, answer, onChange, disabled}: {
  task: CurriculumTask; answer: Answer; onChange: (answer: Answer) => void; disabled: boolean;
}) {
  const name = useId();
  if (task.format === 'choice') return <fieldset disabled={disabled} className="ds-output-options" aria-describedby="answer-rules">
    <legend>Your answer</legend>{task.options.map(option => <label key={option.id}>
      <input type="radio" name={name} value={option.id} checked={answer.kind === 'choice' && answer.value.includes(option.id)}
        onChange={() => onChange({kind: 'choice', value: [option.id]})}/>{option.text}
    </label>)}
  </fieldset>;
  const props = {disabled, 'aria-describedby': 'answer-rules', maxLength: 16000,
    value: answer.kind === 'text' ? answer.value : '',
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({kind: 'text', value: event.target.value})};
  return <label className="ds-practice-answer">{task.format === 'open' ? 'Your reasoning' : 'Your answer'}
    {task.format === 'open' ? <textarea {...props} rows={8}/> : <input {...props} autoComplete="off" spellCheck={false}/>}
  </label>;
}
