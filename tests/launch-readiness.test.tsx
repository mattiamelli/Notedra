// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {LegalPage} from '../src/pages/LegalPage';
import {readFileSync} from 'node:fs';

describe('launch legal and security surfaces',()=>{
  let host:HTMLDivElement;
  beforeEach(()=>{host=document.createElement('div');document.body.append(host);Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});});
  afterEach(()=>host.remove());
  async function render(kind:'privacy'|'terms'){const root=createRoot(host);await act(async()=>root.render(<MemoryRouter><LegalPage kind={kind}/></MemoryRouter>));return root;}
  it('explains the real anonymous, account, sync, backup, cookie and analytics behavior',async()=>{
    const root=await render('privacy');
    const text=host.textContent??'';
    for(const expected of ['need an account to enter the study app','Supabase Auth','synchronized learner snapshot','export a JSON backup','does not add analytics','strictly necessary security or session cookies','does not sell learner data'])expect(text).toContain(expected);
    expect(text).not.toMatch(/GDPR compliant|TU Delft/i);
    await act(async()=>root.unmount());
  });
  it('states the independent platform, learner responsibility, acceptable use and source limits',async()=>{
    const root=await render('terms');const text=host.textContent??'';
    for(const expected of ['not an official service of any university','do not guarantee','responsible for checking official course information','automate abusive account creation','ownership of course sources'])expect(text).toContain(expected);
    await act(async()=>root.unmount());
  });
  it('uses the approved public contact consistently on both legal pages',async()=>{
    for(const kind of ['privacy','terms'] as const){
      const root=await render(kind);const link=host.querySelector('a[href="mailto:notedra.support@gmail.com"]');
      expect(link?.textContent).toBe('notedra.support@gmail.com');
      await act(async()=>root.unmount());
    }
  });
  it('uses the same approved public contact for footer support',()=>{
    const contact=readFileSync('src/legal/contact.ts','utf8'),shell=readFileSync('src/shell/AppShell.tsx','utf8');
    expect(contact).toContain("PUBLIC_LEGAL_CONTACT='notedra.support@gmail.com'");
    expect(shell).toContain('mailto:${PUBLIC_LEGAL_CONTACT}');
    expect(shell).toContain("t('nav.support')}</a>");
  });
  it('keeps the administrative RLS helper unavailable to browser roles without changing policies',()=>{
    const sql=readFileSync('supabase/migrations/20260912205044_restrict_rls_auto_enable.sql','utf8');
    expect(sql).toContain("revoke all on function public.rls_auto_enable() from public, anon, authenticated");
    expect(sql).not.toMatch(/\b(?:alter|drop|create)\s+(?:policy|table)|\benable\s+row\s+level\s+security/i);
  });
  it('bounds public account inputs and retains the backup size boundary',()=>{
    const account=readFileSync('src/accounts/AccountPage.tsx','utf8'),backup=readFileSync('src/learning/StudentDataPanel.tsx','utf8');
    expect(account).toMatch(/type="email"[^>]*maxLength=\{254\}/);expect(account).toMatch(/type="password"[^>]*maxLength=\{128\}/);
    expect(account).toContain('maxLength={80}');expect(backup).toContain('file.size > MAX_BACKUP_BYTES');
  });
});
