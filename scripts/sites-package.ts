import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync,mkdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

export type ReleaseManifest={
 schemaVersion:1;
 sourceSha:string;
 artifactSha256:string;
 artifactPath:'dist/server/index.js';
 buildTarget:'openai-sites-worker';
 sitesProjectId:string;
};

const shaPattern=/^[0-9a-f]{40}$/;

export function prepareSitesStage(root:string,requiredInputs:string[]):string {
 const stage=resolve(root,'.sites-release');
 if(stage!==resolve(root,'.sites-release'))throw Error('Unexpected staging directory');
 rmSync(stage,{recursive:true,force:true});
 const missing=requiredInputs.filter(path=>!existsSync(resolve(root,path)));
 if(missing.length)throw Error(`Sites packaging requires the current production build: missing ${missing.join(', ')}`);
 return stage;
}

export function resolveSourceSha(root:string,expected?:string):string {
 const sourceSha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 if(!shaPattern.test(sourceSha))throw Error('Unable to resolve a full source commit SHA');
 const changes=execFileSync('git',['status','--porcelain','--untracked-files=all'],{cwd:root,encoding:'utf8'}).trim();
 if(changes)throw Error('Sites packaging requires a clean checkout so the artifact matches its source commit');
 if(expected!==undefined&&(!shaPattern.test(expected)||expected!==sourceSha))throw Error('Expected source SHA does not match the current checkout');
 return sourceSha;
}

export function writeSitesPackage(root:string,worker:string,config:{project_id:string},sourceSha:string):ReleaseManifest {
 if(!shaPattern.test(sourceSha))throw Error('Sites packaging requires a full source commit SHA');
 if(typeof config.project_id!=='string'||!config.project_id)throw Error('Sites project ID is missing');
 const stage=resolve(root,'.sites-release'),artifactSha256=createHash('sha256').update(worker).digest('hex');
 const manifest:ReleaseManifest={schemaVersion:1,sourceSha,artifactSha256,artifactPath:'dist/server/index.js',buildTarget:'openai-sites-worker',sitesProjectId:config.project_id};
 for(const dir of ['dist/server','.openai','dist/.openai'])mkdirSync(resolve(stage,dir),{recursive:true});
 for(const dir of ['dist/server','dist/.openai'])mkdirSync(resolve(root,dir),{recursive:true});
 const serializedConfig=JSON.stringify(config,null,2)+'\n';
 writeFileSync(resolve(root,'dist/server/index.js'),worker);
 writeFileSync(resolve(root,'dist/.openai/hosting.json'),serializedConfig);
 writeFileSync(resolve(stage,'dist/server/index.js'),worker);
 for(const dir of ['.openai','dist/.openai'])writeFileSync(resolve(stage,dir,'hosting.json'),serializedConfig);
 writeFileSync(resolve(stage,'release-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 const staged=readFileSync(resolve(stage,manifest.artifactPath));
 if(createHash('sha256').update(staged).digest('hex')!==manifest.artifactSha256)throw Error('Staged artifact digest mismatch');
 return manifest;
}
