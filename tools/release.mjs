// Publish a new version of the app.
//
//   node tools/release.mjs <1.4.0 | patch | minor | major> "What changed" ["Another change" ...]
//
// Writes, in one go and always in step:
//   index.html      APP_RELEASE (1.4.0), APP_DATE (Hong Kong date) and APP_VERSION (build stamp)
//   version.json    what installed apps read to know an update is out
//   changelog.json  the "What's new" list, newest first
//
// Version numbers: patch (1.3.0 -> 1.3.1) for a fix or a duty edit,
// minor (1.3.0 -> 1.4.0) for something new on screen, major for a rework.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [arg, ...notes] = process.argv.slice(2);
const fail = m => { console.error('release: ' + m); process.exit(1); };

if (!arg) fail('give a version (1.4.0) or patch, minor or major, then one note per change.');
if (!notes.length || notes.some(n => !n.trim())) fail('add at least one note saying what changed, in plain words.');

const read = f => readFileSync(join(root, f), 'utf8');
const current = JSON.parse(read('version.json'));
const log = JSON.parse(read('changelog.json'));
const parse = v => { const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v || ''); return m ? m.slice(1).map(Number) : null; };
const cur = parse(current.version) || [0, 0, 0];

let next;
if (arg === 'patch') next = [cur[0], cur[1], cur[2] + 1];
else if (arg === 'minor') next = [cur[0], cur[1] + 1, 0];
else if (arg === 'major') next = [cur[0] + 1, 0, 0];
else next = parse(arg) || fail(`"${arg}" is not a version like 1.4.0`);

const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
if (cmp(next, cur) <= 0) fail(`${next.join('.')} must be higher than the current ${cur.join('.')}.`);

const version = next.join('.');
const now = new Date();
const stamp = now.toISOString().slice(0, 16).replace(/[-:T]/g, '');
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(now); // YYYY-MM-DD

let html = read('index.html');
for (const [name, value] of [['APP_RELEASE', version], ['APP_DATE', date], ['APP_VERSION', stamp]]) {
  const re = new RegExp(`const ${name}="[^"]*";`, 'g');
  const hits = html.match(re) || [];
  if (hits.length !== 1) fail(`expected one ${name} line in index.html, found ${hits.length}.`);
  html = html.replace(re, `const ${name}="${value}";`);
}

writeFileSync(join(root, 'index.html'), html);
writeFileSync(join(root, 'version.json'), JSON.stringify({ v: stamp, version, date, notes }, null, 2) + '\n');
writeFileSync(join(root, 'changelog.json'), JSON.stringify([{ version, date, notes }, ...log], null, 2) + '\n');
console.log(`Version ${version} (build ${stamp}, ${date})`);
