"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, Link } from "../../i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { fetchBlogDetails } from "../lib/server-api";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiTag,
  FiShare2,
  FiArrowRight,
} from "react-icons/fi";

const BlogsDetails = ({ initialData }) => {
  const { slug } = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const [blog, setBlog] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  const isRTL = locale === "ar";
  const currentLang = locale;

  const placeholderImage =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop";

  const fetchBlogBySlug = useCallback(async (slugToFetch) => {
    if (!slugToFetch) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogDetails(slugToFetch);
      if (data) {
        setBlog(data);
      } else {
        setError("blogs.notFound");
      }
    } catch (e) {
      console.error("Error fetching blog details:", e);
      setError("blogs.detailsLoadError");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const syncBlog = async () => {
      if (!slug) return;
      const decodedSlug = decodeURIComponent(slug);
      if (initialData) {
        const matchesAr = initialData.slug_ar === decodedSlug;
        const matchesEn = initialData.slug_en === decodedSlug;
        if (matchesAr || matchesEn) {
          if (isMounted) {
            setBlog(initialData);
            setLoading(false);
          }
          return;
        }
      }
      if (blog) {
        const matchesAr = blog.slug_ar === decodedSlug;
        const matchesEn = blog.slug_en === decodedSlug;
        if (matchesAr || matchesEn) {
          if (isMounted) setLoading(false);
          return;
        }
      }
      await fetchBlogBySlug(decodedSlug);
    };
    syncBlog();
    return () => {
      isMounted = false;
    };
  }, [slug, initialData, fetchBlogBySlug, blog]);

  useEffect(() => {
    if (loading || !blog || !slug) return;
    const correctSlug = locale === "ar" ? blog.slug_ar : blog.slug_en;
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    const decodedCurrent = decodeURIComponent(slug);
    if (decodedCorrect && decodedCorrect !== decodedCurrent) {
      router.replace(`/blogs/${correctSlug}`, { scroll: false });
    }
  }, [blog, slug, locale, loading, router]);

  const computed = useMemo(() => {
    if (!blog) return null;
    const title = currentLang === "ar" ? blog.title_ar : blog.title_en;
    const banner = currentLang === "ar" ? blog.banner_ar : blog.banner_en;
    const shortDesc =
      currentLang === "ar"
        ? blog.short_description_ar
        : blog.short_description_en;
    const desc =
      currentLang === "ar" ? blog.description_ar : blog.description_en;
    const categoryTitle =
      currentLang === "ar" ? blog.category?.name_ar : blog.category?.name_en;
    const date = blog.created_at
      ? new Date(blog.created_at).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

    return { title, banner, shortDesc, desc, categoryTitle, date };
  }, [blog, currentLang, locale]);

  if (loading && !blog) {
    return (
      <div className="min-h-screen bg-[#FCFDFF] animate-pulse">
        <div className="h-[50vh] bg-slate-100 mb-12"></div>
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-10 bg-slate-100 rounded-full w-3/4 mb-6"></div>
          <div className="h-6 bg-slate-100 rounded-full w-1/2 mb-12"></div>
          <div className="space-y-6">
            <div className="h-4 bg-slate-100 rounded-full w-full"></div>
            <div className="h-4 bg-slate-100 rounded-full w-full"></div>
            <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog || !computed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFDFF]">
        <div className="text-center px-6">
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            {t("blogs.notFound")}
          </h2>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all"
          >
            <FiArrowLeft className={isRTL ? "rotate-180" : ""} />
            {t("blogs.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFDFF] pb-24">
      {/* Article Header HERO Section */}
      <section className="relative w-full h-[65vh] overflow-hidden">
        <img
          src={computed.banner || placeholderImage}
          alt={computed.title}
          onError={(e) => {
            e.target.src = placeholderImage;
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90"></div>

        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto w-full">
            <Link
              href="/blogs"
              className={`inline-flex items-center gap-2 text-white/80 hover:text-white font-bold mb-8 group transition-all`}
            >
              <FiArrowLeft
                className={`transition-transform group-hover:-translate-x-1 ${isRTL ? "rotate-180 group-hover:translate-x-1" : ""}`}
              />
              {t("blogs.backToBlogs")}
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {computed.categoryTitle && (
                <span className="bg-primary px-5 py-2 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg">
                  {computed.categoryTitle}
                </span>
              )}
              <div className="flex items-center gap-2 text-white/70 font-bold text-sm">
                <FiCalendar className="text-primary" />
                {computed.date}
              </div>
            </div>

            <h1
              className={`text-4xl md:text-6xl font-black text-white leading-[1.2] mb-6 ${isRTL ? "text-right" : "text-left"}`}
            >
              {computed.title}
            </h1>

            {computed.shortDesc && (
              <p
                className={`text-xl text-white/80 max-w-4xl leading-relaxed ${isRTL ? "text-right font-light" : "text-left"}`}
              >
                {computed.shortDesc}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Sidebars Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Article Full Content (Centerized or Left depending on RTL) */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-sm border border-slate-50 relative overflow-hidden">
              {/* Visual Accent */}
              <div
                className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} w-2 h-full bg-primary`}
              ></div>

              <div
                className={`blog-prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-img:rounded-[32px] prose-a:text-primary prose-a:font-bold prose-strong:text-slate-900 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-2xl ${isRTL ? "text-right" : "text-left"}`}
                dangerouslySetInnerHTML={{ __html: computed.desc || "" }}
              />
            </div>
          </article>

          {/* Professional Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Category Widget */}
            <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FiTag className="text-primary" />
                {t("blogs.details")}
              </h3>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-primary/20 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] block mb-2">
                    {t("blogs.category")}
                  </span>
                  <p className="text-lg font-black text-slate-900">
                    {computed.categoryTitle || "General"}
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-primary/20 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] block mb-2">
                    {isRTL ? "تاريخ النشر" : "PUBLISHED ON"}
                  </span>
                  <p className="text-lg font-black text-slate-900">
                    {computed.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic CTA Widget */}
            <div className="bg-gradient-to-br from-primary to-blue-600 rounded-[40px] p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
              <h3 className="text-2xl font-black mb-4 relative z-10">
                {isRTL ? "هل لديك تساؤلات؟" : "Have Questions?"}
              </h3>
              <p className="text-white/80 mb-10 text-lg relative z-10 leading-relaxed">
                {isRTL
                  ? "فريقنا مستعد دائماً لمساعدتك في تحقيق أهدافك التسويقية والنمو الرقمي."
                  : "Our team is always ready to help you achieve your marketing goals and digital growth."}
              </p>
              <Link
                href="/contact"
                className="w-full h-14 bg-white text-primary flex items-center justify-center gap-3 rounded-2xl font-black transition-all hover:gap-5 shadow-lg group-hover:shadow-white/20"
              >
                {isRTL ? "تواصل معنا" : "Contact Us"}
                <FiArrowRight />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .blog-prose h2,
        .blog-prose h3,
        .blog-prose h4 {
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #0f172a;
          font-weight: 900;
        }
        .blog-prose p {
          margin-bottom: 1.5rem;
          color: #475569;
          line-height: 1.85;
        }
        .blog-prose ul {
          list-style-type: disc;
          padding-inline-start: 1.5rem;
          margin-bottom: 2rem;
        }
        .blog-prose li {
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default BlogsDetails;
