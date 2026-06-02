// ============================================================
// Command Terminal Module
// An interactive terminal overlay toggled with backtick (`)
// Supports commands: help, about, skills, projects, contact,
// theme, resume, socials, clear, easter, whoami
// ============================================================

const CommandTerminal = (() => {
    let terminalEl = null;
    let outputEl = null;
    let inputEl = null;
    let isOpen = false;
    let history = [];
    let historyIndex = -1;

    const COMMANDS = {
        help: {
            description: 'List all available commands',
            handler: cmdHelp
        },
        about: {
            description: 'Navigate to the About section',
            handler: cmdAbout
        },
        skills: {
            description: 'Display skills as ASCII bar chart',
            handler: cmdSkills
        },
        projects: {
            description: 'Filter projects (e.g., "projects react")',
            handler: cmdProjects
        },
        contact: {
            description: 'Open the contact form',
            handler: cmdContact
        },
        theme: {
            description: 'Switch theme (e.g., "theme dark" or "theme light")',
            handler: cmdTheme
        },
        resume: {
            description: 'Download / view resume',
            handler: cmdResume
        },
        socials: {
            description: 'Show social media links',
            handler: cmdSocials
        },
        clear: {
            description: 'Clear terminal output',
            handler: cmdClear
        },
        easter: {
            description: '???',
            handler: cmdEaster
        },
        whoami: {
            description: 'Show visitor information',
            handler: cmdWhoami
        },
        achievements: {
            description: 'Show unlocked achievements',
            handler: cmdAchievements
        },
        exit: {
            description: 'Close the terminal',
            handler: cmdExit
        }
    };

    function init() {
        createTerminal();
        bindEvents();
    }

    function createTerminal() {
        terminalEl = document.createElement('div');
        terminalEl.className = 'command-terminal';
        terminalEl.innerHTML = `
            <div class="terminal__header">
                <div class="terminal__dots">
                    <span class="dot dot--red"></span>
                    <span class="dot dot--yellow"></span>
                    <span class="dot dot--green"></span>
                </div>
                <span class="terminal__title">portfolio@codewithshivank:~$</span>
                <button class="terminal__close" aria-label="Close terminal">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            <div class="terminal__body">
                <div class="terminal__output" id="terminal-output"></div>
                <div class="terminal__input-line">
                    <span class="terminal__prompt">❯</span>
                    <input type="text" class="terminal__input" id="terminal-input"
                           placeholder="Type 'help' for commands..."
                           autocomplete="off" spellcheck="false" />
                </div>
            </div>
        `;
        document.body.appendChild(terminalEl);

        outputEl = terminalEl.querySelector('#terminal-output');
        inputEl = terminalEl.querySelector('#terminal-input');

        // Close button
        terminalEl.querySelector('.terminal__close').addEventListener('click', close);
    }

    function bindEvents() {
        // Listen for toggle event from keyboard shortcuts
        document.addEventListener('portfolio:toggle-terminal', toggle);
        document.addEventListener('portfolio:close-terminal', close);

        // Input handling
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = inputEl.value.trim();
                if (input) {
                    history.push(input);
                    historyIndex = history.length;
                    processCommand(input);
                }
                inputEl.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    inputEl.value = history[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    inputEl.value = history[historyIndex];
                } else {
                    historyIndex = history.length;
                    inputEl.value = '';
                }
            } else if (e.key === 'Escape') {
                close();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                autocomplete();
            }
        });
    }

    function toggle() {
        if (isOpen) close();
        else open();
    }

    function open() {
        if (isOpen) return;
        isOpen = true;
        terminalEl.classList.add('active');

        gsap.fromTo(terminalEl,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
        );

        setTimeout(() => inputEl.focus(), 100);

        // Show welcome message on first open
        if (outputEl.children.length === 0) {
            printWelcome();
        }

        document.dispatchEvent(new CustomEvent('portfolio:terminal-opened'));
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;

        gsap.to(terminalEl, {
            opacity: 0, y: 30, scale: 0.95, duration: 0.25, ease: 'power2.in',
            onComplete: () => terminalEl.classList.remove('active')
        });
    }

    function printWelcome() {
        printLine('╔══════════════════════════════════════════╗', 'accent');
        printLine('║  Welcome to CodeWithShivank\'s Terminal   ║', 'accent');
        printLine('║  Type "help" to see available commands   ║', 'accent');
        printLine('╚══════════════════════════════════════════╝', 'accent');
        printLine('');
    }

    function processCommand(input) {
        // Echo the command
        printLine(`❯ ${input}`, 'command');

        const parts = input.toLowerCase().split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1);

        if (COMMANDS[cmd]) {
            COMMANDS[cmd].handler(args);
        } else {
            printLine(`Command not found: "${cmd}". Type "help" for available commands.`, 'error');
        }

        // Scroll to bottom
        outputEl.scrollTop = outputEl.scrollHeight;
    }

    function printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal__line ${className ? 'terminal__line--' + className : ''}`;
        line.textContent = text;
        outputEl.appendChild(line);
        outputEl.scrollTop = outputEl.scrollHeight;
    }

    function printHTML(html) {
        const line = document.createElement('div');
        line.className = 'terminal__line';
        line.innerHTML = html;
        outputEl.appendChild(line);
        outputEl.scrollTop = outputEl.scrollHeight;
    }

    function autocomplete() {
        const partial = inputEl.value.toLowerCase().trim();
        if (!partial) return;

        const matches = Object.keys(COMMANDS).filter(c => c.startsWith(partial));
        if (matches.length === 1) {
            inputEl.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            printLine(`❯ ${partial}`, 'command');
            printLine(`Suggestions: ${matches.join(', ')}`, 'info');
        }
    }

    // ---- Command Handlers ----

    function cmdHelp() {
        printLine('');
        printLine('Available commands:', 'info');
        printLine('─'.repeat(40));
        for (const [name, cmd] of Object.entries(COMMANDS)) {
            const padded = name.padEnd(15);
            printLine(`  ${padded} ${cmd.description}`);
        }
        printLine('');
        printLine('Tip: Use Tab for autocomplete, ↑/↓ for history', 'info');
    }

    function cmdAbout() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            close();
            setTimeout(() => {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
            printLine('Navigating to About section...', 'success');
        }
        document.dispatchEvent(new CustomEvent('portfolio:section-visit', { detail: { section: 'about' } }));
    }

    function cmdSkills() {
        const skillsData = [
            { name: 'HTML5 & CSS3', level: 90 },
            { name: 'JavaScript', level: 85 },
            { name: 'React JS', level: 80 },
            { name: 'Excel', level: 75 },
            { name: 'UI/UX Design', level: 70 }
        ];

        printLine('');
        printLine('📊 Skills Overview', 'info');
        printLine('─'.repeat(40));

        skillsData.forEach(skill => {
            const filled = Math.round(skill.level / 5);
            const empty = 20 - filled;
            const bar = '█'.repeat(filled) + '░'.repeat(empty);
            const padded = skill.name.padEnd(15);
            printLine(`  ${padded} ${bar} ${skill.level}%`);
        });
        printLine('');
    }

    function cmdProjects(args) {
        const filter = args[0] || 'all';
        const validFilters = ['all', 'javascript', 'react', 'ui-ux'];

        if (!validFilters.includes(filter)) {
            printLine(`Invalid filter: "${filter}". Valid filters: ${validFilters.join(', ')}`, 'error');
            return;
        }

        // Trigger the filter
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (filterBtn) {
            filterBtn.click();
            printLine(`Filtered projects: ${filter}`, 'success');

            // Close terminal and scroll to projects
            close();
            setTimeout(() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }

        document.dispatchEvent(new CustomEvent('portfolio:filter-used', { detail: { filter } }));
    }

    function cmdContact() {
        close();
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    document.getElementById('name')?.focus();
                }, 800);
            }
        }, 300);
        printLine('Opening contact form...', 'success');
    }

    function cmdTheme(args) {
        const theme = args[0];
        if (!theme || !['dark', 'light'].includes(theme)) {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            printLine(`Current theme: ${current}`, 'info');
            printLine('Usage: theme dark | theme light', 'info');
            return;
        }

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        printLine(`Theme switched to: ${theme}`, 'success');

        document.dispatchEvent(new CustomEvent('portfolio:theme-change', { detail: { theme } }));
    }

    function cmdResume() {
        printLine('📄 Resume download coming soon!', 'info');
        printLine('In the meantime, feel free to reach out via the contact form.', 'info');
    }

    function cmdSocials() {
        printLine('');
        printLine('🌐 Social Links', 'info');
        printLine('─'.repeat(40));
        printHTML('  <a href="https://x.com/codewithshivank" target="_blank" class="terminal__link">X/Twitter → @codewithshivank</a>');
        printHTML('  <a href="https://www.instagram.com/codewith_shivank/" target="_blank" class="terminal__link">Instagram → @codewith_shivank</a>');
        printHTML('  <a href="https://www.linkedin.com/in/shivank-maurya-21257a303/" target="_blank" class="terminal__link">LinkedIn → Shivank Maurya</a>');
        printHTML('  <a href="https://github.com/codewith-shivank" target="_blank" class="terminal__link">GitHub → codewith-shivank</a>');
        printHTML('  <a href="https://www.youtube.com/@CodeWithShivank12" target="_blank" class="terminal__link">YouTube → CodeWithShivank</a>');
        printLine('');
    }

    function cmdClear() {
        outputEl.innerHTML = '';
    }

    function cmdEaster() {
        printLine('🥚 You found an easter egg!', 'success');
        document.dispatchEvent(new CustomEvent('portfolio:easter-egg', { detail: { type: 'terminal' } }));
    }

    function cmdWhoami() {
        const visitor = window.VisitorContext ? VisitorContext.getVisitorData() : null;
        const now = new Date();

        printLine('');
        printLine('👤 Visitor Info', 'info');
        printLine('─'.repeat(40));
        printLine(`  Time:        ${now.toLocaleTimeString()}`);
        printLine(`  Date:        ${now.toLocaleDateString()}`);
        printLine(`  Browser:     ${getBrowserName()}`);
        printLine(`  Platform:    ${navigator.platform}`);
        printLine(`  Visits:      ${visitor ? visitor.visitCount : 'N/A'}`);
        printLine(`  Screen:      ${screen.width}x${screen.height}`);
        printLine(`  Time of Day: ${window.VisitorContext ? VisitorContext.getTimeOfDay() : 'unknown'}`);
        printLine('');
    }

    function cmdAchievements() {
        if (!window.Achievements) {
            printLine('Achievement system not loaded.', 'error');
            return;
        }

        const unlocked = Achievements.getUnlocked();
        printLine('');
        printLine('🏆 Achievements', 'info');
        printLine('─'.repeat(40));

        if (unlocked.length === 0) {
            printLine('  No achievements unlocked yet. Keep exploring!');
        } else {
            unlocked.forEach(a => {
                printLine(`  ${a.icon} ${a.name} — ${a.description}`);
            });
        }

        const total = Achievements.getTotal();
        printLine('');
        printLine(`  Unlocked: ${unlocked.length}/${total}`, 'info');
    }

    function cmdExit() {
        printLine('Goodbye! 👋', 'success');
        setTimeout(close, 500);
    }

    function getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
        return 'Unknown';
    }

    return { init, open, close, toggle, isOpen: () => isOpen };
})();

window.CommandTerminal = CommandTerminal;
