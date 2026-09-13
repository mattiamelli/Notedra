import {useState} from 'react';
import {Link,useSearchParams} from 'react-router';
import {PageHeading,EmptyState} from '../shell/PageParts';
import {courses,academicIndex} from '../academic/navigation';
import {useEvidence} from './useEvidence';
import {buildStudySession,STUDY_TIME_PRESETS,studyTimeLabel,type StudyTimePreset} from './session';
import type {Recommendation} from './engine';
import './adaptive.css';
import {useI18n} from '../i18n/i18n';
export function StudyPathPage({build=buildStudySession}:{build?:typeof buildStudySession}){
 const {t,lt}=useI18n();
 const {learning,evidence,refresh}=useEvidence();const [params,setParams]=useSearchParams();
 const input=Number(params.get('minutes')??30),minutes=(STUDY_TIME_PRESETS.some(n=>n===input)?input:30) as StudyTimePreset;
 const subjectId=params.get('course')??'',topicId=params.get('topic')??'';
 const [path,setPath]=useState<Recommendation[]|null>(null);const [error,setError]=useState('');
 function change(key:string,value:string){const next=new URLSearchParams(params);value?next.set(key,value):next.delete(key);if(key==='course')next.delete('topic');setParams(next);setPath(null);setError('');}
 function generate(){try{setPath(build(evidence,{minutes,subjectId,topicId:topicId||undefined}));setError('');}catch(cause){setPath(null);setError(cause instanceof Error?cause.message:'The study session could not be built.');}}
 if(!learning?.snapshot)return <><PageHeading title={t('studyPath.title')} eyebrow={t('studyPath.eyebrow').toUpperCase()}/><p role="status">{learning?.message??'Student storage is not connected.'}</p></>;
 return <div className="ds-adaptive"><PageHeading title={t('studyPath.title')} eyebrow={t('studyPath.eyebrow').toUpperCase()}><p>{t('studyPath.description')}</p></PageHeading>
  <div className="ds-mistake-filters"><label>{t('studyPath.time')}<select value={minutes} onChange={e=>change('minutes',e.target.value)}>{STUDY_TIME_PRESETS.map(n=><option key={n} value={n}>{studyTimeLabel(n)}</option>)}</select></label><label>{t('progress.course')}<select value={subjectId} onChange={e=>change('course',e.target.value)}><option value="">{t('studyPath.chooseCourse')}</option>{courses.map(c=><option key={c.subject_id} value={c.subject_id}>{c.short}</option>)}</select></label><label>{t('progress.topic')}<select disabled={!subjectId} value={topicId} onChange={e=>change('topic',e.target.value)}><option value="">{t('studyPath.courseFocus')}</option>{academicIndex.topics.filter(topic=>topic.subject_id===subjectId).map(topic=><option key={topic.topic_id} value={topic.topic_id}>{lt(topic.name)}</option>)}</select></label></div>
  <p>{t('studyPath.estimates')}</p>
  <div className="ds-storage-actions"><button className="ds-button" disabled={!subjectId||learning.phase==='busy'} onClick={generate}>{t('studyPath.build')}</button><button className="ds-button ds-button-secondary" disabled={learning.phase==='busy'} onClick={async()=>{await refresh();setPath(null);setError('');}}>{t('studyPath.reload')}</button><Link className="ds-text-link" to="/mistakes">{t('dashboard.reviewMistakes')} →</Link></div>
  {error&&<p role="alert">{error} Your selections are still available; try again.</p>}
  {path===null?<EmptyState title={t(subjectId?'studyPath.ready':'studyPath.choose')}><p>{t(subjectId?'studyPath.buildHint':'studyPath.courseRequired')}</p></EmptyState>:<><p role="status">{t('studyPath.sessionSummary',{duration:studyTimeLabel(minutes),count:path.length,minutes:path.reduce((total,action)=>total+action.minutes,0)})}</p><ol className="ds-study-queue">{path.map(action=><li key={action.id}><article className="ds-path-card"><div className="ds-evidence-meta"><span>{courses.find(c=>c.subject_id===action.subjectId)!.short} · {action.kind}</span><span>{action.minutes} min · {action.durationSource}</span></div><h2>{action.title}</h2><p>{academicIndex.topics.find(topic=>topic.topic_id===action.topicId)?.name??action.topicId}</p><p className="ds-path-reason"><strong>{t('studyPath.why')}</strong><br/>{action.reason}</p><Link className="ds-button" to={action.to}>{t('studyPath.openActivity')} →</Link></article></li>)}</ol><div className="ds-study-next"><Link className="ds-button" to={path[0].to}>{t('studyPath.start')} →</Link><button className="ds-button ds-button-secondary" onClick={generate}>{t('studyPath.rebuild')}</button></div></>}
  <details><summary>{t('studyPath.how')}</summary><p>Recent and repeated mistakes raise priority. Later correct answers and reviewed items reduce urgency without erasing your history. Without practice evidence, the session starts from authored course and topic structure.</p><p>Longer sessions add complementary phases such as prerequisite review, concept work, recall, focused application and exam-style work. They do not repeat an activity to fill time. These suggestions are study guidance, not a grade.</p><details><summary>Technical details</summary><p>Stable internal identifiers resolve ties. The extended preset uses a deterministic 120-minute planning budget. Open coding, proof self-checks and workspaces remain unscored, and this path does not calculate mastery, readiness or a predicted exam grade.</p></details></details>
 </div>;
}
