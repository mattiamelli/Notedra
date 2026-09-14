import {Link} from 'react-router';
import {courses} from '../academic/navigation';
import {useProgress} from './useProgress';
import {MasteryCard,ReadinessCard} from './IndexCard';
import './progress.css';
import {useI18n} from '../i18n/i18n';
export default function ProgressSummary({courseId,topicId}:{courseId?:string;topicId?:string}){
 const {result,message}=useProgress(); const {t,lt}=useI18n();
 if(!result)return <p role="status">{message}</p>;
 if(topicId){const topic=result.topics.find(t=>t.id===topicId)!;return <section className="progress-summary" aria-label={t('progress.topicAria')}><MasteryCard value={topic}/><p>{t('progress.skillsNeed',{count:topic.missing.length})} {topic.review.length?t('progress.reviewNamed',{skills:topic.review.map(lt).join('; ')}):t('progress.noRecent')}</p><Link to={`/progress?course=${courseId}&topic=${topicId}`}>{t('progress.exploreSkills')} →</Link></section>;}
 return <section className="progress-summary" aria-label={t('progress.summaryAria')}><h2>{t('progress.contextTitle')}</h2><p>{t('progress.contextBody')}</p>{courses.filter(c=>!courseId||c.subject_id===courseId).map(c=>{const aggregate=result.courses.find(v=>v.id===c.subject_id)!;return <article key={c.subject_id}><h3>{c.name}</h3><div className="progress-grid"><MasteryCard value={aggregate}/><ReadinessCard value={result.readiness.find(v=>v.courseId===c.subject_id)!}/></div><p>{t('progress.skillsNeed',{count:aggregate.missing.length})}</p><p>{t('progress.recentReview',{skills:aggregate.review.map(lt).join('; ')||t('learning.noneRecorded')})}</p><Link to={`/progress?course=${c.subject_id}`}>{t('progress.exploreGaps')} →</Link> · <Link to={`/study-plan?course=${c.subject_id}`}>{t('progress.chooseActivity')} →</Link></article>;})}</section>;
}
