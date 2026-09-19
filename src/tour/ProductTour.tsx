import {useCallback,useEffect,useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import {useNavigate} from 'react-router';
import {useAccount} from '../accounts/context';
import {useI18n} from '../i18n/i18n';
import {useLearning} from '../learning/LearningProvider';
import type {Dataset} from '../learning/contracts';
import type {MessageKey} from '../i18n/messages';
import './tour.css';
import {track} from '../analytics/analytics';

export const TOUR_EVENT='notedra:tour:start';
const TOUR_VERSION='v1';
export const tourStorageKey=(accountId:string)=>`notedra.product-tour.${TOUR_VERSION}.${encodeURIComponent(accountId)}`;
export const hasMeaningfulActivity=(data:Dataset)=>Boolean(data.attempts.length||data.reviews.length||data.exams.length||data.examReviews.length);

type TourStep={title:MessageKey;body:MessageKey;selectors:string[]};
const steps:TourStep[]=[
  {title:'tour.welcomeTitle',body:'tour.welcomeBody',selectors:['.ds-dashboard-greeting']},
  {title:'tour.coursesTitle',body:'tour.coursesBody',selectors:['[data-tour="courses"]','.ds-dash-courses']},
  {title:'tour.practiceTitle',body:'tour.practiceBody',selectors:['[data-tour="practice"]','.ds-dash-practice']},
  {title:'tour.studyPathTitle',body:'tour.studyPathBody',selectors:['[data-tour="study-path"]','.ds-dash-plan']},
  {title:'tour.progressTitle',body:'tour.progressBody',selectors:['[data-tour="progress"]','.ds-dash-continue']},
  {title:'tour.assessmentTitle',body:'tour.assessmentBody',selectors:['[data-tour="assessment"]']},
  {title:'tour.readyTitle',body:'tour.readyBody',selectors:['[data-tour="tools"]']},
];

function readSeen(accountId:string){try{return localStorage.getItem(tourStorageKey(accountId))==='seen';}catch{return false;}}
function writeSeen(accountId:string){try{localStorage.setItem(tourStorageKey(accountId),'seen');}catch{/* The tour still closes for this session. */}}
function visibleTarget(selectors:string[]){
  for(const selector of selectors){const element=document.querySelector<HTMLElement>(selector);if(!element)continue;const rect=element.getBoundingClientRect(),style=getComputedStyle(element);if(rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden')return element;}
  return null;
}

export function ProductTour(){
  const account=useAccount(),learning=useLearning(),navigate=useNavigate(),{t}=useI18n();
  const accountId=account.state.user?.id??null;
  const [active,setActive]=useState(false),[index,setIndex]=useState(0),[launchMode,setLaunchMode]=useState<'auto'|'manual'|null>(null),[rect,setRect]=useState<DOMRect|null>(null),[mobile,setMobile]=useState(()=>typeof window!=='undefined'&&window.innerWidth<=1000);
  const checked=useRef<string|null>(null),opener=useRef<HTMLElement|null>(null),heading=useRef<HTMLHeadingElement>(null);
  const start=useCallback((mode:'auto'|'manual',source?:HTMLElement|null)=>{if(!accountId)return;opener.current=source??document.activeElement as HTMLElement|null;setIndex(0);setLaunchMode(mode);setActive(true);track('product_tour_started',{source_surface:mode==='auto'?'dashboard':'account_settings'});navigate('/dashboard');},[accountId,navigate]);
  const close=useCallback((outcome:'completed'|'skipped')=>{if(accountId)writeSeen(accountId);track(outcome==='completed'?'product_tour_completed':'product_tour_skipped',{source_surface:'product_tour'});setActive(false);setLaunchMode(null);setRect(null);requestAnimationFrame(()=>{const destination=opener.current?.isConnected?opener.current:document.querySelector<HTMLElement>('#ds-content');destination?.focus();});},[accountId]);

  useEffect(()=>{if(!accountId||!learning?.snapshot||learning.phase!=='ready'||checked.current===accountId||!hasMeaningfulActivity(learning.snapshot.data))return;checked.current=accountId;if(!readSeen(accountId))start('auto');},[accountId,learning?.snapshot,learning?.phase,start]);
  useEffect(()=>{const launch=(event:Event)=>start('manual',(event as CustomEvent<{opener?:HTMLElement}>).detail?.opener);window.addEventListener(TOUR_EVENT,launch);return()=>window.removeEventListener(TOUR_EVENT,launch);},[start]);
  useEffect(()=>{const resize=()=>setMobile(window.innerWidth<=1000);window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
  useEffect(()=>{if(!active)return;const key=(event:KeyboardEvent)=>{if(event.key==='Escape')close('skipped');else if(event.key==='ArrowRight'&&index<steps.length-1)setIndex(value=>value+1);else if(event.key==='ArrowLeft'&&index>0)setIndex(value=>value-1);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[active,index,close]);
  useLayoutEffect(()=>{
    if(!active)return;
    const update=()=>{const target=visibleTarget(steps[index].selectors);if(!target){setRect(null);return;}const initial=target.getBoundingClientRect();const outside=initial.top<16||initial.bottom>window.innerHeight-16;if(outside){const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;target.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'});}setRect(target.getBoundingClientRect());};
    const frame=requestAnimationFrame(()=>{update();heading.current?.focus();}),timer=window.setTimeout(update,240);window.addEventListener('resize',update);window.addEventListener('scroll',update,true);
    return()=>{cancelAnimationFrame(frame);clearTimeout(timer);window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true);};
  },[active,index]);
  if(!active||!accountId)return null;
  const step=steps[index],last=index===steps.length-1;
  const popoverStyle:CSSProperties|undefined=!mobile&&rect?{top:Math.max(24,Math.min(window.innerHeight-330,rect.top)),left:rect.right+360<window.innerWidth?rect.right+22:Math.max(24,rect.left-382)}:undefined;
  return <div className={`ds-product-tour${mobile?' is-mobile':''}`} data-launch-mode={launchMode??undefined} data-reduced-motion={window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'true':'false'}>
    <div className="ds-tour-shade" aria-hidden="true"/>
    {rect&&<div className="ds-tour-spotlight" style={{top:rect.top-6,left:rect.left-6,width:rect.width+12,height:rect.height+12}} aria-hidden="true"/>}
    <section className="ds-tour-popover" style={popoverStyle} role="dialog" aria-modal="false" aria-label={t('tour.dialogLabel')} aria-describedby="ds-tour-body">
      <div className="ds-tour-progress" aria-hidden="true">{steps.map((_,number)=><i key={number} className={number<=index?'is-complete':''}/>)}</div>
      <p className="ds-tour-step">{t('tour.step',{current:index+1,total:steps.length})}</p>
      <h2 ref={heading} tabIndex={-1}>{t(step.title)}</h2><p id="ds-tour-body">{t(step.body)}</p>
      <div className="ds-tour-actions"><button type="button" className="ds-tour-skip" onClick={()=>close('skipped')}>{t('tour.skip')}</button><span/>{index>0&&<button type="button" onClick={()=>setIndex(value=>value-1)}>{t('tour.back')}</button>}<button type="button" className="ds-tour-primary" onClick={()=>last?close('completed'):setIndex(value=>value+1)}>{t(last?'tour.finish':'tour.next')}</button></div>
    </section>
  </div>;
}
