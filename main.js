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

// Formulaire de contact: envoi via client email local.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();

        const subject = encodeURIComponent(`Contact portfolio - ${name}`);
        const body = encodeURIComponent(
            `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:teo.champeval@gmail.com?subject=${subject}&body=${body}`;
    });
}

// Champ "nom": retire les chiffres en saisie et en collage.
const contactNameInput = document.getElementById('contact-name');
if (contactNameInput) {
    contactNameInput.addEventListener('input', () => {
        const sanitizedValue = contactNameInput.value.replace(/[0-9]/g, '');
        if (sanitizedValue !== contactNameInput.value) {
            contactNameInput.value = sanitizedValue;
        }
    });
}

// Notice cookies informative (pas de traceurs publicitaires).
const cookieNoticeKey = 'portfolio_cookie_notice_ack';
const hasAcknowledgedCookieNotice = () => {
    try {
        return window.localStorage.getItem(cookieNoticeKey) === '1';
    } catch (error) {
        return false;
    }
};
const setCookieNoticeAcknowledged = () => {
    try {
        window.localStorage.setItem(cookieNoticeKey, '1');
    } catch (error) {
        // Ignore les navigateurs qui bloquent le stockage local.
    }
};
const createCookieNotice = () => {
    const notice = document.createElement('aside');
    notice.className = 'cookie-notice';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.innerHTML = `
        <p class="cookie-notice-text mb-2 mb-md-0">
            Ce site n'utilise pas de cookies publicitaires. Une preference locale peut etre enregistree pour memoriser la fermeture de ce message.
            <a href="/politique-confidentialite/">Politique de confidentialite</a>.
        </p>
        <div class="cookie-notice-actions">
            <a class="btn btn-outline-light btn-sm" href="/mentions-legales/">Mentions legales</a>
            <button type="button" class="btn btn-primary btn-sm" data-cookie-notice-close>J'ai compris</button>
        </div>
    `;
    document.body.appendChild(notice);
    requestAnimationFrame(() => notice.classList.add('show'));

    const closeButton = notice.querySelector('[data-cookie-notice-close]');
    closeButton?.addEventListener('click', () => {
        setCookieNoticeAcknowledged();
        notice.classList.remove('show');
        window.setTimeout(() => notice.remove(), 240);
    });
};
if (!hasAcknowledgedCookieNotice()) {
    createCookieNotice();
}

// Theme unique: sombre uniquement.
document.body.classList.add('theme-dark');
document.body.classList.remove('theme-light');
