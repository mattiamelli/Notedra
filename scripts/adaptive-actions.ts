import {readFileSync,readdirSync} from 'node:fs';
import {courses,ASSEMBLY_TOOL_PATH} from '../src/academic/navigation';
import projection from '../src/generated/topic-study.json';
import type {Action} from '../src/adaptive/engine';
interface SourceAction {id:string;title?:string;name?:string;topicId:string;skillIds:string[];minutes?:number;}
const read=(file:string)=>JSON.parse(readFileSync(new URL('../'+file,import.meta.url),'utf8')) as unknown;
export function buildAdaptiveActions():Action[]{
 const result:Action[]=[];
 function add(row:SourceAction,kind:Action['kind']){
  const topic=projection.topics.find(t=>t.id===row.topicId);if(!topic)throw new Error('Invalid action topic');const route=courses.find(c=>c.subject_id===topic.subjectId)!.path+'/'+topic.id;
  result.push({id:row.id,title:row.title??row.name!,topicId:row.topicId,subjectId:topic.subjectId,skillIds:row.skillIds,kind,minutes:row.minutes??10,durationSource:row.minutes?'Authored practice duration':'DelftStudy estimate',to:kind==='coding'?`${route}/practice?task=${encodeURIComponent(row.id)}`:row.id==='assembly'?ASSEMBLY_TOOL_PATH:`${route}/practice`});
 }
 for(const row of read('src/co/tools.json') as SourceAction[])add(row,'workspace');
 for(const file of readdirSync(new URL('../src/ip/assignments/',import.meta.url)).filter(f=>f.endsWith('.json')).sort())add(read('src/ip/assignments/'+file) as SourceAction,'coding');
 for(const row of read('src/ip/intro-guided.json') as SourceAction[])add(row,'guided');
 for(const course of ['ip','rl','co'])for(const file of readdirSync(new URL(`../src/${course}/topics/`,import.meta.url)).filter(f=>f.endsWith('.json')).sort()){
  const topic=read(`src/${course}/topics/${file}`) as {guided?:SourceAction[]};for(const row of topic.guided??[])add(row,'guided');
 }
 for(const row of read('src/enrichment/guided.json') as SourceAction[])add(row,'guided');
 return result.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
}
