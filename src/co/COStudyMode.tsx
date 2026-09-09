import {lazy,Suspense} from 'react';
import type {StudyTopic} from '../topic-study/types';
import type {COTopicContent} from './types';
export interface COStudyProps {topic:StudyTopic;mode:'learn'|'flashcards'|'practice';}
const files=import.meta.glob<COTopicContent>('./topics/*.json',{import:'default'});
const views=Object.fromEntries(Object.entries(files).map(([path,load])=>[path,lazy(async()=>{
 const [content,module]=await Promise.all([load(),import('./TopicContent')]);
 return {default:(props:COStudyProps)=><module.TopicContent {...props} content={content}/>};
})]));
export function COStudyMode(props:COStudyProps){const View=views[`./topics/${props.topic.id}.json`];return <Suspense fallback={<p role="status">Loading topic content…</p>}><View key={`${props.topic.id}:${props.mode}`} {...props}/></Suspense>;}
