"use client";
import React from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FaShieldHalved, FaHandshake, FaUserShield, FaBrain, FaTriangleExclamation } from "react-icons/fa6";

/**
 * InformationContent Component - Renders the main body of information pages.
 * Supports icons based on slug and dynamic content formatting.
 */
const InformationContent = ({ data }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  if (!data) return null;

  const content = data.content?.[locale] || data.content?.["en"] || "";
  const slug = data.slug;

  // Icon mapping based on page slug
  const getIcon = () => {
    switch (slug) {
      case "privacy": return <FaUserShield className="text-5xl text-primary" />;
      case "terms-conditions": return <FaHandshake className="text-5xl text-primary" />;
      case "ai-poilcy": return <FaBrain className="text-5xl text-primary" />;
      case "data-protection": return <FaShieldHalved className="text-5xl text-primary" />;
      case "security-policy": return <FaTriangleExclamation className="text-5xl text-primary" />;
      default: return null;
    }
  };

  return (
    <section className="py-20 bg-white min-h-[50vh]">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col md:flex-row gap-12 ${isRTL ? "md:flex-row-reverse" : ""}`}
        >
          {/* Side Icon/Meta info */}
          <div className="md:w-1/4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
              {getIcon()}
            </div>
            <div className={`text-center ${isRTL ? "md:text-right" : "md:text-left"}`}>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">
                {isRTL ? "آخر تحديث" : "Last Updated"}
              </p>
              <p className="text-sm font-bold text-baseTwo">
                {data.created_at || "2026-04-12"}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div 
              className={`prose prose-lg max-w-none text-gray-600 leading-[1.8] font-medium ${isRTL ? "text-right font-cairo" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Splitting content by newlines to handle formatting */}
              {content.split('\n').map((line, index) => (
                <p key={index} className="mb-6">
                  {line}
                </p>
              ))}
            </div>

            {/* Print/Download Button (Placeholder) */}
            <div className={`mt-12 pt-8 border-t border-gray-100 flex ${isRTL ? "justify-end" : "justify-start"}`}>
               <button 
                 onClick={() => window.print()} 
                 className="text-primary hover:text-baseTwo font-bold flex items-center gap-2 transition-colors border-b-2 border-primary/30 hover:border-baseTwo pb-1 active:scale-95 duration-200 no-print"
               >
                 {isRTL ? "طباعة هذه الصفحة" : "Print This Page"}
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InformationContent;
