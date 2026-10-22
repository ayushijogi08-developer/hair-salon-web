import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { siteData } from '../data/site';
import { WordFillParagraph, SectionEyebrowRow } from '../components/MotionText';

export const Work = () => {
  const [activePhoto, setActivePhoto] = useState(null);
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const cursorRef = useRef(null);
  const thumbnailRefs = useRef({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag-to-scroll tracking
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);

  // Category filtering & scroller state
  const allPhotos = siteData.images.work;
  const [filterCategory, setFilterCategory] = useState('all');

  const photos = React.useMemo(() => {
    if (filterCategory === 'all') return allPhotos;
    return allPhotos.filter(p => p.category === filterCategory);
  }, [allPhotos, filterCategory]);

  const boysCount = allPhotos.filter(p => p.category === 'boys').length;
  const girlsCount = allPhotos.filter(p => p.category === 'girls').length;

  const handleFilterChange = (category) => {
    if (category === filterCategory) return;
    setFilterCategory(category);
    setActiveIndex(0);
    setScrollProgress(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const closeLightbox = React.useCallback(() => {
    const lastId = activePhoto?.id;
    setActivePhoto(null);
    if (lastId && thumbnailRefs.current[lastId]) {
      thumbnailRefs.current[lastId].focus();
    }
  }, [activePhoto]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activePhoto) {
        closeLightbox();
      } else if (e.key === 'ArrowRight' && activePhoto) {
        const currentIdx = photos.findIndex(p => p.id === activePhoto.id);
        const nextIdx = (currentIdx + 1) % photos.length;
        setActivePhoto(photos[nextIdx]);
      } else if (e.key === 'ArrowLeft' && activePhoto) {
        const currentIdx = photos.findIndex(p => p.id === activePhoto.id);
        const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
        setActivePhoto(photos[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, closeLightbox, photos]);

  // Update scroller buttons & continuous progress
  const updateScrollState = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;

    setCanScrollLeft(current > 8);
    setCanScrollRight(current < maxScroll - 8);

    if (maxScroll > 0) {
      const prog = Math.min(1, Math.max(0, current / maxScroll));
      setScrollProgress(prog);
      const idx = Math.min(photos.length - 1, Math.round(prog * (photos.length - 1)));
      setActiveIndex(idx);
    } else {
      setScrollProgress(0);
      setActiveIndex(0);
    }
  }, [photos.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    updateScrollState();

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Desktop Mouse Drag Scrolling (cursor: grab -> grabbing, no accidental click if moved)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onMouseDown = (e) => {
      if (window.innerWidth <= 860) return;
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.pageX - el.offsetLeft;
      scrollStartLeftRef.current = el.scrollLeft;
      el.classList.add('is-dragging');
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startXRef.current) * 1.5;
      if (Math.abs(walk) > 4) {
        hasMovedRef.current = true;
      }
      el.scrollLeft = scrollStartLeftRef.current - walk;
    };

    const onMouseUpOrLeave = () => {
      isDraggingRef.current = false;
      el.classList.remove('is-dragging');
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUpOrLeave);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUpOrLeave);
    };
  }, []);

  // Convert vertical mouse-wheel to sideways movement only while pointer is over gallery
  // and only when it can still scroll in that direction; otherwise let page scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (window.innerWidth <= 860) return;
      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const current = el.scrollLeft;

      // Scrolling right (wheel down) and not at end
      if (delta > 0 && current < maxScroll - 2) {
        e.preventDefault();
        el.scrollLeft += delta;
      } else if (delta < 0 && current > 2) {
        // Scrolling left (wheel up) and not at start
        e.preventDefault();
        el.scrollLeft += delta;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Floating "View" label that follows the pointer inside the gallery container
  useEffect(() => {
    const galleryEl = galleryRef.current;
    const cursor = cursorRef.current;
    if (!galleryEl || !cursor || window.innerWidth <= 860) return;

    const handleMouseMove = (e) => {
      const rect = galleryEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(cursor, {
        x,
        y,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.2 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, scale: 0.8, duration: 0.2 });
    };

    galleryEl.addEventListener('mousemove', handleMouseMove);
    galleryEl.addEventListener('mouseenter', handleMouseEnter);
    galleryEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      galleryEl.removeEventListener('mousemove', handleMouseMove);
      galleryEl.removeEventListener('mouseenter', handleMouseEnter);
      galleryEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Reveal each image with a clip-path as it scrolls into view
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(galleryRef);

    mm.add({
      isDesktop: '(min-width: 861px)',
      isMobile: '(max-width: 860px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set('.work-gallery-card', { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        return;
      }

      gsap.fromTo('.work-gallery-card',
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 85%'
          },
          onComplete: () => {
            const cards = document.querySelectorAll('.work-photo-img, .work-cursor-badge');
            cards.forEach(c => { c.style.willChange = 'auto'; });
          }
        }
      );
    });

    return () => mm.revert();
  }, []);

  // Arrow button handlers (scroll by one item width)
  const scrollPrev = () => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.work-gallery-card')?.clientWidth || 400;
    el.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
  };

  const scrollNext = () => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.work-gallery-card')?.clientWidth || 400;
    el.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
  };

  // Gallery keyboard navigation when track has focus
  const handleTrackKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    }
  };

  const openLightbox = (item) => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return; // Suppress open if user dragged
    }
    const thumbEl = thumbnailRefs.current[item.id];
    if (thumbEl) {
      Flip.getState(thumbEl);
    }
    setActivePhoto(item);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <section id="work" className="section" ref={galleryRef} aria-labelledby="work-title">
      {/* Floating View Cursor Follower (Gallery only) */}
      <div className="work-cursor-badge" ref={cursorRef} aria-hidden="true">
        View
      </div>

      <div className="container">
        <SectionEyebrowRow label="Selected Cuts & Colour" num="05" />

        {/* Header with Counter, Category Filter and Navigation Controls */}
        <div className="work-header-row">
          <div style={{ maxWidth: '560px' }}>
            <h2 id="work-title" style={{ marginBottom: '0.75rem' }}>
              Salon work
            </h2>
            <WordFillParagraph style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)', lineHeight: '1.5' }}>
              Real haircut and styling craft from our studio on Necklace Road. Every photo is real work completed in our salon.
            </WordFillParagraph>
          </div>

          {/* Action Row: Category Filter Pills + Controls */}
          <div className="work-header-actions">
            <div className="work-filter-pills" role="tablist" aria-label="Filter salon work by category">
              <button
                type="button"
                role="tab"
                aria-selected={filterCategory === 'all'}
                className={`work-filter-pill ${filterCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All Cuts ({allPhotos.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterCategory === 'boys'}
                className={`work-filter-pill ${filterCategory === 'boys' ? 'active' : ''}`}
                onClick={() => handleFilterChange('boys')}
              >
                Boys Cuts ({boysCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterCategory === 'girls'}
                className={`work-filter-pill ${filterCategory === 'girls' ? 'active' : ''}`}
                onClick={() => handleFilterChange('girls')}
              >
                Girls Cuts ({girlsCount})
              </button>
            </div>

            {/* Scroller Controls on Desktop */}
            <div className="work-controls-pane">
              <span className="work-counter-text" aria-live="polite">
                0{activeIndex + 1} / 0{photos.length}
              </span>

              <div className="work-nav-arrows">
                <button
                  type="button"
                  className="work-arrow-btn"
                  onClick={scrollPrev}
                  disabled={!canScrollLeft}
                  aria-label="Previous salon work photo"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="work-arrow-btn"
                  onClick={scrollNext}
                  disabled={!canScrollRight}
                  aria-label="Next salon work photo"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thin continuous progress bar */}
        <div className="work-progress-bar-wrap" aria-hidden="true">
          <div
            className="work-progress-bar-fill"
            style={{ transform: `scaleX(${Math.max(0.08, scrollProgress)})` }}
          ></div>
        </div>
      </div>

      {/* Horizontal Scroller Container (unclipped by container padding) */}
      <div className="work-horizontal-viewport">
        <div
          ref={trackRef}
          className="work-horizontal-track"
          tabIndex={0}
          onKeyDown={handleTrackKeyDown}
          role="region"
          aria-label="Salon work carousel. Use Left and Right arrow keys to navigate."
        >
          {photos.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => (thumbnailRefs.current[item.id] = el)}
              className="work-gallery-card"
              onClick={() => openLightbox(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(item);
                }
              }}
              aria-label={`View photo 0${idx + 1}: ${item.title} — ${item.alt}`}
            >
              <div className="work-photo-frame">
                <img
                  src={item.src}
                  alt={item.alt}
                  width="800"
                  height="1000"
                  loading="lazy"
                  className="work-photo-img"
                  draggable={false}
                />
                <div className="work-card-overlay">
                  <div className="work-card-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="work-num-label">{item.label}</span>
                      <span className="work-category-badge">{item.categoryLabel}</span>
                    </div>
                    <h3 className="work-card-title">{item.title}</h3>
                  </div>
                  <span className="work-zoom-hint">Enlarge ↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Instagram Link */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <a
            href={siteData.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="services-link-action"
          >
            Follow @_hair_city_salon on Instagram for regular studio cuts →
          </a>
        </div>
      </div>

      {/* Accessible Lightbox Modal with Flip Transition and Arrow Support */}
      {activePhoto && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title || activePhoto.alt}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close image"
              autoFocus
            >
              ✕
            </button>
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="lightbox-img"
            />
            <div className="lightbox-footer">
              <div className="lightbox-info-pane">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span className="work-category-badge">{activePhoto.categoryLabel}</span>
                  <span className="lightbox-photo-title">
                    {activePhoto.title}
                  </span>
                </div>
                <span className="lightbox-photo-desc">
                  {activePhoto.description || activePhoto.alt}
                </span>
              </div>
              <span className="lightbox-nav-shortcut">
                Left / Right arrows · Esc to close
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #work {
          position: relative;
        }

        .work-cursor-badge {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 50;
          opacity: 0;
          transform: scale(0.8);
          background: var(--color-accent);
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(20, 18, 17, 0.2);
          will-change: transform;
        }

        .work-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .work-header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .work-filter-pills {
          display: inline-flex;
          gap: 0.35rem;
          background: var(--color-surface);
          padding: 4px;
          border-radius: 999px;
          border: 1px solid var(--color-border);
        }

        .work-filter-pill {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          padding: 0.35rem 0.85rem;
          background: transparent;
          border: none;
          color: var(--color-muted);
          cursor: pointer;
          border-radius: 999px;
          transition: all var(--transition-fast);
        }

        .work-filter-pill.active {
          background: var(--color-accent);
          color: #FFFFFF;
        }

        .work-filter-pill:hover:not(.active) {
          color: var(--color-text);
        }

        .work-controls-pane {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .work-counter-text {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-accent);
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .work-nav-arrows {
          display: flex;
          gap: 0.5rem;
        }

        .work-arrow-btn {
          width: 44px;
          height: 44px;
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.15rem;
          border-radius: 2px;
          transition: border-color var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast);
        }

        .work-arrow-btn:hover:not(:disabled) {
          border-color: var(--color-accent);
          background: var(--color-surface);
          color: var(--color-accent);
        }

        .work-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .work-progress-bar-wrap {
          width: 100%;
          height: 2px;
          background: var(--color-border);
          margin-bottom: 2.5rem;
          overflow: hidden;
        }

        .work-progress-bar-fill {
          height: 100%;
          width: 100%;
          background: var(--color-accent);
          transform-origin: left center;
          transition: transform 0.1s linear;
        }

        /* Full-bleed unclipped horizontal track on desktop */
        .work-horizontal-viewport {
          width: 100%;
          overflow: visible;
        }

        .work-horizontal-track {
          display: flex;
          flex-direction: row;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 0 clamp(1.25rem, 4.5vw, 4rem) 1.5rem;
          cursor: grab;
          user-select: none;
          /* Hide scrollbar visually while keeping it scrollable */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }

        .work-horizontal-track::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .work-horizontal-track.is-dragging {
          cursor: grabbing;
          scroll-snap-type: none; /* Smoother dragging without snapping fight */
        }

        .work-gallery-card {
          flex: 0 0 42vw;
          min-width: 320px;
          max-width: 600px;
          scroll-snap-align: start;
          position: relative;
          cursor: pointer;
        }

        .work-photo-frame {
          position: relative;
          overflow: hidden;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          aspect-ratio: 4/5;
          width: 100%;
        }

        .work-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s var(--ease-editorial);
          pointer-events: none; /* Prevents ghost image drag */
        }

        /* Hover zooms to 1.06 */
        .work-gallery-card:hover .work-photo-img {
          transform: scale(1.06);
        }

        .work-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20, 18, 17, 0.7) 0%, rgba(20, 18, 17, 0.2) 35%, transparent 60%);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 1.25rem 1.5rem;
          opacity: 0.95;
          transition: opacity var(--transition-fast);
        }

        .work-gallery-card:hover .work-card-overlay {
          opacity: 1;
        }

        .work-card-meta {
          display: flex;
          flex-direction: column;
        }

        .work-num-label {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: #FFFFFF;
          line-height: 1;
        }

        .work-category-badge {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #FFFFFF;
          background: var(--color-accent);
          padding: 0.2rem 0.55rem;
          border-radius: 2px;
        }

        .work-card-title {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.25;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }

        .work-zoom-hint {
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FFFFFF;
          font-weight: 500;
          background: rgba(20, 18, 17, 0.6);
          padding: 0.3rem 0.65rem;
          border-radius: 2px;
          backdrop-filter: blur(4px);
          align-self: flex-end;
        }

        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 18, 16, 0.94);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .lightbox-content {
          position: relative;
          max-width: 820px;
          width: 100%;
          background: var(--color-bg);
          overflow: hidden;
          border: 1px solid var(--color-border);
        }

        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(250, 248, 245, 0.95);
          border: 1px solid var(--color-border);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          cursor: pointer;
          z-index: 10;
          color: var(--color-text);
        }

        .lightbox-img {
          width: 100%;
          max-height: 75vh;
          object-fit: contain;
          background-color: var(--color-surface);
        }

        .lightbox-footer {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          border-top: 1px solid var(--color-border);
          flex-wrap: wrap;
        }

        .lightbox-info-pane {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .lightbox-photo-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .lightbox-photo-desc {
          font-size: 0.85rem;
          color: var(--color-muted);
          line-height: 1.4;
        }

        .lightbox-nav-shortcut {
          font-size: 0.75rem;
          color: var(--color-muted);
          white-space: nowrap;
        }

        .services-link-action {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-text);
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color var(--transition-fast);
        }
        .services-link-action:hover {
          color: var(--color-accent);
        }

        @media (max-width: 860px) {
          .work-header-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .work-filter-pills {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
          }
          .work-horizontal-track {
            cursor: default;
            padding: 0 clamp(1.25rem, 4.5vw, 4rem) 1rem;
          }
          .work-gallery-card {
            flex: 0 0 85vw;
            min-width: 280px;
          }
          .work-cursor-badge {
            display: none !important;
          }
          .work-controls-pane {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
