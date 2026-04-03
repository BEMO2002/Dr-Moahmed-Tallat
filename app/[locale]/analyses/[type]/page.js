import React from "react";
import { fetchSettings, fetchArticleTypes, fetchArticlesList } from "../../../lib/server-api";
import { getTranslations } from "next-intl/server";
import AnalysesHeader from "../../../AnalysesPage/AnalysesHeader";
import Analyses from "../../../AnalysesPage/Analyses";

export async function generateMetadata({ params }) {
  const { locale, type } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();
  const decodedType = decodeURIComponent(type);

  // Need to find the type name from the types array since we only have the slug
  const types = await fetchArticleTypes();
  const currentType = types.find(t => (t.slug?.[locale] === decodedType) || (t.slug?.["en"] === decodedType));

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const fallbackName = decodedType ? decodedType.replace(/-/g, " ") : t("analyses.title");
  const typeName = currentType ? (currentType.name?.[locale] || currentType.name?.["en"]) : fallbackName;
  const title = `${typeName} - ${t("analyses.title")}`;

  return {
    title: `${title} | ${siteName}`,
    description: t("navbar.seo_description"),
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

const AnalysesListPage = async ({ params }) => {
  const { locale, type } = await params;
  const t = await getTranslations({ locale });
  const isRTL = locale === "ar";
  
  const decodedType = decodeURIComponent(type);

  const types = await fetchArticleTypes();
  const currentType = types.find(t => (t.slug?.[locale] === decodedType) || (t.slug?.["en"] === decodedType));
  
  const fallbackName = decodedType ? decodedType.replace(/-/g, " ") : t("analyses.title");
  const typeName = currentType ? (currentType.name?.[locale] || currentType.name?.["en"]) : fallbackName;

  // Actually, fetchArticlesList expects the typeSlug
  const articles = await fetchArticlesList(decodedType);

  const translations = {
    noItems: t("analyses.noItems"),
    readMore: t("analyses.readMore")
  };

  return (
    <div className="analyses-page-container mt-20">
      <AnalysesHeader 
        title={typeName}
        breadcrumbHome={t("navbar.home")}
        breadcrumbCurrent={typeName}
        isRTL={isRTL}
      />
      <Analyses 
        articles={articles} 
        translations={translations} 
        locale={locale} 
        isRTL={isRTL} 
      />
    </div>
  );
};

export default AnalysesListPage;
