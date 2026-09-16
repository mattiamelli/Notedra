import {useEffect,useRef} from 'react';
export function useTrackOnce(key:string|null,emit:()=>void){const sent=useRef<string|null>(null);useEffect(()=>{if(key&&sent.current!==key){sent.current=key;emit();}},[key,emit]);}
