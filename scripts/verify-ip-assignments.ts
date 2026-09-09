import {createHash} from 'node:crypto';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

// Development-only verification of this fixed, reviewed reference inventory.
// No learner draft, request parameter or arbitrary source path reaches this tool.
const slugs = ['array-window', 'grid-key', 'batch-token', 'boundary-tests', 'label-stream',
  'capacity-shelf', 'alert-policies', 'reading-export', 'material-ledger', 'air-audit', 'note-index'];
interface CodeFile {name: string; language: 'java' | 'text'; content: string;}
interface Reference {id: string; assignmentId: string; files: CodeFile[];}
interface Harness {slug: string; source: string; independentReasoning: string[];}
const root = resolve(import.meta.dirname, '..');
const javaHome = process.env.DELFTSTUDY_JAVA_HOME ?? process.env.JAVA_HOME ?? '/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home';
function run(binary: string, args: string[], cwd: string) {
  const result = spawnSync(join(javaHome, 'bin', binary), args, {
    cwd, encoding: 'utf8', timeout: 30_000, maxBuffer: 2_000_000,
  });
  if (result.error || result.status !== 0) throw new Error(`${binary} failed: ${result.error?.message ?? ''}\n${result.stdout}\n${result.stderr}`);
  return result;
}
const checksum = (text: string) => createHash('sha256').update(text).digest('hex');
const checkSource = String.raw`import java.util.*;
import java.nio.charset.StandardCharsets;
public final class Check {
  @FunctionalInterface interface Action { void run() throws Exception; }
  static void eq(String id, Object actual, Object expected) {
    if (!Objects.equals(actual, expected)) throw new AssertionError(id + ": expected " + expected + ", got " + actual);
    System.out.println("CHECK\t" + id + "\t" + Base64.getEncoder().encodeToString(String.valueOf(actual).getBytes(StandardCharsets.UTF_8)));
  }
  static void fails(String id, Class<? extends Throwable> expected, Action action) {
    try { action.run(); } catch (Throwable error) {
      if (!expected.isInstance(error)) throw new AssertionError(id + ": wrong exception", error);
      eq(id, error.getClass().getSimpleName(), expected.getSimpleName());
      return;
    }
    throw new AssertionError(id + ": expected " + expected.getSimpleName());
  }
}
`;

if (process.argv.length > 2) throw new Error('This verifier accepts no source-file arguments.');
const javaVersion = run('java', ['-version'], root).stderr.trim();
const compilerVersion = run('javac', ['-version'], root).stdout.trim();
const harnesses = JSON.parse(readFileSync(join(root, 'scripts/ip-assignment-java-harnesses.json'), 'utf8')) as Harness[];
if (harnesses.length !== slugs.length || harnesses.some((harness, index) => harness.slug !== slugs[index])) {
  throw new Error('Trusted assignment harness inventory changed: review the explicit verifier inventory first.');
}
const results = slugs.map(slug => {
  const source = readFileSync(join(root, 'src/ip/references', `${slug}.json`), 'utf8');
  const reference = JSON.parse(source) as Reference;
  const harness = harnesses.find(candidate => candidate.slug === slug)!;
  const directory = mkdtempSync(join(tmpdir(), `delftstudy-${slug}-`));
  try {
    const javaFiles = reference.files.filter(file => file.language === 'java');
    const names = new Set<string>();
    for (const file of javaFiles) {
      if (!/^[A-Z][A-Za-z0-9]*\.java$/.test(file.name) || names.has(file.name) || file.name === 'Check.java' || file.name === 'ReferenceCheck.java') {
        throw new Error(`Unsafe or duplicate trusted reference filename: ${file.name}`);
      }
      names.add(file.name);
      writeFileSync(join(directory, file.name), file.content);
    }
    writeFileSync(join(directory, 'Check.java'), checkSource);
    writeFileSync(join(directory, 'ReferenceCheck.java'), harness.source);
    run('javac', ['--release', '21', '-Xlint:all', '-Werror', '-encoding', 'UTF-8', '-d', directory,
      ...javaFiles.map(file => file.name), 'Check.java', 'ReferenceCheck.java'], directory);
    const execution = run('java', ['-ea', '-cp', directory, 'ReferenceCheck'], directory);
    if (execution.stderr.trim()) throw new Error(`Unexpected reference stderr for ${slug}: ${execution.stderr}`);
    const checks = execution.stdout.trim().split('\n').map(line => {
      const [kind, id, encoded] = line.split('\t');
      if (kind !== 'CHECK' || !id || encoded === undefined) throw new Error(`Unexpected reference output: ${line}`);
      return {id, actual: Buffer.from(encoded, 'base64').toString('utf8'), result: 'PASS' as const};
    });
    if (new Set(checks.map(check => check.id)).size !== checks.length) throw new Error(`Duplicate reference check in ${slug}`);
    console.log(`${slug}: ${checks.length} trusted JDK checks passed`);
    return {slug, assignmentId: reference.assignmentId, referenceId: reference.id,
      referenceSha256: checksum(source), harnessSha256: checksum(harness.source),
      javaFiles: javaFiles.map(file => file.name),
      excludedIllustrativeFiles: reference.files.filter(file => file.language !== 'java').map(file => file.name),
      independentReasoning: harness.independentReasoning, checks};
  } finally { rmSync(directory, {recursive: true, force: true}); }
});
const report = {
  purpose: 'Development verification of original authored references only. No learner Java was executed or graded.',
  javaVersion, compilerVersion,
  compileCommand: 'javac --release 21 -Xlint:all -Werror -encoding UTF-8 -d <isolated temporary directory> <fixed authored Java files> Check.java ReferenceCheck.java',
  executeCommand: 'java -ea -cp <isolated temporary directory> ReferenceCheck',
  junitStatus: 'NOT RUN: JUnit-reference.txt is an illustrative JUnit 5 excerpt. Equivalent behavioral requirements ran in the plain-Java harness.',
  assertionCount: results.reduce((count, result) => count + result.checks.length, 0),
  results,
};
writeFileSync(join(root, 'docs/ip-assignment-java-evidence.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Verified ${results.length} trusted assignment references; ${report.assertionCount} assertions.`);
