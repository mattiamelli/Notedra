/** Explicit teaching models, independent of React, grading and student storage. */
function integer(name: string, value: number, minimum: number, maximum: number): number {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return value;
}
function power(name: string, value: number, maximum = 2 ** 24): number {
  integer(name, value, 1, maximum);
  if (!Number.isInteger(Math.log2(value))) throw new Error(`${name} must be a power of two.`);
  return Math.log2(value);
}
export type BooleanOperation = 'and' | 'or' | 'xor' | 'nand';
export function truthTable(operation: BooleanOperation) {
  if (!['and', 'or', 'xor', 'nand'].includes(operation)) throw new Error('Unknown Boolean operation.');
  return [0, 1, 2, 3].map(index => {
    const a = index >= 2; const b = index % 2 === 1;
    const value = operation === 'and' ? a && b : operation === 'or' ? a || b : operation === 'xor' ? a !== b : !(a && b);
    return {a, b, value};
  });
}
export function fixedPoint(bits: string, fractionBits: number, signed: boolean) {
  if (!/^[01]{1,16}$/.test(bits)) throw new Error('Use 1–16 binary digits.');
  integer('Fraction bits', fractionBits, 0, bits.length);
  const raw = parseInt(bits, 2); const width = bits.length;
  const stored = signed && bits[0] === '1' ? raw - 2 ** width : raw;
  const scale = 2 ** fractionBits;
  return {value: stored / scale, step: 1 / scale, minimum: signed ? -(2 ** (width - 1)) / scale : 0,
    maximum: (2 ** (signed ? width - 1 : width) - 1) / scale};
}
export interface FloatingFormat { exponentBits: number; fractionBits: number; bias: number; }
/** All exponent codes are ordinary; hidden leading 1; no zero, subnormal, infinity or NaN. */
export function customFloat(format: FloatingFormat, sign: number, exponent: number, fraction: number) {
  integer('Exponent width', format.exponentBits, 1, 5); integer('Fraction width', format.fractionBits, 1, 10);
  integer('Bias', format.bias, -16, 16); integer('Sign', sign, 0, 1);
  const lastExponent = 2 ** format.exponentBits - 1;
  integer('Stored exponent', exponent, 0, lastExponent); integer('Stored fraction', fraction, 0, 2 ** format.fractionBits - 1);
  const significand = 1 + fraction / 2 ** format.fractionBits;
  const actualExponent = exponent - format.bias;
  return {value: (sign ? -1 : 1) * significand * 2 ** actualExponent, significand, actualExponent,
    spacing: 2 ** (actualExponent - format.fractionBits), minimumPositive: 2 ** -format.bias,
    maximumFinite: (2 - 2 ** -format.fractionBits) * 2 ** (lastExponent - format.bias)};
}
export function isaBudget(length: number, registerCount: number, registerFields: number, addressBits: number) {
  integer('Instruction length', length, 1, 64); integer('Registers', registerCount, 1, 256);
  integer('Register fields', registerFields, 0, 4); integer('Address bits', addressBits, 0, 64);
  const registerBits = Math.ceil(Math.log2(registerCount));
  const opcodeBits = length - registerFields * registerBits - addressBits;
  if (opcodeBits < 0) throw new Error('The requested fields do not fit in the instruction.');
  return {registerBits, opcodeBits, opcodeCapacity: 2n ** BigInt(opcodeBits), unusedRegisterCodes: 2 ** registerBits - registerCount};
}
export function addressAliases(addressBits: number, address: number, ignored: readonly number[]) {
  integer('Address width', addressBits, 1, 16); integer('Address', address, 0, 2 ** addressBits - 1);
  if (ignored.length > 8 || new Set(ignored).size !== ignored.length) throw new Error('Choose at most eight distinct ignored bits.');
  ignored.forEach(bit => integer('Ignored bit', bit, 0, addressBits - 1));
  const base = ignored.reduce((value, bit) => value - (Math.floor(value / 2 ** bit) % 2) * 2 ** bit, address);
  let aliases = [base];
  for (const bit of ignored) aliases = aliases.flatMap(value => [value, value + 2 ** bit]);
  return aliases.sort((a, b) => a - b);
}
export function memoryOrganization(words: number, wordBits: number, chipWords: number, chipBits: number) {
  const boardAddressPins = power('Board words', words); const chipAddressPins = power('Chip words', chipWords);
  integer('Word bits', wordBits, 1, 256); integer('Chip data bits', chipBits, 1, 256);
  if (words % chipWords || wordBits % chipBits) throw new Error('This exact organization requires whole depth and width multiples of a chip.');
  return {depthGroups: words / chipWords, parallelChips: wordBits / chipBits, chips: words / chipWords * (wordBits / chipBits),
    boardAddressPins, chipAddressPins, chipDataPins: chipBits, capacityBits: words * wordBits};
}
export function interleave(wordAddress: number, banks: number) {
  integer('Word address', wordAddress, 0, 2 ** 24 - 1); power('Banks', banks, 64);
  return {bank: wordAddress % banks, row: Math.floor(wordAddress / banks)};
}
export interface CacheConfig { addressBits: number; blockBytes: number; sets: number; ways: number; }
export function cacheFields(config: CacheConfig, address: number) {
  integer('Address width', config.addressBits, 1, 32);
  const offsetBits = power('Block bytes', config.blockBytes); const indexBits = power('Sets', config.sets, 64);
  integer('Ways', config.ways, 1, 8);
  if (config.sets * config.ways > 64) throw new Error('This workspace supports at most 64 cache lines.');
  const tagBits = config.addressBits - offsetBits - indexBits;
  if (tagBits < 0) throw new Error('Offset and index exceed the address width.');
  integer('Byte address', address, 0, 2 ** config.addressBits - 1);
  const block = Math.floor(address / config.blockBytes);
  return {offsetBits, indexBits, tagBits, block, offset: address % config.blockBytes, set: block % config.sets,
    tag: Math.floor(block / config.sets), dataBytes: config.blockBytes * config.sets * config.ways};
}
export interface CacheStep { address: number; set: number; tag: number; hit: boolean; evicted: number | null; sets: number[][]; }
/** Empty, read-allocate cache; each set stores tags from least to most recently used. */
export function cacheTrace(config: CacheConfig, addresses: readonly number[]): CacheStep[] {
  cacheFields(config, 0);
  if (addresses.length > 64) throw new Error('Use at most 64 read addresses.');
  const decoded = addresses.map(address => cacheFields(config, address));
  const sets: number[][] = Array.from({length: config.sets}, () => []);
  return decoded.map((field, index) => {
    const line = sets[field.set]; const prior = line.indexOf(field.tag); const hit = prior >= 0;
    let evicted: number | null = null;
    if (hit) line.splice(prior, 1);
    else if (line.length === config.ways) evicted = line.shift()!;
    line.push(field.tag);
    return {address: addresses[index], set: field.set, tag: field.tag, hit, evicted, sets: sets.map(tags => [...tags])};
  });
}
export interface PipelineInstruction { label: string; kind: 'alu' | 'load'; dependencies: number[]; }
/** Five equal stages F,D,X,M,W; in order; fetch may wait; same-cycle W→D register access. */
export function pipelineSchedule(program: readonly PipelineInstruction[], forwarding: boolean) {
  if (!program.length || program.length > 12) throw new Error('Use 1–12 abstract instructions.');
  const rows: {label: string; kind: 'alu' | 'load'; start: number; stalls: number; stages: number[]}[] = [];
  program.forEach((instruction, index) => {
    if (!['alu', 'load'].includes(instruction.kind) || !instruction.label || instruction.label.length > 80) throw new Error('Invalid abstract instruction.');
    if (new Set(instruction.dependencies).size !== instruction.dependencies.length) throw new Error('Duplicate dependency.');
    instruction.dependencies.forEach(producer => integer('Earlier producer index', producer, 0, index - 1));
    const earliest = index ? rows[index - 1].start + 1 : 1;
    const start = Math.max(earliest, ...instruction.dependencies.map(producer => rows[producer].start +
      (forwarding ? (rows[producer].kind === 'load' ? 2 : 1) : 3)));
    rows.push({label: instruction.label, kind: instruction.kind, start, stalls: start - earliest,
      stages: [0, 1, 2, 3, 4].map(offset => start + offset)});
  });
  return {rows, cycles: rows.at(-1)!.start + 4, stalls: rows.reduce((sum, row) => sum + row.stalls, 0)};
}
export function pipelineCycles(instructions: number, stages: number, insertedStalls: number) {
  integer('Instructions', instructions, 1, 1_000_000); integer('Stages', stages, 1, 32);
  integer('Inserted stall cycles', insertedStalls, 0, 1_000_000);
  return stages + instructions - 1 + insertedStalls;
}
export function amdahl(serialFraction: number, processors: number) {
  if (!Number.isFinite(serialFraction) || serialFraction < 0 || serialFraction > 1) throw new Error('Serial fraction must be from 0 to 1.');
  integer('Processors', processors, 1, 1_000_000);
  const relativeTime = serialFraction + (1 - serialFraction) / processors;
  return {relativeTime, speedup: 1 / relativeTime, upperLimit: serialFraction === 0 ? Infinity : 1 / serialFraction};
}
export interface VMConfig { virtualBits: number; physicalBits: number; pageBits: number; entryBytes: number; }
export function vmLayout(config: VMConfig) {
  integer('Virtual bits', config.virtualBits, 1, 32); integer('Physical bits', config.physicalBits, 1, 32);
  integer('Offset bits', config.pageBits, 0, Math.min(config.virtualBits, config.physicalBits));
  integer('Entry bytes', config.entryBytes, 1, 16);
  const pages = 2 ** (config.virtualBits - config.pageBits);
  return {pageBytes: 2 ** config.pageBits, pages, frames: 2 ** (config.physicalBits - config.pageBits),
    virtualPageBits: config.virtualBits - config.pageBits, frameBits: config.physicalBits - config.pageBits,
    tableBytes: pages * config.entryBytes};
}
export function translateVM(config: VMConfig, virtualAddress: number, frame: number, present: boolean, writable: boolean, write: boolean) {
  const layout = vmLayout(config);
  integer('Virtual address', virtualAddress, 0, 2 ** config.virtualBits - 1); integer('Frame', frame, 0, layout.frames - 1);
  const page = Math.floor(virtualAddress / layout.pageBytes); const offset = virtualAddress % layout.pageBytes;
  if (!present) return {status: 'NOT_PRESENT' as const, page, offset};
  if (write && !writable) return {status: 'PROTECTION_FAULT' as const, page, offset};
  return {status: 'TRANSLATED' as const, page, offset, physicalAddress: frame * layout.pageBytes + offset};
}
