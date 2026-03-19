// Bouton "Retour en haut"
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    const toggleBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 220);
    window.addEventListener('scroll', toggleBackToTop);
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleBackToTop();
}

// Compatibilite: anciens hashes anglais -> ancres francaises.
const hashMap = {
    '#about': '#a-propos',
    '#journey': '#parcours',
    '#projects': '#projets',
    '#skills': '#competences',
};
const mappedHash = hashMap[window.location.hash];
if (mappedHash) {
    history.replaceState(null, '', mappedHash);
    document.querySelector(mappedHash)?.scrollIntoView();
}

// Theme unique: sombre uniquement.
document.body.classList.add('theme-dark');
document.body.classList.remove('theme-light');
