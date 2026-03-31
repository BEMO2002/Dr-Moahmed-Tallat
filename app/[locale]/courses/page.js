import { getTranslations } from "next-intl/server";
import { fetchSettings } from "../../lib/server-api";
import HeadServices from "../../CoursesPage/HeadServices";
import Services from "../../CoursesPage/Services";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();
  let siteName = "Dr. Mohamed Talaat";
  let description = t("headServices.description");

  try {
    if (settings && settings.site_name) {
      siteName =
        locale === "ar" ? settings.site_name.ar : settings.site_name.en;
    }
  } catch (err) {
    console.error("Error fetching settings for metadata", err);
  }

  return {
    title: t("navbar.services"),
    description: description,
    openGraph: {
      title: t("navbar.services"),
      description: description,
      type: "website",
      ...(settings?.logo && { images: [settings.logo] }),
    },
    twitter: {
      card: "summary_large_image",
      title: t("navbar.services"),
      description: description,
      ...(settings?.logo && { images: [settings.logo] }),
    },
  };
}

export default function CoursesPage() {
  return (
    <div className="courses-page-container mt-20">
      <HeadServices />
      <Services />
    </div>
  );
}
