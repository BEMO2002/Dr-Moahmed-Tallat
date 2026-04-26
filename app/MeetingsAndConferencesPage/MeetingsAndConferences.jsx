"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { fetchConferences } from "../lib/server-api";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaPlayCircle,
  FaGlobe,
} from "react-icons/fa";
import ApiEmptyState from "../Components/ApiEmptyState";

const MeetingsAndConferences = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [brokenEmbeds, setBrokenEmbeds] = useState({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchConferences({ page });
        if (data) {
          setItems(data.data || []);
          setPagination({
            current_page: data.current_page,
            last_page: data.last_page,
            total: data.total,
          });
        }
      } catch (err) {
        console.error("Error fetching conferences:", err);
        setError("meetings.loadError");
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [page]);

  const getEmbedUrl = (url, platform) => {
    if (!url) return "";

    // Clean the URL from any potential escaped slashes from the API
    const normalizedUrl = url.replace(/\\/g, "");

    // 1. YouTube
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const youtubeMatch = normalizedUrl.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // 2. Instagram
    if (normalizedUrl.includes("instagram.com")) {
      const cleanUrl = normalizedUrl.split("?")[0].replace(/\/+$/, "");
      return `${cleanUrl}/embed/`;
    }

    // 3. Facebook
    if (normalizedUrl.includes("facebook.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(normalizedUrl)}&show_text=0&width=560`;
    }

    // 4. TikTok
    if (normalizedUrl.includes("tiktok.com")) {
      // Basic TikTok embed support
      const tiktokMatch = normalizedUrl.match(/\/video\/(\d+)/);
      if (tiktokMatch && tiktokMatch[1]) {
        return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
      }
    }

    return normalizedUrl;
  };

  const renderPlatformIcon = (platform) => {
    const p = platform?.toLowerCase() || "";
    if (p.includes("youtube")) return <FaYoutube />;
    if (p.includes("facebook")) return <FaFacebook />;
    if (p.includes("instagram")) return <FaInstagram />;
    if (p.includes("tik")) return <FaTiktok />;
    return <FaGlobe />;
  };

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-slate-100 animate-pulse"
            >
              <div className="h-6 bg-slate-100 w-3/4 mb-6 rounded-full"></div>
              <div className="aspect-video bg-slate-100 rounded-2xl w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-40 text-center">
        <p className="text-red-500 font-bold text-xl">{t(error)}</p>
      </div>
    );
  }

  return (
    <section className="relative py-10 min-h-screen overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full -ml-20"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {items.length === 0 ? (
          <ApiEmptyState
            title={t("meetings.noItems")}
            description={
              isRTL
                ? "سيتم عرض اللقاءات والمؤتمرات هنا فور رفع المحتوى."
                : "Meetings and conferences will appear here once content is uploaded."
            }
            isRTL={isRTL}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
            {items.map((item, idx) => {
              const title = item.title?.[locale] || "";
              const embedUrl = getEmbedUrl(item.video_url, item.platform);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                    <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col justify-between">
                      <div
                        className={`flex flex-col gap-8 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {/* Header */}
                        <div className="flex flex-col gap-4">
                          <div
                            className={`flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <span className="text-2xl">
                              {renderPlatformIcon(item.platform)}
                            </span>
                            <span>{item.platform || "Video"}</span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-16">
                            {title}
                          </h2>
                        </div>

                        {/* Video Embed */}
                        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 shadow-inner group-hover:shadow-primary/10 transition-shadow">
                          {/* Always render Image as background/fallback */}
                          <Image
                            src="/Home/talaat-logo.png"
                            alt="Talaat logo"
                            fill
                            className="object-contain p-12 opacity-50"
                          />

                          {/* Render iframe on top if available */}
                          {embedUrl && !brokenEmbeds[item.id] && (
                            <iframe
                              src={embedUrl}
                              title={title || "Meeting embed"}
                              className="absolute inset-0 w-full h-full z-10"
                              frameBorder="0"
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              onError={() =>
                                setBrokenEmbeds((prev) => ({
                                  ...prev,
                                  [item.id]: true,
                                }))
                              }
                            ></iframe>
                          )}

                          {/* Placeholder message if no embed or broken */}
                          {(!embedUrl || brokenEmbeds[item.id]) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 backdrop-blur-sm z-20">
                              <p className="text-white font-bold text-sm">
                                {isRTL
                                  ? "سيظهر الفيديو هنا بعد تحديث الرابط."
                                  : "The video will appear here once the link is updated."}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer Actions */}
                        <div
                          className={`flex items-center mt-4 ${isRTL ? "justify-end" : "justify-start"}`}
                        >
                          <a
                            href={item.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all duration-300 font-bold group/btn text-sm shadow-lg hover:shadow-primary/30"
                          >
                            <span className="text-xl group-hover/btn:scale-110 transition-transform">
                              {renderPlatformIcon(item.platform)}
                            </span>
                            <span>{t("meetings.watchVideo")}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-20 flex justify-center items-center gap-2 md:gap-4 flex-wrap">
            <button
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={page === 1}
              className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                page === 1
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
                  onClick={() => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl font-black transition-all ${
                    page === p
                      ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110"
                      : "bg-white text-slate-600 border border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => {
                if (page < pagination.last_page) {
                  setPage(page + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={page === pagination.last_page}
              className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                page === pagination.last_page
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

export default MeetingsAndConferences;
