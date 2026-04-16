import { renderChapterBlocks } from "../components/chapter/index.js";

export function renderDefaultChapter(chapterData, isPaid = false, extraInfographic = "") {
  return renderChapterBlocks(chapterData, isPaid, extraInfographic);
}
