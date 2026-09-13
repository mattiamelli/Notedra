import ipEvidence from '../ip/evidence.json';
import evidence from './evidence.json';
export function EvidenceView({ids}:{ids:string[]}){
 if(!ids.length)return null;
 return <details className="ds-study-sources"><summary>Verified supplemental sources</summary><ul>{ids.map(id=>{const e=[...evidence,...ipEvidence].find(e=>e.id===id);return e?<li key={id}><strong>{e.filename}</strong><p>Physical PDF pages {e.pages.join(', ')} · {e.section}</p><p>{e.authority.replaceAll('_',' ')} · targeted mechanism verification, not a change to canonical provenance.</p></li>:null;})}</ul><p>Original sources are not bundled. Wording and numerical instances are authored for Notedra.</p></details>;
}
