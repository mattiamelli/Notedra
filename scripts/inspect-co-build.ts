import {build} from 'vite';
import {finalBundleInventory} from './final-bundle-inventory';
import {writeFileSync,readFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
const {chunks,assets,plugin}=finalBundleInventory('co-acceptance-module-inventory');
await build({logLevel:'warn',plugins:[plugin]});
const entry=chunks.find(c=>c.entry)!;const initial=new Set<string>();function visit(file:string){if(initial.has(file))return;initial.add(file);chunks.find(c=>c.file===file)?.imports.forEach(visit);}visit(entry.file);
const mainModules=chunks.filter(c=>initial.has(c.file)).flatMap(c=>c.modules);
const allModules=chunks.flatMap(c=>c.modules);
const forbidden=allModules.filter(m=>/content-pack\/|scripts\/|co\/(?:content-lock|coverage)\.json|topic-study\/content-lock\.json/.test(m));
if(forbidden.length)throw new Error('Development-only modules bundled: '+forbidden.join(', '));
if(mainModules.some(m=>/src\/co\/(?:topics\/|Workspace|models|practice\.json)|src\/engine\/|src\/AssemblyWorkbench/.test(m)))throw new Error('CO content/tools or Assembly unexpectedly entered the initial dependency graph.');
if(chunks.filter(c=>c.modules.some(m=>/src\/co\/topics\/.*\.json$/.test(m))).length!==13)throw new Error('Thirteen independently lazy CO bundles required.');
// Inspect every final emitted byte after generation; HTML is measured separately from the established non-HTML asset totals.
for(const item of [...chunks,...assets]){const emitted=readFileSync('dist/'+item.file);item.bytes=emitted.length;item.gzipBytes=gzipSync(emitted).length;}
const report={initialChunks:[...initial],initialJSBytes:chunks.filter(c=>initial.has(c.file)).reduce((s,c)=>s+c.bytes,0),initialJSGzipBytes:chunks.filter(c=>initial.has(c.file)).reduce((s,c)=>s+c.gzipBytes,0),authoredCOLazyBytes:chunks.filter(c=>c.modules.some(m=>/src\/co\/topics\//.test(m))).reduce((s,c)=>s+c.bytes,0),totalAssetBytes:[...chunks,...assets.filter(asset=>!asset.file.endsWith('.html'))].reduce((s,c)=>s+c.bytes,0),totalAssetGzipBytes:[...chunks,...assets.filter(asset=>!asset.file.endsWith('.html'))].reduce((s,c)=>s+c.gzipBytes,0),chunks,assets,checks:['all production gates executed directly by Vite','13 CO topic chunks','CO models/workspace/Practice definitions and Assembly absent from initial graph','full pack, validators, CO content locks/coverage and pilot locks absent from browser','sizes measured from final emitted assets after Vite preload rewriting']};
writeFileSync('docs/co-bundle-report.json',JSON.stringify(report,null,2)+'\n');console.log(`CO bundle PASS: initial JS ${report.initialJSBytes} bytes; ${report.authoredCOLazyBytes} bytes topic content; total ${report.totalAssetBytes} bytes. See docs/co-bundle-report.json.`);
