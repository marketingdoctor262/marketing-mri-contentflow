import { CHAPTERS, METRIC_INFO } from "./common.js";
import { brandChapter } from "./brand.js";
import { competitionChapter } from "./competition.js";
import { keywordsChapter } from "./keywords.js";
import { trustBuyChapter } from "./trustBuy.js";
import { homepageChapter } from "./homepage.js";
import { trustChapter } from "./trust.js";
import { detailChapter } from "./detail.js";
import { contentChapter } from "./content.js";
import { semChapter } from "./sem.js";
import { snsChapter } from "./sns.js";
import { adsChapter } from "./ads.js";
import { viralChapter } from "./viral.js";
import { infoChapter } from "./info.js";
import { retentionChapter } from "./retention.js";
import { dataAnalyticsChapter } from "./dataAnalytics.js";

export { CHAPTERS, METRIC_INFO };

export const MRI_DATA = {
  brand: brandChapter,
  competition: competitionChapter,
  keywords: keywordsChapter,
  trust_buy: trustBuyChapter,
  homepage: homepageChapter,
  trust: trustChapter,
  detail: detailChapter,
  content: contentChapter,
  sem: semChapter,
  sns: snsChapter,
  ads: adsChapter,
  viral: viralChapter,
  info: infoChapter,
  retention: retentionChapter,
  data_analytics: dataAnalyticsChapter,
};
