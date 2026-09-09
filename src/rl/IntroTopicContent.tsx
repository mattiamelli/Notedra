import {cardsFor,lessonFor} from '../topic-study/content';
import {TopicContent} from './TopicContent';
import type {RLStudyProps} from './RLStudyMode';
import type {GuidedActivity} from './types';
import guided from './intro-guided.json';
export default function IntroTopicContent(props:RLStudyProps){return <TopicContent {...props} content={{lesson:lessonFor(props.topic.id)!,cards:cardsFor(props.topic.id),guided:guided as GuidedActivity[]}}/>;}
