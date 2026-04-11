"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { motion } from "framer-motion";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className=" flex items-center justify-center px-4 pt-40 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-primary/10 p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Background Decorative Element INSIDE the card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none opacity-10">
            <h1 className="text-[12rem] md:text-[20rem] font-black text-primary leading-none">
              404
            </h1>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary animate-pulse">
                <FiAlertTriangle size={40} />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              {t("subTitle")}
            </h2>

            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              {t("description")}
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <FiHome size={20} />
              <span>{t("goHome")}</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
