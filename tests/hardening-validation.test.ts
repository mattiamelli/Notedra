import {it,expect} from 'vitest';
import {scanSecrets,scanRuntime,scanArtifact} from '../scripts/hardening-validation';
it('detects private database and token credentials without rejecting publishable keys',()=>{
 for(const text of ['postgres'+'ql://user:private@db.example/database','refresh_'+'token="'+'a'.repeat(32)+'"','sb_'+'secret_'+'x'.repeat(25)])expect(()=>scanSecrets(text)).toThrow();
 expect(()=>scanSecrets('sb_publishable_'+'a'.repeat(32))).not.toThrow();
});
it('detects HTML injection and scriptable URLs while allowing escaped React text',()=>{
 for(const source of ['element.inner'+'HTML = answer','const a=<div dangerously'+'SetInnerHTML={{__html:answer}}/>','const href="java'+'script:alert(1)"'])expect(()=>scanRuntime(source,'test.tsx')).toThrow();
 expect(()=>scanRuntime('const view=<pre>{answer}</pre>','test.tsx')).not.toThrow();
});
it('rejects source and harness assets even when disguised as production JavaScript',()=>{
 expect(()=>scanArtifact('dist/raw.zip','')).toThrow();
 expect(()=>scanArtifact('dist/assets/innocent.js','Run native storage '+'checks')).toThrow();
 expect(()=>scanArtifact('dist/assets/index.js','const x=1')).not.toThrow();
});
