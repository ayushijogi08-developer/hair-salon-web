import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { SectionEyebrowRow } from '../components/MotionText';

export const FAQ = () => {
  const confirmed = siteData.faq?.filter((item) => item.confirmed) || [];
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const answerRefs = useRef({});

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
          gsap.set('.faq-item', { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          '.faq-item',
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

  const toggleItem = (idx) => {
    const isCurrentlyOpen = openIndex === idx;
    const nextIndex = isCurrentlyOpen ? null : idx;

    // Animate currently open element closed
    if (openIndex !== null && answerRefs.current[openIndex]) {
      gsap.to(answerRefs.current[openIndex], {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut'
      });
    }

    // Animate next element open
    if (nextIndex !== null && answerRefs.current[nextIndex]) {
      const el = answerRefs.current[nextIndex];
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.35,
          ease: 'power2.inOut'
        }
      );
    }

    setOpenIndex(nextIndex);
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: confirmed.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <section id="faq" className="section" ref={sectionRef} aria-labelledby="faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container">
        <SectionEyebrowRow label="Common Questions" num="08" />
        <div style={{ maxWidth: '640px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <h2 id="faq-title" style={{ marginBottom: '1rem' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Everything you need to know about salon visits, consultations, and our academy admissions.
          </p>
        </div>

        <div className="faq-accordion" role="region" aria-label="Frequently Asked Questions list">
          {confirmed.map((item, idx) => {
            const isOpen = openIndex === idx;
            const qId = `faq-q-${item.id || idx}`;
            const aId = `faq-a-${item.id || idx}`;

            return (
              <div key={item.id || idx} className="faq-item">
                <button
                  type="button"
                  id={qId}
                  className="faq-question-btn"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  aria-controls={aId}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className={`faq-toggle-icon ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                    +
                  </span>
                </button>
                <div
                  id={aId}
                  ref={(el) => (answerRefs.current[idx] = el)}
                  role="region"
                  aria-labelledby={qId}
                  className="faq-answer-panel"
                  style={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden'
                  }}
                >
                  <div className="faq-answer-inner">
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .faq-accordion {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--color-border);
        }

        .faq-item {
          border-bottom: 1px solid var(--color-border);
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          gap: 1rem;
        }

        .faq-question-text {
          font-family: var(--font-serif);
          font-size: clamp(1.15rem, 1.8vw, 1.35rem);
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.4;
        }

        .faq-toggle-icon {
          font-family: var(--font-sans);
          font-size: 1.5rem;
          line-height: 1;
          color: var(--color-accent);
          transition: transform var(--transition-fast);
          display: inline-block;
          flex-shrink: 0;
        }

        .faq-toggle-icon.is-open {
          transform: rotate(45deg);
        }

        .faq-answer-inner {
          padding-bottom: 1.5rem;
          padding-right: 2rem;
        }

        .faq-answer-text {
          font-size: 0.95rem;
          color: var(--color-muted);
          line-height: 1.65;
        }
      `}</style>
    </section>
  );
};
