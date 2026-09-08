import { Icon } from './Icon';
interface Props {
  dirty: boolean; running: boolean; halted: boolean; hasError: boolean; cursor: number; rip: number; count: number;
  onLoad: () => void; onPrevious: () => void; onNext: () => void; onRun: () => void; onPause: () => void; onReset: () => void;
}
export function ControlPanel(props: Props) {
  const locked = props.dirty || props.hasError;
  return <div className="control-panel">
    <div className="control-buttons">
      <button className="button load-button" onClick={props.onLoad} title="Load program (Ctrl/⌘ + Enter)"><Icon name="load"/>Load Program</button>
      <span className="control-divider"/>
      <button className="button" onClick={props.onPrevious} disabled={props.cursor === 0 || props.dirty} title="Previous instruction (Alt + ←)"><Icon name="previous"/>Previous</button>
      <button className="button primary" onClick={props.onNext} disabled={locked || props.halted || props.running} title="Next instruction (Alt + →)"><Icon name="next"/>Next Instruction</button>
      <button className="button" onClick={props.onRun} disabled={locked || props.halted || props.running}><Icon name="play"/>Run</button>
      <button className="button" onClick={props.onPause} disabled={!props.running} title="Pause (Escape)"><Icon name="pause"/>Pause</button>
      <button className="button reset-button" onClick={props.onReset}><Icon name="reset"/>Reset</button>
    </div>
    <div className="instruction-counter"><span className={`status-dot ${props.running ? 'is-running' : ''}`}/><span>{props.halted ? 'Program complete' : `Instruction ${props.rip + 1} / ${props.count}`}</span><span className="counter-separator">·</span><span className="muted">{props.cursor} executed</span></div>
  </div>;
}
