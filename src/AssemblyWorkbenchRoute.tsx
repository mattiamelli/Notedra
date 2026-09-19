import {useMemo} from 'react';
import {useSearchParams} from 'react-router';
import AssemblyWorkbench from './AssemblyWorkbench';
import {ASSEMBLY_TOPIC_PATH} from './academic/navigation';
import {contextualAssemblyReturnPath,resolveAssemblyRouteContext} from './assembly-practice/visualizer-context';
import {useLearning} from './learning/LearningProvider';

export default function AssemblyWorkbenchRoute(){
 const [params]=useSearchParams();const exerciseId=params.get('exercise');const presetId=params.get('preset');const attemptId=params.get('attempt');
 const context=useMemo(()=>resolveAssemblyRouteContext(exerciseId,presetId),[exerciseId,presetId]);const learning=useLearning();
 const returnPath=context?.kind==='exercise'&&(!attemptId||learning?.snapshot)?contextualAssemblyReturnPath(context,attemptId,learning?.snapshot?.data.attempts):context?.kind==='preset'?`${ASSEMBLY_TOPIC_PATH}/learn`:null;
 return <AssemblyWorkbench context={context} returnPath={returnPath} returnLabel={context?.kind==='preset'?'assembly.backToLearn':'assembly.backToExercise'}/>;
}
