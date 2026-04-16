import { renderDefaultChapter } from "./defaultChapter.js";
import { renderChannelBars } from "../components/infographic/channelBars.js";

export function renderInfoChapter(state, chapterData) {
  return renderDefaultChapter(chapterData, state.isPaid, renderChannelBars(chapterData.groups));
}
