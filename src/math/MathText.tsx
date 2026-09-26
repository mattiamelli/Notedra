import {createElement,Fragment,type ReactNode} from 'react';
import rendered from '../generated/exam-math.json';
import type {MathNode} from './types';

function render(node:MathNode,key:number):ReactNode{
 return typeof node==='string'?node:createElement(node.tag,{...node.attrs,key},...node.children.map(render));
}
/** Only build-validated authored formulas become MathML; other text stays escaped. */
export function MathText({text}:{text:string}){
 const formulas=rendered as Record<string,MathNode>;
 return <>{text.split(/(\$[^$]+\$)/g).map((part,index)=>{
  const formula=part.startsWith('$')&&part.endsWith('$')?part.slice(1,-1):null;
  return <Fragment key={index}>{formula&&formulas[formula]?<span className="ds-inline-math">{render(formulas[formula],index)}</span>:part}</Fragment>;
 })}</>;
}
