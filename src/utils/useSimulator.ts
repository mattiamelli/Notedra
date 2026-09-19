import { useCallback, useEffect, useRef, useState } from 'react';
import { parseProgram } from '../engine/parser';
import { createSession, currentCPU, nextSession, seekSession, type Session } from '../engine/session';
import { examplePrograms } from '../examples/examplePrograms';
import { AssemblyError, type Program, type Registers } from '../engine/types';
import { readLocal, writeLocal } from './storage';

interface Machine { program: Program; session: Session; }
interface SimulatorOptions{initialSource?:string;initialRegisters?:Readonly<Partial<Registers>>;persistSource?:boolean}
function initialMachine(explicitSource?:string,initialRegisters:Readonly<Partial<Registers>>={}): { machine: Machine; source: string; error: string | null; errorLine?: number } {
  const source = explicitSource ?? readLocal('program') ?? examplePrograms[1].source;
  try {
    const program = parseProgram(source);
    return {machine: {program, session: createSession(program,'',initialRegisters)}, source, error: null};
  } catch (error) {
    const program = parseProgram(examplePrograms[1].source);
    return {machine: {program, session: createSession(program)}, source, error: error instanceof Error ? error.message : 'Could not load the saved program.', errorLine: error instanceof AssemblyError ? error.line : undefined};
  }
}

export function useSimulator({initialSource,initialRegisters,persistSource=true}:SimulatorOptions={}) {
  const [initial] = useState(()=>initialMachine(initialSource,initialRegisters));
  const [machine, setMachine] = useState(initial.machine);
  const machineRef = useRef(machine);
  const [source, setSource] = useState(initial.source);
  const sourceRef = useRef(initial.source);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const [error, setError] = useState<string | null>(initial.error);
  const [errorLine, setErrorLine] = useState<number | undefined>(initial.errorLine);
  const [saved, setSaved] = useState(true);
  const [terminalInput, setTerminalInputState] = useState('');
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
    sourceRef.current = newSource;
    setSource(newSource);
    try {
      const program = parseProgram(newSource);
      replaceMachine({program, session: createSession(program, terminalInput, initialRegisters)});
      clearError();
    } catch (failure) {
      const current = machineRef.current;
      replaceMachine({...current, session: createSession(current.program, terminalInput, initialRegisters)});
      reportError(failure);
    }
  }, [initialRegisters, pause, replaceMachine, terminalInput]);
  const step = useCallback(() => {
    const current = machineRef.current;
    if (sourceRef.current !== current.program.source) { pause(); return; }
    if (currentCPU(current.session).halted) { pause(); return; }
    try {
      const session = nextSession(current.program, current.session);
      replaceMachine({...current, session});
      clearError();
      if (currentCPU(session).halted) pause();
    } catch (failure) { pause(); reportError(failure); }
  }, [pause, replaceMachine]);
  const seek = useCallback((cursor: number) => {
    pause();
    const current = machineRef.current;
    if (sourceRef.current !== current.program.source) return;
    clearError();
    replaceMachine({...current, session: seekSession(current.session, cursor)});
  }, [pause, replaceMachine]);
  const reset = useCallback(() => {
    pause(); clearError();
    const current = machineRef.current;
    replaceMachine({...current, session: createSession(current.program, terminalInput, initialRegisters)});
  }, [initialRegisters, pause, replaceMachine, terminalInput]);
  const run = useCallback(() => {
    if (dirty || cpu.halted || error) return;
    runningRef.current = true;
    setRunning(true);
  }, [dirty, cpu.halted, error]);
  const edit = useCallback((value: string) => {
    pause();
    if (sourceRef.current !== value) {
      const current = machineRef.current;
      replaceMachine({...current, session: createSession(current.program, terminalInput, initialRegisters)});
    }
    sourceRef.current = value;
    setSource(value);
    clearError();
  }, [initialRegisters, pause, replaceMachine, terminalInput]);

  const setTerminalInput = useCallback((value: string) => {
    pause();
    setTerminalInputState(value);
    clearError();
    const current = machineRef.current;
    replaceMachine({...current, session: createSession(current.program, value, initialRegisters)});
  }, [initialRegisters, pause, replaceMachine]);

  useEffect(() => {
    if(!persistSource){setSaved(true);return;}
    const timer = window.setTimeout(() => setSaved(writeLocal('program', source)), 250);
    return () => {
      window.clearTimeout(timer);
      // Leaving the routed workbench must not discard an edit waiting for autosave.
      writeLocal('program', source);
    };
  }, [source,persistSource]);
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

  return { ...machine, cpu, source, dirty, running, error, errorLine, saved, terminalInput, setTerminalInput, edit, load, step, seek, reset, run, pause };
}
