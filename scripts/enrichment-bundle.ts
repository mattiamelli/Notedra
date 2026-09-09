export interface BundleChunk {file:string;modules:string[];imports:string[];entry:boolean;}
export function validateEnrichmentBundle(chunks:BundleChunk[],files:{file:string;prefix:string}[]){
 const entry=chunks.find(c=>c.entry);if(!entry)throw new Error('Missing production entry');
 const initial=new Set<string>();function visit(file:string){if(initial.has(file))return;initial.add(file);chunks.find(c=>c.file===file)?.imports.forEach(visit);}visit(entry.file);
 for(const chunk of chunks)for(const module of chunk.modules){
  if(/content-pack\/|scripts\/|docs\/|enrichment\/content-lock\.json/.test(module))throw new Error('Development-only source bundled: '+module);
  if(initial.has(chunk.file)&&/src\/enrichment\/(?!capabilities\.json)/.test(module))throw new Error('Supplemental teaching entered initial graph: '+module);
 }
 for(const file of files)if(/\.(?:pdf|zip|txt|pages\.json)$/i.test(file.file)||/Handoff|source-inventory|enrichment-baseline/i.test(file.file)||file.prefix.startsWith('%PDF-'))throw new Error('Raw source emitted: '+file.file);
}
