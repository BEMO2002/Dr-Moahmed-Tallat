"use client";
import React from "react";
import Image from "next/image";
import { Link } from "../../i18n/routing";
import { FaRegCalendarAlt, FaLayerGroup } from "react-icons/fa";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";

const ArticlesandColumns = ({ posts, locale, isRTL, translations }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <FaLayerGroup className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-black text-baseTwo mb-2">
          {isRTL ? "لا يوجد مقالات" : "No Articles Found"}
        </h3>
        <p className="text-gray-500 font-bold">
          {isRTL ? "لم يتم العثور على مقالات في هذا القسم حالياً." : "No articles found in this category at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {posts.map((post) => {
        const title = post.title?.[locale] || post.title?.["en"];
        const categoryName = post.category?.name?.[locale] || post.category?.name?.["en"];
        const slug = post.slug?.[locale] || post.slug?.["en"];
        const strategicBrief = post.strategic_brief?.[locale] || post.strategic_brief?.["en"];

        return (
          <div
            key={post.id}
            className="group bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
          >
            {/* Image Wrapper */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src={post.image_url}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Category Tag */}
              <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto">
                <span className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                  {categoryName}
                </span>
              </div>
            </div>

            {/* Content Wrapper */}
            <div className="p-8 flex-1 flex flex-col relative -mt-10 bg-white rounded-t-4xl z-10">
              <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-widest mb-4">
                <FaRegCalendarAlt />
                <span>{post.created_at}</span>
              </div>

              <h3 className="text-xl font-black text-baseTwo mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>

              <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed mb-8 flex-1">
                {strategicBrief}
              </p>

              <Link
                href={`/articles-columns/post/${slug}`}
                className="inline-flex items-center gap-3 text-sm font-black text-baseTwo group/btn hover:text-primary transition-colors"
              >
                <span>{isRTL ? "اقرأ المزيد" : "READ MORE"}</span>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-2 rtl:group-hover/btn:-translate-x-2">
                  {isRTL ? <HiOutlineArrowLeft /> : <HiOutlineArrowRight />}
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArticlesandColumns;
