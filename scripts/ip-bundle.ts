import {isReleaseRobots} from './release-robots';
export interface IPBundleChunk {
  file: string;
  modules: string[];
  imports: string[];
  dynamicImports: string[];
  entry: boolean;
}
export interface IPBundleArtifact {file: string; prefix: string; content?: string;}

export const ipBundleTopics = [
  'IP_T01_JAVA_BASICS', 'IP_T03_METHODS_SCOPE', 'IP_T04_CLASSES_OBJECTS',
  'IP_T05_ARRAYS_RECURSION', 'IP_T06_CONTAINER_CLASSES', 'IP_T07_COMPOSITION_LIBRARIES',
  'IP_T08_TESTING', 'IP_T09_INHERITANCE', 'IP_T10_POLYMORPHISM_BINDING',
  'IP_T11_EQUALITY_HASHING', 'IP_T12_EXCEPTIONS', 'IP_T13_DEBUGGING',
  'IP_T14_CODE_QUALITY_STRINGS_GENERICS', 'IP_T15_IO_PARSING', 'IP_T16_FUNCTIONAL_JAVA',
  'IP_T17_PROGRAM_DESIGN', 'IP_T18_MODERN_JAVA', 'IP_T19_THREADS_CONCURRENCY',
  'IP_T20_EXAM_PROGRAM_SYNTHESIS',
] as const;
export const ipBundleAssignments = [
  'air-audit', 'alert-policies', 'array-window', 'batch-token', 'boundary-tests',
  'capacity-shelf', 'grid-key', 'label-stream', 'material-ledger', 'note-index', 'reading-export',
] as const;

const modulePath = (value: string) => value.replaceAll('\\', '/').replace(/^\0/, '').replace(/[?#].*$/, '');
const isModule = (value: string, path: string) => modulePath(value) === path || modulePath(value).endsWith(`/${path}`);

export function validateIPBundle(chunks: IPBundleChunk[], files: IPBundleArtifact[]) {
  const entries = chunks.filter(chunk => chunk.entry);
  if (entries.length !== 1) throw new Error('Exactly one IP production entry is required.');
  if (new Set(chunks.map(chunk => chunk.file)).size !== chunks.length) throw new Error('Duplicate production chunk filename.');
  const byFile = new Map(chunks.map(chunk => [chunk.file, chunk]));
  for (const chunk of chunks) {
    for (const dependency of [...chunk.imports, ...chunk.dynamicImports]) {
      if (!byFile.has(dependency)) throw new Error(`Unresolved production chunk dependency: ${dependency}`);
    }
  }
  function closure(start: string, dynamic: boolean) {
    const visited = new Set<string>();
    function visit(file: string) {
      if (visited.has(file)) return;
      visited.add(file);
      const chunk = byFile.get(file)!;
      for (const dependency of dynamic ? [...chunk.imports, ...chunk.dynamicImports] : chunk.imports) visit(dependency);
    }
    visit(start);
    return visited;
  }
  const initial = closure(entries[0].file, false);
  const reachable = closure(entries[0].file, true);
  for (const chunk of chunks) {
    for (const rawModule of chunk.modules) {
      const module = modulePath(rawModule);
      if (/(?:^|\/)(?:content-pack|scripts|docs|tests)\//.test(module)
        || /(?:^|\/)src\/ip\/(?:coverage|content-lock|source-policy|source-inventory|source-review|oracles|java-oracles|java-evidence|validators?)(?:[./]|$)/.test(module)) {
        throw new Error(`IP development-only source bundled: ${rawModule}`);
      }
      if (initial.has(chunk.file) && /(?:^|\/)src\/ip\//.test(module)
        && !/(?:^|\/)src\/ip\/(?:capabilities\.json|IPStudyMode\.tsx)$/.test(module)) {
        throw new Error(`IP teaching or tools entered the initial graph: ${rawModule}`);
      }
      if (/(?:^|\/)node_modules\/(?:monaco-editor|@monaco-editor|codemirror|@codemirror)(?:\/|$)/.test(module)) {
        throw new Error(`Unapproved heavy editor dependency: ${rawModule}`);
      }
    }
  }
  function owner(path: string) {
    const matches = chunks.filter(chunk => chunk.modules.some(module => isModule(module, path)));
    if (matches.length !== 1) throw new Error(`Exactly one emitted owner required for ${path}`);
    if (!reachable.has(matches[0].file)) throw new Error(`Unreachable IP payload: ${path}`);
    return matches[0];
  }
  function independent(kind: 'topics' | 'assignments' | 'references', names: readonly string[]) {
    const expected = names.map(name => `src/ip/${kind}/${name}.json`);
    const emitted = chunks.flatMap(chunk => chunk.modules.map(modulePath)).filter(module => new RegExp(`(?:^|/)src/ip/${kind}/.*\\.json$`).test(module));
    if (emitted.length !== expected.length || emitted.some(module => !expected.some(path => isModule(module, path)))) {
      throw new Error(`Exact IP ${kind} inventory required (${expected.length}).`);
    }
    const owners = expected.map(path => owner(path));
    if (new Set(owners.map(chunk => chunk.file)).size !== expected.length) throw new Error(`IP ${kind} must have separately lazy chunks.`);
    return owners;
  }
  const topicChunks = independent('topics', ipBundleTopics);
  const assignmentChunks = independent('assignments', ipBundleAssignments);
  const referenceChunks = independent('references', ipBundleAssignments);
  const workbench = owner('src/ip/CodingWorkbench.tsx');
  const assignments = owner('src/ip/Assignments.tsx');
  const topicContent = owner('src/ip/TopicContent.tsx');
  const pilot = owner('src/ip/IntroTopicContent.tsx');
  // The published T02 lesson/cards stay in their existing pilot stores; they are not duplicated.
  owner('src/topic-study/lessons.json');
  owner('src/topic-study/flashcards.json');
  const dedicated = [...topicChunks, ...assignmentChunks, ...referenceChunks, workbench];
  if (new Set(dedicated.map(chunk => chunk.file)).size !== dedicated.length) {
    throw new Error('IP topics, assignments, references and workbench must have separate chunk boundaries.');
  }
  for (const chunk of dedicated) if (initial.has(chunk.file)) throw new Error(`IP payload is not lazy: ${chunk.file}`);
  const assignmentLoaderGraph = closure(assignments.file, false);
  if (assignmentChunks.some(chunk => assignmentLoaderGraph.has(chunk.file))) throw new Error('Assignment content must load only after task selection.');
  const topicContentGraph = closure(topicContent.file, false);
  if (topicChunks.some(chunk => topicContentGraph.has(chunk.file))) throw new Error('IP topic content must load independently.');
  const eagerRoots = [workbench, assignments, ...assignmentChunks];
  for (const start of eagerRoots) {
    const eager = closure(start.file, false);
    if (referenceChunks.some(chunk => eager.has(chunk.file))) throw new Error('IP reference solutions must stay behind the reveal boundary.');
  }
  for (const artifact of files) {
    const path = artifact.file.replaceAll('\\', '/');
    const prefix = artifact.prefix.replace(/^\uFEFF/, '').trimStart();
    const content = artifact.content ?? artifact.prefix;
    const releaseRobots=isReleaseRobots(artifact);
    if ((/\.(?:pdf|zip|txt|pages\.json)$/i.test(path)&&!releaseRobots)
      || /(?:^|\/)(?:content-pack|scripts|docs|tests)\//.test(path)
      || /(?:^|\/)(?:coverage|source-policy|oracles|java-oracles)\.json$/i.test(path)
      || /(?:Handoff|source[-_]inventory|source[-_]review|java[-_]evidence|java[-_]harness|content[-_]lock|ip[-_]baseline)/i.test(path)
      || /^(?:%PDF-|PK\x03\x04|PK\x05\x06|PK\x07\x08)/.test(prefix)
      || /DELFTSTUDY_Q1_CONTENT_PACK_2026|DelftStudy_Content_Pack\.schema\.json/.test(content)) {
      throw new Error(`IP raw or development source emitted: ${artifact.file}`);
    }
  }
  return {
    initialChunks: [...initial], topicChunks: topicChunks.map(chunk => chunk.file),
    assignmentChunks: assignmentChunks.map(chunk => chunk.file), referenceChunks: referenceChunks.map(chunk => chunk.file),
    workbenchChunk: workbench.file, pilotChunk: pilot.file,
  };
}
