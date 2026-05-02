import {
  fetchSettings,
  fetchArticleTypes,
  fetchArticlesList,
} from "../../../lib/server-api";
import { getTranslations } from "next-intl/server";
import AnalysesHeader from "../../../AnalysesPage/AnalysesHeader";
import Analyses from "../../../AnalysesPage/Analyses";

export async function generateMetadata({ params }) {
  const { locale, type } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();
  const decodedType = decodeURIComponent(type);

  // Find the type to get its metadata
  const types = await fetchArticleTypes();
  const currentType = types.find(
    (t) =>
      t.slug?.[locale] === decodedType ||
      t.slug?.["en"] === decodedType ||
      t.slug?.["ar"] === decodedType,
  );

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const fallbackName = decodedType
    ? decodedType.replace(/-/g, " ")
    : t("analyses.title");
  const typeName = currentType
    ? currentType.name?.[locale] || currentType.name?.["en"]
    : fallbackName;
  const title = `${typeName} - ${t("analyses.title")}`;

  // Use category-specific metadata if available
  const description =
    currentType?.meta_description?.[locale] ||
    currentType?.meta_description?.["en"] ||
    currentType?.description?.[locale] ||
    t("navbar.seo_description");
  const image =
    currentType?.meta_image_url || currentType?.image_url || settings?.logo;

  const arSlug =
    currentType?.slug?.["ar"] || currentType?.slug?.["en"] || decodedType;
  const enSlug =
    currentType?.slug?.["en"] || currentType?.slug?.["ar"] || decodedType;

  const baseUrl = "https://mohamedtalaat.com";

  return {
    title: `${title} | ${siteName}`,
    description: description,
    alternates: {
      canonical: `${baseUrl}/${locale}/analyses/${decodedType}`,
      languages: {
        ar: `${baseUrl}/ar/analyses/${arSlug}`,
        en: `${baseUrl}/en/analyses/${enSlug}`,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/${locale}/analyses/${decodedType}`,
      type: "website",
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

const AnalysesListPage = async (props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale, type } = params;
  const { page } = searchParams;
  const t = await getTranslations({ locale });
  const isRTL = locale === "ar";

  const decodedType = decodeURIComponent(type);

  const types = await fetchArticleTypes();
  const currentType = types.find(
    (t) =>
      t.slug?.[locale] === decodedType ||
      t.slug?.["en"] === decodedType ||
      t.slug?.["ar"] === decodedType,
  );

  const fallbackName = decodedType
    ? decodedType.replace(/-/g, " ")
    : t("analyses.title");
  const typeName = currentType
    ? currentType.name?.[locale] || currentType.name?.["en"]
    : fallbackName;

  const articlesData = await fetchArticlesList(
    currentType?.slug?.[locale] || currentType?.slug?.["en"] || decodedType,
    { page: page || 1 },
  );

  const articles = articlesData?.data || [];
  const pagination = articlesData || null;

  const translations = {
    noItems: t("analyses.noItems"),
    readMore: t("analyses.readMore"),
    prev: t("pagination.prev"),
    next: t("pagination.next"),
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
        pagination={pagination}
        translations={translations}
        locale={locale}
        isRTL={isRTL}
        currentType={currentType}
      />
    </div>
  );
};

export default AnalysesListPage;
