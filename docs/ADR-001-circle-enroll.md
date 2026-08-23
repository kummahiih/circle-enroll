# ADR-001: circle-enroll – sivukohtainen salasanan hash-rekisteröinti

**Status:** Accepted (päivitetty)  
**Date:** 2026-08-24  
**Updated:** 2026-08-24 (mailto poistettu)  
**Repo:** https://github.com/kummahiih/circle-enroll  
**Live:** https://circle-enroll.vercel.app/

---

## Context

Piirisivut tarvitsevat tavan kerätä käyttäjäkohtainen avainmateriaali ilman että salasanaa tallennetaan palvelimeen tai gittiin.

**Päivitys:** Vulnerability assessment tunnisti riskin, että `mailto:` voi vuotaa hash-JSON:in sähköpostilokeihin. Mailto poistettiin tietoisesti.

---

## Decision

Staattinen `index.html`:

1. Käyttäjä antaa `pageId`, valinnaisen tunnisteen ja salasanan.
2. Selain: `salt` (16 B), `pbkdf2Salt = salt || UTF-8(pageId)`, `hash = PBKDF2-SHA256(..., 310000, 32 B)`.
3. JSON ilman salasanaa.
4. **Lataa JSON** tai **kopioi leikepöydälle**.
5. Toimitus ylläpitäjälle sovittua **turvallista kanavaa** pitkin — sivulla ei ole mailto-nappia.

### Hylätty

| Vaihtoehto | Syy |
|------------|-----|
| `mailto:` JSON bodyyn | Hash on salainen; sähköposti ei ole luottamuksellinen |
| Email-API backend | Turha; staattinen Hobby-malli |
| OAuth avaimena | Ei vakaa offline-AES ilman backendia |

### URL

- `?page=` / `?pageId=` esitäyttää tunnisteen
- Sähköpostiparametrit poistettu

### Hosting

Public GitHub, Vercel Hobby, `robots.txt` + noindex, `vercel.json` (CSP, frame-deny, nosniff).

---

## Consequences

- Hash ei ohjaudu automaattisesti sähköpostiin
- Käyttäjän vastuulla turvallinen toimitus
- Hash-JSON yhä salainen materiaali (ei public gittiin)
- Phishing + heikko salasana edelleen ketjun riskit

---

## Related

- `index.html`, `robots.txt`, `vercel.json`
- Skill: `private-circle-page`
- Live: https://circle-enroll.vercel.app/
