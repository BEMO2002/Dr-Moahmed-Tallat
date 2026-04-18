"use client";
import React from "react";
import Image from "next/image";
import { Link } from "../../i18n/routing";
import {
  FaRegCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaHistory,
  FaStar,
} from "react-icons/fa";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { GrScheduleNew } from "react-icons/gr";
import ApiEmptyState from "../Components/ApiEmptyState";
const ArticlesandColumns = ({ posts, locale, isRTL, translations }) => {
  const [brokenImages, setBrokenImages] = React.useState({});

  if (!posts || posts.length === 0) {
    return (
      <ApiEmptyState
        title={isRTL ? "لا يوجد مقالات" : "No Articles Found"}
        description={
          isRTL
            ? "لم يتم العثور على مقالات في هذا القسم حالياً."
            : "No articles found in this category at the moment."
        }
        isRTL={isRTL}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {posts.map((post) => {
        const title = post.title?.[locale] || post.title?.["en"];
        const categoryName =
          post.category?.name?.[locale] || post.category?.name?.["en"];
        const slug = post.slug?.[locale] || post.slug?.["en"];
        const strategicBrief =
          post.strategic_brief?.[locale] || post.strategic_brief?.["en"];
        const isFeatured = post.is_featured;
        const isOld = post.is_old;
        const publishedAt = post.published_at;
        const socialPlatforms = post.social_platforms || [];

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
            key={post.id}
            className="group bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
          >
            {/* Image Wrapper */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src={brokenImages[post.id] ? "/Home/talaat-logo.png" : post.image_url}
                alt={title}
                fill
                className={`group-hover:scale-110 transition-transform duration-700 ease-in-out ${
                  brokenImages[post.id] ? "object-contain p-6 bg-slate-50" : "object-cover"
                }`}
                onError={() =>
                  setBrokenImages((prev) => ({ ...prev, [post.id]: true }))
                }
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Category and Status Tags */}
              <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto flex flex-col gap-2 items-start rtl:items-start z-20">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg text-xs whitespace-nowrap font-black text-primary uppercase tracking-widest">
                  {post.category?.name?.[locale] || post.category?.name?.["en"]}
                </span>
                {isFeatured && (
                  <span className="bg-green-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <FaStar className="w-3 h-3" />
                    {isRTL ? "مميز" : "Featured"}
                  </span>
                )}
                {isOld === false && (
                  <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <GrScheduleNew className="w-3 h-3" />
                    {isRTL ? "مقال حديث" : "New"}
                  </span>
                )}
                {isOld === true && (
                  <span className="bg-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <FaHistory className="w-3 h-3" />
                    {isRTL ? "مقال قديم" : "Old"}
                  </span>
                )}
              </div>
              <div></div>
            </div>

            {/* Content Wrapper */}
            <div className="p-8 flex-1 flex flex-col relative -mt-10 bg-white rounded-t-4xl z-10">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-widest">
                  <FaRegCalendarAlt />
                  <span>{post.created_at}</span>
                </div>
                {publishedAt && (
                  <div className="flex items-center gap-2 text-secondary font-bold text-[11px] uppercase tracking-widest">
                    <FaRegCalendarAlt />
                    <span>
                      {isRTL ? "معاد النشر:" : "Republished:"} {publishedAt}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-baseTwo mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>

              <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed mb-8 flex-1">
                {strategicBrief}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <Link
                  href={`/articles-columns/post/${slug}`}
                  className="inline-flex items-center gap-3 text-sm font-black text-baseTwo group/btn hover:text-primary transition-colors"
                >
                  <span>{isRTL ? "اقرأ المزيد" : "READ MORE"}</span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-2 rtl:group-hover/btn:-translate-x-2">
                    {isRTL ? <HiOutlineArrowLeft /> : <HiOutlineArrowRight />}
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
  );
};

export default ArticlesandColumns;
