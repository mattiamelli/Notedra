import {analyticsEventRegistry,type AnalyticsEventMap} from './events';
import {createConfiguredPostHogSink} from './posthog';

export type AnalyticsEventName=keyof AnalyticsEventMap;
export type AnalyticsRecord<E extends AnalyticsEventName=AnalyticsEventName>={event:E;properties:AnalyticsEventMap[E];occurredAt:string};
export interface AnalyticsSink {capture(record:AnalyticsRecord):void;}

export class MemoryAnalyticsSink implements AnalyticsSink {
 readonly records:AnalyticsRecord[]=[];
 capture(record:AnalyticsRecord){this.records.push(structuredClone(record));}
 clear(){this.records.length=0;}
}

export const localAnalyticsSink=new MemoryAnalyticsSink();
let activeSink:AnalyticsSink|null=import.meta.env.DEV?localAnalyticsSink:createConfiguredPostHogSink(import.meta.env,import.meta.env.PROD);
const forbidden=/(^|_)(answer|code|document|email|name|token|ip|prompt|health|user)($|_)/i;
const canonicalId=/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;

export function track<E extends AnalyticsEventName>(event:E,properties:AnalyticsEventMap[E]):boolean{
 const definition=analyticsEventRegistry[event],entries=Object.entries(properties as Record<string,unknown>),allowed=new Set<string>([...definition.required,...('optional'in definition?definition.optional:[])]);
 if(definition.required.some(key=>!(key in (properties as object)))||entries.some(([key])=>forbidden.test(key)||!allowed.has(key)))return false;
 if(entries.some(([key,value])=>(key==='course_id'||key==='topic_id')&&(typeof value!=='string'||!canonicalId.test(value))))return false;
 if(!activeSink)return true;
 try {activeSink.capture({event,properties:structuredClone(properties),occurredAt:new Date().toISOString()} as AnalyticsRecord);} catch { /* Analytics must never affect product behavior. */ }
 return true;
}

export function setAnalyticsSinkForTests(sink:AnalyticsSink|null){const previous=activeSink;activeSink=sink;return()=>{activeSink=previous;};}
