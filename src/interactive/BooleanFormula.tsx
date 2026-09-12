import type {ReactNode} from 'react';
import type {PropFormula} from '../rl/logic';
import {symbols} from './domain';
import {literalLabel,literalText} from './boolean-notation';
export function Complement({children,label}:{children:ReactNode;label?:string}) {
 return <span className="boolean-complement" role="img" aria-label={label??'NOT the following expression'}><span aria-hidden="true">{children}</span></span>;
}
export function BooleanLiteral({token}:{token:string}) {
 return token.startsWith('!')?<Complement label={literalLabel(token)}>{token[1]}</Complement>:<>{literalText(token)}</>;
}
export function formulaLabel(formula:PropFormula):string {
 if(formula.kind==='variable')return formula.name;
 if(formula.kind==='not')return 'NOT ('+formulaLabel(formula.operand)+')';
 return '('+formulaLabel(formula.left)+' '+formula.kind.toUpperCase()+' '+formulaLabel(formula.right)+')';
}
export function BooleanFormula({formula}:{formula:PropFormula}) {
 function render(f:PropFormula):ReactNode {
  if(f.kind==='variable')return f.name;
  if(f.kind==='not')return <Complement label={formulaLabel(f)}>{render(f.operand)}</Complement>;
  return <>({render(f.left)} {symbols[f.kind]} {render(f.right)})</>;
 }
 return <span className="boolean-formula" role="img" aria-label={formulaLabel(formula)}>{render(formula)}</span>;
}
