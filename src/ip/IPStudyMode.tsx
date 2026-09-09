import {lazy,Suspense} from 'react';
import type {StudyTopic} from '../topic-study/types';
import type {IPTopicContent} from './types';
export interface IPStudyProps {topic:StudyTopic;mode:'learn'|'flashcards'|'practice'|'exam-style';}
const files=import.meta.glob<IPTopicContent>('./topics/*.json',{import:'default'});
const views=Object.fromEntries(Object.entries(files).map(([path,load])=>[path,lazy(async()=>{
 const [content,module]=await Promise.all([load(),import('./TopicContent')]);
 return {default:(props:IPStudyProps)=><module.TopicContent {...props} content={content}/>};
})]));
const Intro=lazy(()=>import('./IntroTopicContent'));
export function IPStudyMode(props:IPStudyProps){
 const View=props.topic.id==='IP_T02_CONTROL_FLOW'?Intro:views[`./topics/${props.topic.id}.json`];
 return <Suspense fallback={<p role="status">Loading Introduction to Programming…</p>}><View key={`${props.topic.id}:${props.mode}`} {...props}/></Suspense>;
}
