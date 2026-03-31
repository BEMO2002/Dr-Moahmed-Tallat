"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "../../i18n/routing";
import { useSearchParams } from "next/navigation";
import { useSettings } from "../Context/SettingContext";
import {
  fetchBlogs,
  fetchBlogCategories,
  fetchCategoryBlogs,
} from "../lib/server-api";
import { FiSearch, FiCalendar, FiArrowRight, FiHash } from "react-icons/fi";

const toSlug = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

const Blogs = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
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
  const currentLang = locale;

  const placeholderImage =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop";

  const selectedCategorySlug = (searchParams.get("category") || "").trim();

  const selectedCategory = useMemo(() => {
    if (!selectedCategorySlug) return null;
    return (
      categories.find(
        (c) =>
          c?.slug_en === selectedCategorySlug ||
          c?.slug_ar === selectedCategorySlug,
      ) || null
    );
  }, [categories, selectedCategorySlug]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await fetchBlogCategories();
        const sorted = (Array.isArray(list) ? list : [])
          .slice()
          .sort((a, b) => {
            const aOrder = Number(a?.order ?? a?.priority ?? Infinity);
            const bOrder = Number(b?.order ?? b?.priority ?? Infinity);
            return aOrder - bOrder;
          });

        const withSlugs = sorted.map((c) => ({
          ...c,
          slug_en: c?.slug_en || toSlug(c?.name_en),
          slug_ar: c?.slug_ar || toSlug(c?.name_ar),
        }));

        setCategories(withSlugs);
      } catch (err) {
        console.error("Error fetching blog categories:", err);
      }
    };
    fetchCats();
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
      setBlogs([]);
      setError(null);
      try {
        const params = { search: searchQuery, page };
        const data = selectedCategory?.id
          ? await fetchCategoryBlogs(selectedCategory.id, params)
          : await fetchBlogs(params);

        const blogsPagination = data?.blogs || null;
        const list = Array.isArray(blogsPagination?.data)
          ? blogsPagination.data
          : Array.isArray(data?.blogs)
            ? data.blogs
            : [];
        setBlogs(list);

        if (blogsPagination && typeof blogsPagination === "object") {
          setPagination({
            current_page: Number(blogsPagination.current_page || page || 1),
            last_page: Number(blogsPagination.last_page || 1),
            from: Number(blogsPagination.from || 0),
            to: Number(blogsPagination.to || 0),
            total: Number(blogsPagination.total || list.length || 0),
            per_page: Number(blogsPagination.per_page || 10),
          });
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("blogs.loadError");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [searchQuery, page, selectedCategory?.id]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (page > 1) nextParams.set("p", page.toString());
    else nextParams.delete("p");
    if (searchQuery) nextParams.set("q", searchQuery);
    else nextParams.delete("q");
    if (selectedCategorySlug) nextParams.set("category", selectedCategorySlug);
    else nextParams.delete("category");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [page, searchQuery, selectedCategorySlug, pathname, router]);

  return (
    <section className="relative pt-32 pb-24  overflow-hidden min-h-screen">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Page Header */}
        <div className="max-w-4xl mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm mb-6">
            <FiHash />
            <span>{isRTL ? "مدونتنا" : "Our Blogs"}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
            {isRTL ? "اكتشف أحدث" : "Explore Our Latest"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              {t("blogs.title2")}
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
            {isRTL
              ? "مقالات ملهمة ورؤى استراتيجية تساعدك على فهم عالم التسويق والنمو الرقمي ببراعة."
              : "Inspiring articles and strategic insights to help you navigate the world of marketing and digital growth."}
          </p>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 px-4">
          <div className={`w-full lg:max-w-md relative group`}>
            <div
              className={`absolute inset-y-0 ${isRTL ? "right-4" : "left-4"} flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors`}
            >
              <FiSearch size={22} />
            </div>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("blogs.searchPlaceholder")}
              className={`w-full h-14 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none ${isRTL ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} text-lg transition-all focus:border-primary focus:ring-4 focus:ring-primary/5`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          <div className="text-slate-500 font-medium bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
            {t("blogs.showing")}{" "}
            <span className="text-slate-900 font-bold">
              {pagination.from}-{pagination.to}
            </span>{" "}
            {t("blogs.of")}{" "}
            <span className="text-slate-900 font-bold">{pagination.total}</span>{" "}
            {t("blogs.results")}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-16 px-4">
          <button
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString());
              next.delete("category");
              router.replace(`${pathname}?${next.toString()}`, {
                scroll: false,
              });
              setPage(1);
            }}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${!selectedCategorySlug ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105" : "bg-white text-slate-600 border border-slate-100 hover:border-primary/40 hover:bg-slate-50"}`}
          >
            {t("blogs.all")}
          </button>

          {categories.map((category) => {
            const isActive = selectedCategory?.id === category?.id;
            const title =
              currentLang === "ar" ? category?.name_ar : category?.name_en;
            const slug =
              currentLang === "ar" ? category?.slug_ar : category?.slug_en;

            return (
              <button
                key={category?.id}
                onClick={() => {
                  const next = new URLSearchParams(searchParams.toString());
                  next.set("category", slug);
                  router.replace(`${pathname}?${next.toString()}`, {
                    scroll: false,
                  });
                  setPage(1);
                }}
                className={`px-8 py-3 rounded-2xl font-bold transition-all ${isActive ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105" : "bg-white text-slate-600 border border-slate-100 hover:border-primary/40 hover:bg-slate-50"}`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* Blogs Grid */}
        {error ? (
          <div className="text-center py-24 bg-white rounded-[40px] border border-red-50 shadow-sm">
            <p className="text-red-500 font-bold text-xl">{t(error)}</p>
          </div>
        ) : loading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[40px] p-5 shadow-sm border border-slate-100 animate-pulse"
              >
                <div className="aspect-[1.5/1] bg-slate-100 rounded-[32px] mb-8"></div>
                <div className="h-6 bg-slate-100 w-3/4 rounded-full mb-4 px-4"></div>
                <div className="h-4 bg-slate-100 w-full rounded-full mb-2 px-4"></div>
                <div className="h-14 bg-slate-100 rounded-2xl w-full mt-6"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[48px] border border-slate-100 shadow-sm mx-4">
            <h3 className="text-2xl font-bold text-slate-400">
              {t("blogs.noBlogs")}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
            {blogs.map((blog) => {
              const title =
                currentLang === "ar" ? blog.title_ar : blog.title_en;
              const excerpt =
                currentLang === "ar"
                  ? blog.short_description_ar
                  : blog.short_description_en;
              const category =
                currentLang === "ar"
                  ? blog.category?.name_ar
                  : blog.category?.name_en;
              const banner =
                currentLang === "ar" ? blog.banner_ar : blog.banner_en;
              const slug = currentLang === "ar" ? blog.slug_ar : blog.slug_en;
              const date = blog.created_at
                ? new Date(blog.created_at).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "";

              return (
                <Link
                  href={`/blogs/${slug}`}
                  key={blog.id}
                  className="group flex flex-col h-full bg-white rounded-[48px] p-5 shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-3"
                >
                  <div className="relative aspect-[1.5/1] rounded-[38px] overflow-hidden mb-8 shadow-inner flex-shrink-0">
                    <img
                      src={banner || placeholderImage}
                      alt={title}
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                      className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div
                      className={`absolute top-5 ${isRTL ? "right-0" : "left-0"}`}
                    >
                      <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-primary font-black text-xs uppercase tracking-widest shadow-sm border border-white/40">
                        {category}
                      </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="px-3 pb-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-slate-400 font-bold text-xs mb-4 uppercase tracking-tighter">
                      <FiCalendar className="text-primary" />
                      {date}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-[1.35] group-hover:text-primary transition-colors duration-300 min-h-[3.375rem]">
                      {title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed line-clamp-3 mb-8 text-[16px] flex-grow">
                      {excerpt}
                    </p>

                    <div className="pt-2 mt-auto">
                      <div className="h-14 bg-slate-50 rounded-[22px] flex items-center justify-between px-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-primary shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30">
                        <span className="font-black text-sm uppercase tracking-widest">
                          {t("blogs.viewDetails")}
                        </span>
                        <FiArrowRight
                          size={22}
                          className={`transition-transform duration-500 group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Section */}
        {pagination.last_page > 1 && (
          <div className="mt-24 flex justify-center items-center gap-3 flex-wrap">
            <button
              disabled={pagination.current_page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-14 h-14 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <FiArrowRight className={isRTL ? "" : "rotate-180"} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .filter((p) => {
                  if (pagination.last_page <= 7) return true;
                  if (p === 1 || p === pagination.last_page) return true;
                  return Math.abs(p - pagination.current_page) <= 2;
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const needsDots = idx > 0 && prev && p - prev > 1;
                  const isActive = pagination.current_page === p;
                  return (
                    <React.Fragment key={`page-${p}`}>
                      {needsDots && (
                        <span className="px-3 text-slate-300 font-black">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setPage(p);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black transition-all ${isActive ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110" : "bg-white text-slate-600 border border-slate-100 hover:border-primary/40"}`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => {
                setPage((p) => Math.min(pagination.last_page, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-14 h-14 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
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
              circle at 0% 0%,
              rgba(26, 182, 157, 0.03) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 100% 100%,
              rgba(59, 130, 246, 0.03) 0%,
              transparent 50%
            );
        }
      `}</style>
    </section>
  );
};

export default Blogs;
