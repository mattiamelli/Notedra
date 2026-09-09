/** Development-only execution of checked-in authored fixtures. Never accepts learner input. */
import {mkdtempSync,readFileSync,writeFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import exercises from '../src/ip/practice.json';
import oracles from './ip-practice-oracles.json';
const javaHome=process.env.DELFTSTUDY_JAVA_HOME??'/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home';
const run=(exe:string,args:string[],cwd?:string)=>spawnSync(join(javaHome,'bin',exe),args,{cwd,encoding:'utf8',timeout:20000,maxBuffer:1024*1024});
const version=run('java',['-version']);if(version.status!==0)throw new Error('JDK unavailable: '+version.stderr);
interface Fixture {id:string;sourceBlockId?:string;description?:string;javaSource:string;expectedStdout:string;reasoning:string;category?:string;}
const fixtures:Fixture[]=oracles.filter(o=>o.category!=='REASONED_CONCURRENCY').map(o=>({id:o.exerciseId,javaSource:exercises.find(e=>e.id===o.exerciseId)!.task.code,expectedStdout:o.expected,reasoning:o.reasoning,category:o.category}));
for(const name of ['ip-early-examples.json','ip-late-examples.json'])if(existsSync('scripts/'+name))fixtures.push(...JSON.parse(readFileSync('scripts/'+name,'utf8')) as Fixture[]);
const results=[];
for(const f of fixtures){
 const dir=mkdtempSync(join(tmpdir(),'delftstudy-trusted-java-'));
 try{
  writeFileSync(join(dir,'Program.java'),f.javaSource);
  const compiled=run('javac',['-encoding','UTF-8','-Xlint:all','Program.java'],dir);
  if(f.category==='COMPILE_ERROR'){
   if(compiled.status===0)throw new Error(f.id+': unexpectedly compiled');
   if(compiled.error||!compiled.stderr.includes('error:'))throw new Error(f.id+': compiler failed without diagnostic');
   results.push({id:f.id,result:'PASS',kind:'expected compiler rejection',reasoning:f.reasoning});continue;
  }
  if(compiled.status!==0)throw new Error(f.id+': '+compiled.stderr);
  const executed=run('java',['-ea','-cp',dir,'Program'],dir);
  if(f.category==='RUNTIME_ERROR'){
   if(executed.status===0||!executed.stderr.includes(f.expectedStdout)||executed.stdout!=='')throw new Error(f.id+': expected exception/output mismatch');
  }else if(executed.status!==0||executed.stdout!==f.expectedStdout)throw new Error(f.id+': expected '+JSON.stringify(f.expectedStdout)+' received '+JSON.stringify(executed.stdout)+' '+executed.stderr);
  results.push({id:f.id,result:'PASS',kind:f.category??'RUN',stdout:executed.stdout,reasoning:f.reasoning});
 }finally{rmSync(dir,{recursive:true,force:true});}
}
const report={jdk:version.stderr.trim(),boundary:'Only checked-in original DelftStudy fixtures compiled/run during development. No learner Java execution. Race guarantees are reasoned independently, never inferred from a sample execution.',results,reasonedConcurrency:oracles.filter(o=>o.category==='REASONED_CONCURRENCY')};
writeFileSync('docs/ip-java-evidence.json',JSON.stringify(report,null,2)+'\n');console.log(`Trusted Java PASS: ${results.length} compiled fixtures; ${report.reasonedConcurrency.length} concurrency claims require independent model tests. ${version.stderr.split('\n')[0]}`);
