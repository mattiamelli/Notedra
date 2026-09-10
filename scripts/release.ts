import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import type {Plugin} from 'vite';
import {releaseRobotsText} from './release-robots';
import {academicIndex, courses, topicPath, ASSEMBLY_TOOL_PATH} from '../src/academic/navigation';

export const productionOrigin = 'https://delftstudy-assembly.mattiamelli07.chatgpt.site';
export interface ReleasePage {path:string; title:string; description:string;}
export function publicReleasePages():ReleasePage[] {
  return [
    ...courses.map(course=>({path:course.path,title:`${course.name} · DelftStudy`,description:`Study ${course.name} through topic explanations, flashcards and authored practice. Independent study support for TU Delft Computer Science & Engineering students.`})),
    ...academicIndex.topics.map(topic=>({path:topicPath(topic),title:`${topic.name} · DelftStudy`,description:`Explore ${topic.name}: learning material, flashcards and practice in DelftStudy, an independent student study platform.`})),
    {path:ASSEMBLY_TOOL_PATH,title:'x86-64 Assembly Visualizer · DelftStudy',description:'Step through AT&T x86-64 instructions and inspect registers, stack frames and function calls in your browser.'},
  ].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
}
// Keep the 47 canonical sitemap entries stable; lessons also receive their own initial head.
export function publicDocumentPages():ReleasePage[] {
  return [...publicReleasePages(),...academicIndex.topics.map(topic=>({
    path:topicPath(topic)+'/learn',title:`Learn · ${topic.name} · DelftStudy`,
    description:`Study ${topic.name} with explanations and worked examples in DelftStudy, an independent student study platform.`,
  }))].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
}
export function escapeMarkup(value:string):string {return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));}
export function sitemap(pages:ReleasePage[]):string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(page=>`  <url><loc>${escapeMarkup(productionOrigin+page.path)}</loc></url>`).join('\n')+'\n</urlset>\n';
}
export function releaseHtml(template:string,page?:ReleasePage):string {
  const title=page?.title??'DelftStudy — Your study space';
  const description=page?.description??'Independent study support for TU Delft Computer Science & Engineering students. Study Computer Organisation, Reasoning and Logic, and Java programming.';
  const metadata=`<meta name="robots" content="${page?'index,follow':'noindex,follow'}" />\n<meta property="og:type" content="website" />\n<meta property="og:site_name" content="DelftStudy" />\n<meta property="og:title" content="${escapeMarkup(title)}" />\n<meta property="og:description" content="${escapeMarkup(description)}" />\n<meta name="twitter:card" content="summary" />\n<meta name="twitter:title" content="${escapeMarkup(title)}" />\n<meta name="twitter:description" content="${escapeMarkup(description)}" />\n<link rel="manifest" href="/manifest.webmanifest" />\n${page?`<link rel="canonical" href="${productionOrigin+page.path}" />\n<meta property="og:url" content="${productionOrigin+page.path}" />`:''}\n<script src="/release-metadata.js" defer></script>`;
  return template.replace(/<title>[^<]*<\/title>/,`<title>${escapeMarkup(title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escapeMarkup(description)}" />`).replace('</head>',metadata+'\n</head>');
}

// This script reads only the route and canonical public descriptions, never learner state.
export function metadataScript(pages:ReleasePage[]):string {
  return `(()=>{const origin=${JSON.stringify(productionOrigin)},pages=${JSON.stringify(pages)};function update(){const path=location.pathname.replace(/\\/+$/,'')||'/';const page=pages.find(p=>p.path===path);const title=page?.title||document.title;const description=page?.description||'Independent study support for TU Delft Computer Science & Engineering students.';const set=(selector,value)=>{const node=document.querySelector(selector);if(node)node.setAttribute('content',value)};set('meta[name="robots"]',page?'index,follow':'noindex,follow');set('meta[name="description"]',description);set('meta[property="og:title"]',title);set('meta[property="og:description"]',description);set('meta[name="twitter:title"]',title);set('meta[name="twitter:description"]',description);document.querySelectorAll('link[rel="canonical"],meta[property="og:url"]').forEach(node=>node.remove());if(page){const link=document.createElement('link');link.rel='canonical';link.href=origin+page.path;document.head.append(link);const og=document.createElement('meta');og.setAttribute('property','og:url');og.content=origin+page.path;document.head.append(og)}}const title=document.querySelector('title');if(title)new MutationObserver(update).observe(title,{childList:true,subtree:true,characterData:true});addEventListener('popstate',update);update()})();\n`;
}
export function releaseHeaders(supabaseOrigin:string):string {
  const url=new URL(supabaseOrigin);
  if(url.protocol!=='https:'||url.origin!==supabaseOrigin||url.username||url.password)throw Error('Release requires an HTTPS Supabase origin');
  const csp=`default-src 'self'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${url.origin}; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`;
  return `/*\n  Content-Security-Policy-Report-Only: ${csp}\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n  X-Frame-Options: DENY\n  Strict-Transport-Security: max-age=300\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`;
}
export function releaseRedirects(pages:ReleasePage[]):string {
  const publicRules=pages.map((page,index)=>`${page.path} /release/page-${index}.html 200`);
  const privateRules=['/dashboard','/account','/progress','/mistakes','/study-plan','/practice','/practice/*','/exams','/exams/*','/co/*','/rl/*','/ip/*'].map(path=>`${path} /index.html 200`);
  return [...publicRules,...privateRules].join('\n')+'\n';
}
export function releaseBuildGuard():Plugin {
  let output='dist',supabaseOrigin='';
  return {name:'delftstudy-release',apply:'build',configResolved(config){output=config.build.outDir;supabaseOrigin=config.env.VITE_SUPABASE_URL??'';},closeBundle(){
    if(!supabaseOrigin)return; // Local-only builds remain available without cloud configuration.
    const template=readFileSync(`${output}/index.html`,'utf8'),pages=publicReleasePages(),documents=publicDocumentPages();
    mkdirSync(`${output}/release`,{recursive:true});
    documents.forEach((page,index)=>writeFileSync(`${output}/release/page-${index}.html`,releaseHtml(template,page)));
    writeFileSync(`${output}/index.html`,releaseHtml(template));
    writeFileSync(`${output}/404.html`,releaseHtml(template));
    writeFileSync(`${output}/robots.txt`,releaseRobotsText);
    writeFileSync(`${output}/sitemap.xml`,sitemap(pages));
    writeFileSync(`${output}/release-metadata.js`,metadataScript(documents));
    writeFileSync(`${output}/manifest.webmanifest`,JSON.stringify({name:'DelftStudy',short_name:'DelftStudy',description:'Independent computer science study tools',start_url:'/',display:'standalone',theme_color:'#0066ff',background_color:'#f0f7ff',icons:[{src:'/favicon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]})+'\n');
    writeFileSync(`${output}/_headers`,releaseHeaders(supabaseOrigin.replace(/\/$/,'')));
    writeFileSync(`${output}/_redirects`,releaseRedirects(documents));
  }};
}
