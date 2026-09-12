import './inspect-cloud-build';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const cloud = JSON.parse(readFileSync('docs/cloud-bundle-report.json','utf8'));
const inventory = JSON.parse(readFileSync('docs/ip-bundle-report.json','utf8')) as {files:{file:string;bytes:number;gzipBytes:number}[]};
const css = inventory.files.filter(file=>file.file.endsWith('.css'));
const cssBytes = css.reduce((sum,file)=>sum+file.bytes,0);
assert(cloud.initialJS <= 520_000, 'Initial JS exceeds the restrained visual budget');
assert(cloud.initialGzip <= 140_000, 'Initial compressed JS exceeds visual budget');
assert(cssBytes <= 95_000, 'CSS exceeds visual budget');
// Patch 7: 212 reviewed authored activities add ~327 kB of predominantly lazy content.
// Initial JS/gzip/CSS ceilings above are unchanged; enforce the content split below.
assert(cloud.totalAssets <= 2_300_000, 'Total assets exceed reviewed Patch 7 content budget');
const graph=JSON.parse(readFileSync('docs/rl-bundle-report.json','utf8')) as {initialChunks:string[];chunks:{file:string;modules:string[]}[]};
for(const module of ['src/expansion/practice.json','src/expansion/ip.json','src/expansion/co.json','src/expansion/guided.json','src/expansion/completion.json','src/expansion/completion-guided.json']){
 const owners=graph.chunks.filter(c=>c.modules.some(m=>m===module||m.endsWith('/'+module)));
 assert(owners.length===1, 'Expansion content missing or duplicated: '+module);
 assert(!graph.initialChunks.includes(owners[0].file), 'Expansion content eagerly loaded: '+module);
}
for(const file of inventory.files) assert(!/\.(?:pdf|zip|java|tsx?|map)$|(?:Handoff|preservation-lock|status\.md)/i.test(file.file),'Source/report artifact in build: '+file.file);
const report={baseline:{initialJS:498837,initialGzip:131690,cssBytes:78389,totalAssets:1858188},current:{initialJS:cloud.initialJS,initialGzip:cloud.initialGzip,cssBytes,totalAssets:cloud.totalAssets},lazyCloudAndCourseGuards:'PASS via inspect-cloud-build and its prerequisite guards',visualDependenciesAdded:0,totalAssetBudget:{previous:2_000_000,current:2_300_000,reason:'212 authored activities in verified non-initial, single-owner chunks; initial JS/gzip/CSS limits unchanged'},expansionLazySingleOwner:'PASS'};
writeFileSync('docs/visual-bundle-report.json',JSON.stringify(report,null,2)+'\n');
console.log('Visual bundle PASS',report);
