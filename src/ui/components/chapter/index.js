import { renderGroupDetail } from "./groupDetail.js";
import { renderAnalysisPanel } from "./analysisPanel.js";
import { renderKeywordBlock } from "./keywordBlock.js";
import { renderChannelBlock } from "./channelBlock.js";
import { renderSwotPanel } from "./swotPanel.js";
import { renderActionPanel } from "./actionPanel.js";
import { renderProDetailButton } from "./proDetailButton.js";
import { renderGroupBars } from "../infographic/groupBars.js";

export function renderChapterBlocks(chapterData, isPaid = false, extraInfographic = "") {
  const totalItems = (chapterData.groups || []).reduce((sum, g) => sum + g.items.length, 0);

  return `
    ${renderGroupBars(chapterData.groups)}
    ${extraInfographic}
    ${renderAnalysisPanel(chapterData.groups)}
    ${renderKeywordBlock(chapterData.ext || [])}
    ${renderChannelBlock(chapterData.ch || [])}
    ${renderSwotPanel(chapterData)}
    ${renderActionPanel(chapterData.act || [])}
    ${renderProDetailButton(isPaid, totalItems)}
    ${renderGroupDetail(chapterData.groups, isPaid)}
  `;
}
