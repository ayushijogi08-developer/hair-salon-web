/**
 * Motion utilities & media query helpers
 */

export const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
