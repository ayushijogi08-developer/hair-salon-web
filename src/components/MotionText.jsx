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
      split = new SplitText(pRef.current, { type: 'words', aria: 'none' });

      // Words go from 85% to 100% opacity as you scroll
      gsap.fromTo(split.words,
        { opacity: 0.85 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: pRef.current,
            start: isMobile ? 'top 92%' : 'top 85%',
            end: isMobile ? 'top 70%' : 'bottom 45%',
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
  return (
    <div className="section-eyebrow-row">
      <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
      {num ? <span className="section-oversized-num">{num}</span> : null}
    </div>
  );
};
