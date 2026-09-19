import {ASSEMBLY_TOOL_PATH} from '../academic/navigation';

export function assemblyVisualizerPath(exerciseId:string,attemptId?:string){
 const params=new URLSearchParams({exercise:exerciseId});
 if(attemptId)params.set('attempt',attemptId);
 return `${ASSEMBLY_TOOL_PATH}?${params.toString()}`;
}

export function assemblyPresetVisualizerPath(presetId:string){
 return `${ASSEMBLY_TOOL_PATH}?${new URLSearchParams({preset:presetId}).toString()}`;
}
