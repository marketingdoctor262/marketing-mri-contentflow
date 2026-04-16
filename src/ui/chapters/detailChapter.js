import { renderDefaultChapter } from "./defaultChapter.js";
import { renderChecklist } from "../components/infographic/checklist.js";

export function renderDetailChapter(state, chapterData) {
  return renderDefaultChapter(chapterData, state.isPaid, renderChecklist(chapterData.groups));
}
