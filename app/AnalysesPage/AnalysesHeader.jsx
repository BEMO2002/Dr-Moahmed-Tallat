import React from "react";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { Link } from "../../i18n/routing";
import Image from "next/image";
import spinnerImage from "../../public/Home/shape-31.png";
import spinnerImageTwo from "../../public/Home/shape-32.png";

const AnalysesHeader = ({
  title,
  breadcrumbHome,
  breadcrumbCurrent,
  isRTL,
}) => {
  return (
    <div className="relative">
      <div className="bg-third p-12 md:p-20 text-white relative overflow-hidden">
        <Image
          src={spinnerImage}
          alt="decoration"
          width={200}
          height={200}
          className="absolute bottom-5 left-5 w-32 h-32 md:w-40 md:h-40 object-contain hidden md:block"
        />
        <Image
          src={spinnerImageTwo}
          alt="decoration"
          width={200}
          height={200}
          className="absolute top-7 right-5 w-40 h-40 md:w-50 md:h-50 object-contain hidden md:block"
        />
        {/* Content */}
        <div className="flex items-center justify-center flex-col gap-6 relative z-10">
          <h1
            className={`text-[22px] md:text-5xl text-primary font-bold ${isRTL ? "text-right" : "text-left"} text-center uppercase `}
          >
            {title}
          </h1>

          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-3 text-lg ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link
              href="/"
              className="text-black text-sm md:text-lg transition-colors duration-300 font-medium hover:text-primary whitespace-nowrap"
            >
              {breadcrumbHome}
            </Link>

            {isRTL ? (
              <MdOutlineKeyboardDoubleArrowLeft className="text-primary" />
            ) : (
              <MdOutlineKeyboardDoubleArrowRight className="text-primary" />
            )}

            <span className="text-black text-sm md:text-lg  font-medium">
              {breadcrumbCurrent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysesHeader;
