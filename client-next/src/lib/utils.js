import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format date to readable string */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Truncate string to max length */
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}

/** Debounce function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Throttle function */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/** Generate random ID */
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

/** Scroll to element with smooth behavior */
export function scrollToElement(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/** Check if on mobile device */
export function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

/** Linear interpolation */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/** Clamp value between min and max */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Map value from one range to another */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
