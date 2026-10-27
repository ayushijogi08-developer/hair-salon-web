import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteData } from '../data/site';

export const Marquee = () => {
  const items = siteData.marquee;
  const loopItems = [...items, ...items, ...items, ...items, ...items, ...items];
  const marqueeRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      let currentX = 0;
      let targetVelocity = 1;
      let currentVelocity = 1;
      let skewTarget = 0;
      let currentSkew = 0;
      let isVisible = false;

      let halfWidth = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
      const updateHalfWidth = () => {
        if (trackRef.current) {
          halfWidth = trackRef.current.scrollWidth / 2;
        }
      };
      window.addEventListener('resize', updateHalfWidth);

      // Observe scroll velocity and direction to adjust speed, direction, and slight skew; skip ticker work when offscreen
      ScrollTrigger.create({
        trigger: marqueeRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          isVisible = self.isActive;
        },
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const speedMultiplier = Math.min(Math.abs(velocity) / 300, 4);
          const dir = self.direction === -1 ? -1 : 1; // Reverse when scrolling up
          targetVelocity = dir * (1 + speedMultiplier);
          skewTarget = Math.max(Math.min(velocity / 120, 6), -6);
        }
      });

      const tickerFunc = () => {
        if (!isVisible) return;

        // Smoothly interpolate current velocity and skew
        currentVelocity += (targetVelocity - currentVelocity) * 0.08;
        currentSkew += (skewTarget - currentSkew) * 0.08;
        skewTarget *= 0.94; // Decay skew back to 0

        // Move marquee at calm, quiet divider pace
        currentX -= currentVelocity * 0.42 * gsap.ticker.deltaRatio();

        // Seamless wrap around half width
        if (trackRef.current && halfWidth > 0) {
          if (currentX <= -halfWidth) {
            currentX += halfWidth;
          } else if (currentX >= 0) {
            currentX -= halfWidth;
          }

          trackRef.current.style.transform = `translate3d(${currentX}px, 0, 0) skewX(${currentSkew}deg)`;
        }
      };

      gsap.ticker.add(tickerFunc);

      return () => {
        gsap.ticker.remove(tickerFunc);
        window.removeEventListener('resize', updateHalfWidth);
      };
    }, marqueeRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div className="marquee-wrapper" ref={marqueeRef} aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {loopItems.map((item, idx) => (
          <span key={idx} className="marquee-item">
            <span className="marquee-text">{item}</span>
            <span className="marquee-dot">·</span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          padding: 0.5rem 0;
          white-space: nowrap;
          user-select: none;
        }

        .marquee-track {
          display: inline-flex;
          align-items: center;
          will-change: transform;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0 1.5rem;
        }

        .marquee-text {
          font-family: var(--font-sans);
          font-size: clamp(0.7rem, 0.85vw, 0.8125rem);
          font-weight: 400;
          color: var(--color-muted);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.85;
        }

        .marquee-dot {
          color: var(--color-accent);
          font-size: 0.75rem;
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
};
