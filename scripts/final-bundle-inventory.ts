import type {Plugin} from 'vite';
import {relative} from 'node:path';
import {gzipSync} from 'node:zlib';
export interface MeasuredBundleChunk {
  file: string; bytes: number; gzipBytes: number; entry: boolean;
  imports: string[]; dynamicImports: string[]; modules: string[];
}
export interface MeasuredBundleAsset {file: string; bytes: number; gzipBytes: number;}
export function finalBundleInventory(name: string) {
  const chunks: MeasuredBundleChunk[] = [];
  const assets: MeasuredBundleAsset[] = [];
  const plugin: Plugin = {
    name,
    // Vite may remove pure-CSS JS chunks and rewrite imports during generateBundle.
    // writeBundle observes the final graph instead of retaining deleted intermediate entries.
    writeBundle(_options, bundle) {
      chunks.length = 0; assets.length = 0;
      for (const [file, output] of Object.entries(bundle)) {
        const bytes = output.type === 'chunk' ? Buffer.from(output.code) : Buffer.from(output.source);
        if (output.type === 'chunk') chunks.push({
          file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length, entry: output.isEntry,
          imports: [...output.imports], dynamicImports: [...output.dynamicImports],
          modules: Object.keys(output.modules).map(id => relative(process.cwd(), id).replaceAll('\\', '/')),
        });
        else assets.push({file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length});
      }
    },
  };
  return {chunks, assets, plugin};
}
