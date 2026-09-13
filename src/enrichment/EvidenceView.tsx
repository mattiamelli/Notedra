import ipEvidence from '../ip/evidence.json';
import evidence from './evidence.json';
import {useI18n} from '../i18n/i18n';
export function EvidenceView({ids}:{ids:string[]}){
 const {t,lt}=useI18n();
 if(!ids.length)return null;
 return <details className="ds-study-sources"><summary>{t('evidence.verifiedSources')}</summary><ul>{ids.map(id=>{const e=[...evidence,...ipEvidence].find(e=>e.id===id);return e?<li key={id}><strong>{e.filename}</strong><p>{t('evidence.pdfPages',{pages:e.pages.join(', '),section:lt(e.section)})}</p><p>{t('evidence.verification',{authority:lt(e.authority.replaceAll('_',' '))})}</p></li>:null;})}</ul><p>{t('evidence.originals')}</p></details>;
}
