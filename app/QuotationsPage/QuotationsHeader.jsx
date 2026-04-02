"use client";

import React from "react";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "../../i18n/routing";
import Image from "next/image";
import spinnerImage from "../../public/Home/shape-31.png";
import spinnerImageTwo from "../../public/Home/shape-32.png";

const QuotationsHeader = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="relative">
      <div className="bg-third p-20 text-white relative overflow-hidden">
        <Image
          src={spinnerImage}
          alt="decoration"
          className="absolute bottom-5 left-5 w-40 h-40 object-contain hidden md:block"
        />
        <Image
          src={spinnerImageTwo}
          alt="decoration"
          className="absolute top-7 right-5 w-50 h-50 object-contain hidden md:block"
        />
        {/* Content */}
        <div className="flex items-center justify-center flex-col gap-6 relative z-10">
          <h1
            className={`text-4xl md:text-6xl whitespace-nowrap text-primary font-bold ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("quotations.title")}
          </h1>

          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-3 text-lg ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link
              href="/"
              className="text-black whitespace-nowrap transition-colors duration-300 font-medium hover:text-primary"
            >
              {t("navbar.home")}
            </Link>

            {isRTL ? (
              <MdOutlineKeyboardDoubleArrowLeft className="text-primary" />
            ) : (
              <MdOutlineKeyboardDoubleArrowRight className="text-primary" />
            )}

            <span className="text-black whitespace-nowrap font-medium">
              {t("quotations.breadcrumb")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationsHeader;
