# ADR-001: circle-enroll – sivukohtainen salasanan hash-rekisteröinti

**Status:** Accepted (päivitetty)  
**Date:** 2026-08-24  
**Updated:** 2026-09-06 (ulkoinen `enroll.css`, ei `'unsafe-inline'`)  
**Repo:** https://github.com/kummahiih/circle-enroll  
**Live:** https://circle-enroll.vercel.app/

---

## Context

Piirisivut tarvitsevat tavan kerätä käyttäjäkohtainen avainmateriaali ilman että salasanaa tallennetaan palvelimeen tai gittiin.

**Päivitykset:**
- Vulnerability assessment tunnisti riskin, että `mailto:` voi vuotaa hash-JSON:in sähköpostilokeihin. Mailto poistettiin.
- Yksi iso `index.html` (inline CSS/JS) korvattiin paketin asseteilla: `enroll.html` + `enroll.css` + `enroll-core.js` + `enroll-prf.js`, jotta CSP voi olla `style-src 'self'` ilman `'unsafe-inline'`.

---

## Decision

Staattiset enroll-assetit (`assets/`):

1. Käyttäjä antaa `pageId`, valinnaisen tunnisteen ja salasanan tai passkeyn.
2. Selain: `salt` (16 B), `pbkdf2Salt = salt || UTF-8(pageId)`, `hash = PBKDF2-SHA256(..., 310000, 32 B)` — tai WebAuthn PRF.
3. JSON ilman salasanaa.
4. **Lataa JSON** tai **kopioi leikepöydälle**.
5. Toimitus ylläpitäjälle sovittua **turvallista kanavaa** pitkin — sivulla ei ole mailto-nappia.
6. Esitystyyli vain `enroll.css`:ssä. Meta- ja HTTP-CSP: `script-src 'self'; style-src 'self'; connect-src 'none'`. Ei `'unsafe-inline'`, ei nonceja.

### Hylätty

| Vaihtoehto | Syy |
|------------|-----|
| `mailto:` JSON bodyyn | Hash on salainen; sähköposti ei ole luottamuksellinen |
| Email-API backend | Turha; staattinen Hobby-malli |
| OAuth avaimena | Ei vakaa offline-AES ilman backendia |
| Inline `<style>` / `<script>` | Pakottaisi `'unsafe-inline'`; rikkoo tiukan CSP:n |

### URL

- `?page=` / `?pageId=` esitäyttää tunnisteen
- Sähköpostiparametrit poistettu
- Gated-sivulla `private-circle encrypt` leimaa `data-page-id` + `data-lock-page-id`

### Hosting

Public GitHub, Vercel Hobby, `robots.txt` + noindex, `vercel.json` (CSP `'self'` only, frame-deny, nosniff). Demo rewrite palvelee `assets/enroll.html`.

---

## Consequences

- Hash ei ohjaudu automaattisesti sähköpostiin
- Käyttäjän vastuulla turvallinen toimitus
- Hash-JSON yhä salainen materiaali (ei public gittiin)
- Phishing + heikko salasana edelleen ketjun riskit
- Kuluttajarepon juureen jäänyt vanha `enroll.html` voittaa paketin kopion (`encrypt` etsii cwd:stä ensin) — pidä fork synkassa tai poista se

---

## Related

- `assets/enroll.html`, `assets/enroll.css`, `assets/enroll-*.js`, `vercel.json`
- Skill: `private-circle-page`
- Live: https://circle-enroll.vercel.app/
