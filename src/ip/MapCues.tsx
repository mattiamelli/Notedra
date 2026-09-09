import {StudyCues} from '../enrichment/StudyCues';
import cues from './cues.json';
export default function MapCues({topicId}:{topicId:string}){return <StudyCues cues={cues.filter(c=>c.topicId===topicId)}/>;}
