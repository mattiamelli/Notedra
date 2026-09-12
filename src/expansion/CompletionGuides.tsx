import guides from './completion-guided.json';
import {GuidedPractice} from '../rl/GuidedPractice';
/** Source-reviewed open reasoning stays unscored; no submission/evidence is manufactured. */
export default function CompletionGuides({topicId,mode}:{topicId:string;mode:'practice'|'exam'}){
 const selected=guides.filter(g=>g.topicId===topicId&&g.mode===mode);
 return selected.length?<GuidedPractice key={topicId+mode} headingId="p7-guided-heading" activities={selected}/>:null;
}
