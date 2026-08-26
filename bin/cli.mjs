#!/usr/bin/env node
/**
 * CLI for @kummahiih/circle-enroll
 *   npx circle-enroll copy --out <dir>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, '..', 'assets');
const FILES = ['enroll.html', 'enroll.css', 'enroll-core.js', 'enroll-prf.js'];

function usage() {
  console.log(`
Usage:
  circle-enroll copy --out <dir>
`);
}

function parseArgs(argv) {
  const out = { command: argv[2] || '', outDir: '' };
  for (let i = 3; i < argv.length; i++) {
    if (argv[i] === '--out') out.outDir = argv[++i];
  }
  return out;
}

function cmdCopy(outDir) {
  if (!outDir) {
    console.error('Missing --out <dir>');
    usage();
    process.exit(1);
  }
  const dest = path.resolve(outDir);
  fs.mkdirSync(dest, { recursive: true });
  for (const name of FILES) {
    const src = path.join(ASSETS, name);
    if (!fs.existsSync(src)) {
      console.error('Missing asset:', src);
      process.exit(1);
    }
    const target = path.join(dest, name);
    fs.copyFileSync(src, target);
    console.log('Wrote', target);
  }
}

const args = parseArgs(process.argv);

if (args.command === 'copy') {
  try {
    cmdCopy(args.outDir);
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
} else {
  usage();
  process.exit(args.command ? 1 : 0);
}
