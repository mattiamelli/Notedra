import {CanonicalLink} from '../topic-study/AcademicViews';
import {EvidenceView} from './EvidenceView';
import type {StudyCue} from './types';
export function StudyCues({cues}:{cues:StudyCue[]}){
 if(!cues.length)return null;
 return <details className="ds-study-reading ds-enrichment"><summary>Optional study cues</summary><p>Reminders attached to existing skills. These do not add map connections or prerequisites.</p>{cues.map(c=><article key={c.id}><h3><CanonicalLink id={c.skillIds[0]}/></h3><p>{c.text}</p><EvidenceView ids={c.evidenceIds}/></article>)}</details>;
}
