import {describe,it,expect} from 'vitest';
import {createHandler,type HostedAsset,type HostingManifest} from '../hosting/handler';
import {publicDocumentPages,publicReleasePages,releaseHtml,escapeMarkup,productionOrigin} from '../scripts/release';
const template='<!doctype html><html><head><title>Notedra</title><meta name="description" content="Study" /></head><body><div id="root"></div></body></html>';
const html=(body:string):HostedAsset=>({body,type:'text/html; charset=utf-8',etag:'"test"'});
const manifest:HostingManifest={assets:{'/assets/app-abcdefgh.js':{body:'export {};',type:'text/javascript',etag:'"asset"'},'/favicon.svg':{body:'<svg/>',type:'image/svg+xml',etag:'"svg"'},'/social-preview.png':{body:'aGVsbG8=',type:'image/png',etag:'"png"',encoding:'base64'}},documents:Object.fromEntries(publicDocumentPages().map(p=>[p.path,html(releaseHtml(template,p))])),applicationPaths:['/','/account','/privacy','/terms','/progress','/mistakes','/study-plan','/practice','/exams','/co/CO_T01_HISTORY/mistakes'],shell:html(releaseHtml(template)),notFound:html(releaseHtml(template)),headers:{'Content-Security-Policy':"default-src 'self'; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','X-Frame-Options':'DENY','Strict-Transport-Security':'max-age=31536000'}};
const handler=createHandler(manifest),get=(path:string,options?:RequestInit)=>handler.fetch(new Request(productionOrigin+path,options));
describe('Sites HTTP delivery',()=>{
 for(const prefix of ['/co','/rl','/ip']){
  const topic=publicReleasePages().find(p=>p.path.startsWith(prefix+'/')&&!p.path.endsWith('/visualizer'))!;
  for(const path of [prefix,topic.path,topic.path+'/learn'])it(path+' has correct initial public head without hydration',async()=>{
   const page=publicDocumentPages().find(p=>p.path===path)!,response=get(path),body=await response.text();
   expect(response.status).toBe(200);expect(body).toContain('<title>'+escapeMarkup(page.title)+'</title>');expect(body).toContain('content="'+escapeMarkup(page.description)+'"');
   expect(body.match(/rel="canonical"/g)).toHaveLength(1);expect(body).toContain(`href="${productionOrigin+path}"`);expect(body).toContain(`property="og:url" content="${productionOrigin+path}"`);expect(body).toContain('content="index,follow"');
  });
 }
 it.each(['/account','/progress','/mistakes','/study-plan','/practice/exercise/attempts/private-id','/exams/review/private-id','/co/CO_T01_HISTORY/mistakes'])('%s stays noindex with no personal metadata',async path=>{
  const response=get(path+'?email=private@example.invalid'),body=await response.text();expect(response.status).toBe(200);expect(response.headers.get('X-Robots-Tag')).toBe('noindex, follow');expect(body).toContain('noindex,follow');expect(body).not.toContain('rel="canonical"');expect(body).not.toContain('private@example.invalid');expect(body).not.toContain('private-id');
 });
 it.each(['/assets/missing.js','/assets/missing.css','/missing.svg','/missing.png','/favicon-missing.ico','/practice/missing.js'])('%s is a genuine HTTP 404',path=>expect(get(path).status).toBe(404));
 it.each(['/not-a-route','/co/NOT_A_TOPIC','/release/page-0.html','/_headers','/server/index.js','/.env.local'])('%s cannot expose an internal artifact or gain SPA success',async path=>{const response=get(path);expect(response.status).toBe(404);expect(await response.text()).toContain('noindex,follow');});
 it('normalizes trailing slashes without introducing competing canonical URLs',async()=>{expect(await get('/co/').text()).toBe(await get('/co').text());});
 it('serves real static files with immutable hashed caching',async()=>{const r=get('/assets/app-abcdefgh.js');expect(r.status).toBe(200);expect(r.headers.get('Content-Type')).toBe('text/javascript');expect(r.headers.get('Cache-Control')).toContain('immutable');expect(await r.text()).toBe('export {};');expect(get('/favicon.svg').headers.get('Content-Type')).toBe('image/svg+xml');});
 it('delivers binary social artwork with its exact bytes and type',async()=>{const response=get('/social-preview.png');expect(response.status).toBe(200);expect(response.headers.get('Content-Type')).toBe('image/png');expect(new Uint8Array(await response.arrayBuffer())).toEqual(new TextEncoder().encode('hello'));});
 it('delivers response security policies on documents, assets, errors and unsupported methods',()=>{
  for(const response of [get('/co'),get('/account'),get('/assets/app-abcdefgh.js'),get('/missing.css'),get('/account',{method:'POST',body:'private'})])for(const [key,value] of Object.entries(manifest.headers))expect(response.headers.get(key)).toBe(value);
  expect(get('/account',{method:'POST'}).status).toBe(405);expect(get('/account',{method:'POST'}).headers.get('Allow')).toBe('GET, HEAD');
 });
 it('supports HEAD and conditional revalidation without body or losing security headers',async()=>{const head=get('/co',{method:'HEAD'}),cached=get('/co',{headers:{'If-None-Match':'"test"'}});expect(head.status).toBe(200);expect(await head.text()).toBe('');expect(cached.status).toBe(304);expect(await cached.text()).toBe('');expect(cached.headers.get('X-Frame-Options')).toBe('DENY');});
 it('adds landing and legal pages while keeping private routes out',()=>{expect(publicReleasePages()).toHaveLength(50);expect(publicDocumentPages()).toHaveLength(93);expect(new Set(publicDocumentPages().map(p=>p.path)).size).toBe(93);});
});
