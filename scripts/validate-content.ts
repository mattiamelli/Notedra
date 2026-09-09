import { validateContentPack } from './content/validate.ts';

const result = validateContentPack();
if (!result.valid) {
  console.error(`Content Pack v1.0.1 validation FAILED (${result.issues.length} violations)`);
  for (const issue of result.issues) console.error(`[${issue.code}] ${issue.path}: ${issue.message}`);
  process.exitCode = 1;
} else {
  console.log('Content Pack v1.0.1 / schema 1.1.0: PASS');
  console.log(JSON.stringify({counts:result.counts,relations:result.relationCounts},null,2));
  for (const check of result.checks) console.log(`PASS ${check}`);
  console.log('No original PDF binaries or PDF full text were opened or validated.');
}
