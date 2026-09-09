import {lazy,Suspense} from 'react';
import type {StudyTopic} from '../topic-study/types';
import type {RLTopicContent} from './types';
export interface RLStudyProps {topic:StudyTopic;mode:'learn'|'flashcards'|'practice';}
const files=import.meta.glob<RLTopicContent>('./topics/*.json',{import:'default'});
const views=Object.fromEntries(Object.entries(files).map(([path,load])=>[path,lazy(async()=>{
 const [content,module]=await Promise.all([load(),import('./TopicContent')]);
 return {default:(props:RLStudyProps)=><module.TopicContent {...props} content={content}/>};
})]));
const Intro=lazy(()=>import('./IntroTopicContent'));
export function RLStudyMode(props:RLStudyProps){const View=props.topic.id==='RL_T01_PROP_LOGIC'?Intro:views[`./topics/${props.topic.id}.json`];return <Suspense fallback={<p role="status">Loading Reasoning & Logic topic…</p>}><View key={`${props.topic.id}:${props.mode}`} {...props}/></Suspense>;}
