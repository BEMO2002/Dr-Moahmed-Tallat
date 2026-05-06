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
            className={`text-xl md:text-3xl lg:text-4xl text-primary font-bold ${isRTL ? "text-right" : "text-left"} text-center uppercase leading-tight max-w-full px-4`}
          >
            {title}
          </h1>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="w-full max-w-full overflow-hidden">
            <ol
              className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm md:text-lg ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <li>
                <Link
                  href="/"
                  className="text-black transition-colors duration-300 font-medium hover:text-primary"
                >
                  {breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden="true">
                {isRTL ? (
                  <MdOutlineKeyboardDoubleArrowLeft className="text-primary" />
                ) : (
                  <MdOutlineKeyboardDoubleArrowRight className="text-primary" />
                )}
              </li>
              <li
                className="text-black font-medium break-words text-center max-w-[200px] sm:max-w-xs md:max-w-none"
                aria-current="page"
              >
                {breadcrumbCurrent}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AnalysesHeader;
