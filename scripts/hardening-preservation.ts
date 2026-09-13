import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import lock from './hardening-preservation.json';
const changes=lock as Record<string,{before:string;after:string}>;
export function hardeningHash(file:string,previous:string):string {
 const entry=changes[file];if(!entry)return previous;
 if(previous===entry.after)return previous;
 assert.equal(previous,entry.before,'Unrecognized hardening baseline: '+file);return entry.after;
}
/** Compare prior locks to their original bytes, only for an exactly pinned repair. */
export function beforeHardening(file:string,data:Buffer):Buffer {
 const entry=changes[file];if(!entry)return data;
 assert.equal(createHash('sha256').update(data).digest('hex'),entry.after,'Unaccepted hardening change: '+file);
 const original=execFileSync('git',['show','6d1b9dfd3fb148ba7097e7ed238e600da2a81deb:'+file]);
 assert.equal(createHash('sha256').update(original).digest('hex'),entry.before);return original;
}
