import React from 'react';

export const AboutAndAcademy = () => {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <div className="about-editorial-layout">
          <div className="about-col-left">
            <span className="section-label">Identity</span>
            <h2 id="about-title" style={{ maxWidth: '14ch', lineHeight: '1.1' }}>
              Rooted on Necklace Road.
            </h2>
          </div>

          <div className="about-col-right">
            <p className="about-lead-text">
              Hair City operates as both a professional hair salon and styling academy from Blackberry Complex on Necklace Road in Ranpise Nagar, Akola.
            </p>
            <p className="about-body-text">
              Under one roof, our space provides precision cuts, styling, and restorative hair treatments for clients alongside practical hairdressing instruction for students. Open seven days a week from 9:00 AM to 10:00 PM.
            </p>

            <div className="about-facts-minimal">
              <div className="fact-item">
                <span className="fact-title">Location</span>
                <span className="fact-desc">Blackberry Complex, Ranpise Nagar, Akola</span>
              </div>
              <div className="fact-item">
                <span className="fact-title">Hours</span>
                <span className="fact-desc">Monday – Sunday: 9:00 AM – 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-editorial-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: start;
        }

        .about-lead-text {
          font-family: var(--font-serif);
          font-size: clamp(1.25rem, 1.8vw, 1.6rem);
          color: var(--color-text);
          line-height: 1.35;
          margin-bottom: 1.5rem;
        }

        .about-body-text {
          font-size: 1rem;
          color: var(--color-muted);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 52ch;
        }

        .about-facts-minimal {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.75rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }

        .fact-title {
          display: block;
          font-size: var(--size-micro);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-muted);
          margin-bottom: 0.25rem;
        }

        .fact-desc {
          font-size: 0.9375rem;
          color: var(--color-text);
          font-weight: 500;
        }

        @media (max-width: 860px) {
          .about-editorial-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
