import {verifyExpansionCO} from './verify-expansion-co';
import {validateExpansion} from './expansion-validation';
import {validateInteractiveContent} from './interactive-validation';
import { validatePracticeFiles } from './practice-catalog.ts';
try { validatePracticeFiles(); validateInteractiveContent();
validateExpansion(); verifyExpansionCO(); console.log('Practice catalog: PASS — 6 immutable authored exercises; 2 per subject; canonical skills, lecture provenance and version locks verified.'); }
catch (error) { console.error(error); process.exitCode = 1; }
