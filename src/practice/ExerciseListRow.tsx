import {Link} from 'react-router';
import {courses,academicIndex} from '../academic/navigation';
import type {Attempt} from '../learning/contracts';
import {useI18n} from '../i18n/i18n';
import {ShellIcon} from '../shell/ShellIcon';
import type {PracticeExercise} from './registered-types';
import {exercisePath,attemptPath} from './catalog';
import {resolveAttempt} from './service';
import {difficultyCategory} from './difficulty';
import './exercise-ui.css';

export function ExerciseListRow({exercise,attempts=[],showTopic=false,headingLevel=3,history=false}:{exercise:PracticeExercise;attempts?:readonly Attempt[];showTopic?:boolean;headingLevel?:2|3|4;history?:boolean}){
 const {t,lt,language}=useI18n();
 const course=courses.find(item=>item.subject_id===exercise.subjectId)!;
 const saved=attempts.filter(item=>item.templateRef===exercise.id&&item.topicId===exercise.topicId).slice().reverse();
 const available=saved.filter(item=>item.status!=='ABANDONED'&&resolveAttempt(item).status==='AVAILABLE');
 const current=available.find(item=>item.status==='DRAFT')??available[0];
 const Heading=headingLevel===2?'h2':headingLevel===4?'h4':'h3';
 return <article className="ds-exercise-list-item" data-exercise={exercise.id}>
  <Link className="ds-exercise-row" to={current?attemptPath(exercise,current.attemptId):exercisePath(exercise)}>
   <ShellIcon name={course.icon} size={18}/>
   <div className="ds-exercise-row-copy"><Heading>{lt(exercise.title)}</Heading><span className="ds-exercise-row-meta">{showTopic&&<>{course.compactName} · {academicIndex.topics.find(item=>item.topic_id===exercise.topicId)?.name} · </>}{t(`practice.difficulty.${difficultyCategory(exercise)}`)}{current&&<> · {t(current.status==='DRAFT'?'practice.resumeDraft':'practice.reviewSubmission')}</>}</span></div>
   <ShellIcon name="arrow" size={16}/>
  </Link>
  {history&&saved.length>0&&<details className="ds-exercise-history"><summary>{t('practice.attempts')} ({saved.length})</summary><ul>{saved.map(attempt=><li key={attempt.attemptId}><Link className="ds-text-link" to={attemptPath(exercise,attempt.attemptId)}>{resolveAttempt(attempt).status!=='AVAILABLE'?t('practice.originalUnavailable'):t(attempt.status==='DRAFT'?'practice.resumeDraft':attempt.status==='SUBMITTED'?'practice.reviewSubmission':'practice.viewSaved')} · {new Date(attempt.createdAt).toLocaleString(language)}</Link></li>)}</ul><Link className="ds-text-link" to={exercisePath(exercise)}>{t('practice.openExercise')}</Link></details>}
 </article>;
}
