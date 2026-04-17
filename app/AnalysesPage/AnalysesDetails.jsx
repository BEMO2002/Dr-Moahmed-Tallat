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
  FaTags,
  FaQuoteLeft,
} from "react-icons/fa";
import { GrScheduleNew } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import {
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineInformationCircle,
  HiOutlineClipboardCheck,
  HiSparkles,
  HiOutlineMenuAlt2,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { BiBullseye } from "react-icons/bi";
import TalatAIChat from "./TalatAIChat";

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

  const content = {
    title: article.title?.[locale] || article.title?.["en"],
    subtitle: article.subtitle?.[locale] || article.subtitle?.["en"],
    description: article.description?.[locale] || article.description?.["en"],
    centralConcepts:
      article.central_concepts?.[locale] || article.central_concepts?.["en"],
    articleBody: article.article_body?.[locale] || article.article_body?.["en"],
    analyticalMechanism:
      article.analytical_mechanism?.[locale] ||
      article.analytical_mechanism?.["en"],
    whyItMatters:
      article.why_it_matters?.[locale] || article.why_it_matters?.["en"],
    relatedMaterials:
      article.related_materials?.[locale] || article.related_materials?.["en"],
    talatAI:
      article.talat_ai_questions?.[locale] ||
      article.talat_ai_questions?.["en"],
    sovereignSummary:
      article.sovereign_summary?.[locale] || article.sovereign_summary?.["en"],
    tags:
      article.publishing_data_tags?.[locale] ||
      article.publishing_data_tags?.["en"],
  };

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

  // Enhanced Attachments
  const attachmentsList = [];
  if (article.attachments) {
    const keys = [
      {
        key: "infographic_design",
        label: isRTL ? "انفوجرافيك ديزاين" : "Infographic Design",
      },
      {
        key: "interactive_infographic",
        label: isRTL ? "انفوجرافيك تفاعلي" : "Interactive Infographic",
      },
      {
        key: "policy_paper",
        label: translations.files?.policy_paper || "Policy Paper",
      },
      {
        key: "strategic_fact_sheets",
        label:
          translations.files?.strategic_fact_sheets || "Strategic Fact Sheets",
      },
      {
        key: "strategic_brief",
        label: translations.files?.strategic_brief || "Strategic Brief",
      },
      {
        key: "analytical_infographic",
        label:
          translations.files?.analytical_infographic ||
          "Analytical Infographic",
      },
      {
        key: "analytical_article",
        label: translations.files?.analytical_article || "Analytical Article",
      },
    ];

    keys.forEach(({ key, label }) => {
      if (article.attachments[key]) {
        attachmentsList.push({
          key,
          url: article.attachments[key],
          label: label,
        });
      }
    });
  }

  return (
    <div className="py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Header & Intro */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-100">
              <div className="relative w-full h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden mb-12 group">
                <Image
                  src={article.image_url}
                  alt={content.title || "Article Image"}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                {/* Status Badges */}
                <div
                  className={`absolute top-8 ${isRTL ? "right-8" : "left-8"} flex flex-col gap-3 z-20`}
                >
                  {isFeatured && (
                    <span className="bg-green-600/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black text-white uppercase tracking-[0.2em] shadow-xl flex items-center gap-2">
                      <FaStar className="w-3 h-3" />
                      {isRTL ? "مميز" : "Featured"}
                    </span>
                  )}
                  {isOld === false && (
                    <span className="bg-primary/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black text-white uppercase tracking-[0.2em] shadow-xl flex items-center gap-2">
                      <GrScheduleNew className="w-4 h-4" />
                      {isRTL ? "مقال حديث" : "New Article"}
                    </span>
                  )}
                  {isOld === true && (
                    <span className="bg-amber-600/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black text-white uppercase tracking-[0.2em] shadow-xl flex items-center gap-2">
                      <FaHistory className="w-3 h-3" />
                      {isRTL ? "مقال قديم" : "Old Article"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-3 text-slate-400 text-sm font-black uppercase tracking-widest">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <FaRegCalendarAlt className="text-primary text-base" />
                  </div>
                  <span>{article.created_at}</span>
                </div>
                <div className="flex items-center gap-3 text-primary text-sm font-black uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>
                    {article.type?.name?.[locale] || article.type?.name?.["en"]}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-baseTwo leading-[1.2] mb-6">
                {content.title}
              </h1>

              {content.subtitle && (
                <p className="text-xl md:text-2xl font-bold text-primary mb-8 leading-relaxed opacity-90">
                  {content.subtitle}
                </p>
              )}

              <div className="prose prose-xl max-w-none text-slate-600 leading-[1.8] font-medium">
                <p className="whitespace-pre-line bg-slate-50/50 p-8 rounded-3xl border-l-4 border-primary italic">
                  {content.description}
                </p>
              </div>
            </div>

            {/* 2. Structured Content Blocks */}
            <div className="space-y-12">
              {/* Central Concepts / الأطروحة المركزية */}
              {content.centralConcepts && (
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shadow-inner">
                      <HiOutlineAcademicCap className="text-amber-600 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-baseTwo">
                      {isRTL ? "الأطروحة المركزية" : "Central Concepts"}
                    </h2>
                  </div>
                  <div className="text-slate-600 leading-[1.8] text-lg">
                    {content.centralConcepts}
                  </div>
                </div>
              )}

              {/* Article Body / متن المقال */}
              {content.articleBody && (
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <HiOutlineDocumentText size={200} />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <HiOutlineDocumentText className="text-blue-600 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-baseTwo">
                      {isRTL ? "متن المقال" : "Article Content"}
                    </h2>
                  </div>
                  <div className="text-slate-600 leading-20 text-lg whitespace-pre-line">
                    {content.articleBody}
                  </div>
                </div>
              )}

              {/* Analytical Mechanism / الآلية التحليلية */}
              {content.analyticalMechanism && (
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent)] pointer-events-none" />
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <HiOutlineMenuAlt2 className="text-primary text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black">
                      {isRTL ? "الآلية التحليلية" : "Analytical Mechanism"}
                    </h2>
                  </div>
                  <div className="text-slate-300 leading-[1.8] text-lg relative z-10">
                    {content.analyticalMechanism}
                  </div>
                </div>
              )}

              {/* Why It Matters / لماذا يهم هذا المقال */}
              {content.whyItMatters && (
                <div className="bg-secondary/5 rounded-[2.5rem] p-8 md:p-12 border-2 border-secondary/20 shadow-sm relative overflow-hidden">
                  <FaQuoteLeft
                    className={`absolute ${isRTL ? "top-8 left-8" : "top-8 right-8"} text-secondary/10 text-7xl`}
                  />
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-black text-baseTwo">
                      {isRTL ? "لماذا يهم هذا المقال؟" : "Why It Matters?"}
                    </h2>
                  </div>
                  <div className="text-slate-700 leading-[1.8] text-xl font-bold italic">
                    {content.whyItMatters}
                  </div>
                </div>
              )}

              {/* Talat AI Section */}
              {content.talatAI && (
                <div className="border-2 border-primary rounded-[2.5rem] p-1 md:p-1.5 ">
                  <div className="bg-white rounded-[2.4rem] p-8 md:p-12">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <HiSparkles className="text-primary text-3xl animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-baseTwo leading-none mb-1">
                            Talat AI
                          </h2>
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            {isRTL
                              ? "المساعد الذكي"
                              : "Smart Analysis Assistant"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                      <p className="text-primary font-black mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
                        <HiOutlineInformationCircle className="text-xl" />
                        {isRTL
                          ? "اسأل Talat AI عن هذا المقال"
                          : "Ask Talat AI about this article"}
                      </p>
                      <div className="text-slate-700 leading-[2] text-lg prose max-w-none prose-ul:list-none prose-ul:p-0">
                        {content.talatAI}
                      </div>
                    </div>
                    <TalatAIChat
                      articleId={article.id}
                      articleTitle={content.title}
                      isRTL={isRTL}
                    />
                  </div>
                </div>
              )}

              {/* Sovereign Summary / الخلاصة السيادية */}
              {content.sovereignSummary && (
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <HiOutlineClipboardCheck className="text-primary text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-baseTwo">
                      {isRTL ? "الخلاصة السيادية" : "Sovereign Summary"}
                    </h2>
                  </div>
                  <div className="text-slate-600 leading-[1.8] text-lg">
                    {content.sovereignSummary}
                  </div>
                </div>
              )}

              {/* Related Materials / مواد مرتبطة */}
              {content.relatedMaterials && (
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                  <h2 className="text-xl font-black text-baseTwo mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full bg-primary" />
                    {isRTL ? "مواد مرتبطة" : "Related Materials"}
                  </h2>
                  <div className="text-slate-600 leading-[1.8] text-lg">
                    {content.relatedMaterials}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* 1. Article Info */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50 space-y-6">
                <div className="pb-6 border-b border-slate-50">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                    {isRTL ? "عن المقال" : "About Analysis"}
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500">
                        {isRTL ? "التاريخ" : "Created"}
                      </span>
                      <span className="text-sm font-black text-baseTwo">
                        {article.created_at}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500">
                        {isRTL ? "القسم" : "Category"}
                      </span>
                      <span className="text-sm font-black text-primary">
                        {article.type?.name?.[locale] ||
                          article.type?.name?.["en"]}
                      </span>
                    </div>
                    {publishedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-500">
                          {isRTL ? "معاد النشر" : "Republished"}
                        </span>
                        <span className="text-sm font-black text-[#D4AF37]">
                          {publishedAt}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags Section / بيانات النشر والوسوم */}
                {content.tags && (
                  <div className="pt-2">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FaTags />
                      {isRTL ? "بيانات النشر والوسوم" : "Tags & Data"}
                    </h3>
                    <div className="text-[15px] font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                      {content.tags}
                    </div>
                  </div>
                )}

                {/* Social Sharing */}
                {socialPlatforms?.length > 0 && (
                  <div className="pt-6 border-t border-slate-50">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                      {isRTL ? "متاح على منصات" : "Available On"}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {socialPlatforms.map((platform) => {
                        let icon, name, color;
                        switch (platform.toLowerCase()) {
                          case "facebook":
                            icon = <FaFacebook />;
                            name = isRTL ? "فيسبوك" : "Facebook";
                            color =
                              "text-[#1877F2] bg-[#1877F2]/5 hover:bg-[#1877F2] hover:text-white";
                            break;
                          case "twitter":
                          case "x":
                            icon = <FaTwitter />;
                            name = isRTL ? "منصة X" : "X Platform";
                            color =
                              "text-black bg-black/5 hover:bg-black hover:text-white";
                            break;
                          case "instagram":
                            icon = <FaInstagram />;
                            name = isRTL ? "إنستجرام" : "Instagram";
                            color =
                              "text-[#E4405F] bg-[#E4405F]/5 hover:bg-[#E4405F] hover:text-white";
                            break;
                          case "linkedin":
                            icon = <FaLinkedin />;
                            name = isRTL ? "لينكد إن" : "LinkedIn";
                            color =
                              "text-[#0A66C2] bg-[#0A66C2]/5 hover:bg-[#0A66C2] hover:text-white";
                            break;
                          default:
                            return null;
                        }
                        return (
                          <div
                            key={platform}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent transition-all duration-300 font-bold text-sm cursor-default ${color}`}
                          >
                            <span className="text-lg">{icon}</span>
                            <span>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Enhanced Attachments */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50">
                <h3 className="text-xl font-black text-baseTwo mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-primary" />
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
                        className="group flex items-center p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                          <FaFilePdf className="text-primary text-xl group-hover:text-white transition-colors" />
                        </div>
                        <div className="mx-4 flex-1">
                          <h4 className="font-black text-baseTwo text-sm line-clamp-1">
                            {file.label}
                          </h4>
                          <span className="text-xs text-slate-400 font-black uppercase tracking-widest group-hover:text-primary">
                            PDF DOCUMENT
                          </span>
                        </div>

                        <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary group-hover:scale-110 transition-all">
                          <FaDownload size={14} />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-400 font-medium">
                      {translations.noItems}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysesDetails;
