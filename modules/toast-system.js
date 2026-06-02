// ============================================================
// Toast Notification System
// A lightweight, reusable toast system used by all modules.
// Supports: success, info, warning, achievement types.
// ============================================================

const ToastSystem = (() => {
    let container = null;
    const TOAST_DURATION = 4000;
    const MAX_TOASTS = 5;

    function init() {
        // Create container if it doesn't exist
        if (!document.querySelector('.toast-container')) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        } else {
            container = document.querySelector('.toast-container');
        }
    }

    /**
     * Show a toast notification
     * @param {string} message - The message text
     * @param {string} type - 'success' | 'info' | 'warning' | 'achievement'
     * @param {object} options - { duration, icon, title }
     */
    function show(message, type = 'info', options = {}) {
        if (!container) init();

        const {
            duration = TOAST_DURATION,
            icon = null,
            title = null
        } = options;

        // Enforce max toasts — remove oldest if at capacity
        const existing = container.querySelectorAll('.toast');
        if (existing.length >= MAX_TOASTS) {
            dismiss(existing[0]);
        }

        // Build toast element
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.setAttribute('role', 'alert');

        const iconMap = {
            success: 'ri-check-line',
            info: 'ri-information-line',
            warning: 'ri-alert-line',
            achievement: 'ri-trophy-line'
        };

        const displayIcon = icon || iconMap[type] || iconMap.info;

        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${displayIcon}"></i>
            </div>
            <div class="toast__body">
                ${title ? `<div class="toast__title">${title}</div>` : ''}
                <div class="toast__message">${message}</div>
            </div>
            <button class="toast__close" aria-label="Dismiss">
                <i class="ri-close-line"></i>
            </button>
            <div class="toast__progress"></div>
        `;

        container.appendChild(toast);

        // Animate in
        gsap.fromTo(toast,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
        );

        // Animate progress bar
        const progress = toast.querySelector('.toast__progress');
        gsap.fromTo(progress,
            { scaleX: 1 },
            { scaleX: 0, duration: duration / 1000, ease: 'none' }
        );

        // Close button
        toast.querySelector('.toast__close').addEventListener('click', () => dismiss(toast));

        // Auto-dismiss
        const timer = setTimeout(() => dismiss(toast), duration);

        // Pause on hover
        toast.addEventListener('mouseenter', () => {
            clearTimeout(timer);
            gsap.killTweensOf(progress);
        });

        toast.addEventListener('mouseleave', () => {
            const remaining = parseFloat(gsap.getProperty(progress, 'scaleX')) * duration;
            gsap.to(progress, { scaleX: 0, duration: remaining / 1000, ease: 'none' });
            setTimeout(() => dismiss(toast), remaining);
        });

        return toast;
    }

    function dismiss(toast) {
        if (!toast || !toast.parentNode) return;

        gsap.to(toast, {
            opacity: 0,
            y: -20,
            scale: 0.9,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }
        });
    }

    function clearAll() {
        if (!container) return;
        const toasts = container.querySelectorAll('.toast');
        toasts.forEach(t => dismiss(t));
    }

    // Convenience methods
    function success(message, options = {}) { return show(message, 'success', options); }
    function info(message, options = {}) { return show(message, 'info', options); }
    function warning(message, options = {}) { return show(message, 'warning', options); }
    function achievement(message, options = {}) {
        return show(message, 'achievement', { title: '🏆 Achievement Unlocked!', ...options });
    }

    return { init, show, dismiss, clearAll, success, info, warning, achievement };
})();

// Export for module usage
window.ToastSystem = ToastSystem;
