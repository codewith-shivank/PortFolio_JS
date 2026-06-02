// ============================================================
// Easter Eggs Module
// Hidden interactions that reward exploration.
// - Konami code → confetti / matrix rain
// - Profile image click counter → fun message
// - Secret word "hire" → CTA animation
// - Draggable profile photo
// ============================================================

const EasterEggs = (() => {
    // Konami code sequence
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
                    'b', 'a'];
    let konamiIndex = 0;
    let clickCount = 0;
    let clickTimer = null;
    let secretBuffer = '';
    let confettiActive = false;

    function init() {
        setupKonamiCode();
        setupProfileClickEgg();
        setupSecretWord();
        setupDraggablePhoto();
        listenForTerminalEaster();
    }

    // ---- Konami Code ----
    function setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            // Skip if in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === KONAMI[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === KONAMI.length) {
                    konamiIndex = 0;
                    triggerConfetti();
                    ToastSystem.achievement('Konami Code Master! You found the secret combo! 🎮');
                    document.dispatchEvent(new CustomEvent('portfolio:easter-egg', {
                        detail: { type: 'konami' }
                    }));
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    // ---- Profile Image Click Counter ----
    function setupProfileClickEgg() {
        const profileImg = document.querySelector('.about img');
        if (!profileImg) return;

        profileImg.style.cursor = 'pointer';

        profileImg.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);

            // Reset after 2 seconds of inactivity
            clickTimer = setTimeout(() => { clickCount = 0; }, 2000);

            if (clickCount === 3) {
                // Spin animation at 3
                gsap.to(profileImg, {
                    rotation: 360,
                    duration: 0.6,
                    ease: 'power2.out',
                    onComplete: () => gsap.set(profileImg, { rotation: 0 })
                });
            }

            if (clickCount >= 5) {
                clickCount = 0;
                const messages = [
                    "Hey! That tickles! 😄",
                    "You're persistent! Here's a virtual high-five 🙌",
                    "Stop poking me! 😂 Just kidding, I love the attention!",
                    "5 clicks?! You're officially a super fan! ⭐",
                    "Okay okay, you win! Check out my projects! 🚀"
                ];
                const msg = messages[Math.floor(Math.random() * messages.length)];
                ToastSystem.info(msg, { icon: 'ri-emotion-laugh-line', duration: 4000 });

                // Fun bounce animation
                gsap.to(profileImg, {
                    scale: 1.15,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 3,
                    ease: 'power2.inOut'
                });

                document.dispatchEvent(new CustomEvent('portfolio:easter-egg', {
                    detail: { type: 'click-counter' }
                }));
            }
        });
    }

    // ---- Secret Word: "hire" ----
    function setupSecretWord() {
        document.addEventListener('keypress', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            secretBuffer += e.key.toLowerCase();

            // Keep buffer to last 10 chars
            if (secretBuffer.length > 10) {
                secretBuffer = secretBuffer.slice(-10);
            }

            if (secretBuffer.includes('hire')) {
                secretBuffer = '';
                triggerHireCTA();
            }
        });
    }

    function triggerHireCTA() {
        // Find the "Let's Talk" button in about section
        const ctaButton = document.querySelector('.textabout a');
        if (!ctaButton) return;

        // Scroll to it
        ctaButton.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            // Pulsing glow effect
            gsap.to(ctaButton, {
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)',
                scale: 1.1,
                duration: 0.4,
                yoyo: true,
                repeat: 5,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(ctaButton, { clearProps: 'boxShadow,scale' });
                }
            });

            ToastSystem.success('Looking to hire? Let\'s talk! 🤝', {
                icon: 'ri-briefcase-line',
                duration: 5000
            });
        }, 800);

        document.dispatchEvent(new CustomEvent('portfolio:easter-egg', {
            detail: { type: 'hire-word' }
        }));
    }

    // ---- Draggable Profile Photo ----
    function setupDraggablePhoto() {
        const profileImg = document.querySelector('.about img');
        if (!profileImg || typeof Draggable === 'undefined') return;

        Draggable.create(profileImg, {
            type: 'x,y',
            bounds: '.about',
            inertia: true,
            onDragStart: function () {
                gsap.to(profileImg, { scale: 1.05, duration: 0.2 });
            },
            onDragEnd: function () {
                // Snap back with a bounce
                gsap.to(profileImg, {
                    x: 0, y: 0, scale: 1,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)'
                });
                ToastSystem.info('Nice moves! 🕹️ The photo snaps back though!', {
                    icon: 'ri-drag-move-line',
                    duration: 3000
                });
            }
        });
    }

    // ---- Listen for terminal easter egg command ----
    function listenForTerminalEaster() {
        document.addEventListener('portfolio:easter-egg', (e) => {
            if (e.detail.type === 'terminal') {
                triggerConfetti();
            }
        });
    }

    // ---- Confetti Effect ----
    function triggerConfetti() {
        if (confettiActive) return;
        confettiActive = true;

        const canvas = document.createElement('canvas');
        canvas.className = 'confetti-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particles = [];
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

        // Create particles
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 100,
                w: Math.random() * 10 + 5,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }

        let frame = 0;
        const maxFrames = 180; // ~3 seconds at 60fps

        function animate() {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // gravity
                p.rotation += p.rotSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
                confettiActive = false;
            }
        }

        animate();
    }

    return { init, triggerConfetti };
})();

window.EasterEggs = EasterEggs;
