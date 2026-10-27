import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteData, whatsappFor } from '../data/site';
import { SectionEyebrowRow } from '../components/MotionText';

export const Pricing = () => {
  const confirmed = siteData.pricing?.filter((item) => item.confirmed) || [];
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
          gsap.set('.pricing-row', { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          '.pricing-row',
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
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

  return (
    <section id="pricing" className="section" ref={sectionRef} aria-labelledby="pricing-title">
      <div className="container">
        <SectionEyebrowRow label="Menu & Rates" />
        <div style={{ maxWidth: '640px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <h2 id="pricing-title" style={{ marginBottom: '1rem' }}>
            Service Pricing
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Transparent rates for salon services. Final charges may vary depending on hair length, texture and custom styling requirements.
          </p>
        </div>

        <div className="pricing-table" role="table" aria-label="Hair City Service Pricing">
          {confirmed.map((item, idx) => (
            <div key={item.id || idx} className="pricing-row" role="row">
              <div className="pricing-row-meta">
                {item.category && <span className="pricing-category">{item.category}</span>}
                <span className="pricing-name" role="rowheader">{item.name}</span>
                {item.description && <p className="pricing-desc">{item.description}</p>}
              </div>

              <div className="pricing-row-action">
                {item.priceFrom != null && (
                  <span className="pricing-rate" role="cell">
                    from ₹{item.priceFrom}
                  </span>
                )}
                <a
                  href={whatsappFor(`pricing for ${item.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  aria-label={`Book or enquire about ${item.name}`}
                >
                  <span>Book</span>
                  <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pricing-table {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--color-border);
        }

        .pricing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--color-border);
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .pricing-row-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-width: 600px;
        }

        .pricing-category {
          font-size: var(--size-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }

        .pricing-name {
          font-family: var(--font-serif);
          font-size: clamp(1.15rem, 1.8vw, 1.4rem);
          font-weight: 600;
          color: var(--color-text);
        }

        .pricing-desc {
          font-size: 0.9rem;
          color: var(--color-muted);
          line-height: 1.5;
        }

        .pricing-row-action {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-left: auto;
        }

        .pricing-rate {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text);
          white-space: nowrap;
        }
      `}</style>
    </section>
  );
};
