# @kummahiih/circle-enroll

Browser enroll assets for page-scoped PBKDF2 / WebAuthn-PRF password hashes.

Used by [`@kummahiih/private-circle`](https://github.com/kummahiih/private-circle) and [hello-circle](https://github.com/kummahiih/hello-circle).

## Assets

- `assets/enroll.html` — enrollment UI (password or passkey)
- `assets/enroll-core.js` — PBKDF2 path + shared helpers
- `assets/enroll-prf.js` — WebAuthn PRF path
- `assets/enroll-json.md` — JSON schema v1 + same-origin PRF notes

JSON schema **v1** is identical to the private-circle enrollment format.

## Install

```bash
npm install @kummahiih/circle-enroll
```

## CLI

```bash
npx circle-enroll copy --out <dir>
```

Writes `enroll.html`, `enroll-core.js`, and `enroll-prf.js` into the target directory.

## Consumption

### private-circle

`@kummahiih/private-circle` resolves enroll assets from this package (via `require.resolve`) when encrypting or running `init`. Gate assets (`gate.js` / `gate.css`) stay in private-circle.

### hello-circle / your site

```bash
npx circle-enroll copy --out dist
# or include in build before encrypt
```

Serve enroll on the **same origin** as the gated page for WebAuthn-PRF unlock. Public `circle-enroll.vercel.app` is fine for PBKDF2 hashes but not for PRF across different domains.

CSP: enroll pages use `script-src 'self'` and no network (`connect-src 'none'`).

## License

Apache-2.0
