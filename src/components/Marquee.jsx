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

      // Observe scroll velocity and direction to adjust speed, direction, and slight skew
      ScrollTrigger.create({
        trigger: marqueeRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const speedMultiplier = Math.min(Math.abs(velocity) / 300, 4);
          const dir = self.direction === -1 ? -1 : 1; // Reverse when scrolling up
          targetVelocity = dir * (1 + speedMultiplier);
          skewTarget = Math.max(Math.min(velocity / 120, 6), -6);
        }
      });

      const tickerFunc = () => {
        // Smoothly interpolate current velocity and skew
        currentVelocity += (targetVelocity - currentVelocity) * 0.08;
        currentSkew += (skewTarget - currentSkew) * 0.08;
        skewTarget *= 0.94; // Decay skew back to 0

        // Move marquee
        currentX -= currentVelocity * 1.5;

        // Seamless wrap around half width
        if (trackRef.current) {
          const halfWidth = trackRef.current.scrollWidth / 2;
          if (halfWidth > 0) {
            if (currentX <= -halfWidth) {
              currentX += halfWidth;
            } else if (currentX >= 0) {
              currentX -= halfWidth;
            }
          }

          trackRef.current.style.transform = `translate3d(${currentX}px, 0, 0) skewX(${currentSkew}deg)`;
        }
      };

      gsap.ticker.add(tickerFunc);

      return () => {
        gsap.ticker.remove(tickerFunc);
      };
    }, marqueeRef);

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
          padding: 1.1rem 0;
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
          font-family: var(--font-serif);
          font-size: clamp(1.15rem, 1.8vw, 1.5rem);
          color: var(--color-text);
          letter-spacing: -0.01em;
          text-transform: none;
        }

        .marquee-dot {
          color: var(--color-accent);
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
};
