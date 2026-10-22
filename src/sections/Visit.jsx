import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { WordFillParagraph } from '../components/MotionText';

export const Visit = () => {
  const [mapActive, setMapActive] = useState(false);
  const visitRef = useRef(null);
  const magneticCtaRef = useRef(null);

  // Desktop magnetic button effect (6 to 8px pull)
  useEffect(() => {
    const btn = magneticCtaRef.current;
    if (!btn || window.innerWidth <= 860) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(visitRef);

    mm.add({
      isDesktop: '(min-width: 861px)',
      isMobile: '(max-width: 860px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isDesktop } = context.conditions;

      if (reduceMotion) {
        gsap.set('.visit-pane, .visit-map-container, .visit-closing-banner', { opacity: 1 });
        return;
      }

      // Animate only transform and opacity
      gsap.from('.visit-pane', {
        y: isDesktop ? 35 : 20,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.visit-editorial-grid',
          start: 'top 85%'
        }
      });

      gsap.from('.visit-closing-banner', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.visit-closing-banner',
          start: 'top 85%'
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="visit" className="section" ref={visitRef} aria-labelledby="visit-title">
      <div className="container">
        {/* Editorial Section Header */}
        <div style={{ maxWidth: '640px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <span className="section-label">Visit & Inquiries</span>
          <h2 id="visit-title" style={{ marginBottom: '1rem' }}>
            Ranpise Nagar, Akola
          </h2>
          <WordFillParagraph style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)', lineHeight: '1.5' }}>
            Drop by for a consultation, book via WhatsApp, or call directly for immediate chair availability.
          </WordFillParagraph>
        </div>

        {/* Minimal Editorial Columns (No Drop Shadows, Clean Thin Borders) */}
        <div className="visit-editorial-grid">
          {/* Col 1: Hours */}
          <div className="visit-pane">
            <span className="editorial-label">Hours</span>
            <div className="visit-pane-content">
              <span className="visit-highlight">{siteData.hours.days}</span>
              <span className="visit-hours">{siteData.hours.time}</span>
              <p className="visit-note">Open daily, including weekends.</p>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              <a
                href={`tel:${siteData.phoneRaw}`}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Call {siteData.phone}
              </a>
            </div>
          </div>

          {/* Col 2: Address & Directions */}
          <div className="visit-pane">
            <span className="editorial-label">Studio Address</span>
            <div className="visit-pane-content">
              <address style={{ fontStyle: 'normal', fontSize: '1rem', lineHeight: '1.5', color: 'var(--color-text)' }}>
                <strong>{siteData.name}</strong><br />
                {siteData.address.line1}<br />
                {siteData.address.line2}<br />
                {siteData.address.city}, {siteData.address.state} — {siteData.address.pincode}
              </address>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href={siteData.links.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Directions →
              </a>
              <a
                href={siteData.links.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', textAlign: 'center', textDecoration: 'underline' }}
              >
                View on Google Maps
              </a>
            </div>
          </div>

          {/* Col 3: Enquiries */}
          <div className="visit-pane">
            <span className="editorial-label">Direct Communication</span>
            <div className="visit-pane-content">
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '1rem' }}>
                Quick response on WhatsApp for haircut appointments, hair colour consultations, or academy admissions.
              </p>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={siteData.links.whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Enquire on WhatsApp
              </a>
              <a
                href={siteData.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Instagram @_hair_city_salon
              </a>
            </div>
          </div>
        </div>

        {/* Large Closing Banner ("Come in for a cut. Stay to learn.") with Magnetic WhatsApp Button */}
        <div className="visit-closing-banner">
          <div className="visit-closing-text-wrap">
            <h3 className="visit-closing-h3">
              Come in for a cut. <span className="italic-serif">Stay to learn.</span>
            </h3>
            <p className="visit-closing-sub">
              Experience salon styling or take your first step into professional hair education on Necklace Road.
            </p>
          </div>

          <div className="visit-closing-action">
            <a
              ref={magneticCtaRef}
              href={siteData.links.whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary visit-magnetic-btn"
              aria-label="Enquire on WhatsApp"
            >
              <span>Enquire on WhatsApp</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Restyled Embedded Map with Grayscale Filter & Click-to-Activate Layer */}
        <div className="visit-map-container">
          <div
            className={`map-activation-layer ${mapActive ? 'active' : ''}`}
            onClick={() => setMapActive(true)}
            onMouseLeave={() => setMapActive(false)}
            role="region"
            aria-label="Interactive map"
          >
            {!mapActive && (
              <div className="map-activate-prompt">
                <span className="map-prompt-badge">Click map to interact</span>
              </div>
            )}
            <iframe
              title="Hair City Salon & Academy Location"
              src={`https://maps.google.com/maps?q=${siteData.coordinates.lat},${siteData.coordinates.lng}&hl=en&z=16&output=embed`}
              width="100%"
              height="360"
              style={{
                border: 0,
                display: 'block',
                filter: 'grayscale(0.85) contrast(1.1) brightness(0.98)',
                pointerEvents: mapActive ? 'auto' : 'none'
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <style>{`
        .visit-editorial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: clamp(1.5rem, 3vw, 2.5rem);
        }

        .visit-pane {
          display: flex;
          flex-direction: column;
          padding: clamp(1.5rem, 2.5vw, 2.25rem);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
        }

        .editorial-label {
          display: block;
          font-size: var(--size-micro);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--color-muted);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-border-light);
        }

        .visit-highlight {
          display: block;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--color-text);
          margin-bottom: 0.25rem;
        }

        .visit-hours {
          display: block;
          font-size: 1.1rem;
          color: var(--color-accent);
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .visit-note {
          font-size: 0.8125rem;
          color: var(--color-muted);
        }

        /* Large Closing Line Banner */
        .visit-closing-banner {
          margin-top: clamp(3rem, 6vw, 5rem);
          padding: clamp(2rem, 4vw, 3.5rem);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .visit-closing-h3 {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          line-height: 1.15;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .visit-closing-sub {
          font-size: 1rem;
          color: var(--color-muted);
          max-width: 48ch;
        }

        .visit-magnetic-btn {
          padding: 1.15rem 2.25rem;
          font-size: 0.9375rem;
        }

        .visit-map-container {
          margin-top: 3.5rem;
          position: relative;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          border-radius: 0 !important;
          overflow: hidden;
        }

        .map-activation-layer {
          position: relative;
          cursor: pointer;
        }

        .map-activate-prompt {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(250, 248, 245, 0.4);
          backdrop-filter: blur(2px);
          z-index: 5;
          pointer-events: none;
          transition: opacity var(--transition-fast);
        }

        .map-prompt-badge {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-text);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          padding: 0.6rem 1.25rem;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 12px rgba(20, 18, 17, 0.08);
        }
      `}</style>
    </section>
  );
};
