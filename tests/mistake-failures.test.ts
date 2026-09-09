import {afterEach,it,expect,vi} from 'vitest';
import * as runtime from '../src/practice/runtime';
import {deriveEvidence} from '../src/adaptive/evidence';
import {record,text,CLOCK} from './helpers/adaptive';
afterEach(()=>vi.restoreAllMocks());
it.each(['INCOMPLETE','INVALID','ERROR','NOT_AUTOGRADABLE'] as const)('trusted evaluator outcome %s never creates an academic mistake',status=>{vi.spyOn(runtime,'gradeResponse').mockReturnValue({status,message:'Controlled evaluator outcome'});const evidence=deriveEvidence([record('a','enrich-carry-overflow',text('1,1'),1)],[],CLOCK);expect(evidence.mistakes).toEqual([]);expect(evidence.groups).toEqual([]);});
