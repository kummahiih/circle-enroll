# WebAuthn PRF support matrix

Canonical detail lives in [private-circle docs/WEBAUTHN_PRF_SUPPORT.md](https://github.com/kummahiih/private-circle/blob/main/docs/WEBAUTHN_PRF_SUPPORT.md).

Short summary (2026-08):

| Browser | Min version |
|---------|-------------|
| Chrome / Edge (Chromium) | 116+ |
| Safari | 18+ (platform authenticator only) |
| Firefox | 135+ |

Same-origin enroll required for PRF. Prefer a PBKDF2 backup enrollment if lockout risk is unacceptable.
