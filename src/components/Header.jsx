import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ctaBtnRef = useRef(null);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 60) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setHeaderVisible(false); // Scrolling down
      } else if (currentScrollY < lastScrollY.current - 8) {
        setHeaderVisible(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  // Magnetic button on desktop for header CTA
  useEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn || window.innerWidth <= 860) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
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

  return (
    <header className={`site-header ${headerVisible ? 'header-shown' : 'header-hidden'}`} role="banner">
      <div className="container header-inner">
        <a href="#hero" className="brand-title" aria-label="Hair City Salon & Academy Home">
          <span>Hair City</span>
          <span className="brand-subtitle">Salon & Academy · Akola</span>
        </a>

        {/* Nav: Salon, Academy, Work, Visit with underline sweep from left */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <a href="#services" className="nav-link nav-link-sweep">Salon</a>
          <a href="#academy" className="nav-link nav-link-sweep">Academy</a>
          <a href="#work" className="nav-link nav-link-sweep">Work</a>
          <a href="#visit" className="nav-link nav-link-sweep">Visit</a>
        </nav>

        {/* Header Action: Sliding Colour Block on Hover */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            ref={ctaBtnRef}
            href={siteData.links.whatsappGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-slide-fill header-cta"
            aria-label="Enquire on WhatsApp"
          >
            <span className="btn-slide-bg" aria-hidden="true"></span>
            <span className="btn-label-text">Enquire</span>
            <span className="btn-arrow">→</span>
          </a>

          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Full-Screen Accessible Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div
            id="mobile-navigation"
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="brand-title">Hair City</span>
                <button
                  type="button"
                  className="mobile-drawer-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <nav className="mobile-drawer-nav">
                <a href="#services" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>Salon</a>
                <a href="#academy" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>Academy</a>
                <a href="#work" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>Work</a>
                <a href="#visit" className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>Visit</a>
              </nav>
            </div>

            <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem', color: 'var(--color-muted)' }}>
                Blackberry Complex, Ranpise Nagar, Akola<br />
                Mon–Sun: 9:00 AM – 10:00 PM
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={`tel:${siteData.phoneRaw}`}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Call {siteData.phone}
                </a>
                <a
                  href={siteData.links.whatsappGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
