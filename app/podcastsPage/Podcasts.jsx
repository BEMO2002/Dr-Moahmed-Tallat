"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaInstagram, FaPlayCircle } from "react-icons/fa";

const Podcasts = ({ data, initialPage = 1 }) => {
  const t = useTranslations("podcasts");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Map properties from data if available, otherwise use initial empty state.
  // We use the 'data' prop as the source translated to items and pagination.
  // Usually, we don't even need state if it's just a display component.
  const items = data?.data || [];
  const pagination = {
    current_page: data?.current_page || 1,
    last_page: data?.last_page || 1,
    total: data?.total || 0,
  };

  const getEmbedUrl = (url) => {
    if (url?.includes("instagram.com")) {
      const cleanUrl = url.endsWith("/") ? url : `${url}/`;
      return `${cleanUrl}embed/`;
    }
    return url;
  };

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm py-40">
          <h3 className="text-2xl font-bold text-slate-400">{t("noItems")}</h3>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden ">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full -ml-20"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12 max-w-6xl mx-auto">
          {items.map((item, idx) => {
            const title = item.title?.[locale] || item.title?.["en"];
            const description =
              item.description?.[locale] || item.description?.["en"];
            const embedUrl = getEmbedUrl(item.video_url);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="p-6 md:p-10">
                  {/* Top Section: Side-by-side Thumbnail and Info */}
                  <div
                    className={`flex flex-col md:flex-row gap-8 items-start ${
                      isRTL ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-48 lg:w-64 aspect-video md:aspect-square rounded-3xl overflow-hidden bg-slate-100 shrink-0 shadow-lg shadow-black/5">
                      <Image
                        src={item.image_url}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>

                    {/* Info */}
                    <div
                      className={`flex-1 flex flex-col gap-4 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <FaInstagram className="text-lg" />
                        <span>{item.platform || "Instagram"}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                        {title}
                      </h2>
                      <p className="text-slate-500 leading-relaxed text-lg line-clamp-3">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section: Embedded Video/Pod */}
                  <div className="mt-10 relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-inner border border-slate-100">
                    <iframe
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("page", p);
                    window.location.href = url.toString();
                  }}
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl font-black transition-all ${
                    pagination.current_page === p
                      ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110"
                      : "bg-white text-slate-600 border border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Podcasts;
