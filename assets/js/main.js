// =========================================================
// UI: bouton de retour en haut
// =========================================================
// Affiche un bouton flottant des que la page est suffisamment scrollee.
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const hero = document.getElementById('top');
    if (hero && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            backToTop.classList.toggle('show', !entries[0].isIntersecting);
        }, {
            rootMargin: '-220px 0px 0px 0px',
            threshold: 0,
        });
        observer.observe(hero);
    }
}

// =========================================================
// Navigation mobile sans dependance Bootstrap JS
// =========================================================
const navbarToggle = document.querySelector('[data-bs-toggle="collapse"][data-bs-target]');
if (navbarToggle) {
    const targetSelector = navbarToggle.getAttribute('data-bs-target');
    const navbarMenu = targetSelector ? document.querySelector(targetSelector) : null;
    if (navbarMenu) {
        navbarToggle.setAttribute('aria-expanded', 'false');
        navbarToggle.addEventListener('click', () => {
            const isOpen = navbarMenu.classList.toggle('show');
            navbarToggle.setAttribute('aria-expanded', String(isOpen));
        });
        navbarMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('show');
                navbarToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// =========================================================
// Compatibilite ancres URL
// =========================================================
// Compatibilite SEO/anciens liens: redirige les ancres anglaises vers les ancres FR.
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

// =========================================================
// Animations d'entree au scroll (IntersectionObserver)
// =========================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initScrollReveal = () => {
    const revealTargets = new Set();
    const addRevealTarget = (element, delayMs = 0) => {
        if (!(element instanceof Element)) {
            return;
        }
        element.classList.add('reveal-init');
        element.style.setProperty('--reveal-delay', `${delayMs}ms`);
        revealTargets.add(element);
    };

    // Sections principales hors hero: le contenu LCP reste visible immediatement.
    document.querySelectorAll('.section-block').forEach((section) => addRevealTarget(section));
    document.querySelectorAll('.section-header').forEach((sectionHeader) => addRevealTarget(sectionHeader, 60));

    // Cartes projets avec effet stagger.
    document.querySelectorAll('.project-card').forEach((card, index) => {
        const stagger = (index % 4) * 90;
        addRevealTarget(card, stagger);
    });

    // Elements de contenu complementaires.
    document.querySelectorAll('.timeline-item, .skill-card, .contact-link').forEach((item, index) => {
        addRevealTarget(item, (index % 4) * 80);
    });

    if (revealTargets.size === 0) {
        return;
    }

    // Respect accessibilite motion-reduce et fallback si Observer indisponible.
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach((target) => target.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
    });

    revealTargets.forEach((target) => observer.observe(target));
};

initScrollReveal();

// =========================================================
// Formulaire de contact
// =========================================================
// Le formulaire envoie les données vers FormSubmit puis redirige vers une page de confirmation.
const contactForm = document.getElementById('contact-form');
const isFileProtocol = window.location.protocol === 'file:';
if (contactForm) {
    const nextUrlInput = document.getElementById('contact-next-url');
    if (nextUrlInput && !isFileProtocol) {
        const nextUrl = new URL('message-envoye/', window.location.href);
        nextUrlInput.value = nextUrl.toString();
    }

    contactForm.addEventListener('submit', (event) => {
        const honeyPot = contactForm.querySelector('input[name="_honey"]');
        if (honeyPot && honeyPot.value.trim() !== '') {
            event.preventDefault();
            return;
        }

        if (!contactForm.checkValidity()) {
            event.preventDefault();
            contactForm.reportValidity();
            return;
        }

        // FormSubmit ne fonctionne pas en ouvrant index.html directement (file://).
        // Dans ce cas, on bascule automatiquement sur un mailto pour eviter la page d'erreur.
        if (isFileProtocol) {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const message = String(formData.get('message') || '').trim();

            const subject = encodeURIComponent(`Contact portfolio - ${name}`);
            const body = encodeURIComponent(
                `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            window.location.href = `mailto:teo.champeval@gmail.com?subject=${subject}&body=${body}`;
        }
    });
}

// Hygiene de saisie: supprime les chiffres dans le champ nom (saisie + collage).
const contactNameInput = document.getElementById('contact-name');
if (contactNameInput) {
    contactNameInput.addEventListener('input', () => {
        const sanitizedValue = contactNameInput.value.replace(/[0-9]/g, '');
        if (sanitizedValue !== contactNameInput.value) {
            contactNameInput.value = sanitizedValue;
        }
    });
}

// =========================================================
// Notice d'information cookies (RGPD/CNIL)
// =========================================================
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
const hasExternalResources = () => {
    const selectors = 'script[src], link[href]';
    const resources = document.querySelectorAll(selectors);
    for (const resource of resources) {
        if (resource.tagName === 'LINK') {
            const rel = (resource.getAttribute('rel') || '').toLowerCase();
            const isLoadedResource = /\b(stylesheet|preload|modulepreload|preconnect|dns-prefetch|icon)\b/.test(rel);
            if (!isLoadedResource) {
                continue;
            }
        }

        const source = resource.getAttribute('src') || resource.getAttribute('href');
        if (!source) {
            continue;
        }
        try {
            const url = new URL(source, window.location.href);
            const isHttp = url.protocol === 'http:' || url.protocol === 'https:';
            if (isHttp && url.origin !== window.location.origin) {
                return true;
            }
        } catch (error) {
            // Ignore les URL invalides.
        }
    }
    return false;
};
const resolveSiteUrl = (targetFile) => {
    const mainScript = document.querySelector('script[src$="main.js"], script[src*="main.js?"]');
    const baseUrl = mainScript?.src ? new URL('../../', mainScript.src) : new URL('.', window.location.href);
    return new URL(targetFile, baseUrl).toString();
};
const createCookieNotice = () => {
    const privacyUrl = resolveSiteUrl('legal/politique-confidentialite/');
    const legalUrl = resolveSiteUrl('legal/mentions-legales/');
    const notice = document.createElement('aside');
    notice.className = 'cookie-notice';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.innerHTML = `
        <p class="cookie-notice-text mb-2 mb-md-0">
            Ce site charge des ressources externes (CDN/polices), qui peuvent traiter des données techniques comme l'adresse IP.
            <a href="${privacyUrl}">Politique de confidentialité</a>.
        </p>
        <div class="cookie-notice-actions">
            <a class="btn btn-outline-light btn-sm" href="${legalUrl}">Mentions légales</a>
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
if (hasExternalResources() && !hasAcknowledgedCookieNotice()) {
    createCookieNotice();
}

// =========================================================
// Theme force (sombre)
// =========================================================
// Theme unique: sombre uniquement.
document.body.classList.add('theme-dark');
document.body.classList.remove('theme-light');

