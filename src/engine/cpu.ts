import {REGISTER_NAMES,type CPUState,type OperandWidth,type Program,type RegisterAlias,type RegisterName,type Registers} from './types';

export const INITIAL_STACK_POINTER=0x1000n;
export const word=(value:bigint):bigint=>BigInt.asIntN(64,value);
const classic:Record<string,RegisterName>={a:'rax',b:'rbx',c:'rcx',d:'rdx'};
const aliases=new Map<string,RegisterAlias>();
const add=(text:string,name:RegisterName,width:OperandWidth,offset:0|8=0)=>aliases.set(text,{text,name,width,offset});
for(const name of REGISTER_NAMES)add(name,name,64);
for(const [letter,name] of Object.entries(classic)){add(`e${letter}x`,name,32);add(`${letter}x`,name,16);add(`${letter}l`,name,8);add(`${letter}h`,name,8,8);}
for(const [name,e,w,b] of [['rsi','esi','si','sil'],['rdi','edi','di','dil'],['rbp','ebp','bp','bpl'],['rsp','esp','sp','spl']] as const){add(e,name,32);add(w,name,16);add(b,name,8);}
for(let n=8;n<=15;n++){const name=`r${n}` as RegisterName;add(`${name}d`,name,32);add(`${name}w`,name,16);add(`${name}b`,name,8);}

export function registerAlias(text:string):RegisterAlias|undefined{return aliases.get(text.toLowerCase());}
export function readRegister(registers:Readonly<Registers>,alias:RegisterAlias):bigint{return BigInt.asUintN(alias.width,BigInt.asUintN(64,registers[alias.name])>>BigInt(alias.offset));}
export function writeRegister(registers:Registers,alias:RegisterAlias,value:bigint):void{
  if(alias.width===64){registers[alias.name]=word(value);return;}
  if(alias.width===32&&alias.offset===0){registers[alias.name]=word(BigInt.asUintN(32,value));return;}
  const base=BigInt.asUintN(64,registers[alias.name]),bits=BigInt(alias.width),offset=BigInt(alias.offset),mask=((1n<<bits)-1n)<<offset;
  registers[alias.name]=word((base&~mask)|(BigInt.asUintN(alias.width,value)<<offset));
}
export function freezeCPU(state:CPUState):CPUState{Object.freeze(state.registers);Object.freeze(state.flags);Object.freeze(state.memory);Object.freeze(state.bytes);Object.freeze(state.returnAddresses);return Object.freeze(state);}
export function createCPU(entry=0,initial:Partial<Registers>={},program?:Program,input=''):CPUState{
  const registers=Object.fromEntries(REGISTER_NAMES.map(name=>[name,0n])) as Registers;registers.rsp=INITIAL_STACK_POINTER;registers.rbp=INITIAL_STACK_POINTER;Object.assign(registers,initial);
  for(const name of REGISTER_NAMES)registers[name]=word(registers[name]);
  return freezeCPU({registers,flags:{zf:false,sf:false,of:false,cf:false},memory:{...(program?.initialMemory??{})},bytes:{...(program?.initialBytes??{})},returnAddresses:{},rip:entry,halted:false,terminal:'',input,inputOffset:0,callDepth:0});
}
