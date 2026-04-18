"use client";

import React from "react";
import Image from "next/image";
import { Link } from "../../i18n/routing";

const ApiEmptyState = ({
  title,
  description,
  ctaLabel,
  ctaHref,
  isRTL = false,
}) => {
  return (
    <section className="py-20 md:py-28 px-4 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-primary/8 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-slate-200/60 rounded-full blur-[95px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] border border-slate-200 p-10 md:p-14 text-center shadow-2xl shadow-slate-200/60 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.14em]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {isRTL ? "تحديث قريب" : "Update Soon"}
          </div>

          <div className="w-32 h-32 md:w-36 md:h-36 bg-slate-50 rounded-4xl flex items-center justify-center mx-auto mb-7 shadow-inner border border-slate-200/70 overflow-hidden">
          <Image
            src="/Home/talaat-logo.png"
            alt="Talaat logo"
            width={104}
            height={104}
            className="object-contain"
          />
        </div>

          <h3 className="text-2xl md:text-3xl font-black text-baseTwo mb-4 leading-tight">
            {title}
          </h3>

          {description ? (
            <p className="text-slate-600 mb-8 leading-[1.9] text-lg font-medium max-w-xl mx-auto">
              {description}
            </p>
          ) : (
            <p className="text-slate-500 mb-8 leading-[1.9] font-medium max-w-xl mx-auto">
              {isRTL
                ? "لا توجد بيانات متاحة حالياً، سيتم عرض المحتوى فور إضافته."
                : "No data is available right now. Content will appear once it is published."}
            </p>
          )}

          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.18em] rounded-2xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-xl shadow-primary/25 active:scale-95"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApiEmptyState;
