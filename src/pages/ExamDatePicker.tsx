import {useMemo, useState} from 'react';

export interface ExamDateParts {day: string; month: string; year: string;}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function examDateParts(value: string): ExamDateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? {year: match[1], month: String(Number(match[2])), day: String(Number(match[3]))} : {year: '', month: '', day: ''};
}

export function partsToExamDate({year, month, day}: ExamDateParts): string {
  if (!year || !month || !day) return '';
  const maximum = daysInMonth(Number(year), Number(month));
  if (Number(day) < 1 || Number(day) > maximum) return '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function displayExamDate(value: string): string {
  const {year, month, day} = examDateParts(value);
  return year && month && day ? `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}` : value;
}

export function localDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function ExamDatePicker({name, defaultValue = ''}: {name: string; defaultValue?: string}) {
  const initial = examDateParts(defaultValue);
  const [parts, setParts] = useState(initial);
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const values = Array.from({length: 21}, (_, index) => String(currentYear + index));
    if (parts.year && !values.includes(parts.year)) values.push(parts.year);
    return values.sort();
  }, [currentYear, parts.year]);
  const maximum = parts.year && parts.month ? daysInMonth(Number(parts.year), Number(parts.month)) : 31;
  const selectedDay = parts.day && Number(parts.day) > maximum ? String(maximum) : parts.day;
  const value = partsToExamDate({...parts, day: selectedDay});

  function update(next: Partial<ExamDateParts>) {
    const candidate = {...parts, ...next};
    if (candidate.year && candidate.month && candidate.day) {
      candidate.day = String(Math.min(Number(candidate.day), daysInMonth(Number(candidate.year), Number(candidate.month))));
    }
    setParts(candidate);
  }

  return <fieldset className="ds-date-picker">
    <legend>Exam date</legend>
    <div className="ds-date-fields">
      <label><span>Day</span><select aria-label="Exam day" value={selectedDay} onChange={event => update({day: event.target.value})} required>
        <option value="">Day</option>{Array.from({length: maximum}, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
      </select></label>
      <label><span>Month</span><select aria-label="Exam month" value={parts.month} onChange={event => update({month: event.target.value})} required>
        <option value="">Month</option>{monthNames.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
      </select></label>
      <label><span>Year</span><select aria-label="Exam year" value={parts.year} onChange={event => update({year: event.target.value})} required>
        <option value="">Year</option>{years.map(year => <option key={year} value={year}>{year}</option>)}
      </select></label>
    </div>
    <input type="hidden" name={name} value={value}/>
    <small>{value ? `Selected date: ${displayExamDate(value)}` : 'Choose day, month and year.'}</small>
  </fieldset>;
}
