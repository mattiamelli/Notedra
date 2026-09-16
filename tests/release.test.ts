// @vitest-environment jsdom
import {describe,it,expect} from 'vitest';
import {publicReleasePages,productionOrigin,sitemap,releaseHtml,releaseHeaders,releaseRedirects,metadataScript} from '../scripts/release';
import {validateEnrichmentBundle} from '../scripts/enrichment-bundle';
const template='<!doctype html><html><head><title>Notedra</title><meta name="description" content="Study" /></head><body><div id="root"></div></body></html>';
describe('public release privacy and response preparation',()=>{
  it('uses the owner-approved Notedra production origin',()=>{
    expect(productionOrigin).toBe('https://notedra.com');
  });
  it('allows only the exact release robots text while still rejecting source text',()=>{
    const chunks=[{file:'entry.js',entry:true,imports:[],modules:[]}];
    const content=`User-agent: *\nAllow: /\nSitemap: ${productionOrigin}/sitemap.xml\n`;
    expect(()=>validateEnrichmentBundle(chunks,[{file:'robots.txt',prefix:content.slice(0,16),content}])).not.toThrow();
    expect(()=>validateEnrichmentBundle(chunks,[{file:'robots.txt',prefix:content.slice(0,16),content:content+'source text'}])).toThrow();
    expect(()=>validateEnrichmentBundle(chunks,[{file:'source.txt',prefix:content.slice(0,16),content}])).toThrow();
  });
  it('contains only the landing/legal pages, 3 courses, 43 topic overviews and the Assembly tool',()=>{
    const pages=publicReleasePages();expect(pages).toHaveLength(50);expect(new Set(pages.map(p=>p.path)).size).toBe(50);
    expect(pages.some(p=>/^\/(account|progress|practice|exams|mistakes|study-plan|dashboard)(\/|$)/.test(p.path))).toBe(false);
    expect(pages.filter(p=>['/','/privacy','/terms'].includes(p.path))).toHaveLength(3);
    expect(pages.map(p=>p.path)).toEqual([...pages.map(p=>p.path)].sort());
    expect(pages.find(page=>page.path==='/')).toEqual({path:'/',title:'Notedra — Active, measurable study',description:'Turn course material into active, measurable study with authored practice, clear feedback, Study Paths and evidence of progress.'});
  });
  it('generates valid absolute HTTPS sitemap without learner IDs or query state',()=>{
    const doc=new DOMParser().parseFromString(sitemap(publicReleasePages()),'application/xml');
    const locations=[...doc.querySelectorAll('loc')].map(node=>node.textContent!);
    expect(locations).toHaveLength(50);expect(locations.every(url=>url.startsWith(productionOrigin+'/')&&!url.includes('?'))).toBe(true);
  });
  it('escapes academic titles and descriptions as text',()=>{
    const html=releaseHtml(template,{path:'/co',title:'A < B & C',description:'"quoted" <script>bad</script>'});const doc=new DOMParser().parseFromString(html,'text/html');
    expect(doc.title).toBe('A < B & C');expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('"quoted" <script>bad</script>');
    expect(doc.querySelectorAll('script')).toHaveLength(1);
    expect(doc.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(productionOrigin+'/social-preview.png');
    expect(doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image');
  });
  it('ships personal fallback as noindex without a canonical or state-derived metadata',()=>{
    const doc=new DOMParser().parseFromString(releaseHtml(template),'text/html');
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,follow');expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
  });
  it('does not rewrite missing assets or SEO files into application HTML',()=>{
    const lines=releaseRedirects(publicReleasePages()).trim().split('\n');expect(lines.length).toBeLessThan(100);
    expect(lines.some(line=>line.startsWith('/* ')||line.startsWith('/assets/')||line.startsWith('/robots.txt')||line.startsWith('/sitemap.xml'))).toBe(false);
    expect(lines.findIndex(line=>line.startsWith('/co/CO_T01_HISTORY '))).toBeLessThan(lines.findIndex(line=>line.startsWith('/co/* ')));
  });
  it('limits CSP connections to the configured project and excludes unsafe scripts',()=>{
    const headers=releaseHeaders('https://project.supabase.co');expect(headers).toContain("script-src 'self';");expect(headers).not.toContain('unsafe-eval');expect(headers).toContain('frame-ancestors \'none\'');
    expect(headers).toContain('max-age=31536000');expect(headers).not.toContain('preload');expect(()=>releaseHeaders('https://project.supabase.co/evil')).toThrow();
  });
  it('updates metadata on navigation and removes public canonical for saved attempts',async()=>{
    document.head.innerHTML=new DOMParser().parseFromString(releaseHtml(template,publicReleasePages().find(p=>p.path==='/co')),'text/html').head.innerHTML;
    history.replaceState({},'', '/co');window.eval(metadataScript(publicReleasePages()));
    history.pushState({},'', '/practice/exercise/attempts/private-id');document.title='Practice · Notedra';await new Promise(resolve=>setTimeout(resolve,0));
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,follow');
    expect(document.head.textContent).not.toContain('private-id');
    history.pushState({},'', '/rl');document.title='Logic · Notedra';await new Promise(resolve=>setTimeout(resolve,0));
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(productionOrigin+'/rl');
  });
});
