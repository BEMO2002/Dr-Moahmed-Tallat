import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { FaQuoteLeft } from "react-icons/fa";

const QuoteIcon = () => <FaQuoteLeft className="text-secondary" size={20} />;

const InfinitySliderTwo = () => {
  const t = useTranslations();
  const locale = useLocale();

  const items = t.raw("infinitySliderTwo.items", { returnObjects: true });
  const words = typeof items === "object" ? Object.values(items) : [];

  const loopWords = [...words, ...words, ...words, ...words];

  const isRTL = locale === "ar";

  return (
    <div className="relative w-full overflow-hidden py-10 bg-white" dir="ltr">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: max-content;
            animation: marquee 50s linear infinite;
            will-change: transform;
          }
          .animate-infinite-scroll:hover {
             animation-play-state: paused;
          }
        `}
      </style>

      <div className="relative flex flex-col items-center justify-center">
        {/* Background Layer (Golden/Primary) */}
        <div className="absolute w-full h-12 md:h-16 bg-primary rotate-1 transform origin-center shadow-md" />

        {/* Foreground Layer (White) */}
        <div className="relative w-full bg-white py-3 md:py-4 -rotate-2 flex items-center shadow-lg transform origin-center border-y border-black/5">
          <div className="animate-infinite-scroll flex items-center">
            {loopWords.map((word, index) => (
              <div key={index} className="flex items-center">
                <span className="text-slate-800 text-lg md:text-xl font-bold whitespace-nowrap tracking-tight px-8 italic">
                  "{word}"
                </span>
                <QuoteIcon />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfinitySliderTwo;
