// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {ExamDatePicker,daysInMonth,displayExamDate,examDateParts,localDateKey,partsToExamDate} from '../src/pages/ExamDatePicker';
import DashboardExams,{calendarDays,countdownLabel,sortedUpcomingExams} from '../src/pages/DashboardExams';
import {useLearning} from '../src/learning/LearningProvider';
import {emptyBackup} from '../src/learning/contracts';
vi.mock('../src/learning/LearningProvider',async original=>({...await original<typeof import('../src/learning/LearningProvider')>(),useLearning:vi.fn(()=>null)}));

it('keeps date-only values canonical without UTC conversion',()=>{
  expect(examDateParts('2028-02-29')).toEqual({year:'2028',month:'2',day:'29'});expect(partsToExamDate({year:'2028',month:'2',day:'29'})).toBe('2028-02-29');expect(displayExamDate('2028-02-29')).toBe('29/02/2028');
  expect(localDateKey(new Date(2026,11,31,23,59))).toBe('2026-12-31');
});

it('handles month, year, and leap-year boundaries',()=>{
  expect(daysInMonth(2028,2)).toBe(29);expect(daysInMonth(2027,2)).toBe(28);expect(daysInMonth(2026,4)).toBe(30);expect(daysInMonth(2026,12)).toBe(31);
  expect(partsToExamDate({year:'2027',month:'2',day:'29'})).toBe('');expect(calendarDays('2026-12-31','2027-01-01')).toBe(1);
});

it('labels today and tomorrow and sorts upcoming exams without expired entries',()=>{
  expect(countdownLabel(0)).toBe('TODAY');expect(countdownLabel(1)).toBe('TOMORROW');
  const sorted=sortedUpcomingExams([{id:'late',name:'Late',examDate:'2027-01-05'},{id:'past',name:'Past',examDate:'2026-12-30'},{id:'soon',name:'Soon',examDate:'2027-01-01'}],'2026-12-31');
  expect(sorted.map(exam=>exam.id)).toEqual(['soon','late']);expect(sorted.map(exam=>exam.days)).toEqual([1,5]);
});

describe('three-part exam date control',()=>{
  let host:HTMLDivElement,root:ReturnType<typeof createRoot>;
  beforeEach(()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});host=document.createElement('div');document.body.append(host);root=createRoot(host);});
  afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
  it('renders explicit accessible day, month, and year choices for desktop and mobile layouts',()=>{const html=renderToStaticMarkup(<ExamDatePicker name="date" defaultValue="2028-02-29"/>);for(const label of ['Exam day','Exam month','Exam year'])expect(html).toContain(`aria-label="${label}"`);expect(html).toContain('ds-date-fields');expect(html).toContain('value="2028-02-29"');});
  it('reconstructs an edited canonical date and clamps impossible month changes',async()=>{
    await act(async()=>root.render(<ExamDatePicker name="date" defaultValue="2028-01-31"/>));const selects=host.querySelectorAll<HTMLSelectElement>('select');
    await act(async()=>{selects[1].value='2';selects[1].dispatchEvent(new Event('change',{bubbles:true}));});
    expect(host.querySelector<HTMLInputElement>('input[name=date]')?.value).toBe('2028-02-29');expect(selects[0].value).toBe('29');
    await act(async()=>{selects[2].value='2029';selects[2].dispatchEvent(new Event('change',{bubbles:true}));});
    expect(host.querySelector<HTMLInputElement>('input[name=date]')?.value).toBe('2029-02-28');expect(host.textContent).toContain('28/02/2029');
  });
});

describe('Upcoming Exams form actions',()=>{
  let host:HTMLDivElement,root:ReturnType<typeof createRoot>;
  const change=(select:HTMLSelectElement,value:string)=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));};
  beforeEach(()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});host=document.createElement('div');document.body.append(host);root=createRoot(host);});
  afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.mocked(useLearning).mockReturnValue(null);vi.restoreAllMocks();});
  it('opens the picker, selects all three parts, and submits the canonical date through the repository contract',async()=>{
    const add=vi.fn(async(_exam:unknown,_expected:unknown)=>{}),changeStudentData=vi.fn(async(callback:(repo:{addUpcomingExam:typeof add})=>Promise<unknown>)=>callback({addUpcomingExam:add}));
    vi.mocked(useLearning).mockReturnValue({snapshot:{data:{...emptyBackup(),generation:'test',revision:0},hasRecovery:false},changeStudentData} as unknown as ReturnType<typeof useLearning>);
    await act(async()=>root.render(<DashboardExams/>));const addButton=[...host.querySelectorAll('button')].find(button=>button.textContent==='Add exam')!;expect(addButton.classList).toContain('ds-button-primary');await act(async()=>addButton.click());
    expect(host.querySelector('[role=dialog]')).not.toBeNull();const name=host.querySelector<HTMLInputElement>('input[name=name]')!,selects=host.querySelectorAll<HTMLSelectElement>('select'),year=String(new Date().getFullYear()+1);
    await act(async()=>{name.value='Algorithms exam';name.dispatchEvent(new Event('input',{bubbles:true}));change(selects[0],'15');change(selects[1],'6');change(selects[2],year);});
    await act(async()=>host.querySelector('form')!.dispatchEvent(new SubmitEvent('submit',{bubbles:true,cancelable:true})));
    expect(add).toHaveBeenCalledOnce();expect(add.mock.calls[0][0]).toMatchObject({name:'Algorithms exam',examDate:`${year}-06-15`});
  });
  it('preloads an existing date and keeps Save, Cancel, Edit, and Delete semantically distinct',async()=>{
    const year=new Date().getFullYear()+1,exam={id:'exam',name:'Existing exam',examDate:`${year}-03-14`},update=vi.fn(async(_exam:unknown,_expected:unknown)=>{}),changeStudentData=vi.fn(async(callback:(repo:{updateUpcomingExam:typeof update})=>Promise<unknown>)=>callback({updateUpcomingExam:update}));
    vi.mocked(useLearning).mockReturnValue({snapshot:{data:{...emptyBackup(),generation:'test',revision:0,upcomingExams:[exam]},hasRecovery:false},changeStudentData} as unknown as ReturnType<typeof useLearning>);
    await act(async()=>root.render(<DashboardExams/>));const buttons=[...host.querySelectorAll('button')],edit=buttons.find(button=>button.textContent==='Edit')!,remove=buttons.find(button=>button.textContent==='Delete')!;expect(edit.classList).toContain('ds-button-quiet');expect(remove.classList).toContain('ds-button-danger');
    await act(async()=>edit.click());expect(host.querySelector<HTMLInputElement>('input[name=date]')?.value).toBe(exam.examDate);const save=[...host.querySelectorAll('button')].find(button=>button.textContent==='Save exam')!,cancel=[...host.querySelectorAll('button')].find(button=>button.textContent==='Cancel')!;expect(save.classList).toContain('ds-button-primary');expect(cancel.classList).toContain('ds-button-quiet');expect(save.tabIndex).toBe(0);expect(cancel.tabIndex).toBe(0);
  });
});
