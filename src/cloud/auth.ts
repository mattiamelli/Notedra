import {checkOwner} from './model';

export interface AccountUser {id:string;email:string;}
export interface AuthAdapter {
  session():Promise<AccountUser|null>;
  subscribe(callback:(user:AccountUser|null)=>void):()=>void;
  signIn(email:string,password:string):Promise<void>;
  signUp(email:string,password:string):Promise<{verificationRequired:boolean}>;
  signOut():Promise<void>;
}
export interface AuthState {phase:'loading'|'anonymous'|'signed-in'|'error';user:AccountUser|null;message:string;epoch:number;}
export class AccountSession {
  private state:AuthState={phase:'loading',user:null,message:'Checking account session…',epoch:0};
  private listeners=new Set<()=>void>();
  private abort=new AbortController();
  private unsubscribe:(()=>void)|null=null;
  private closed=false;
  private signingOut=false;
  constructor(private readonly adapter:AuthAdapter) {}
  snapshot=():AuthState=>this.state;
  subscribe=(listener:()=>void):(()=>void)=>{this.listeners.add(listener);return()=>{this.listeners.delete(listener);};};
  get signal():AbortSignal{return this.abort.signal;}
  private publish(user:AccountUser|null,message=''):void {
    if(this.closed)return;
    if(user)checkOwner(user.id);
    this.abort.abort();this.abort=new AbortController();
    this.state={phase:user?'signed-in':'anonymous',user: user?{...user}:null,message,epoch:this.state.epoch+1};
    this.listeners.forEach(l=>l());
  }
  private failed(message:string):void {
    if(this.closed)return;
    this.publish(null,message);this.state={...this.state,phase:'error'};this.listeners.forEach(l=>l());
  }
  async start():Promise<void> {
    if(this.unsubscribe||this.closed)return;
    try {this.unsubscribe=this.adapter.subscribe(user=>{if(!this.signingOut){try{this.publish(user);}catch{this.failed('Account identity could not be restored. Local study remains available.');}}});}
    catch {this.failed('Account session could not be initialized. Local study remains available.');return;}
    const epoch=this.state.epoch;
    try {const user=await this.adapter.session();if(this.state.epoch===epoch&&!this.signingOut)this.publish(user);}
    catch{if(this.state.epoch===epoch)this.failed('Account session could not be restored. Continue locally or retry sign-in.');}
  }
  async signIn(email:string,password:string):Promise<void> {
    this.signingOut=false;
    try{await this.adapter.signIn(email,password);}catch{throw Error('Sign-in failed. Check your email, password, email verification and connection.');}
  }
  async signUp(email:string,password:string):Promise<{verificationRequired:boolean}> {
    this.signingOut=false;
    try{return await this.adapter.signUp(email,password);}catch{throw Error('Account creation failed. Check the details and connection, then retry.');}
  }
  async signOut():Promise<void> {
    this.signingOut=true;this.publish(null,'Signing out… Account data remains saved separately in this browser.');
    try{await this.adapter.signOut();this.publish(null,'Signed out. Your account data is preserved in its separate local profile.');}
    catch{this.failed('Sign-out could not be confirmed. Account data is hidden. Retry sign-out before leaving a shared browser.');throw Error(this.state.message);}
  }
  close():void {this.closed=true;this.abort.abort();this.unsubscribe?.();this.listeners.clear();}
}
