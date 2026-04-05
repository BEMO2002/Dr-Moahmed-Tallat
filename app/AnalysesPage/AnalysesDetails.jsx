"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "../../i18n/routing";
import { useParams } from "next/navigation";
import { FaFilePdf, FaDownload, FaRegCalendarAlt } from "react-icons/fa";

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

  // Prepare attachments array for easy mapping
  const attachmentsList = [];
  if (article.attachments) {
    const keys = [
      "white_papers",
      "published_researches",
      "executive_briefs",
      "chronological_archive",
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
              <h3 className="text-xl font-black text-baseTwo mb-6 flex items-center gap-3">
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
                          PDF
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
