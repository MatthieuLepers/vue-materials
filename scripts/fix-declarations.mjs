import { cp, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const declarationsDir = path.join(root, 'dist/types');
const sourceGlobal = path.join(root, 'src/global.d.ts');

async function walk(directory, callback) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(file, callback);
    } else {
      await callback(file);
    }
  }
}

await walk(declarationsDir, async (file) => {
  if (!file.endsWith('.d.ts')) return;

  let content = await readFile(file, 'utf8');
  content = content.replace(/(['"])@\/([^'"]+)\1/g, (_match, quote, target) => {
    const absoluteTarget = path.join(declarationsDir, target);
    let relative = path.relative(path.dirname(file), absoluteTarget).split(path.sep).join('/');
    if (!relative.startsWith('.')) relative = `./${relative}`;
    return `${quote}${relative}${quote}`;
  });
  await writeFile(file, content);
});

await cp(sourceGlobal, path.join(declarationsDir, 'global.d.ts'));

await walk(declarationsDir, async (file) => {
  if (!file.endsWith('/index.d.ts') && path.basename(file) !== 'index.d.ts') return;

  const relativeGlobal = path.relative(path.dirname(file), path.join(declarationsDir, 'global.d.ts')).split(path.sep).join('/');
  const reference = relativeGlobal.startsWith('.') ? relativeGlobal : `./${relativeGlobal}`;
  const content = await readFile(file, 'utf8');
  if (!content.includes('global.d.ts')) {
    await writeFile(file, `/// <reference path="${reference}" />\n${content}`);
  }
});
