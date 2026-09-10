import {createContext, useContext} from 'react';
import type {AccountSession, AuthState} from '../cloud/auth';
import type {CloudConfig} from '../cloud/config';
export interface AccountContextValue {
  config:CloudConfig;
  auth:AccountSession|null;
  state:AuthState;
  syncStatus:string;
  syncMessage:string;
  sync:(()=>Promise<void>)|null;
  adopt:(()=>Promise<void>)|null;
  reconcile?:()=>Promise<void>;
}
export const anonymousState:AuthState={phase:'anonymous',user:null,message:'',epoch:0};
export const AccountContext=createContext<AccountContextValue>({config:{status:'unavailable',message:'Cloud sync is not configured.'},auth:null,state:anonymousState,syncStatus:'Local only',syncMessage:'',sync:null,adopt:null});
export const useAccount=()=>useContext(AccountContext);
