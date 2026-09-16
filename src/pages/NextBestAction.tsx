import {useCallback,useMemo} from 'react';
import {Link} from 'react-router';
import {recommend} from '../adaptive/engine';
import {presentAction} from '../adaptive/presentation';
import {useEvidence} from '../adaptive/useEvidence';
import {useI18n} from '../i18n/i18n';
import type {Language} from '../i18n/messages';
import {allExercises} from '../practice/catalog';
import {ShellIcon} from '../shell/ShellIcon';
import {selectNextBestAction,type NextBestActionSelection} from './next-best-action';
import './next-best-action.css';
import {track} from '../analytics/analytics';
import {useTrackOnce} from '../analytics/react';
import type {ActivityType} from '../analytics/events';

const copy={
 en:{label:'Next best action',loading:'Finding your next step',loadingBody:'Opening your saved study activity.',error:'Your next step is unavailable',errorBody:'Saved activity could not be read. Reload storage before starting something new.',start:'Start here',continue:'Continue where you left off',recommended:'Recommended next',path:'Build a 15-minute Study Path',coldReason:"You haven't practised this course yet.",draftReason:'You have an unfinished practice draft.',examReason:'You have an unfinished exam session.',resumeReason:'This is the last topic you visited.',oneMistake:'You made one recent mistake on this skill.',manyMistakes:'You made {count} recent mistakes on this skill.',adaptiveReason:'Based on your recent saved practice.',pathReason:'There is no clear practice recommendation yet. Build a focused session from your chosen course.',startCta:'Start practice',continueCta:'Continue',pathCta:'Build study path',quickExam:'Quick exam',fullMock:'Full mock'},
 it:{label:'Prossima azione',loading:'Ricerca del prossimo passo',loadingBody:'Apertura delle attività di studio salvate.',error:'Il prossimo passo non è disponibile',errorBody:'Impossibile leggere le attività salvate. Ricarica l’archivio prima di iniziare qualcosa di nuovo.',start:'Inizia qui',continue:'Continua da dove eri rimasto',recommended:'Prossimo consiglio',path:'Crea un Percorso di studio di 15 minuti',coldReason:'Non hai ancora svolto esercizi in questo corso.',draftReason:'Hai una bozza di esercizio non completata.',examReason:'Hai una sessione d’esame non completata.',resumeReason:'Questo è l’ultimo argomento che hai visitato.',oneMistake:'Hai commesso un errore recente su questa abilità.',manyMistakes:'Hai commesso {count} errori recenti su questa abilità.',adaptiveReason:'In base agli esercizi recenti salvati.',pathReason:'Non c’è ancora un consiglio chiaro per gli esercizi. Crea una sessione mirata dal corso che preferisci.',startCta:'Inizia gli esercizi',continueCta:'Continua',pathCta:'Crea percorso',quickExam:'Esame rapido',fullMock:'Simulazione completa'},
 es:{label:'Siguiente mejor acción',loading:'Buscando tu siguiente paso',loadingBody:'Abriendo tu actividad de estudio guardada.',error:'Tu siguiente paso no está disponible',errorBody:'No se pudo leer la actividad guardada. Recarga el almacenamiento antes de empezar algo nuevo.',start:'Empieza aquí',continue:'Continúa donde lo dejaste',recommended:'Siguiente recomendación',path:'Crea una ruta de estudio de 15 minutos',coldReason:'Todavía no has practicado este curso.',draftReason:'Tienes un borrador de práctica sin terminar.',examReason:'Tienes una sesión de examen sin terminar.',resumeReason:'Este es el último tema que visitaste.',oneMistake:'Cometiste un error reciente en esta habilidad.',manyMistakes:'Cometiste {count} errores recientes en esta habilidad.',adaptiveReason:'Según tu práctica reciente guardada.',pathReason:'Aún no hay una recomendación clara de práctica. Crea una sesión centrada en el curso que elijas.',startCta:'Empezar práctica',continueCta:'Continuar',pathCta:'Crear ruta',quickExam:'Examen rápido',fullMock:'Simulacro completo'},
 fr:{label:'Prochaine meilleure action',loading:'Recherche de votre prochaine étape',loadingBody:'Ouverture de votre activité d’étude enregistrée.',error:'Votre prochaine étape est indisponible',errorBody:'L’activité enregistrée n’a pas pu être lue. Rechargez le stockage avant de commencer une nouvelle activité.',start:'Commencez ici',continue:'Reprenez là où vous vous êtes arrêté',recommended:'Prochaine recommandation',path:'Créez un parcours d’étude de 15 minutes',coldReason:'Vous n’avez pas encore travaillé ce cours.',draftReason:'Vous avez un brouillon d’exercice inachevé.',examReason:'Vous avez une session d’examen inachevée.',resumeReason:'C’est le dernier thème que vous avez consulté.',oneMistake:'Vous avez fait une erreur récente sur cette compétence.',manyMistakes:'Vous avez fait {count} erreurs récentes sur cette compétence.',adaptiveReason:'D’après vos exercices récents enregistrés.',pathReason:'Il n’existe pas encore de recommandation d’exercice claire. Créez une session ciblée à partir du cours de votre choix.',startCta:'Commencer les exercices',continueCta:'Continuer',pathCta:'Créer le parcours',quickExam:'Examen rapide',fullMock:'Examen blanc complet'},
 de:{label:'Nächste beste Aktion',loading:'Dein nächster Schritt wird gesucht',loadingBody:'Deine gespeicherte Lernaktivität wird geöffnet.',error:'Dein nächster Schritt ist nicht verfügbar',errorBody:'Gespeicherte Aktivitäten konnten nicht gelesen werden. Lade den Speicher neu, bevor du etwas Neues beginnst.',start:'Hier anfangen',continue:'Dort weitermachen, wo du aufgehört hast',recommended:'Als Nächstes empfohlen',path:'Erstelle einen 15-minütigen Lernpfad',coldReason:'Du hast für diesen Kurs noch nicht geübt.',draftReason:'Du hast einen unfertigen Übungsentwurf.',examReason:'Du hast eine unfertige Prüfungssitzung.',resumeReason:'Dies ist das zuletzt besuchte Thema.',oneMistake:'Bei dieser Fähigkeit ist dir kürzlich ein Fehler unterlaufen.',manyMistakes:'Bei dieser Fähigkeit sind dir kürzlich {count} Fehler unterlaufen.',adaptiveReason:'Basierend auf deinen zuletzt gespeicherten Übungen.',pathReason:'Es gibt noch keine klare Übungsempfehlung. Erstelle eine gezielte Sitzung für einen Kurs deiner Wahl.',startCta:'Übung starten',continueCta:'Fortsetzen',pathCta:'Lernpfad erstellen',quickExam:'Kurzprüfung',fullMock:'Vollständige Prüfungssimulation'},
} satisfies Record<Language,Record<string,string>>;

export const nextBestActionCopy=(language:Language)=>copy[language];
const fill=(value:string,count:number|undefined)=>value.replace('{count}',String(count??0));

function heading(selection:Extract<NextBestActionSelection,{state:'ready'}>,text:typeof copy.en){
 return selection.source==='cold-start'?text.start:selection.source==='adaptive'?text.recommended:selection.source==='study-path'?text.path:text.continue;
}
function reason(selection:Extract<NextBestActionSelection,{state:'ready'}>,text:typeof copy.en){
 if(selection.source==='cold-start')return text.coldReason;
 if(selection.source==='draft')return text.draftReason;
 if(selection.source==='exam')return text.examReason;
 if(selection.source==='resume')return text.resumeReason;
 if(selection.source==='study-path')return text.pathReason;
 return selection.recentMistakes===1?text.oneMistake:selection.recentMistakes&&selection.recentMistakes>1?fill(text.manyMistakes,selection.recentMistakes):text.adaptiveReason;
}

export function NextBestAction(){
 const {language,t,lt}=useI18n(),text=copy[language];
 const {learning,evidence}=useEvidence();
 const recommendations=useMemo(()=>recommend(evidence,{minutes:20,subjectId:'',topicId:''}),[evidence]);
 const selection=useMemo(()=>selectNextBestAction({phase:learning?.phase,data:learning?.snapshot?.data??null,evidence,recommendations,exercises:allExercises}),[learning?.phase,learning?.snapshot?.data,evidence,recommendations]);
 const activityType:ActivityType=selection.state==='ready'?selection.source.replace('-','_') as ActivityType:'practice';
 const impressionKey=selection.state==='ready'?`${selection.source}:${selection.to}`:null;
 const show=useCallback(()=>{if(selection.state==='ready')track('next_action_shown',{activity_type:activityType,source_surface:'dashboard'});},[impressionKey]);
 useTrackOnce(impressionKey,show);
 if(selection.state!=='ready')return <section className={`ds-next-action is-${selection.state}`} aria-labelledby="next-action-title" aria-live="polite"><p className="ds-next-action-label">{text.label}</p><h2 id="next-action-title">{selection.state==='error'?text.error:text.loading}</h2><p>{selection.state==='error'?text.errorBody:text.loadingBody}</p></section>;
 const actionTitle=selection.recommendation?presentAction(selection.recommendation,t,lt).title:selection.title==='quick-exam'?text.quickExam:selection.title==='full-mock'?text.fullMock:selection.title==='study-path'?text.path:lt(selection.title);
 const cta=selection.cta==='start-practice'?text.startCta:selection.cta==='build-path'?text.pathCta:text.continueCta;
 return <section className={`ds-next-action is-${selection.source}`} aria-labelledby="next-action-title">
  <div className="ds-next-action-copy"><p className="ds-next-action-label">{text.label}</p><h2 id="next-action-title">{heading(selection,text)}</h2><h3>{actionTitle}</h3><p className="ds-next-action-reason">{reason(selection,text)}</p><p className="ds-next-action-meta">{[selection.course,selection.topic].filter(Boolean).join(' · ')}{selection.minutes&&<>{selection.course||selection.topic?' · ':''}{t('duration.short',{count:selection.minutes})}{selection.estimated?` · ${t('duration.estimate')}`:''}</>}</p></div>
  <Link className="ds-button ds-button-primary ds-next-action-cta" to={selection.to} onClick={()=>track('next_action_opened',{activity_type:activityType,source_surface:'dashboard'})}>{cta}<ShellIcon name="arrow" size={18}/></Link>
 </section>;
}
