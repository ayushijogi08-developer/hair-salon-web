import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';

export const Footer = () => {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    const wordmark = wordmarkRef.current;
    if (!el || !wordmark) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmark,
        {
          y: '60%',
          opacity: 0.1
        },
        {
          y: '0%',
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom bottom',
            scrub: 1.2
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
        padding: 'clamp(3.5rem, 7vw, 6rem) 0 2rem',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          {/* Brand Col */}
          <div>
            <span className="brand-title" style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>{siteData.name}</span>
            <span className="brand-subtitle" style={{ display: 'block', marginBottom: '1rem' }}>{siteData.branch}</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
              Salon services and academy training under one roof on Necklace Road, Ranpise Nagar, Akola.
            </p>
          </div>

          {/* Quick Contact Col */}
          <div>
            <span className="editorial-label" style={{ marginBottom: '1rem' }}>Contact</span>
            <p className="footer-contact-item" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              <strong>Phone:</strong> <a href={`tel:${siteData.phoneRaw}`} className="footer-contact-link" style={{ textDecoration: 'underline' }}>{siteData.phone}</a>
            </p>
            <p className="footer-contact-item" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              <strong>WhatsApp:</strong> <a href={siteData.links.whatsappGeneral} target="_blank" rel="noopener noreferrer" className="footer-contact-link" style={{ textDecoration: 'underline' }}>Chat on WhatsApp</a>
            </p>
            <p className="footer-contact-item" style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
              <strong>Instagram:</strong> <a href={siteData.links.instagram} target="_blank" rel="noopener noreferrer" className="footer-contact-link" style={{ textDecoration: 'underline' }}>@_hair_city_salon</a>
            </p>
          </div>

          {/* Hours & Address Col */}
          <div>
            <span className="editorial-label" style={{ marginBottom: '1rem' }}>Hours & Location</span>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              {siteData.hours.days}: {siteData.hours.time}
            </p>
            <address style={{ fontStyle: 'normal', fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>
              {siteData.address.line1}, {siteData.address.line2}, {siteData.address.city} {siteData.address.pincode}
            </address>
          </div>
        </div>

        {/* Giant Rising HAIR CITY Wordmark */}
        <div
          style={{
            overflow: 'hidden',
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'clamp(1rem, 2vw, 2rem)',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}
        >
          <div
            ref={wordmarkRef}
            className="footer-giant-wordmark"
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3.5rem, 15vw, 13rem)',
              lineHeight: 0.85,
              fontWeight: 400,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#D9D1C6',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              willChange: 'transform, opacity'
            }}
          >
            HAIR CITY
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          <span>© 2026 {siteData.name}. All rights reserved.</span>
          <span>Akola, Maharashtra, India</span>
        </div>
      </div>
    </footer>
  );
};

