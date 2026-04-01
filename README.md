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
- `projet-tpformula1/index.html`, `projet2/index.html`, `projet-java-poo/index.html`: pages de details projets (clean URL FR)
- `projet1/index.html`, `projet3/index.html` + ancienne route du projet 2: routes conservees pour compatibilite
- `projet1.html`, `projet2.html`, `projet3.html`: redirections vers les clean URLs
- `mentions-legales.html`, `politique-confidentialite.html`: pages legales (RGPD)
- `mentions-legales/index.html`, `politique-confidentialite/index.html`: redirections de compatibilite vers les pages legales racine
- `message-envoye/index.html`: page de confirmation apres envoi du formulaire
- `style.css`: styles globaux
- `main.js`: interactions (theme, retour en haut, envoi du formulaire)
- `images/`: logos et images
- `downloads/cv.pdf`: CV telechargeable

## Depots GitHub

- TPFormula1: `https://github.com/blou132/projet_bts1.git`
- Projet 2: `https://github.com/blou132/projet_bts2.git`
- Cours: `https://github.com/blou132/cour.git`

## Notes

- URLs propres activees:
  - `http://localhost:3000/projet-tpformula1/`
  - `http://localhost:3000/projet2/`
  - `http://localhost:3000/projet-java-poo/`
  - `http://localhost:3000/message-envoye/`
- Ancres propres en francais:
  - `http://localhost:3000/#a-propos`
  - `http://localhost:3000/#parcours`
  - `http://localhost:3000/#projets`
  - `http://localhost:3000/#competences`
- Le formulaire de contact envoie les messages vers `teo.champeval@gmail.com` via FormSubmit.
- Apres soumission reussie, FormSubmit redirige vers la clean URL `message-envoye/`.
- Si la page est ouverte en `file://` (double-clic sur `index.html`), le formulaire bascule automatiquement en `mailto` pour eviter l'erreur FormSubmit.
- Les liens de footer incluent les pages `mentions-legales.html` et `politique-confidentialite.html`.

## RGPD / CNIL

- Information RGPD visible au niveau du formulaire (`index.html`) avec:
  - responsable de traitement
  - finalite
  - base legale (intérêt legitime)
  - duree de conservation
  - droits RGPD + contact
- Politique de confidentialité détaillée:
  - données traitées
  - destinataires
  - droits des personnes
  - cookies et traceurs
  - lien CNIL
- Mentions legales reliées a la politique de confidentialité.
- Les pages projets incluent aussi les liens vers les pages legales.
- Banniere d'information cookies ajoutee (memoire locale de fermeture uniquement).
- Section hébergeur structuree dans les mentions legales (bloc à compléter pour la production).

## Securite

- Hardening applique sur toutes les pages HTML:
  - CSP (`Content-Security-Policy`) via meta
  - `Referrer-Policy` via meta
  - Bootstrap CDN epingle avec `integrity` + `crossorigin`
  - Liens externes en `rel="noopener noreferrer"`
- Protection anti-spam basique ajoutee au formulaire (`_honey`) + limites de longueur sur les champs + filtre anti-chiffres sur le nom.
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

