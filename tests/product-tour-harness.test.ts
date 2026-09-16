import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const read=(path:string)=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

describe('local Product Tour harness isolation',()=>{
  it('is guarded for development and uses only fixture state',()=>{
    const source=read('src/tour/harness.tsx');
    expect(source).toContain('import.meta.env.DEV');
    expect(source).toContain('createFixtureRepository');
    expect(source).toContain("phase:'signed-in'");
    expect(source).toContain("initialEntries={['/dashboard']}");
    expect(source).toContain('path="dashboard" element={<DashboardPage/>}');
    for(const language of ['en','it','es','fr','de']) expect(source).toContain(`setLanguage('${language}')`);
    expect(source).not.toContain('supabase');
  });

  it('is absent from production routing and build inputs',()=>{
    expect(read('src/App.tsx')).not.toContain('tour-harness');
    expect(read('vite.config.ts')).not.toContain('tour-harness');
    expect(read('index.html')).not.toContain('tour-harness');
    expect(read('src/tour/tour.css')).toContain('grid-template-columns: repeat(7,1fr)');
  });
});
