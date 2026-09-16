import {describe,expect,it} from 'vitest';
import {selectNextBestAction} from '../src/pages/next-best-action';
import {nextBestActionCopy} from '../src/pages/NextBestAction';
import {allExercises} from '../src/practice/catalog';
import {emptyBackup,type Dataset} from '../src/learning/contracts';
import type {Evidence} from '../src/adaptive/evidence';
import type {Recommendation} from '../src/adaptive/engine';

const data=(overrides:Partial<Dataset>={}):Dataset=>({...emptyBackup(),generation:'next-action-test',revision:0,...overrides});
const evidence=(recent=0):Evidence=>({mistakes:[],limited:[],now:Date.parse('2026-09-15T10:00:00.000Z'),groups:recent?[{skill:{id:'skill',name:'Propositional Logic',topicId:'RL_T01_PROP_LOGIC',subjectId:'CSE1300_RL',prerequisites:[],sources:[]},mistakes:[],recent:Array.from({length:recent}) as never[],successes:[],latest:{} as never,laterSuccesses:0,distinctExercises:recent,repeatedPatterns:[],state:'active'}]:[]});
const recommendation:Recommendation={id:'learn:skill',title:'Review Propositional Logic',topicId:'RL_T01_PROP_LOGIC',subjectId:'CSE1300_RL',skillIds:['skill'],kind:'learn',minutes:5,durationSource:'Notedra estimate',to:'/rl/RL_T01_PROP_LOGIC/learn',reason:'Existing engine reason',priority:10,basisSkillId:'skill'};
const select=(state:Dataset|null,recommendations:Recommendation[]=[],recent=0,phase:'loading'|'ready'|'busy'|'error'='ready')=>selectNextBestAction({phase,data:state,evidence:evidence(recent),recommendations,exercises:allExercises});

describe('Next Best Action presentation selector',()=>{
 it('offers one real Computer Organisation exercise for no activity',()=>{const result=select(data());expect(result).toMatchObject({state:'ready',source:'cold-start',cta:'start-practice',course:'Computer Organisation'});if(result.state==='ready')expect(result.to).toMatch(/^\/practice\/ds\.practice\.co-/);});
 it('resumes the last valid topic with its canonical route',()=>{const result=select(data({resume:{subjectId:'CSE1300_RL',topicId:'RL_T01_PROP_LOGIC',visitedAt:'2026-09-15T09:00:00.000Z'}}));expect(result).toMatchObject({state:'ready',source:'resume',to:'/rl/RL_T01_PROP_LOGIC'});});
 it('uses recent mistake count only to explain an existing adaptive recommendation',()=>{const result=select(data({attempts:[{} as never]}),[recommendation],2);expect(result).toMatchObject({state:'ready',source:'adaptive',recentMistakes:2,to:recommendation.to});});
 it('preserves the destination and duration of the existing recommendation',()=>{const result=select(data({reviews:[{} as never]}),[recommendation]);expect(result).toMatchObject({state:'ready',source:'adaptive',to:'/rl/RL_T01_PROP_LOGIC/learn',minutes:5,estimated:true});});
 it('falls back to a 15-minute Study Path when activity has no recommendation',()=>expect(select(data({upcomingExams:[{id:'one',name:'Exam',examDate:'2026-10-01'}]}))).toMatchObject({state:'ready',source:'study-path',to:'/study-plan?minutes=15',minutes:15}));
 it('keeps loading distinct from a new user',()=>expect(select(null,[],0,'loading')).toEqual({state:'loading'}));
 it('keeps storage errors distinct from a new user',()=>expect(select(null,[],0,'error')).toEqual({state:'error'}));
 it('uses existing course route mappings',()=>{const result=select(data({resume:{subjectId:'CSE1100_IP',topicId:'IP_T01_JAVA_BASICS',visitedAt:'2026-09-15T09:00:00.000Z'}}));expect(result).toMatchObject({state:'ready',to:'/ip/IP_T01_JAVA_BASICS',course:'Programming'});});
 it('provides complete copy for EN, IT, ES, FR and the long German locale',()=>{for(const language of ['en','it','es','fr','de'] as const){const value=nextBestActionCopy(language);expect(value.label.length).toBeGreaterThan(5);expect(value.pathReason.length).toBeGreaterThan(25);expect(value.continueCta.length).toBeGreaterThan(3);}});
 it('does not mutate learning, evidence, recommendation, mastery or readiness data',()=>{const state=data({resume:{subjectId:'CSE1400_CO',topicId:'CO_T04_DATA_REP_RADIX_INTEGER',visitedAt:'2026-09-15T09:00:00.000Z'}}),facts=evidence(2),before=structuredClone({state,facts,recommendation,mastery:{index:41},readiness:{index:null}});selectNextBestAction({phase:'ready',data:state,evidence:facts,recommendations:[recommendation],exercises:allExercises});expect({state,facts,recommendation,mastery:{index:41},readiness:{index:null}}).toEqual(before);});
});
