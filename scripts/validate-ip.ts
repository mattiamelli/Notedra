import {validateIPFiles} from './ip-content';
try {console.log('Introduction to Programming validation passed:',JSON.stringify(validateIPFiles()));}
catch(error){console.error(error instanceof Error?error.message:String(error));process.exitCode=1;}
