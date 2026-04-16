import { renderDefaultChapter } from "./defaultChapter.js";
import { renderChecklist } from "../components/infographic/checklist.js";

export function renderSemChapter(state, chapterData) {
  return renderDefaultChapter(chapterData, state.isPaid, renderChecklist(chapterData.groups));
}
