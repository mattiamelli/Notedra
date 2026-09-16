import {describe,expect,it} from 'vitest';
import {courses,pageContext,subjectPresentation} from '../src/academic/navigation';
import {neutralAcademicText} from '../src/i18n/i18n';

const forbidden=/TU Delft|Delft University(?: of Technology)?|DelftStudy|Delft Study|CSE1400|CSE1300|CSE1100|CSE11C|Computer Architecture|Reasoning and Logic|Introduction to Programming/i;

describe('institution-neutral public presentation',()=>{
 it('maps stable IDs to one shared set of neutral public labels',()=>{expect(courses.map(course=>[course.subject_id,course.publicName,course.compactName])).toEqual([['CSE1400_CO','Computer Organisation','Organisation'],['CSE1300_RL','Logic','Logic'],['CSE1100_IP','Programming','Programming']]);for(const course of courses){expect(subjectPresentation(course.subject_id)?.publicName).toBe(course.publicName);expect(`${course.publicName} ${course.compactName}`).not.toMatch(forbidden);}});
 it('keeps route identity while public titles and breadcrumbs stay neutral',()=>{for(const course of courses){const context=pageContext(course.path);expect(context.title).toBe(course.publicName);expect(context.breadcrumbs.map(item=>item.label).join(' ')).not.toMatch(forbidden);}expect(courses.map(course=>course.path)).toEqual(['/co','/rl','/ip']);});
 it('neutralizes historical academic labels only at the presentation boundary',()=>{expect(neutralAcademicText('Computer Architecture')).toBe('Computer Organisation');expect(neutralAcademicText('Reasoning and Logic')).toBe('Logic');expect(neutralAcademicText('Introduction to Programming')).toBe('Programming');expect(neutralAcademicText('Build a full Delft-style program')).toBe('Build a complete integrated program');});
});
