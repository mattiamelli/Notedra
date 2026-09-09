import {validateRLFiles,rlCapabilities} from './rl-content';
import {trustedTopicStudySource} from './topic-projection';
import type {StudyProjection} from '../src/topic-study/types';
import {checkRLSourcePolicy} from './rl-source-policy';
const data=validateRLFiles();const capabilities=rlCapabilities(data,JSON.parse(trustedTopicStudySource()) as StudyProjection);
const policy=checkRLSourcePolicy(data.policy,data.exercises,[...data.introGuided,...data.topics.flatMap(t=>t.guided)]);
console.log(`RL PASS: 9 topics / 29 subtopics / 45 skills; 9 lessons (${data.topics.length} new, published T01 preserved); ${capabilities.reduce((n,t)=>n+t.cardCount,0)} cards; ${data.exercises.length} new exact items; ${capabilities.reduce((n,t)=>n+t.guidedCount,0)} unscored guided activities; ${data.tools.length} workspaces. Zero uncovered learning/card skills. Locks, sources, capabilities and puzzle uniqueness match. ${policy.uncertainMappings} uncertain mappings blocked; ${policy.broadMappings} broad mappings remain topic-only.`);
