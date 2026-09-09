import {describe, expect, it} from 'vitest';
import {ipBundleAssignments, ipBundleTopics, validateIPBundle, type IPBundleChunk} from '../scripts/ip-bundle';

const chunk = (file: string, modules: string[], imports: string[] = [], dynamicImports: string[] = [], entry = false): IPBundleChunk => ({file, modules, imports, dynamicImports, entry});
function validGraph(): IPBundleChunk[] {
  const topics = ipBundleTopics.map(topic => chunk(`${topic}.js`, [`src/ip/topics/${topic}.json`]));
  const assignments = ipBundleAssignments.map(slug => chunk(`${slug}-task.js`, [`src/ip/assignments/${slug}.json`]));
  const references = ipBundleAssignments.map(slug => chunk(`${slug}-reference.js`, [`src/ip/references/${slug}.json`]));
  return [
    chunk('entry.js', ['src/App.tsx', 'src/ip/IPStudyMode.tsx', 'src/ip/capabilities.json', 'src/topic-study/lessons.json', 'src/topic-study/flashcards.json'], [], ['topic-content.js', 'intro.js', ...topics.map(item => item.file)], true),
    chunk('topic-content.js', ['src/ip/TopicContent.tsx', 'src/ip/ip.css'], ['feedback.js'], ['assignments.js']),
    chunk('intro.js', ['src/ip/IntroTopicContent.tsx', 'src/ip/intro-guided.json'], ['topic-content.js']),
    chunk('feedback.js', ['src/ip/feedback.json', 'src/ip/misconceptions.json', 'src/ip/evidence.json', 'src/ip/cues.json', 'src/ip/practice.json', 'src/ip/grading.ts', 'src/ip/practice-lock.json', 'src/ip/grader-lock.json']),
    chunk('assignments.js', ['src/ip/Assignments.tsx', 'src/ip/assignment-index.json'], [], ['workbench.js', ...assignments.map(item => item.file)]),
    chunk('workbench.js', ['src/ip/CodingWorkbench.tsx'], [], references.map(item => item.file)),
    ...topics, ...assignments, ...references,
  ];
}
function merge(graph: IPBundleChunk[], target: string, source: string) {
  const into = graph.find(item => item.file === target)!;
  const from = graph.find(item => item.file === source)!;
  into.modules.push(...from.modules);
  into.imports.push(...from.imports);
  into.dynamicImports.push(...from.dynamicImports);
  graph.splice(graph.indexOf(from), 1);
  for (const item of graph) {
    item.imports = [...new Set(item.imports.map(file => file === source ? target : file))];
    item.dynamicImports = [...new Set(item.dynamicImports.map(file => file === source ? target : file))];
  }
}

describe('IP production payload boundaries', () => {
  it('accepts exact lazy inventories and preserves the existing published pilot stores', () => {
    const result = validateIPBundle(validGraph(), [{file: 'assets/index.js', prefix: 'const application='}]);
    expect(result.topicChunks).toHaveLength(19);
    expect(result.assignmentChunks).toHaveLength(11);
    expect(result.referenceChunks).toHaveLength(11);
    expect(result.initialChunks).toEqual(['entry.js']);
    expect(result.workbenchChunk).toBe('workbench.js');
    expect(result.pilotChunk).toBe('intro.js');
  });
  it('requires exactly one entry instead of silently accepting an uninspected second graph', () => {
    const graph = validGraph();
    graph[1].entry = true;
    expect(() => validateIPBundle(graph, [])).toThrow('Exactly one');
    graph[0].entry = false; graph[1].entry = false;
    expect(() => validateIPBundle(graph, [])).toThrow('Exactly one');
  });
  it('rejects unresolved dependency edges rather than overlooking their payload', () => {
    const graph = validGraph(); graph[0].imports.push('missing.js');
    expect(() => validateIPBundle(graph, [])).toThrow('Unresolved production chunk');
  });
  it('rejects duplicate chunk filenames', () => {
    const graph = validGraph(); graph.push({...graph[1]});
    expect(() => validateIPBundle(graph, [])).toThrow('Duplicate production chunk');
  });
  it.each(['topics', 'assignments', 'references'] as const)('requires the exact %s module inventory', kind => {
    const graph = validGraph();
    const item = graph.find(candidate => candidate.modules.some(module => module.startsWith(`src/ip/${kind}/`)))!;
    item.modules[0] = `src/ip/${kind}/unexpected.json`;
    expect(() => validateIPBundle(graph, [])).toThrow(`Exact IP ${kind} inventory`);
  });
  it('rejects an extra duplicated IP_T02 lesson instead of treating it as a new twentieth payload', () => {
    const graph = validGraph();
    graph.push(chunk('new-pilot.js', ['src/ip/topics/IP_T02_CONTROL_FLOW.json']));
    graph[0].dynamicImports.push('new-pilot.js');
    expect(() => validateIPBundle(graph, [])).toThrow('Exact IP topics inventory');
  });
  it.each([
    ['topics', `${ipBundleTopics[0]}.js`, `${ipBundleTopics[1]}.js`],
    ['assignments', 'air-audit-task.js', 'alert-policies-task.js'],
    ['references', 'air-audit-reference.js', 'alert-policies-reference.js'],
  ])('rejects merged %s payloads', (kind, first, second) => {
    const graph = validGraph(); merge(graph, first, second);
    expect(() => validateIPBundle(graph, [])).toThrow(`IP ${kind} must have separately lazy chunks`);
  });
  it('rejects a topic and an assignment sharing a single content chunk', () => {
    const graph = validGraph(); merge(graph, `${ipBundleTopics[0]}.js`, 'air-audit-task.js');
    expect(() => validateIPBundle(graph, [])).toThrow('separate chunk boundaries');
  });
  it('rejects an emitted but unreachable reference chunk', () => {
    const graph = validGraph();
    const workbench = graph.find(item => item.file === 'workbench.js')!;
    workbench.dynamicImports = workbench.dynamicImports.filter(file => file !== 'air-audit-reference.js');
    expect(() => validateIPBundle(graph, [])).toThrow('Unreachable IP payload');
  });
  it('requires the preserved pilot lesson and flashcard stores', () => {
    const graph = validGraph(); graph[0].modules = graph[0].modules.filter(module => module !== 'src/topic-study/flashcards.json');
    expect(() => validateIPBundle(graph, [])).toThrow('Exactly one emitted owner required for src/topic-study/flashcards.json');
  });
  it.each([
    'src/ip/practice.json', 'src/ip/feedback.json', 'src/ip/evidence.json', 'src/ip/cues.json',
    'src/ip/CodingWorkbench.tsx', 'src/ip/assignment-index.json', 'src/ip/grading.ts',
  ])('keeps %s out of the initial graph', module => {
    const graph = validGraph(); graph[0].modules.push(module);
    expect(() => validateIPBundle(graph, [])).toThrow('initial graph');
  });
  it('follows a transitive static import cycle without hanging or missing early content', () => {
    const graph = validGraph(); graph[0].imports.push('bridge.js');
    graph.push(chunk('bridge.js', ['src/bridge.ts'], ['entry.js', 'feedback.js']));
    expect(() => validateIPBundle(graph, [])).toThrow('initial graph');
  });
  it.each(['workbench.js', 'assignments.js', 'air-audit-task.js'])('keeps reference imports lazy from %s', file => {
    const graph = validGraph(); graph.find(item => item.file === file)!.imports.push('air-audit-reference.js');
    expect(() => validateIPBundle(graph, [])).toThrow('reveal boundary');
  });
  it('does not eagerly load all assignments on entering the task menu', () => {
    const graph = validGraph(); graph.find(item => item.file === 'assignments.js')!.imports.push('air-audit-task.js');
    expect(() => validateIPBundle(graph, [])).toThrow('only after task selection');
  });
  it('does not eagerly import all topics through the shared content view', () => {
    const graph = validGraph(); graph.find(item => item.file === 'topic-content.js')!.imports.push(`${ipBundleTopics[0]}.js`);
    expect(() => validateIPBundle(graph, [])).toThrow('load independently');
  });
  it.each([
    'src/ip/coverage.json', 'src/ip/content-lock.json?commonjs-proxy', 'src/ip/source-policy.json',
    'src/ip/source-review.json', 'src/ip/oracles.ts', 'src/ip/java-oracles/cases.json',
    'src/ip/validator.ts', 'scripts/verify-ip-assignments.ts', 'docs/ip-source-review.md',
    'tests/ip-reference.test.ts', 'content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json',
    'C:\\checkout\\src\\ip\\content-lock.json',
  ])('rejects development-only module %s even when lazy', module => {
    const graph = validGraph(); graph[1].modules.push(module);
    expect(() => validateIPBundle(graph, [])).toThrow('development-only');
  });
  it.each(['node_modules/monaco-editor/editor.js', 'node_modules/@codemirror/view/index.js'])('rejects unexpected heavy editor %s', module => {
    const graph = validGraph(); graph[1].modules.push(module);
    expect(() => validateIPBundle(graph, [])).toThrow('heavy editor');
  });
  it.each([
    'lecture.pdf', 'source.ZIP', 'notes.txt', 'book.pages.json', 'DelftStudy_Codex_Handoff_Pack.json',
    'ip-source-inventory.json', 'ip-source-review.md', 'ip-assignment-java-evidence.json',
    'ip-content-lock.json', 'coverage.json', 'source-policy.json', 'oracles.json',
    'docs/renamed.json', 'scripts/renamed.js', 'content-pack/renamed.json',
  ])('rejects emitted source/development asset %s', file => {
    expect(() => validateIPBundle(validGraph(), [{file, prefix: ''}])).toThrow('source emitted');
  });
  it.each(['%PDF-1.7', '\uFEFF  %PDF-1.7', 'PK\x03\x04payload', 'PK\x05\x06', 'PK\x07\x08'])('rejects raw document bytes behind an unrelated extension (%s)', prefix => {
    expect(() => validateIPBundle(validGraph(), [{file: 'asset.bin', prefix}])).toThrow('source emitted');
  });
  it('finds a renamed full Handoff payload beyond the inspected prefix', () => {
    expect(() => validateIPBundle(validGraph(), [{file: 'assets/innocent.js', prefix: 'const data=', content: 'const data={"pack_id":"DELFTSTUDY_Q1_CONTENT_PACK_2026"};'}])).toThrow('source emitted');
  });
});
