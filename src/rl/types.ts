import type {AuthoredScope,Flashcard,Lesson} from '../topic-study/types';
export interface RubricField {id:string;label:string;placeholder?:string;}
export interface GuidedActivity extends AuthoredScope {title:string;prompt:string;fields:RubricField[];rubric:string[];reference:string[];}
export interface RLTopicContent {lesson:Lesson;cards:Flashcard[];guided:GuidedActivity[];}
export interface RLTool {id:string;version:string;name:string;topicId:string;skillIds:string[];sourceIds:string[];summary:string;assumptions:string;}
export interface SkillCoverage {skillId:string;category:'A'|'B'|'C'|'D'|'E';reason:string;exerciseIds:string[];guidedIds:string[];toolId:string|null;}
export interface RLCapability {topicId:string;lessonId:string;cardCount:number;exerciseCount:number;guidedCount:number;toolId:string|null;toolName:string|null;}
