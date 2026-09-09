import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { build, normalizePath } from 'vite';
import { contentBuildGuard } from '../scripts/content/build-guard';
import { HANDOFF_FILE, PACK_DIRECTORY } from '../scripts/content/constants';
import { loadPackFiles, readDocuments } from '../scripts/content/manifest';
import { validateContentData } from '../scripts/content/validate';
import type { ContentPack, ValidationReport } from '../scripts/content/types';

async function fixtureBuild(source: string, validation?: () => ValidationReport) {
  const root = await mkdtemp(join(tmpdir(), 'delftstudy-build-'));
  try {
    const entry = join(root, 'entry.js');
    await writeFile(entry, source);
    return await build({
      configFile: false, root, logLevel: 'silent', publicDir: false,
      plugins: [contentBuildGuard(validation)],
      build: {write: false, rollupOptions: {input: entry}},
    });
  } finally {
    await rm(root, {recursive: true, force: true});
  }
}

describe('production content gate', () => {
  it('allows a production build with the trusted release', async () => {
    await expect(fixtureBuild('console.log("fixture");')).resolves.toBeDefined();
  });
  it('stops Vite when an in-memory pack mutation fails validation', async () => {
    const {pack, schema} = readDocuments(loadPackFiles());
    (pack as ContentPack).counts.documents_total = 91;
    await expect(fixtureBuild('console.log("fixture");', () => validateContentData(pack, schema)))
      .rejects.toThrow('Content Pack v1.0.1 validation failed');
  });
  it.each(['', '?raw'])('blocks full handoff browser imports%s', async suffix => {
    const path = normalizePath(fileURLToPath(new URL(HANDOFF_FILE, PACK_DIRECTORY)));
    await expect(fixtureBuild(`import pack from ${JSON.stringify(path + suffix)}; console.log(pack);`))
      .rejects.toThrow('browser imports are not allowed in Step 1');
  });
});
