// ============================================================
// Keyboard Shortcuts Module
// Global keyboard navigation and a help modal.
// ============================================================

const KeyboardShortcuts = (() => {
    let modalElement = null;
    let isModalOpen = false;

    const shortcuts = [
        { key: '1', description: 'Go to Home', section: '#home' },
        { key: '2', description: 'Go to Skills', section: '#skills' },
        { key: '3', description: 'Go to Projects', section: '#projects' },
        { key: '4', description: 'Go to About', section: '#about' },
        { key: '5', description: 'Go to Contact', section: '#contact' },
        { key: 'T', description: 'Toggle theme', action: 'theme' },
        { key: 'M', description: 'Toggle menu', action: 'menu' },
        { key: '`', description: 'Open command terminal', action: 'terminal' },
        { key: '?', description: 'Show this help', action: 'help' },
        { key: 'Esc', description: 'Close any overlay', action: 'close' },
        { key: '↑', description: 'Previous section', action: 'prev-section' },
        { key: '↓', description: 'Next section', action: 'next-section' }
    ];

    const sectionOrder = ['#home', '#skills', '#projects', '#about', '#contact'];
    let currentSectionIndex = 0;

    function init() {
        modalElement = document.getElementById('shortcuts-modal');
        if (!modalElement) createModal();
        bindKeys();

        // Track current section via scroll
        window.addEventListener('scroll', updateCurrentSection, { passive: true });
    }

    function createModal() {
        modalElement = document.createElement('div');
        modalElement.id = 'shortcuts-modal';
        modalElement.className = 'shortcuts-modal';
        modalElement.innerHTML = `
            <div class="shortcuts-modal__backdrop"></div>
            <div class="shortcuts-modal__content">
                <div class="shortcuts-modal__header">
                    <h3><i class="ri-keyboard-line"></i> Keyboard Shortcuts</h3>
                    <button class="shortcuts-modal__close" aria-label="Close">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                <div class="shortcuts-modal__body">
                    <div class="shortcuts-modal__grid">
                        ${shortcuts.map(s => `
                            <div class="shortcut-item">
                                <kbd>${s.key}</kbd>
                                <span>${s.description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalElement);

        // Close handlers
        modalElement.querySelector('.shortcuts-modal__backdrop').addEventListener('click', closeModal);
        modalElement.querySelector('.shortcuts-modal__close').addEventListener('click', closeModal);
    }

    function bindKeys() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            const tag = e.target.tagName.toLowerCase();
            const isTerminalOpen = document.querySelector('.command-terminal.active');

            if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
            if (isTerminalOpen && e.key !== 'Escape') return;

            // Number keys: navigate sections
            if (['1', '2', '3', '4', '5'].includes(e.key)) {
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                navigateToSection(sectionOrder[index]);
                return;
            }

            switch (e.key.toLowerCase()) {
                case 't':
                    e.preventDefault();
                    toggleTheme();
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMenu();
                    break;
                case '`':
                    e.preventDefault();
                    document.dispatchEvent(new CustomEvent('portfolio:toggle-terminal'));
                    break;
                case '?':
                    e.preventDefault();
                    toggleModal();
                    break;
                case 'escape':
                    closeAll();
                    break;
                case 'arrowup':
                    if (e.altKey) {
                        e.preventDefault();
                        navigatePrevSection();
                    }
                    break;
                case 'arrowdown':
                    if (e.altKey) {
                        e.preventDefault();
                        navigateNextSection();
                    }
                    break;
            }
        });
    }

    function navigateToSection(selector) {
        const target = document.querySelector(selector);
        if (!target) return;

        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        document.dispatchEvent(new CustomEvent('portfolio:section-navigate', {
            detail: { section: selector }
        }));
    }

    function navigateNextSection() {
        if (currentSectionIndex < sectionOrder.length - 1) {
            currentSectionIndex++;
            navigateToSection(sectionOrder[currentSectionIndex]);
        }
    }

    function navigatePrevSection() {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            navigateToSection(sectionOrder[currentSectionIndex]);
        }
    }

    function updateCurrentSection() {
        const scrollPos = window.pageYOffset + window.innerHeight / 3;
        for (let i = sectionOrder.length - 1; i >= 0; i--) {
            const el = document.querySelector(sectionOrder[i]);
            if (el && el.offsetTop <= scrollPos) {
                currentSectionIndex = i;
                break;
            }
        }
    }

    function toggleTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) themeToggle.click();
    }

    function toggleMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        if (menuBtn) menuBtn.click();
    }

    function toggleModal() {
        if (isModalOpen) closeModal();
        else openModal();
    }

    function openModal() {
        if (!modalElement) createModal();
        isModalOpen = true;
        modalElement.classList.add('active');
        gsap.fromTo(modalElement.querySelector('.shortcuts-modal__content'),
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
        );
    }

    function closeModal() {
        if (!isModalOpen) return;
        isModalOpen = false;
        gsap.to(modalElement.querySelector('.shortcuts-modal__content'), {
            opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in',
            onComplete: () => modalElement.classList.remove('active')
        });
    }

    function closeAll() {
        closeModal();
        // Close menu if open
        const menuOverlay = document.querySelector('.menu-overlay.active');
        if (menuOverlay) {
            const closeBtn = document.querySelector('.close-menu');
            if (closeBtn) closeBtn.click();
        }
        // Close terminal
        document.dispatchEvent(new CustomEvent('portfolio:close-terminal'));
    }

    return { init, openModal, closeModal, navigateToSection };
})();

window.KeyboardShortcuts = KeyboardShortcuts;
