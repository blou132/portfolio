// =========================================================
// UI: bouton de retour en haut
// =========================================================
// Affiche un bouton flottant des que la page est suffisamment scrollee.
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    const toggleBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 220);
    window.addEventListener('scroll', toggleBackToTop);
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleBackToTop();
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
// Formulaire de contact
// =========================================================
// Le formulaire envoie les donnees vers FormSubmit puis redirige vers la section contact.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const nextUrlInput = document.getElementById('contact-next-url');
    if (nextUrlInput) {
        const nextUrl = new URL(window.location.href);
        nextUrl.hash = 'contact';
        nextUrlInput.value = nextUrl.toString();
    }

    contactForm.addEventListener('submit', (event) => {
        const honeyPot = contactForm.querySelector('input[name="_honey"]');
        if (honeyPot && honeyPot.value.trim() !== '') {
            event.preventDefault();
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
const createCookieNotice = () => {
    const notice = document.createElement('aside');
    notice.className = 'cookie-notice';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.innerHTML = `
        <p class="cookie-notice-text mb-2 mb-md-0">
            Ce site n'utilise pas de cookies publicitaires. Une préférence locale peut être enregistrée pour mémoriser la fermeture de ce message.
            <a href="/politique-confidentialite/">Politique de confidentialité</a>.
        </p>
        <div class="cookie-notice-actions">
            <a class="btn btn-outline-light btn-sm" href="/mentions-legales/">Mentions légales</a>
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

// =========================================================
// Effet visuel: etoiles filantes suiveuses de souris
// =========================================================
// Trainee "etoiles filantes" liée au mouvement de la souris (desktop uniquement).
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
const supportsHover = window.matchMedia('(hover: hover)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (supportsFinePointer && supportsHover && !prefersReducedMotion) {
    const starLayer = document.createElement('div');
    starLayer.className = 'mouse-star-layer';
    starLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(starLayer);

    const maxStars = 16;
    let hasPreviousPointer = false;
    let previousX = 0;
    let previousY = 0;
    let previousTime = 0;
    let lastSpawnTime = 0;

    // Genere une particule orientée selon le mouvement courant de la souris.
    const spawnStar = (x, y, vectorX, vectorY, speedFactor, isInteractiveZone) => {
        const norm = Math.hypot(vectorX, vectorY) || 1;
        const directionX = vectorX / norm;
        const directionY = vectorY / norm;
        const jitter = (Math.random() * 0.18) - 0.09;
        const travel = Math.min(90, 24 + (speedFactor * 9));
        const duration = Math.max(300, 560 - (speedFactor * 34));
        const starSize = Math.max(1.6, Math.min(2.8, 1.5 + (speedFactor * 0.24)));
        const trailLength = Math.min(42, 14 + (speedFactor * 4));
        const moveX = (directionX + jitter) * travel;
        const moveY = (directionY - jitter) * travel;
        const angle = Math.atan2(moveY, moveX) * (180 / Math.PI);

        const star = document.createElement('span');
        star.className = 'mouse-star';
        if (isInteractiveZone) {
            star.classList.add('soft');
        }

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.setProperty('--star-size', `${starSize.toFixed(2)}px`);
        star.style.setProperty('--trail-length', `${trailLength.toFixed(2)}px`);
        star.style.setProperty('--shoot-x', `${moveX.toFixed(2)}px`);
        star.style.setProperty('--shoot-y', `${moveY.toFixed(2)}px`);
        star.style.setProperty('--shoot-rotate', `${angle.toFixed(2)}deg`);
        star.style.setProperty('--star-duration', `${duration.toFixed(0)}ms`);

        starLayer.appendChild(star);
        // Evite de saturer le DOM si la souris bouge tres vite.
        while (starLayer.childElementCount > maxStars) {
            starLayer.firstElementChild?.remove();
        }

        star.addEventListener('animationend', () => {
            star.remove();
        }, { once: true });
    };

    window.addEventListener('pointermove', (event) => {
        const now = performance.now();

        if (!hasPreviousPointer) {
            hasPreviousPointer = true;
            previousX = event.clientX;
            previousY = event.clientY;
            previousTime = now;
            return;
        }

        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;
        const deltaTime = Math.max(16, now - previousTime);
        const distance = Math.hypot(deltaX, deltaY);
        const speedFactor = Math.min(6, distance / (deltaTime / 16.67));

        // Debounce: limite la frequence de creation pour garder un effet fluide.
        const canSpawn = distance >= 3.5 && (now - lastSpawnTime) >= 26;
        if (canSpawn) {
            const isInteractiveZone = event.target instanceof Element &&
                event.target.closest('a, button, input, textarea, select, label');
            spawnStar(event.clientX, event.clientY, deltaX, deltaY, speedFactor, Boolean(isInteractiveZone));
            lastSpawnTime = now;
        }

        previousX = event.clientX;
        previousY = event.clientY;
        previousTime = now;
    });

    window.addEventListener('pointerleave', () => {
        hasPreviousPointer = false;
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            hasPreviousPointer = false;
        }
    });
}

// =========================================================
// Theme force (sombre)
// =========================================================
// Theme unique: sombre uniquement.
document.body.classList.add('theme-dark');
document.body.classList.remove('theme-light');
