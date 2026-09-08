import { REGISTER_NAMES, type CPUState, type StepResult } from '../engine/types';
import { addressHex } from '../engine/memory';
import { formatValue, type ValueFormat } from '../utils/storage';
import { Icon } from './Icon';
interface Props {cpu: CPUState; step?: StepResult; format: ValueFormat; cursor: number;}
export function RegisterPanel({cpu, step, format, cursor}: Props) {
  return <section className="panel register-panel" aria-labelledby="register-heading">
    <div className="panel-heading"><h2 id="register-heading"><Icon name="cpu"/>Registers</h2><span className="small-label">64-bit</span></div>
    <div className="register-section-label">GENERAL PURPOSE <span>{format === 'decimal' ? 'DEC' : 'HEX'}</span></div>
    <div className="register-list">{REGISTER_NAMES.filter(name => name !== 'rsp' && name !== 'rbp').map(name => {
      const changed = step?.changedRegisters.includes(name);
      return <div key={`${name}-${changed ? cursor : 'idle'}`} className={`register-row ${changed ? 'register-changed' : ''}`} data-register={name}><span className="register-name">{name.toUpperCase()}</span><span className="register-value" title={formatValue(cpu.registers[name], format === 'decimal' ? 'hex' : 'decimal')}>{formatValue(cpu.registers[name], format)}</span>{changed && <span className="change-dot" title="Changed in the last instruction"/>}</div>;
    })}</div>
    <div className="register-section-label stack-pointers-label">STACK POINTERS <span>HEX / DEC</span></div>
    <div className="pointer-registers">{(['rsp','rbp'] as const).map(name => <div key={`${name}-${cursor}`} className={`pointer-register ${name} ${step?.changedRegisters.includes(name) ? 'register-changed' : ''}`} data-register={name}><div><span className="register-name">{name.toUpperCase()}</span><span className="pointer-name">{name === 'rsp' ? 'Stack pointer' : 'Frame pointer'}</span></div><div className="pointer-value">{addressHex(cpu.registers[name])}<span>{cpu.registers[name].toString()}</span></div></div>)}</div>
    <div className="register-tip"><span className="change-dot"/> Highlighted values changed in the last step.</div>
  </section>;
}
