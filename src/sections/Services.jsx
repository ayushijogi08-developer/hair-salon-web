import React from 'react';
import { siteData } from '../data/site';

export const Services = () => {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        {/* Editorial Header */}
        <div style={{ maxWidth: '640px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <span className="section-label">Salon Offerings</span>
          <h2 id="services-title" style={{ marginBottom: '1rem' }}>
            Salon services
          </h2>
          <p>
            {siteData.servicesNote} Every service is personalized following consultation.
          </p>
        </div>

        {/* Clean Numbered List with Thin Dividers (No Boxes) */}
        <div className="services-editorial-list">
          {siteData.services.map((item) => (
            <div key={item.id} className="service-list-row">
              <div className="service-col-left">
                <span className="service-num">{item.id}</span>
                <h3 className="service-name">{item.name}</h3>
              </div>
              <div className="service-col-right">
                <p className="service-note">{item.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Editorial Banner */}
        <div className="services-action-line">
          <span>For consultations, custom treatments or appointment inquiries</span>
          <a
            href={siteData.links.whatsappGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="services-link-action"
          >
            Enquire on WhatsApp →
          </a>
        </div>
      </div>

      <style>{`
        .services-editorial-list {
          border-top: 1px solid var(--color-border);
          margin-bottom: 3rem;
        }

        .service-list-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: baseline;
          padding: clamp(1.75rem, 3.5vw, 2.5rem) 0;
          border-bottom: 1px solid var(--color-border);
          transition: background-color var(--transition-fast);
        }

        .service-col-left {
          display: flex;
          align-items: baseline;
          gap: clamp(1.5rem, 3vw, 3rem);
        }

        .service-num {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-accent);
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }

        .service-name {
          font-size: clamp(1.35rem, 2vw, 1.85rem);
          font-weight: 400;
          color: var(--color-text);
        }

        .service-col-right {
          display: flex;
          justify-content: flex-end;
        }

        .service-note {
          font-size: 0.9375rem;
          color: var(--color-muted);
          max-width: 44ch;
          text-align: right;
          line-height: 1.5;
        }

        .services-action-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding-top: 1.5rem;
          font-size: 0.9375rem;
          color: var(--color-muted);
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

        @media (max-width: 768px) {
          .service-list-row {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .service-col-right {
            justify-content: flex-start;
            padding-left: 2.75rem;
          }
          .service-note {
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
};
