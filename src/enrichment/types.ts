import type {Exercise} from '../practice/types';
import type {AuthoredScope} from '../topic-study/types';
export interface EnrichmentTask {kind:'enrichment-exact'; parts:2|3;}
export interface EnrichmentExercise extends Omit<Exercise,'task'|'grader'> {task:EnrichmentTask;grader:{id:'enrichment-exact';version:'1'};}
export interface Evidence {id:string;filename:string;pages:number[];section:string;authority:'OFFICIAL_LECTURE'|'OFFICIAL_ASSESSMENT'|'COURSE_TEXTBOOK'|'REFERENCE_TEXTBOOK';skillIds:string[];}
export interface EnrichmentScope extends AuthoredScope {evidenceIds:string[];}
export interface ExtraCard extends EnrichmentScope {prompt:string;answer:string;reason:string;}
export interface StudyCue extends EnrichmentScope {text:string;}
export interface Misconception extends EnrichmentScope {label:string;rule:string;}
export interface FeedbackProfile extends EnrichmentScope {
 exerciseId:string;binding:string;reasoning:string;remember:string;fallback:string;
 paths:{answer:string;misconceptionId:string;why:string}[];
}
export interface GuidedSupplement extends EnrichmentScope {title:string;prompt:string;conditions:string[];pitfalls:string[];reference:string[];}
