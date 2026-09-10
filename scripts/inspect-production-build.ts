import './inspect-visual-build';
import {validateProductionArtifacts} from './hardening-validation';
console.log('Production bundle exclusions PASS',validateProductionArtifacts());
