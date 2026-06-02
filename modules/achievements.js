// ============================================================
// Achievements Module
// Gamification layer with achievement badges.
// Tracks user actions and awards achievements via toasts.
// Persists state to localStorage.
// ============================================================

const Achievements = (() => {
    const STORAGE_KEY = 'portfolio_achievements';
    let badgeCounter = null;

    const ACHIEVEMENT_DEFS = {
        explorer: {
            name: 'Explorer',
            icon: '🏠',
            description: 'Visited all sections of the portfolio',
            check: null // manual
        },
        themeSwitcher: {
            name: 'Theme Switcher',
            icon: '🌓',
            description: 'Toggled the theme for the first time',
            check: null
        },
        communicator: {
            name: 'Communicator',
            icon: '💬',
            description: 'Submitted the contact form',
            check: null
        },
        filterMaster: {
            name: 'Filter Master',
            icon: '🔍',
            description: 'Used all project filters',
            check: null
        },
        powerUser: {
            name: 'Power User',
            icon: '🎮',
            description: 'Used the command terminal',
            check: null
        },
        storyteller: {
            name: 'Storyteller',
            icon: '📜',
            description: 'Read the full About section',
            check: null
        },
        easterHunter: {
            name: 'Easter Egg Hunter',
            icon: '🥚',
            description: 'Found a hidden easter egg',
            check: null
        },
        completionist: {
            name: 'Completionist',
            icon: '🏆',
            description: 'Unlocked all other achievements',
            check: null
        }
    };

    // Track state for multi-step achievements
    let sectionsVisited = new Set();
    let filtersUsed = new Set();
    const allSections = ['home', 'skills', 'projects', 'about', 'contact'];
    const allFilters = ['all', 'javascript', 'react', 'ui-ux'];

    function init() {
        createBadgeCounter();
        setupListeners();
        updateBadgeCounter();

        // Check sections on scroll
        setupSectionTracking();
    }

    function getUnlockedIds() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function saveUnlockedIds(ids) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch {}
    }

    function unlock(id) {
        const unlocked = getUnlockedIds();
        if (unlocked.includes(id)) return; // Already unlocked

        const def = ACHIEVEMENT_DEFS[id];
        if (!def) return;

        unlocked.push(id);
        saveUnlockedIds(unlocked);

        // Show toast notification
        ToastSystem.achievement(`${def.icon} ${def.name} — ${def.description}`);

        // Update badge counter
        updateBadgeCounter();

        // Check if all non-completionist achievements are unlocked
        const nonCompletionist = Object.keys(ACHIEVEMENT_DEFS).filter(k => k !== 'completionist');
        if (nonCompletionist.every(k => unlocked.includes(k))) {
            setTimeout(() => unlock('completionist'), 1500);
        }

        document.dispatchEvent(new CustomEvent('portfolio:achievement-unlocked', {
            detail: { id, ...def }
        }));
    }

    function createBadgeCounter() {
        badgeCounter = document.getElementById('achievement-badge');
        if (!badgeCounter) {
            // Create and insert into nav
            badgeCounter = document.createElement('div');
            badgeCounter.id = 'achievement-badge';
            badgeCounter.className = 'achievement-badge';
            badgeCounter.title = 'Achievements unlocked';
            badgeCounter.innerHTML = `
                <i class="ri-trophy-line"></i>
                <span class="achievement-badge__count">0</span>
            `;

            // Click to show achievements list
            badgeCounter.addEventListener('click', showAchievementsSummary);

            const navRight = document.querySelector('.nav-right');
            if (navRight) {
                navRight.insertBefore(badgeCounter, navRight.firstChild);
            }
        }
    }

    function updateBadgeCounter() {
        const count = getUnlockedIds().length;
        const countEl = badgeCounter?.querySelector('.achievement-badge__count');
        if (countEl) {
            countEl.textContent = count;
            if (count > 0) {
                badgeCounter.classList.add('has-achievements');
            }
        }
    }

    function showAchievementsSummary() {
        const unlocked = getUnlockedIds();
        const total = Object.keys(ACHIEVEMENT_DEFS).length;

        let message = `Achievements: ${unlocked.length}/${total}\n\n`;
        for (const [id, def] of Object.entries(ACHIEVEMENT_DEFS)) {
            const status = unlocked.includes(id) ? '✅' : '🔒';
            message += `${status} ${def.icon} ${def.name}\n`;
        }

        // Show as a toast with all achievements
        ToastSystem.info(
            `${unlocked.length}/${total} achievements unlocked. Open terminal and type "achievements" for details!`,
            { icon: 'ri-trophy-line', title: '🏆 Achievements', duration: 5000 }
        );
    }

    function setupListeners() {
        // Theme change → Theme Switcher
        document.addEventListener('portfolio:theme-change', () => unlock('themeSwitcher'));

        // Also listen for the existing theme toggle click
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                setTimeout(() => unlock('themeSwitcher'), 100);
            });
        }

        // Terminal opened → Power User
        document.addEventListener('portfolio:terminal-opened', () => unlock('powerUser'));

        // Easter egg found → Easter Egg Hunter
        document.addEventListener('portfolio:easter-egg', () => unlock('easterHunter'));

        // Contact form submitted → Communicator
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                setTimeout(() => unlock('communicator'), 1000);
            });
        }

        // Project filter used → track for Filter Master
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                filtersUsed.add(filter);
                if (allFilters.every(f => filtersUsed.has(f))) {
                    unlock('filterMaster');
                }
            });
        });

        // Also listen for terminal filter command
        document.addEventListener('portfolio:filter-used', (e) => {
            filtersUsed.add(e.detail.filter);
            if (allFilters.every(f => filtersUsed.has(f))) {
                unlock('filterMaster');
            }
        });
    }

    function setupSectionTracking() {
        const sectionEls = allSections.map(id => document.getElementById(id)).filter(Boolean);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sectionsVisited.add(entry.target.id);

                    // Storyteller: spent time on about
                    if (entry.target.id === 'about') {
                        setTimeout(() => {
                            // Check if still visible
                            const rect = entry.target.getBoundingClientRect();
                            if (rect.top < window.innerHeight && rect.bottom > 0) {
                                unlock('storyteller');
                            }
                        }, 8000);
                    }

                    // Explorer: all sections visited
                    if (allSections.every(s => sectionsVisited.has(s))) {
                        unlock('explorer');
                    }

                    document.dispatchEvent(new CustomEvent('portfolio:section-visit', {
                        detail: { section: entry.target.id }
                    }));
                }
            });
        }, { threshold: 0.3 });

        sectionEls.forEach(el => observer.observe(el));
    }

    // Public API
    function getUnlocked() {
        const ids = getUnlockedIds();
        return ids.map(id => ACHIEVEMENT_DEFS[id]).filter(Boolean);
    }

    function getTotal() {
        return Object.keys(ACHIEVEMENT_DEFS).length;
    }

    return { init, unlock, getUnlocked, getUnlockedIds, getTotal };
})();

window.Achievements = Achievements;
