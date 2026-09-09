import { useCallback, useEffect, useRef, useState } from 'react';
import { parseProgram } from '../engine/parser';
import { createSession, currentCPU, nextSession, seekSession, type Session } from '../engine/session';
import { examplePrograms } from '../examples/examplePrograms';
import { AssemblyError, type Program } from '../engine/types';
import { readLocal, writeLocal } from './storage';

interface Machine { program: Program; session: Session; }
function initialMachine(): { machine: Machine; source: string; error: string | null; errorLine?: number } {
  const source = readLocal('program') ?? examplePrograms[1].source;
  try {
    const program = parseProgram(source);
    return {machine: {program, session: createSession(program)}, source, error: null};
  } catch (error) {
    const program = parseProgram(examplePrograms[1].source);
    return {machine: {program, session: createSession(program)}, source, error: error instanceof Error ? error.message : 'Could not load the saved program.', errorLine: error instanceof AssemblyError ? error.line : undefined};
  }
}

export function useSimulator() {
  const [initial] = useState(initialMachine);
  const [machine, setMachine] = useState(initial.machine);
  const machineRef = useRef(machine);
  const [source, setSource] = useState(initial.source);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const [error, setError] = useState<string | null>(initial.error);
  const [errorLine, setErrorLine] = useState<number | undefined>(initial.errorLine);
  const [saved, setSaved] = useState(true);
  const dirty = source !== machine.program.source;
  const cpu = currentCPU(machine.session);

  const replaceMachine = useCallback((next: Machine) => { machineRef.current = next; setMachine(next); }, []);
  const pause = useCallback(() => { runningRef.current = false; setRunning(false); }, []);
  const clearError = () => { setError(null); setErrorLine(undefined); };
  const reportError = (failure: unknown) => {
    setError(failure instanceof Error ? failure.message : 'This instruction could not be executed.');
    setErrorLine(failure instanceof AssemblyError ? failure.line : undefined);
  };
  const load = useCallback((newSource: string) => {
    pause();
    setSource(newSource);
    try {
      const program = parseProgram(newSource);
      replaceMachine({program, session: createSession(program)});
      clearError();
    } catch (failure) { reportError(failure); }
  }, [pause, replaceMachine]);
  const step = useCallback(() => {
    const current = machineRef.current;
    if (currentCPU(current.session).halted) { pause(); return; }
    try {
      const session = nextSession(current.program, current.session);
      replaceMachine({...current, session});
      clearError();
      if (currentCPU(session).halted) pause();
    } catch (failure) { pause(); reportError(failure); }
  }, [pause, replaceMachine]);
  const seek = useCallback((cursor: number) => {
    pause(); clearError();
    const current = machineRef.current;
    replaceMachine({...current, session: seekSession(current.session, cursor)});
  }, [pause, replaceMachine]);
  const reset = useCallback(() => {
    pause(); clearError();
    const current = machineRef.current;
    replaceMachine({...current, session: createSession(current.program)});
  }, [pause, replaceMachine]);
  const run = useCallback(() => {
    if (dirty || cpu.halted || error) return;
    runningRef.current = true;
    setRunning(true);
  }, [dirty, cpu.halted, error]);
  const edit = useCallback((value: string) => { pause(); setSource(value); clearError(); }, [pause]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSaved(writeLocal('program', source)), 250);
    return () => {
      window.clearTimeout(timer);
      // Leaving the routed workbench must not discard an edit waiting for autosave.
      writeLocal('program', source);
    };
  }, [source]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => { if (runningRef.current) step(); }, 650);
    return () => window.clearInterval(timer);
  }, [running, step]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); load(source); }
      if (event.altKey && event.key === 'ArrowRight' && !dirty && !running && !error) { event.preventDefault(); step(); }
      if (event.altKey && event.key === 'ArrowLeft' && !dirty) { event.preventDefault(); seek(machineRef.current.session.cursor - 1); }
      if (event.key === 'Escape') pause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [source, dirty, running, error, load, pause, seek, step]);

  return { ...machine, cpu, source, dirty, running, error, errorLine, saved, edit, load, step, seek, reset, run, pause };
}
