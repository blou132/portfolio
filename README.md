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
- `projet1.html`, `projet2.html`, `projet3.html`: pages de details projets
- `style.css`: styles globaux
- `main.js`: interactions (theme, retour en haut)
- `images/`: logos et images
- `downloads/cv.pdf`: CV telechargeable

## Notes

- Le formulaire de contact dans `index.html` utilise Formspree.
- Pense a remplacer `https://formspree.io/f/your_id` par ton vrai identifiant Formspree.
