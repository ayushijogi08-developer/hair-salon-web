import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { SectionEyebrowRow } from '../components/MotionText';

export const Reviews = () => {
  const confirmed = siteData.reviews?.filter((item) => item.confirmed) || [];
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
          gsap.set('.review-card', { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          '.review-card',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
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
    <section id="reviews" className="section" ref={sectionRef} aria-labelledby="reviews-title">
      <div className="container">
        <SectionEyebrowRow label="Word of Mouth" num="07" />
        <div style={{ maxWidth: '640px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <h2 id="reviews-title" style={{ marginBottom: '1rem' }}>
            Client Words
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Genuine feedback from clients who visit our chairs.
          </p>
        </div>

        <div className="reviews-grid">
          {confirmed.map((review, idx) => (
            <div key={review.id || idx} className="review-card">
              <blockquote className="review-text">
                “{review.text}”
              </blockquote>
              <div className="review-footer">
                <span className="review-author">— {review.author}</span>
                {review.sourceUrl ? (
                  <a
                    href={review.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="review-source-link"
                  >
                    {review.source || 'Verified Google Review'} ↗
                  </a>
                ) : (
                  <span className="review-source-text">{review.source || 'Google Review'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .review-card {
          padding: 2.25rem 2rem;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .review-text {
          font-family: var(--font-serif);
          font-size: clamp(1.1rem, 1.5vw, 1.25rem);
          line-height: 1.6;
          color: var(--color-text);
          font-style: italic;
          margin: 0;
        }

        .review-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
          flex-wrap: wrap;
        }

        .review-author {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .review-source-link {
          font-size: var(--size-micro);
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .review-source-text {
          font-size: var(--size-micro);
          color: var(--color-muted);
        }

        @media (pointer: coarse) {
          .review-source-link {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
};
