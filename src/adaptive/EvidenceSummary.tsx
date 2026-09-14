import {Link} from 'react-router';
import {useEvidence} from './useEvidence';
import {DAY} from './evidence';
import {useI18n} from '../i18n/i18n';
export default function EvidenceSummary({topicId}:{topicId?:string}){
 const {t}=useI18n();
 const {evidence}=useEvidence();const recent=evidence.mistakes.filter(m=>m.timestamp>=evidence.now-30*DAY&&(!topicId||m.attempt.topicId===topicId));
 if(!recent.length)return null;const query=topicId?'?topic='+encodeURIComponent(topicId):'';
 const heading=topicId?t(recent.length===1?'evidence.recentTopicOne':'evidence.recentTopicMany',{count:recent.length}):t(recent.length===1?'evidence.recentOne':'evidence.recentMany',{count:recent.length});
 return <section className="ds-resume ds-section" aria-label={t('evidence.recentAria')}><div><h2>{heading}</h2><p>{t('evidence.recentBody')}</p></div><div><Link className="ds-text-link" to={'/mistakes'+query}>{t('dashboard.reviewMistakes')} →</Link><br/><Link className="ds-text-link" to={'/study-plan'+query}>{t('evidence.openPath')} →</Link></div></section>;
}
