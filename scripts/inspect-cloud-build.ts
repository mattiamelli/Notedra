import './inspect-progress-build';
import {readFileSync,writeFileSync} from 'node:fs';
import {checkSecrets} from './cloud-validation';
import type {IPBundleChunk} from './ip-bundle';
import {validateProgressBundle} from './progress-bundle';
const report=JSON.parse(readFileSync('docs/rl-bundle-report.json','utf8')) as {chunks:(IPBundleChunk&{bytes:number;gzipBytes:number})[];initialJSBytes:number;initialJSGzipBytes:number;totalAssetBytes:number;totalAssetGzipBytes:number};
const inventory=JSON.parse(readFileSync('docs/ip-bundle-report.json','utf8')) as {files:{file:string;bytes:number;gzipBytes:number}[]};
const base=validateProgressBundle(report.chunks,inventory.files.map(f=>({...f,prefix:readFileSync('dist/'+f.file).subarray(0,2048).toString()})));
const modules=['/src/accounts/AccountPage.tsx','/src/accounts/ConfiguredAccountRoot.tsx','/src/cloud/coordinator.ts','/node_modules/@supabase/supabase-js/'];
const owners=Object.fromEntries(modules.map(name=>{
  const matches=report.chunks.filter(c=>c.modules.some(m=>('/'+m.replaceAll('\\','/')).includes(name)));
  if(!matches.length||matches.some(c=>base.initial.includes(c.file)))throw Error('Missing or eager account/sync/client module: '+name);
  return [name,matches.map(c=>({file:c.file,bytes:c.bytes,gzipBytes:c.gzipBytes}))];
}));
for(const f of inventory.files)if(/\.(js|html)$/.test(f.file))checkSecrets(readFileSync('dist/'+f.file,'utf8'));
const result={initialJS:report.initialJSBytes,initialGzip:report.initialJSGzipBytes,totalAssets:report.totalAssetBytes,totalGzip:report.totalAssetGzipBytes,owners};
writeFileSync('docs/cloud-bundle-report.json',JSON.stringify(result,null,2)+'\n');console.log('Cloud bundle PASS',result);
