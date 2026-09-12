// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {it,expect} from 'vitest';
import CompletionGuides from '../src/expansion/CompletionGuides';
import guides from '../src/expansion/completion-guided.json';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
it('all 62 restored-source guides select the proper topic/mode and reveal only an unscored rubric',async()=>{
 const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
 try{for(const topicId of new Set(guides.map(g=>g.topicId)))for(const mode of ['practice','exam'] as const){
  await act(async()=>root.render(<MemoryRouter><CompletionGuides topicId={topicId} mode={mode}/></MemoryRouter>));
  const expected=guides.filter(g=>g.topicId===topicId&&g.mode===mode),articles=[...host.querySelectorAll('article')];expect(articles).toHaveLength(expected.length);
  for(const [i,article] of articles.entries()){
   expect(article.querySelector('h3')?.textContent).toBe(expected[i].title);expect(article.querySelectorAll('textarea')).toHaveLength(expected[i].fields.length);
   expect(article.querySelector<HTMLElement>('[id$="-criteria"]')?.hidden).toBe(true);await act(async()=>article.querySelector<HTMLButtonElement>('button')!.click());expect(article.querySelector<HTMLElement>('[id$="-criteria"]')?.hidden).toBe(false);expect(article.textContent).toContain('does not verify a proof');expect(article.textContent).toContain('not saved as a submitted Practice attempt');expect(article.textContent).not.toContain('Submit answer');
  }
  const ids=[...host.querySelectorAll('[id]')].map(e=>e.id);expect(new Set(ids).size).toBe(ids.length);
 }}finally{await act(async()=>root.unmount());host.remove();}
});
