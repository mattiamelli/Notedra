import {useMemo,useState} from 'react';
import {useLearning} from '../learning/LearningProvider';
import {deriveEvidence} from './evidence';
export function useEvidence(){
 const learning=useLearning();const [now,setNow]=useState(()=>Date.now());
 const data=learning?.snapshot?.data;
 const evidence=useMemo(()=>deriveEvidence(data?.attempts??[],data?.reviews??[],now),[data,now]);
 function refresh(){learning?.refresh();setNow(Date.now());}
 return {learning,evidence,refresh};
}
