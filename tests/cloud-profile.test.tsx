// @vitest-environment jsdom
import {act,StrictMode,useState} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {BrowserRouter} from 'react-router';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import ConfiguredAccountRoot from '../src/accounts/ConfiguredAccountRoot';
import {createSupabase} from '../src/cloud/supabase';
import {useAccount} from '../src/accounts/context';
import {useLearning} from '../src/learning/LearningProvider';
import {IndexedStudentRepository} from '../src/learning/repository';
import {accountDatabase} from '../src/cloud/model';
import {emptyBackup} from '../src/learning/contracts';
import {attempt} from './helpers/learning';
import {FakeCloud} from './helpers/cloud';
import type {AccountUser,AuthAdapter} from '../src/cloud/auth';
vi.mock('../src/cloud/supabase',()=>({createSupabase:vi.fn()}));
const A={id:'11111111-1111-4111-8111-111111111111',email:'A'},B={id:'22222222-2222-4222-8222-222222222222',email:'B'};
const config={status:'configured' as const,url:'https://project.supabase.co',key:'sb_publishable_'+'a'.repeat(32)};
let host:HTMLDivElement,root:Root,callbacks:Set<(u:AccountUser|null)=>void>,adapter:AuthAdapter;
function Probe(){const account=useAccount(),learning=useLearning(),[draft,setDraft]=useState('');return <><p id="identity">{account.state.user?.email??'anonymous'}</p><p id="history">{learning?.snapshot?.data.attempts.map(a=>a.attemptId).join(',')}</p><p id="sync">{account.syncStatus}</p><input aria-label="Ephemeral draft" value={draft} onChange={e=>setDraft(e.target.value)}/><button onClick={()=>setDraft('unsaved typing')}>Type draft</button></>;}
async function settle(){for(let n=0;n<12;n++)await act(async()=>{await new Promise(r=>setTimeout(r,5));});}
beforeEach(()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true,indexedDB:new IDBFactory()});callbacks=new Set();adapter={session:async()=>A,subscribe:fn=>{callbacks.add(fn);return()=>callbacks.delete(fn);},signIn:async()=>{},signUp:async()=>({verificationRequired:true}),signOut:async()=>{callbacks.forEach(f=>f(null));}};vi.mocked(createSupabase).mockReturnValue({auth:adapter,cloud:new FakeCloud(A.id)});host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
async function seed(user:AccountUser,id:string){const r=new IndexedStudentRepository({name:accountDatabase(user.id)});const state=await r.load();await r.restore({...emptyBackup(),attempts:[attempt({attemptId:id})]},state.data);r.close();}
async function mount(strict=false){const element=<BrowserRouter><ConfiguredAccountRoot config={config}><Probe/></ConfiguredAccountRoot></BrowserRouter>;await act(async()=>root.render(strict?<StrictMode>{element}</StrictMode>:element));await settle();}
it('profile integration never renders A history under B identity',async()=>{await seed(A,'private-a');await seed(B,'private-b');await mount();expect(host.querySelector('#history')!.textContent).toBe('private-a');await act(async()=>{callbacks.forEach(f=>f(B));});expect(host.querySelector('#identity')!.textContent).toBe('B');expect(host.querySelector('#history')!.textContent).not.toContain('private-a');await settle();expect(host.querySelector('#history')!.textContent).toBe('private-b');});
it('token refresh does not remount and erase an unsaved exercise editor',async()=>{await mount();await act(async()=>host.querySelector('button')!.click());expect(host.querySelector('input')!.value).toBe('unsaved typing');await act(async()=>callbacks.forEach(f=>f(A)));await settle();expect(host.querySelector('input')!.value).toBe('unsaved typing');});
it('self-review: SDK initialization failure falls back to anonymous local learning',async()=>{vi.mocked(createSupabase).mockImplementation(()=>{throw Error('storage denied');});await mount();expect(host.querySelector('#identity')!.textContent).toBe('anonymous');});
it('final-review: choosing anonymous study cannot be overridden by a late restored session',async()=>{
  let resolve!:(user:AccountUser|null)=>void;adapter.session=()=>new Promise(r=>{resolve=r;});await mount();
  await act(async()=>host.querySelector('button')!.click());await settle();await act(async()=>host.querySelector('button')!.click());
  expect(host.querySelector('input')!.value).toBe('unsaved typing');await act(async()=>resolve(A));await settle();
  expect(host.querySelector('#identity')!.textContent).toBe('anonymous');expect(host.querySelector('input')!.value).toBe('unsaved typing');
});
