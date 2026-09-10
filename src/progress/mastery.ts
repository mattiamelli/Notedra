import {stableCompare} from '../adaptive/evidence';
import type {Aggregate, Confidence, Observation, SkillIndex} from './types';
export const DAY = 86_400_000;
export const POLICY_VERSION = 'delftstudy-evidence-v1';
export const recency = (time: number, now: number) => Math.pow(0.5, Math.max(0, now-time)/(45*DAY));
export const difficultyWeight = (difficulty: Observation['difficulty']) => difficulty === 'Hard' ? 1.1 : difficulty === 'Easy' ? 0.9 : 1;
export const confidenceRank: Record<Confidence, number> = {Insufficient: 0, Low: 1, Moderate: 2, High: 3};
const round = (n: number) => Math.round(n);

export function skillMastery(identity: Pick<SkillIndex,'id'|'name'|'topicId'|'courseId'>, evidence: readonly Observation[], now: number, limited = 0): SkillIndex {
  const items = new Map<string, Observation[]>();
  for (const e of evidence) {const group = items.get(e.item) ?? []; group.push(e); items.set(e.item,group);}
  let numerator = 0, denominator = 0, freshness = 0;
  for (const group of items.values()) {
    group.sort((a,b) => b.timestamp-a.timestamp || (a.id<b.id?-1:a.id>b.id?1:0));
    let value = 0, mass = 0;
    group.slice(0,3).forEach((e,i) => {const w=[0.6,0.3,0.1][i]*recency(e.timestamp,now);value+=(e.correct?1:0)*w;mass+=w;});
    const latest = group[0], weight = recency(latest.timestamp,now);
    if (mass) {numerator += value/mass*weight; denominator += weight;}
    freshness += weight*(latest.solutionViewed===true?0.5:1);
  }
  const distinctItems=items.size, meanFreshness=distinctItems?freshness/distinctItems:0;
  const days=new Set(evidence.map(e=>Math.floor(e.timestamp/DAY))).size;
  const recentDays=new Set(evidence.filter(e=>e.timestamp>=now-90*DAY).map(e=>Math.floor(e.timestamp/DAY))).size;
  const recentMistakes=evidence.filter(e=>!e.correct&&e.timestamp>=now-30*DAY).length;
  const successes=evidence.filter(e=>e.correct).map(e=>e.timestamp);
  const cap=Math.min(100,55+15*Math.max(0,distinctItems-1));
  const index=denominator>1e-6?round(numerator/denominator*cap):null;
  let confidence:Confidence=index===null?'Insufficient':'Low';
  if(distinctItems>=3&&recentDays>=2&&meanFreshness>=0.5&&!limited)confidence='Moderate';
  if(distinctItems>=5&&recentDays>=3&&meanFreshness>=0.75&&!limited)confidence='High';
  const patterns=[...new Set(evidence.filter(e=>!e.correct&&e.timestamp>=now-30*DAY&&e.pattern).map(e=>e.pattern!))];
  return {...identity,index,confidence,observations:evidence.length,distinctItems,days,freshness:meanFreshness,recentMistakes,
    lastSuccess:successes.length?Math.max(...successes):null,limited,why:[
      index===null?'Not enough evidence. Missing evidence is not failure.':`${evidence.length} eligible normal-practice observations across ${distinctItems} distinct exact items and ${days} UTC days.`,
      'Only the latest three answers per item contribute (0.6 / 0.3 / 0.1); each item has one capped vote. Recency half-life: 45 days.',
      `Diversity limits this skill index to ${cap}/100. Confidence is separate from correctness.`,
      `${recentMistakes} mistakes in the last 30 days; ${limited} unresolved records. Review marks do not change this index.`,
      ...(patterns.length?[`Exact authored answer patterns: ${patterns.join('; ')}. These explain responses, not personal traits.`]:[])
    ]};
}
export function aggregate(id:string,name:string,skills:readonly SkillIndex[],groups?:readonly Aggregate[]):Aggregate {
  const known=skills.filter(s=>s.index!==null),covered=known.length,total=skills.length,coverage=total?covered/total:0;
  const recent=known.filter(s=>s.freshness>=0.25).length;
  // Within a topic, equal skill influence. Across a course, equal topic influence before canonical coverage adjustment.
  const values=groups?groups.filter(g=>g.index!==null).map(g=>g.index!):known.map(s=>s.index!);
  const index=values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length*(0.5+0.5*coverage)):null;
  const reliable=known.filter(s=>confidenceRank[s.confidence]>=2).length;
  let confidence:Confidence=index===null?'Insufficient':'Low';
  if(coverage>=0.6&&recent/total>=0.6&&reliable/total>=0.5&&!skills.some(s=>s.limited))confidence='Moderate';
  if(coverage>=0.9&&reliable/total>=0.8&&recent/total>=0.85&&!skills.some(s=>s.limited))confidence='High';
  return {id,name,index,confidence,covered,total,recent,
    strongest:known.filter(s=>s.index!>0).sort((a,b)=>b.index!-a.index!||stableCompare(a.id,b.id)).slice(0,3).map(s=>s.name),
    review:known.filter(s=>s.recentMistakes>0).sort((a,b)=>b.recentMistakes-a.recentMistakes||stableCompare(a.id,b.id)).slice(0,3).map(s=>s.name),
    missing:skills.filter(s=>s.index===null).map(s=>s.name),
    why:[`${covered} / ${total} canonical skills have usable normal-practice evidence; ${recent} have recent usable evidence.`,
      `${groups?'Equal topic influence':'Equal skill influence'} prevents a heavily repeated item/topic dominating. The observed index is adjusted by 0.5 + 0.5 × canonical skill coverage.`,
      'Unknown skills remain unknown; the coverage adjustment is an evidence limit, not an incorrect answer. Prerequisites are shown in course navigation, not inferred as successful.',
      `${reliable} skills meet at least Moderate confidence. Gaps and unresolved versions constrain aggregate confidence.`]};
}
