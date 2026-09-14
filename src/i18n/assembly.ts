import type {MessageKey} from './messages';
type T=(key:MessageKey,values?:Record<string,string|number>)=>string;
const match=(text:string,pattern:RegExp,key:MessageKey,t:T,names:string[])=>{const value=pattern.exec(text);return value?t(key,Object.fromEntries(names.map((name,index)=>[name,value[index+1]]))):null};
/** Localizes runtime events at presentation time while preserving every technical token. */
export function assemblyExplanation(text:string,t:T,lt:(text:string)=>string){
 return match(text,/^(.+) was copied into (.+)\. The source value is unchanged\.$/,'assembly.event.copy',t,['value','target'])
  ??match(text,/^RSP moved from (.+) to (.+)\.$/,'assembly.event.rspMove',t,['from','to'])
  ??match(text,/^RBP changed from (.+) to (.+)\.$/,'assembly.event.rbpMove',t,['from','to'])
  ??match(text,/^(.+) \((.+)\) was stored at (.+)\.$/,'assembly.event.store',t,['source','value','address'])
  ??match(text,/^(.+) was read from (.+) into (.+)\.$/,'assembly.event.read',t,['value','address','target'])
  ??match(text,/^(.+): (.+) ([×−+]) (.+) = (.+)\.$/,'assembly.event.arithmetic',t,['target','left','operator','right','result'])
  ??match(text,/^(.+) bytes were reserved on the stack\.$/,'assembly.event.reserve',t,['bytes'])
  ??match(text,/^This creates (.+) bytes of space for local variables\. Reserving space does not initialize it\.$/,'assembly.event.localSpace',t,['bytes'])
  ??match(text,/^(.+): (.+) shifted left by (.+) = (.+)\. Only the low 6 count bits and low 64 result bits are used\.$/,'assembly.event.shift',t,['target','value','count','result'])
  ??match(text,/^Unsigned (.+) × (.+) = (.+)\.$/,'assembly.event.unsignedProduct',t,['left','right','result'])
  ??match(text,/^RDX:RAX holds the full 128-bit product: high (.+), low (.+)\.$/,'assembly.event.wideProduct',t,['high','low'])
  ??match(text,/^(.+) \((.+)\)(.*) \+ \((.+)\) = (.+)\.$/,'assembly.event.address',t,['base','baseValue','index','displacement','address'])
  ??match(text,/^The address was placed in (.+)\. No value was read from memory\.$/,'assembly.event.lea',t,['target'])
  ??match(text,/^Return address (.+) \(the next instruction index\) was pushed at (.+)\.$/,'assembly.event.callPush',t,['index','address'])
  ??match(text,/^Execution jumped to (.+)\. RSP decreased by 8 bytes\.$/,'assembly.event.callJump',t,['label'])
  ??match(text,/^Return address (.+) was read from (.+)\.$/,'assembly.event.returnRead',t,['index','address'])
  ??match(text,/^RSP increased to (.+)\. Execution (.+)\.$/,'assembly.event.returnResume',t,['rsp','destination'])
  ??lt(text);
}

/** Localizes parser failures without changing the program or simulator state. */
export function assemblyError(text:string,t:T){
 const line=/^Line (\d+):\s*(.+)$/.exec(text);
 if(line)return t('assembly.lineError',{line:line[1],reason:t('assembly.programError')});
 const unsupported=/^Unsupported instruction (.+) on line (\d+)\.$/.exec(text);
 if(unsupported)return t('assembly.unsupportedInstruction',{instruction:unsupported[1],line:unsupported[2]});
 return t('assembly.programError');
}
