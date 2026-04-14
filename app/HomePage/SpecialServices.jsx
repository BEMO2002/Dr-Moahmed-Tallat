"use client";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { FiGlobe, FiRadio } from "react-icons/fi";
import { GiCrossedSwords } from "react-icons/gi";
import { RiBrainLine, RiRobotLine } from "react-icons/ri";
import { FaUniversity } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const SpecialServices = () => {
  const t = useTranslations("specialServices");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const services = [
    {
      id: 1,
      number: "01",
      icon: FiGlobe,
      title: t("geopolitics.title"),
      description: t("geopolitics.description"),
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-primary",
    },
    {
      id: 2,
      number: "02",
      icon: GiCrossedSwords,
      title: t("hybridWarfare.title"),
      description: t("hybridWarfare.description"),
      color: "from-red-500/20 to-orange-500/20",
      iconColor: "text-primary",
    },
    {
      id: 3,
      number: "03",
      icon: RiBrainLine,
      title: t("politicalPsychology.title"),
      description: t("politicalPsychology.description"),
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-primary",
    },
    {
      id: 4,
      number: "04",
      icon: RiRobotLine,
      title: t("techAI.title"),
      description: t("techAI.description"),
      color: "from-indigo-500/20 to-blue-500/20",
      iconColor: "text-primary",
    },
    {
      id: 5,
      number: "05",
      icon: FiRadio,
      title: t("strategicMedia.title"),
      description: t("strategicMedia.description"),
      color: "from-yellow-500/20 to-amber-500/20",
      iconColor: "text-primary",
    },
    {
      id: 6,
      number: "06",
      icon: FaUniversity,
      title: t("strategicGovernance.title"),
      description: t("strategicGovernance.description"),
      color: "from-slate-500/20 to-gray-500/20",
      iconColor: "text-primary",
    },
  ];

  return (
    <section className="relative py-20 bg-[#FCFDFF] overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header section */}
        <div className="max-w-4xl mb-20 text-center mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-[2px] w-12 bg-primary rounded-full"></div>
            <span className="text-primary font-bold text-xl uppercase tracking-wider">
              {t("subtitle")}
            </span>
            <div className="h-[2px] w-12 bg-primary rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] mb-4">
            {t("title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-400">
              {t("titleHighlight")}
            </span>
          </h2>
          {t.has("headerDescription") && (
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed mt-6 max-w-3xl mx-auto font-medium">
              {t("headerDescription")}
            </p>
          )}
        </div>

        {/* Services Swiper */}
        <div className="relative md:px-4 px-1">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-20 !overflow-visible"
            dir={isRTL ? "rtl" : "ltr"}
            key={locale} // Force re-render on locale change for RTL support
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <SwiperSlide key={service.id} className="h-auto">
                  <div className="group relative bg-white border border-slate-200 rounded-[32px] p-10 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col">
                    {/* Number Watermark */}
                    <span
                      className={`absolute top-10 ${isRTL ? "left-10" : "right-10"} text-6xl font-black text-slate-200/90 group-hover:text-primary/5 transition-colors duration-500 select-none`}
                    >
                      {service.number}
                    </span>

                    {/* Card Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]`}
                    ></div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon Container */}
                      <div
                        className={`w-20 h-20 bg-white shadow-xl shadow-slate-100 rounded-2xl flex items-center justify-center mb-8 transform transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110`}
                      >
                        <Icon className={`text-4xl ${service.iconColor}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 transition-colors duration-300 group-hover:text-primary">
                        {service.title}
                      </h3>
                      <p className="text-slate-500 text-lg leading-relaxed transition-colors duration-300 group-hover:text-slate-600 flex-grow">
                        {service.description}
                      </p>

                      {/* Line Decoration */}
                      <div className="mt-8 w-12 h-1 bg-slate-100 rounded-full group-hover:bg-primary transition-colors duration-500"></div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #e2e8f0;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: var(--color-primary, #c5a059);
          width: 32px;
          border-radius: 6px;
        }
        section {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(197, 160, 89, 0.03) 0%,
            transparent 100%
          );
        }
      `}</style>
    </section>
  );
};

export default SpecialServices;
