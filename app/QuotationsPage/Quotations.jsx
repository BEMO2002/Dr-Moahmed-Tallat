"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { fetchTestimonials } from "../lib/server-api";
import { FiCopy, FiShare2 } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  useMotionTemplate,
} from "framer-motion";
import { MdDoneAll } from "react-icons/md";
import Image from "next/image";
import ApiEmptyState from "../Components/ApiEmptyState";
import { useSettings } from "../Context/SettingContext";

const Quotations = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { settings } = useSettings();
  const siteLogo = settings?.logo || "/Home/talaat-logo.png";

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [showToast, setShowToast] = useState(null);

  // منطق تحريك زاوية الإطار
  const angle = useMotionValue(0);
  useEffect(() => {
    const controls = animate(angle, 360, {
      duration: 4, // سرعة الدوران
      repeat: Infinity,
      ease: "linear",
    });
    return controls.stop;
  }, [angle]);

  // إنشاء الـ Gradient المتحرك
  const background = useMotionTemplate`repeating-conic-gradient(
    from ${angle}deg,
    var(--color-secondary, #e2e8f0) 0%,
    var(--color-secondary, #3b82f6) 10%,
    transparent 15%,
    transparent 35%,
    var(--color-secondary, #3b82f6) 50%
  )`;

  useEffect(() => {
    const loadQuotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTestimonials({ page });
        if (data) {
          setQuotes(data.data || []);
          setPagination({
            current_page: data.current_page,
            last_page: data.last_page,
            total: data.total,
          });
        }
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError("quotations.loadError");
      } finally {
        setLoading(false);
      }
    };
    loadQuotes();
  }, [page]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowToast(t("quotations.copySuccess"));
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleShare = async (quote) => {
    const text = quote.text?.[locale] || "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("quotations.shareTitle"),
          text: text,
          url: window.location.href,
        });
        setShowToast(t("quotations.shareSuccess"));
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`);
      setShowToast(t("quotations.copySuccess"));
    }
    setTimeout(() => setShowToast(null), 3000);
  };

  if (loading && quotes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 animate-pulse h-64"
            >
              <div className="h-4 bg-slate-100 w-3/4 mb-4 rounded-full"></div>
              <div className="h-4 bg-slate-100 w-full mb-4 rounded-full"></div>
              <div className="h-4 bg-slate-100 w-1/2 mb-8 rounded-full"></div>
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
              </div>
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
    <section className="relative py-24 min-h-screen overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full -ml-20"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {quotes.length === 0 ? (
          <ApiEmptyState
            title={t("quotations.noQuotes")}
            description={
              isRTL
                ? "سيتم عرض الاقتباسات الصحفية هنا فور إضافتها."
                : "Press quotations will appear here once they are published."
            }
            isRTL={isRTL}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {quotes.map((quote, idx) => {
              const text = quote.text?.[locale] || "";
              return (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative p-[3px] rounded-[43px] overflow-hidden transition-all duration-500"
                >
                  <motion.div
                    style={{ background }}
                    className="absolute inset-0 z-0"
                  />

                  <div className="relative z-10 bg-white border border-slate-100 rounded-[40px] p-8 md:p-12 h-full flex flex-col justify-between shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    <div
                      className={`absolute ${isRTL ? "left-6" : "right-6"} top-5 text-primary/10 group-hover:text-primary/20 transition-colors duration-500`}
                    >
                      <FaQuoteLeft size={50} />
                    </div>

                    <div className="relative z-10">
                      <div
                        className={`mb-3 flex items-center ${isRTL ? "justify-start" : "justify-start"}`}
                      >
                        <Image
                          src={siteLogo}
                          alt="Site logo"
                          width={85}
                          height={85}
                          className="object-contain"
                        />
                      </div>
                      <p
                        className={`text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-10 pb-10 border-b border-slate-50 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {text}
                      </p>

                      <div
                        className={`flex items-center gap-4 ${isRTL ? "justify-end" : "justify-start"}`}
                      >
                        <button
                          onClick={() => handleCopy(text)}
                          className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 font-bold text-sm border border-slate-100 group/btn"
                          title={t("quotations.copy")}
                        >
                          <FiCopy className="text-lg group-hover/btn:scale-110 transition-transform" />
                          <span>{t("quotations.copy")}</span>
                        </button>

                        <button
                          onClick={() => handleShare(quote)}
                          className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 font-bold text-sm border border-slate-100 group/btn"
                          title={t("quotations.share")}
                        >
                          <FiShare2 className="text-lg group-hover/btn:scale-110 transition-transform" />
                          <span>{t("quotations.share")}</span>
                        </button>
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

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 whitespace-nowrap -translate-x-1/2 z-[1000] bg-white text-slate-900 px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border border-black/10"
          >
            <div className="animate-pulse">
              <MdDoneAll className="text-green-700" size={24} />
            </div>
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Quotations;
