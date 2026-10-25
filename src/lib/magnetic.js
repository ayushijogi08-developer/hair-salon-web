import gsap from 'gsap';

/**
 * Initializes desktop-only magnetic pull effect for interactive buttons.
 *
 * @param {string} selector - CSS selector for magnetic elements (default: '.btn-primary')
 * @returns {() => void} Cleanup function to remove listeners and reset transforms
 */
export function initMagnetic(selector = '.btn-primary') {
  if (typeof window === 'undefined') return () => {};

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Return a no-op if desktop hover/fine pointer is not matched, or if prefers-reduced-motion: reduce
  if (!canHover || prefersReduced) {
    return () => {};
  }

  const quickToMap = new WeakMap();

  const getQuickTo = (el) => {
    let entry = quickToMap.get(el);
    if (!entry) {
      entry = {
        xTo: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
        yTo: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
      };
      quickToMap.set(el, entry);
    }
    return entry;
  };

  const onPointerMove = (e) => {
    const el = e.target.closest(selector);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Offset toward cursor: (cursor - button center) * 0.22, clamped to ±10px
    const rawX = (e.clientX - centerX) * 0.22;
    const rawY = (e.clientY - centerY) * 0.22;
    const offsetX = Math.max(-10, Math.min(10, rawX));
    const offsetY = Math.max(-10, Math.min(10, rawY));

    const { xTo, yTo } = getQuickTo(el);
    xTo(offsetX);
    yTo(offsetY);
  };

  const onPointerOut = (e) => {
    // Reset ONLY when cursor truly leaves the button (ignore moves onto child elements)
    const el = e.target.closest(selector);
    if (!el || el.contains(e.relatedTarget)) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto'
    });
  };

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerout', onPointerOut);

  return () => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerout', onPointerOut);
    document.querySelectorAll(selector).forEach((el) => {
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0, clearProps: 'transform' });
    });
  };
}
