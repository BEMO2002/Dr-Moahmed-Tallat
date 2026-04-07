"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Galleries = ({ data, initialPage = 1 }) => {
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    index: 0,
  });
  const t = useTranslations("galleries");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  // API structure: data -> { code, status, message, data: { current_page, last_page, data: [...] } }
  const items = data?.data?.data || [];
  const pagination = data?.data || {};

  const openLightbox = (images, index) => {
    if (!images || !images.length) return;
    setLightbox({ isOpen: true, images, index });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, images: [], index: 0 });
  };

  useEffect(() => {
    if (lightbox.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [lightbox.isOpen]);

  const handlePageChange = (page) => {
    router.push(`/galleries?page=${page}`, { scroll: false });
  };

  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl text-slate-500 font-medium">
          {t("no_galleries") || "No galleries found."}
        </p>
      </div>
    );
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden ">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {items.map((album, idx) => {
            const title = album.title?.[locale] || album.title?.["en"];
            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100"
              >
                {/* Album Swiper */}
                <div className="relative aspect-16/10 overflow-hidden">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation={{
                      nextEl: `.swiper-next-${album.id}`,
                      prevEl: `.swiper-prev-${album.id}`,
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    className="h-full w-full"
                  >
                    {album.images.map((img, i) => (
                      <SwiperSlide
                        key={i}
                        className="relative cursor-pointer bg-slate-100"
                        onClick={() => openLightbox(album.images, i)}
                      >
                        {/* Blurred background to fill empty space */}
                        <div className="absolute inset-0 blur-xl opacity-30 scale-110">
                          <Image
                            src={img}
                            alt="bg"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Image
                          src={img}
                          alt={`${title} - ${i + 1}`}
                          fill
                          className="object-contain relative z-10 p-2 transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                          <FaExpand className="text-white text-3xl drop-shadow-lg" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation */}
                  <button
                    className={`swiper-prev-${album.id} absolute top-1/2 ${isRTL ? "right-4" : "left-4"} -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-primary transition-all hover:bg-primary hover:text-white opacity-0 group-hover:opacity-100`}
                  >
                    {isRTL ? (
                      <FaChevronRight size={14} />
                    ) : (
                      <FaChevronLeft size={14} />
                    )}
                  </button>
                  <button
                    className={`swiper-next-${album.id} absolute top-1/2 ${isRTL ? "left-4" : "right-4"} -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-primary transition-all hover:bg-primary hover:text-white opacity-0 group-hover:opacity-100`}
                  >
                    {isRTL ? (
                      <FaChevronLeft size={14} />
                    ) : (
                      <FaChevronRight size={14} />
                    )}
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 text-primary/60 text-sm mb-3">
                    <FaCalendarAlt size={12} />
                    <span className="font-semibold">{album.created_at}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-baseTwo mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                  </h3>
                  <button
                    onClick={() => openLightbox(album.images, 0)}
                    className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                  >
                    <span>{t("view_album")}</span>
                    {isRTL ? (
                      <FaChevronLeft className="text-sm" />
                    ) : (
                      <FaChevronRight className="text-sm" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${
                    p === pagination.current_page
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white text-baseTwo hover:bg-slate-50 border border-slate-100"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-2000 bg-black/95 flex items-center justify-center backdrop-blur-sm"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20"
            >
              <FaTimes size={24} />
            </button>

            <div className="w-full h-full max-w-6xl max-h-[85vh] p-4 relative group">
              <Swiper
                modules={[Navigation, Pagination]}
                initialSlide={lightbox.index}
                navigation={{
                  nextEl: ".lb-next",
                  prevEl: ".lb-prev",
                }}
                pagination={{ type: "fraction", el: ".lb-pagination" }}
                className="h-full w-full rounded-2xl"
              >
                {lightbox.images.map((img, i) => (
                  <SwiperSlide
                    key={i}
                    className="flex items-center justify-center"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Image ${i + 1}`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button className="lb-prev absolute top-1/2 left-4 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all">
                <FaChevronLeft size={20} />
              </button>
              <button className="lb-next absolute top-1/2 right-4 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all">
                <FaChevronRight size={20} />
              </button>

              <div className="lb-pagination absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-bold text-lg bg-black/50 px-6 py-2 rounded-full z-10"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galleries;
