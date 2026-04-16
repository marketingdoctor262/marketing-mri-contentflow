import { renderDefaultChapter } from "./defaultChapter.js";
import { renderRadarChart } from "../components/infographic/radarChart.js";

export function renderTrustBuyChapter(state, chapterData) {
  const radar = renderRadarChart(chapterData.groups, "#10b981");
  return renderDefaultChapter(chapterData, state.isPaid, radar);
}
