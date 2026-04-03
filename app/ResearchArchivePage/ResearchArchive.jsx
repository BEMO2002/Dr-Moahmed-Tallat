"use client";

import React, { useEffect } from "react";
import { useVault } from "../Context/VaultContext";
import { useRouter } from "../../i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { FaFilePdf, FaDownload, FaLock } from "react-icons/fa";

const ResearchArchive = () => {
  const { isUnlocked, vaultData, isInitializing } = useVault();
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  // Redirect if not unlocked (after initialization)
  useEffect(() => {
    if (!isInitializing && !isUnlocked) {
      router.push("/");
    }
  }, [isInitializing, isUnlocked, router]);

  if (isInitializing || !isUnlocked || !vaultData) return null;

  const files = vaultData.data || [];

  return (
    <div className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {files.length > 0 ? (
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
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 md:p-10">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewUrl(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full h-full max-w-6xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
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

            {/* Loader (optional, browser handles iframe loading) */}
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
