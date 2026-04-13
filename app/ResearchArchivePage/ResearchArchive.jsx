"use client";

import React, { useEffect, useState } from "react";
import { useVault } from "../Context/VaultContext";
import { useRouter } from "../../i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FaFilePdf, FaDownload, FaLock } from "react-icons/fa";

const FileSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0"></div>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-12 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-16 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-6 w-full bg-slate-200 rounded-xl mb-2"></div>
          <div className="h-6 w-2/3 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
      <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
        <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

const PaginationSkeleton = () => {
  return (
    <div className="mt-16 flex justify-center items-center gap-2 md:gap-4 flex-wrap animate-pulse">
      <div className="w-24 h-12 md:h-14 bg-slate-200 rounded-2xl"></div>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="w-12 h-12 md:w-14 md:h-14 bg-slate-200 rounded-2xl"
        ></div>
      ))}
      <div className="w-24 h-12 md:h-14 bg-slate-200 rounded-2xl"></div>
    </div>
  );
};

const ResearchArchive = () => {
  const { isUnlocked, vaultData, isInitializing } = useVault();
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Redirect if not unlocked (after initialization)
  useEffect(() => {
    if (!isInitializing && !isUnlocked) {
      router.push("/");
    }
  }, [isInitializing, isUnlocked, router]);

  const handlePageChange = (page) => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    currentParams.set("page", page.toString());

    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${currentParams.toString()}`, {
      scroll: false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isInitializing) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <FileSkeleton key={i} />
            ))}
          </div>
          <PaginationSkeleton />
        </div>
      </div>
    );
  }

  if (!isUnlocked || !vaultData) return null;

  const files = Array.isArray(vaultData.data)
    ? vaultData.data
    : vaultData.data?.data || [];

  const pagination = vaultData.data?.current_page
    ? vaultData.data
    : vaultData || {};

  return (
    <div className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {files.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative overflow-hidden"
                >
                  {/* Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />

                  <div className="flex items-start gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <FaFilePdf className="text-primary text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full uppercase tracking-widest leading-none">
                          {file.type || "PDF"}
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          {file.size}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-baseTwo leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {file.title?.[locale] ||
                          file.title?.["en"] ||
                          file.title?.["ar"]}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary/40" />
                      {file.created_at}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewUrl(file.download_url)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary text-xs font-black rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <span>{t("navbar.vault.view")}</span>
                      </button>
                      <a
                        href={file.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-baseTwo text-white text-xs font-black rounded-xl hover:bg-primary transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
                      >
                        <FaDownload className="text-[10px]" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pagination && pagination.last_page > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2 md:gap-4 flex-wrap">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                    pagination.current_page === 1
                      ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-70"
                      : "bg-white text-slate-600 hover:border-primary/40 hover:bg-primary hover:text-white"
                  }`}
                >
                  {t("prev") || (isRTL ? "السابق" : "Prev")}
                </button>

                {Array.from(
                  { length: pagination.last_page },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl font-black transition-all ${
                      pagination.current_page === p
                        ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110"
                        : "bg-white text-slate-600 border border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                    pagination.current_page === pagination.last_page
                      ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-70"
                      : "bg-white text-slate-600 hover:border-primary/40 hover:bg-primary hover:text-white"
                  }`}
                >
                  {t("next") || (isRTL ? "التالي" : "Next")}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLock className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-2xl font-black text-baseTwo mb-2">
              {t("navbar.vault.noFiles")}
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {t("navbar.vault.noFilesSubtitle")}
            </p>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewUrl(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full h-full max-w-6xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="font-black text-baseTwo uppercase tracking-widest text-sm">
                {t("navbar.vault.preview")}
              </h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold"
              >
                ✕
              </button>
            </div>

            <iframe
              src={previewUrl}
              className="w-full flex-1 border-none"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchArchive;
