import { fetchPostDetails } from "@/app/lib/server-api";
import { notFound } from "next/navigation";
import ArticlesandColumnsDetails from "@/app/ArticlesandColumnsPage/ArticlesandColumnsDetails";
import ArticlesandColumnsHeader from "@/app/ArticlesandColumnsPage/ArticlesandColumnsHeader";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await fetchPostDetails(decodedSlug);

  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title[locale] || post.title["en"],
    description: post.meta_description[locale] || post.meta_description["en"],
  };
}

export default async function PostDetailsPage({ params }) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await fetchPostDetails(decodedSlug);

  if (!post) {
    notFound();
  }

  const isRTL = locale === "ar";

  return (
    <div className="bg-white min-h-screen mt-20">
      {/* Dynamic Header for Context */}
      <ArticlesandColumnsHeader
        title={post.title[locale] || post.title["en"]}
        breadcrumbHome={locale === "ar" ? "الرئيسية" : "Home"}
        breadcrumbCurrent={
          post.category?.name[locale] || post.category?.name["en"]
        }
        locale={locale}
        isRTL={isRTL}
      />
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ArticlesandColumnsDetails post={post} locale={locale} isRTL={isRTL} />
      </div>
    </div>
  );
}
