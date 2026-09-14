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
import {useI18n} from './i18n/i18n';
import {assemblyError} from './i18n/assembly';

export default function AssemblyWorkbench() {
  const {t}=useI18n();
  const simulator = useSimulator();
  const [format, setFormat] = useState<ValueFormat>(() => readPreferences().format);
  const {program, session, cpu, dirty, running, error} = simulator;
  const step = session.cursor > 0 ? session.steps[session.cursor - 1] : undefined;
  const nextInstruction = cpu.halted || dirty ? undefined : program.instructions[cpu.rip];
  const status = error ? t('assembly.needsAttention') : dirty ? t('assembly.unloaded') : running ? t('assembly.running') : cpu.halted ? t('assembly.statusComplete') : session.cursor === 0 ? t('assembly.ready') : t('assembly.paused');
  return <div className="app-shell">
    <main>
      <div className="workspace-title"><div><div className="eyebrow">{t('assembly.eyebrow')}</div><h1>{t('assembly.workbench')}<span className="architecture-tag">x86-64</span></h1></div><div className="workspace-options"><span className={`workspace-status ${error ? 'error-text' : ''}`}><span className="status-dot"/>{status}</span><div className="format-toggle" role="group" aria-label={t('assembly.numberFormat')}>{(['decimal','hex'] as const).map(value => <button key={value} aria-pressed={format === value} className={format === value ? 'selected' : ''} onClick={() => {setFormat(value); writeLocal('format', value);}}>{value === 'decimal' ? 'DEC' : 'HEX'}</button>)}</div></div></div>
      <ControlPanel dirty={dirty} running={running} halted={cpu.halted} hasError={!!error} cursor={session.cursor} rip={cpu.rip} count={program.instructions.length} onLoad={() => simulator.load(simulator.source)} onPrevious={() => simulator.seek(session.cursor - 1)} onNext={simulator.step} onRun={simulator.run} onPause={simulator.pause} onReset={simulator.reset}/>
      {error && <div className="error-banner" role="alert"><Icon name="alert"/><div><strong>{assemblyError(error,t)}</strong><span>{t('assembly.errorHelp')}</span></div></div>}
      {dirty && !error && <div className="dirty-banner"><Icon name="code" size={16}/>{t('assembly.dirtyHelp')}</div>}
      <div className="workspace-grid">
        <CodeEditor source={simulator.source} currentLine={nextInstruction?.line} errorLine={simulator.errorLine} dirty={dirty} saved={simulator.saved} onChange={simulator.edit} onExample={simulator.load} onCreate={()=>simulator.edit('')}/>
        <StackVisualizer cpu={cpu} step={step} format={format} cursor={session.cursor}/>
        <RegisterPanel cpu={cpu} step={step} format={format} cursor={session.cursor}/>
      </div>
      <div className="bottom-grid"><InstructionExplanation step={step} halted={cpu.halted} cursor={session.cursor} nextText={nextInstruction?.text}/><ExecutionHistory session={session} disabled={dirty} onSeek={simulator.seek}/></div>
      <footer className="app-footer"><span><span className="footer-brand">Notedra</span>{t('assembly.footerLearning')}</span><span><kbd>Alt</kbd> + <kbd>←</kbd> / <kbd>→</kbd> {t('assembly.footerStep')}<span className="footer-dot">·</span>{t('assembly.footerPrivacy')}</span></footer>
    </main>
  </div>;
}
