import {lessonFor,cardsFor} from '../topic-study/content';
import {TopicContent} from './TopicContent';
import type {IPStudyProps} from './IPStudyMode';
import type {GuidedActivity} from '../rl/types';
import guided from './intro-guided.json';
export default function IntroTopicContent(props:IPStudyProps){return <TopicContent {...props} content={{lesson:lessonFor(props.topic.id)!,cards:cardsFor(props.topic.id),guided:guided as GuidedActivity[]}}/>;}
