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
// Projets: synchronisation automatique depuis GitHub
// =========================================================
const githubProjectsGrid = document.querySelector('[data-github-projects-grid]');
const githubProjectsStatus = document.getElementById('github-projects-status');
if (githubProjectsGrid && githubProjectsStatus) {
    const githubConfig = Object.freeze({
        username: 'blou132',
        maxRepos: 9,
        featuredRepos: ['tp-final', 'projet_bts2', 'projet_bts1', 'cour'],
    });

    const repoOverrides = Object.freeze({
        projet_bts1: {
            title: 'TPFormula1 - Gestion F1',
            category: 'PHP / MySQL',
            status: 'Projet solo',
            description: 'Cette application PHP MVC permet de gerer les Grands Prix, les ecuries et les pilotes avec authentification et tableau de bord.',
            tags: ['MVC leger', 'CRUD', 'Auth'],
            localUrl: 'projet-tpformula1/',
            demoUrl: 'https://projet-bts1.teo-infra.fr/',
        },
        projet_bts2: {
            title: 'Projet 2 - Site d artisan',
            category: 'Laravel 12',
            status: 'Projet solo',
            description: 'Ce site responsive pour artisan integre un formulaire de contact, un espace admin et une carte Google Maps.',
            tags: ['Laravel', 'MySQL', 'Admin'],
            localUrl: 'projet2/',
            demoUrl: 'https://projet-bts2.teo-infra.fr/',
        },
        cour: {
            title: 'Exercices Java POO',
            category: 'Java',
            status: 'Travaux pratiques',
            description: 'Cette serie d exercices applique l heritage, l abstraction et le polymorphisme sur des cas concrets.',
            tags: ['POO', 'Heritage', 'Polymorphisme'],
            localUrl: 'projet-java-poo/',
        },
        'tp-final': {
            title: 'TP Final BTS - Tickets et paiements',
            category: 'Laravel 13 / Vue 3',
            status: 'Projet final BTS',
            description: 'Projet complet Laravel et Vue pour gerer des tickets et des paiements, avec roles, API securisee et conteneurisation Docker.',
            tags: ['Laravel 13', 'Vue 3', 'Docker'],
            demoUrl: 'https://tp-final.teo-infra.fr/',
            readmeUrl: 'https://github.com/blou132/tp-final#readme',
        },
    });

    const fallbackRepos = [
        {
            name: 'tp-final',
            html_url: 'https://github.com/blou132/tp-final',
            description: 'Le depot TP final est synchronise automatiquement depuis GitHub.',
            language: 'Laravel / PHP',
            updated_at: new Date().toISOString(),
            homepage: '',
            topics: ['Laravel', 'Vue', 'Docker'],
        },
    ];

    const formatDateFr = (isoDate) => {
        if (!isoDate) {
            return 'date inconnue';
        }
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) {
            return 'date inconnue';
        }
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const prettifyRepoName = (repoName) => repoName
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const toSentence = (text, fallbackText) => {
        const normalized = String(text || '').trim();
        if (!normalized) {
            return fallbackText;
        }
        return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
    };

    const createProjectButton = (href, label, type) => {
        const button = document.createElement('a');
        button.href = href;
        button.textContent = label;
        button.className = type === 'primary'
            ? 'btn btn-primary w-100'
            : 'btn btn-outline-light w-100';

        const isExternal = /^https?:\/\//i.test(href);
        if (isExternal) {
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
        }

        return button;
    };

    const createProjectCard = (repo) => {
        const override = repoOverrides[repo.name] || null;
        const category = override?.category || repo.language || 'Depot GitHub';
        const status = override?.status || `Mise a jour le ${formatDateFr(repo.updated_at)}`;
        const title = override?.title || prettifyRepoName(repo.name);
        const description = toSentence(
            override?.description || repo.description,
            'Ce depot GitHub est synchronise automatiquement pour afficher les dernieres mises a jour du projet.'
        );
        const homepage = override?.demoUrl || String(repo.homepage || '').trim();
        const readmeUrl = override?.readmeUrl || `${repo.html_url}#readme`;
        const repoTopics = Array.isArray(repo.topics) ? repo.topics.filter(Boolean) : [];
        const tags = Array.isArray(override?.tags) && override.tags.length > 0
            ? override.tags
            : (repoTopics.length > 0
                ? repoTopics.slice(0, 3)
                : [repo.language || 'Code', `Maj ${formatDateFr(repo.updated_at)}`]);

        const column = document.createElement('div');
        column.className = 'col-md-6 col-lg-4';

        const card = document.createElement('article');
        card.className = 'project-card glass-card h-100';

        const head = document.createElement('div');
        head.className = 'd-flex justify-content-between align-items-center mb-2';

        const badge = document.createElement('span');
        badge.className = 'badge rounded-pill text-bg-dark';
        badge.textContent = category;

        const statusTag = document.createElement('span');
        statusTag.className = 'project-status';
        statusTag.textContent = status;

        head.appendChild(badge);
        head.appendChild(statusTag);

        const titleNode = document.createElement('h5');
        titleNode.textContent = title;

        const descNode = document.createElement('p');
        descNode.textContent = description;

        const tagsNode = document.createElement('div');
        tagsNode.className = 'tags mb-3';
        tags.slice(0, 3).forEach((tagLabel) => {
            const chip = document.createElement('span');
            chip.textContent = String(tagLabel);
            tagsNode.appendChild(chip);
        });

        const actions = document.createElement('div');
        actions.className = 'd-grid gap-2';

        if (override?.localUrl) {
            actions.appendChild(createProjectButton(override.localUrl, 'Voir le projet', 'primary'));
        }
        if (homepage) {
            actions.appendChild(createProjectButton(homepage, 'Voir en ligne', 'secondary'));
        }

        const githubButtonType = override?.localUrl ? 'secondary' : 'primary';
        actions.appendChild(createProjectButton(repo.html_url, 'Depot GitHub', githubButtonType));
        if (!override?.localUrl && !homepage) {
            actions.appendChild(createProjectButton(readmeUrl, 'Voir le README', 'secondary'));
        }

        card.appendChild(head);
        card.appendChild(titleNode);
        card.appendChild(descNode);
        card.appendChild(tagsNode);
        card.appendChild(actions);
        column.appendChild(card);

        return column;
    };

    const setGithubStatus = (text, isError = false) => {
        githubProjectsStatus.textContent = text;
        githubProjectsStatus.classList.toggle('is-error', isError);
    };

    const renderProjectCards = (repos) => {
        githubProjectsGrid.innerHTML = '';
        repos.forEach((repo) => {
            githubProjectsGrid.appendChild(createProjectCard(repo));
        });
    };

    const prioritizeRepos = (repos) => {
        const repoByName = new Map();
        repos.forEach((repo) => {
            repoByName.set(repo.name.toLowerCase(), repo);
        });

        const prioritized = [];
        githubConfig.featuredRepos.forEach((featuredName) => {
            const key = featuredName.toLowerCase();
            const repo = repoByName.get(key);
            if (repo) {
                prioritized.push(repo);
                repoByName.delete(key);
            }
        });

        const remaining = [...repoByName.values()].sort((left, right) => {
            const leftTime = new Date(left.updated_at || 0).getTime();
            const rightTime = new Date(right.updated_at || 0).getTime();
            return rightTime - leftTime;
        });

        return [...prioritized, ...remaining].slice(0, githubConfig.maxRepos);
    };

    const fetchGitHubRepos = async () => {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 9000);
        const apiUrl = `https://api.github.com/users/${githubConfig.username}/repos?per_page=100&sort=updated&direction=desc`;

        try {
            const response = await fetch(apiUrl, {
                signal: controller.signal,
                headers: {
                    Accept: 'application/vnd.github+json',
                },
            });

            if (!response.ok) {
                throw new Error(`GitHub API ${response.status}`);
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('Format de reponse GitHub inattendu');
            }

            return data;
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const syncGithubProjects = async () => {
        setGithubStatus('Chargement des depots GitHub...');
        try {
            const repos = await fetchGitHubRepos();
            const visibleRepos = repos.filter((repo) => (
                repo
                && typeof repo.name === 'string'
                && typeof repo.html_url === 'string'
                && repo.fork !== true
                && repo.archived !== true
            ));

            const selectedRepos = prioritizeRepos(visibleRepos);
            if (selectedRepos.length === 0) {
                renderProjectCards(fallbackRepos);
                setGithubStatus('Aucun depot public trouve. Affichage du fallback local.', true);
                return;
            }

            renderProjectCards(selectedRepos);
            setGithubStatus(`${selectedRepos.length} depots synchronises automatiquement depuis GitHub.`);
        } catch (error) {
            renderProjectCards(fallbackRepos);
            setGithubStatus('GitHub indisponible pour le moment. Affichage d un fallback local.', true);
        }
    };

    syncGithubProjects();
}

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
    const baseUrl = mainScript?.src ? new URL('.', mainScript.src) : new URL('.', window.location.href);
    return new URL(targetFile, baseUrl).toString();
};
const createCookieNotice = () => {
    const privacyUrl = resolveSiteUrl('politique-confidentialite.html');
    const legalUrl = resolveSiteUrl('mentions-legales.html');
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

