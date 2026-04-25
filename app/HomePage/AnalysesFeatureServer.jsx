import { fetchArticlesList } from "../lib/server-api";
import AnalysesFeature from "./AnalysesFeature";

export default async function AnalysesFeatureServer() {
  // Fetch featured articles, limit to 3
  const articles = await fetchArticlesList(null, { is_featured: 1, per_page: 3 });

  return <AnalysesFeature articles={articles} />;
}
