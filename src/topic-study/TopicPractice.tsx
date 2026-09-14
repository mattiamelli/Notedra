import { Link } from 'react-router';
import { allExercises as catalog,exercisePath,attemptPath } from '../practice/catalog';
import { resolveAttempt } from '../practice/service';
import { useLearning } from '../learning/LearningProvider';
import { EmptyState } from '../shell/PageParts';
import {useI18n} from '../i18n/i18n';
export function TopicPractice({topicId,hasStudyActivities=false,mode}:{topicId:string;hasStudyActivities?:boolean;mode?:'exam'}){
 const learning=useLearning();const {t,lt,language}=useI18n();const exercises=catalog.filter(e=>e.topicId===topicId&&(!mode||('mode' in e&&e.mode===mode)));
 const heading=t(mode==='exam'?'practice.examChallenges':'practice.title');
 if(!exercises.length&&hasStudyActivities)return <section><h2>{heading}</h2><p>{t('practice.noGradedTopic')}</p></section>;
 if(!exercises.length)return <EmptyState title={t('practice.topicUnavailable')}><p>{t('practice.noAuthoredTopic')}</p></EmptyState>;
 return <section><h2>{heading}</h2><p>{t('practice.topicCount',{count:exercises.length})}</p><div className="ds-practice-grid">{exercises.map(exercise=>{
 const attempts=learning?.snapshot?.data.attempts.filter(attempt=>attempt.templateRef===exercise.id&&attempt.topicId===topicId)??[];
 return <article className="ds-practice-card" key={exercise.id}><h3>{lt(exercise.title)}</h3><Link className="ds-button" to={exercisePath(exercise)}>{t('practice.openExercise')}<span className="sr-only">: {lt(exercise.title)}</span></Link>{attempts.length>0&&<ul>{[...attempts].reverse().map(attempt=><li key={attempt.attemptId}><Link className="ds-text-link" to={attemptPath(exercise,attempt.attemptId)}>{resolveAttempt(attempt).status!=='AVAILABLE'?t('practice.originalUnavailable'):attempt.status==='DRAFT'?t('practice.resumeDraft'):attempt.status==='SUBMITTED'?t('practice.reviewSubmission'):t('practice.viewSaved')} · {new Date(attempt.createdAt).toLocaleString(language)}</Link></li>)}</ul>}</article>;
 })}</div><Link className="ds-text-link" to="/practice">{t('practice.openFull')}</Link></section>;
}
