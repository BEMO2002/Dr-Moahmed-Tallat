export default function robots() {
  const baseUrl = "https://mohamedtalat.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/private/",
        "/cgi-bin/",
        "/*?*", // Disallow query strings to avoid duplicate content in some cases
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
