import {build} from 'vite';
import {writeFileSync,readFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {relative} from 'node:path';
interface Chunk {file:string;bytes:number;gzipBytes:number;entry:boolean;imports:string[];dynamicImports:string[];modules:string[];}
const chunks:Chunk[]=[];
const assets:{file:string;bytes:number;gzipBytes:number}[]=[];
await build({logLevel:'warn',plugins:[{name:'co-acceptance-module-inventory',generateBundle(_options,bundle){
 for(const [file,out] of Object.entries(bundle)){
  const bytes=out.type==='chunk'?Buffer.from(out.code):Buffer.from(out.source);
  if(out.type==='chunk')chunks.push({file,bytes:bytes.length,gzipBytes:gzipSync(bytes).length,entry:out.isEntry,imports:out.imports,dynamicImports:out.dynamicImports,modules:Object.keys(out.modules).map(id=>relative(process.cwd(),id).replaceAll('\\','/'))});
  else assets.push({file,bytes:bytes.length,gzipBytes:gzipSync(bytes).length});
 }
}}]});
const entry=chunks.find(c=>c.entry)!;const initial=new Set<string>();function visit(file:string){if(initial.has(file))return;initial.add(file);chunks.find(c=>c.file===file)?.imports.forEach(visit);}visit(entry.file);
const mainModules=chunks.filter(c=>initial.has(c.file)).flatMap(c=>c.modules);
const allModules=chunks.flatMap(c=>c.modules);
const forbidden=allModules.filter(m=>/content-pack\/|scripts\/|co\/(?:content-lock|coverage)\.json|topic-study\/content-lock\.json/.test(m));
if(forbidden.length)throw new Error('Development-only modules bundled: '+forbidden.join(', '));
if(mainModules.some(m=>/src\/co\/(?:topics\/|Workspace|models|practice\.json)|src\/engine\/|src\/AssemblyWorkbench/.test(m)))throw new Error('CO content/tools or Assembly unexpectedly entered the initial dependency graph.');
if(chunks.filter(c=>c.modules.some(m=>/src\/co\/topics\/.*\.json$/.test(m))).length!==13)throw new Error('Thirteen independently lazy CO bundles required.');
// Inspect final emitted bytes, after every plugin has finished generating assets.
for(const item of [...chunks,...assets]){const emitted=readFileSync('dist/'+item.file);item.bytes=emitted.length;item.gzipBytes=gzipSync(emitted).length;}
const report={initialChunks:[...initial],initialJSBytes:chunks.filter(c=>initial.has(c.file)).reduce((s,c)=>s+c.bytes,0),initialJSGzipBytes:chunks.filter(c=>initial.has(c.file)).reduce((s,c)=>s+c.gzipBytes,0),authoredCOLazyBytes:chunks.filter(c=>c.modules.some(m=>/src\/co\/topics\//.test(m))).reduce((s,c)=>s+c.bytes,0),totalAssetBytes:[...chunks,...assets].reduce((s,c)=>s+c.bytes,0),totalAssetGzipBytes:[...chunks,...assets].reduce((s,c)=>s+c.gzipBytes,0),chunks,assets,checks:['all production gates executed directly by Vite','13 CO topic chunks','CO models/workspace/Practice definitions and Assembly absent from initial graph','full pack, validators, CO content locks/coverage and pilot locks absent from browser','sizes measured from final emitted assets after Vite preload rewriting']};
writeFileSync('docs/co-bundle-report.json',JSON.stringify(report,null,2)+'\n');console.log(`CO bundle PASS: initial JS ${report.initialJSBytes} bytes; ${report.authoredCOLazyBytes} bytes topic content; total ${report.totalAssetBytes} bytes. See docs/co-bundle-report.json.`);
