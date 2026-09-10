import {createClient, type Session} from '@supabase/supabase-js';
import type {CloudConfig} from './config';
import type {AccountUser, AuthAdapter} from './auth';
import type {CloudRepository} from './coordinator';
import {SyncError, validatePayload} from './model';

type Adapters={auth:AuthAdapter;cloud:CloudRepository};
const clients=new Map<string,Adapters>();
export function createSupabase(config:Extract<CloudConfig,{status:'configured'}>):Adapters {
  const identity=config.url+'\0'+config.key;
  const existing=clients.get(identity);if(existing)return existing;
  const client=createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  const user=(session:Session|null):AccountUser|null=>session?{id:session.user.id,email:session.user.email??'Account'}:null;
  const auth:AuthAdapter={
    async session(){const {data,error}=await client.auth.getSession();if(error)throw error;return user(data.session);},
    subscribe(callback){const {data}=client.auth.onAuthStateChange((_event,session)=>callback(user(session)));return()=>data.subscription.unsubscribe();},
    async signIn(email,password){const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;},
    async signUp(email,password){const {data,error}=await client.auth.signUp({email,password});if(error)throw error;return {verificationRequired:!data.session};},
    async signOut(){const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;},
  };
  const cloud:CloudRepository={
    async read(signal){
      const {data,error}=await client.from('learner_snapshots').select('user_id,revision,operation_id,schema_version,payload').abortSignal(signal).maybeSingle();
      if(error)throw new SyncError('NETWORK','Cloud download failed. Local data is safe; check your session and connection.');
      return data?{owner:data.user_id,revision:data.revision,operationId:data.operation_id,schema:data.schema_version,payload:data.payload}:null;
    },
    async put(input,signal){
      validatePayload(input.payload);
      const {data,error}=await client.rpc('sync_learner_snapshot',{expected_revision:input.expectedRevision,operation:input.operationId,learner_payload:input.payload}).abortSignal(signal);
      if(error){if(error.code==='40001')throw new SyncError('CONFLICT','Cloud changed on another device. Retry sync to compare the saved versions.');throw new SyncError(error.code==='23505'||error.code==='22023'?'INVALID':'NETWORK','Sync failed. Local data and the pending operation are preserved.');}
      return data;
    },
  };
  const adapters={auth,cloud};clients.set(identity,adapters);return adapters;
}
