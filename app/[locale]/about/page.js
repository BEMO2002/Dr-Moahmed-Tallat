import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import HeadAbout from "../../AboutPage/HeadAbout";
import AboutTwo from "../../HomePage/AboutTwo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const title = t("about.title") || t("navbar.about");
  const description = t("about.description");

  return {
    title: title,
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

export default function AboutPage() {
  return (
    <div className="about-page-container mt-20">
      <HeadAbout />
      <div className="pt-20">
        <AboutTwo />
      </div>
    </div>
  );
}
