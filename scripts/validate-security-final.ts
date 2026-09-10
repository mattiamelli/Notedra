import {validateHardening,validateProductionArtifacts} from './hardening-validation';
console.log('Final static source and emitted-asset security checks PASS',validateHardening(),validateProductionArtifacts());
