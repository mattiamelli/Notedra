import {createHash} from 'node:crypto';
import {createReadStream, readdirSync, statSync} from 'node:fs';
import {join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeAcademicIndex} from './academic-index';

// Inventory is not a claim that a document was semantically or visually reviewed.
// Only relative source paths and content digests are retained in the repository.
async function inventory(root: string) {
  const paths: string[] = [];
  const walk = (directory: string) => {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
      if (entry.name.startsWith('.')) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile()) paths.push(path);
    }
  };
  walk(root);
  const records = [];
  for (const path of paths.sort()) {
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(path)) hash.update(chunk);
    records.push({path: relative(root, path).split(sep).join('/'), bytes: statSync(path).size, sha256: hash.digest('hex')});
  }
  return records;
}
const courses = [];
for (const argument of process.argv.slice(2)) {
  const separator = argument.indexOf('=');
  if (separator < 1) throw new Error('Expected COURSE_ID=source-directory arguments.');
  const id = argument.slice(0, separator);
  if (!/^CSE1[234][ABC]_[A-Z]+$/.test(id)) throw new Error('Unsupported course identity.');
  courses.push({id, files: await inventory(resolve(argument.slice(separator + 1)))});
}
if (courses.length !== 8 || new Set(courses.map(course => course.id)).size !== 8) throw new Error('All eight source directories are required.');
writeAcademicIndex(JSON.stringify({scope: 'File inventory and SHA-256, not semantic review', courses}, null, 2) + '\n',
  fileURLToPath(new URL('../docs/curriculum-source-inventory.json', import.meta.url)));
console.log('Source inventory:', courses.map(course => ({course: course.id, files: course.files.length})));
