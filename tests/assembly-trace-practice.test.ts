import {describe,expect,it} from 'vitest';
import {assemblyTraceExercises} from '../src/assembly-practice/catalog';
import {gradeAssemblyTrace,assemblyInteger} from '../src/assembly-practice/grading';
import {gradeResponse} from '../src/practice/runtime';
describe('typed Assembly trace exercises',()=>{
 it.each(['9',' 9 ','0x9','0X09','-1'])('parses exact integer syntax %j',value=>expect(assemblyInteger(value)).not.toBeNull());
 it.each(['',' ','9x','9.0','0x','1e2','+'])('rejects partial or noninteger syntax %j',value=>expect(assemblyInteger(value)).toBeNull());
 it('grades every pinned reference and requires all fields',()=>{
  for(const exercise of assemblyTraceExercises){
   expect(gradeResponse(exercise,exercise.reference)).toMatchObject({status:'GRADED',correct:true,earned:1,max:1});
   expect(exercise.reference.kind).toBe('text');
   const values=String(exercise.reference.value).split(',');values[values.length-1]='';
   expect(gradeAssemblyTrace(exercise,{kind:'text',value:values.join(',')}).status).toBe('INCOMPLETE');
  }
 });
 it('pins the owner benchmark and the maximum three-call exercise',()=>{
  expect(assemblyTraceExercises.find(e=>e.id.endsWith('owner-benchmark'))?.reference.value).toBe('38,18,4096,8192');
  expect(assemblyTraceExercises.find(e=>e.id.endsWith('three-calls'))?.task.code.match(/\bcall\b/g)).toHaveLength(3);
 });
});
