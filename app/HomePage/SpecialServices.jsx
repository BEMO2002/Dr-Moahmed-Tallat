"use client";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  FiTarget,
  FiMessageCircle,
  FiSearch,
  FiLayers,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";

const SpecialServices = () => {
  const t = useTranslations("specialServices");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const services = [
    {
      id: 1,
      number: "01",
      icon: FiTarget,
      title: t("brandStrategy.title"),
      description: t("brandStrategy.description"),
      color: "from-primary/20 to-slate-500/20",
      iconColor: "text-primary",
    },
    {
      id: 2,
      number: "02",
      icon: FiMessageCircle,
      title: t("socialMedia.title"),
      description: t("socialMedia.description"),
      color: "from-primary/20 to-slate-500/20",
      iconColor: "text-primary",
    },
    {
      id: 3,
      number: "03",
      icon: FiSearch,
      title: t("seo.title"),
      description: t("seo.description"),
      color: "from-primary/20 to-slate-500/20",
      iconColor: "text-primary",
    },
    {
      id: 4,
      number: "04",
      icon: FiLayers,
      title: t("contentCreation.title"),
      description: t("contentCreation.description"),
      color: "from-primary/20 to-slate-500/20",
      iconColor: "text-primary",
    },
    {
      id: 5,
      number: "05",
      icon: FiTrendingUp,
      title: t("digitalAds.title"),
      description: t("digitalAds.description"),
      color: "from-primary/20 to-slate-500/20",
      iconColor: "text-primary",
    },
    {
      id: 6,
      number: "06",
      icon: FiBarChart2,
      title: t("analytics.title"),
      description: t("analytics.description"),
      color: "from-primary/20 to-slate-500/20",
      iconColor: "text-primary",
    },
  ];

  return (
    <section className="relative py-10 bg-[#FCFDFF] overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header section */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-[2px] w-12 bg-primary rounded-full"></div>
            <span className="text-primary font-bold text-xl  uppercase">
              {t("subtitle")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
            {t("title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-400">
              {t("titleHighlight")}
            </span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white/70 backdrop-blur-sm border border-slate-200 rounded-[32px] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:bg-white"
              >
                {/* Number Watermark */}
                <span
                  className={`absolute top-10 ${isRTL ? "left-10" : "right-10"} text-6xl font-black text-slate-200/70 group-hover:text-primary/5 transition-colors duration-500 select-none`}
                >
                  {service.number}
                </span>

                {/* Card Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]`}
                ></div>

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div
                    className={`w-20 h-20 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-8 transform transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110`}
                  >
                    <Icon className={`text-4xl ${service.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-colors duration-300 group-hover:text-primary">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed transition-colors duration-300 group-hover:text-slate-600">
                    {service.description}
                  </p>
                </div>

                {/* Border Bottom Animation */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-slate-400 rounded-full transition-all duration-500 group-hover:w-1/2"></div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        section {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(197, 160, 89, 0.02) 0%,
            transparent 100%
          );
        }
      `}</style>
    </section>
  );
};

export default SpecialServices;
