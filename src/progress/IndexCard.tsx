import type {Aggregate,Readiness} from './types';
import {useI18n} from '../i18n/i18n';
export function MasteryCard({value}:{value:Aggregate}){
 const {t,lt}=useI18n();
 const confidence=t(value.confidence==='Insufficient'?'confidence.insufficient':value.confidence==='Low'?'confidence.low':value.confidence==='Moderate'?'confidence.moderate':'confidence.high');
 const next=value.index===null?t('learning.nextEvidence'):value.review.length?t('learning.nextReview'):value.missing.length?t('learning.nextCoverage'):t('learning.nextMaintain');
 return <article className="progress-card progress-mastery"><div className="progress-mastery-heading"><h3>{t('learning.mastery')}</h3><p className="progress-number">{value.index===null?t('learning.notEnoughPractice'):`${value.index} / 100`}</p></div>
  <div className="progress-mastery-bar" role="progressbar" aria-label={t('learning.mastery')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value.index??undefined} aria-valuetext={value.index===null?t('learning.notEnoughPractice'):`${value.index} / 100`}><span style={{width:`${value.index??0}%`}}/></div>
  <p>{t('learning.masteryMeaning')}</p><div className="progress-mastery-meta"><p><strong>{t('learning.confidence',{confidence})}</strong></p><p>{t('learning.recentSkills',{covered:value.covered,total:value.total,recent:value.recent})}</p><p><strong>{t('progress.nextStep')}</strong> {next}</p></div>
  <details><summary>{t('learning.calculated')}</summary><div className="progress-method"><p>{t('learning.method')}</p><p>{t('progress.strongest',{skills:value.strongest.map(lt).join('; ')||t('learning.noneRecorded')})}</p><p>{t('progress.recentReview',{skills:value.review.map(lt).join('; ')||t('learning.noneRecorded')})}</p><p>{t('progress.masteryEvidence',{covered:value.covered,total:value.total,recent:value.recent})}</p><p>{t('learning.separateReadiness')}</p></div></details></article>;
}
export function ReadinessCard({value}:{value:Readiness}){
 const {t}=useI18n();
 const openLabel=t(value.openState==='Limited'?'progress.openLimited':value.openState==='Practised'?'progress.openPractised':'progress.openBroad');
 const confidence=t(value.confidence==='Insufficient'?'confidence.insufficient':value.confidence==='Low'?'confidence.low':value.confidence==='Moderate'?'confidence.moderate':'confidence.high');
 const next=value.index===null||value.objectiveTopics<value.totalTopics?t('progress.readinessNextEvidence'):value.gaps.length?t('progress.readinessNextGaps'):t('progress.readinessNextMaintain');
 return <article className="progress-card"><h3>{t('dashboard.examReadiness')}</h3><p className="progress-number">{value.index===null?t('progress.noExamPractice'):`${value.index} / 100`}</p><p>{t('progress.readinessMeaning')}</p><p><strong>{t('dashboard.confidence',{value:confidence})}</strong> <span>— {t('progress.confidenceHelp')}</span></p><p>{t('progress.readinessEvidence',{sessions:value.sessions,items:value.distinctItems,topics:value.objectiveTopics,total:value.totalTopics})}</p><p>{t('progress.topicsPractised',{covered:value.practisedTopics,total:value.totalTopics})}</p><p>{t('progress.openReasoning',{state:openLabel,count:value.openMechanisms})}</p>{value.courseId==='CSE1100_IP'&&<p>{t('progress.integrated',{state:t(value.integrated?'progress.completedUngraded':'progress.notPractised')})}</p>}<p><strong>{t('progress.nextStep')}</strong> {next}</p><details><summary>{t('learning.calculated')}</summary><p>{t('progress.readinessMethod')}</p><h4>{t('progress.whatNext')}</h4><p>{t('progress.gaps',{count:value.gaps.length})}</p></details></article>;
}
