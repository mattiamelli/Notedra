import type {Flashcard, Lesson} from '../topic-study/types';
import type {GuidedActivity} from '../rl/types';
import type {Exercise} from '../practice/types';
export interface IPTopicContent {lesson:Lesson;cards:Flashcard[];guided:GuidedActivity[];}
export interface IPTask {kind:'ip-fixed';code:string;options:{id:string;output:string}[];}
export interface IPExercise extends Omit<Exercise,'task'|'grader'> {task:IPTask;grader:{id:'ip-fixed-choice';version:'1'};}
export interface CodeFile {name:string;language:'java'|'text';content:string;}
export interface IPAssignment {
 id:string;version:string;title:string;minutes:15|30|60;topicId:string;relatedTopicIds:string[];
 skillIds:string[];subtopicIds:string[];sourceIds:string[];evidenceIds:string[];instructions:string[];
 starterFiles:CodeFile[];requirements:{id:string;text:string;skillIds:string[]}[];
 rubric:{id:string;text:string;requirementIds:string[];skillIds:string[];testIds:string[]}[];referenceId:string;
}
export interface IPReference {
 id:string;version:string;assignmentId:string;files:CodeFile[];
 tests:{id:string;name:string;requirementIds:string[];skillIds:string[];description:string;expected:string}[];reasoning:string[];
}
export interface AssignmentSummary {id:string;version:string;file:string;title:string;minutes:15|30|60;topicId:string;relatedTopicIds:string[];}
export interface IPCapability {topicId:string;lessonId:string;cardCount:number;exerciseCount:number;guidedCount:number;assignmentCount:number;}
export interface SkillCoverage {skillId:string;category:'A'|'B'|'C'|'D'|'E';reason:string;exerciseIds:string[];guidedIds:string[];assignmentIds:string[];}
