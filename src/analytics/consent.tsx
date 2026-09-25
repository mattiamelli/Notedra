import {createContext,useContext,useSyncExternalStore,type ReactNode} from 'react';
import {localAnalyticsSink,setActiveAnalyticsSink,type AnalyticsSink} from './analytics';
import {POSTHOG_PERSISTENCE_NAME,createConfiguredPostHogSink,resolvePostHogConfig,type PostHogEnvironment} from './posthog';

export const ANALYTICS_CONSENT_KEY='notedra.analytics-consent';
export type AnalyticsConsentDecision='granted'|'denied'|null;

type StorageLike=Pick<Storage,'getItem'|'setItem'|'removeItem'|'key'|'length'>;
type ConsentSink=AnalyticsSink&{dispose?:()=>Promise<void>};
type ConsentControllerOptions={
  storage:StorageLike|null;
  sessionStorage:StorageLike|null;
  env:PostHogEnvironment;
  production:boolean;
  createSink?:(env:PostHogEnvironment,production:boolean)=>ConsentSink|null;
};

function readDecision(storage:StorageLike|null):AnalyticsConsentDecision {
  try {const value=storage?.getItem(ANALYTICS_CONSENT_KEY);return value==='granted'||value==='denied'?value:null;} catch {return null;}
}

function persistencePrefixes(env:PostHogEnvironment){
  const prefixes=[`ph_${POSTHOG_PERSISTENCE_NAME}`];
  const config=resolvePostHogConfig(env,true);
  if(config)prefixes.push(`ph_${config.key.replace(/\+/g,'PL').replace(/\//g,'SL').replace(/=/g,'EQ')}_posthog`,`ph_${config.key}`);
  return prefixes;
}

export function clearPostHogAnalyticsStorage(storage:StorageLike|null,session:StorageLike|null,env:PostHogEnvironment){
  const prefixes=persistencePrefixes(env);
  for(const target of [storage,session])try{
    if(!target)continue;
    const keys=Array.from({length:target.length},(_,index)=>target.key(index)).filter((key):key is string=>Boolean(key));
    for(const key of keys)if(key!==ANALYTICS_CONSENT_KEY&&prefixes.some(prefix=>key===prefix||key.startsWith(`${prefix}_`)))target.removeItem(key);
  }catch{/* Analytics storage cleanup must not affect the product. */}
}

export class AnalyticsConsentController {
  private decision:AnalyticsConsentDecision;
  private sink:ConsentSink|null=null;
  private listeners=new Set<()=>void>();
  private transition=Promise.resolve();
  constructor(private options:ConsentControllerOptions){
    this.decision=readDecision(options.storage);
    if(this.decision==='granted')this.start();
    else {setActiveAnalyticsSink(null);clearPostHogAnalyticsStorage(options.storage,options.sessionStorage,options.env);}
  }
  getSnapshot=()=>this.decision;
  subscribe=(listener:()=>void)=>{this.listeners.add(listener);return()=>this.listeners.delete(listener);};
  private notify(){for(const listener of this.listeners)listener();}
  private start(){
    const sink=this.options.createSink?.(this.options.env,this.options.production)??(this.options.production?createConfiguredPostHogSink(this.options.env,true):localAnalyticsSink);
    this.sink=sink;setActiveAnalyticsSink(sink);
  }
  private write(decision:Exclude<AnalyticsConsentDecision,null>){
    try {this.options.storage?.setItem(ANALYTICS_CONSENT_KEY,decision);return this.options.storage?.getItem(ANALYTICS_CONSENT_KEY)===decision;} catch {return false;}
  }
  private stop(){
    const sink=this.sink;this.sink=null;setActiveAnalyticsSink(null);
    this.transition=this.transition.then(async()=>{
      try {await sink?.dispose?.();} finally {clearPostHogAnalyticsStorage(this.options.storage,this.options.sessionStorage,this.options.env);}
    });
    return this.transition;
  }
  async allow(){
    if(!this.write('granted')){await this.stop();return false;}
    await this.stop();this.start();this.decision='granted';this.notify();return true;
  }
  async deny(){
    this.write('denied');await this.stop();this.decision='denied';this.notify();return true;
  }
  async withdraw(){return this.deny();}
}

const browserStorage=(name:'localStorage'|'sessionStorage'):StorageLike|null=>{try{return typeof window==='undefined'?null:window[name];}catch{return null;}};
export const analyticsConsentController=new AnalyticsConsentController({storage:browserStorage('localStorage'),sessionStorage:browserStorage('sessionStorage'),env:import.meta.env,production:import.meta.env.PROD});

const AnalyticsConsentContext=createContext(analyticsConsentController);
export function AnalyticsConsentProvider({children,controller=analyticsConsentController}:{children:ReactNode;controller?:AnalyticsConsentController}){return <AnalyticsConsentContext.Provider value={controller}>{children}</AnalyticsConsentContext.Provider>;}
export function useAnalyticsConsent(){const controller=useContext(AnalyticsConsentContext),decision=useSyncExternalStore(controller.subscribe,controller.getSnapshot,controller.getSnapshot);return {decision,allow:()=>controller.allow(),deny:()=>controller.deny(),withdraw:()=>controller.withdraw()};}
