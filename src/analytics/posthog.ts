import type {CaptureResult,PostHogConfig} from 'posthog-js/dist/module.slim.no-external';
import {analyticsEventRegistry,type AnalyticsEventMap} from './events';
import type {AnalyticsRecord,AnalyticsSink} from './analytics';

export const POSTHOG_EU_HOST='https://eu.i.posthog.com';

export type PostHogRuntimeConfig={key:string;host:typeof POSTHOG_EU_HOST};
export type PostHogEnvironment={VITE_POSTHOG_KEY?:string;VITE_POSTHOG_HOST?:string};
export type PostHogEvent=CaptureResult;
export type PostHogOptions=Partial<PostHogConfig>;

export type PostHogClient={
  init:(key:string,options:PostHogOptions)=>unknown;
  capture:(event:string,properties:Record<string,unknown>)=>unknown;
};

export type PostHogLoader=()=>Promise<PostHogClient>;

// Required ingestion identity and project routing; no device/session enrichment.
const technicalProperties=new Set(['token','distinct_id']);

function isAnalyticsEventName(event:string):event is keyof AnalyticsEventMap {
  return Object.prototype.hasOwnProperty.call(analyticsEventRegistry,event);
}

export function resolvePostHogConfig(env:PostHogEnvironment,production:boolean):PostHogRuntimeConfig|null {
  if(!production)return null;
  const key=env.VITE_POSTHOG_KEY?.trim();
  const host=env.VITE_POSTHOG_HOST?.trim().replace(/\/$/,'');
  if(!key||!host||host!==POSTHOG_EU_HOST)return null;
  return {key,host:POSTHOG_EU_HOST};
}

export function filterPostHogEvent(event:PostHogEvent|null):PostHogEvent|null {
  if(!event?.event||!isAnalyticsEventName(event.event))return null;
  const definition=analyticsEventRegistry[event.event];
  const optional='optional' in definition?definition.optional:[];
  const approved=new Set<string>([...definition.required,...optional]);
  const properties=Object.fromEntries(Object.entries(event.properties??{}).filter(([key])=>approved.has(key)||technicalProperties.has(key)));
  return {uuid:event.uuid,event:event.event,timestamp:event.timestamp,properties:{...properties,$geoip_disable:true,$process_person_profile:false}};
}

export function postHogOptions(config:PostHogRuntimeConfig):PostHogOptions {
  return {
    api_host:config.host,
    autocapture:false,
    capture_pageview:false,
    capture_pageleave:false,
    capture_dead_clicks:false,
    capture_exceptions:false,
    capture_heatmaps:false,
    capture_performance:false,
    disable_session_recording:true,
    disable_surveys:true,
    advanced_disable_flags:true,
    person_profiles:'never',
    disable_persistence:true,
    persistence:'memory',
    enable_recording_console_log:false,
    logs:{captureConsoleLogs:false,beforeSend:()=>null},
    metrics:{network:false,beforeSend:()=>null},
    rageclick:false,
    advanced_disable_feature_flags:true,
    remote_config_refresh_interval_ms:0,
    advanced_disable_toolbar_metrics:true,
    disable_external_dependency_loading:true,
    disable_product_tours:true,
    disable_conversations:true,
    disable_web_experiments:true,
    opt_in_site_apps:false,
    internal_or_test_user_hostname:null,
    save_campaign_params:false,
    save_referrer:false,
    debug:false,
    disableDeviceModel:true,
    before_send:filterPostHogEvent,
  };
}

const loadPostHog:PostHogLoader=async()=>{
  const {default:posthog}=await import('posthog-js/dist/module.slim.no-external');
  return {
    init:(key,options)=>posthog.init(key,options),
    capture:(event,properties)=>posthog.capture(event,properties),
  };
};

export function createPostHogSink(config:PostHogRuntimeConfig,loader:PostHogLoader=loadPostHog):AnalyticsSink {
  let client:Promise<PostHogClient|null>|null=null;
  const getClient=()=>client??=(async()=>{
    try {
      const loaded=await loader();
      loaded.init(config.key,postHogOptions(config));
      return loaded;
    } catch {
      return null;
    }
  })();
  return {capture(record:AnalyticsRecord){
    void getClient().then(loaded=>{
      if(!loaded)return;
      try {loaded.capture(record.event,{...record.properties});} catch { /* Analytics must never affect product behavior. */ }
    }).catch(()=>undefined);
  }};
}

export function createConfiguredPostHogSink(env:PostHogEnvironment,production:boolean,loader?:PostHogLoader):AnalyticsSink|null {
  const config=resolvePostHogConfig(env,production);
  return config?createPostHogSink(config,loader):null;
}
