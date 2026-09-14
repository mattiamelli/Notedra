import {Link,useSearchParams} from 'react-router';
import {courses} from '../academic/navigation';
import {useProgress} from './useProgress';
import {MasteryCard,ReadinessCard} from './IndexCard';
import {POLICY_VERSION} from './mastery';
import './progress.css';
import {useI18n} from '../i18n/i18n';
export function ProgressPage(){
 const {t,lt,language}=useI18n();
 const {result,message}=useProgress(),[params,setParams]=useSearchParams();
 const course=courses.find(c=>c.subject_id===params.get('course'))??courses[0];
 const courseId=course.subject_id,topicId=params.get('topic');
 const topics=result?.topics.filter(topic=>result.skills.some(skill=>skill.topicId===topic.id&&skill.courseId===courseId))??[];
 const selected=topics.find(topic=>topic.id===topicId);
 const aggregate=result?.courses.find(value=>value.id===courseId);
 return <div className="progress-page"><h1>{t('progress.title')}</h1><p>{t('progress.description')}</p>
 <label>{t('progress.course')}<select value={courseId} onChange={event=>setParams({course:event.target.value})}>{courses.map(item=><option key={item.subject_id} value={item.subject_id}>{item.name}</option>)}</select></label>
 {!result?<p role="status">{message}</p>:<>
 <div className="progress-grid"><MasteryCard value={aggregate!}/><ReadinessCard value={result.readiness.find(value=>value.courseId===courseId)!}/></div>
 <section className="progress-card"><h2>{t('progress.next')}</h2><p>{t('progress.strongest',{skills:aggregate!.strongest.map(lt).join('; ')||t('learning.noneRecorded')})}</p><p>{t('progress.recentReview',{skills:aggregate!.review.map(lt).join('; ')||t('learning.noneRecorded')})}</p><p>{t('progress.missingMeaning',{count:aggregate!.missing.length})}</p><Link to={`/study-plan?course=${courseId}`}>{t('progress.openPath')} →</Link> · <Link to={`/mistakes?course=${courseId}`}>{t('progress.reviewMistakes')} →</Link> · <Link to={`/exams/${courseId}/setup`}>{t('progress.mockExam')} →</Link></section>
 <label>{t('progress.topic')}<select value={selected?.id??''} onChange={event=>setParams({course:courseId,...(event.target.value?{topic:event.target.value}:{})})}><option value="">{t('progress.allTopics')}</option>{topics.map(topic=><option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
 <section aria-label={t('progress.topicAria')}>{topics.filter(topic=>!selected||selected.id===topic.id).map(topic=><article className="progress-card" key={topic.id}><h2>{topic.name}</h2><MasteryCard value={topic}/><details open={!!selected}><summary>{t('progress.reliableSkills',{covered:topic.covered,total:topic.total})}</summary>{result.skills.filter(skill=>skill.topicId===topic.id).map(skill=><section key={skill.id} className="progress-skill"><h3>{lt(skill.name)}</h3><p>{skill.index===null?t('learning.notEnoughPractice'):`${skill.index} / 100`} · {t('dashboard.confidence',{value:t(skill.confidence==='Insufficient'?'confidence.insufficient':skill.confidence==='Low'?'confidence.low':skill.confidence==='Moderate'?'confidence.moderate':'confidence.high')})}</p><p>{t('progress.skillEvidence',{records:skill.observations,activities:skill.distinctItems,days:skill.days,mistakes:skill.recentMistakes})}</p>{skill.limited>0&&<p>{t('progress.limitedRecords',{count:skill.limited})}</p>}<p>{t('progress.lastSuccess',{date:skill.lastSuccess===null?t('progress.notRecorded'):new Date(skill.lastSuccess).toLocaleString(language)})}</p><details><summary>{t('learning.calculated')}</summary><p>{t('progress.skillMethod')}</p></details></section>)}</details></article>)}</section>
 <details className="progress-card"><summary>{t('progress.howOverall')}</summary><p>{t('progress.overallMethod')}</p><details><summary>{t('progress.technical')}</summary><p>{t('progress.policy',{version:POLICY_VERSION,date:new Date(result.now).toLocaleString(language)})}</p><p>{t('progress.excluded',{count:result.evidence.limited.length})}</p><p>{t('progress.confidenceMethod')}</p></details></details>
 </>}
 </div>;
}
