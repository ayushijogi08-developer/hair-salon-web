import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { SectionEyebrowRow } from '../components/MotionText';

export const BeforeAfter = () => {
  const confirmed = siteData.beforeAfter?.filter((item) => item.confirmed) || [];
  const [sliderPos, setSliderPos] = useState(50);
  const isDraggingRef = useRef(false);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (confirmed.length === 0) return;

    const mm = gsap.matchMedia(sectionRef.current);
    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { reduceMotion } = context.conditions;
        if (reduceMotion) {
          gsap.set('.ba-comparison-card', { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          '.ba-comparison-card',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    );

    return () => mm.revert();
  }, [confirmed.length]);

  if (confirmed.length === 0) {
    return null;
  }

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    updateSlider(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const updateSlider = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const activeItem = confirmed[0];

  return (
    <section id="transformations" className="section" ref={sectionRef} aria-labelledby="ba-title">
      <div className="container">
        <SectionEyebrowRow label="Transformations" />
        <div style={{ maxWidth: '640px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <h2 id="ba-title" style={{ marginBottom: '1rem' }}>
            Before & After
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Real chair transformations. Drag the slider or use arrow keys to see the difference.
          </p>
        </div>

        <div className="ba-comparison-card">
          <div
            ref={containerRef}
            className="ba-stage"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Before (Full underneath) */}
            <img
              src={activeItem.beforeSrc}
              alt={`Before: ${activeItem.title}`}
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
              className="ba-img ba-img-before"
            />
            <span className="ba-tag ba-tag-before">Before</span>

            {/* After (Clipped on top) */}
            <div
              className="ba-after-clip"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img
                src={activeItem.afterSrc}
                alt={`After: ${activeItem.title}`}
                width="800"
                height="600"
                loading="lazy"
                decoding="async"
                className="ba-img ba-img-after"
              />
              <span className="ba-tag ba-tag-after">After</span>
            </div>

            {/* Divider line and handle */}
            <div
              className="ba-handle-line"
              style={{ left: `${sliderPos}%` }}
              aria-hidden="true"
            >
              <div className="ba-handle-knob">
                <span>↔</span>
              </div>
            </div>

            {/* Accessible keyboard range input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="ba-range-input"
              aria-label={`Comparison slider for ${activeItem.title}. Current split: ${sliderPos} percent.`}
            />
          </div>

          <div className="ba-caption">
            <span className="ba-title">{activeItem.title}</span>
            {activeItem.category && <span className="work-category-badge">{activeItem.category}</span>}
          </div>
        </div>
      </div>

      <style>{`
        .ba-comparison-card {
          max-width: 820px;
          margin: 0 auto;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          overflow: hidden;
        }

        .ba-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          user-select: none;
          touch-action: none;
          cursor: ew-resize;
          overflow: hidden;
          background-color: var(--color-surface);
        }

        .ba-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ba-after-clip {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .ba-tag {
          position: absolute;
          bottom: 1rem;
          padding: 0.25rem 0.65rem;
          font-size: var(--size-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background-color: rgba(20, 18, 16, 0.75);
          color: #FAF8F5;
          backdrop-filter: blur(4px);
          font-weight: 600;
          z-index: 5;
        }

        .ba-tag-before {
          left: 1rem;
        }

        .ba-tag-after {
          right: 1rem;
        }

        .ba-handle-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #FAF8F5;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);
          transform: translateX(-50%);
          z-index: 6;
          pointer-events: none;
        }

        .ba-handle-knob {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #FAF8F5;
          color: #141211;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .ba-range-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          margin: 0;
          cursor: ew-resize;
          z-index: 10;
        }

        .ba-caption {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--color-border);
          gap: 1rem;
        }

        .ba-title {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-text);
        }
      `}</style>
    </section>
  );
};
