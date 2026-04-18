"use client";
import React, { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

import Image from "next/image";
import { useSettings } from "../Context/SettingContext";

/**
 * InformationContent Component - Renders the main body of information pages.
 * Supports icons based on slug and dynamic content formatting.
 */
const InformationContent = ({ data }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { settings } = useSettings();
  const [imageBroken, setImageBroken] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);

  if (!data) return null;

  const decodeHtml = (html) => {
    if (!html) return "";

    const namedEntities = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
      nbsp: " ",
      "#39": "'",
    };

    return html
      .replace(/&([a-zA-Z0-9#]+);/g, (match, entity) => {
        if (namedEntities[entity]) return namedEntities[entity];
        return match;
      })
      .replace(/&#(\d+);/g, (_, dec) => {
        const code = Number.parseInt(dec, 10);
        return Number.isNaN(code) ? _ : String.fromCodePoint(code);
      })
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        const code = Number.parseInt(hex, 16);
        return Number.isNaN(code) ? _ : String.fromCodePoint(code);
      });
  };

  const rawContent = data.content?.[locale] || data.content?.["en"] || "";
  const content = decodeHtml(rawContent);
  const slug = data.slug;
  const title = data.title?.[locale] || data.title?.["en"] || "Page image";
  const pageImage =
    Array.isArray(data.images_urls) &&
    typeof data.images_urls[0] === "string" &&
    data.images_urls[0].trim().length > 0
      ? data.images_urls[0]
      : null;
  const siteLogo =
    typeof settings?.logo === "string" && settings.logo.trim().length > 0
      ? settings.logo
      : "/Home/talaat-logo.png";
  const imageSrc = !imageBroken && pageImage ? pageImage : siteLogo;

  return (
    <section className="py-20 bg-white min-h-[50vh]">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col gap-12 `}
        >
          <div className="w-full">
            <div className="relative w-full h-64 md:h-[500px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 mb-10 shadow-sm">
              <Image
                src={logoBroken ? "/Home/talaat-logo.png" : imageSrc}
                alt={title}
                fill
                className={`${
                  !imageBroken && pageImage
                    ? "object-cover"
                    : "object-contain p-6"
                }`}
                onError={() => {
                  if (!imageBroken && pageImage) {
                    setImageBroken(true);
                    return;
                  }
                  setLogoBroken(true);
                }}
              />
            </div>

            <div
              className={`text-lg max-w-none text-gray-600 leading-[1.8] font-medium ${isRTL ? "text-right font-cairo" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Splitting content by newlines to handle formatting */}
              {content.split("\n").map((line, index) => (
                <p key={index} className="mb-6 text-lg font-medium">
                  {line}
                </p>
              ))}
            </div>

            {/* Print/Download Button (Placeholder) */}
            <div
              className={`mt-12 pt-8 border-t border-gray-100 flex ${isRTL ? "justify-end" : "justify-start"}`}
            >
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
