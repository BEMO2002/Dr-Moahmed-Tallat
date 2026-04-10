"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "../../i18n/routing";
import { useParams } from "next/navigation";
import {
  FaRegCalendarAlt,
  FaFilePdf,
  FaRegLightbulb,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaStar,
  FaHistory,
} from "react-icons/fa";
import { useTranslations } from "next-intl";
import { GrScheduleNew } from "react-icons/gr";

const ArticlesandColumnsDetails = ({ post, locale, isRTL, translations }) => {
  const t = useTranslations("postDetails");
  const router = useRouter();
  const params = useParams();
  const slug = params ? params.slug : null;

  useEffect(() => {
    if (!post || !slug) return;
    const correctSlug = post.slug?.[locale] || post.slug?.["en"];
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    const decodedCurrent = decodeURIComponent(slug);
    if (decodedCorrect && decodedCorrect !== decodedCurrent) {
      router.replace(`/articles-columns/post/${correctSlug}`, {
        scroll: false,
      });
    }
  }, [post, slug, locale, router]);

  if (!post) return null;

  const title = post.title?.[locale] || post.title?.["en"];
  const description = post.description?.[locale] || post.description?.["en"];
  const strategicBrief =
    post.strategic_brief?.[locale] || post.strategic_brief?.["en"];
  const categoryName =
    post.category?.name?.[locale] || post.category?.name?.["en"];

  const isFeatured = post.is_featured;
  const isOld = post.is_old;

  let socialPlatforms = [];
  if (post.social_platforms) {
    try {
      socialPlatforms =
        typeof post.social_platforms === "string"
          ? JSON.parse(post.social_platforms)
          : post.social_platforms;
    } catch (e) {}
  }

  // Helper to format HTML-like text (line breaks)
  const formatContent = (text) => {
    return text.split("\n").map((line, i) => (
      <p
        key={i}
        className="mb-6 leading-loose text-gray-700 text-lg font-medium"
      >
        {line}
      </p>
    ));
  };

  return (
    <article className="pb-24">
      {/* Featured Image & Title Overlay */}
      <div className="relative h-[70vh]  w-full overflow-hidden">
        <Image
          src={post.image_url}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-baseTwo via-baseTwo/60 to-transparent" />

        {/* Top Right Tags */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end z-20">
          {isFeatured && (
            <span className="bg-green-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-1">
              <FaStar className="w-4 h-4" />
              {isRTL ? "مميز" : "Featured"}
            </span>
          )}
          {isOld === false && (
            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-1">
              <GrScheduleNew className="w-4 h-4" />
              {isRTL ? "مقال حديث" : "New"}
            </span>
          )}
          {isOld === true && (
            <span className="bg-amber-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-1">
              <FaHistory className="w-4 h-4" />
              {isRTL ? "مقال قديم" : "Old"}
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
              <span className="bg-primary text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl">
                {categoryName}
              </span>
              <div className="flex items-center gap-2 text-white/80 font-bold text-xs md:text-sm">
                <FaRegCalendarAlt className="text-primary" />
                <span>{post.created_at}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 md:mb-8 max-w-4xl">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Strategic Brief Box */}
            {strategicBrief && (
              <div className="relative mb-16 group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 rtl:right-auto rtl:left-0">
                    <FaRegLightbulb className="w-24 h-24 text-primary" />
                  </div>
                  <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 relative z-10">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <FaRegLightbulb className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="md:text-lg font-black text-baseTwo mb-3 md:mb-4 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-8 md:w-10 h-0.5 bg-primary rounded-full" />
                        {t("strategicBrief")}
                      </h4>
                      <p className="text-baseTwo md:text-lg font-black leading-relaxed italic">
                        &quot;{strategicBrief}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description Body */}
            <div className="prose prose-xl max-w-none prose-headings:font-black prose-headings:text-baseTwo prose-p:text-gray-600 prose-p:leading-loose">
              {formatContent(description)}
            </div>

            {/* PDF Viewer - Enhanced */}
            {post.attachment_url && (
              <div className="mt-20 border-t border-gray-100 pt-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                    <FaFilePdf className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-baseTwo">
                      {t("fullDocument")}
                    </h3>
                    <p className="text-gray-500 font-bold text-sm">
                      {t("pdfDescription")}
                    </p>
                  </div>
                </div>

                <div className="relative bg-gray-100 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-inner border-4 md:border-8 border-white p-1 md:p-2">
                  <iframe
                    src={`${post.attachment_url}#toolbar=0`}
                    className="w-full h-[500px] md:h-[800px] rounded-2xl bg-white shadow-2xl"
                    title={title}
                  />
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 rtl:left-2 rtl:right-auto md:rtl:left-4">
                    <a
                      href={post.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary hover:bg-secondary text-white px-4 md:px-8 py-2 md:py-3 rounded-full font-black text-[10px] md:text-xs transition-all shadow-xl flex items-center gap-2"
                    >
                      <FaFilePdf />
                      <span className="hidden xs:inline">{t("download")}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Extra Info (Optional) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Share Card */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <h4 className="text-baseTwo font-black text-lg mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {t("articleInfo")}
                </h4>

                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      {t("category")}
                    </span>
                    <span className="text-baseTwo font-bold text-sm">
                      {categoryName}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      {t("date")}
                    </span>
                    <span className="text-baseTwo font-bold text-sm">
                      {post.created_at}
                    </span>
                  </div>

                  {/* Published At */}
                  {post.published_at && (
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        {isRTL ? "معاد النشر" : "Published At"}
                      </span>
                      <span className="text-baseTwo font-bold text-sm">
                        {post.published_at}
                      </span>
                    </div>
                  )}

                  {/* Platforms Grid */}
                  {socialPlatforms && socialPlatforms.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        {isRTL
                          ? "المنصات التي نشر عليها"
                          : "Published Platforms"}
                      </span>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {socialPlatforms.map((platform) => {
                          let icon, name, color;
                          switch (platform.toLowerCase()) {
                            case "facebook":
                              icon = <FaFacebook />;
                              name = isRTL ? "فيسبوك" : "Facebook";
                              color =
                                "text-[#1877F2] border-[#1877F2]/20 bg-[#1877F2]/5";
                              break;
                            case "twitter":
                            case "x":
                              icon = <FaTwitter />;
                              name = isRTL ? "منصة X" : "X Platform";
                              color =
                                "text-black border-black/20 bg-black/5 flex-row-reverse"; // Adjusted to keep flow right
                              break;
                            case "instagram":
                              icon = <FaInstagram />;
                              name = isRTL ? "إنستجرام" : "Instagram";
                              color =
                                "text-[#E4405F] border-[#E4405F]/20 bg-[#E4405F]/5";
                              break;
                            case "linkedin":
                              icon = <FaLinkedin />;
                              name = isRTL ? "لينكد إن" : "LinkedIn";
                              color =
                                "text-[#0A66C2] border-[#0A66C2]/20 bg-[#0A66C2]/5";
                              break;
                            default:
                              return null;
                          }
                          return (
                            <div
                              key={platform}
                              className={`flex items-center justify-between border rounded-xl px-3 py-2 ${color}`}
                            >
                              <span className="text-[11px] font-bold whitespace-nowrap">
                                {name}
                              </span>
                              <span className="text-base">{icon}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {post.url && (
                    <div className="flex flex-col gap-3">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        {t("originalSource")}
                      </span>
                      <a
                        href={post.url}
                        target="_blank"
                        className="bg-baseTwo hover:bg-primary text-white text-center py-3 px-4 rounded-xl font-black text-xs transition-all duration-300 shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
                      >
                        {t("visitSource")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticlesandColumnsDetails;
