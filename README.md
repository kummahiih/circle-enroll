# @kummahiih/circle-enroll

Browser enroll assets for page-scoped PBKDF2 / WebAuthn-PRF password hashes.

Used by [`@kummahiih/private-circle`](https://github.com/kummahiih/private-circle) and [hello-circle](https://github.com/kummahiih/hello-circle).

## Assets

- `assets/enroll.html` — enrollment UI (password or passkey)
- `assets/enroll.css` — styles (no inline CSS; strict CSP)
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

Writes `enroll.html`, `enroll.css`, `enroll-core.js`, and `enroll-prf.js` into the target directory.

## Content Security Policy

**No nonces — static external assets only.**

Enroll is designed for pure static hosting (no SSR, no edge HTML rewrite). CSP is enforced with external files, not per-request nonces:

| Directive | Value | Why |
|-----------|--------|-----|
| `script-src` | `'self'` | `enroll-core.js`, `enroll-prf.js` |
| `style-src` | `'self'` | `enroll.css` (no inline `<style>`) |
| `connect-src` | `'none'` | No network on enroll |
| `'unsafe-inline'` | **not used** | Avoided entirely |
| Nonces / `'strict-dynamic'` | **not used** | Require dynamic HTML; break offline static `dist/` |

Default meta CSP on `enroll.html`:

```
default-src 'none'; base-uri 'none'; form-action 'none';
script-src 'self'; style-src 'self'; connect-src 'none';
img-src 'none'; font-src 'none'; object-src 'none'; frame-ancestors 'none'
```

Prefer the **HTTP CSP header** (e.g. Vercel `headers`) as the source of truth; keep the meta tag aligned or omit it to avoid intersection surprises.

## Consumption

### private-circle

`@kummahiih/private-circle` resolves enroll assets from this package (via `require.resolve`) when encrypting or running `init`. Gate assets (`gate.js` / `gate.css`) stay in private-circle.

### hello-circle / your site

```bash
npx circle-enroll copy --out dist
# or include in build before encrypt
```

Serve enroll on the **same origin** as the gated page for WebAuthn-PRF unlock. Public `circle-enroll.vercel.app` is fine for PBKDF2 hashes but not for PRF across different domains.

## License

Apache-2.0
