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

// Theme clair/sombre
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = toggleBtn?.querySelector('i');
const themeKey = 'preferred-theme';

const setTheme = (mode) => {
    const isDark = mode === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    document.body.classList.toggle('theme-light', !isDark);
    if (themeIcon) themeIcon.className = isDark ? 'bi bi-sun' : 'bi bi-moon';
    toggleBtn?.setAttribute('aria-pressed', String(isDark));
};

const savedTheme = localStorage.getItem(themeKey);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

toggleBtn?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(themeKey, nextTheme);
});
