"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "../../i18n/routing";
import { useParams } from "next/navigation";
import {
  FaFilePdf,
  FaDownload,
  FaRegCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaHistory,
  FaStar,
} from "react-icons/fa";
import { GrScheduleNew } from "react-icons/gr";

const AnalysesDetails = ({ article, translations, locale, isRTL }) => {
  const router = useRouter();
  const params = useParams();
  const slug = params ? params.slug : null;

  useEffect(() => {
    if (!article || !slug) return;
    const correctSlug = article.slug?.[locale] || article.slug?.["en"];
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    const decodedCurrent = decodeURIComponent(slug);
    if (decodedCorrect && decodedCorrect !== decodedCurrent) {
      router.replace(`/analyses/article/${correctSlug}`, { scroll: false });
    }
  }, [article, slug, locale, router]);

  if (!article) return null;

  const title = article.title?.[locale] || article.title?.["en"];
  const description =
    article.description?.[locale] || article.description?.["en"];

  const isFeatured = article.is_featured;
  const isOld = article.is_old;
  const publishedAt = article.published_at;

  let socialPlatforms = [];
  if (article.social_platforms) {
    try {
      socialPlatforms =
        typeof article.social_platforms === "string"
          ? JSON.parse(article.social_platforms)
          : article.social_platforms;
    } catch (e) {}
  }

  // Prepare attachments array for easy mapping
  const attachmentsList = [];
  if (article.attachments) {
    const keys = [
      "policy_paper",
      "strategic_fact_sheets",
      "strategic_brief",
      "analytical_infographic",
      "analytical_article",
    ];
    keys.forEach((key) => {
      if (article.attachments[key]) {
        attachmentsList.push({
          key,
          url: article.attachments[key],
          label: translations.files?.[key] || key.replace("_", " "),
        });
      }
    });
  }

  return (
    <div className="py-20  min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
              <Image
                src={article.image_url}
                alt={title || "Article Image"}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30" />

              {/* Top Right Tags */}
              <div
                className={`absolute top-6 ${
                  isRTL ? "right-6" : "left-6"
                } flex flex-col gap-2 items-start z-20`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isFeatured && (
                  <span className="bg-green-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-1">
                    <FaStar className="w-4 h-4" />
                    {isRTL ? "مميز" : "Featured"}
                  </span>
                )}
                {isOld === false && (
                  <span className="bg-blue-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-1">
                    <GrScheduleNew className="w-4 h-4" />
                    {isRTL ? "تحليل حديث" : "New"}
                  </span>
                )}
                {isOld === true && (
                  <span className="bg-amber-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-1">
                    <FaHistory className="w-4 h-4" />
                    {isRTL ? "تحليل قديم" : "Old"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">
              <FaRegCalendarAlt className="text-secondary" />
              <span className="whitespace-nowrap ">{article.created_at}</span>
              <span className="mx-2">•</span>
              <span className="text-primary whitespace-nowrap">
                {article.type?.name?.[locale] || article.type?.name?.["en"]}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-baseTwo leading-tight mb-8">
              {title}
            </h1>

            <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed">
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </div>

          {/* Sidebar Area (Attachments) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-28">
              {/* Article Info Section */}
              <div className="mb-8 space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-primary text-[13px] font-black uppercase tracking-widest">
                    {isRTL ? "القسم" : "Category"}
                  </span>
                  <span className="text-baseTwo text-sm font-bold">
                    {article.type?.name?.[locale] || article.type?.name?.["en"]}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-primary text-[13px] font-black uppercase tracking-widest">
                    {isRTL ? "التاريخ" : "Date"}
                  </span>
                  <span className="text-baseTwo font-bold text-sm">
                    {article.created_at}
                  </span>
                </div>

                {publishedAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-primary text-[13px] font-black uppercase tracking-widest">
                      {isRTL ? "معاد النشر" : "Published At"}
                    </span>
                    <span className="text-baseTwo font-bold text-sm">
                      {publishedAt}
                    </span>
                  </div>
                )}

                {socialPlatforms && socialPlatforms.length > 0 && (
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                    <span className="text-primary text-[13px] font-black uppercase tracking-widest">
                      {isRTL ? "المنصات التي نشر عليها" : "Published Platforms"}
                    </span>
                    <div className="grid grid-cols-1 gap-2 text-2xl mt-1">
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
                              "text-black border-black/20 bg-black/5 flex-row-reverse";
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
                            <span className="text-[15px] font-bold whitespace-nowrap">
                              {name}
                            </span>
                            <span className="text-base">{icon}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-baseTwo mb-6 flex items-center gap-3 pt-8 border-t border-gray-100">
                <span className="w-2 h-8 rounded-full bg-primary" />
                {translations.attachments}
              </h3>

              {attachmentsList.length > 0 ? (
                <div className="space-y-4">
                  {attachmentsList.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FaFilePdf className="text-primary text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-baseTwo text-sm">
                            {file.label}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-white group-hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
                          PDF & DOCX
                        </span>
                        <div className="w-8 h-8 rounded-full bg-baseTwo text-white flex items-center justify-center group-hover:bg-primary transition-colors hover:shadow-lg hover:shadow-primary/30">
                          <FaDownload size={12} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 font-medium">
                  {translations.noItems}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysesDetails;
