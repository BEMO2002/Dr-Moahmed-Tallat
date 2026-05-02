import LinkTree from "../../Components/LinkTree";
import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const description =
    settings?.site_description?.en || t("contactForm.description");

  const baseUrl = "https://mohamedtalaat.com";

  return {
    title: t("linkTree.title", "Links"),
    description: description,
    alternates: {
      canonical: `${baseUrl}/${locale}/links`,
    },
    openGraph: {
      title: t("linkTree.title", "Links"),
      description: description,
      url: `${baseUrl}/${locale}/links`,
      type: "website",
      ...(settings?.logo && { images: [settings.logo] }),
    },
    twitter: {
      card: "summary_large_image",
      title: t("linkTree.title", "Links"),
      description: description,
      ...(settings?.logo && { images: [settings.logo] }),
    },
  };
}

export default function LinksPage() {
  return <LinkTree />;
}
