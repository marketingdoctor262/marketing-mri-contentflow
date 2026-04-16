import { renderDefaultChapter } from "./defaultChapter.js";
import { renderRadarChart } from "../components/infographic/radarChart.js";

export function renderTrustChapter(state, chapterData) {
  const radar = renderRadarChart(chapterData.groups, "#f97316");
  return renderDefaultChapter(chapterData, state.isPaid, radar);
}
