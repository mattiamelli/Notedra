import { Link } from 'react-router';
import { allExercises as catalog } from '../practice/catalog';
import {ExerciseListRow} from '../practice/ExerciseListRow';
import { useLearning } from '../learning/LearningProvider';
import { EmptyState } from '../shell/PageParts';
import {useI18n} from '../i18n/i18n';
export function TopicPractice({topicId,hasStudyActivities=false,mode}:{topicId:string;hasStudyActivities?:boolean;mode?:'exam'}){
 const learning=useLearning();const {t}=useI18n();const exercises=catalog.filter(e=>e.topicId===topicId&&(!mode||('mode' in e&&e.mode===mode)));
 const heading=t(mode==='exam'?'practice.examChallenges':'practice.title');
 if(!exercises.length&&hasStudyActivities)return <section><h2>{heading}</h2><p>{t('practice.noGradedTopic')}</p></section>;
 if(!exercises.length)return <EmptyState title={t('practice.topicUnavailable')}><p>{t('practice.noAuthoredTopic')}</p></EmptyState>;
 return <section><h2>{heading}</h2><p>{t('practice.topicCount',{count:exercises.length})}</p><div className="ds-exercise-list">{exercises.map(exercise=><ExerciseListRow key={exercise.id} exercise={exercise} attempts={learning?.snapshot?.data.attempts} history/>)}</div><Link className="ds-text-link" to="/practice">{t('practice.openFull')}</Link></section>;
}
