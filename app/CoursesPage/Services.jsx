"use client";
import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "../../i18n/routing";
import { useSearchParams } from "next/navigation";
import {
  fetchItems,
  fetchItemTypes,
  fetchItemTypeItems,
} from "../lib/server-api";
import {
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiBookOpen,
  FiStar,
} from "react-icons/fi";

const Services = () => {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [itemTypes, setItemTypes] = useState([]);
  const initialTypeId = parseInt(searchParams.get("type")) || null;
  const [selectedTypeId, setSelectedTypeId] = useState(initialTypeId);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const initialPage = parseInt(searchParams.get("p")) || 1;
  const [page, setPage] = useState(initialPage);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 10,
  });

  const isRTL = locale === "ar";
  const currentLang = locale || "en";

  // Professional Placeholder Image
  const placeholderImage =
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop";

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData = await fetchItemTypes();
        const sorted = (Array.isArray(typesData) ? typesData : [])
          .slice()
          .sort((a, b) => {
            const aOrder = Number(a?.order ?? a?.priority ?? Infinity);
            const bOrder = Number(b?.order ?? b?.priority ?? Infinity);
            return aOrder - bOrder;
          });
        setItemTypes(sorted);
      } catch (err) {
        console.error("Error fetching item types:", err);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = (searchInput || "").trim();
      if (next !== searchQuery) {
        setSearchQuery(next);
        setPage(1);
      }
    }, 450);
    return () => clearTimeout(handle);
  }, [searchInput, searchQuery]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { search: searchQuery, page };
        const data = selectedTypeId
          ? await fetchItemTypeItems(selectedTypeId, params)
          : await fetchItems(params);

        const itemsPagination = data?.items || null;
        const list = Array.isArray(itemsPagination?.data)
          ? itemsPagination.data
          : [];
        setItems(list);

        if (itemsPagination && typeof itemsPagination === "object") {
          setPagination({
            current_page: Number(itemsPagination.current_page || page || 1),
            last_page: Number(itemsPagination.last_page || 1),
            from: Number(itemsPagination.from || 0),
            to: Number(itemsPagination.to || 0),
            total: Number(itemsPagination.total || list.length || 0),
            per_page: Number(itemsPagination.per_page || 10),
          });
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(t("courses.loadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [searchQuery, page, selectedTypeId]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page > 1) nextParams.set("p", page.toString());
    else nextParams.delete("p");
    if (selectedTypeId) nextParams.set("type", selectedTypeId.toString());
    else nextParams.delete("type");
    if (searchQuery) nextParams.set("q", searchQuery);
    else nextParams.delete("q");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [page, selectedTypeId, searchQuery, pathname, router]);

  return (
    <section className="relative py-20  overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-end justify-between mb-16 px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm mb-4">
              <FiStar className="animate-pulse" />
              <span>{isRTL ? "خدماتنا المتميزة" : "Our Premium Services"}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.2]">
              {isRTL ? "استعرض برامجنا" : "Browse Our"}{" "}
              <span className="text-primary">
                {isRTL ? "التسويقية" : "Services"}
              </span>
            </h2>
          </div>

          {/* Search Bar - Premium Integrated */}
          <div className="w-full lg:max-w-md relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <FiSearch size={22} />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={isRTL ? "ابحث عن خدمة..." : "Search services..."}
              className={`w-full h-16 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none px-12 text-lg transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 ${isRTL ? "text-right" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Filter Tabs - Pill Style */}
        <div className="flex flex-wrap items-center gap-3 mb-12 px-4">
          <button
            onClick={() => {
              setSelectedTypeId(null);
              setPage(1);
            }}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedTypeId === null ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-slate-600 border border-slate-200 hover:border-primary/40 hover:bg-slate-50"}`}
          >
            <FiFilter />
            {t("headServices.all")}
          </button>
          {itemTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedTypeId(type.id);
                setPage(1);
              }}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${selectedTypeId === type.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-slate-600 border border-slate-200 hover:border-primary/40 hover:bg-slate-50"}`}
            >
              {currentLang === "ar" ? type.title_ar : type.title_en}
            </button>
          ))}
        </div>

        {/* Grid Section */}
        {error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
            <p className="text-red-500 font-bold text-xl">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-100 animate-pulse"
              >
                <div className="aspect-[16/10] bg-slate-100 rounded-2xl mb-6"></div>
                <div className="h-6 bg-slate-100 w-3/4 rounded-full mb-4"></div>
                <div className="h-4 bg-slate-100 w-full rounded-full mb-2"></div>
                <div className="h-4 bg-slate-100 w-2/3 rounded-full mb-8"></div>
                <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[40px] border border-slate-100 shadow-sm mx-4">
            <FiBookOpen size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-600">
              {t("courses.noCourses")}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
            {items.map((item) => {
              const title =
                currentLang === "ar" ? item.title_ar : item.title_en;
              const desc =
                currentLang === "ar"
                  ? item.short_description_ar
                  : item.short_description_en;
              const type =
                currentLang === "ar"
                  ? item.item_type?.title_ar
                  : item.item_type?.title_en;
              const img =
                currentLang === "ar" ? item.banner_ar : item.banner_en;
              const price = Number(item.price);
              const priceText =
                price > 0
                  ? `${price} ${t("courses.currency")}`
                  : t("courses.free");

              return (
                <Link
                  href={`/courses/${currentLang === "ar" ? item.slug_ar : item.slug_en}`}
                  key={item.id}
                  className="group block bg-white rounded-[40px] p-4 shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2"
                >
                  <div className="relative aspect-[1.3/1] rounded-[32px] overflow-hidden mb-8">
                    <img
                      src={img || placeholderImage}
                      alt={title}
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest shadow-sm border border-white/40">
                        {type}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {priceText}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                      {title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed line-clamp-2 mb-8 text-[15px]">
                      {desc}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 group-hover:border-primary/10 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                          {isRTL ? "بدءاً من" : "STARTING FROM"}
                        </span>
                        <span className="text-xl font-black text-slate-900">
                          {priceText}
                        </span>
                      </div>
                      <div className="w-14 h-14 bg-[#F8FAFF] text-primary flex items-center justify-center rounded-2xl group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-[360deg] shadow-sm">
                        <FiArrowRight
                          size={24}
                          className={isRTL ? "rotate-180" : ""}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Improved Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <FiArrowRight className={isRTL ? "" : "rotate-180"} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.last_page }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all ${pagination.current_page === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-slate-600 border border-slate-200 hover:border-primary/40"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => {
                setPage((p) => Math.min(pagination.last_page, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <FiArrowRight className={isRTL ? "rotate-180" : ""} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        section {
          background-image:
            radial-gradient(
              circle at 10% 20%,
              rgba(26, 182, 157, 0.05) 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(15, 23, 42, 0.03) 0%,
              transparent 40%
            );
        }
      `}</style>
    </section>
  );
};

export default Services;
