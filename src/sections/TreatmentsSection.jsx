import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { WordFillParagraph, SectionEyebrowRow } from '../components/MotionText';

export const TreatmentsSection = () => {
  const data = siteData.treatments;
  const treatmentsImg = siteData.images.treatments?.src;
  const sectionRef = useRef(null);
  const imgFrameRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: '(min-width: 901px)',
      isMobile: '(max-width: 900px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isDesktop } = context.conditions;

      if (reduceMotion) {
        gsap.set('.treatment-item-row, .treatment-photo-frame, .treatment-item-line, .treatment-note-pill', { opacity: 1, scaleX: 1 });
        return;
      }

      // Stagger items with line drawing across
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.treatment-items-list',
          start: 'top 85%'
        }
      });

      tl.from('.treatment-item-row', {
        x: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out'
      })
      .fromTo('.treatment-item-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
        '-=0.5'
      );

      gsap.from('.treatment-note-pill', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.treatment-note-pill',
          start: 'top 90%'
        }
      });

      // Mask reveal with inner parallax
      if (treatmentsImg && imgFrameRef.current) {
        gsap.fromTo('.treatment-photo-frame',
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
              const img = document.querySelector('.treatment-inner-img');
              if (img) img.style.willChange = 'auto';
            }
          }
        );

        if (isDesktop) {
          gsap.to('.treatment-inner-img', {
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
  }, [treatmentsImg]);

  return (
    <section id="treatments" className="section" ref={sectionRef} aria-labelledby="treatments-title">
      <div className="container">
        <SectionEyebrowRow label={data.tagline} num={data.num} />

        {/* Alternating Layout: Content on Left, Large Photo on Right */}
        <div className="discipline-grid-with-photo">
          <div className="discipline-content-pane">
            <h2 id="treatments-title" style={{ marginBottom: '1.25rem' }}>
              {data.title}
            </h2>

            <WordFillParagraph style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.15rem, 1.6vw, 1.4rem)', lineHeight: '1.45' }}>
              {data.lead}
            </WordFillParagraph>

            <div className="treatment-note-pill">
              <span className="treatment-note-label">Diagnosis</span>
              <p className="treatment-note-text">{data.note}</p>
            </div>

            <ul className="discipline-items-list treatment-items-list" aria-label="Hair treatment therapies">
              {data.items.map((item, idx) => (
                <li key={idx} className="discipline-item-row treatment-item-row">
                  <div className="discipline-item-content">
                    <span className="discipline-item-bullet">—</span>
                    <span className="discipline-item-text">{item}</span>
                  </div>
                  <div className="treatment-item-line" aria-hidden="true"></div>
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
                <span>Enquire about treatments</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>

          {/* Right: Large Photo with Mask Reveal and Inner Parallax */}
          {treatmentsImg && (
            <div className="discipline-photo-pane" ref={imgFrameRef}>
              <div className="treatment-photo-frame">
                <img
                  src={treatmentsImg}
                  alt={siteData.images.treatments.alt}
                  width="800"
                  height="1000"
                  className="discipline-photo-img treatment-inner-img"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .discipline-grid-with-photo {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(2.5rem, 5vw, 5rem);
          align-items: center;
        }

        .treatment-note-pill {
          margin-bottom: 2rem;
          padding: 1.15rem 1.35rem;
          background: var(--color-surface);
          border-left: 3px solid var(--color-accent);
          max-width: 44ch;
        }

        .treatment-note-label {
          display: block;
          font-size: var(--size-micro);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--color-accent);
          margin-bottom: 0.35rem;
          font-weight: 600;
        }

        .treatment-note-text {
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

        .treatment-item-line {
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

        .discipline-photo-pane {
          width: 100%;
        }

        .treatment-photo-frame {
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          position: relative;
        }

        .discipline-photo-img {
          width: 100%;
          height: 110%;
          object-fit: cover;
          display: block;
          will-change: transform;
        }

        @media (max-width: 900px) {
          .discipline-grid-with-photo {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .treatment-photo-frame {
            aspect-ratio: 16/10;
          }
        }
      `}</style>
    </section>
  );
};
