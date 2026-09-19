import {beforeHardening} from './hardening-preservation';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import ts from 'typescript';
import {checkSecrets,validateSecurity,validateSync} from './cloud-validation';

export function scanSecrets(text:string):void {
  checkSecrets(text.replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,token=>{try{JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());return token;}catch{return '[malformed JWT, not a credential]';}}));
  assert(!/(?:postgres(?:ql)?):\/\/[^\s/:]+:[^\s@]+@/i.test(text),'Database credential URL detected');
  assert(!/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[0-9A-Z]{16}|sk_live_[A-Za-z0-9]{20,})/.test(text),'Private API credential detected');
  // Concrete assignments only: prose and parameter names are not credentials.
  const assignments=/(?:["']?)(?:access_token|refresh_token|jwt_secret|database_password|service_role_key|management_token)(?:["']?)\s*[:=]\s*["']([^"'\r\n]{16,})["']/gi;
  for(const match of text.matchAll(assignments))assert(/^(?:<[^>]+>|YOUR_[A-Z_]+|\$\{[^}]+\})$/.test(match[1]),'Private credential assignment detected');
}
export function scanRuntime(source:string,path:string):void {
  const file=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,path.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  const visit=(node:ts.Node):void=>{
    if(ts.isIdentifier(node))assert(!['dangerouslySetInnerHTML','innerHTML','outerHTML','insertAdjacentHTML'].includes(node.text),'Unsafe HTML API in '+path);
    if(ts.isCallExpression(node)||ts.isNewExpression(node)){
      const name=node.expression.getText(file);
      assert(!['eval','Function','window.eval','document.write','document.writeln','console.log','console.debug'].includes(name),'Unsafe execution/debug API in '+path);
    }
    if(ts.isStringLiteralLike(node))assert(!/^\s*(?:javascript|vbscript):/i.test(node.text),'Scriptable URL in '+path);
    ts.forEachChild(node,visit);
  };visit(file);
}
export function validateHardening(){
  const paths=[...new Set(execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{encoding:'utf8'}).split('\0').filter(Boolean))];
  for(const path of paths){try{scanSecrets(readFileSync(path,'utf8'));}catch{throw Error('Secret scan rejected '+path+' (values withheld)');}}
  assert(!paths.some(p=>/(?:^|\/)\.env(?:\.|$)/.test(p)&&p!=='.env.example'),'Tracked environment file');
  execFileSync('git',['check-ignore','.env.local']);
  const example=readFileSync('.env.example','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#'));
  assert.deepEqual(example,['VITE_SUPABASE_URL=','VITE_SUPABASE_PUBLISHABLE_KEY=','VITE_POSTHOG_KEY=','VITE_POSTHOG_HOST=']);
  const runtime=paths.filter(p=>/^src\/.*\.tsx?$/.test(p));for(const p of runtime)scanRuntime(readFileSync(p,'utf8'),p);
  const tree=execFileSync('git',['ls-tree','-r','6d1b9dfd3fb148ba7097e7ed238e600da2a81deb','--','src','tests','content-pack','supabase','public'],{encoding:'utf8'}).trim().split('\n');
  for(const row of tree){const [meta,path]=row.split('\t'),data=beforeHardening(path,readFileSync(path));assert.equal(createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex'),meta.split(' ')[2],'Step 13 baseline changed: '+path);}
  validateSecurity();validateSync();
  return {repositoryFiles:paths.length,runtimeFiles:runtime.length,studentSchema:3,indexedDB:4,scope:'static checks, not live enforcement'};
}
export function scanArtifact(path:string,text:string):void {
  assert(!/\.(?:pdf|zip|java|tsx?|map)$|(?:^|\/)(?:tests|scripts|docs|supabase)\/|Handoff|remote-supabase-acceptance/i.test(path),'Forbidden production artifact');
  scanSecrets(text);
  assert(!/Run native storage checks|REMOTE ACCEPTANCE PASS:|Isolated native IndexedDB verification/.test(text),'Test harness in production');
}
export function validateProductionArtifacts(){
 const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
 const files=walk('dist');assert(files.includes('dist/index.html'));for(const file of files)scanArtifact(file,readFileSync(file,'utf8'));
 return {files:files.length,secretAndArtifactScan:'PASS'};
}
export function hardeningBuildGuard(){return {name:'production-hardening',buildStart(){validateHardening();}};}
