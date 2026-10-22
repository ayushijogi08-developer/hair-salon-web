import React, { useState, useEffect } from 'react';
import { siteData } from '../data/site';

export const MobileStickyBar = () => {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after the hero section (approx 450px or when hero scrolls past)
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        setShowBar(rect.bottom < 150);
      } else {
        setShowBar(window.scrollY > 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      className={`mobile-bottom-bar ${showBar ? 'visible' : ''}`}
      aria-label="Quick Actions"
      aria-hidden={!showBar}
    >
      <div className="mobile-bottom-bar-inner">
        <a
          href={`tel:${siteData.phoneRaw}`}
          className="mobile-bar-btn btn-secondary"
          aria-label="Call Hair City Salon"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Call Salon
        </a>

        <a
          href={siteData.links.whatsappGeneral}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-bar-btn btn-primary"
          aria-label="Enquire on WhatsApp"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          WhatsApp
        </a>
      </div>
    </aside>
  );
};
