// @vitest-environment jsdom
import {act, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter, Routes, Route} from 'react-router';
import {expect,it,vi} from 'vitest';
import {AppShell} from '../src/shell/AppShell';
it('failed lazy route retains navigation, hides raw error and recovers on another route',async()=>{
 Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
 const log=vi.spyOn(console,'error').mockImplementation(()=>{}),scroll=vi.spyOn(window,'scrollTo').mockImplementation(()=>{});
 const Broken=lazy(async()=>{throw Error('private SQL detail / token must not be rendered');});
 const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
 try {
  try {await act(async()=>{root.render(<MemoryRouter initialEntries={['/broken']}><Routes><Route element={<AppShell/>}><Route path="broken" element={<Suspense fallback={<p>Loading test module</p>}><Broken/></Suspense>}/><Route index element={<h1>Recovered dashboard</h1>}/></Route></Routes></MemoryRouter>);});for(let i=0;i<10;i++)await act(async()=>{await new Promise(r=>setTimeout(r,10));});}catch{/* The baseline lets this reach the root. */}
  expect(host.querySelector('nav[aria-label="Primary navigation"]')).not.toBeNull();
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('could not be loaded');
  expect(host.textContent).not.toContain('private SQL');
  const link=host.querySelector<HTMLAnchorElement>('nav[aria-label="Primary navigation"] a[href="/"]');
  await act(async()=>link!.click());expect(host.textContent).toContain('Recovered dashboard');
 }finally{await act(async()=>root.unmount());host.remove();log.mockRestore();scroll.mockRestore();}
});
