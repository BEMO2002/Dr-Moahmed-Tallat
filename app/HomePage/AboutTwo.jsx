"use client";
import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiCheckCircle,
  HiRocketLaunch,
  HiLightBulb,
  HiChartBar,
} from "react-icons/hi2";
import aboutImage from "../../public/Home/about.png";
import { FaArrowLeft, FaArrowRight, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import { Link } from "../../i18n/routing";
const AboutTwo = () => {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { key: "about", label: t("tabs.about"), icon: HiRocketLaunch },
    { key: "mission", label: t("tabs.mission"), icon: HiLightBulb },
    { key: "vision", label: t("tabs.vision"), icon: HiChartBar },
  ];

  const activeContent = {
    text: t(`tabContent.${activeTab}.text`),
    points: t.raw(`tabContent.${activeTab}.points`),
  };

  const points = Array.isArray(activeContent.points)
    ? activeContent.points
    : [];

  return (
    <div className="bg-white overflow-hidden py-20 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-baseTwo/10 rounded-full blur-3xl"></div>
      </div>

      <section className="container mx-auto px-4 lg:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Image Section with Glassmorphism Effect */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative"
          >
            <div className="relative z-20 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-baseTwo rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
              <Image
                src={aboutImage}
                alt={t("imageAlt")}
                className="rounded-2xl shadow-2xl relative z-10 w-full md:h-[700px] h-[500px] object-contain transform transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Floating Stat Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-8 -right-8 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 z-30 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
                    <HiChartBar />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-baseTwo">15+</p>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">
                      {t("yearsExp")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Spinner Decoration */}
            <motion.div
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute md:-top-10 md:-right-10 -top-4 -right-4 w-24 h-24 md:w-32 md:h-32 opacity-30 select-none z-0"
            >
              <FaGlobe className="w-full h-full text-primary" />
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 w-full">
            <div
              className={`${isRTL ? "text-right" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-widest uppercase mb-6"
              >
                {t("tag")}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-baseTwo mb-8 leading-[1.1]"
              >
                <span className="inline-block whitespace-nowrap">
                  {t("title1")}{" "}
                  <span className="text-primary relative inline-block">
                    {t("titleHighlight")}
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-2 text-primary/30"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 5 Q 25 0, 50 5 T 100 5"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                    </svg>
                  </span>
                </span>{" "}
                {t("title2")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg mb-10 max-w-xl"
              >
                {t("description")}
              </motion.p>

              {/* Custom Animated Tabs - Responsive with wrap on mobile */}
              <div className="mb-10 p-1.5 bg-gray-50 rounded-2xl flex flex-wrap sm:inline-flex gap-2 w-full sm:w-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative flex items-center  justify-center gap-2 px-6 py-3 rounded-xl text-sm whitespace-nowrap font-bold transition-all duration-300 flex-1 sm:flex-none ${
                        activeTab === tab.key
                          ? "text-white "
                          : "text-gray-500 hover:text-primary "
                      }`}
                    >
                      {activeTab === tab.key && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary rounded-xl shadow-lg ring-4 ring-primary/10"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <Icon
                        className={`relative z-10 text-lg ${activeTab === tab.key ? "text-white" : "text-gray-400"}`}
                      />
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <p className="text-gray-700 text-xl font-medium leading-relaxed">
                    {activeContent.text}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {points.map((point, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors group border border-transparent hover:border-primary/10"
                      >
                        <div className="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary shrink-0">
                          <HiCheckCircle className="text-xl" />
                        </div>
                        <span className="text-gray-700 font-semibold">
                          {point}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-12">
                <Link
                  href="/analyses"
                  className="px-8 py-4 w-fit bg-baseTwo text-white rounded-xl font-bold hover:bg-primary transition-all duration-300 shadow-xl hover:shadow-primary/20 flex items-center gap-3 group"
                >
                  {t("learnMore")}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutTwo;
