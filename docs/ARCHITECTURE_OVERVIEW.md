# Architecture Overview — @kummahiih/circle-enroll

## Overview

`@kummahiih/circle-enroll` is a small npm package that ships **browser-only enrollment assets** for page-scoped password / passkey material. Operators and end users run enroll in the browser; the result is a JSON file (hash, never the password) delivered out-of-band to the site operator. The package is consumed by `@kummahiih/private-circle` and demo sites such as hello-circle.

There is no backend runtime. Optional static hosting (`index.html` + Vercel) is a convenience demo, not part of the package contract.

## System Components

| Component | Path | Role |
|-----------|------|------|
| Package manifest | `package.json` | Name `@kummahiih/circle-enroll`, bin, `files: [assets, bin]` |
| Enroll UI | `assets/enroll.html` | Form + strict CSP meta; links same-origin CSS/JS |
| Styles | `assets/enroll.css` | All presentation (no inline styles) |
| PBKDF2 path | `assets/enroll-core.js` | Salt, PBKDF2-SHA256 (310k), download/copy JSON |
| WebAuthn PRF path | `assets/enroll-prf.js` | Passkey create/get + PRF eval; page-scoped salt |
| Schema notes | `assets/enroll-json.md` | JSON v1 shape and origin constraints |
| CLI | `bin/cli.mjs` | `circle-enroll copy --out <dir>` copies the four runtime assets |
| Tests | `test/cli.test.mjs` | Asserts copy writes four files |
| Publish | `.github/workflows/publish.yml` | `npm test` then `npm publish` with `NPM_TOKEN` |
| Legacy demo | `index.html`, `vercel.json` | Older single-page demo host (not package assets) |

## Data Flow

1. User opens `enroll.html` (same origin as the future gated site for PRF).
2. User supplies `pageId`, optional label, and either a password or a passkey.
3. **Password:** browser derives `hash = PBKDF2-SHA256(password, randomSalt‖UTF-8(pageId), 310000)` → JSON `{ v:1, alg:"PBKDF2-SHA256", salt, hash, pageId, … }`.
4. **PRF:** authenticator evaluates PRF with salt `circle-prf:v1:{pageId}` → JSON `{ v:1, alg:"WebAuthn-PRF", hash, pageId, rpId, … }`.
5. User downloads or copies JSON; delivers it privately to the operator.
6. Operator places JSON under `hashes/` and runs private-circle `encrypt` at build time.

No enroll data is sent to a network service from the enroll page (`connect-src 'none'`).

## Technology Stack

- **Runtime (browser):** Web Crypto API, WebAuthn Level 3 PRF extension
- **Runtime (CLI):** Node.js ≥ 18, ESM
- **Language:** HTML, CSS, vanilla JS (IIFE), Node ESM for CLI
- **CI/CD:** GitHub Actions → npm registry
- **License:** Apache-2.0

## Tool / Integration Architecture

- **npm package API:** filesystem assets + `bin` CLI; no programmatic JS exports of crypto helpers.
- **Consumers:** `require.resolve('@kummahiih/circle-enroll/package.json')` from private-circle to locate `assets/`.
- **Publishing:** workflow_dispatch / tag → test → `npm publish --access public`.

## Workspace / Package Boundary

Published tarball includes only `assets/` and `bin/` (plus standard npm metadata files). Tests, `docs/`, legacy `index.html`, and Vercel config are development/hosting concerns outside the runtime contract for gated sites.
