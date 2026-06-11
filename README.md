# Portfolio

Site portfolio statique en HTML, CSS et JavaScript pour un profil BTS SIO.

## Prérequis

- Un navigateur web récent.
- Optionnel : Node.js pour lancer `npx serve`.
- Optionnel : Python 3 pour lancer `python -m http.server`.

## Lancer le portfolio

### Serveur local recommandé

Depuis le dossier du projet :

```powershell
npx serve .
```

Puis ouvrir :

`http://localhost:3000`

### Alternative avec Python

Depuis le dossier du projet :

```powershell
python -m http.server 5500
```

Puis ouvrir :

`http://localhost:5500`

## Architecture

- `index.html` : page d'accueil du portfolio.
- `assets/css/style.css` : styles globaux du site.
- `assets/js/main.js` : interactions JavaScript du site.
- `images/` : images utilisées par les pages.
- `downloads/cv.pdf` : CV téléchargeable.
- `projets/tpformula1/index.html` : page du projet TPFormula1.
- `projets/site-artisan/index.html` : page du projet site artisan.
- `legal/mentions-legales/index.html` : mentions légales.
- `legal/politique-confidentialite/index.html` : politique de confidentialité.
- `message-envoye/index.html` : page technique de confirmation après envoi du formulaire.
- `robots.txt` : règles d'exploration.
- `sitemap.xml` : URL indexables.

## Routes actives

- `/`
- `/projets/tpformula1/`
- `/projets/site-artisan/`
- `/legal/mentions-legales/`
- `/legal/politique-confidentialite/`

La route `/message-envoye/` existe pour la confirmation du formulaire, mais elle n'est pas incluse dans le sitemap.

## Formulaire de contact

- Le formulaire envoie les messages via FormSubmit.
- Après une soumission réussie, l'utilisateur est redirigé vers `/message-envoye/`.
- Si le site est ouvert en `file://`, le script bascule vers `mailto:` pour éviter une erreur liée à l'envoi externe.

## Sécurité

- Les pages HTML définissent une CSP via balise `meta`.
- Le site utilise des styles et scripts locaux pour son affichage.
- Les liens externes doivent rester protégés avec `rel="noopener noreferrer"`.

## Dépôts GitHub liés

- TPFormula1 : `https://github.com/blou132/projet_bts1.git`
- Projet 2 : `https://github.com/blou132/projet_bts2.git`
- JEUX : `https://github.com/blou132/JEUX`

## Vérification rapide

1. Lancer `npx serve .`.
2. Ouvrir `http://localhost:3000`.
3. Vérifier les routes actives listées dans ce README.
4. Vérifier la console navigateur : aucune erreur CSP ou ressource manquante.
