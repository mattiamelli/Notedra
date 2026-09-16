// @vitest-environment jsdom
import {act,StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {analyticsEventRegistry} from '../src/analytics/events';
import {MemoryAnalyticsSink,setAnalyticsSinkForTests,track} from '../src/analytics/analytics';
import {isFirstPracticeCompletion,isFirstPracticeStart} from '../src/analytics/milestones';
import {useTrackOnce} from '../src/analytics/react';
import {attempt} from './helpers/learning';

let sink:MemoryAnalyticsSink,restore:()=>void;
beforeEach(()=>{sink=new MemoryAnalyticsSink();restore=setAnalyticsSinkForTests(sink);});
afterEach(()=>{restore();vi.restoreAllMocks();});

describe('privacy-first analytics contract',()=>{
 it('registers the exact minimum product taxonomy',()=>expect(Object.keys(analyticsEventRegistry)).toEqual(['product_tour_started','product_tour_completed','product_tour_skipped','first_practice_started','first_practice_completed','practice_started','practice_completed','study_method_recommended','study_method_selected','study_path_generated','study_path_activity_opened','exam_started','exam_completed','next_action_shown','next_action_opened','course_opened','topic_opened']));
 it('captures typed events in the inspectable local sink without network activity',()=>{const network=vi.spyOn(globalThis,'fetch');expect(track('course_opened',{course_id:'CSE1400_CO',activity_type:'course',source_surface:'course'})).toBe(true);expect(sink.records).toHaveLength(1);expect(sink.records[0]).toMatchObject({event:'course_opened',properties:{course_id:'CSE1400_CO'}});expect(network).not.toHaveBeenCalled();});
 it('rejects forbidden, unknown and free-text-shaped properties',()=>{const unsafe=track as (event:string,properties:Record<string,unknown>)=>boolean;expect(unsafe('practice_completed',{course_id:'CSE1400_CO',topic_id:'CO_T01_HISTORY',activity_type:'practice',completion_status:'completed',source_surface:'practice_attempt',answer_text:'private response'})).toBe(false);expect(unsafe('topic_opened',{course_id:'not a canonical id',topic_id:'CO_T01_HISTORY',activity_type:'topic',source_surface:'topic'})).toBe(false);expect(sink.records).toEqual([]);});
 it('defines first practice from existing attempts without adding persisted flags',()=>{const draft=attempt(),submitted=attempt({attemptId:'done',status:'SUBMITTED'});expect(isFirstPracticeStart([])).toBe(true);expect(isFirstPracticeStart([draft])).toBe(false);expect(isFirstPracticeCompletion([draft],draft.attemptId)).toBe(true);expect(isFirstPracticeCompletion([draft,submitted],draft.attemptId)).toBe(false);});
});

function Impression({selection}:{selection:string}){useTrackOnce(selection,()=>track('next_action_shown',{activity_type:'cold_start',source_surface:'dashboard'}));return <button onClick={()=>track('next_action_opened',{activity_type:'cold_start',source_surface:'dashboard'})}>Open next action</button>}
it('emits one stable next-action impression across repeated renders and records the open',async()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});const host=document.createElement('div');document.body.append(host);const root=createRoot(host);try{await act(async()=>root.render(<StrictMode><Impression selection="cold:/practice/one"/></StrictMode>));await act(async()=>root.render(<StrictMode><Impression selection="cold:/practice/one"/></StrictMode>));expect(sink.records.filter(record=>record.event==='next_action_shown')).toHaveLength(1);await act(async()=>host.querySelector('button')!.click());expect(sink.records.map(record=>record.event)).toEqual(['next_action_shown','next_action_opened']);}finally{await act(async()=>root.unmount());host.remove();}});
