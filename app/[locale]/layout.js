import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

  return {
    title: {
      template: `${siteName} | %s`,
      default: siteName,
    },
    icons: {
      icon: favicon,
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

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="icon" href={globalSettings?.favicon || "/favicon.ico"} />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Providers initialSettings={globalSettings}>
            <ScrollToTop />
            <Top />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Chatbot />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
