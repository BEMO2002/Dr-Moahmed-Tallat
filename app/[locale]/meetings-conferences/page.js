import React from "react";
import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import MeetingsAndConferencesHeader from "../../MeetingsAndConferencesPage/MeetingsAndConferencesHeader";
import MeetingsAndConferences from "../../MeetingsAndConferencesPage/MeetingsAndConferences";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("meetings.title");
  const description = t("meetings.seo_description");

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

const MeetingsAndConferencesPage = () => {
  return (
    <div className="meetings-page-container mt-20">
      <MeetingsAndConferencesHeader />
      <MeetingsAndConferences />
    </div>
  );
};

export default MeetingsAndConferencesPage;
