// ============================================================
// Visitor Context Engine
// Makes the portfolio feel alive with contextual awareness.
// - Time-of-day greeting
// - Return visitor recognition
// - Idle detection nudges
// - Scroll milestone toasts
// - Section dwell time tracking
// ============================================================

const VisitorContext = (() => {
    const STORAGE_KEY = 'portfolio_visitor';
    const IDLE_TIMEOUT = 30000; // 30 seconds
    const DWELL_THRESHOLD = 10000; // 10 seconds
    let idleTimer = null;
    let isIdle = false;
    let nudgeElement = null;
    let scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    let sectionTimers = {};
    let dwellFacts = {};

    function getVisitorData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function saveVisitorData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
            // Storage full or unavailable
        }
    }

    function init() {
        const visitor = getVisitorData() || { visitCount: 0, firstVisit: Date.now(), lastVisit: null };
        visitor.visitCount += 1;
        visitor.lastVisit = Date.now();
        saveVisitorData(visitor);

        setupGreeting(visitor);
        setupReturnVisitorMessage(visitor);
        setupIdleDetection();
        setupScrollMilestones();
        setupDwellTracking();

        // Dispatch context ready event
        document.dispatchEvent(new CustomEvent('portfolio:context-ready', { detail: visitor }));
    }

    // ---- Time-of-Day Greeting ----
    function setupGreeting(visitor) {
        const greetingEl = document.getElementById('dynamic-greeting');
        if (!greetingEl) return;

        const hour = new Date().getHours();
        let greeting, emoji;

        if (hour >= 5 && hour < 12) {
            greeting = 'Good morning';
            emoji = '☀️';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
            emoji = '🌤️';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good evening';
            emoji = '🌅';
        } else {
            greeting = 'Burning the midnight oil?';
            emoji = '🌙';
        }

        greetingEl.textContent = `${greeting} ${emoji}`;

        // Animate it in
        gsap.fromTo(greetingEl,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: 'power3.out' }
        );
    }

    // ---- Return Visitor ----
    function setupReturnVisitorMessage(visitor) {
        if (visitor.visitCount <= 1) return;

        setTimeout(() => {
            const suffix = visitor.visitCount === 2 ? 'time' : 'times';
            ToastSystem.info(
                `You've visited ${visitor.visitCount} ${suffix}. Welcome back!`,
                { icon: 'ri-heart-line', title: 'Hey, welcome back!' }
            );
        }, 2500);
    }

    // ---- Idle Detection ----
    function setupIdleDetection() {
        // Create nudge element
        nudgeElement = document.createElement('div');
        nudgeElement.className = 'idle-nudge';
        nudgeElement.innerHTML = `
            <span>Still here? Check out my projects →</span>
        `;
        nudgeElement.addEventListener('click', () => {
            const projectSection = document.getElementById('projects');
            if (projectSection) {
                projectSection.scrollIntoView({ behavior: 'smooth' });
            }
            hideNudge();
        });
        document.body.appendChild(nudgeElement);

        const resetIdle = () => {
            if (isIdle) hideNudge();
            isIdle = false;
            clearTimeout(idleTimer);
            idleTimer = setTimeout(showNudge, IDLE_TIMEOUT);
        };

        ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(evt => {
            document.addEventListener(evt, resetIdle, { passive: true });
        });

        // Start the initial timer
        idleTimer = setTimeout(showNudge, IDLE_TIMEOUT);
    }

    function showNudge() {
        if (!nudgeElement || isIdle) return;
        isIdle = true;

        gsap.fromTo(nudgeElement,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }
        );
        nudgeElement.classList.add('visible');
    }

    function hideNudge() {
        if (!nudgeElement) return;
        isIdle = false;

        gsap.to(nudgeElement, {
            opacity: 0, y: 20, duration: 0.3,
            onComplete: () => nudgeElement.classList.remove('visible')
        });
    }

    // ---- Scroll Milestones ----
    function setupScrollMilestones() {
        const milestoneMessages = {
            25: "You're getting started! Keep scrolling 👀",
            50: "Halfway through! You're exploring well 🚀",
            75: "Almost there! Just a bit more to see 💪",
            100: "You've seen it all! Thanks for exploring 🎉"
        };

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            for (const [milestone, shown] of Object.entries(scrollMilestones)) {
                if (!shown && scrollPercent >= parseInt(milestone)) {
                    scrollMilestones[milestone] = true;
                    ToastSystem.info(milestoneMessages[milestone], {
                        icon: 'ri-map-pin-line',
                        duration: 3000
                    });
                    document.dispatchEvent(new CustomEvent('portfolio:scroll-milestone', {
                        detail: { milestone: parseInt(milestone) }
                    }));
                }
            }
        }, { passive: true });
    }

    // ---- Section Dwell Time ----
    function setupDwellTracking() {
        dwellFacts = {
            'skills': 'Fun fact: I learned JavaScript by building 30 mini-projects in 30 days! 🧑‍💻',
            'projects': 'I always start projects with a rough sketch on paper before writing any code 📝',
            'about': 'When I\'m not coding, you\'ll find me exploring new tech or watching sci-fi 🛸',
            'contact': 'I typically respond to messages within 24 hours ⚡'
        };

        const sections = document.querySelectorAll('[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                if (!dwellFacts[id]) return;

                if (entry.isIntersecting) {
                    sectionTimers[id] = setTimeout(() => {
                        ToastSystem.info(dwellFacts[id], {
                            icon: 'ri-lightbulb-line',
                            title: 'Did you know?',
                            duration: 5000
                        });
                        // Only show once
                        delete dwellFacts[id];
                    }, DWELL_THRESHOLD);
                } else {
                    clearTimeout(sectionTimers[id]);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    // Public API
    function getVisitCount() {
        const data = getVisitorData();
        return data ? data.visitCount : 1;
    }

    function getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    return { init, getVisitCount, getTimeOfDay, getVisitorData };
})();

window.VisitorContext = VisitorContext;
