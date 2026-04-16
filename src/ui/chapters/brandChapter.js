import { renderDefaultChapter } from "./defaultChapter.js";
import { renderRadarChart } from "../components/infographic/radarChart.js";

export function renderBrandChapter(state, chapterData) {
  const radar = renderRadarChart(chapterData.groups, "#a855f7");
  return renderDefaultChapter(chapterData, state.isPaid, radar);
}
