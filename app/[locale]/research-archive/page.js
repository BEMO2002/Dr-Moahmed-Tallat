import React from "react";
import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import ResearchArchiveHeader from "../../ResearchArchivePage/ResearchArchiveHeader";
import ResearchArchive from "../../ResearchArchivePage/ResearchArchive";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("navbar.researchArchive");
  const description = t("navbar.vault.passwordSubtitle");

  return {
    title: `${title}`,
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

const ResearchArchivePage = () => {
  return (
    <div className="research-archive-page pt-20">
      <ResearchArchiveHeader />
      <ResearchArchive />
    </div>
  );
};

export default ResearchArchivePage;
