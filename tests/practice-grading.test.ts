import { describe, expect, it } from 'vitest';
import { catalog } from '../src/practice/catalog';
import { gradeResponse, validateResponse } from '../src/practice/grading';
import type { Exercise, Task } from '../src/practice/types';
import type { Answer } from '../src/learning/contracts';
const text = (value: string): Answer => ({kind:'text',value});
const choice = (...value: string[]): Answer => ({kind:'choice',value});
const [binary, hex, and, notOr, sum, even] = catalog;
describe('pure deterministic graders', () => {
  it.each([[binary,text('00101101')],[hex,text('AD')],[and,choice('ff:F','ft:F','tf:F','tt:T')],[notOr,choice('ff:T','ft:T','tf:F','tt:T')],[sum,choice('sum-10')],[even,choice('even-6')]] as const)('independent reference answer %#', (exercise, answer) => {
    expect(gradeResponse(exercise,answer)).toMatchObject({status:'GRADED',correct:true,earned:1,max:1});
    expect(gradeResponse(exercise,answer)).toEqual(gradeResponse(exercise,structuredClone(answer)));
  });
  it.each([[binary,text('10101101')],[hex,text('AE')],[and,choice('ff:T','ft:F','tf:F','tt:T')],[notOr,choice('ff:F','ft:T','tf:F','tt:T')],[sum,choice('sum-9')],[even,choice('even-10')]] as const)('explicit incorrect answer %#', (exercise,answer) => {
    expect(gradeResponse(exercise,answer)).toMatchObject({status:'GRADED',correct:false,earned:0,max:1});
  });
  it.each(['ad','Ad','aD',' AD\n','\tad '])('normalizes only allowed hex case/outer whitespace: %j', value => {
    expect(gradeResponse(hex,text(value))).toMatchObject({status:'GRADED',correct:true});
  });
  it.each(['101101','000101101','00101102','0b101101','0010 101','00101101x','+0101101'])('rejects radix width/digits/trailing garbage: %s', value => {
    const grade = gradeResponse(binary,text(value)); expect(grade.status).toBe('INVALID'); expect(grade).not.toHaveProperty('earned');
  });
  it.each(['','   ','\n'])('blank radix is incomplete: %j', value => { expect(gradeResponse(binary,text(value)).status).toBe('INCOMPLETE'); });
  it.each(['ff','ft','tf','tt'])('checks every truth row and detects missing %s', id => {
    const answers = ['ff:F','ft:F','tf:F','tt:T'];
    const changed = answers.map(token => token.startsWith(id+':') ? `${id}:${token.endsWith('T')?'F':'T'}` : token);
    expect(gradeResponse(and,choice(...changed))).toMatchObject({status:'GRADED',correct:false});
    expect(gradeResponse(and,choice(...answers.filter(token=>!token.startsWith(id+':')))).status).toBe('INCOMPLETE');
  });
  it('rejects duplicate/unknown truth cells and preserves stable row IDs regardless of payload order', () => {
    expect(gradeResponse(and,choice('ff:T','ff:F','ft:F','tf:F','tt:T')).status).toBe('INVALID');
    expect(gradeResponse(and,choice('missing:T')).status).toBe('INVALID');
    expect(gradeResponse(and,choice('tt:T','tf:F','ft:F','ff:F'))).toMatchObject({status:'GRADED',correct:true});
  });
  it('uses exact Java option identities with no text/code parsing', () => {
    for (const answer of [text('10'),choice('10'),choice(' sum-10 '),choice('sum-10','sum-9'),choice('sum-10','sum-10')]) expect(gradeResponse(sum,answer).status).toBe('INVALID');
    expect(gradeResponse(sum,choice()).status).toBe('INCOMPLETE');
  });
  it('unsupported proof/free-code tasks have no score', () => {
    for (const kind of ['proof','free-code']) {
      const task = {kind}; expect(validateResponse(task,text('therefore true')).status).toBe('NOT_AUTOGRADABLE');
      const grade = gradeResponse({...and,task: task as Task},text('proof'));
      expect(grade.status).toBe('NOT_AUTOGRADABLE'); expect(grade).not.toHaveProperty('earned');
    }
  });
  it('technical grading failures do not become incorrect answers or zero scores', () => {
    const broken = structuredClone(binary); (broken.task as Extract<Task,{kind:'radix'}>).decimal = 'not-a-number';
    const grade = gradeResponse(broken,text('00101101')); expect(grade.status).toBe('ERROR'); expect(grade).not.toHaveProperty('earned');
  });
  it('uses bigint for exact values beyond Number safe-integer bounds', () => {
    const exercise = {...hex,task:{kind:'radix',decimal:'9007199254740993',base:16,width:14,trim:true,letterCase:'either'}} as Exercise;
    expect(gradeResponse(exercise,text('20000000000001'))).toMatchObject({status:'GRADED',correct:true});
  });
  it('review regression: malformed learner payload is INVALID rather than technical ERROR', () => {
    const result=gradeResponse(binary,null as unknown as Answer);
    expect(result.status).toBe('INVALID');expect(result).not.toHaveProperty('earned');
  });
  it('review regression: corrupted trusted proposition identity is ERROR rather than an incorrect score', () => {
    const broken=structuredClone(and);if(broken.task.kind==='truth')Object.assign(broken.task,{expression:{op:'var',name:'unknown'}});
    const result=gradeResponse(broken,choice('ff:F','ft:F','tf:F','tt:T'));
    expect(result.status).toBe('ERROR');expect(result).not.toHaveProperty('earned');
  });
  it('preserves hand-checked Java code and independent execution traces', () => {
    expect(sum.task).toMatchObject({code:'int total = 0;\nfor (int i = 1; i <= 4; i++) {\n    total += i;\n}\nSystem.out.println(total);'});
    expect(even.task).toMatchObject({code:'int i = 1;\nint total = 0;\nwhile (i < 5) {\n    if (i % 2 == 0) {\n        total += i;\n    }\n    i++;\n}\nSystem.out.println(total);'});
    expect(sum.explanation).toContain('1, 3, 6, 10'); expect(even.explanation).toContain('0, 2, 2, 6');
  });
});
