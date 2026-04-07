import React from "react";
import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import QuotationsHeader from "../../QuotationsPage/QuotationsHeader";
import Quotations from "../../MeetingsAndConferencesPage/Quotations";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("quotations.title");
  const description = t("quotations.seo_description") || t("quotations.title");

  return {
    title: `${title} - ${siteName}`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      ...(settings?.logo && { images: [settings.logo] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(settings?.logo && { images: [settings.logo] }),
    },
  };
}

const QuotationsPage = () => {
  return (
    <div className="quotations-page-container mt-20">
      <QuotationsHeader />
      <Quotations />
    </div>
  );
};

export default QuotationsPage;
