import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const versionFilePath = join(__dirname, 'src', 'environments', 'version.ts');
const namePattern = /name: 'v(.*)'/g;
const codePattern = /code: (.*)/g;

let versionFileContent = readFileSync(versionFilePath).toString();
let name = [...versionFileContent.matchAll(namePattern)].pop().pop();
name = Number(name.replace(/\./g, ''));
let code = Number([...versionFileContent.matchAll(codePattern)].pop().pop());

if (isNaN(name)) throw new Error('version#name is NaN');
if (isNaN(code)) throw new Error('version#code is NaN');

name++;
code++;

versionFileContent = versionFileContent.replace(namePattern, `name: 'v${String(name).split('').join('.')}'`)
versionFileContent = versionFileContent.replace(codePattern, `code: ${code}`);

console.log(versionFileContent);
console.log('Writing to version.ts ...');
writeFileSync(versionFilePath, versionFileContent);
console.log('Version++ done !!');
