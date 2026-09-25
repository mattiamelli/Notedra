import {useId} from 'react';
import type {Course} from '../academic/navigation';

const courseImages: Record<string, {image: string; label: string}> = {
  CSE12A_CALC: {image: 'calculus', label: 'Calculus'},
  CSE12B_HCIAP: {image: 'hci', label: 'Interaction'},
  CSE12C_DM: {image: 'data-management', label: 'Data'},
  CSE13A_LA: {image: 'linear-algebra', label: 'Linear Algebra'},
  CSE13B_SDE: {image: 'software-engineering', label: 'Software Design'},
  CSE13C_ADS: {image: 'algorithms', label: 'Algorithms'},
  CSE14A_PTS: {image: 'probability', label: 'Probability'},
  CSE14B_CN: {image: 'networks', label: 'Networks'},
};

/** Decorative course headers; the adjacent heading supplies the accessible name. */
export function CourseArtwork({course}: {course: Course}) {
  const id = useId();
  const artwork = courseImages[course.subject_id];
  if (artwork) return <div className="ds-course-art ds-curriculum-art" aria-hidden="true">
    <img src={`/course-artwork/${artwork.image}.png`} alt="" width="768" height="256" loading="lazy" decoding="async" />
    <span className="ds-course-tag">{artwork.label}</span>
  </div>;
  const co = course.subject_id === 'CSE1400_CO', rl = course.subject_id === 'CSE1300_RL';
  const color = co ? '#31baff' : rl ? '#25e5cd' : '#a78aff';
  return <div className="ds-course-art"><svg viewBox="0 0 320 112" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id={id}><stop stopColor={co?'#073265':rl?'#00434d':'#24154c'}/><stop offset="1" stopColor={co?'#0768aa':rl?'#007d86':'#343378'}/></linearGradient></defs>
    <path fill={`url(#${id})`} d="M0 0h320v112H0z"/>
    <g stroke={color} opacity=".2" fill="none">{Array.from({length:9},(_,i)=><path key={i} d={`M${i*40-60} 0  ${i*40+30} 112M0 ${i*18}h320`}/>)}</g>
    {co ? <g fill="none" stroke={color}><path d="m160 13 72 38-72 40-72-40Z" fill="#084b88" strokeWidth="2"/><path d="m160 23 52 28-52 29-52-29Z" fill="#269fe4"/><path d="m160 34 32 17-32 18-32-18Z" fill="#74d7ff"/>{[0,1,2,3,4].map(n=><g key={n} opacity=".8"><path d={`M${108+n*10} ${40-n*5} ${66+n*10} ${18-n*5}H0M${211-n*10} ${42-n*5} ${254-n*10} ${20-n*5}H320M${110+n*10} ${66+n*5} ${67+n*10} ${88+n*5}H0M${210-n*10} ${67+n*5} ${255-n*10} ${89+n*5}H320`}/></g>)}</g>
    : rl ? <g stroke={color} strokeWidth="2" fill="none"><path d="M0 38h92m-92 35h92m40-17h62m36 0h90M92 27h19a29 29 0 0 1 0 58H92ZM194 27h18a29 29 0 0 1 0 58h-18Z"/><circle cx="62" cy="38" r="4" fill={color}/><circle cx="265" cy="56" r="4" fill={color}/><path opacity=".5" d="M25 0v21l17 17M270 112V76l-18-20"/></g>
    : <g fontFamily="monospace" fontSize="13"><text x="75" y="31" fill="#b6a6ff">for (int i = 0;</text><text x="91" y="51" fill="#82ccff">i &lt; values.length; i++) {'{'}</text><text x="91" y="73" fill="#57e7ce">total += values[i];</text><text x="75" y="94" fill="#b6a6ff">{'}'}</text></g>}
  </svg><span className="ds-course-tag">{course.compactName}</span></div>;
}
