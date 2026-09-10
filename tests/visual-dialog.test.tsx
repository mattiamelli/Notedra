// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {expect,it,vi} from 'vitest';
import {ExamDialog} from '../src/exams/ExamDialog';
it('returns keyboard focus to the exam action when the dialog is dismissed',async()=>{
 Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
 const methods=['showModal','close'] as const;
 const original=methods.map(name=>Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,name));
 for(const name of methods)Object.defineProperty(HTMLDialogElement.prototype,name,{configurable:true,value:vi.fn()});
 const opener=document.createElement('button');opener.textContent='Finish and submit';document.body.append(opener);opener.focus();
 const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
 try {
  await act(async()=>root.render(<ExamDialog title="Submit this exam?" busy={false} label="Confirm submission" onCancel={()=>{}} onConfirm={()=>{}}>Saved answers are locked on submission.</ExamDialog>));
  await act(async()=>root.render(null));
  expect(document.activeElement).toBe(opener);
 } finally {await act(async()=>root.unmount());host.remove();opener.remove();methods.forEach((name,index)=>{const descriptor=original[index];if(descriptor)Object.defineProperty(HTMLDialogElement.prototype,name,descriptor);else Reflect.deleteProperty(HTMLDialogElement.prototype,name);});}
});
