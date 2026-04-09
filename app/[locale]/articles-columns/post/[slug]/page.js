import { fetchPostDetails, fetchSettings } from "@/app/lib/server-api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ArticlesandColumnsDetails from "@/app/ArticlesandColumnsPage/ArticlesandColumnsDetails";
import ArticlesandColumnsHeader from "@/app/ArticlesandColumnsPage/ArticlesandColumnsHeader";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();
  
  const post = await fetchPostDetails(decodedSlug);

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = post 
    ? (post.meta_title?.[locale] || post.meta_title?.["en"] || post.title?.[locale] || post.title?.["en"]) 
    : "Article Not Found";
  
  // Custom description logic: Meta Description or Content Snippet
  let description = post ? (post.meta_description?.[locale] || post.meta_description?.["en"]) : null;
  if (!description && post?.content?.[locale]) {
    description = stripHtml(post.content[locale]).substring(0, 160);
  }
  if (!description && post?.content?.["en"]) {
    description = stripHtml(post.content["en"]).substring(0, 160);
  }
  description = description || t("navbar.seo_description");

  const image = post ? (post.meta_image_url || post.image_url) : settings?.logo;

  const arSlug = post?.slug?.["ar"] || post?.slug?.["en"] || slug;
  const enSlug = post?.slug?.["en"] || post?.slug?.["ar"] || slug;

  return {
    title: `${title} | ${siteName}`,
    description: description,
    alternates: {
      languages: {
        "ar": `/ar/articles-columns/post/${arSlug}`,
        "en": `/en/articles-columns/post/${enSlug}`,
      }
    },
    openGraph: {
      title: title,
      description: description,
      type: "article",
      ...(image && { images: [image] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function PostDetailsPage({ params }) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const t = await getTranslations({ locale });
  const post = await fetchPostDetails(decodedSlug);

  if (!post) {
    notFound();
  }

  const isRTL = locale === "ar";
  const title = post.title?.[locale] || post.title?.["en"] || "";

  return (
    <div className="bg-white min-h-screen mt-20">
      <ArticlesandColumnsHeader
        title={title}
        breadcrumbHome={t("navbar.home")}
        breadcrumbCurrent={
          post.category?.name?.[locale] || post.category?.name?.["en"] || title
        }
        locale={locale}
        isRTL={isRTL}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ArticlesandColumnsDetails post={post} locale={locale} isRTL={isRTL} />
      </div>
    </div>
  );
}
