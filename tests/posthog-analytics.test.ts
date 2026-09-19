// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {PostHog} from 'posthog-js/dist/module.slim.no-external';
import type {CaptureResult} from 'posthog-js';
import {setAnalyticsSinkForTests,track} from '../src/analytics/analytics';
import {POSTHOG_EU_HOST,createPostHogSink,filterPostHogEvent,postHogOptions,resolvePostHogConfig} from '../src/analytics/posthog';

const config={key:'phc_test_public_key',host:POSTHOG_EU_HOST} as const;
const properties={course_id:'CSE1400_CO',topic_id:'CO_T01',activity_type:'practice',source_surface:'practice_attempt',completion_status:'completed'} as const;
const automatic=['$pageview','$pageleave','$autocapture','$snapshot','$heatmaps_data','$$heatmap','$dead_click','$rageclick','$web_vitals','$exception','$identify','$set','$feature_flag_called'];
const envelope=(event='practice_completed'):CaptureResult=>({uuid:'01995990-1234-7000-8000-000000000001',event,timestamp:new Date('2026-09-19'),properties:{...properties,token:config.key,distinct_id:'anonymous'}});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

describe('PostHog privacy boundary',()=>{
  it('enables only production with complete EU configuration',()=>{
    expect(resolvePostHogConfig({VITE_POSTHOG_KEY:config.key,VITE_POSTHOG_HOST:POSTHOG_EU_HOST},true)).toEqual(config);
    expect(resolvePostHogConfig({VITE_POSTHOG_KEY:config.key},true)).toBeNull();
    expect(resolvePostHogConfig({VITE_POSTHOG_KEY:config.key,VITE_POSTHOG_HOST:POSTHOG_EU_HOST},false)).toBeNull();
    expect(resolvePostHogConfig({VITE_POSTHOG_KEY:config.key,VITE_POSTHOG_HOST:'https://us.i.posthog.com'},true)).toBeNull();
  });
  it('pins supported controls independently of project defaults',()=>{
    expect(postHogOptions(config)).toMatchObject({autocapture:false,capture_pageview:false,capture_pageleave:false,capture_dead_clicks:false,capture_exceptions:false,capture_heatmaps:false,capture_performance:false,disable_session_recording:true,disable_surveys:true,advanced_disable_flags:true,advanced_disable_feature_flags:true,remote_config_refresh_interval_ms:0,person_profiles:'never',disable_persistence:true,persistence:'memory',disableDeviceModel:true,enable_recording_console_log:false,logs:{captureConsoleLogs:false},metrics:{network:false},disable_external_dependency_loading:true,disable_product_tours:true,disable_conversations:true,disable_web_experiments:true,internal_or_test_user_hostname:null});
  });
  it.each(automatic)('rejects automatic event %s',event=>expect(filterPostHogEvent(envelope(event))).toBeNull());
  it('preserves ingestion fields, enforces GeoIP/person opt-outs and strips top-level enrichment',()=>{
    const event=envelope();
    Object.assign(event.properties,{answer_text:'private',code:'private',email:'private',name:'private',account_id:'private',grades:[],uploads:{},'$current_url':'private','$device_id':'unused','$session_id':'unused',$geoip_disable:false,$process_person_profile:true});
    event.$set={email:'private'};event.$set_once={name:'private'};
    const result=filterPostHogEvent(event)!;
    expect(result).toEqual({uuid:event.uuid,event:event.event,timestamp:event.timestamp,properties:{...properties,token:config.key,distinct_id:'anonymous',$geoip_disable:true,$process_person_profile:false}});
  });
  it.each(['answer_text','code','email','name','account_id','auth_token','grades','uploads','free_text'])('blocks forbidden app property %s',key=>{
    expect(track('practice_completed',{...properties,[key]:'private'} as never)).toBe(false);
  });
  it('keeps provider load and capture failures non-fatal',async()=>{
    const load=vi.fn().mockRejectedValue(new Error('unavailable'));
    const sink=createPostHogSink(config,load);
    const restore=setAnalyticsSinkForTests(sink);
    try {expect(track('practice_completed',properties)).toBe(true);expect(track('practice_completed',properties)).toBe(true);} finally {restore();}
    await new Promise(resolve=>setTimeout(resolve,0));expect(load).toHaveBeenCalledTimes(1);
    const reset=setAnalyticsSinkForTests({capture(){throw Error('unavailable');}});
    try {expect(track('practice_completed',properties)).toBe(true);} finally {reset();}
  });
  it('uses the real SDK capture path without identify, storage or external requests',async()=>{
    const fetch=vi.fn().mockRejectedValue(new Error('unexpected network'));
    vi.stubGlobal('fetch',fetch);
    const xhr=vi.spyOn(XMLHttpRequest.prototype,'send');
    const writes=vi.spyOn(Storage.prototype,'setItem');
    const cookie=vi.spyOn(Document.prototype,'cookie','set');
    const requests:CaptureResult[]=[];
    const clients:PostHog[]=[];
    const identities:string[]=[];
    for(let reload=0;reload<2;reload++){
      const client=new PostHog();clients.push(client);
      const identify=vi.spyOn(client,'identify');
      // Replace only the network dispatch; all SDK init/enrichment/before_send runs.
      vi.spyOn(client,'_send_retriable_request').mockImplementation(request=>{if(request.data)requests.push(request.data as CaptureResult);});
      client.init(config.key,{...postHogOptions(config),request_batching:false});
      const sink=createPostHogSink(config,async()=>({init:()=>undefined,capture:(event,props)=>client.capture(event,props)}));
      const restore=setAnalyticsSinkForTests(sink);
      try {expect(track('practice_completed',properties)).toBe(true);} finally {restore();}
      await vi.waitFor(()=>expect(requests).toHaveLength(reload+1));
      identities.push(client.get_distinct_id());
      for(const event of automatic)client.capture(event);
      expect(identify).not.toHaveBeenCalled();
      expect(client.sessionRecording).toBeUndefined();
      expect(client.logs).toBeUndefined();
      expect(client.metrics).toBeUndefined();
      expect(client.featureFlags).toBeUndefined();
    }
    expect(identities[0]).not.toBe(identities[1]);
    expect(requests).toHaveLength(2);
    for(const request of requests){
      expect(request.event).toBe('practice_completed');
      expect(request.uuid).toBeTruthy();expect(request.timestamp).toBeInstanceOf(Date);
      expect(request.properties).toEqual({...properties,token:config.key,distinct_id:expect.any(String),$geoip_disable:true,$process_person_profile:false});
    }
    expect(writes).not.toHaveBeenCalled();expect(cookie).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();expect(xhr).not.toHaveBeenCalled();
  });
});
