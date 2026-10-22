import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteData } from '../data/site';
import { WordFillParagraph, SectionEyebrowRow } from '../components/MotionText';

export const ServicesOverview = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const items = siteData.servicesOverview;
  const sectionRef = useRef(null);

  // 4 curated imagery states corresponding to each discipline
  const serviceImages = [
    { src: siteData.images.cutting?.src, alt: "Precision haircutting & styling" },
    { src: siteData.images.colour?.src, alt: "Bespoke hair colour consultation" },
    { src: siteData.images.treatments?.src, alt: "Restorative hair therapy" },
    { src: siteData.images.academy?.src, alt: "Professional academy training studio" }
  ];

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: '(min-width: 901px)',
      isMobile: '(max-width: 900px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isDesktop } = context.conditions;

      if (reduceMotion) {
        gsap.set('.service-overview-row', { opacity: 1 });
        return;
      }

      // Stagger row entry
      gsap.from('.service-overview-row', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-interactive-list',
          start: 'top 85%'
        }
      });

      // Desktop pinned split layout: pin right image pane as list scrolls
      if (isDesktop) {
        ScrollTrigger.create({
          trigger: '.services-split-grid',
          start: 'top 15%',
          end: 'bottom 85%',
          pin: '.services-image-pane',
          pinSpacing: false
        });
      }
    });

    return () => mm.revert();
  }, []);

  // Clip-path transition when row becomes active
  const handleRowActivate = (idx) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);

    const imgWrap = document.querySelector(`.service-active-img-${idx}`);
    if (imgWrap) {
      gsap.fromTo(imgWrap,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    }
  };

  return (
    <section id="services" className="section" ref={sectionRef} aria-labelledby="services-overview-title">
      <div className="container">
        <SectionEyebrowRow label="Salon Offerings" num="01" />

        <div className="services-split-grid">
          {/* Left: Numbered list with thin dividers */}
          <div className="services-list-pane">
            <h2 id="services-overview-title" className="section-reveal-h2" style={{ marginBottom: '1.5rem' }}>
              Salon services for cuts, colour, and scalp care.
            </h2>

            <WordFillParagraph style={{ marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Every service begins with honest consultation regarding face shape, base tone, and hair condition.
            </WordFillParagraph>

            <div className="services-interactive-list">
              {items.map((item, idx) => (
                <a
                  key={item.num}
                  href={`#${item.targetId}`}
                  className={`service-overview-row ${activeIdx === idx ? 'active-row' : ''}`}
                  onMouseEnter={() => handleRowActivate(idx)}
                  onFocus={() => handleRowActivate(idx)}
                >
                  <div className="service-row-left">
                    <span className="service-row-num">{item.num}</span>
                    <h3 className="service-row-title">{item.title}</h3>
                  </div>
                  <div className="service-row-right">
                    <p className="service-row-summary">{item.summary}</p>
                    <span className="service-row-arrow">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Sticky / Pinned image pane with clip-path transition */}
          <div className="services-image-pane">
            <div className="services-sticky-image-wrap">
              {serviceImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`service-image-slide service-active-img-${idx} ${activeIdx === idx ? 'current' : ''}`}
                  style={{ display: activeIdx === idx ? 'block' : 'none' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="services-sticky-img"
                    loading="lazy"
                  />
                  <div className="services-image-caption">
                    <span>{items[idx]?.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .services-split-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.85fr;
          gap: clamp(2rem, 5vw, 4.5rem);
          align-items: start;
        }

        .services-interactive-list {
          border-top: 1px solid var(--color-border);
        }

        .service-overview-row {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          align-items: baseline;
          padding: clamp(1.75rem, 3.5vw, 2.5rem) 0;
          border-bottom: 1px solid var(--color-border);
          transition: transform 0.3s var(--ease-editorial), color 0.25s ease, border-color 0.25s ease;
          text-decoration: none;
        }

        /* Active row turns clay and shifts 12px right with an arrow */
        .service-overview-row.active-row {
          transform: translateX(12px);
          border-bottom-color: var(--color-accent);
        }

        .service-row-left {
          display: flex;
          align-items: baseline;
          gap: 1.75rem;
        }

        .service-row-num {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .service-row-title {
          font-size: clamp(1.35rem, 2vw, 1.75rem);
          font-weight: 400;
          color: var(--color-text);
          transition: color 0.25s ease;
        }

        .service-overview-row.active-row .service-row-title {
          color: var(--color-accent);
        }

        .service-row-right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .service-row-summary {
          font-size: 0.875rem;
          color: var(--color-muted);
          line-height: 1.5;
        }

        .service-row-arrow {
          font-size: 1.25rem;
          color: var(--color-accent);
          transition: transform 0.3s var(--ease-editorial);
        }

        .service-overview-row.active-row .service-row-arrow {
          transform: translateX(6px);
        }

        .services-image-pane {
          position: sticky;
          top: calc(var(--header-height) + 2rem);
          width: 100%;
        }

        .services-sticky-image-wrap {
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          position: relative;
        }

        .service-image-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .services-sticky-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .services-image-caption {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(20, 18, 17, 0.7);
          color: #FAF8F5;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 900px) {
          .services-split-grid {
            grid-template-columns: 1fr;
          }
          .services-image-pane {
            display: none;
          }
          .service-overview-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .service-overview-row.active-row {
            transform: translateX(6px);
          }
          .service-row-right {
            padding-left: 2.75rem;
          }
        }
      `}</style>
    </section>
  );
};
