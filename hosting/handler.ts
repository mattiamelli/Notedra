export interface HostedAsset {body:string; type:string; etag:string;}
export interface HostingManifest {
  assets:Record<string,HostedAsset>;
  documents:Record<string,HostedAsset>;
  applicationPaths:string[];
  shell:HostedAsset;
  notFound:HostedAsset;
  headers:Record<string,string>;
}

/** HTTP delivery only. Never reads cookies, authorization, learner data or request bodies. */
export function createHandler(manifest:HostingManifest) {
  return {fetch(request:Request):Response {
    const headers=new Headers(manifest.headers);
    if(!['GET','HEAD'].includes(request.method)) {
      headers.set('Allow','GET, HEAD');
      return new Response('Method not allowed',{status:405,headers});
    }
    const path=new URL(request.url).pathname;
    const asset=Object.hasOwn(manifest.assets,path)?manifest.assets[path]:undefined;
    const normalized=path.replace(/\/+$/,'')||'/';
    const document=Object.hasOwn(manifest.documents,normalized)?manifest.documents[normalized]:undefined;
    const staticRequest=/\.[a-z0-9]{1,12}$/i.test(normalized)&&!normalized.startsWith('/practice/');
    const missingAsset=/\.(?:m?js|css|map|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|pdf|zip)$/i.test(normalized);
    const dynamic=!missingAsset&&!staticRequest&&(
      /^\/practice\/[^/]+(?:\/attempts\/[^/]+)?$/.test(normalized)||
      /^\/exams\/(?:sessions|review)\/[^/]+$/.test(normalized)
    );
    const application=manifest.applicationPaths.includes(normalized)||dynamic;
    const status=asset||document||application?200:404;
    const selected=asset??document??(application?manifest.shell:manifest.notFound);
    headers.set('Content-Type',selected.type);
    headers.set('ETag',selected.etag);
    headers.set('Cache-Control',asset&&/^\/assets\/.+-[\w-]{8,}\./.test(path)?'public, max-age=31536000, immutable':'public, max-age=0, must-revalidate');
    if(!asset)headers.set('X-Robots-Tag',document?'index, follow':'noindex, follow');
    if(status===200&&request.headers.get('If-None-Match')===selected.etag)return new Response(null,{status:304,headers});
    return new Response(request.method==='HEAD'?null:selected.body,{status,headers});
  }};
}
