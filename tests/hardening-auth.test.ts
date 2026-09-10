import {expect,it,vi} from 'vitest';
import {AccountSession,type AuthAdapter,type AccountUser} from '../src/cloud/auth';
it('rejects a new sign-in while sign-out is pending so its late completion cannot hide the new account',async()=>{
 let emit:(user:AccountUser|null)=>void=()=>{},finish!:()=>void;
 const adapter:AuthAdapter={session:async()=>null,subscribe:callback=>{emit=callback;return()=>{};},signIn:vi.fn(async()=>{emit({id:'11111111-1111-4111-8111-111111111111',email:'test@example.invalid'});}),signUp:async()=>({verificationRequired:true}),signOut:()=>new Promise<void>(resolve=>{finish=resolve;})};
 const auth=new AccountSession(adapter);await auth.start();const logout=auth.signOut();
 try{await expect(auth.signIn('test@example.invalid','transient')).rejects.toThrow(/in progress/);expect(adapter.signIn).not.toHaveBeenCalled();}
 finally{finish();await logout;}
 await auth.signIn('test@example.invalid','transient');expect(auth.snapshot().user?.email).toBe('test@example.invalid');auth.close();
});
