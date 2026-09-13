import { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { CodeEditor } from './components/CodeEditor';
import { RegisterPanel } from './components/RegisterPanel';
import { StackVisualizer } from './components/StackVisualizer';
import { InstructionExplanation } from './components/InstructionExplanation';
import { ExecutionHistory } from './components/ExecutionHistory';
import { Icon } from './components/Icon';
import { useSimulator } from './utils/useSimulator';
import { readPreferences, writeLocal, type ValueFormat } from './utils/storage';

export default function AssemblyWorkbench() {
  const simulator = useSimulator();
  const [format, setFormat] = useState<ValueFormat>(() => readPreferences().format);
  const {program, session, cpu, dirty, running, error} = simulator;
  const step = session.cursor > 0 ? session.steps[session.cursor - 1] : undefined;
  const nextInstruction = cpu.halted || dirty ? undefined : program.instructions[cpu.rip];
  const status = error ? 'Needs attention' : dirty ? 'Unloaded changes' : running ? 'Running' : cpu.halted ? 'Complete' : session.cursor === 0 ? 'Ready to explore' : 'Paused';
  return <div className="app-shell">
    <main>
      <div className="workspace-title"><div><div className="eyebrow">LEARN BY STEPPING THROUGH</div><h1>Assembly workbench<span className="architecture-tag">x86-64</span></h1></div><div className="workspace-options"><span className={`workspace-status ${error ? 'error-text' : ''}`}><span className="status-dot"/>{status}</span><div className="format-toggle" role="group" aria-label="Number display format">{(['decimal','hex'] as const).map(value => <button key={value} aria-pressed={format === value} className={format === value ? 'selected' : ''} onClick={() => {setFormat(value); writeLocal('format', value);}}>{value === 'decimal' ? 'DEC' : 'HEX'}</button>)}</div></div></div>
      <ControlPanel dirty={dirty} running={running} halted={cpu.halted} hasError={!!error} cursor={session.cursor} rip={cpu.rip} count={program.instructions.length} onLoad={() => simulator.load(simulator.source)} onPrevious={() => simulator.seek(session.cursor - 1)} onNext={simulator.step} onRun={simulator.run} onPause={simulator.pause} onReset={simulator.reset}/>
      {error && <div className="error-banner" role="alert"><Icon name="alert"/><div><strong>{error}</strong><span>Edit and load the program again, or reset execution.</span></div></div>}
      {dirty && !error && <div className="dirty-banner"><Icon name="code" size={16}/>Your code has changed. Load Program to start a new execution.</div>}
      <div className="workspace-grid">
        <CodeEditor source={simulator.source} currentLine={nextInstruction?.line} errorLine={simulator.errorLine} dirty={dirty} saved={simulator.saved} onChange={simulator.edit} onExample={simulator.load}/>
        <StackVisualizer cpu={cpu} step={step} format={format} cursor={session.cursor}/>
        <RegisterPanel cpu={cpu} step={step} format={format} cursor={session.cursor}/>
      </div>
      <div className="bottom-grid"><InstructionExplanation step={step} halted={cpu.halted} cursor={session.cursor} nextText={nextInstruction?.text}/><ExecutionHistory session={session} disabled={dirty} onSeek={simulator.seek}/></div>
      <footer className="app-footer"><span><span className="footer-brand">Notedra</span>Made for the moments when assembly clicks.</span><span><kbd>Alt</kbd> + <kbd>←</kbd> / <kbd>→</kbd> to step<span className="footer-dot">·</span>Simplified x86-64 · no data leaves your browser</span></footer>
    </main>
  </div>;
}
