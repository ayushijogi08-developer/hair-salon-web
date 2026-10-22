import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { WordFillParagraph, SectionEyebrowRow } from '../components/MotionText';

export const ColourSection = () => {
  const data = siteData.colour;
  const colourImg = siteData.images.colour?.src;
  const colourSectionRef = useRef(null);
  const imgFrameRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(colourSectionRef);

    mm.add({
      isDesktop: '(min-width: 901px)',
      isMobile: '(max-width: 900px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isDesktop } = context.conditions;

      if (reduceMotion) {
        gsap.set('.colour-item-row, .colour-photo-frame, .colour-item-line', { opacity: 1, scaleX: 1 });
        return;
      }

      // Stagger items with line drawing across
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.colour-items-list',
          start: 'top 85%'
        }
      });

      tl.from('.colour-item-row', {
        x: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out'
      })
      .fromTo('.colour-item-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
        '-=0.5'
      );

      // Mask reveal with inner parallax
      if (colourImg && imgFrameRef.current) {
        gsap.fromTo('.colour-photo-frame',
          { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imgFrameRef.current,
              start: 'top 85%'
            },
            onComplete: () => {
              const img = document.querySelector('.colour-inner-img');
              if (img) img.style.willChange = 'auto';
            }
          }
        );

        if (isDesktop) {
          gsap.to('.colour-inner-img', {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: imgFrameRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      }
    });

    return () => mm.revert();
  }, [colourImg]);

  return (
    <section id="colour" className="section" ref={colourSectionRef} aria-labelledby="colour-title">
      <div className="container">
        <SectionEyebrowRow label={data.tagline} num={data.num} />

        {/* Alternating Layout: Photo on Left, Content on Right */}
        <div className="colour-alternating-grid">
          {colourImg && (
            <div className="colour-photo-col" ref={imgFrameRef}>
              <div className="colour-photo-frame">
                <img
                  src={colourImg}
                  alt={siteData.images.colour.alt}
                  width="800"
                  height="1000"
                  className="colour-photo-img colour-inner-img"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          <div className="colour-content-col">
            <h2 id="colour-title" style={{ marginBottom: '1.25rem' }}>
              {data.title}
            </h2>

            <WordFillParagraph style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.15rem, 1.6vw, 1.4rem)', lineHeight: '1.45' }}>
              {data.lead}
            </WordFillParagraph>

            <div className="colour-note-pill">
              <span className="colour-note-label">Consultation First</span>
              <p className="colour-note-text">{data.note}</p>
            </div>

            <ul className="discipline-items-list colour-items-list" aria-label="Hair colour services">
              {data.items.map((item, idx) => (
                <li key={idx} className="discipline-item-row colour-item-row">
                  <div className="discipline-item-content">
                    <span className="discipline-item-bullet">—</span>
                    <span className="discipline-item-text">{item}</span>
                  </div>
                  <div className="colour-item-line" aria-hidden="true"></div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <a
                href={siteData.links.whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <span>Enquire about colour</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .colour-alternating-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: clamp(2.5rem, 5vw, 5rem);
          align-items: center;
        }

        .colour-photo-col {
          width: 100%;
        }

        .colour-photo-frame {
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          position: relative;
        }

        .colour-photo-img {
          width: 100%;
          height: 110%;
          object-fit: cover;
          display: block;
          will-change: transform;
        }

        .colour-note-pill {
          margin-bottom: 2rem;
          padding: 1.15rem 1.35rem;
          background: var(--color-surface);
          border-left: 3px solid var(--color-accent);
          max-width: 44ch;
        }

        .colour-note-label {
          display: block;
          font-size: var(--size-micro);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--color-accent);
          margin-bottom: 0.35rem;
          font-weight: 600;
        }

        .colour-note-text {
          font-size: 0.9375rem;
          color: var(--color-text);
          margin: 0;
          font-weight: 500;
        }

        .discipline-items-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--color-border);
        }

        .discipline-item-row {
          position: relative;
          padding: 1.15rem 0;
        }

        .discipline-item-content {
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
        }

        .colour-item-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--color-border-light);
          transform-origin: left;
          transform: scaleX(1);
        }

        .discipline-item-bullet {
          color: var(--color-accent);
          font-family: var(--font-serif);
        }

        .discipline-item-text {
          font-size: 1.05rem;
          color: var(--color-text);
          font-weight: 400;
        }

        @media (max-width: 900px) {
          .colour-alternating-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .colour-photo-col {
            order: 2;
          }
          .colour-photo-frame {
            aspect-ratio: 16/10;
          }
        }
      `}</style>
    </section>
  );
};
