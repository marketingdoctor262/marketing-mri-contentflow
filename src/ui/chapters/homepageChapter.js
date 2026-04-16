import { renderDefaultChapter } from "./defaultChapter.js";
import { renderGaugePanel, renderSpeedGauge } from "../components/infographic/gaugeChart.js";

export function renderHomepageChapter(state, chapterData) {
  const infographic = renderSpeedGauge(chapterData.spd) + renderGaugePanel(chapterData.groups);
  return renderDefaultChapter(chapterData, state.isPaid, infographic);
}
