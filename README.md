# Portfolio

Site portfolio statique (HTML, CSS, JS).

## Prerequis

- Un navigateur web (Chrome, Edge, Firefox, etc.)
- Optionnel: Python 3 pour lancer un serveur local
- Optionnel: Node.js (pour `npx serve`)

## Lancer le portfolio

### Option 1 (rapide)

1. Ouvre le dossier du projet.
2. Double-clique sur `index.html`.

### Option 2 (recommandee: serveur local)

Dans PowerShell, depuis le dossier du projet:

```powershell
npx serve .
```

Puis ouvre:

`http://localhost:3000`

Pour arreter le serveur: `Ctrl + C`

### Option 3 (alternative avec Python)

Dans PowerShell, depuis le dossier du projet:

```powershell
python -m http.server 5500
```

Puis ouvre:

`http://localhost:5500`

Pour arreter le serveur: `Ctrl + C`

## Structure du projet

- `index.html`: page principale
- `projet1/index.html`, `projet2/index.html`, `projet3/index.html`: pages de details projets
- `style.css`: styles globaux
- `main.js`: interactions (theme, retour en haut)
- `images/`: logos et images
- `downloads/cv.pdf`: CV telechargeable

## Depots GitHub

- TPFormula1: `https://github.com/blou132/projet_bts1.git`
- JMI 56: `https://github.com/blou132/projet_bts2.git`
- Cours: `https://github.com/blou132/cour.git`

## Notes

- URLs propres activees:
  - `http://localhost:3000/projet1/`
  - `http://localhost:3000/projet2/`
  - `http://localhost:3000/projet3/`
- Le formulaire de contact dans `index.html` utilise Formspree.
- Pense a remplacer `https://formspree.io/f/your_id` par ton vrai identifiant Formspree.

## Securite

- Hardening applique sur toutes les pages HTML:
  - CSP (`Content-Security-Policy`) via meta
  - `Referrer-Policy` via meta
  - Bootstrap CDN epingle avec `integrity` + `crossorigin`
  - Liens externes en `rel="noopener noreferrer"`
- Protection anti-spam basique ajoutee au formulaire (`_gotcha`) + limites de longueur sur les champs.
- Fichier d'en-tetes pour hebergement statique: `_headers` (Netlify compatible), avec:
  - CSP serveur
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy`
  - `Referrer-Policy`
  - `Strict-Transport-Security`

## Verification rapide

1. Lance `npx serve .`
2. Ouvre `http://localhost:3000`
3. Verifie que les pages projets, le theme et les icones Bootstrap fonctionnent
4. Ouvre la console navigateur: pas d'erreur CSP
