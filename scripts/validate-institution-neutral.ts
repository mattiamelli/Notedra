import {readFileSync,readdirSync,statSync} from 'node:fs';
const forbidden=/TU Delft|Delft University(?: of Technology)?|DelftStudy|Delft Study|\bDelft\b|Computer Architecture|Reasoning and Logic|Introduction to Programming/gi;
const roots=['src','public'];
const files:string[]=[];
function walk(path:string){for(const name of readdirSync(path)){const file=path+'/'+name,stat=statSync(file);if(stat.isDirectory()){if(file==='src/generated')continue;walk(file);}else if(/\.(?:tsx|html|svg|json)$/.test(file)||file==='src/i18n/messages.ts')files.push(file);}}
for(const root of roots)walk(root);files.push('index.html','scripts/release.ts');
const internalAliases=new Set(['src/i18n/i18n.tsx','src/appearance/theme.tsx']);
const failures:string[]=[];
for(const file of files){if(internalAliases.has(file))continue;let text=readFileSync(file,'utf8');if(file==='scripts/release.ts')text=text.replace(/^export const productionOrigin.*$/m,'').replace("name:'delftstudy-release'","name:'internal-release-plugin'");for(const match of text.matchAll(forbidden))failures.push(`${file}:${match.index}:${match[0]}`);}
if(failures.length)throw new Error('Institutional branding reached public presentation:\n'+failures.join('\n'));
console.log(`Institution-neutral presentation validation passed (${files.length} files).`);
