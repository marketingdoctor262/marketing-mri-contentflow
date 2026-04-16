import { renderKeywordsChapter } from "./keywordsChapter.js";
import { renderDefaultChapter } from "./defaultChapter.js";
import { renderBrandChapter } from "./brandChapter.js";
import { renderCompetitionChapter } from "./competitionChapter.js";
import { renderTrustBuyChapter } from "./trustBuyChapter.js";
import { renderHomepageChapter } from "./homepageChapter.js";
import { renderTrustChapter } from "./trustChapter.js";
import { renderDetailChapter } from "./detailChapter.js";
import { renderContentChapter } from "./contentChapter.js";
import { renderSemChapter } from "./semChapter.js";
import { renderSnsChapter } from "./snsChapter.js";
import { renderAdsChapter } from "./adsChapter.js";
import { renderViralChapter } from "./viralChapter.js";
import { renderInfoChapter } from "./infoChapter.js";
import { renderRetentionChapter } from "./retentionChapter.js";
import { renderDataAnalyticsChapter } from "./dataAnalyticsChapter.js";

export function renderChapterBody(state, chapterData) {
  const rendererByChapter = {
    brand: renderBrandChapter,
    competition: renderCompetitionChapter,
    keywords: renderKeywordsChapter,
    trust_buy: renderTrustBuyChapter,
    homepage: renderHomepageChapter,
    trust: renderTrustChapter,
    detail: renderDetailChapter,
    content: renderContentChapter,
    sem: renderSemChapter,
    sns: renderSnsChapter,
    ads: renderAdsChapter,
    viral: renderViralChapter,
    info: renderInfoChapter,
    retention: renderRetentionChapter,
    data_analytics: renderDataAnalyticsChapter,
  };
  const renderer = rendererByChapter[state.ch];
  return renderer
    ? renderer(state, chapterData)
    : renderDefaultChapter(chapterData, state.isPaid);
}
