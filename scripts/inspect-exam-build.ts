import './inspect-adaptive-build';
import {readFileSync,writeFileSync} from 'node:fs';
import {validateExamBundle} from './exam-bundle';
import type {IPBundleChunk} from './ip-bundle';
const report=JSON.parse(readFileSync('docs/rl-bundle-report.json','utf8')) as {chunks:(IPBundleChunk&{bytes:number;gzipBytes:number})[];initialJSBytes:number;initialJSGzipBytes:number;totalAssetBytes:number;totalAssetGzipBytes:number};
const inventory=JSON.parse(readFileSync('docs/ip-bundle-report.json','utf8')) as {files:{file:string;bytes:number;gzipBytes:number}[]};
const result=validateExamBundle(report.chunks,inventory.files.map(f=>({...f,prefix:readFileSync('dist/'+f.file).subarray(0,2048).toString()})));
writeFileSync('docs/exam-bundle-report.json',JSON.stringify({initialJS:report.initialJSBytes,initialGzip:report.initialJSGzipBytes,totalAssets:report.totalAssetBytes,totalGzip:report.totalAssetGzipBytes,owners:Object.fromEntries(Object.entries(result.owners).map(([module,file])=>[module,report.chunks.find(c=>c.file===file)]))},null,2)+'\n');
console.log('Exam bundle PASS: separate lazy course banks, open editor and review/reference payloads; no raw sources.');
