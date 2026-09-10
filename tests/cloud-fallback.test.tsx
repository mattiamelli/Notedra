// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router';
import {it,expect,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {AccountRoot} from '../src/accounts/AccountRoot';
vi.mock('../src/cloud/config',()=>({configuredCloud:()=>({status:'configured',url:'https://project.supabase.co',key:'public'})}));
vi.mock('../src/accounts/ConfiguredAccountRoot',()=>{throw Error('Injected unavailable account chunk');});
it('self-review: unavailable optional account chunk does not prevent local learning',async()=>{
  Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true,indexedDB:new IDBFactory()});
  const diagnostic=vi.spyOn(console,'error').mockImplementation(()=>{}),host=document.createElement('div');document.body.append(host);const root=createRoot(host);
  try {
    try {await act(async()=>{root.render(<BrowserRouter><AccountRoot><p>Local learning content</p></AccountRoot></BrowserRouter>);await new Promise(r=>setTimeout(r,50));});} catch {/* Regression: the pre-fix unhandled lazy failure removes the app. */}
    for(let n=0;n<12;n++)await act(async()=>{await new Promise(r=>setTimeout(r,10));});
    expect(host.textContent).toContain('Local learning content');expect(diagnostic).toHaveBeenCalled();
  } finally {await act(async()=>root.unmount());host.remove();diagnostic.mockRestore();}
});
