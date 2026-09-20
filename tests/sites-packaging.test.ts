import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {existsSync,mkdirSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {afterEach,describe,expect,it} from 'vitest';
import {prepareSitesStage,writeSitesPackage} from '../scripts/sites-package';

const roots:string[]=[];
function fixture(){const root=mkdtempSync(resolve(tmpdir(),'notedra-sites-'));roots.push(root);return root;}
afterEach(()=>{for(const root of roots.splice(0))rmSync(root,{recursive:true,force:true});});

describe('Sites package lifecycle',()=>{
 it('fails closed and removes stale staging when a required current-build input is missing',()=>{
 const root=fixture(),stale=resolve(root,'.sites-release/dist/server/index.js');
  mkdirSync(resolve(stale,'..'),{recursive:true});writeFileSync(stale,'stale worker');
  const script=fileURLToPath(new URL('../scripts/build-hosting.ts',import.meta.url));
  const loader=fileURLToPath(import.meta.resolve('tsx'));
  const result=spawnSync(process.execPath,['--import',loader,script],{cwd:root,encoding:'utf8'});
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('missing dist/_headers');
  expect(existsSync(resolve(root,'.sites-release'))).toBe(false);
 });

 it('writes a fresh package with verifiable source and artifact provenance',()=>{
  const root=fixture(),required=['dist/_headers','dist/index.html'];
  for(const path of required){mkdirSync(resolve(root,path,'..'),{recursive:true});writeFileSync(resolve(root,path),'current');}
  prepareSitesStage(root,required);
  const worker='export default {fetch(){return new Response("ok")}};',sourceSha='1'.repeat(40);
  const manifest=writeSitesPackage(root,worker,{project_id:'appgprj_test'},sourceSha);
  expect(readFileSync(resolve(root,'.sites-release/dist/server/index.js'),'utf8')).toBe(worker);
  expect(manifest).toEqual({schemaVersion:1,sourceSha,artifactSha256:createHash('sha256').update(worker).digest('hex'),artifactPath:'dist/server/index.js',buildTarget:'openai-sites-worker',sitesProjectId:'appgprj_test'});
  expect(JSON.parse(readFileSync(resolve(root,'.sites-release/release-manifest.json'),'utf8'))).toEqual(manifest);
 });
});
