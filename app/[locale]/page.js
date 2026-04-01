import { getTranslations } from "next-intl/server";
import SliderServer from "../HomePage/SliderServer";
import { fetchSettings } from "../lib/server-api";
import AboutTwo from "../HomePage/AboutTwo";
import InfinitySlider from "../HomePage/InfinitySlider";
// import Services from "../CoursesPage/Services";
import SpecialServices from "../HomePage/SpecialServices";
import InfinitySliderTwo from "../HomePage/InfintySliderTwo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const t = await getTranslations({ locale, namespace: "navbar" });

  let title = "Dr. Mohamed Talaat";
  let description = t.has("seo_description") ? t("seo_description") : "";
  let keywords = t.has("seo_keywords") ? t("seo_keywords") : "";
  let ogImage = "";

  try {
    const settings = await fetchSettings();
    if (settings) {
      title = settings.site_name?.[locale] || title;

      // If we don't have a translation locally, fallback to settings
      if (!description) {
        description = settings.site_description?.[locale] || "";
      }
      if (settings.logo) {
        ogImage = settings.logo;
      }
    }
  } catch (error) {
    console.error("Failed to fetch global settings for Home Page SEO:", error);
  }

  return {
    title: `${title} | ${t("home", { fallback: "Home" })}`,
    description: description || "Dr. Mohamed Talaat Home Page",
    keywords: keywords || "",
    openGraph: {
      title: `${title} | ${t("home", { fallback: "Home" })}`,
      description: description || "Dr. Mohamed Talaat Home Page",
      ...(ogImage && { images: [ogImage] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${t("home", { fallback: "Home" })}`,
      description: description || "Dr. Mohamed Talaat Home Page",
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default function MainHome() {
  return (
    <>
      <SliderServer />
      <AboutTwo />
      <InfinitySliderTwo />
      <SpecialServices />
      <InfinitySlider />
      {/* <Services /> */}
    </>
  );
}
