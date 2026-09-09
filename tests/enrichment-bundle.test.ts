import {it,expect} from 'vitest';
import {validateEnrichmentBundle,type BundleChunk} from '../scripts/enrichment-bundle';
const chunks:BundleChunk[]=[{file:'entry.js',entry:true,imports:[],modules:['src/App.tsx','src/enrichment/capabilities.json']},{file:'lazy.js',entry:false,imports:[],modules:['src/enrichment/feedback.json']}];
it('allows lazy authored teaching and initial factual capability counts',()=>expect(()=>validateEnrichmentBundle(chunks,[{file:'assets/lazy.js',prefix:'const p='}])).not.toThrow());
it.each(['source.pdf','source.zip','source.txt','book.pages.json','DelftStudy_Codex_Handoff_Pack.json','enrichment-source-inventory.json'])('rejects production source asset %s',file=>expect(()=>validateEnrichmentBundle(chunks,[{file,prefix:''}])).toThrow('Raw source'));
it('rejects PDF bytes hidden behind another extension',()=>expect(()=>validateEnrichmentBundle(chunks,[{file:'asset.bin',prefix:'%PDF-1.7'}])).toThrow('Raw source'));
it.each(['src/enrichment/content-lock.json','scripts/enrichment-baseline.json','docs/enrichment-source-inventory.json','content-pack/v1.0.1/pack.json'])('rejects build-only module %s',module=>{const c=structuredClone(chunks);c[1].modules=[module];expect(()=>validateEnrichmentBundle(c,[])).toThrow('Development-only');});
it('follows static imports transitively when detecting early teaching payloads',()=>{const c=structuredClone(chunks);c[0].imports=['lazy.js'];expect(()=>validateEnrichmentBundle(c,[])).toThrow('initial graph');});
