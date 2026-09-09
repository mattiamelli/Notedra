import {mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, relative} from 'node:path';
import {gzipSync} from 'node:zlib';
import {expect, it} from 'vitest';
import {build, type Plugin} from 'vite';
import {finalBundleInventory} from '../scripts/final-bundle-inventory';

it('review regression: records the emitted graph after Vite removes a shared pure-CSS JS chunk', async () => {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'delftstudy-final-bundle-')));
  try {
    writeFileSync(join(directory, 'index.html'), '<div id="root"></div><script type="module" src="/main.js"></script>');
    writeFileSync(join(directory, 'main.js'), 'document.querySelector("#root").textContent="ready";window.loadA=()=>import("./a.js");window.loadB=()=>import("./b.js");');
    writeFileSync(join(directory, 'a.js'), 'import "./shared.css";export const label="A";');
    writeFileSync(join(directory, 'b.js'), 'import "./shared.css";export const label="B";');
    writeFileSync(join(directory, 'shared.css'), '.shared{color:#1432ab}');
    const early: string[] = [];
    const earlyObserver: Plugin = {name: 'observe-before-css-cleanup', generateBundle(_options, bundle) {early.push(...Object.keys(bundle));}};
    const inventory = finalBundleInventory('review-final-inventory');
    const output = join(directory, 'dist');
    await build({root: directory, configFile: false, logLevel: 'silent', plugins: [earlyObserver, inventory.plugin],
      build: {outDir: output, minify: false, rollupOptions: {output: {manualChunks(id) {if (id.endsWith('/shared.css')) return 'shared-style';}}}},
    });
    const files = readdirSync(output, {recursive: true, withFileTypes: true}).filter(entry => entry.isFile()).map(entry => relative(output, join(entry.parentPath, entry.name)));
    const removedCssJs = early.find(file => /shared-style.*\.js$/.test(file));
    expect(removedCssJs, 'fixture must reproduce the temporary pure-CSS JS chunk').toBeDefined();
    expect(files).not.toContain(removedCssJs);
    const recorded = [...inventory.chunks, ...inventory.assets];
    expect(recorded.map(item => item.file).sort()).toEqual([...files].sort());
    for (const item of recorded) {
      const bytes = readFileSync(join(output, item.file));
      expect(item.bytes).toBe(bytes.length);
      expect(item.gzipBytes).toBe(gzipSync(bytes).length);
    }
    const names = new Set(inventory.chunks.map(chunk => chunk.file));
    for (const chunk of inventory.chunks) for (const dependency of [...chunk.imports, ...chunk.dynamicImports]) expect(names.has(dependency)).toBe(true);
    expect(inventory.chunks.filter(chunk => chunk.entry)).toHaveLength(1);
    expect(inventory.chunks.some(chunk => chunk.modules.some(module => module.endsWith('/a.js')))).toBe(true);
    expect(inventory.chunks.some(chunk => chunk.modules.some(module => module.endsWith('/b.js')))).toBe(true);
    expect(inventory.assets.some(asset => asset.file.endsWith('.css'))).toBe(true);
  } finally {rmSync(directory, {recursive: true, force: true});}
});
