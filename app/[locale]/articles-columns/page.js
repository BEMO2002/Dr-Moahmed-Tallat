import { fetchPosts, fetchSettings } from "@/app/lib/server-api";
import { getTranslations } from "next-intl/server";
import ArticlesandColumnsHeader from "@/app/ArticlesandColumnsPage/ArticlesandColumnsHeader";
import ArticlesandColumns from "@/app/ArticlesandColumnsPage/ArticlesandColumns";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const settings = await fetchSettings();
  const t = await getTranslations({ locale, namespace: "navbar" });

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("posts");

  return {
    title: `${title} | ${siteName}`,
    description: t("articles_seo_description"),
    openGraph: {
      title: title,
      type: "website",
      ...(settings?.logo && { images: [settings.logo] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      ...(settings?.logo && { images: [settings.logo] }),
    },
  };
}

export default async function ArticlesColumnsPage({ params }) {
  const { locale } = await params;
  const postsData = await fetchPosts();
  const t = await getTranslations({ locale });
  const isRTL = locale === "ar";

  return (
    <div className="bg-white min-h-screen mt-20">
      <ArticlesandColumnsHeader
        title={t("navbar.posts")}
        breadcrumbHome={locale === "ar" ? "الرئيسية" : "Home"}
        breadcrumbCurrent={t("navbar.posts")}
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
