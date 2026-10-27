import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { canHover } from '../lib/motion';

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

  // Set html[data-header='shown' | 'hidden'] attribute for dependent sticky elements
  useEffect(() => {
    document.documentElement.dataset.header = headerVisible ? 'shown' : 'hidden';
  }, [headerVisible]);

  const toggleBtnRef = useRef(null);
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const prevFocusedRef = useRef(null);

  // Focus trap, initial focus, and Escape handling for mobile drawer
  useEffect(() => {
    if (!menuOpen) {
      if (prevFocusedRef.current) {
        prevFocusedRef.current.focus?.();
        prevFocusedRef.current = null;
      }
      document.body.style.overflow = '';
      window.lenis?.start();
      return;
    }

    // Menu opened
    prevFocusedRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    window.lenis?.stop();

    // Move focus into drawer
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.lenis?.start();
    };
  }, [menuOpen]);

  // Magnetic button on desktop for header CTA
  useEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn || !canHover()) return;

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

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.body.style.overflow = '';
    window.lenis?.start();

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    requestAnimationFrame(() => {
      if (window.lenis) {
        window.lenis.scrollTo(targetEl, {
          offset: -72,
          duration: 1.2
        });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.pushState(null, '', href);
    });
  };

  return (
    <header className={`site-header ${headerVisible ? 'header-shown' : 'header-hidden'}`}>
      <div className="container header-inner">
        <a href="#hero" className="brand-title">
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
            ref={toggleBtnRef}
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

      {/* Full-Screen Accessible Mobile Drawer portaled to document.body */}
      {menuOpen && typeof document !== 'undefined' && createPortal(
        <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div
            ref={drawerRef}
            id="mobile-navigation"
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="mobile-drawer-header">
                <a
                  href="#hero"
                  className="brand-title"
                  onClick={(e) => handleNavClick(e, '#hero')}
                  aria-label="Hair City Home"
                >
                  <span>Hair City</span>
                  <span className="brand-subtitle">Salon & Academy · Akola</span>
                </a>
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="mobile-nav-toggle mobile-drawer-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <nav className="mobile-drawer-nav">
                <a
                  href="#services"
                  className="mobile-drawer-link"
                  onClick={(e) => handleNavClick(e, '#services')}
                >
                  Salon
                </a>
                <a
                  href="#academy"
                  className="mobile-drawer-link"
                  onClick={(e) => handleNavClick(e, '#academy')}
                >
                  Academy
                </a>
                <a
                  href="#work"
                  className="mobile-drawer-link"
                  onClick={(e) => handleNavClick(e, '#work')}
                >
                  Work
                </a>
                <a
                  href="#visit"
                  className="mobile-drawer-link"
                  onClick={(e) => handleNavClick(e, '#visit')}
                >
                  Visit
                </a>
              </nav>
            </div>

            <div className="mobile-drawer-footer">
              <p style={{ fontSize: '0.8125rem', marginBottom: '1rem', color: 'var(--color-muted)' }}>
                {siteData.hours.days}: {siteData.hours.time}
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
        </div>,
        document.body
      )}
    </header>
  );
};
