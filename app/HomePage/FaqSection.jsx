"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiMinus } from "react-icons/hi2";

const FaqSection = () => {
  const t = useTranslations("faq");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = t.raw("items");

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Immersive Background Ornaments */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Decorative Blurred Circles */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex  cursor-pointer items-center gap-2 px-3 py-1 bg-white shadow-md border border-primary rounded-full text-primary text-[13px] font-bold tracking-[0.2em] uppercase mb-8"
          >
            {t("title")}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-5xl font-black text-baseTwo mb-8 leading-tight tracking-tight"
          >
            {t("subtitle")}
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1.5 bg-primary mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto grid gap-6"
        >
          {faqItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              <button
                onClick={() => toggleAccordion(index)}
                className={`w-full text-start p-4 md:p-6 rounded-[24px] border-2 border-primary transition-all duration-500 flex items-center justify-between gap-6 relative overflow-hidden  ${
                  activeIndex === index
                    ? "border-primary bg-white shadow-[0_15px_40px_-15px_rgba(197,160,89,0.2)]"
                    : "border-primary/20 bg-white/60 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Active Indicator Line */}
                <div
                  className={`absolute top-0 bottom-0 w-1.5 bg-primary transition-all duration-500 ${
                    activeIndex === index
                      ? "opacity-100"
                      : "opacity-0 invisible"
                  } ${isRTL ? "right-0" : "left-0"}`}
                />

                <span
                  className={`text-lg md:text-xl font-bold leading-snug transition-colors duration-300 flex-1 ${
                    activeIndex === index ? "text-primary" : "text-baseTwo"
                  }`}
                >
                  {item.question}
                </span>

                <div
                  className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                    activeIndex === index
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 rotate-180"
                      : "bg-gray-50 text-primary border-primary/50 group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary/5"
                  }`}
                >
                  {activeIndex === index ? (
                    <HiMinus className="size-5 md:size-6" />
                  ) : (
                    <HiPlus className="size-5 md:size-6" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 md:px-12 py-8 text-gray-600 leading-[1.8] text-lg md:text-xl font-medium">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {item.answer}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
