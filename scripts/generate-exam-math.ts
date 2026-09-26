import {createRequire} from 'node:module';
import {readFileSync,writeFileSync} from 'node:fs';
import katex from 'katex';
import {calculusAdditions} from '../src/curriculum/calculus-expansion';
import type {MathNode} from '../src/math/types';

const {JSDOM}=createRequire(import.meta.url)('jsdom') as {JSDOM:new(html:string)=>{window:{document:Document;close:()=>void}}};
const tags=new Set(['math','semantics','mrow','mi','mo','mn','mtext','mfrac','msup','msub','msubsup','msqrt','mroot','munder','mover','munderover','mspace','mtable','mtr','mtd','mpadded','mstyle','menclose']);
const attrs=new Set(['xmlns','display','mathvariant','stretchy','fence','separator','form','lspace','rspace','accent','accentunder','width','height','depth','voffset','displaystyle','scriptlevel','columnalign','columnspacing','rowspacing','rowalign','notation','linethickness','minsize','maxsize','movablelimits']);
function tree(node:Node):MathNode|null{
 if(node.nodeType===3)return node.textContent??'';
 if(node.nodeType!==1)return null;
 const element=node as Element;
 if(element.localName==='annotation')return null;
 if(!tags.has(element.localName))throw Error('Unsupported MathML element: '+element.localName);
 const attributes=Object.fromEntries([...element.attributes].map(attr=>{
  if(!attrs.has(attr.name))throw Error('Unsupported MathML attribute: '+attr.name);
  return [attr.name,attr.value];
 }));
 return {tag:element.localName,attrs:attributes,children:[...element.childNodes].map(tree).filter((child):child is MathNode=>child!==null)};
}
const strings=calculusAdditions.flatMap(({item,question})=>[item.prompt,item.explanation,...item.rubric??[],question.stem,...question.parts?.map(part=>part.prompt)??[]]);
const formulas=[...new Set(strings.flatMap(text=>[...text.matchAll(/\$([^$]+)\$/g)].map(match=>match[1])))].sort();
const result:Record<string,MathNode>={};
for(const formula of formulas){
 const markup=katex.renderToString(formula,{output:'mathml',throwOnError:true,strict:'error',trust:false,maxExpand:1000});
 const dom=new JSDOM(markup),math=dom.window.document.querySelector('math');
 if(!math)throw Error('Missing rendered formula');
 result[formula]=tree(math)!;dom.window.close();
}
const file=new URL('../src/generated/exam-math.json',import.meta.url),output=JSON.stringify(result)+'\n';
if(process.argv.includes('--check')){if(readFileSync(file,'utf8')!==output)throw Error('Exam math is stale');}
else writeFileSync(file,output);
console.log(`Exam math: ${formulas.length} formulas validated and rendered.`);
