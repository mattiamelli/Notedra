import {readFileSync,writeFileSync,mkdirSync,readdirSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
import ts from 'typescript';
import {publicDocumentPages} from './release';
import {academicIndex,topicPath,courses} from '../src/academic/navigation';
import {studyModes} from '../src/topic-study/types';
import {scanArtifact} from './hardening-validation';
import type {HostedAsset,HostingManifest} from '../hosting/handler';

const root=resolve('.'),stage=resolve('.sites-release');
const config=JSON.parse(readFileSync('.openai/hosting.json','utf8'));
if(config.static)throw Error('Worker hosting must not declare static fallback');
const policy=JSON.parse(readFileSync('hosting/policy.json','utf8')) as {cspMode:string};
if(!['report-only','enforce'].includes(policy.cspMode))throw Error('Unknown CSP policy');
const headersFile=readFileSync('dist/_headers','utf8');
// Reuse the exact policy validated by the frontend release build.
const headers=Object.fromEntries(headersFile.split('/assets/*')[0].split('\n').filter(line=>/^  [\w-]+: /.test(line)).map(line=>{const at=line.indexOf(':');return [line.slice(2,at),line.slice(at+2)];}));
if(!headers['Content-Security-Policy-Report-Only'])throw Error('Missing built CSP');
if(policy.cspMode==='enforce'){headers['Content-Security-Policy']=headers['Content-Security-Policy-Report-Only'];delete headers['Content-Security-Policy-Report-Only'];}
const mime:Record<string,string>={js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json; charset=utf-8',svg:'image/svg+xml',png:'image/png',xml:'application/xml; charset=utf-8',txt:'text/plain; charset=utf-8',webmanifest:'application/manifest+json',html:'text/html; charset=utf-8'};
function asset(file:string):HostedAsset {
 const bytes=readFileSync('dist/'+file),textBody=bytes.toString('utf8'),binary=!Buffer.from(textBody).equals(bytes),body=binary?bytes.toString('base64'):textBody;
 if(!binary)scanArtifact('dist/'+file,body);
 const type=mime[file.split('.').at(-1)!];if(!type)throw Error('Unsupported public asset: '+file);
 return {body,type,etag:'"'+createHash('sha256').update(bytes).digest('hex')+'"',encoding:binary?'base64':undefined};
}
const assets:Record<string,HostedAsset>={};
for(const entry of readdirSync('dist',{recursive:true,withFileTypes:true}).filter(e=>e.isFile())){
 const file=relative(resolve('dist'),resolve(entry.parentPath,entry.name));
 if(file.startsWith('release/')||['index.html','404.html','_headers','_redirects'].includes(file))continue;
 assets['/'+file]=asset(file);
}
const documents=Object.fromEntries(publicDocumentPages().map((page,index)=>[page.path,asset(`release/page-${index}.html`)]));
const applicationPaths=['/','/dashboard','/account','/privacy','/terms','/progress','/mistakes','/study-plan','/practice','/exams','/exams/history',...courses.map(c=>`/exams/${c.subject_id}/setup`),...academicIndex.topics.flatMap(t=>studyModes.map(mode=>`${topicPath(t)}/${mode.id}`))];
const manifest:HostingManifest={assets,documents,applicationPaths,shell:asset('index.html'),notFound:asset('404.html'),headers};
const source=ts.transpileModule(readFileSync('hosting/handler.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const worker=source+'\nexport default createHandler('+JSON.stringify(manifest)+');\n';
scanArtifact('dist/server/index.js',worker);
if(stage!==resolve(root,'.sites-release'))throw Error('Unexpected staging directory');
rmSync(stage,{recursive:true,force:true});mkdirSync(stage+'/dist/server',{recursive:true});mkdirSync(stage+'/.openai',{recursive:true});mkdirSync(stage+'/dist/.openai',{recursive:true});
mkdirSync('dist/server',{recursive:true});mkdirSync('dist/.openai',{recursive:true});
writeFileSync('dist/server/index.js',worker);
writeFileSync('dist/.openai/hosting.json',JSON.stringify(config,null,2)+'\n');
writeFileSync(stage+'/dist/server/index.js',worker);
for(const dir of ['/.openai','/dist/.openai'])writeFileSync(stage+dir+'/hosting.json',JSON.stringify(config,null,2)+'\n');
console.log('Sites Worker artifact prepared', {documents:Object.keys(documents).length,assets:Object.keys(assets).length,workerBytes:Buffer.byteLength(worker),csp:policy.cspMode});
