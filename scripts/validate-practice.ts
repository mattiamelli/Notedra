import {validateInteractiveContent} from './interactive-validation';
import { validatePracticeFiles } from './practice-catalog.ts';
try { validatePracticeFiles(); validateInteractiveContent(); console.log('Practice catalog: PASS — 6 immutable authored exercises; 2 per subject; canonical skills, lecture provenance and version locks verified.'); }
catch (error) { console.error(error); process.exitCode = 1; }
