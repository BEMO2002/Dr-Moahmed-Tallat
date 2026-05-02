import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import HeadContact from "../../ContactPage/HeadContact";
import ContactForm from "../../ContactPage/ContactForm";
import Map from "../../ContactPage/Map";
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const title = t("headContact.title");
  const description = t("contactForm.description");

  const baseUrl = "https://mohamedtalaat.com";

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/${locale}/contact`,
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

export default function ContactPage() {
  return (
    <div className="contact-page-container">
      <HeadContact />
      <ContactForm />
      <Map />
    </div>
  );
}
