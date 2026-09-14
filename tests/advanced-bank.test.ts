import {describe,expect,it} from 'vitest';
import definitions from '../src/advanced/practice.json';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {gradeResponse} from '../src/practice/runtime';

describe('advanced exercise bank',()=>{
  it('registers eight immutable exercises for every canonical unit',()=>{
    const counts=new Map<string,number>();
    for(const exercise of definitions)counts.set(exercise.unitId,(counts.get(exercise.unitId)??0)+1);
    expect(definitions).toHaveLength(424);
    expect(counts.size).toBe(53);
    expect([...counts.values()]).toEqual(Array(53).fill(8));
    expect(definitions.every(exercise=>allExercises.some(item=>item.id===exercise.id))).toBe(true);
    expect(definitions.every(exercise=>versionBinding(exercise as never).includes('sha256:'))).toBe(true);
  });

  it('keeps the required difficulty and exam distributions',()=>{
    const count=(key:string,value:string)=>definitions.filter(item=>item[key as keyof typeof item]===value).length;
    expect(count('difficulty','Medium')).toBe(127);
    expect(count('difficulty','Hard')).toBe(267);
    expect(count('difficulty','Exam-level')).toBe(30);
    expect(count('mode','exam')).toBe(212);
  });

  it('grades every trusted reference exactly and rejects representative near misses',()=>{
    for(const exercise of definitions)expect(gradeResponse(exercise as never,exercise.reference as never)).toMatchObject({status:'GRADED',correct:true,earned:1,max:1});
    for(const exercise of definitions){
      let value='0';
      if(exercise.reference.kind==='text'){
        const reference=exercise.reference.value;
        if(exercise.task.format==='binary')value=(reference[0]==='0'?'1':'0')+reference.slice(1);
        else if(exercise.task.format==='hex')value=reference.slice(0,-1)+(reference.at(-1)?.toLowerCase()==='f'?'e':'f');
        else if(exercise.task.format==='integer-set')value=reference==='{}'?'{999}':reference.slice(0,-1)+',999}';
        else value=String(Number(reference)+1);
      }
      const wrong=exercise.task.kind==='ip-fixed'?{kind:'choice' as const,value:['near-miss']}:{kind:'text' as const,value};
      expect(gradeResponse(exercise as never,wrong)).toMatchObject({status:'GRADED',correct:false,earned:0,max:1});
    }
  });
});
