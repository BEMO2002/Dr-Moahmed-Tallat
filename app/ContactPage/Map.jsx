"use client";
import React from 'react';
import { useLocale } from 'next-intl';

const Map = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="pb-10 md:pb-20 px-4 md:px-8 bg-white relative z-10">
      <div className="max-w-full mx-auto">
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 group">
          {/* Decorative overlay to make it look premium and match brand colors (hides on hover) */}
          <div className="absolute inset-0 bg-primary/10 pointer-events-none z-10 mix-blend-color transition-opacity duration-700 group-hover:opacity-0"></div>
          
          {/* Map iframe */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57265.239321415!2d50.51105033951983!3d26.226672635809923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e49af722776a62d%3A0x8b6738a6070f60c2!2sManama%2C%20Bahrain!5e0!3m2!1sen!2seg!4v1777381224194!5m2!1sen!2seg" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full grayscale-[40%] contrast-110 transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 z-0"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Map;