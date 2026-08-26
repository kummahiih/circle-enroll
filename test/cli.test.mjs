import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'cli.mjs');
const ASSETS = path.join(ROOT, 'assets');
const FILES = ['enroll.html', 'enroll.css', 'enroll-core.js', 'enroll-prf.js'];

function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

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

test('copy fingerprints match package assets (no content drift)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'circle-enroll-fp-'));
  const r = spawnSync(process.execPath, [CLI, 'copy', '--out', tmp], {
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, r.stderr || r.stdout);

  for (const name of FILES) {
    const src = path.join(ASSETS, name);
    const dst = path.join(tmp, name);
    assert.ok(fs.existsSync(src), `source asset missing: ${name}`);
    assert.deepEqual(
      fs.readFileSync(dst),
      fs.readFileSync(src),
      `${name} bytes must match assets/`
    );
    assert.equal(
      sha256File(dst),
      sha256File(src),
      `${name} sha256 must match assets/`
    );
  }
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('copy fails without --out', () => {
  const r = spawnSync(process.execPath, [CLI, 'copy'], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
});
