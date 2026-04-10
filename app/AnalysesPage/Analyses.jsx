"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Link, useRouter } from "../../i18n/routing";
import { useParams } from "next/navigation";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import {
  FaRegCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaStar,
  FaTwitter,
  FaHistory,
} from "react-icons/fa";
import { GrScheduleNew } from "react-icons/gr";

const Analyses = ({ articles, translations, locale, isRTL, currentType }) => {
  const router = useRouter();
  const params = useParams();
  const type = params ? params.type : null;

  useEffect(() => {
    if (!currentType || !type) return;
    const correctSlug = currentType.slug?.[locale] || currentType.slug?.["en"];
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    const decodedCurrent = decodeURIComponent(type);
    if (decodedCorrect && decodedCorrect !== decodedCurrent) {
      router.replace(`/analyses/${correctSlug}`, { scroll: false });
    }
  }, [currentType, type, locale, router]);

  if (!articles || articles.length === 0) {
    return (
      <div className="py-20 text-center text-slate-500 font-medium bg-gray-50 min-h-[50vh] flex items-center justify-center">
        {translations.noItems}
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const title = article.title?.[locale] || article.title?.["en"];
            const description =
              article.description?.[locale] || article.description?.["en"];
            const articleSlug = article.slug?.[locale] || article.slug?.["en"];

            const isFeatured = article.is_featured;
            const isOld = article.is_old;
            const publishedAt = article.published_at;
            const socialPlatforms = article.social_platforms || [];

            const getPlatformIcon = (platform) => {
              switch (platform.toLowerCase()) {
                case "facebook":
                  return <FaFacebook className="w-4 h-4 text-[#1877F2]" />;
                case "twitter":
                case "x":
                  return <FaTwitter className="w-4 h-4 text-black" />;
                case "instagram":
                  return <FaInstagram className="w-4 h-4 text-[#E4405F]" />;
                case "linkedin":
                  return <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />;
                default:
                  return null;
              }
            };

            return (
              <div
                key={article.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={article.image_url}
                    alt={title || "Article Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Category Badge & Status Tags */}
                  <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto flex flex-col gap-2 items-start rtl:items-start z-20">
                    <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg text-xs whitespace-nowrap font-black text-primary uppercase tracking-widest">
                      {article.type?.name?.[locale] ||
                        article.type?.name?.["en"]}
                    </span>
                    {isFeatured && (
                      <span className="bg-green-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <FaStar className="w-3 h-3" />
                        {isRTL ? "مميز" : "Featured"}
                      </span>
                    )}
                    {isOld === false && (
                      <span className="bg-blue-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <GrScheduleNew className="w-3 h-3" />
                        {isRTL ? "تحليل حديث" : "New"}
                      </span>
                    )}
                    {isOld === true && (
                      <span className="bg-amber-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <FaHistory className="w-3 h-3" />
                        {isRTL ? "تحليل قديم" : "Old"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col relative z-20 bg-white">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                      <FaRegCalendarAlt className="text-secondary" />
                      <span>{article.created_at}</span>
                    </div>
                    {publishedAt && (
                      <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-widest">
                        <FaRegCalendarAlt />
                        <span>
                          {isRTL ? "معاد النشر:" : "Republished:"} {publishedAt}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-baseTwo mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                    {description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/analyses/article/${articleSlug}`}
                      className="flex items-center justify-between gap-5 group/btn py-2"
                    >
                      <span className="text-sm font-black text-baseTwo uppercase tracking-widest group-hover/btn:text-primary transition-colors">
                        {translations.readMore}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-colors ms-2 rtl:ms-0 rtl:me-2">
                        {isRTL ? (
                          <MdOutlineKeyboardDoubleArrowLeft />
                        ) : (
                          <MdOutlineKeyboardDoubleArrowRight />
                        )}
                      </div>
                    </Link>

                    {socialPlatforms?.length > 0 && (
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                        {socialPlatforms.map((platform) => (
                          <span key={platform} title={platform}>
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analyses;
