import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { siteData } from '../data/site';

export const Hero = () => {
  const heroRef = useRef(null);
  const heroData = siteData.hero;
  const heroImg = siteData.images.hero;
  const imageFrameRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(heroRef);

    mm.add({
      isDesktop: '(min-width: 961px)',
      isMobile: '(max-width: 960px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isDesktop } = context.conditions;

      if (reduceMotion) {
        gsap.set('.hero-meta-fade, .hero-photo-wrap, .hero-learn-line', { opacity: 1, scaleX: 1 });
        return;
      }

      // Split lines sliding up from mask
      const headlineEl = document.querySelector('#hero-title');
      let split = null;
      if (headlineEl) {
        split = new SplitText(headlineEl, { type: 'lines,words', linesClass: 'hero-split-line' });
      }

      // Hide elements only after GSAP loads (progressive enhancement)
      gsap.set('.hero-meta-fade', { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.1 });

      if (split && split.words.length) {
        tl.from(split.words, {
          y: '100%',
          opacity: 0,
          duration: 0.85,
          stagger: 0.04,
          ease: 'power3.out'
        });
      }

      // The italic word "learns" arrives last with a thin underline that draws itself
      tl.fromTo('.hero-learn-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power3.inOut' },
        '-=0.2'
      );

      // Hero image reveals with a clip-path inset wipe while scaling from 1.2 to 1
      if (heroImg?.src) {
        tl.fromTo('.hero-photo-wrap',
          { clipPath: isDesktop ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.1, ease: 'power3.inOut' },
          '-=0.9'
        )
        .fromTo('.hero-photo-img',
          { scale: 1.2 },
          {
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            onComplete: () => {
              // Keep 60 fps: Remove will-change after animation completes
              const img = document.querySelector('.hero-photo-img');
              if (img) img.style.willChange = 'auto';
            }
          },
          '-=1.1'
        );
      }

      // The hours and address strip fades up after the headline
      tl.to('.hero-meta-fade', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out'
      }, '-=0.5');

      // Desktop: mouse movement parallax (max 12px) & scroll parallax (image scales down, headline moves faster)
      if (isDesktop && imageFrameRef.current) {
        const handleMouseMove = (e) => {
          const { clientX, clientY } = e;
          const x = (clientX / window.innerWidth - 0.5) * -12;
          const y = (clientY / window.innerHeight - 0.5) * -12;
          gsap.to('.hero-photo-img', {
            x,
            y,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // On scroll, headline moves faster than image, and image scales down
        gsap.to('.hero-left-inner', {
          y: -70,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.to('.hero-photo-img', {
          scale: 0.94,
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }
    });

    return () => mm.revert();
  }, [heroImg?.src]);

  return (
    <section id="hero" className="hero-section" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-split-layout">
        {/* Left: Headline, Masked Reveal, Supporting Line & Actions */}
        <div className="hero-left-pane">
          <div className="hero-left-inner">
            <div className="hero-meta-fade" style={{ marginBottom: '1.25rem' }}>
              <span className="section-label" style={{ marginBottom: 0 }}>
                {heroData.eyebrow}
              </span>
            </div>

            <h1 id="hero-title" className="hero-h1">
              <span>{heroData.headlineLine1}</span>
              <br />
              <span>
                and{' '}
                <span className="hero-learns-wrapper">
                  <span className="italic-serif">{heroData.headlineEmphasised}</span>
                  <span className="hero-learn-line" aria-hidden="true"></span>
                </span>{' '}
                how.
              </span>
            </h1>

            <p className="hero-sub hero-meta-fade">
              {heroData.sub}
            </p>

            {/* Actions: "Enquire on WhatsApp", "Explore the academy" */}
            <div className="hero-actions-row hero-meta-fade">
              <a
                href={siteData.links.whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                aria-label="Enquire on WhatsApp"
              >
                <span>{heroData.ctaPrimary}</span>
                <span className="btn-arrow">→</span>
              </a>

              <a
                href="#academy"
                className="btn btn-secondary"
                aria-label="Explore the academy"
              >
                <span>{heroData.ctaSecondary}</span>
                <span className="btn-arrow">↓</span>
              </a>
            </div>

            {/* Verified Location & Hours Metadata Strip */}
            <div className="hero-footer-facts hero-meta-fade">
              <div>
                <span className="editorial-mini-label">Hours</span>
                <span className="editorial-mini-val">{siteData.hours.days}: {siteData.hours.time}</span>
              </div>
              <div>
                <span className="editorial-mini-label">Address</span>
                <span className="editorial-mini-val">Blackberry Complex, Necklace Road, Akola</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Full-height Tall Image cropped with object-fit: cover */}
        <div className="hero-right-pane" ref={imageFrameRef}>
          {heroImg?.src && (
            <div className="hero-photo-wrap">
              <img
                src={heroImg.src}
                alt={heroImg.alt}
                width="800"
                height="1000"
                className="hero-photo-img"
                loading="eager"
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hero-section {
          width: 100%;
          min-height: calc(100vh - var(--header-height));
          background: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
          overflow: hidden;
        }

        .hero-split-layout {
          width: 100%;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          min-height: calc(100vh - var(--header-height));
        }

        .hero-left-pane {
          display: flex;
          align-items: center;
          padding: clamp(2.5rem, 6vw, 6rem) clamp(1.5rem, 5vw, 4.5rem);
          border-right: 1px solid var(--color-border);
        }

        .hero-left-inner {
          max-width: 640px;
          width: 100%;
        }

        .hero-h1 {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 6.5vw, 5.25rem);
          line-height: 1.05;
          margin-bottom: 1.5rem;
          color: var(--color-text);
          overflow: hidden;
        }

        .hero-split-line {
          overflow: hidden;
        }

        .hero-learns-wrapper {
          position: relative;
          display: inline-block;
        }

        .hero-learn-line {
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 100%;
          height: 2px;
          background-color: var(--color-accent);
          transform-origin: left;
          transform: scaleX(0);
        }

        .hero-sub {
          font-size: clamp(1.05rem, 1.4vw, 1.25rem);
          color: var(--color-muted);
          margin-bottom: 2.25rem;
          line-height: 1.5;
          max-width: 48ch;
        }

        .hero-actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 3.5rem;
        }

        .hero-footer-facts {
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
          padding-top: 1.75rem;
          border-top: 1px solid var(--color-border);
        }

        .editorial-mini-label {
          display: block;
          font-size: var(--size-micro);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--color-muted);
          margin-bottom: 3px;
        }

        .editorial-mini-val {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text);
        }

        .hero-right-pane {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 480px;
          background: var(--color-surface);
          overflow: hidden;
        }

        .hero-photo-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .hero-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          will-change: transform;
        }

        @media (max-width: 960px) {
          .hero-split-layout {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
          }
          .hero-right-pane {
            order: -1;
            height: clamp(260px, 42vw, 360px);
            min-height: auto;
            border-bottom: 1px solid var(--color-border);
          }
          .hero-left-pane {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding: 2.25rem 1.25rem 2.75rem;
          }
          .hero-h1 {
            font-size: clamp(2.1rem, 11vw, 3.4rem);
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
            hyphens: auto;
            margin-bottom: 1rem;
          }
          .hero-sub {
            margin-bottom: 1.75rem;
          }
          .hero-actions-row {
            margin-bottom: 2.25rem;
          }
        }
      `}</style>
    </section>
  );
};
