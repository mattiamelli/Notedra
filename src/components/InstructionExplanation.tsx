import type { StepResult } from '../engine/types';
import { Icon } from './Icon';
import {useI18n} from '../i18n/i18n';
import {assemblyExplanation} from '../i18n/assembly';
export function InstructionExplanation({step, halted, cursor, nextText}: {step?: StepResult; halted: boolean; cursor: number; nextText?: string}) {
  const {t,lt}=useI18n();
  return <section className="panel explanation-panel" aria-labelledby="explanation-heading">
    <div className="panel-heading"><h2 id="explanation-heading"><Icon name="bulb"/>{lt('What just happened?')}</h2><span className="small-label">{step ? t('assembly.step',{step:cursor}).toUpperCase() : lt('Getting started').toUpperCase()}</span></div>
    <div className="explanation-content" aria-live="polite" aria-atomic="true">
      {step ? <><div className="explanation-instruction"><code>{step.instruction.text}</code><span>{t('assembly.line',{line:step.instruction.line})}</span></div><div className="explanation-lines">{step.explanation.map((text, index) => <p key={index}>{assemblyExplanation(text,t,lt)}</p>)}</div>{halted && <div className="completion-note"><Icon name="check" size={16}/>{lt('Program complete. Step backwards to explore how you got here.')}</div>}</> : <><div className="ready-explanation"><span className="ready-icon"><Icon name="next" size={23}/></span><div><h3>{lt('One instruction. Every detail.')}</h3><p>{lt('Press Next Instruction to see how your program changes the CPU and stack.')}</p></div></div>{nextText && <div className="next-preview"><span>{lt('Up next').toUpperCase()}</span><code>{nextText}</code></div>}</>}
    </div>
  </section>;
}
