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

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-baseTwo/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-widest uppercase mb-6"
          >
            {t("title")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-baseTwo mb-6"
          >
            {t("subtitle")}
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className={`w-full text-start p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between gap-4 group ${
                  activeIndex === index
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                    : "border-gray-100 bg-gray-50/50 hover:border-primary/30 hover:bg-white"
                }`}
              >
                <span
                  className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                    activeIndex === index ? "text-primary" : "text-baseTwo"
                  }`}
                >
                  {item.question}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-primary text-white rotate-180"
                      : "bg-gray-200 text-gray-500 group-hover:bg-primary/20 group-hover:text-primary"
                  }`}
                >
                  {activeIndex === index ? <HiMinus /> : <HiPlus />}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 text-gray-600 leading-relaxed text-lg border-x-2 border-b-2 border-primary/10 rounded-b-2xl -mt-4 pt-10 bg-white shadow-inner">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
