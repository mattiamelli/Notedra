import {useEffect} from 'react';
import {useSearchParams} from 'react-router';
import {trimesters} from '../academic/navigation';

export const CURRENT_TRIMESTER_KEY='notedra.current-trimester';
const valid=(value:string|null)=>trimesters.find(trimester=>String(trimester)===value);
function savedTrimester(){
 try{return valid(localStorage.getItem(CURRENT_TRIMESTER_KEY))??1;}catch{return 1;}
}

export function useCurrentTrimester(){
 const [params,setParams]=useSearchParams();
 const selected=valid(params.get('trimester'))??savedTrimester();
 useEffect(()=>{
  try{localStorage.setItem(CURRENT_TRIMESTER_KEY,String(selected));}catch{/* Study navigation still works when storage is unavailable. */}
  if(params.get('trimester')!==String(selected)){
   const next=new URLSearchParams(params);next.set('trimester',String(selected));
   setParams(next,{replace:true,preventScrollReset:true});
  }
 },[selected,params,setParams]);
 const select=(value:number)=>{
  if(!trimesters.some(trimester=>trimester===value))return;
  const next=new URLSearchParams(params);next.set('trimester',String(value));
  setParams(next,{preventScrollReset:true});
 };
 return [selected,select] as const;
}
