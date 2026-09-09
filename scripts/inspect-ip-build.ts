// Reuse the accepted final-asset/module-graph collector; it runs Vite with every content gate.
import './inspect-enrichment-build';
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {relative} from 'node:path';
import {gzipSync} from 'node:zlib';
import {validateIPBundle, type IPBundleChunk} from './ip-bundle';

interface MeasuredChunk extends IPBundleChunk {bytes: number; gzipBytes: number;}
interface PreviousReport {
  chunks: MeasuredChunk[];
  initialJSBytes: number;
  initialJSGzipBytes: number;
  totalAssetBytes: number;
  totalAssetGzipBytes: number;
  totalProductionBytes: number;
  totalProductionGzipBytes: number;
}
const report = JSON.parse(readFileSync('docs/rl-bundle-report.json', 'utf8')) as PreviousReport;
const files = readdirSync('dist', {recursive: true, withFileTypes: true}).filter(entry => entry.isFile()).map(entry => {
  const file = relative('dist', `${entry.parentPath}/${entry.name}`);
  const bytes = readFileSync(`dist/${file}`);
  return {file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length, prefix: bytes.subarray(0, 2048).toString(), content: bytes.toString()};
});
const checked = validateIPBundle(report.chunks, files);
function measure(names: string[]) {
  const chunks = names.map(name => {
    const chunk = report.chunks.find(candidate => candidate.file === name)!;
    const file = files.find(candidate => candidate.file === name)!;
    return {file: name, bytes: file.bytes, gzipBytes: file.gzipBytes, modules: chunk.modules};
  });
  return {bytes: chunks.reduce((sum, chunk) => sum + chunk.bytes, 0), gzipBytes: chunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0), chunks};
}
const result = {
  initialJSBytes: report.initialJSBytes,
  initialJSGzipBytes: report.initialJSGzipBytes,
  baseline: {commit: 'bda8c0f', initialJSBytes: 475077, initialJSGzipBytes: 125104, totalAssetBytes: 984932, totalAssetGzipBytes: 283837, totalProductionBytes: 985928, totalProductionGzipBytes: 284486},
  initialDeltaBytes: report.initialJSBytes - 475077,
  initialDeltaGzipBytes: report.initialJSGzipBytes - 125104,
  initialChunks: checked.initialChunks,
  ipTopics: measure(checked.topicChunks),
  codingWorkbench: measure([checked.workbenchChunk]),
  assignments: measure(checked.assignmentChunks),
  referenceSolutions: measure(checked.referenceChunks),
  preservedPilot: measure([checked.pilotChunk]),
  totalAssetBytes: report.totalAssetBytes,
  totalAssetGzipBytes: report.totalAssetGzipBytes,
  totalProductionBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  totalProductionGzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0),
  files: files.map(({file, bytes, gzipBytes}) => ({file, bytes, gzipBytes})),
  checks: [
    '19 separately lazy new IP topics; preserved T02 pilot uses existing lesson/card stores',
    '11 separately lazy assignments selected on demand',
    '11 separately lazy original reference solutions remain behind reveal',
    'CodingWorkbench has its own lazy chunk and no large editor dependency',
    'Only IP capability counts and the lightweight IPStudyMode loader may enter the initial graph',
    'IP teaching, practice, feedback, evidence, cues and workbench absent from the initial graph',
    'IP build-only coverage/locks/source-review/oracles, scripts, docs and tests absent from every chunk',
    'No raw PDF/ZIP/text, source inventory, Java verification evidence or full Handoff emitted',
    'CO/RL/enrichment module gates and all Vite content gates executed unchanged',
    'Sizes measured from final emitted assets after Vite rewriting; per-file gzip measured independently',
  ],
};
writeFileSync('docs/ip-bundle-report.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(`IP bundle PASS: ${checked.topicChunks.length} topics, ${checked.assignmentChunks.length} assignments, ${checked.referenceChunks.length} references; initial JS ${result.initialJSBytes} bytes (${result.initialJSGzipBytes} gzip). See docs/ip-bundle-report.json.`);
