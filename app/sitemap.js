import {
  fetchArticleTypes,
  fetchArticlesList,
  fetchPostCategories,
  fetchPosts,
  fetchPages,
} from "./lib/server-api";

const baseUrl = "https://mohamedtalat.com";

export default async function sitemap() {
  const locales = ["ar", "en"];
  const lastModified = new Date();

  // 1. Static Routes
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/analyses",
    "/articles-columns",
    "/galleries",
    "/podcasts",
    "/quotations",
    "/meetings-conferences",
    "/research-archive",
  ];

  const staticEntries = [];
  locales.forEach((locale) => {
    staticPaths.forEach((path) => {
      staticEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    });
  });

  // 2. Information Pages (Dynamic from API)
  let infoPages = [];
  try {
    infoPages = await fetchPages();
  } catch (err) {
    console.error("Sitemap: Failed to fetch pages", err);
  }

  const infoPageEntries = [];
  infoPages.forEach((page) => {
    locales.forEach((locale) => {
      // Use slug directly if it's a string, or localized if object
      const slugValue =
        typeof page.slug === "string"
          ? page.slug
          : page.slug[locale] || page.slug["en"] || page.slug["ar"];
      if (slugValue) {
        infoPageEntries.push({
          url: `${baseUrl}/${locale}/${slugValue}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    });
  });

  // 3. Strategic Analyses (Types and Articles)
  const analysisEntries = [];
  try {
    const analysisTypes = await fetchArticleTypes();

    for (const type of analysisTypes) {
      for (const locale of locales) {
        const typeSlug =
          type.slug[locale] || type.slug["en"] || type.slug["ar"];
        if (typeSlug) {
          analysisEntries.push({
            url: `${baseUrl}/${locale}/analyses/${typeSlug}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.7,
          });

          // Fetch articles for this type
          const articles = await fetchArticlesList(typeSlug);
          if (Array.isArray(articles)) {
            articles.forEach((article) => {
              const articleSlug =
                article.slug[locale] ||
                article.slug["en"] ||
                article.slug["ar"];
              if (articleSlug) {
                analysisEntries.push({
                  url: `${baseUrl}/${locale}/analyses/article/${articleSlug}`,
                  lastModified,
                  changeFrequency: "monthly",
                  priority: 0.6,
                });
              }
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Sitemap: Failed to fetch analyses", err);
  }

  // 4. Articles & Columns (Categories and Posts)
  const blogEntries = [];
  try {
    const categories = await fetchPostCategories();

    for (const cat of categories) {
      for (const locale of locales) {
        const catSlug = cat.slug[locale] || cat.slug["en"] || cat.slug["ar"];
        if (catSlug) {
          blogEntries.push({
            url: `${baseUrl}/${locale}/articles-columns/${catSlug}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.7,
          });

          // Fetch posts for this category
          const postsData = await fetchPosts({ category_slug: catSlug });
          const posts = postsData?.data || [];
          if (Array.isArray(posts)) {
            posts.forEach((post) => {
              const postSlug =
                post.slug[locale] || post.slug["en"] || post.slug["ar"];
              if (postSlug) {
                blogEntries.push({
                  url: `${baseUrl}/${locale}/articles-columns/post/${postSlug}`,
                  lastModified,
                  changeFrequency: "monthly",
                  priority: 0.6,
                });
              }
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Sitemap: Failed to fetch blog posts", err);
  }

  return [
    ...staticEntries,
    ...infoPageEntries,
    ...analysisEntries,
    ...blogEntries,
  ];
}
