export type CloudConfig = {status:'configured';url:string;key:string} | {status:'unavailable'|'invalid';message:string};
export function cloudConfig(url: unknown, key: unknown): CloudConfig {
  if (!url && !key) return {status:'unavailable',message:'Cloud sync is not configured. All learning tools and local backups remain available.'};
  if (typeof url !== 'string' || typeof key !== 'string') return {status:'invalid',message:'Cloud configuration is incomplete. Continue using local study data.'};
  let address: URL;
  try {address=new URL(url);} catch {return {status:'invalid',message:'Cloud URL is invalid. Continue using local study data.'};}
  const local=['localhost','127.0.0.1','[::1]'].includes(address.hostname);
  if ((address.protocol!=='https:' && !(address.protocol==='http:'&&local)) || address.username || address.password || address.search || address.hash || address.pathname!=='/') return {status:'invalid',message:'Cloud URL must be an HTTPS project origin (HTTP is allowed for localhost only).'};
  let publicKey=/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key);
  if (!publicKey && /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key)) {
    try {const body: unknown=JSON.parse(atob(key.split('.')[1].replaceAll('-','+').replaceAll('_','/')));publicKey=!!body&&typeof body==='object'&&'role' in body&&body.role==='anon';} catch {/* Unknown credentials must not reach the browser client. */}
  }
  if(!publicKey)return {status:'invalid',message:'Cloud configuration requires a browser-safe publishable or anon key.'};
  return {status:'configured',url:address.origin,key};
}
export function configuredCloud(): CloudConfig {return cloudConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);}
