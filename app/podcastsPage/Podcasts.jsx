"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import ApiEmptyState from "../Components/ApiEmptyState";

const PodcastSkeleton = () => {
  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-full md:w-48 lg:w-64 aspect-video md:aspect-square rounded-3xl bg-slate-200 shrink-0"></div>

          <div className="flex-1 flex flex-col gap-4 w-full pt-2">
            <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
            <div className="h-8 w-3/4 bg-slate-200 rounded-xl mt-2"></div>
            <div className="h-4 w-full bg-slate-100 rounded-full mt-4"></div>
            <div className="h-4 w-5/6 bg-slate-100 rounded-full"></div>
            <div className="h-4 w-4/6 bg-slate-100 rounded-full"></div>
          </div>
        </div>
        <div className="mt-10 relative aspect-video w-full rounded-3xl bg-slate-200"></div>
      </div>
    </div>
  );
};

const PaginationSkeleton = () => {
  return (
    <div className="mt-20 flex justify-center items-center gap-2 md:gap-4 flex-wrap animate-pulse">
      <div className="w-24 h-12 md:h-14 bg-slate-200 rounded-2xl"></div>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="w-12 h-12 md:w-14 md:h-14 bg-slate-200 rounded-2xl"
        ></div>
      ))}
      <div className="w-24 h-12 md:h-14 bg-slate-200 rounded-2xl"></div>
    </div>
  );
};

const Podcasts = ({ data, initialPage = 1, isLoading = false }) => {
  const t = useTranslations("podcasts");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [brokenImages, setBrokenImages] = React.useState({});
  const [brokenEmbeds, setBrokenEmbeds] = React.useState({});

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

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.location.href = url.toString();
  };

  if (isLoading) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12 max-w-6xl mx-auto">
            {[1, 2].map((i) => (
              <PodcastSkeleton key={i} />
            ))}
          </div>
          <PaginationSkeleton />
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <ApiEmptyState
        title={t("noItems") || "لا توجد بودكاست متاحة."}
        description={
          isRTL
            ? "سيتم عرض حلقات البودكاست هنا فور إضافتها."
            : "Podcast episodes will appear here once they are published."
        }
        isRTL={isRTL}
      />
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
            const decodedDescription = decodeHtml(description);
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
                        src={brokenImages[item.id] ? "/Home/talaat-logo.png" : item.image_url}
                        alt={title}
                        fill
                        className={`group-hover:scale-110 transition-transform duration-700 ${
                          brokenImages[item.id] ? "object-contain p-4" : "object-cover"
                        }`}
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                        }
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
                        {decodedDescription}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section: Embedded Video/Pod */}
                  <div className="mt-10 relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-inner border border-slate-100">
                    {!embedUrl || brokenEmbeds[item.id] ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900">
                        <Image
                          src="/Home/talaat-logo.png"
                          alt="Talaat logo"
                          width={76}
                          height={76}
                          className="object-contain mb-4"
                        />
                        <p className="text-white/85 font-bold text-sm mb-3">
                          {isRTL
                            ? "سيظهر الفيديو هنا بعد تحديث الرابط."
                            : "The video will appear here once the link is updated."}
                        </p>
                      </div>
                    ) : (
                      <iframe
                        src={embedUrl}
                        title={title || "Podcast embed"}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        onError={() =>
                          setBrokenEmbeds((prev) => ({ ...prev, [item.id]: true }))
                        }
                      ></iframe>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {pagination.last_page > 1 && (
          <div className="mt-20 flex justify-center items-center gap-2 md:gap-4 flex-wrap">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                pagination.current_page === 1
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-70"
                  : "bg-white text-slate-600 hover:border-primary/40 hover:bg-primary hover:text-white"
              }`}
            >
              {t("prev") || (isRTL ? "السابق" : "Prev")}
            </button>

            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
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

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                pagination.current_page === pagination.last_page
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-70"
                  : "bg-white text-slate-600 hover:border-primary/40 hover:bg-primary hover:text-white"
              }`}
            >
              {t("next") || (isRTL ? "التالي" : "Next")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Podcasts;
