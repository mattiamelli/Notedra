import './inspect-exam-build';
import {readFileSync,writeFileSync} from 'node:fs';
import {validateProgressBundle} from './progress-bundle';
import type {IPBundleChunk} from './ip-bundle';
const r=JSON.parse(readFileSync('docs/rl-bundle-report.json','utf8')) as {chunks:(IPBundleChunk&{bytes:number;gzipBytes:number})[];initialJSBytes:number;initialJSGzipBytes:number;totalAssetBytes:number;totalAssetGzipBytes:number};
const inventory=JSON.parse(readFileSync('docs/ip-bundle-report.json','utf8')) as {files:{file:string;bytes:number;gzipBytes:number}[]};
const check=validateProgressBundle(r.chunks,inventory.files.map(f=>({...f,prefix:readFileSync('dist/'+f.file).subarray(0,2048).toString()})));
const report={initialJS:r.initialJSBytes,initialGzip:r.initialJSGzipBytes,totalAssets:r.totalAssetBytes,totalGzip:r.totalAssetGzipBytes,owners:Object.fromEntries(Object.entries(check.owners).map(([m,f])=>[m,r.chunks.find(c=>c.file===f)])),chartLibrary:'none'};
writeFileSync('docs/progress-bundle-report.json',JSON.stringify(report,null,2)+'\n');console.log('Progress bundle PASS: lazy route, summaries and derivation; published exam/course guards preserved.',{initialJS:report.initialJS,initialGzip:report.initialGzip});
