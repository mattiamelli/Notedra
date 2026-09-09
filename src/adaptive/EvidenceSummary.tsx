import {Link} from 'react-router';
import {useEvidence} from './useEvidence';
import {DAY} from './evidence';
export default function EvidenceSummary({topicId}:{topicId?:string}){
 const {evidence}=useEvidence();const recent=evidence.mistakes.filter(m=>m.timestamp>=evidence.now-30*DAY&&(!topicId||m.attempt.topicId===topicId));
 if(!recent.length)return null;const query=topicId?'?topic='+encodeURIComponent(topicId):'';
 return <section className="ds-resume ds-section" aria-label="Recent practice evidence"><div><h2>{recent.length} recent {recent.length===1?'mistake':'mistakes'}{topicId?' in this topic':''}</h2><p>Saved wrong submissions in the last 30 days. History stays visible after correct retries.</p></div><div><Link className="ds-text-link" to={'/mistakes'+query}>Review mistakes →</Link><br/><Link className="ds-text-link" to={'/study-plan'+query}>Open Study Path →</Link></div></section>;
}
