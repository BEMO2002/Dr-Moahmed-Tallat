"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "../../i18n/routing";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaPenNib,
  FaGlobe,
  FaMicrophoneAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
const SliderHome = ({ initialSliders = [] }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSlideClick = (link) => {
    if (link) {
      window.open(link, "_self");
    }
  };

  if (initialSliders.length === 0) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center text-baseTwo">
          <h2 className="text-2xl font-bold mb-4">
            {t("slider.error", "No Sliders Available")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-24 md:pt-28  min-h-screen lg:h-screen overflow-hidden">
      {/* Immersive Background Pattern - Optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute w-full h-full opacity-[0.03]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="topo"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 25 Q 12.5 0, 25 25 T 50 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#topo)" />
        </svg>

        {/* CSS-Animated Background Pulse */}
        <div className="bg-circle-pulse absolute -top-40 -left-40 w-[800px] h-[800px] bg-primary rounded-full blur-[120px] opacity-[0.05]" />
        <div className="bg-circle-pulse-delayed absolute bottom-0 right-0 w-[600px] h-[600px] bg-baseTwo rounded-full blur-[100px] opacity-[0.03]" />
      </div>

      <Swiper
        key="main-slider"
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          renderBullet: (index, className) =>
            `<span class="${className} custom-bullet"></span>`,
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        loop={true}
        className="h-full w-full relative z-20"
        dir="ltr"
      >
        {initialSliders.map((slider, index) => (
          <SwiperSlide key={slider.id}>
            <div className="relative min-h-[calc(100vh-80px)] py-12 lg:py-0 lg:h-full w-full max-w-[1400px] mx-auto flex items-center px-6 lg:px-12">
              <div
                className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between w-full ${isRTL ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Text Content - Removed Framer Motion for better performance */}
                <div
                  className={`flex-1 w-full z-30 transition-opacity duration-500 ${activeSlideIndex === index ? "opacity-100" : "opacity-0"} ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-sm shadow-sm border border-primary/5 rounded-full text-primary text-[15px] font-bold tracking-widest uppercase mb-8">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    {isRTL
                      ? "المحلل الذي يقرأ ما وراء الحدث"
                      : "The Analyst Who Reads Behind The Event"}
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[60px] font-black text-baseTwo mb-6 md:mb-8 leading-[1.2] lg:leading-[1.1] tracking-tight">
                    {slider.title?.[locale]}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-12  leading-relaxed ">
                    {slider.desc?.[locale]}
                  </p>

                  <div
                    className={`flex flex-wrap items-center gap-4 md:gap-6 mt-10 ${isRTL ? "justify-end" : "justify-start"}`}
                  >
                    <Link
                      href="/blogs"
                      className="group flex items-center justify-center gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-primary text-white font-bold text-sm md:text-lg rounded-full shadow-[0_10px_25px_-5px_rgb(197,160,89,0.4)] hover:shadow-[0_15px_30px_-5px_rgb(197,160,89,0.6)] hover:-translate-y-1 hover:brightness-110 transition-all duration-400"
                    >
                      <span className="relative z-10">
                        {isRTL ? "استكشف التحليلات" : "Explore Analytics"}
                      </span>
                      <FaArrowLeft
                        className={`text-sm opacity-90 group-hover:translate-x-[-4px] transition-transform ${isRTL ? "" : "hidden"}`}
                      />
                      <FaArrowRight
                        className={`text-sm opacity-90 group-hover:translate-x-[4px] transition-transform ${isRTL ? "hidden" : ""}`}
                      />
                    </Link>

                    <Link
                      href="/about"
                      className="group flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 bg-white/40 backdrop-blur-md border border-slate-200 text-baseTwo font-bold text-sm md:text-lg rounded-full shadow-sm hover:border-primary/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
                    >
                      {isRTL ? "السيرة التنفيذية" : "Executive Resume"}
                    </Link>
                  </div>
                </div>

                {/* Media Content - Removed Framer Motion for better performance */}
                <div
                  className={`flex-1 w-full z-20 relative flex justify-center transition-all duration-700 ${activeSlideIndex === index ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
                >
                  <div className="relative w-full flex justify-center">
                    {/* Background Frame */}
                    <div className="absolute -inset-6 bg-linear-to-tr from-primary/20 to-baseTwo/20 rounded-[40px] opacity-10 blur-3xl pointer-events-none" />
                    <div className="absolute top-8 -left-8 w-full h-full border-[3px] border-primary/10 rounded-3xl -z-10 pointer-events-none" />

                    {/* Social Icons with CSS-based floating anims */}
                    <div className="float-anim absolute -top-4 -left-4 md:-top-8 md:-left-8 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#E4405F] text-xl z-40 border border-gray-50 select-none">
                      <FaInstagram size={20} className="md:size-6" />
                    </div>

                    <div className="float-anim-reverse absolute bottom-12 -right-5 md:bottom-16 md:-right-10 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-blue-900 text-xl z-40 border border-gray-50 select-none">
                      <FaFacebookF size={20} className="md:size-6" />
                    </div>

                    <div className="float-anim-delayed absolute -bottom-4 left-1/4 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#1DA1F2] text-lg z-40 border border-gray-50 select-none">
                      <FaTwitter size={20} className="md:size-6" />
                    </div>

                    <div className="float-anim-delayed absolute top-0 -right-4 md:-right-5 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#1DA1F2] text-lg z-40 border border-gray-50 select-none">
                      <FaLinkedin size={20} className="md:size-6" />
                    </div>

                    {/* Hero Image/Video */}
                    <div className="relative z-30 transition-transform duration-700 hover:scale-[1.01]">
                      {(() => {
                        const bannerUrl = slider.banner;
                        const isVideo = bannerUrl
                          ?.toLowerCase()
                          .match(/\.(mp4|webm|mov)$/);

                        if (isVideo) {
                          return (
                            <video
                              src={bannerUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                            />
                          );
                        } else {
                          return (
                            <img
                              src={bannerUrl}
                              alt=""
                              className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                            />
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Brand Pagination */}
      <div className="custom-pagination absolute bottom-12 right-12 lg:right-24 z-50 flex gap-4"></div>

      {/* Floating Background Icons (Journalism/Politics Theme) */}
      <motion.div
        animate={{ y: [0, -40, 0], rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[5%] md:left-[5%] opacity-10 pointer-events-none select-none z-10 text-primary"
      >
        <FaPenNib size={80} className="md:w-32 md:h-32" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[2%] md:right-[5%] opacity-20 pointer-events-none select-none z-10 text-primary"
      >
        <FaGlobe size={120} className="md:w-48 md:h-48" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0], rotate: -15 }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[8%] md:left-[15%] opacity-15 pointer-events-none select-none z-10 text-primary"
      >
        <FaMicrophoneAlt size={60} className="md:w-24 md:h-24" />
      </motion.div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.05;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }
        @keyframes floating {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes floating-rev {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(15px);
          }
        }
        .bg-circle-pulse {
          animation: pulse 15s infinite ease-in-out;
        }
        .bg-circle-pulse-delayed {
          animation: pulse 20s infinite ease-in-out 2s;
        }
        .float-anim {
          animation: floating 4s infinite ease-in-out;
        }
        .float-anim-reverse {
          animation: floating-rev 5s infinite ease-in-out;
        }
        .float-anim-delayed {
          animation: floating 6s infinite ease-in-out 1s;
        }

        .custom-bullet {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background: #000 !important;
          white-space: nowrap;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer;
        }
        .custom-bullet.swiper-pagination-bullet-active {
          width: 40px !important;
          border-radius: 12px !important;
          background: #c5a059 !important;
          opacity: 1 !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SliderHome;
