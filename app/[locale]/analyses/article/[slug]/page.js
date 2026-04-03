import React from "react";
import { fetchSettings, fetchArticleDetails } from "../../../../lib/server-api";
import { getTranslations } from "next-intl/server";
import AnalysesHeader from "../../../../AnalysesPage/AnalysesHeader";
import AnalysesDetails from "../../../../AnalysesPage/AnalysesDetails";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();
  
  const article = await fetchArticleDetails(slug);

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = article ? (article.meta_title?.[locale] || article.meta_title?.["en"] || article.title?.[locale]) : t("analyses.title");
  const description = article ? (article.meta_description?.[locale] || article.meta_description?.["en"]) : t("navbar.seo_description");
  const image = article ? (article.meta_image_url || article.image_url) : settings?.logo;

  return {
    title: `${title} | ${siteName}`,
    description: description,
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

const ArticleDetailsPage = async ({ params }) => {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const isRTL = locale === "ar";
  
  const article = await fetchArticleDetails(slug);

  const translations = {
    attachments: t("analyses.attachments"),
    noItems: t("analyses.noItems"),
    files: {
      white_papers: t("analyses.files.white_papers"),
      published_researches: t("analyses.files.published_researches"),
      executive_briefs: t("analyses.files.executive_briefs"),
      chronological_archive: t("analyses.files.chronological_archive"),
    }
  };

  const title = article ? (article.title?.[locale] || article.title?.["en"]) : t("analyses.title");
  const breadcrumbCurrent = title;

  return (
    <div className="analyses-details-page-container mt-20">
      <AnalysesHeader 
        title={title}
        breadcrumbHome={t("navbar.home")}
        breadcrumbCurrent={breadcrumbCurrent}
        isRTL={isRTL}
      />
      <AnalysesDetails 
        article={article} 
        translations={translations} 
        locale={locale} 
        isRTL={isRTL} 
      />
    </div>
  );
};

export default ArticleDetailsPage;
