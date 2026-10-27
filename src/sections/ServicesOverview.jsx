import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteData } from '../data/site';
import { WordFillParagraph, SectionEyebrowRow } from '../components/MotionText';

export const ServicesOverview = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const items = siteData.servicesOverview;
  const sectionRef = useRef(null);
  const slideRefs = useRef([]);

  const handleRowActivate = (idx) => {
    if (idx === activeIdx) return;
    setPrevIdx(activeIdx);   // keep the old photo underneath while the new one wipes in
    setActiveIdx(idx);
  };

  // 4 curated imagery states corresponding to each discipline
  const serviceImages = [
    { src: siteData.images.cutting?.girlCut?.src || siteData.images.cutting?.src, alt: "Precision haircutting & styling" },
    { src: siteData.images.colour?.src, alt: "Bespoke hair colour consultation" },
    { src: siteData.images.treatments?.src, alt: "Restorative hair therapy" },
    { src: siteData.images.academy?.src, alt: siteData.images.academy?.alt || "Hair City Academy educator demonstrating precision haircutting and styling techniques to students" }
  ];

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(sectionRef.current);

    mm.add({
      isDesktop: '(min-width: 901px)',
      isMobile: '(max-width: 900px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isMobile } = context.conditions;

      if (reduceMotion) {
        gsap.set('.service-overview-row, .service-row-thumb', { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
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
          start: 'top 85%',
          once: true
        }
      });

      // Mobile: reveal thumbnails and toggle active-row as row crosses 55%
      if (isMobile) {
        const rows = gsap.utils.toArray('.service-overview-row');
        rows.forEach((row) => {
          const thumb = row.querySelector('.service-row-thumb');
          if (thumb) {
            gsap.fromTo(thumb,
              { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: row,
                  start: 'top 85%',
                  once: true
                }
              }
            );
          }

          ScrollTrigger.create({
            trigger: row,
            start: 'top 55%',
            end: 'bottom 55%',
            toggleClass: { targets: row, className: 'active-row' }
          });
        });
      }

      // The image pane stays in view with CSS `position: sticky` (see .services-image-pane)
    });

    return () => mm.revert();
  }, []);

  // Animate the active slide after React has rendered it
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetSlide = slideRefs.current[activeIdx];
    if (!targetSlide) return;

    if (isReduced) {
      gsap.set(targetSlide, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 });
      return;
    }

    const anim = gsap.fromTo(targetSlide,
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.7, ease: 'power3.out' }
    );

    return () => {
      anim.kill();
    };
  }, [activeIdx]);

  return (
    <section id="services" className="section" ref={sectionRef} aria-labelledby="services-overview-title">
      <div className="container">
        <SectionEyebrowRow label="Salon Offerings" />

        <div className="services-split-grid">
          {/* Left: Visual Index with number, title, one line, small image, arrow */}
          <div className="services-list-pane">
            <h2 id="services-overview-title" className="section-reveal-h2" style={{ marginBottom: '1.25rem' }}>
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
                  <div className="service-row-leading">
                    <span className="service-row-num">{item.num}</span>
                    {serviceImages[idx]?.src && (
                      <div className="service-row-thumb" aria-hidden="true">
                        <img
                          src={serviceImages[idx].src}
                          alt=""
                          width="160"
                          height="200"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                  </div>

                  <div className="service-row-content">
                    <h3 className="service-row-title">{item.title}</h3>
                    <p className="service-row-summary">{item.summary}</p>
                  </div>

                  <span className="service-row-arrow" aria-hidden="true">→</span>
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
                  ref={(el) => { slideRefs.current[idx] = el; }}
                  className={`service-image-slide service-active-img-${idx} ${activeIdx === idx ? 'current' : ''}`}
                  style={{
                    display: activeIdx === idx || prevIdx === idx ? 'block' : 'none',
                    zIndex: activeIdx === idx ? 2 : 1
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width="600"
                    height="750"
                    className="services-sticky-img"
                    loading="lazy"
                    decoding="async"
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
          grid-template-columns: auto 1fr auto;
          gap: clamp(1rem, 2vw, 1.75rem);
          align-items: center;
          padding: clamp(1.25rem, 2.5vw, 1.85rem) 0;
          border-bottom: 1px solid var(--color-border);
          transition: transform 0.25s var(--ease-editorial), border-color 0.25s ease;
          text-decoration: none;
          color: inherit;
        }

        .service-overview-row.active-row {
          transform: translateX(8px);
          border-bottom-color: var(--color-accent);
        }

        .service-overview-row:last-child,
        .service-overview-row:last-child.active-row {
          border-bottom: none;
        }

        .service-row-leading {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .service-row-num {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--color-accent);
          flex-shrink: 0;
          min-width: 1.75rem;
        }

        /* Small image from existing assets for visual index */
        .service-row-thumb {
          width: clamp(56px, 6vw, 68px);
          height: clamp(68px, 7.5vw, 84px);
          overflow: hidden;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          flex-shrink: 0;
        }

        .service-row-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 20%;
          display: block;
          transition: transform 0.35s ease;
        }

        .service-overview-row:hover .service-row-thumb img,
        .service-overview-row.active-row .service-row-thumb img {
          transform: scale(1.06);
        }

        .service-row-content {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }

        .service-row-title {
          font-size: clamp(1.2rem, 1.8vw, 1.55rem);
          font-weight: 400;
          color: var(--color-text);
          transition: color 0.25s ease;
          line-height: 1.25;
          margin: 0;
        }

        .service-overview-row.active-row .service-row-title {
          color: var(--color-accent);
        }

        .service-row-summary {
          font-size: 0.875rem;
          color: var(--color-muted);
          line-height: 1.45;
          margin: 0;
        }

        .service-row-arrow {
          font-size: 1.35rem;
          color: var(--color-accent);
          transition: transform 0.3s var(--ease-editorial);
          flex-shrink: 0;
          padding-right: 0.5rem;
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
          max-height: calc(100vh - var(--header-height) - 4rem);
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
          object-position: 50% 20%;
          display: block;
        }

        .services-image-caption {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(20, 18, 17, 0.75);
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
            grid-template-columns: auto 1fr auto;
            gap: 1rem;
          }
          .service-row-leading {
            gap: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .service-row-leading {
            gap: 0.65rem;
          }
          .service-row-num {
            min-width: 1.4rem;
            font-size: 1.05rem;
          }
          .service-row-thumb {
            width: 50px;
            height: 62px;
          }
        }
      `}</style>
    </section>
  );
};
