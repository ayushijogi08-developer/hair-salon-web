import React from 'react';
import { siteData } from '../data/site';

export const ImageBand = () => {
  // Use available real salon image for the background band
  const bandImg = siteData.images.hero.src;

  return (
    <section className="editorial-image-band" aria-label="Hair craft statement">
      {bandImg && (
        <img
          src={bandImg}
          alt=""
          role="presentation"
          loading="lazy"
          className="editorial-image-band-img"
        />
      )}
      <div className="editorial-image-band-text">
        "Salon services and academy training under one roof in Akola."
      </div>
    </section>
  );
};
