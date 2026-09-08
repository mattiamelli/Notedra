import { useEffect, useRef } from 'react';
import type { Session } from '../engine/session';
import { Icon } from './Icon';
export function ExecutionHistory({session, disabled, onSeek}: {session: Session; disabled: boolean; onSeek: (cursor: number) => void}) {
  const active = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active.current || !list.current) return;
    const row = active.current;
    const container = list.current;
    const offset = row.getBoundingClientRect().top - container.getBoundingClientRect().top;
    if (offset < 0) container.scrollTop += offset;
    else if (offset + row.clientHeight > container.clientHeight) container.scrollTop += offset + row.clientHeight - container.clientHeight;
  }, [session.cursor]);
  return <section className="panel history-panel" aria-labelledby="history-heading">
    <div className="panel-heading"><h2 id="history-heading"><Icon name="clock"/>Execution history</h2><span className="small-label">{session.steps.length} STEPS</span></div>
    <div className="history-list" ref={list}>
      <button ref={session.cursor === 0 ? active : undefined} className={`history-row initial-history ${session.cursor === 0 ? 'selected' : ''}`} disabled={disabled} onClick={() => onSeek(0)} aria-current={session.cursor === 0 ? 'step' : undefined}><span className="history-index">0</span><span>Initial state</span><span className="history-line">RSP 0x1000</span></button>
      {session.steps.map((step, index) => <button ref={session.cursor === index + 1 ? active : undefined} key={index} className={`history-row ${session.cursor === index + 1 ? 'selected' : ''} ${session.cursor < index + 1 ? 'future-step' : ''}`} disabled={disabled} onClick={() => onSeek(index + 1)} aria-current={session.cursor === index + 1 ? 'step' : undefined} aria-label={`Restore step ${index + 1}: ${step.instruction.text}`}><span className="history-index">{index + 1}</span><code>{step.instruction.text}</code><span className="history-line">L{step.instruction.line}{session.cursor === index + 1 && <Icon name="chevron" size={14}/>}</span></button>)}
      {session.steps.length === 0 && <div className="history-empty">Your execution path will appear here.<br/>Select any step to restore its exact state.</div>}
    </div>
  </section>;
}
