import calculus from './calculus.json';
import hci from './hci.json';
import dataManagement from './data-management.json';
import linearAlgebra from './linear-algebra.json';
import softwareEngineering from './software-engineering.json';
import algorithms from './algorithms.json';
import probability from './probability.json';
import networks from './networks.json';
import type {CurriculumCourse} from './types';
import {calculusAdditions} from './calculus-expansion';

const expandedCalculus={...calculus,topics:calculus.topics.map(topic=>({...topic,exercises:[...topic.exercises,...calculusAdditions.filter(entry=>entry.topicId===topic.id).map(entry=>entry.item)]}))};
export const curriculumCourses = [expandedCalculus, hci, dataManagement, linearAlgebra,
  softwareEngineering, algorithms, probability, networks] as CurriculumCourse[];

export const curriculumCourseFor = (id: string) => curriculumCourses.find(course => course.id === id);
