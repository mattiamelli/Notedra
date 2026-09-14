import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import exercises from '../src/advanced/practice.json';

const javaHome=process.env.DELFTSTUDY_JAVA_HOME??'/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home';
const run=(exe:string,args:string[],cwd?:string)=>spawnSync(join(javaHome,'bin',exe),args,{cwd,encoding:'utf8',timeout:30000,maxBuffer:8*1024*1024});
type JavaFixture=(typeof exercises)[number]&{task:{kind:'ip-fixed';code:string};oracleStdout:string};
const fixtures=exercises.filter(exercise=>exercise.task.kind==='ip-fixed') as JavaFixture[];
const dir=mkdtempSync(join(tmpdir(),'notedra-advanced-java-'));
try{
  const sources=fixtures.map((exercise,index)=>exercise.task.code.replace('public class Program',`class Program${String(index).padStart(3,'0')}`).replaceAll('Program.',`Program${String(index).padStart(3,'0')}.`));
  writeFileSync(join(dir,'All.java'),sources.join('\n'));
  const compiled=run('javac',['-encoding','UTF-8','-Xlint:all','All.java'],dir);
  if(compiled.status!==0)throw new Error(`Advanced Java compilation failed:\n${compiled.stderr}`);
  const results=[];
  for(const [index,exercise] of fixtures.entries()){
    const executed=run('java',['-ea','-cp',dir,`Program${String(index).padStart(3,'0')}`],dir);
    if(executed.status!==0||executed.stdout!==exercise.oracleStdout)throw new Error(`${exercise.id}: expected ${JSON.stringify(exercise.oracleStdout)}, received ${JSON.stringify(executed.stdout)} ${executed.stderr}`);
    results.push({id:exercise.id,result:'PASS',stdout:executed.stdout});
  }
  const version=run('java',['-version']);
  writeFileSync('docs/advanced-java-evidence.json',JSON.stringify({jdk:version.stderr.trim(),boundary:'Only checked-in authored fixtures run. Learner Java is never executed.',count:results.length,results},null,2)+'\n');
  console.log(`Advanced Java oracle PASS: ${results.length} checked-in programs compiled and matched exactly.`);
}finally{rmSync(dir,{recursive:true,force:true});}
