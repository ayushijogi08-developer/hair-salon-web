import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { siteData } from '../data/site';
import { SectionEyebrowRow } from '../components/MotionText';

export const Team = () => {
  const confirmed = siteData.team?.filter((item) => item.confirmed) || [];
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (confirmed.length === 0) return;

    const mm = gsap.matchMedia(sectionRef.current);
    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { reduceMotion } = context.conditions;
        if (reduceMotion) {
          gsap.set('.team-card', { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          '.team-card',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    );

    return () => mm.revert();
  }, [confirmed.length]);

  if (confirmed.length === 0) {
    return null;
  }

  return (
    <section id="team" className="section" ref={sectionRef} aria-labelledby="team-title">
      <div className="container">
        <SectionEyebrowRow label="The Artists" num="06" />
        <div style={{ maxWidth: '640px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <h2 id="team-title" style={{ marginBottom: '1rem' }}>
            Our Team
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Skilled stylists, colour technicians, and certified academy educators dedicated to personalized hair craft.
          </p>
        </div>

        <div className="team-grid">
          {confirmed.map((member, idx) => (
            <div key={member.id || idx} className="team-card">
              {member.photo && (
                <div className="team-photo-frame">
                  <img
                    src={member.photo}
                    alt={member.name}
                    width="400"
                    height="500"
                    className="team-photo-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="team-card-header">
                <span className="team-role">{member.role}</span>
                {member.experience && <span className="team-exp">{member.experience}</span>}
              </div>
              <h3 className="team-name">{member.name}</h3>
              {member.bio && <p className="team-bio">{member.bio}</p>}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .team-card {
          padding: 2rem;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .team-photo-frame {
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          background-color: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          margin-bottom: 0.5rem;
        }

        .team-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .team-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .team-role {
          font-size: var(--size-micro);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }

        .team-exp {
          font-size: var(--size-micro);
          color: var(--color-muted);
        }

        .team-name {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .team-bio {
          font-size: 0.9rem;
          color: var(--color-muted);
          line-height: 1.55;
        }
      `}</style>
    </section>
  );
};
