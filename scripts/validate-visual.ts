import {beforeHardening} from './hardening-preservation';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

const baseline = '2baf35885ea49d9625c90b6eec01b102741f33a4';
const dependencyBaseline = '35338354f916e2433085e726ea19cccfd2747a33';
const presentation = new Set(['src/pages/DashboardPage.tsx','src/shell/AppShell.tsx','src/shell/PageParts.tsx','src/design/tokens.css','src/design/product.css','public/favicon.svg']);
const tree = execFileSync('git',['ls-tree','-r',baseline,'--','src','tests','content-pack','supabase','public'],{encoding:'utf8'}).trim().split('\n');
let protectedFiles = 0;
for (const entry of tree) {
  const [meta,path] = entry.split('\t');
  if (presentation.has(path)) continue;
  const data = beforeHardening(path,readFileSync(path));
  const hash = createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
  assert.equal(hash,meta.split(' ')[2],`Protected baseline changed: ${path}`);
  protectedFiles++;
}
const pkg = JSON.parse(readFileSync('package.json','utf8'));
const accepted = JSON.parse(execFileSync('git',['show',dependencyBaseline+':package.json'],{encoding:'utf8'}));
assert.deepEqual(pkg.dependencies,accepted.dependencies,'Runtime dependencies changed');
assert.deepEqual(pkg.devDependencies,accepted.devDependencies,'Build dependencies changed');
const css = readFileSync('src/design/product.css','utf8');
assert(readFileSync('src/main.tsx','utf8').includes("import './design/product.css'"),'Design is not wired into the app');
for (const value of ['tokens.css','prefers-reduced-motion','focus-visible','--ds-co','--ds-rl','--ds-ip','.ds-practice-feedback','.exam-dialog','.ds-ip-workbench','.ds-app.ds-tool']) assert(css.includes(value),'Missing visual integration: '+value);
for (const value of ["color: #70656a","color: var(--ds-course-color)",".ds-attempt-list a span+span { color: var(--ds-support); }",".ds-practice-card { min-width: 0; }",".ds-practice-card .ds-button { max-width: 100%; white-space: normal; overflow-wrap: anywhere; }","color: #fff","color: #8fc4ff","color: #b8d8ff","color: #d5fff8","min-width: 320px"]) assert(css.includes(value),'Missing accessibility integration: '+value);
const channel=(value:number)=>{const normalized=value/255;return normalized<=.04045?normalized/12.92:((normalized+.055)/1.055)**2.4;};
const luminance=(hex:string)=>.2126*channel(Number(`0x${hex.slice(1,3)}`))+.7152*channel(Number(`0x${hex.slice(3,5)}`))+.0722*channel(Number(`0x${hex.slice(5,7)}`));
const contrast=(foreground:string,background:string)=>{const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);return (values[0]+.05)/(values[1]+.05);};
for (const [foreground,background,label] of [['#70656a','#f2eee8','light sidebar secondary text'],['#ffffff','#0874e6','CO course tag'],['#ffffff','#007d80','R&L course tag'],['#ffffff','#6740d0','IP course tag'],['#00756a','#ffffff','light Assembly availability label'],['#8fc4ff','#13233a','dark landing surface label'],['#b8d8ff','#203b5d','dark landing path number'],['#d5fff8','#006c63','dark landing Delft eyebrow']]) assert(contrast(foreground,background)>=4.5,`${label} must meet WCAG AA text contrast`);
assert(readFileSync('src/shell/AppShell.tsx','utf8').includes('data-course={course.subject_id}'),'Missing textual course navigation identity');
console.log(`Visual preservation PASS: ${protectedFiles} baseline files checked (including exactly pinned hardening repairs); dependencies unchanged; palette, focus, motion and feature adapters wired. Rendered visual acceptance is separate.`);
