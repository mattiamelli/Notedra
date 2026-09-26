import type {CurriculumExercise} from './types';

export interface ExamPart {prompt:string;points:number;}
export interface ExamQuestion {stem:string;points:number;parts?:ExamPart[];selfCheck:boolean;}
type Addition={topicId:string;item:CurriculumExercise;question:ExamQuestion;difficulty:'Medium'|'Hard'|'Exam-level'};
const tex=String.raw;
function written(id:number,topic:number,skill:'A'|'B',source:string,title:string,stem:string,parts:ExamPart[],explanation:string,rubric:string[],difficulty:Addition['difficulty']='Exam-level'):Addition{
 const code=String(topic).padStart(2,'0');
 return {topicId:`CALC_T${code}`,difficulty,item:{id:`CALC_E${id}`,title,prompt:[stem,...parts.map((part,index)=>`${String.fromCharCode(97+index)}) ${part.prompt}`)].join('\n'),skillId:`CALC_S${code}${skill}`,sourceIds:[source],kind:'open',explanation,rubric},question:{stem,parts,points:parts.reduce((sum,part)=>sum+part.points,0),selfCheck:true}};
}
function exact(id:number,topic:number,skill:'A'|'B',source:string,title:string,prompt:string,answer:string,explanation:string,difficulty:Addition['difficulty']='Medium'):Addition{
 const code=String(topic).padStart(2,'0');
 return {topicId:`CALC_T${code}`,difficulty,item:{id:`CALC_E${id}`,title,prompt,skillId:`CALC_S${code}${skill}`,sourceIds:[source],kind:'integer',answer,explanation},question:{stem:prompt,points:1,selfCheck:false}};
}

export const calculusAdditions:Addition[]=[
 written(101,1,'B','CALC_SRC_FOUNDATIONS','Joining oscillatory and polynomial branches',tex`Let $f(x)=\sin(3x)/x$ for $x<0$, $f(0)=a$, and $f(x)=3+bx+x^2$ for $x>0$.`,[
  {prompt:tex`Find both one-sided limits at $0$.`,points:2},{prompt:tex`Choose $a$ for continuity.`,points:1},{prompt:tex`Find $b$ for differentiability at $0$ and justify the left derivative using a limit or Taylor expansion.`,points:3}],
  tex`Both limits equal $3$, so $a=3$. Since $\sin(3x)/x=3-\frac92x^2+O(x^4)$, the left difference quotient tends to $0$. The right derivative is $b$, hence $b=0$.`,
  ['2 points: establish the two limits separately.','1 point: match the value at zero to the common limit.','3 points: calculate both difference quotients and conclude b=0.']),
 exact(102,1,'A','CALC_SRC_FOUNDATIONS','Count admissible integer inputs',tex`How many integers belong to the real domain of $h(x)=\frac{\ln(9-x^2)}{x-1}$? Enter the count.`, '4',tex`The logarithm requires $-3<x<3$, and $x=1$ is excluded by the denominator. The allowed integers are $-2,-1,0,2$: four inputs.`),
 written(103,2,'A','CALC_SRC_DERIVATIVES','A rational curve beyond its first derivative',tex`Consider $f(x)=\frac{x^2}{1+x^2}$ on the real line.`,[
  {prompt:tex`Find and simplify $f'(x)$.`,points:2},{prompt:tex`Find $f''(x)$.`,points:2},{prompt:'Find all inflection points and justify the changes in concavity.',points:2}],
  tex`The derivatives are $f'(x)=\frac{2x}{(1+x^2)^2}$ and $f''(x)=\frac{2(1-3x^2)}{(1+x^2)^3}$. The denominator is positive. Concavity changes at $x=\pm1/\sqrt3$, where $f=1/4$. The inflection points are $(\pm1/\sqrt3,1/4)$.`,
  ['2 points: quotient rule and simplification.','2 points: product/chain rule for the second derivative.','2 points: both coordinates and a sign-change argument.']),
 exact(104,2,'A','CALC_SRC_DERIVATIVES','Implicit differentiation with an exponential',tex`The curve $ye^x+xy^2=2$ passes through $(0,2)$. Find $y'(0)$ for its local differentiable branch.`, '-6',tex`Differentiating gives $e^xy'+ye^x+y^2+2xyy'=0$. At $(0,2)$ this is $y'+2+4=0$, so $y'=-6$. The coefficient of $y'$ is $1$, so the local derivative is defined.`),
 written(105,3,'A','CALC_SRC_INTEGRALS','Substitution followed by integration by parts',tex`Let $I=\int_0^1 x\ln(1+x^2)\,dx$.`,[
  {prompt:'Transform the definite integral using a substitution, including the new bounds.',points:2},{prompt:'Evaluate the transformed integral by parts.',points:2},{prompt:tex`Prove $0<I<\frac12\ln 2$ without decimal approximations.`,points:2}],
  tex`Set $u=1+x^2$, so $I=\frac12\int_1^2\ln u\,du=\frac12[u\ln u-u]_1^2=\ln2-\frac12$. For $0<x<1$, $0<x\ln(1+x^2)<x\ln2$. Integrating gives the strict bounds.`,
  ['2 points: substitution, factor 1/2 and bounds 1 to 2.','2 points: integration by parts and exact value.','2 points: compare the integrands on an interval of positive length.']),
 exact(106,3,'A','CALC_SRC_INTEGRALS','Recognize a derivative under an integral',tex`Evaluate $\int_{-1}^{1}\frac{3x^2+x^4}{(1+x^2)^2}\,dx$. Hint: differentiate $x^3/(1+x^2)$.`, '1',tex`The quotient rule gives $\frac{d}{dx}\frac{x^3}{1+x^2}=\frac{3x^2+x^4}{(1+x^2)^2}$. The fundamental theorem gives $1/2-(-1/2)=1$.`),
 written(107,4,'A','CALC_SRC_LIMIT_PROCESSES','A parameter-dependent improper integral',tex`For real $p$, consider $J(p)=\int_1^\infty\frac{\ln x}{x^p}\,dx$.`,[
  {prompt:tex`Use $x=e^t$ to transform the integral.`,points:2},{prompt:'Determine exactly which values of p give convergence.',points:2},{prompt:'Evaluate J(p) throughout its convergence range.',points:2}],
  tex`The transformed integral is $\int_0^\infty t e^{-(p-1)t}\,dt$. For $p>1$, integration by parts gives $J(p)=1/(p-1)^2$; the boundary term tends to zero. At $p=1$ the integrand is $t$, and for $p<1$ it grows exponentially, so both cases diverge.`,
  ['2 points: transform both the differential and the bounds.','2 points: establish convergence for p>1 and divergence for p<=1.','2 points: integrate by parts, including the limiting boundary term.']),
 exact(108,4,'B','CALC_SRC_LIMIT_PROCESSES','A cancellation-sensitive sequence',tex`Find $\lim_{n\to\infty}2n\left(\sqrt{1+3/n}-1\right)$.`, '3',tex`Rationalization gives $6/(\sqrt{1+3/n}+1)$, which tends to $3$. The vanishing bracket cannot be replaced by zero before multiplication by n.`),
 written(109,5,'B','CALC_SRC_SERIES','Alternation, absolute convergence and error',tex`Consider $\sum_{n=1}^{\infty}(-1)^{n-1}\frac{n}{n^2+1}$.`,[
  {prompt:'Decide whether the series converges and verify the relevant hypotheses.',points:2},{prompt:'Decide whether convergence is absolute or conditional.',points:2},{prompt:tex`Find the smallest number of terms $N\ge1$ for which the alternating-series bound guarantees error at most $1/100$.`,points:2}],
  tex`The positive magnitudes tend to zero and decrease for $n\ge1$, since the derivative of $x/(x^2+1)$ is $(1-x^2)/(x^2+1)^2$. The absolute series diverges by limit comparison with $1/n$, with ratio tending to 1. Convergence is conditional. The error bound is $(N+1)/((N+1)^2+1)$. At N=98 it exceeds 1/100, and at N=99 it is $100/10001<1/100$; monotonicity proves minimality.`,
  ['2 points: decreasing magnitudes and zero limit.','2 points: harmonic limit comparison and conditional classification.','2 points: next-term bound, N=99 and failure at N=98.']),
 exact(110,5,'A','CALC_SRC_TAYLOR','A weighted geometric series',tex`Evaluate $12\sum_{n=1}^{\infty}\frac{n}{3^n}$.`, '9',tex`For $|r|<1$, differentiating the geometric series gives $\sum_{n=1}^{\infty}nr^n=r/(1-r)^2$. At $r=1/3$ this is $3/4$, and multiplication by 12 gives 9.`, 'Hard'),
 written(111,6,'B','CALC_SRC_TAYLOR','Taylor cancellations in a product',tex`Let $g(x)=e^x\cos x$.`,[
  {prompt:'Find the Maclaurin polynomial through degree four.',points:3},{prompt:tex`Evaluate $\lim_{x\to0}\frac{g(x)-1-x}{x^3}$.`,points:2},{prompt:tex`Find $g^{(4)}(0)$.`,points:1}],
  tex`Multiplying the exponential and cosine series gives $g(x)=1+x-\frac13x^3-\frac16x^4+O(x^5)$. The quadratic term cancels. The limit is $-1/3$, and $g^{(4)}(0)=4!(-1/6)=-4$.`,
  ['3 points: correct product through degree four, including the zero quadratic term.','2 points: use the first nonzero remaining term.','1 point: multiply the coefficient by 4 factorial.']),
 exact(112,6,'B','CALC_SRC_TAYLOR','Recover a high derivative from a series',tex`For $f(x)=\ln(1+x^2)$, find $f^{(6)}(0)$.`, '240',tex`The expansion is $x^2-x^4/2+x^6/3+O(x^8)$. Thus $f^{(6)}(0)=6!/3=240$.`, 'Hard'),
 written(113,7,'A','CALC_SRC_PARTIALS','Partial derivatives without continuity',tex`Define $f(x,y)=\frac{xy^2}{x^2+y^4}$ away from $(0,0)$ and set $f(0,0)=0$.`,[
  {prompt:'Find both first partial derivatives at the origin from their definitions.',points:2},{prompt:tex`Compare approaches along $x=0$ and $x=y^2$.`,points:2},{prompt:'Decide continuity and differentiability at the origin, with justification.',points:2}],
  tex`Both coordinate-axis restrictions are identically zero, so $f_x(0,0)=f_y(0,0)=0$. Along $x=0$ the limit is zero, whereas along $x=y^2$ with $y\ne0$ the value is $1/2$. There is no two-variable limit. The function is not continuous and therefore not differentiable at the origin.`,
  ['2 points: use coordinate difference quotients, not a formula undefined at the origin.','2 points: valid paths with limits 0 and 1/2.','2 points: distinguish existence of partials from continuity and differentiability.']),
 exact(114,7,'B','CALC_SRC_PARTIALS','Mixed partials with a coupled exponent',tex`For $f(x,y)=xe^{xy}$, compute $f_{xy}(1,0)$.`, '2',tex`First $f_x=e^{xy}(1+xy)$. Then $f_{xy}=xe^{xy}(2+xy)$, which is 2 at (1,0).`),
 written(115,8,'B','CALC_SRC_GRADIENT','Extrema on a triangular region',tex`Find the absolute extrema of $f(x,y)=x^2+xy+y^2$ on $x\ge0$, $y\ge0$, $x+y\le2$.`,[
  {prompt:'Solve the stationary equations and identify whether the candidate is interior.',points:2},{prompt:'Examine all three edges, including their endpoints.',points:3},{prompt:'State the absolute minimum and maximum with every location.',points:1}],
  tex`The stationary equations give only (0,0), which lies on the boundary. On the axes, f is a square between 0 and 4. On $x+y=2$, $f=(x-1)^2+3$ for $0\le x\le2$, with values from 3 to 4. The minimum is 0 only at (0,0); the maximum is 4 at (2,0) and (0,2).`,
  ['2 points: solve both equations and notice the boundary location.','3 points: analyze each edge, including the critical point on the sloping edge.','1 point: compare all candidates and list all extremizers.']),
 exact(116,8,'A','CALC_SRC_GRADIENT','Second change along a curved path',tex`Let $F(x,y)=xy^2+\ln x$, $x(t)=e^t$ and $y(t)=\sin t$. Find $\frac{d^2}{dt^2}F(x(t),y(t))$ at $t=0$.`, '2',tex`Substitution gives $e^t\sin^2t+t=t+t^2+O(t^3)$. The second derivative at zero is therefore 2. Direct differentiation twice gives the same value.`, 'Hard'),
 written(117,9,'B','CALC_SRC_COMPLEX','Roots, products and a real polynomial',tex`Consider the equation $z^3=-8i$.`,[
  {prompt:'Find all three roots in Cartesian form.',points:3},{prompt:'Verify their sum and product.',points:1},{prompt:'Find a monic real polynomial of least degree containing these roots and all their conjugates.',points:2}],
  tex`The roots are $\sqrt3-i$, $2i$, and $-\sqrt3-i$, obtained with modulus 2 and angles $-\pi/6+2k\pi/3$. Their sum is 0 and product is $-8i$. Their conjugates solve $z^3=8i$; the two root sets are disjoint. The required degree-six polynomial is $(z^3+8i)(z^3-8i)=z^6+64$.`,
  ['3 points: three distinct roots with correct modulus and angles.','1 point: sum zero and product -8i.','2 points: include conjugates, prove disjointness, and multiply the factors.']),
 exact(118,9,'B','CALC_SRC_COMPLEX','Common roots of unity',tex`How many distinct complex numbers satisfy both $z^6=1$ and $z^4=1$?`, '2',tex`Every solution is nonzero, so division gives $z^2=1$. Both 1 and -1 satisfy the original equations, giving exactly two common roots.`),
 written(119,10,'B','CALC_SRC_DOUBLE','Reverse bounds and find an average',tex`Let $D=\{(x,y):0\le x\le1,\ x\le y\le\sqrt{x}\}$.`,[
  {prompt:'Describe D with y as the outer variable.',points:2},{prompt:tex`Evaluate $\iint_D y\,dA$.`,points:2},{prompt:'Find the area of D and the average value of y on D.',points:2}],
  tex`The reversed description is $0\le y\le1$, $y^2\le x\le y$. Thus $\iint_D y\,dA=\int_0^1(y^2-y^3)\,dy=1/12$. The area is $\int_0^1(y-y^2)\,dy=1/6$, so the average is $(1/12)/(1/6)=1/2$.`,
  ['2 points: both bounds and the outer interval.','2 points: integrate over the correctly described region.','2 points: area 1/6 and division by area to obtain 1/2.']),
 exact(120,10,'B','CALC_SRC_DOUBLE','Mass under a sloping density',tex`A lamina occupies $x\ge0$, $y\ge0$, $x+y\le2$ and has density $\rho(x,y)=12-3x-3y$. Find its total mass.`, '16',tex`Integrate $\int_0^2\int_0^{2-x}(12-3x-3y)\,dy\,dx$. The constant contributes 24, and $3\iint_D(x+y)\,dA=8$. The mass is 16; density is positive throughout D.`, 'Hard'),
];

export const calculusExamSets=[
 {id:'foundations',title:'Mini exam 1: limits and change',minutes:25,difficulty:'Standard',ids:['CALC_E101','CALC_E104','CALC_E105']},
 {id:'infinite-processes',title:'Mini exam 2: infinite processes and roots',minutes:35,difficulty:'Challenging',ids:['CALC_E107','CALC_E110','CALC_E111','CALC_E117']},
 {id:'several-variables',title:'Mini exam 3: several variables',minutes:25,difficulty:'Challenging',ids:['CALC_E113','CALC_E116','CALC_E119']},
 {id:'mixed-revision',title:'Mixed revision exam: the full syllabus',minutes:60,difficulty:'Mixed',ids:['CALC_E102','CALC_E103','CALC_E106','CALC_E108','CALC_E109','CALC_E112','CALC_E114','CALC_E115','CALC_E118','CALC_E120']},
];
export const calculusQuestion=(id:string)=>calculusAdditions.find(entry=>entry.item.id===id);
