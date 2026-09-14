import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {beforeHardening, hardeningHash} from '../scripts/hardening-preservation';
import lock from '../scripts/hardening-preservation.json';

const baseline = '6f59a44f484a95bf974bd2b6e25710030ff5dbc1';
const files = ['src/AssemblyWorkbench.tsx', 'src/components/CodeEditor.tsx', 'src/components/ControlPanel.tsx', 'src/components/RegisterPanel.tsx', 'src/components/StackVisualizer.tsx', 'src/components/ExecutionHistory.tsx', 'src/components/InstructionExplanation.tsx', 'src/engine/instructions.ts', 'src/engine/memory.ts', 'src/engine/parser.ts', 'src/engine/types.ts', 'src/utils/useSimulator.ts', 'tests/parser.test.ts'];
const sha = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const original = (file: string) => execFileSync('git', ['show', `${baseline}:${file}`]);

describe('exact Assembly maintenance preservation', () => {
  it.each(files)('pins only the accepted delta for %s and rejects further edits', file => {
    const entry = (lock as Record<string, {before: string; after: string; original?: string}>)[file];
    const current = readFileSync(file);
    expect(entry.after).toBe(sha(current));
    expect(entry.original ?? entry.before).toBe(sha(execFileSync('git',['show',`6d1b9dfd3fb148ba7097e7ed238e600da2a81deb:${file}`])));
    expect(beforeHardening(file, current)).toEqual(original(file));
    expect(hardeningHash(file, entry.before)).toBe(entry.after);
    if(entry.original) expect(hardeningHash(file,entry.original)).toBe(entry.after);
    expect(() => beforeHardening(file, Buffer.concat([current, Buffer.from('\n// unaccepted edit')]))).toThrow('Unaccepted hardening change');
    expect(() => hardeningHash(file, 'incorrect prior hash')).toThrow('Unrecognized hardening baseline');
  });
  it('retains Assembly history while allowing later accepted maintenance layers', () => {
    for (const file of files) expect((lock as Record<string, unknown>)[file]).toBeDefined();
    expect(Object.keys(lock).filter(file => files.includes(file)).sort()).toEqual([...files].sort());
  });
  it.each(['scripts/ip-baseline.json', 'scripts/enrichment-baseline.json'])('preserves unrelated hashes and all paths in %s', manifest => {
    const previous = JSON.parse(original(manifest).toString()) as Record<string, string>;
    const current = JSON.parse(readFileSync(manifest, 'utf8')) as Record<string, string>;
    expect(Object.keys(current)).toEqual(Object.keys(previous));
    for (const file of Object.keys(previous)) {
      expect(current[file]).toBe(files.includes(file) ? sha(readFileSync(file)) : previous[file]);
    }
  });
});
