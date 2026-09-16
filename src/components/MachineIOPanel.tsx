import type {CPUState,Program,StepResult} from '../engine/types';
import {useI18n} from '../i18n/i18n';

interface Props {cpu:CPUState; program:Program; step?:StepResult; input:string; onInput:(value:string)=>void;}
const copy={
  en:{title:'Machine state',flags:'Flags',variables:'Data and variables',terminal:'Terminal',input:'Queued input',empty:'No output yet.',none:'No named data in this program.',inputHint:'Input consumed by scanf, one value at a time.'},
  it:{title:'Stato macchina',flags:'Flag',variables:'Dati e variabili',terminal:'Terminale',input:'Input in coda',empty:'Nessun output.',none:'Nessun dato con nome nel programma.',inputHint:'Input usato da scanf, un valore alla volta.'},
  es:{title:'Estado de la máquina',flags:'Indicadores',variables:'Datos y variables',terminal:'Terminal',input:'Entrada en cola',empty:'Aún no hay salida.',none:'No hay datos con nombre en el programa.',inputHint:'Entrada que usa scanf, un valor cada vez.'},
  fr:{title:'État de la machine',flags:'Indicateurs',variables:'Données et variables',terminal:'Terminal',input:'Entrée en attente',empty:'Aucune sortie pour le moment.',none:'Aucune donnée nommée dans ce programme.',inputHint:'Entrée lue par scanf, une valeur à la fois.'},
  de:{title:'Maschinenzustand',flags:'Statusflags',variables:'Daten und Variablen',terminal:'Terminal',input:'Eingabewarteschlange',empty:'Noch keine Ausgabe.',none:'Keine benannten Daten in diesem Programm.',inputHint:'Eingabe für scanf, jeweils ein Wert.'}
} as const;

const hex=(value:number)=>value.toString(16).toUpperCase().padStart(2,'0');

export function MachineIOPanel({cpu,program,step,input,onInput}:Props){
  const {language}=useI18n(),text=copy[language];
  const flags=(['zf','sf','of','cf'] as const);
  return <section className="machine-io-panel" aria-labelledby="machine-state-title">
    <h2 id="machine-state-title">{text.title}</h2>
    <div className="machine-io-grid">
      <section className="machine-state-card" aria-labelledby="machine-flags-title">
        <h3 id="machine-flags-title">{text.flags}</h3>
        <dl className="flag-grid">{flags.map(flag=><div key={flag} className={step?.changedFlags.includes(flag)?'changed':''}><dt>{flag.toUpperCase()}</dt><dd aria-label={`${flag.toUpperCase()} ${cpu.flags[flag]?1:0}`}>{cpu.flags[flag]?'1':'0'}</dd></div>)}</dl>
      </section>
      <section className="machine-state-card machine-variables" aria-labelledby="machine-variables-title">
        <h3 id="machine-variables-title">{text.variables}</h3>
        {program.variables.length===0?<p className="muted">{text.none}</p>:<div className="variable-list">{program.variables.map(variable=>{
          const bytes=Array.from({length:Math.min(variable.size,12)},(_,index)=>cpu.bytes[variable.address+index]??0);
          return <div className="variable-row" key={`${variable.segment}:${variable.name}`}><strong>{variable.name}</strong><span>{variable.segment} · 0x{variable.address.toString(16).toUpperCase()}</span><code>{bytes.map(hex).join(' ')}{variable.size>12?' …':''}</code></div>;
        })}</div>}
      </section>
      <section className="machine-state-card machine-terminal" aria-labelledby="machine-terminal-title">
        <h3 id="machine-terminal-title">{text.terminal}</h3>
        <pre aria-live="polite">{cpu.terminal||text.empty}</pre>
        <label htmlFor="assembly-terminal-input">{text.input}</label>
        <textarea id="assembly-terminal-input" rows={2} value={input} onChange={event=>onInput(event.target.value)} aria-describedby="assembly-input-hint"/>
        <small id="assembly-input-hint">{text.inputHint}</small>
      </section>
    </div>
  </section>;
}
