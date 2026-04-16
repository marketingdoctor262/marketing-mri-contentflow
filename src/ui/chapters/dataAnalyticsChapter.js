import { renderDefaultChapter } from "./defaultChapter.js";
import { renderGaugePanel } from "../components/infographic/gaugeChart.js";

export function renderDataAnalyticsChapter(state, chapterData) {
  return renderDefaultChapter(chapterData, state.isPaid, renderGaugePanel(chapterData.groups));
}
