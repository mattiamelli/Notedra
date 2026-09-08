import { Fragment, useEffect, useRef } from 'react';
import { addressHex, MAX_MEMORY_ADDRESS } from '../engine/memory';
import type { CPUState, StepResult } from '../engine/types';
import { formatValue, type ValueFormat } from '../utils/storage';
import { stackAddresses } from '../utils/stackRows';
import { Icon } from './Icon';
interface Props {cpu: CPUState; step?: StepResult; format: ValueFormat; cursor: number;}
export function StackVisualizer({cpu, step, format, cursor}: Props) {
  const addresses = stackAddresses(cpu, step);
  const used = 0x1000n - cpu.registers.rsp;
  const rows = useRef<HTMLDivElement>(null);
  const stackPointerRow = useRef<HTMLDivElement>(null);
  const pointerOutsideCells = cpu.registers.rsp < 0n || cpu.registers.rsp > MAX_MEMORY_ADDRESS || cpu.registers.rsp % 8n !== 0n;
  useEffect(() => {
    if (!rows.current || !stackPointerRow.current) return;
    const container = rows.current;
    const row = stackPointerRow.current;
    const offset = row.getBoundingClientRect().top - container.getBoundingClientRect().top;
    if (offset < 0 || offset + row.clientHeight > container.clientHeight) {
      container.scrollTop += offset - container.clientHeight / 2 + row.clientHeight / 2;
    }
  }, [cpu.registers.rsp, cursor]);
  return <section className="panel stack-panel" aria-labelledby="stack-heading">
    <div className="panel-heading"><h2 id="stack-heading"><Icon name="stack"/>Stack memory</h2><span className="small-label">8 bytes / cell</span></div>
    <div className="stack-context"><span><i className="legend-dot cyan"/>Stack grows downward</span><span className="mono">{used >= 0n ? `${used} B below origin` : 'Above origin'} <Icon name="arrow" size={14}/></span></div>
    <div className="stack-table" role="table" aria-label="Stack memory, higher addresses first">
      <div className="stack-table-heading" role="row"><span role="columnheader">ADDRESS</span><span role="columnheader">VALUE <small>{format === 'decimal' ? 'DEC' : 'HEX'}</small></span><span role="columnheader">POINTER</span></div>
      <div className="stack-rows" ref={rows}>{addresses.map((address, index) => {
        const rsp = cpu.registers.rsp === BigInt(address);
        const rbp = cpu.registers.rbp === BigInt(address);
        const value = cpu.memory[address];
        const written = step?.writtenAddresses.includes(address);
        const pushed = step?.pushedAddress === address;
        const popped = step?.poppedAddress === address;
        const returnAddress = cpu.returnAddresses[address];
        const active = BigInt(address) >= cpu.registers.rsp && BigInt(address) < 0x1000n;
        return <Fragment key={address}>
          {index > 0 && addresses[index - 1] - address > 8 && <div className="stack-gap">··· addresses omitted ···</div>}
          <div ref={rsp ? stackPointerRow : undefined} role="row" key={`${address}-${written || popped ? cursor : 'idle'}`} className={`stack-row ${rsp ? 'stack-rsp' : ''} ${rbp ? 'stack-rbp' : ''} ${written ? 'stack-written' : ''} ${popped ? 'stack-popped' : ''} ${active ? 'stack-active' : ''}`} data-address={addressHex(address)}>
            <span role="cell" className="stack-address">{addressHex(address)}</span>
            <span role="cell" className="stack-value">{value === undefined ? <span className="unset">—</span> : <><span className={returnAddress !== undefined ? 'return-value' : ''} title={`Decimal: ${value} · Hex: ${formatValue(value, 'hex')}`}>{formatValue(value, format)}</span><span className="cell-annotation">{popped ? 'popped' : returnAddress !== undefined ? 'return address' : pushed ? 'pushed' : written ? 'written' : !active ? 'stored' : ''}</span></>}</span>
            <span role="cell" className="stack-pointer">{(rsp || rbp) && <span className={`pointer-badge ${rsp ? 'rsp' : 'rbp'}`}>← {rsp && rbp ? 'RSP, RBP' : rsp ? 'RSP' : 'RBP'}</span>}</span>
          </div>
        </Fragment>;
      })}</div>
    </div>
    {pointerOutsideCells && <p className="stack-pointer-notice">RSP is {addressHex(cpu.registers.rsp)}. Stack access requires an aligned address within the simulated memory.</p>}
    <div className="stack-legend"><span><i className="legend-dot cyan"/>Stack pointer</span><span><i className="legend-dot violet"/>Frame pointer</span><span><i className="legend-dot amber"/>Changed</span></div>
    <p className="stack-footnote">— Uninitialized memory<span>Higher addresses above <Icon name="arrow" size={13}/></span></p>
  </section>;
}
