import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { Preloader } from './components/Preloader';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Marquee } from './components/Marquee';
import { ServicesOverview } from './sections/ServicesOverview';
import { CuttingSection } from './sections/CuttingSection';
import { ColourSection } from './sections/ColourSection';
import { TreatmentsSection } from './sections/TreatmentsSection';
import { Pricing } from './sections/Pricing';
import { Academy } from './sections/Academy';
import { Work } from './sections/Work';
import { BeforeAfter } from './sections/BeforeAfter';
import { Team } from './sections/Team';
import { Reviews } from './sections/Reviews';
import { FAQ } from './sections/FAQ';
import { Visit } from './sections/Visit';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { initMagnetic } from './lib/magnetic';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

export function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Initialize Lenis smooth scroll and connect with ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      orientation: 'vertical',
      gestureOrientation: 'vertical'
    });

    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // Update scroll progress bar
    const progressLine = document.getElementById('scroll-progress-indicator');
    lenis.on('scroll', (e) => {
      if (progressLine) {
        const progress = e.progress || 0;
        progressLine.style.transform = `scaleX(${progress})`;
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Anchor links smooth scroll with header offset
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, {
          offset: -72, // Header height offset
          duration: 1.2
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  // Initialize desktop magnetic button interaction (independent of Lenis)
  useEffect(() => initMagnetic('.btn-primary'), []);

  // Call ScrollTrigger.refresh() after all images load and on window load
  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoad);

    // Refresh after fonts load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Refresh after DOM content & images settle
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      ScrollTrigger.refresh();
    } else {
      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
          if (loadedCount === totalImages) ScrollTrigger.refresh();
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === totalImages) ScrollTrigger.refresh();
          });
          img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount === totalImages) ScrollTrigger.refresh();
          });
        }
      });
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div id="scroll-progress-indicator" aria-hidden="true"></div>
      {!preloaderDone && (
        <Preloader
          onComplete={() => {
            setPreloaderDone(true);
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }}
        />
      )}
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Marquee />
        <ServicesOverview />
        <CuttingSection />
        <ColourSection />
        <TreatmentsSection />
        <Pricing />
        <Academy />
        <Work />
        <BeforeAfter />
        <Team />
        <Reviews />
        <FAQ />
        <Visit />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}

export default App;
