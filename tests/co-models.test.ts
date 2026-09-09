import {describe, expect, it} from 'vitest';
import {addressAliases, amdahl, cacheFields, cacheTrace, customFloat, fixedPoint, interleave, isaBudget,
  memoryOrganization, pipelineCycles, pipelineSchedule, translateVM, truthTable, vmLayout} from '../src/co/models';

describe('explicit CO teaching models — independent reference cases', () => {
  it.each([['and',[false,false,false,true]],['or',[false,true,true,true]],['xor',[false,true,true,false]],['nand',[true,true,true,false]]] as const)('enumerates %s', (op, expected) => {
    expect(truthTable(op).map(row=>row.value)).toEqual(expected);
  });
  it('scales signed fixed point after interpreting its integer sign', () => {
    expect(fixedPoint('11010',2,true)).toEqual({value:-1.5,step:.25,minimum:-4,maximum:3.75});
    expect(fixedPoint('11010',2,false).value).toBe(6.5);
    expect(fixedPoint('10000',0,true).value).toBe(-16);
  });
  it('respects a custom bias and ordinary all-zero/all-one exponent codes', () => {
    const format={exponentBits:3,fractionBits:3,bias:2};
    expect(customFloat(format,0,4,3)).toEqual({value:5.5,significand:1.375,actualExponent:2,spacing:.5,minimumPositive:.25,maximumFinite:60});
    expect(customFloat(format,1,0,0).value).toBe(-.25);
    expect(customFloat(format,0,7,7).value).toBe(60);
  });
  it('rounds register bit requirements up and counts opcode capacity inclusively', () => {
    expect(isaBudget(20,10,2,6)).toEqual({registerBits:4,opcodeBits:6,opcodeCapacity:64n,unusedRegisterCodes:6});
    expect(isaBudget(8,16,2,0).opcodeCapacity).toBe(1n);
  });
  it('enumerates aliases using ignored lines, not decoded lines', () => {
    expect(addressAliases(8,0x24,[0,3])).toEqual([0x24,0x25,0x2c,0x2d]);
    expect(addressAliases(8,0x2d,[3,0])).toEqual([0x24,0x25,0x2c,0x2d]);
    expect(addressAliases(8,255,[])).toEqual([255]);
  });
  it('separates chip depth, chip width, address pins and data pins', () => {
    expect(memoryOrganization(2048,16,512,4)).toEqual({depthGroups:4,parallelChips:4,chips:16,boardAddressPins:11,chipAddressPins:9,chipDataPins:4,capacityBits:32768});
    expect(interleave(13,4)).toEqual({bank:1,row:3});
  });
  const cache={addressBits:8,blockBytes:4,sets:2,ways:2};
  it('does not include way count in address index bits', () => {
    expect(cacheFields(cache,45)).toEqual({offsetBits:2,indexBits:1,tagBits:5,block:11,offset:1,set:1,tag:5,dataBytes:16});
    expect(cacheFields({...cache,sets:1},255).indexBits).toBe(0);
  });
  it('refreshes LRU on a hit, preserves snapshots and resets to an empty cache', () => {
    const trace=[0,8,0,16,8]; const result=cacheTrace(cache,trace);
    expect(result.map(r=>r.hit)).toEqual([false,false,true,false,false]);
    expect(result.map(r=>r.evicted)).toEqual([null,null,null,1,0]);
    expect(result.map(r=>r.sets[0])).toEqual([[0],[0,1],[1,0],[0,2],[2,1]]);
    expect(cacheTrace(cache,trace)).toEqual(result);expect(cacheTrace(cache,[0])[0].hit).toBe(false);
    expect(cacheTrace(cache,[0,1,3]).map(r=>r.hit)).toEqual([false,true,true]);
  });
  const program=[{label:'ALU A',kind:'alu',dependencies:[]},{label:'ALU B',kind:'alu',dependencies:[0]},
    {label:'Load C',kind:'load',dependencies:[]},{label:'ALU D',kind:'alu',dependencies:[2]}] as const;
  const input=()=>program.map(row=>({...row,dependencies:[...row.dependencies]}));
  it('includes filling/draining and a load-use stall even with forwarding', () => {
    expect(pipelineCycles(4,5,0)).toBe(8);expect(pipelineCycles(4,5,3)).toBe(11);
    const result=pipelineSchedule(input(),true);
    expect(result.rows.map(r=>r.stages)).toEqual([[1,2,3,4,5],[2,3,4,5,6],[3,4,5,6,7],[5,6,7,8,9]]);
    expect(result.cycles).toBe(9);expect(result.stalls).toBe(1);
  });
  it('waits for writeback without forwarding under the stated same-cycle W-to-D rule', () => {
    const result=pipelineSchedule(input(),false);
    expect(result.rows.map(r=>r.start)).toEqual([1,4,5,8]);expect(result.cycles).toBe(12);expect(result.stalls).toBe(4);
    expect(pipelineSchedule(input(),false)).toEqual(result);expect(pipelineSchedule(input().slice(0,1),false).cycles).toBe(5);
  });
  it('applies the serial fraction to time, not processor count', () => {
    expect(amdahl(.25,3)).toEqual({relativeTime:.5,speedup:2,upperLimit:4});
    expect(amdahl(1,64).speedup).toBe(1);expect(amdahl(0,8)).toEqual({relativeTime:.125,speedup:8,upperLimit:Infinity});
    expect(amdahl(.7,1).speedup).toBe(1);
  });
  const vm={virtualBits:16,physicalBits:12,pageBits:8,entryBytes:4};
  it('preserves the page offset and sizes the table by virtual pages', () => {
    expect(vmLayout(vm)).toEqual({pageBytes:256,pages:256,frames:16,virtualPageBits:8,frameBits:4,tableBytes:1024});
    expect(translateVM(vm,0x1234,7,true,true,false)).toEqual({status:'TRANSLATED',page:18,offset:52,physicalAddress:0x734});
    expect(translateVM(vm,65535,15,true,true,true)).toEqual({status:'TRANSLATED',page:255,offset:255,physicalAddress:4095});
  });
  it('never invents a physical address for absence or a prohibited write', () => {
    expect(translateVM(vm,0x1234,7,false,true,false)).toEqual({status:'NOT_PRESENT',page:18,offset:52});
    expect(translateVM(vm,0x1234,7,true,false,true)).toEqual({status:'PROTECTION_FAULT',page:18,offset:52});
    expect(translateVM(vm,0x1234,7,true,false,false).status).toBe('TRANSLATED');
  });
  it.each([
    ()=>fixedPoint('10x',1,true),()=>fixedPoint('101',4,true),
    ()=>customFloat({exponentBits:3,fractionBits:3,bias:2},0,8,0),
    ()=>customFloat({exponentBits:3,fractionBits:3,bias:2},0,2,8),
    ()=>isaBudget(8,16,3,0),()=>isaBudget(16,NaN,2,2),
    ()=>addressAliases(8,256,[0]),()=>addressAliases(8,1,[8]),()=>addressAliases(8,1,[0,0]),
    ()=>memoryOrganization(2048,15,512,4),()=>memoryOrganization(512,16,2048,4),()=>interleave(1,3),
    ()=>cacheFields({...cache,blockBytes:3},0),()=>cacheFields({...cache,addressBits:2},0),
    ()=>cacheTrace(cache,[256]),()=>cacheTrace(cache,new Array(65).fill(0)),
    ()=>pipelineSchedule([{label:'A',kind:'alu',dependencies:[0]}],true),()=>pipelineCycles(0,5,0),
    ()=>amdahl(-.1,4),()=>amdahl(NaN,4),()=>amdahl(.1,0),
    ()=>vmLayout({...vm,pageBits:13}),()=>translateVM(vm,0,16,true,true,false),
  ])('rejects invalid input case %# with a deliberate error', operation=>{expect(operation).toThrow(Error);});
});
