import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteData } from '../data/site';
import { WordFillParagraph, SectionEyebrowRow } from '../components/MotionText';

export const Academy = () => {
  const data = siteData.academy;
  const academySectionRef = useRef(null);
  const stageRef = useRef(null);
  const stepsSvgRef = useRef(null);
  const progressLineRef = useRef(null);

  // 1) ONE SOURCE OF TRUTH (0 to 3)
  const [activeIndex, setActiveIndex] = useState(0);

  // References for queueing and animating
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const queueRef = useRef([]);
  const lastTransitionTimeRef = useRef(0);
  const goToRef = useRef(null);
  const scrollTriggerInstanceRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(academySectionRef);

    mm.add({
      isDesktop: '(min-width: 861px)',
      isMobile: '(max-width: 860px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isDesktop } = context.conditions;

      if (reduceMotion) {
        gsap.set('.academy-step-card, .academy-info-pane', { opacity: 1, y: 0, visibility: 'visible' });
        return;
      }

      // 5) CLEAN ENTRY INTO THE DARK SECTION: Clip-path wipe over first 60vh
      gsap.fromTo(academySectionRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: academySectionRef.current,
            start: 'top bottom',
            end: 'top 40%',
            scrub: true
          }
        }
      );

      // 6) HEADER OVER DARK SECTION: Toggle .header-dark while Academy is under header
      ScrollTrigger.create({
        trigger: academySectionRef.current,
        start: 'top 72px',
        end: 'bottom 72px',
        toggleClass: {
          targets: '.site-header',
          className: 'header-dark'
        }
      });

      // 3) goTo(i) SEQUENCE (about 1.0s total)
      const cards = gsap.utils.toArray('.academy-step-card');
      const numSteps = data.modules.length;

      // Clean Initial Setup for All Cards
      cards.forEach((card, idx) => {
        const pNum = card.querySelector('.step-anim-phase-num');
        const t = card.querySelector('.step-anim-title');
        const d = card.querySelector('.step-anim-desc');
        const dt = card.querySelector('.step-anim-detail');
        const al = card.querySelector('.step-anim-accent-line');
        const ch = card.querySelectorAll('.step-anim-chip');
        const bg = card.querySelector('.step-parallax-num');

        if (idx === 0) {
          gsap.set(card, { opacity: 1, y: 0, autoAlpha: 1, visibility: 'visible', pointerEvents: 'auto' });
          if (pNum) gsap.set(pNum, { yPercent: 0, y: 0, opacity: 1 });
          if (t) gsap.set(t, { yPercent: 0, y: 0, opacity: 1 });
          if (d) gsap.set(d, { y: 0, yPercent: 0, opacity: 1 });
          if (dt) gsap.set(dt, { y: 0, yPercent: 0, opacity: 1 });
          if (al) gsap.set(al, { scaleY: 1 });
          if (ch && ch.length) gsap.set(ch, { opacity: 1, y: 0, yPercent: 0 });
          if (bg) gsap.set(bg, { y: 0, opacity: 0.12 });
        } else {
          gsap.set(card, { opacity: 0, y: 0, autoAlpha: 0, visibility: 'hidden', pointerEvents: 'none' });
        }
      });

      const goTo = (targetIndex) => {
        if (targetIndex === currentIndexRef.current) return;
        const fromIndex = currentIndexRef.current;
        const direction = targetIndex > fromIndex ? 1 : -1;

        isTransitioningRef.current = true;
        currentIndexRef.current = targetIndex;
        setActiveIndex(targetIndex); // ONE SOURCE OF TRUTH: Updates left list, counter, rail dot at same moment

        const outgoing = cards[fromIndex];
        const incoming = cards[targetIndex];

        // Kill running tweens on all steps and set bystanders to autoAlpha 0
        cards.forEach((c, idx) => {
          gsap.killTweensOf(c);
          gsap.killTweensOf(c.querySelectorAll('*'));
          if (idx !== fromIndex && idx !== targetIndex) {
            gsap.set(c, { autoAlpha: 0, visibility: 'hidden', pointerEvents: 'none' });
          }
        });

        // Outgoing elements
        const outPhaseNum = outgoing.querySelector('.step-anim-phase-num');
        const outTitle = outgoing.querySelector('.step-anim-title');
        const outDesc = outgoing.querySelector('.step-anim-desc');
        const outDetail = outgoing.querySelector('.step-anim-detail');
        const outAccentLine = outgoing.querySelector('.step-anim-accent-line');
        const outChips = outgoing.querySelectorAll('.step-anim-chip');
        const outBigNum = outgoing.querySelector('.step-parallax-num');

        // Incoming elements
        const inPhaseNum = incoming.querySelector('.step-anim-phase-num');
        const inTitle = incoming.querySelector('.step-anim-title');
        const inDesc = incoming.querySelector('.step-anim-desc');
        const inDetail = incoming.querySelector('.step-anim-detail');
        const inAccentLine = incoming.querySelector('.step-anim-accent-line');
        const inChips = incoming.querySelectorAll('.step-anim-chip');
        const inBigNum = incoming.querySelector('.step-parallax-num');

        const tl = gsap.timeline({
          onComplete: () => {
            // Reset all transform properties on the outgoing card so it's clean for future steps
            gsap.set(outgoing, { autoAlpha: 0, visibility: 'hidden', pointerEvents: 'none' });
            if (outPhaseNum) gsap.set(outPhaseNum, { yPercent: 0, y: 0, clearProps: 'transform' });
            if (outTitle) gsap.set(outTitle, { yPercent: 0, y: 0, clearProps: 'transform' });
            if (outDesc) gsap.set(outDesc, { y: 0, yPercent: 0, clearProps: 'transform' });
            if (outDetail) gsap.set(outDetail, { y: 0, yPercent: 0, clearProps: 'transform' });
            if (outAccentLine) gsap.set(outAccentLine, { scaleY: 1, clearProps: 'transform' });
            if (outChips && outChips.length) gsap.set(outChips, { y: 0, clearProps: 'transform' });
            if (outBigNum) gsap.set(outBigNum, { y: 0, clearProps: 'transform' });

            lastTransitionTimeRef.current = Date.now();

            // Hold step for at least 500ms before advancing to next queued step
            setTimeout(() => {
              isTransitioningRef.current = false;
              if (queueRef.current.length > 0) {
                const nextTarget = queueRef.current.shift();
                if (nextTarget !== currentIndexRef.current) {
                  goTo(nextTarget);
                }
              }
            }, 500);
          }
        });

        // 1. Outgoing animation (0.35s)
        // Title and phase number slide up and out in mask
        if (outPhaseNum) {
          tl.to(outPhaseNum, {
            yPercent: direction === 1 ? -120 : 120,
            duration: 0.35,
            ease: 'power3.in'
          }, 0);
        }

        if (outTitle) {
          tl.to(outTitle, {
            yPercent: direction === 1 ? -110 : 110,
            opacity: 0,
            duration: 0.35,
            ease: 'power3.in'
          }, 0.02);
        }

        // Desc and detail fade and slide out slightly
        if (outDesc) {
          tl.to(outDesc, {
            y: direction === 1 ? -16 : 16,
            opacity: 0,
            duration: 0.32,
            ease: 'power2.in'
          }, 0.04);
        }

        if (outDetail) {
          tl.to(outDetail, {
            y: direction === 1 ? -16 : 16,
            opacity: 0,
            duration: 0.32,
            ease: 'power2.in'
          }, 0.06);
        }

        if (outAccentLine) {
          tl.to(outAccentLine, {
            scaleY: 0,
            duration: 0.25,
            ease: 'power2.in'
          }, 0.06);
        }

        if (outChips && outChips.length) {
          tl.to(outChips, {
            opacity: 0,
            y: direction === 1 ? -8 : 8,
            duration: 0.25,
            stagger: 0.03,
            ease: 'power2.in'
          }, 0.06);
        }

        if (outBigNum) {
          tl.to(outBigNum, {
            y: direction === 1 ? -35 : 35,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in'
          }, 0);
        }

        tl.set(outgoing, { autoAlpha: 0, visibility: 'hidden', pointerEvents: 'none' }, 0.38);

        // 2. Incoming animation (starts right when outgoing finishes at 0.4s)
        const inStartTime = 0.4;

        // Set incoming initial state right before animating it
        gsap.set(incoming, { autoAlpha: 1, visibility: 'visible', pointerEvents: 'auto', opacity: 1, y: 0 });

        if (inBigNum) gsap.set(inBigNum, { y: direction === 1 ? 50 : -50, yPercent: 0, opacity: 0 });
        if (inPhaseNum) gsap.set(inPhaseNum, { yPercent: direction === 1 ? 120 : -120, y: 0, opacity: 1 });
        if (inTitle) gsap.set(inTitle, { yPercent: direction === 1 ? 115 : -115, y: 0, opacity: 0 });
        if (inDesc) gsap.set(inDesc, { y: direction === 1 ? 20 : -20, yPercent: 0, opacity: 0 });
        if (inDetail) gsap.set(inDetail, { y: direction === 1 ? 20 : -20, yPercent: 0, opacity: 0 });
        if (inAccentLine) gsap.set(inAccentLine, { scaleY: 0, transformOrigin: direction === 1 ? 'top center' : 'bottom center' });
        if (inChips && inChips.length) gsap.set(inChips, { opacity: 0, y: 10, yPercent: 0 });

        // Animate incoming elements
        if (inBigNum) {
          tl.to(inBigNum, {
            y: 0,
            yPercent: 0,
            opacity: 0.12,
            duration: 0.75,
            ease: 'power3.out'
          }, inStartTime);
        }

        // Phase number rolls in from below inside an overflow-hidden mask (0.6s, power4.out)
        if (inPhaseNum) {
          tl.to(inPhaseNum, {
            yPercent: 0,
            y: 0,
            duration: 0.6,
            ease: 'power4.out'
          }, inStartTime);
        }

        // Title lines slide up from mask (0.7s)
        if (inTitle) {
          tl.to(inTitle, {
            yPercent: 0,
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out'
          }, inStartTime + 0.05);
        }

        // Description and detail line fade up 20px (0.6s)
        if (inDesc) {
          tl.to(inDesc, {
            y: 0,
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out'
          }, inStartTime + 0.12);
        }

        if (inDetail) {
          tl.to(inDetail, {
            y: 0,
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out'
          }, inStartTime + 0.18);
        }

        // Vertical accent line draws down left of detail text
        if (inAccentLine) {
          tl.to(inAccentLine, {
            scaleY: 1,
            duration: 0.5,
            ease: 'power2.out'
          }, inStartTime + 0.22);
        }

        // Small label chips fade in last
        if (inChips && inChips.length) {
          tl.to(inChips, {
            opacity: 1,
            y: 0,
            yPercent: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out'
          }, inStartTime + 0.3);
        }
      };

      goToRef.current = goTo;

      // 2) EVERY STEP MUST BE SEEN: Minimum dwell of 500ms per step & single-step queueing
      const requestStep = (target) => {
        if (target === currentIndexRef.current && queueRef.current.length === 0) return;

        const now = Date.now();
        const timeSinceLast = now - lastTransitionTimeRef.current;

        if (isTransitioningRef.current || timeSinceLast < 500) {
          const currentDest = queueRef.current.length > 0 ? queueRef.current[queueRef.current.length - 1] : currentIndexRef.current;
          if (target === currentDest) return;

          const stepDir = target > currentDest ? 1 : -1;
          const nextInQueue = currentDest + stepDir;

          // If direction changed, reset queue towards new target
          if (queueRef.current.length > 0) {
            const existingDir = queueRef.current[0] > currentIndexRef.current ? 1 : -1;
            if (existingDir !== stepDir) {
              queueRef.current = [];
            }
          }

          if (nextInQueue >= 0 && nextInQueue < numSteps && !queueRef.current.includes(nextInQueue)) {
            queueRef.current.push(nextInQueue);
          }
          return;
        }

        // Advance 1 step towards target to ensure intermediate steps are seen
        const stepDir = target > currentIndexRef.current ? 1 : -1;
        const nextStep = currentIndexRef.current + stepDir;
        goTo(nextStep);
      };

      // 1) ONE SCROLLTRIGGER, NO SNAP
      if (isDesktop && stageRef.current) {
        const st = ScrollTrigger.create({
          trigger: stageRef.current,
          pin: true,
          anticipatePin: 1,
          start: 'top top',
          end: () => '+=' + (numSteps * 100) + '%',
          onUpdate: (self) => {
            // Continuous progress line
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleX(${Math.max(0.04, self.progress)})`;
            }

            const targetIdx = Math.min(numSteps - 1, Math.floor(self.progress * numSteps));
            requestStep(targetIdx);
          }
        });

        scrollTriggerInstanceRef.current = st;
      }

      // "How to join": SVG line draws through the three steps as you scroll
      if (stepsSvgRef.current) {
        gsap.fromTo(stepsSvgRef.current,
          { strokeDashoffset: 300 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.academy-steps-list',
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: true
            }
          }
        );
      }
    });

    return () => mm.revert();
  }, [data.modules.length]);

  // Click handler for left list items: scrolls with lenis.scrollTo (1.2s easeInOut), then goTo(i)
  const handleStepClick = (targetIdx) => {
    const st = scrollTriggerInstanceRef.current;
    if (st && window.lenis) {
      const scrollPos = st.start + ((targetIdx + 0.25) / data.modules.length) * (st.end - st.start);
      window.lenis.scrollTo(scrollPos, {
        duration: 1.2,
        easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      });
      if (goToRef.current) {
        goToRef.current(targetIdx);
      }
    } else if (goToRef.current) {
      goToRef.current(targetIdx);
    } else {
      setActiveIndex(targetIdx);
    }
  };

  return (
    <section
      id="academy"
      className="section-dark academy-root-section"
      ref={academySectionRef}
      aria-labelledby="academy-title"
    >
      <div className="container academy-container-top">
        <SectionEyebrowRow label={data.eyebrow} num={data.num} />

        {/* Section Header */}
        <div className="academy-hero-grid">
          <div className="academy-header-text">
            <h2 id="academy-title" className="academy-main-title">
              {data.headline}
            </h2>
            <WordFillParagraph style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.35rem)', color: 'var(--color-dark-muted)', lineHeight: '1.5' }}>
              {data.intro}
            </WordFillParagraph>
          </div>
        </div>
      </div>

      {/* 4) PINNED STAGE THAT FITS THE VIEWPORT (100svh, padding-top: header, align-content: center) */}
      <div className="academy-stage-wrapper" ref={stageRef}>
        <div className="container academy-stage-inner">
          {/* Header row inside stage: label & single-source counter */}
          <div className="academy-stage-header-row">
            <span className="section-label" style={{ color: 'var(--color-dark-muted)', marginBottom: 0 }}>
              What you can learn
            </span>
            <span className="academy-step-counter" aria-live="polite">
              0{activeIndex + 1} / 0{data.modules.length}
            </span>
          </div>

          {/* Continuous progress track line */}
          <div className="academy-progress-bar-wrap" aria-hidden="true">
            <div className="academy-progress-bar-fill" ref={progressLineRef}></div>
          </div>

          {/* Main 2-column stage layout */}
          <div className="academy-stage-grid">
            {/* Left list: 4 items with highlight & clickable to scroll */}
            <div className="academy-stepper-nav" role="tablist" aria-label="Course modules">
              <div className="academy-rail-track" aria-hidden="true">
                <div
                  className="academy-rail-dot"
                  style={{
                    transform: `translateY(${activeIndex * 100}%)`
                  }}
                ></div>
              </div>

              {data.modules.map((m, idx) => (
                <button
                  key={m.num}
                  type="button"
                  role="tab"
                  id={`academy-tab-${idx}`}
                  aria-selected={activeIndex === idx}
                  aria-controls={`academy-panel-${idx}`}
                  className={`academy-stepper-btn ${activeIndex === idx ? 'active' : ''}`}
                  onClick={() => handleStepClick(idx)}
                >
                  <span className="stepper-dot-indicator"></span>
                  <span className="stepper-label">
                    <strong>{m.num}</strong> {m.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: Pinned card stage with 4 steps stacked in the same grid cell */}
            <div className="academy-card-stage">
              {data.modules.map((m, idx) => (
                <div
                  key={m.num}
                  id={`academy-panel-${idx}`}
                  role="tabpanel"
                  aria-labelledby={`academy-tab-${idx}`}
                  className="academy-step-card"
                >
                  {/* Faint outlined background numeral for parallax */}
                  <span className="step-parallax-num" aria-hidden="true">
                    {m.num}
                  </span>

                  <div className="academy-step-card-inner">
                    {/* Phase number inside overflow-hidden mask */}
                    <div className="step-mask-wrap step-badge-mask">
                      <div className="academy-step-badge-row step-anim-phase-num">
                        <span className="academy-step-giant-num">{m.num}</span>
                        <span className="academy-step-tag">Phase {m.num}</span>
                      </div>
                    </div>

                    {/* Title inside overflow-hidden mask */}
                    <div className="step-mask-wrap step-title-mask">
                      <h3 className="academy-step-card-title step-anim-title">
                        {m.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="academy-step-card-desc step-anim-desc">
                      {m.description}
                    </p>

                    {/* Detail with vertical accent line */}
                    {m.detail && (
                      <div className="step-detail-container">
                        <div className="step-anim-accent-line" aria-hidden="true"></div>
                        <p className="academy-step-card-detail step-anim-detail">
                          {m.detail}
                        </p>
                      </div>
                    )}

                    {/* Small chips */}
                    <div className="academy-step-footer-meta">
                      <span className="step-anim-chip">Hands-on chair training</span>
                      <span className="step-anim-chip">Real salon environment</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post-Pinned Editorial Details: Who it's for & How to join */}
      <div className="container academy-container-bottom">
        <div className="academy-bottom-grid">
          <div className="academy-info-pane">
            <span className="section-label" style={{ color: 'var(--color-dark-muted)' }}>Who It's For</span>
            <p className="academy-focus-text">{data.whoItsFor}</p>
          </div>

          <div className="academy-info-pane">
            <span className="section-label" style={{ color: 'var(--color-dark-muted)' }}>How To Join</span>
            <div className="academy-steps-list-wrap">
              <svg className="academy-steps-svg-line" viewBox="0 0 4 200" fill="none" preserveAspectRatio="none">
                <path
                  ref={stepsSvgRef}
                  d="M2 0 L2 200"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  strokeDasharray="300"
                  strokeDashoffset="300"
                />
              </svg>

              <div className="academy-steps-list">
                {data.howToJoin.map((s) => (
                  <div key={s.step} className="academy-step-item">
                    <span className="academy-step-num">0{s.step}</span>
                    <span className="academy-step-title">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Closing Action Footer */}
        <div className="academy-action-footer">
          <div>
            <p className="academy-closing-line">{data.closingLine}</p>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-dark-muted)' }}>
              Direct message to academy coordinator on Necklace Road, Ranpise Nagar
            </span>
          </div>

          <a
            href={siteData.links.whatsappAcademy}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
            aria-label="Enquire on WhatsApp about the academy"
          >
            <span>Enquire on WhatsApp</span>
            <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>

      <style>{`
        /* 5) CLEAN ENTRY INTO DARK SECTION */
        .academy-root-section {
          background-color: #141211;
          color: #FAF8F5;
          position: relative;
          z-index: 10;
          overflow: visible;
        }

        .academy-container-top {
          padding-top: clamp(4rem, 8vw, 7rem);
          padding-bottom: 2rem;
        }

        .academy-container-bottom {
          padding-top: 4rem;
          padding-bottom: clamp(4rem, 8vw, 7rem);
        }

        .academy-hero-grid {
          margin-bottom: 1.5rem;
        }

        .academy-header-text {
          max-width: 820px;
        }

        .academy-main-title {
          font-family: var(--font-serif);
          font-size: clamp(2.25rem, 4.5vw, 4rem);
          line-height: 1.08;
          margin-bottom: 1.25rem;
          color: var(--color-dark-text);
          font-weight: 400;
        }

        /* 4) PINNED STAGE THAT FITS THE VIEWPORT */
        .academy-stage-wrapper {
          height: 100svh;
          max-height: 100vh;
          box-sizing: border-box;
          padding-top: var(--header-height, 72px);
          display: grid;
          align-content: center;
          position: relative;
          width: 100%;
        }

        .academy-stage-inner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-height: calc(100svh - var(--header-height, 72px) - 24px);
        }

        .academy-stage-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .academy-step-counter {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-accent);
          letter-spacing: 0.04em;
        }

        /* Continuous progress line */
        .academy-progress-bar-wrap {
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: clamp(1.25rem, 2.5vh, 2rem);
          overflow: hidden;
        }

        .academy-progress-bar-fill {
          height: 100%;
          width: 100%;
          background: var(--color-accent);
          transform-origin: left center;
          transform: scaleX(0.04);
        }

        /* 2-Column Grid Layout */
        .academy-stage-grid {
          display: grid;
          grid-template-columns: 310px 1fr;
          gap: clamp(2rem, 4vw, 4rem);
          align-items: center;
        }

        /* Left Stepper List */
        .academy-stepper-nav {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(0.75rem, 2vh, 1.5rem);
          padding-left: 2rem;
        }

        .academy-rail-track {
          position: absolute;
          left: 6px;
          top: 0.6rem;
          bottom: 0.6rem;
          width: 2px;
          background: rgba(255, 255, 255, 0.12);
        }

        .academy-stepper-btn {
          position: relative;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 0.5rem 0;
          color: var(--color-dark-muted);
          transition: color 0.25s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .academy-stepper-btn:hover {
          color: var(--color-dark-text);
        }

        .academy-stepper-btn.active {
          color: var(--color-dark-text);
        }

        .stepper-dot-indicator {
          position: absolute;
          left: -2rem;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #141211;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: border-color 0.25s ease, background-color 0.25s ease, transform 0.25s ease;
        }

        .academy-stepper-btn.active .stepper-dot-indicator {
          border-color: var(--color-accent);
          background: var(--color-accent);
          transform: translateY(-50%) scale(1.15);
        }

        .stepper-label {
          font-size: clamp(0.95rem, 1.2vw, 1.05rem);
          display: flex;
          gap: 0.65rem;
          align-items: baseline;
          line-height: 1.35;
        }

        .stepper-label strong {
          font-family: var(--font-serif);
          color: var(--color-accent);
        }

        /* Right Step Cards Stack */
        .academy-card-stage {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          min-height: clamp(340px, 46vh, 440px);
          overflow: hidden;
          background: #1E1B19;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* 4 steps stacked in the same grid cell */
        .academy-step-card {
          grid-area: 1 / 1;
          padding: clamp(2rem, 3.5vw, 3.25rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          background-color: #1E1B19;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Faint outlined background numeral for parallax */
        .step-parallax-num {
          position: absolute;
          right: 2rem;
          bottom: -1rem;
          font-family: var(--font-serif);
          font-size: clamp(9rem, 18vw, 15rem);
          font-weight: 300;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.06);
          pointer-events: none;
          user-select: none;
          z-index: 0;
          opacity: 0.12;
        }

        .academy-step-card-inner {
          position: relative;
          z-index: 1;
          max-width: 600px;
        }

        .step-mask-wrap {
          overflow: hidden;
        }

        .academy-step-badge-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .academy-step-giant-num {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 4.5vw, 3.5rem);
          line-height: 1;
          color: var(--color-accent);
          font-weight: 300;
        }

        .academy-step-tag {
          font-size: var(--size-micro);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--color-dark-muted);
        }

        .academy-step-card-title {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 2.8vw, 2.35rem);
          color: var(--color-dark-text);
          margin-bottom: 0.85rem;
          line-height: 1.15;
          font-weight: 400;
        }

        .academy-step-card-desc {
          font-size: clamp(1rem, 1.25vw, 1.125rem);
          line-height: 1.55;
          color: var(--color-dark-muted);
          margin-bottom: 1.25rem;
        }

        .step-detail-container {
          position: relative;
          padding-left: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .step-anim-accent-line {
          position: absolute;
          left: 0;
          top: 2px;
          bottom: 2px;
          width: 2px;
          background: var(--color-accent);
          transform-origin: top center;
        }

        .academy-step-card-detail {
          font-size: 0.95rem;
          color: rgba(250, 248, 245, 0.78);
          line-height: 1.5;
          margin: 0;
        }

        .academy-step-footer-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .step-anim-chip {
          font-size: 0.78rem;
          color: var(--color-dark-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.35rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Post-pinned grid */
        .academy-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          padding-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 3.5rem;
        }

        .academy-focus-text {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: inherit;
          line-height: 1.4;
          max-width: 38ch;
        }

        .academy-steps-list-wrap {
          position: relative;
          padding-left: 1.5rem;
        }

        .academy-steps-svg-line {
          position: absolute;
          left: 0;
          top: 0.5rem;
          bottom: 0.5rem;
          width: 4px;
          height: calc(100% - 1rem);
        }

        .academy-steps-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .academy-step-item {
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .academy-step-num {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--color-accent);
        }

        .academy-step-title {
          font-size: 1.05rem;
          color: inherit;
        }

        .academy-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.75rem;
          padding: 2.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .academy-closing-line {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-dark-text);
          margin-bottom: 0.35rem;
        }

        /* 8) FALLBACKS: Mobile & prefers-reduced-motion (no pinning, stacked list) */
        @media (max-width: 860px) {
          .academy-stage-wrapper {
            height: auto;
            max-height: none;
            padding-top: 0;
            display: block;
          }
          .academy-stage-inner {
            max-height: none;
          }
          .academy-stage-grid {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .academy-stepper-nav {
            display: none;
          }
          .academy-progress-bar-wrap {
            display: none;
          }
          .academy-card-stage {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            min-height: auto;
            background: transparent;
            border: none;
          }
          .academy-step-card {
            position: relative;
            inset: auto;
            transform: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            display: flex !important;
            background: #1E1B19;
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 1.75rem 1.5rem;
          }
          .step-anim-text, .step-anim-desc, .step-anim-detail, .step-anim-title, .step-anim-phase-num, .step-anim-chip {
            opacity: 1 !important;
            transform: none !important;
          }
          .step-anim-accent-line {
            transform: scaleY(1) !important;
          }
          .academy-bottom-grid {
            grid-template-columns: 1fr;
          }
          .academy-action-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
};
