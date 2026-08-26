# Architecture Detail — @kummahiih/circle-enroll

## Network Topology

- **Enroll page (package assets):** no outbound network. Meta CSP `connect-src 'none'`. Crypto and WebAuthn are local browser APIs.
- **Operator delivery path:** out-of-band (secure channel chosen by humans); not implemented by this package.
- **Optional Vercel demo (`circle-enroll.vercel.app`):** static HTTPS hosting of legacy `index.html`. TLS terminated by Vercel. This host is a **different origin** from consumer gated sites.

## Security Architecture

### Credentials and secrets

| Material | Where | Notes |
|----------|--------|------|
| User password | Browser memory only | Cleared after PBKDF2 in enroll-core |
| Passkey / PRF output | Authenticator + one-shot JSON | Bound to `rpId` + pageId salt |
| Enroll JSON | User device → operator | Treat as secret; not for public git |
| npm publish token | GitHub Actions secret `NPM_TOKEN` | Publish workflow only |

### Isolation and CSP

Package enroll assets enforce **strict same-origin static CSP**:

- `script-src 'self'` — only `enroll-core.js`, `enroll-prf.js`
- `style-src 'self'` — only `enroll.css`
- No `'unsafe-inline'`, no `'unsafe-eval'`, no nonces (static hosting)

### Auth matrix

| Actor | Can do |
|-------|--------|
| End user on enroll origin | Create PBKDF2 or PRF enroll JSON for a `pageId` |
| Operator | Receive JSON, feed private-circle encrypt |
| CDN visitor of gated site | Not this package’s concern |
| npm consumer | Copy assets into their static output |

## Design Decisions

| Decision | Rationale | Rejected alternatives |
|----------|-----------|------------------------|
| Static assets + `'self'` CSP | Works offline; no SSR/middleware | Nonce CSP (needs per-request HTML) |
| External CSS/JS only | Removes `'unsafe-inline'` | Inline styles/scripts |
| Page-scoped salts | Same password ≠ same hash across sites | Global salt |
| No mailto / email API | Hash must not hit mail logs | mailto: deep links |
| PRF requires same origin | WebAuthn RP ID binding | Cross-origin public enroll for PRF |
| CLI copy only | Minimal surface | Heavy Node crypto exports |
