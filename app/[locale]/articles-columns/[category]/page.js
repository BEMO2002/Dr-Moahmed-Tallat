import { fetchPosts, fetchPostCategories } from "@/app/lib/server-api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ArticlesandColumnsHeader from "@/app/ArticlesandColumnsPage/ArticlesandColumnsHeader";
import ArticlesandColumns from "@/app/ArticlesandColumnsPage/ArticlesandColumns";

export async function generateMetadata({ params }) {
  const { category, locale } = await params;
  const categories = await fetchPostCategories();
  const currentCategory = categories.find(
    (c) =>
      c.slug[locale] === decodeURIComponent(category) ||
      c.slug["en"] === decodeURIComponent(category),
  );

  return {
    title: currentCategory
      ? currentCategory.name[locale] || currentCategory.name["en"]
      : "Category",
  };
}

export default async function CategoryPage({ params }) {
  const { category, locale } = await params;
  const isRTL = locale === "ar";

  // Fetch all categories to find the correct one for the header
  const categories = await fetchPostCategories();
  const decodedCategory = decodeURIComponent(category);

  const currentCategory = categories.find(
    (c) =>
      c.slug[locale] === decodedCategory || c.slug["en"] === decodedCategory,
  );

  if (!currentCategory) {
    notFound();
  }

  // Fetch posts filtered by category_slug
  // Note: The API likely needs the English slug or the ID depending on implementation,
  // but looking at user's JSON, the slug is provided.
  // We'll pass the category parameter which is the slug from the URL.
  const postsData = await fetchPosts({ category_slug: decodedCategory });

  return (
    <div className="bg-white min-h-screen mt-20">
      <ArticlesandColumnsHeader
        title={currentCategory.name[locale] || currentCategory.name["en"]}
        breadcrumbHome={locale === "ar" ? "الرئيسية" : "Home"}
        breadcrumbCurrent={
          currentCategory.name[locale] || currentCategory.name["en"]
        }
        locale={locale}
        isRTL={isRTL}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ArticlesandColumns
          posts={postsData?.data || []}
          locale={locale}
          isRTL={isRTL}
          translations={{
            readMore: isRTL ? "اقرأ المزيد" : "Read More",
          }}
        />
      </div>
    </div>
  );
}
