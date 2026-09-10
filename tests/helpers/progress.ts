import {emptyBackup,type Backup} from '../../src/learning/contracts';
import {allExercises} from '../../src/practice/catalog';
import {record,CLOCK} from './adaptive';
import co from '../../src/exams/banks/co.json';
import rl from '../../src/exams/banks/rl.json';
import ip from '../../src/exams/banks/ip.json';
import {startSession} from '../../src/exams/engine';
import {evaluateSubmission,practiceFor} from '../../src/exams/evaluation';
import type {ExamBank} from '../../src/exams/types';
export const banks=[co,rl,ip] as ExamBank[];
export {CLOCK,emptyBackup};
export function success(id:string,item=allExercises[0].id,days=0){const e=allExercises.find(e=>e.id===item)!;return record(id,e.id,e.reference,days);}
export function mock(data:Backup,course:number,mode:0|1,id:string,withOpen=false,days=0){
 const bank=banks[course],session=startSession(bank.blueprints[mode],bank,'test',id,CLOCK-days*86400000);
 for(const r of session.responses){const item=bank.items.find(i=>i.id===r.itemId)!;const e=practiceFor(item);if(e)r.answer=e.reference;else if(withOpen)r.answer={kind:item.responseType as 'code'|'text',value:'unverified learner work, not an oracle'};}
 const result=evaluateSubmission(session,bank,session.startedAt);session.status='SUBMITTED';session.revision++;session.submission={operationId:'submit-'+id,submittedAt:session.startedAt,evaluations:result.evaluations,evidence:result.evidence};data.exams.push(session);data.attempts.push(...result.attempts);return session;
}
