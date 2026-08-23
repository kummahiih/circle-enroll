# ADR-001: circle-enroll – sivukohtainen salasanan hash-rekisteröinti

**Status:** Accepted  
**Date:** 2026-08-24  
**Repo:** https://github.com/kummahiih/circle-enroll  
**Live:** https://circle-enroll.vercel.app/

---

## Context

Piirisivut (salatut staattiset HTML-sivut) tarvitsevat tavan kerätä käyttäjäkohtainen avainmateriaali **ilman että salasanaa tallennetaan mihinkään palvelimeen tai gittiin**.

Vaatimukset:
- Toimii puhelimella ja offline-logiikalla (laskenta selaimessa)
- Salasana ei lähde verkkoon
- Hash sidotaan sivun tunnisteeseen (`pageId`), jotta sama salasana ei tuota samaa materiaalia eri sivuille
- Käyttäjä voi lähettää tuloksen ylläpitäjälle (lataus + sähköposti)
- Julkinen repo ja Vercel Hobby OK (ei salaisuuksia koodissa)

Liittyy private-circle / offline-webapp -malliin: enroll JSON → ylläpitäjän build (`encrypt-page.mjs`) → maskit + AES-GCM -loader.

---

## Decision

Toteutetaan **yksittäinen staattinen sivu** (`index.html`):

1. Käyttäjä antaa `pageId`, valinnaisen tunnisteen, valinnaisen vastaanottajasähköpostin ja salasanan.
2. Selain laskee:
   - 16 tavun satunnaisen `salt`
   - `pbkdf2Salt = salt || UTF-8(pageId)`
   - `hash = PBKDF2-SHA256(password, pbkdf2Salt, 310000 iterations, 32 bytes)`
3. Tulos on JSON-tiedosto (ei salasanaa).
4. Käyttäjä lataa JSON:in ja/tai avaa `mailto:`-viestin ohjeineen.

### JSON-muoto

```json
{
  "v": 1,
  "pageId": "metsa-piiri",
  "alg": "PBKDF2-SHA256",
  "iterations": 310000,
  "hashBytes": 32,
  "salt": "<base64>",
  "hash": "<base64>",
  "created": "<ISO-8601>",
  "label": "<optional>"
}
```

### URL-parametrit

- `?page=` / `?pageId=` — esitäyttää sivun tunnisteen
- `?to=` / `?email=` — esitäyttää mailto-vastaanottajan

### Hosting ja näkyvyys

| Valinta | Perustelu |
|---------|-----------|
| Public GitHub | Ei salaisuuksia; helpottaa jakelua |
| Vercel Hobby | Staattinen, ilmainen, ei-kaupallinen |
| `robots.txt` Disallow | Ei hakukonetavoitetta |
| `vercel.json` | CSP, noindex, frame-deny, nosniff |
| Apache-2.0 | Salliva avoin lisenssi |

### Sähköposti-nappi

`mailto:` ei voi liittää tiedostoa automaattisesti (selainrajoitus). Nappi avaa mailiohjelman valmiilla otsikolla ja ohjeella; JSON yritetään laittaa bodyyn, tai käyttäjä liittää ladatun tiedoston / leikepöydän sisällön.

---

## Consequences

### Positiiviset

- Salasana pysyy käyttäjän laitteella
- Ylläpitäjä saa vain salt + hash (+ pageId)
- Sivukohtaisuus estää yhden sivun enroll-materiaalin suoran käytön toisella sivulla (eri `pageId` → eri hash)
- Ei backendia, ei käyttäjätilejä, ei OAuth-riippuvuutta
- Sama formaatti kuin `private-circle-page` -skillin encrypt-skripti odottaa

### Negatiiviset / rajat

- Hash-JSON on **salainen materiaali**: vuoto + julkaistut maskit → `share2 = hash XOR mask`
- PBKDF2 310k voi tuntua hitaalta vanhalla puhelimella
- Mailto-liite ei onnistu automaattisesti
- Ei korvaa palvelinpuolen tunnistautumista; sopii pienen piirin staattiseen porttiin

### Ei tehty (tietoinen rajaus)

- Google / OAuth -kirjautuminen (vaatisi backendin vakaaseen avainjakoon)
- Salasanojen tai hashien tallennus palvelimelle
- Palvelinpuolen lähetys (email API) — pidetään staattisena

---

## Related artifacts

- `index.html` — UI + Web Crypto
- `robots.txt` — `Disallow: /`
- `vercel.json` — turvaotsikot
- Skill: `private-circle-page` (encrypt + loader)
- Live: https://circle-enroll.vercel.app/

---

## Notes

Tämä ADR kuvaa enroll-työkalun päätökset. Porttisivun salaus (AES-GCM, share1/share2, maskit) dokumentoidaan erikseen gated-projektin ADR:ssä.
---
