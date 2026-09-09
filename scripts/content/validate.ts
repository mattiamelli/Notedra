import Ajv2020 from 'ajv/dist/2020.js';
import type { ValidateFunction } from 'ajv';
import { PACK_VERSION, SCHEMA_DIALECT, SCHEMA_VERSION } from './constants.ts';
import { buildIndexes, checkCounts, checkPrerequisites, checkReferences, checkRelations } from './integrity.ts';
import { checkPolicies } from './policies.ts';
import { checkFrequency } from './frequency.ts';
import { isRecord, type ContentPack, type ValidationReport, type ValidationIssue } from './types.ts';
import { loadPackFiles, readDocuments, sha256, verifyManifest } from './manifest.ts';

const compiledSchemas = new Map<string, ValidateFunction<ContentPack>>();
function compileSchema(schema: Record<string, unknown>): ValidateFunction<ContentPack> {
  const digest = sha256(Buffer.from(JSON.stringify(schema)));
  const cached = compiledSchemas.get(digest);
  if (cached) return cached;
  // The supplied schema's conditional required fields are declared in parent schemas.
  // Disable that optional lint rule; all JSON Schema validation remains enabled.
  const ajv = new Ajv2020({allErrors: true, strict: true, strictRequired: false, allowUnionTypes: true});
  const validate = ajv.compile<ContentPack>(schema);
  // Cache by contents, not $id: changed schemas must never reuse stale validation.
  compiledSchemas.set(digest, validate);
  return validate;
}
export function validateContentData(pack: unknown, schema: unknown): ValidationReport {
  const issues: ValidationIssue[] = [];
  const report = (code: string, path: string, message: string) => {issues.push({code,path,message});};
  const result: ValidationReport = {valid:false,issues,counts:{},relationCounts:{},checks:[]};
  if (!isRecord(schema) || schema.$schema !== SCHEMA_DIALECT) {report('SCHEMA','/$schema','JSON Schema draft 2020-12 is required.'); return result;}
  try {
    const validate = compileSchema(schema);
    if (!validate(pack)) {
      for (const error of validate.errors ?? []) report('SCHEMA',error.instancePath,`${error.message}; ${JSON.stringify(error.params)}`);
      return result;
    }
    result.checks.push('JSON Schema 2020-12');
    if (pack.pack_version !== PACK_VERSION || pack.schema_version !== SCHEMA_VERSION) report('VERSION','/','Only Content Pack 1.0.1 / schema 1.1.0 is accepted.');
    result.counts = checkCounts(pack,report);
    const indexes = buildIndexes(pack,report);
    checkReferences(pack,indexes,report);
    result.relationCounts = checkRelations(pack,report);
    checkPrerequisites(pack,indexes,report);
    checkPolicies(pack,report);
    checkFrequency(pack,report);
    result.checks.push('Canonical counts and IDs','All references and memberships','Canonical relation counts and unique edges','Topic/subtopic/skill prerequisite graphs','Course boundaries','Uncertainty and eligibility safety','Unique-document historical frequency','Source/PDF embedding distinction');
  } catch (error) {report('VALIDATOR','/',error instanceof Error ? error.message : String(error));}
  result.valid = issues.length === 0;
  return result;
}
export function validateContentFiles(files: ReadonlyMap<string,Uint8Array>): ValidationReport {
  const manifestIssues: ValidationIssue[] = [];
  verifyManifest(files,(code,path,message) => manifestIssues.push({code,path,message}));
  try {
    const {pack,schema} = readDocuments(files);
    const report = validateContentData(pack,schema);
    report.issues.unshift(...manifestIssues);
    report.valid = report.issues.length === 0;
    if (!manifestIssues.length) report.checks.push('Eight manifest SHA-256 checksums and independently pinned manifest');
    return report;
  } catch (error) {
    return {valid:false,issues:[...manifestIssues,{code:'JSON',path:'/',message:String(error)}],counts:{},relationCounts:{},checks:[]};
  }
}
export function validateContentPack(): ValidationReport {
  try { return validateContentFiles(loadPackFiles()); }
  catch (error) { return {valid:false,issues:[{code:'FILES',path:'content-pack/v1.0.1',message:String(error)}],counts:{},relationCounts:{},checks:[]}; }
}
