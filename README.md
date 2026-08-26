# @kummahiih/circle-enroll

Browser enroll assets for page-scoped PBKDF2 / WebAuthn-PRF password hashes.

Used by [`@kummahiih/private-circle`](https://github.com/kummahiih/private-circle) and [hello-circle](https://github.com/kummahiih/hello-circle).

## Assets

| File | Role |
|------|------|
| `assets/enroll.html` | Enrollment UI (password or passkey) |
| `assets/enroll.css` | Styles (same-origin file; no inline CSS) |
| `assets/enroll-core.js` | PBKDF2 path + shared helpers |
| `assets/enroll-prf.js` | WebAuthn PRF path |
| `assets/enroll-json.md` | JSON schema v1 + same-origin PRF notes |

JSON schema **v1** matches private-circle enrollment format.

## Install

```bash
npm install @kummahiih/circle-enroll
```

## CLI

```bash
npx circle-enroll copy --out <dir>
```

Writes `enroll.html`, `enroll.css`, `enroll-core.js`, and `enroll-prf.js` into the target directory.

## Operator runbook (production)

1. **Same-origin enroll for PRF** — Host `enroll.html` on the **same origin** as the gated page. WebAuthn credentials are RP-ID bound; a public enroll host on a different domain works for PBKDF2 only.
2. **Prefer WebAuthn-PRF** for high-value circles (smaller offline attack surface). Keep a **password backup** enrollment if recovery after passkey loss is required.
3. **Hashes hygiene** — Never commit real user hashes to public git; never publish enroll JSON with `dist/`. Demo sites may ship labeled public demo hashes only.
4. **Rotate on leak** — If hashes may have leaked together with published masks, rotate the build key `K` and re-enroll everyone.

Full detail: [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md) and [`@kummahiih/private-circle` security notes](https://github.com/kummahiih/private-circle/blob/main/assets/security.md).

## Content Security Policy (strict)

**Same-origin static assets only** — not third-party CDNs, not inline code, not nonces.

| Directive | Value | Assets |
|-----------|--------|--------|
| `script-src` | `'self'` | `enroll-core.js`, `enroll-prf.js` |
| `style-src` | `'self'` | `enroll.css` |
| `connect-src` | `'none'` | No network on enroll |
| `'unsafe-inline'` / `'unsafe-eval'` | **not used** | — |
| Nonces / `'strict-dynamic'` | **not used** | Need dynamic HTML; break offline static hosting |

Default meta CSP on `enroll.html`:

```
default-src 'none'; base-uri 'none'; form-action 'none';
script-src 'self'; style-src 'self'; connect-src 'none';
img-src 'none'; font-src 'none'; object-src 'none'; frame-ancestors 'none'
```

Prefer the **HTTP CSP header** (e.g. Vercel `headers`) as the source of truth; keep the meta tag aligned or omit it.

## Consumption

### private-circle

`@kummahiih/private-circle` resolves enroll assets from this package when encrypting or running `init`. Gate assets (`gate.js` / `gate.css`) stay in private-circle.

### hello-circle / your site

```bash
npx circle-enroll copy --out dist
```

Serve enroll on the **same origin** as the gated page for WebAuthn-PRF unlock.

## License

Apache-2.0
