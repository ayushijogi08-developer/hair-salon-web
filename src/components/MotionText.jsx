import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

export const WordFillParagraph = ({ children, className = '', style = {} }) => {
  const pRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !pRef.current) return;

    const isMobile = window.matchMedia('(max-width: 860px)').matches;

    let split = null;
    const ctx = gsap.context(() => {
      split = new SplitText(pRef.current, { type: 'words' });

      // Words go from 35% to 100% opacity as you scroll
      gsap.fromTo(split.words,
        { opacity: 0.35 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: pRef.current,
            start: isMobile ? 'top 92%' : 'top 85%',
            end: isMobile ? 'top 55%' : 'bottom 60%',
            scrub: true
          }
        }
      );
    }, pRef.current);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  return (
    <p ref={pRef} className={`word-fill-p ${className}`} style={style}>
      {children}
    </p>
  );
};

export const SectionEyebrowRow = ({ label, num }) => {
  const numRef = useRef(null);
  const rowRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targetNum = parseInt(num, 10);
    if (isNaN(targetNum)) return;

    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: targetNum,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top 90%',
          once: true
        },
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = String(Math.floor(counter.val)).padStart(2, '0');
          }
        }
      });
    }, rowRef.current);

    return () => ctx.revert();
  }, [num]);

  return (
    <div className="section-eyebrow-row" ref={rowRef}>
      <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
      <span className="section-oversized-num" ref={numRef}>{num}</span>
    </div>
  );
};
