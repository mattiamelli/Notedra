// Rebuild and collect the final emitted module graph through the established inspector.
import './inspect-rl-build';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {relative} from 'node:path';
import {validateEnrichmentBundle} from './enrichment-bundle';
const report=JSON.parse(readFileSync('docs/rl-bundle-report.json','utf8'));
const files=readdirSync('dist',{recursive:true,withFileTypes:true}).filter(f=>f.isFile()).map(f=>{const file=relative('dist',f.parentPath+'/'+f.name);return {file,prefix:readFileSync('dist/'+file).subarray(0,16).toString(),...(file==='robots.txt'?{content:readFileSync('dist/'+file,'utf8')}:{})};});
validateEnrichmentBundle(report.chunks,files);
const result={initialJSBytes:report.initialJSBytes,initialJSGzipBytes:report.initialJSGzipBytes,totalAssetBytes:report.totalAssetBytes,totalAssetGzipBytes:report.totalAssetGzipBytes,totalProductionBytes:report.totalProductionBytes,totalProductionGzipBytes:report.totalProductionGzipBytes,baseline:{initialJSBytes:474089,initialJSGzipBytes:124886,totalAssetBytes:932078,totalAssetGzipBytes:267272,totalProductionBytes:933074,totalProductionGzipBytes:267922},checks:['raw PDF/ZIP/text and full Handoff absent','source inventory/validators/teaching content locks absent; minimal attempt fingerprints retained','supplemental teaching lazy; only capability counts initial','existing CO/RL lazy module checks pass'],files:files.map(f=>f.file)};
writeFileSync('docs/enrichment-bundle-report.json',JSON.stringify(result,null,2)+'\n');console.log('Enrichment bundle PASS: '+JSON.stringify(result));
