import { cp, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const declarationsDir = path.join(root, 'dist/types');
const sourceGlobal = path.join(root, 'src/global.d.ts');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(file);
      continue;
    }
    if (!entry.name.endsWith('.d.ts')) continue;

    let content = await readFile(file, 'utf8');
    content = content.replace(/(['"])@\/([^'"]+)\1/g, (_match, quote, target) => {
      const absoluteTarget = path.join(declarationsDir, target);
      let relative = path.relative(path.dirname(file), absoluteTarget).split(path.sep).join('/');
      if (!relative.startsWith('.')) relative = `./${relative}`;
      return `${quote}${relative}${quote}`;
    });
    await writeFile(file, content);
  }
}

await walk(declarationsDir);
await cp(sourceGlobal, path.join(declarationsDir, 'global.d.ts'));
const entry = path.join(declarationsDir, 'index.d.ts');
const existing = await readFile(entry, 'utf8');
await writeFile(entry, `/// <reference path="./global.d.ts" />\n${existing}`);
