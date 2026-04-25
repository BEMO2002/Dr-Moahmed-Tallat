"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaInstagram, FaYoutube, FaFacebookF, FaPlay } from "react-icons/fa";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
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

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full -ml-20"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* Intro Header */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight"
          >
            {t("intro_title")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative p-8 md:p-12 rounded-[40px] bg-white/40 backdrop-blur-md border border-white/60 shadow-2xl shadow-primary/5 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-3xl -ml-16 -mb-16 group-hover:bg-primary/10 transition-colors duration-700"></div>

            <p className="relative text-xl md:text-2xl text-slate-600 leading-relaxed font-medium italic">
              <span className="text-primary/40 text-4xl font-serif absolute -top-4 -left-2 leading-none">
                “
              </span>
              {t("description")}
              <span className="text-primary/40 text-4xl font-serif absolute -bottom-8 -right-2 leading-none">
                ”
              </span>
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[32px] h-[450px] animate-pulse border border-slate-100 overflow-hidden"
              >
                <div className="h-56 bg-slate-200"></div>
                <div className="p-8 space-y-4">
                  <div className="h-4 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-8 w-full bg-slate-200 rounded-xl"></div>
                  <div className="h-4 w-2/3 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <ApiEmptyState
            title={t("noItems") || "لا توجد بودكاست متاحة."}
            description={
              isRTL
                ? "سيتم عرض حلقات البودكاست هنا فور إضافتها."
                : "Podcast episodes will appear here once they are published."
            }
            isRTL={isRTL}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, idx) => {
                const title = item.title?.[locale] || item.title?.["en"];
                const description =
                  item.description?.[locale] || item.description?.["en"];
                const decodedDescription = decodeHtml(description);
                const videoUrl = item.video_url;
                const platform = item.platform?.toLowerCase() || "";

                const getPlatformConfig = () => {
                  if (
                    platform.includes("youtube") ||
                    videoUrl?.includes("youtube.com") ||
                    videoUrl?.includes("youtu.be")
                  ) {
                    return {
                      icon: <FaYoutube />,
                      color: "#FF0000",
                      bg: "bg-red-50",
                      text: "text-red-600",
                      label: "YouTube",
                    };
                  }
                  if (
                    platform.includes("instagram") ||
                    videoUrl?.includes("instagram.com")
                  ) {
                    return {
                      icon: <FaInstagram />,
                      color: "#E4405F",
                      bg: "bg-pink-50",
                      text: "text-pink-600",
                      label: "Instagram",
                    };
                  }
                  if (
                    platform.includes("facebook") ||
                    videoUrl?.includes("facebook.com")
                  ) {
                    return {
                      icon: <FaFacebookF />,
                      color: "#1877F2",
                      bg: "bg-blue-50",
                      text: "text-blue-600",
                      label: "Facebook",
                    };
                  }
                  return {
                    icon: <FaPlay />,
                    color: "#6366f1",
                    bg: "bg-indigo-50",
                    text: "text-indigo-600",
                    label: "Podcast",
                  };
                };

                const config = getPlatformConfig();

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full"
                  >
                    {/* Thumbnail Section */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={
                          brokenImages[item.id]
                            ? "/Home/talaat-logo.png"
                            : item.image_url
                        }
                        alt={title}
                        fill
                        className={`group-hover:scale-110 transition-transform duration-700 ${
                          brokenImages[item.id]
                            ? "object-contain p-8 bg-slate-50"
                            : "object-cover"
                        }`}
                        onError={() =>
                          setBrokenImages((prev) => ({
                            ...prev,
                            [item.id]: true,
                          }))
                        }
                      />

                      {/* Platform Badge - Always Visible */}
                      <div
                        className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} z-20`}
                      >
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg ${config.bg} ${config.text} border border-white/50`}
                        >
                          <span className="text-sm">{config.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {config.label}
                          </span>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Content Section */}
                    <div
                      className={`p-8 flex-1 flex flex-col ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <h2 className="text-xl font-bold text-primary mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {title}
                      </h2>

                      <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                        {decodedDescription}
                      </p>

                      <div className="mt-auto">
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.1em] hover:bg-primary transition-all duration-300 w-full justify-center group/btn shadow-lg shadow-black/5 hover:shadow-primary/30 ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <span>{t("watchVideo") || "Watch Episode"}</span>
                          <div
                            className={`${isRTL ? "rotate-180" : ""} group-hover/btn:translate-x-1 transition-transform`}
                          >
                            <MdOutlineKeyboardDoubleArrowRight className="text-lg" />
                          </div>
                        </a>
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

                {Array.from(
                  { length: pagination.last_page },
                  (_, i) => i + 1,
                ).map((p) => (
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
                ))}

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
          </>
        )}
      </div>
    </section>
  );
};

export default Podcasts;
