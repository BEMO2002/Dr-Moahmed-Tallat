"use client";
import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaQuoteLeft,
  FaAward,
  FaUserCheck,
  FaFilePdf,
} from "react-icons/fa";

/**
 * TallatCv Component - Displays a professional section for the strategic profile/CV
 * Data is fetched by slug "talaat-cv" from the backend.
 */
const TallatCv = ({ data }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  if (!data) return null;

  const title = data.title?.[locale] || data.title?.["ar"] || "";
  const content = data.content?.[locale] || data.content?.["ar"] || "";
  const pdfUrl = data.pdf_url;
  const imageUrl = data.images_urls?.[0];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative border-y border-gray-100">
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent skew-x-12 transform origin-right pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-baseTwo opacity-[0.03] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-20 relative z-10">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Image & Brand Card Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12 relative"
          >
            <div className="relative z-20 group">
              {/* Main Image Frame with Premium Border */}
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-3xl border-8 border-white group-hover:border-primary/20 transition-all duration-700">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={title}
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover transform duration-1000 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-baseTwo/60 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-4 border-l-4 border-primary/30 rounded-tl-3xl -z-10" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-4 border-r-4 border-baseTwo/30 rounded-br-3xl -z-10" />
            </div>
          </motion.div>

          {/* Content & Narrative Section */}
          <div className="w-full lg:w-7/12">
            <div
              className={`${isRTL ? "text-right" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-5 h-[2px] bg-primary rounded-full" />
                  <span className="text-primary font-bold tracking-[0.2em] uppercase text-lg">
                    {isRTL ? "من أنا" : "Who Am I"}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-baseTwo mb-8 leading-tight">
                  {title}
                </h2>

                <div className="relative mb-10">
                  <FaQuoteLeft className="absolute -top-6 -left-6 text-primary/10 text-6xl pointer-events-none" />
                  <div
                    className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium space-y-6"
                    dangerouslySetInnerHTML={{
                      __html: content.replace(/\r\n/g, "<br/>"),
                    }}
                  />
                </div>

                {/* Integration Badges */}
                <div className="flex flex-wrap gap-4 mb-12">
                  <div className="bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm flex items-center gap-2 group hover:border-primary/30 transition-colors">
                    <FaUserCheck className="text-primary" />
                    <span className="text-sm font-bold text-gray-700">
                      {isRTL ? "قيادة فكرية" : "Thought Leadership"}
                    </span>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm flex items-center gap-2 group hover:border-primary/30 transition-colors">
                    <FaAward className="text-primary" />
                    <span className="text-sm font-bold text-gray-700">
                      {isRTL ? "مرجعية استراتيجية" : "Strategic Reference"}
                    </span>
                  </div>
                </div>

                {/* Simplified Call to Action - Resume Download */}
                {pdfUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-baseTwo hover:bg-primary text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl group"
                    >
                      <span>
                        {isRTL
                          ? "تحميل السيرة الذاتية (PDF)"
                          : "Download Resume (PDF)"}
                      </span>
                      <FaDownload className="text-sm group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TallatCv;
