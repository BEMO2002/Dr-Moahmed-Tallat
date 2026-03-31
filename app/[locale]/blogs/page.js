import { fetchSettings } from "../../lib/server-api";
import Blogs from "../../BlogsPage/Blogs";
import { getTranslations } from "next-intl/server";
import HeadBlogs from "../../BlogsPage/HeadBlogs";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("blogs.title2");
  const description = t("blogs.description");

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

export default function BlogsPage() {
  return (
    <div className="courses-page-container mt-20">
      <HeadBlogs />
      <Blogs />
    </div>
  );
}
