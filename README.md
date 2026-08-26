# @kummahiih/circle-enroll

Browser enroll assets for page-scoped PBKDF2 / WebAuthn-PRF password hashes.

Used by [`@kummahiih/private-circle`](https://github.com/kummahiih/private-circle) and [hello-circle](https://github.com/kummahiih/hello-circle).

## Assets

- `assets/enroll.html` — enrollment UI (password or passkey)
- `assets/enroll-core.js` — PBKDF2 path + shared helpers
- `assets/enroll-prf.js` — WebAuthn PRF path

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

## License

Apache-2.0
