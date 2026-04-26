import { fetchArticlesList } from "../lib/server-api";
import AnalysesFeature from "./AnalysesFeature";

export default async function AnalysesFeatureServer() {
  // Fetch featured articles, limit to 3
  const res = await fetchArticlesList(null, { is_featured: 1, per_page: 3 });
  const articles = res?.data || [];

  return <AnalysesFeature articles={articles} />;
}
