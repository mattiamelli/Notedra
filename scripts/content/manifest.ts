import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { EMBEDDING_FLAGS, EXPECTED_COUNTS, EXPECTED_RELATIONS, HANDOFF_FILE, MANIFEST_SHA256, PACK_DIRECTORY, PACK_FILES, PACK_ID, PACK_VERSION, SCHEMA_FILE, SCHEMA_VERSION } from './constants.ts';
import { isRecord, type ReportIssue } from './types.ts';

export const sha256 = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex');
export function loadPackFiles(directory = fileURLToPath(PACK_DIRECTORY)): Map<string, Buffer> {
  const names = readdirSync(directory);
  if (names.length !== PACK_FILES.length || names.some(name => !PACK_FILES.includes(name as typeof PACK_FILES[number]))) {
    throw new Error('Content Pack directory must contain exactly the nine preserved release files.');
  }
  return new Map(PACK_FILES.map(name => {
    const path = join(directory, name);
    if (!lstatSync(path).isFile()) throw new Error(`Expected a regular pack file, not a symlink or directory: ${name}`);
    return [name, readFileSync(path)];
  }));
}
export function parseJson(bytes: Uint8Array | undefined, filename: string): unknown {
  if (!bytes) throw new Error(`Missing ${filename}`);
  try { return JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown; }
  catch (error) { throw new Error(`Invalid JSON in ${filename}: ${error instanceof Error ? error.message : String(error)}`); }
}
export function verifyManifest(files: ReadonlyMap<string, Uint8Array>, report: ReportIssue): unknown {
  for (const name of PACK_FILES) if (!files.has(name)) report('MANIFEST', name, 'Missing release file.');
  for (const name of files.keys()) if (!PACK_FILES.includes(name as typeof PACK_FILES[number])) report('MANIFEST', name, 'Unexpected release file.');
  const bytes = files.get('manifest.json');
  if (bytes && sha256(bytes) !== MANIFEST_SHA256) report('MANIFEST', 'manifest.json', 'Manifest differs from the SHA-256 pinned at the trusted import checkpoint.');
  let manifest: unknown;
  try { manifest = parseJson(bytes, 'manifest.json'); } catch (error) { report('MANIFEST', 'manifest.json', String(error)); return null; }
  if (!isRecord(manifest) || !Array.isArray(manifest.files)) { report('MANIFEST', 'manifest.json', 'Expected manifest object and files array.'); return null; }
  for (const [key, expected] of Object.entries({pack_version: PACK_VERSION, schema_version: SCHEMA_VERSION, pack_id: PACK_ID})) {
    if (manifest[key] !== expected) report('MANIFEST', key, `Expected ${expected}.`);
  }
  const seen = new Set<string>();
  for (const entry of manifest.files) {
    if (!isRecord(entry) || typeof entry.path !== 'string' || !PACK_FILES.includes(entry.path as typeof PACK_FILES[number])) {
      report('MANIFEST', 'files', 'Invalid or unexpected manifest file path.'); continue;
    }
    const name = entry.path;
    if (seen.has(name)) report('MANIFEST', name, 'Duplicate manifest entry.');
    seen.add(name);
    // The supplied manifest explicitly excludes its own checksum to avoid recursion.
    if (name === 'manifest.json') {
      if (entry.sha256 !== null || entry.size_bytes !== 'SELF') report('MANIFEST', name, 'Invalid self-checksum declaration.');
      continue;
    }
    const file = files.get(name);
    if (!file) continue;
    if (file.byteLength !== entry.size_bytes) report('MANIFEST', name, 'File size does not match the manifest.');
    if (sha256(file) !== entry.sha256) report('MANIFEST', name, 'SHA-256 checksum mismatch.');
  }
  for (const name of PACK_FILES) if (!seen.has(name)) report('MANIFEST', name, 'File is not listed by the manifest.');
  const source = isRecord(manifest.source_corpus) ? manifest.source_corpus : {};
  for (const [key, expected] of Object.entries(EMBEDDING_FLAGS)) {
    if (source[key] !== expected) report('MANIFEST', `source_corpus/${key}`, `Expected ${expected}; PDF binaries/full text are not embedded.`);
  }
  for (const [key, expected] of Object.entries({data_counts: EXPECTED_COUNTS, relation_counts: EXPECTED_RELATIONS})) {
    const actual = manifest[key];
    if (!isRecord(actual)) report('MANIFEST', key, 'Missing counts.');
    else for (const [field, value] of Object.entries(expected)) {
      if (isRecord(value)) {
        const nested = actual[field];
        for (const [subject, count] of Object.entries(value)) if (!isRecord(nested) || nested[subject] !== count) report('MANIFEST', `${key}/${field}/${subject}`, `Expected ${count}.`);
      } else if (actual[field] !== value) report('MANIFEST', `${key}/${field}`, `Expected ${value}.`);
    }
  }
  return manifest;
}
export function readDocuments(files: ReadonlyMap<string, Uint8Array>) {
  return {pack: parseJson(files.get(HANDOFF_FILE), HANDOFF_FILE), schema: parseJson(files.get(SCHEMA_FILE), SCHEMA_FILE)};
}
