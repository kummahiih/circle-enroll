import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, '..', 'bin', 'cli.mjs');
const FILES = ['enroll.html', 'enroll.css', 'enroll-core.js', 'enroll-prf.js'];

test('copy writes 4 files', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'circle-enroll-'));
  const r = spawnSync(process.execPath, [CLI, 'copy', '--out', tmp], {
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, r.stderr || r.stdout);
  for (const name of FILES) {
    const p = path.join(tmp, name);
    assert.ok(fs.existsSync(p), `missing ${name}`);
    assert.ok(fs.statSync(p).size > 100, `${name} too small`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('copy fails without --out', () => {
  const r = spawnSync(process.execPath, [CLI, 'copy'], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
});
