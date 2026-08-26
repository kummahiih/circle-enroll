# Threat Model — @kummahiih/circle-enroll

## Trust Boundaries

| Boundary | Inside | Outside |
|----------|--------|---------|
| Browser enroll origin | enroll HTML/JS/CSS, Web Crypto, WebAuthn | Network, other origins, extensions |
| Operator machine | Received enroll JSON, private-circle build | Public git, CDN |
| npm publish | GitHub Actions + `NPM_TOKEN` | Public registry consumers |
| Public demo host | Static files on Vercel | End users on unrelated gated domains |

## Identified Threats (STRIDE-oriented)

### Spoofing
- **Fake enroll page (phishing):** Attacker hosts lookalike enroll and steals passwords before hashing. *Mitigation:* operators must distribute genuine enroll URL; prefer same-origin enroll under the gated domain.
- **Wrong `pageId`:** User enrolls under attacker-controlled pageId; hash useless or confuses operator. *Mitigation:* URL prefill `?page=`, operator validation in encrypt.

### Tampering
- **Modified enroll JS on CDN:** Compromised static host alters PBKDF2 parameters or exfiltrates password. *Mitigation:* strict CSP `connect-src 'none'` blocks exfil endpoints; SRI optional future; host enroll under operator-controlled origin.
- **Altered enroll JSON in transit:** Hash replaced. *Mitigation:* integrity of private delivery channel (not package scope).

### Repudiation
- Low relevance; no server-side auth log. Operator accepts responsibility for which hashes are built in.

### Information disclosure
- **Password in memory / XSS on enroll page:** CSP reduces script injection; still treat enroll origin as sensitive during typing.
- **Enroll JSON exposure:** Hash enables offline guessing for PBKDF2 entries. *Mitigation:* private delivery; strong passwords; prefer WebAuthn-PRF; **never commit real hashes to public git; never ship hashes with dist**.
- **Legacy demo CSP weaker:** historical demo hosts; package path is strict `'self'` only.

### Denial of service
- Negligible on static assets. WebAuthn UI cancel is user-driven.

### Elevation of privilege
- N/A for package itself. Successful phishing yields password equivalent to user secret.

## Prioritized Mitigation Plan

### Critical
- [x] **Production enroll only on the gated site’s origin** (document in ops runbooks; already in UI warning for PRF).
- [x] **Never commit enroll JSON with real user hashes to public repos.** Documented in README + private-circle hygiene.

### High
- [x] **Retire or realign legacy `index.html` + `vercel.json`** with package CSP (`'self'` only, external CSS/JS) so the public demo cannot be mistaken for the strict package path.
- [ ] **Prefer WebAuthn-PRF** for high-value circles; keep password backup enrollment only if recovery is required.

### Medium
- [ ] Optional **Subresource Integrity** hashes for enroll-*.js when copying into dist (CLI enhancement).
- [ ] Align meta CSP and HTTP CSP on all hosts (single source of truth).

### Low
- [ ] Expand CLI tests for asset content fingerprints after copy.
- [ ] Document expected minimum authenticator / browser versions for PRF.
