import "../globals.css";
import Navbar from "../Components/Navbar";
import Providers from "../Components/Providers";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import Footer from "../Components/Footer";
import { fetchSettings } from "../lib/server-api";
import ScrollToTop from "../Components/ScrollToTop";
import { Top } from "../Components/Top";
import Chatbot from "../Components/Chatbot";
import Countdown from "../Components/Countdown";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  let siteName = "Dr. Mohamed Talaat";
  let favicon = "/favicon.ico";

  try {
    const settings = await fetchSettings();
    if (settings) {
      siteName = settings.site_name?.[locale] || siteName;
      favicon = settings.favicon || favicon;
    }
  } catch (err) {}

  const baseUrl = "https://mohamedtalaat.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `${siteName} | %s`,
      default: siteName,
    },
    icons: {
      icon: favicon,
      apple: favicon,
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: siteName,
      statusBarStyle: "default",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ar: `${baseUrl}/ar`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      url: `${baseUrl}/${locale}`,
      siteName: siteName,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      type: "website",
      images: ["/Home/talaat-logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/Home/talaat-logo.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RootLayout(props) {
  const { children, params } = props;
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Provide all messages to the client side
  const messages = await getMessages();

  // Fetch global settings once on the server side to eliminate redundant client requests
  let globalSettings = null;
  try {
    globalSettings = await fetchSettings();
  } catch (err) {
    console.error("Failed to fetch global settings in root layout", err);
  }
  const targetDate = "2026-05-05T17:00:00+03:00";
  const serverTime = new Date();
  const isBeforeLaunch = serverTime < new Date(targetDate);
  const baseUrl = "https://mohamedtalaat.com";
  const siteName = globalSettings?.site_name?.[locale] || "Dr. Mohamed Talaat";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={isBeforeLaunch ? "is-counting" : ""}>
      <head>
        <link rel="icon" href={globalSettings?.favicon || "/favicon.ico"} />
        <meta name="referrer" content="no-referrer" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: `${baseUrl}/${locale}`,
              logo: `${baseUrl}/Home/talaat-logo.png`,
            }),
          }}
        />
      </head>
      <body className={`antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers initialSettings={globalSettings}>
            <Countdown targetDate={targetDate} />
            <div id="site-main-content" className="transition-opacity duration-1000">
              <ScrollToTop />
              <Top />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <Chatbot />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
