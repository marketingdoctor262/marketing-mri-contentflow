import { CHAPTERS } from "../../data/chapters.js";
import { scoreColor, scoreLabel } from "../../utils/score.js";
import { renderScoreDonut } from "../components/infographic/scoreDonut.js";
import { renderChapterBody } from "../chapters/index.js";

export function renderChapterPage(state, chapterMap) {
  const chapter = CHAPTERS.find((c) => c.id === state.ch);
  const data = chapterMap[state.ch];
  if (!chapter || !data) return `<section class="card">챕터를 선택해 주세요.</section>`;

  const index = CHAPTERS.findIndex((c) => c.id === chapter.id);
  const prev = CHAPTERS[index - 1];
  const next = CHAPTERS[index + 1];

  return `
    <section class="mri-shell">
      <div class="row between">
        <button class="link-btn" data-action="go-mri">전체로</button>
        <div class="row gap-sm">
          ${prev ? `<button class="tab" data-action="open-chapter" data-id="${prev.id}">이전</button>` : ""}
          ${next ? `<button class="tab" data-action="open-chapter" data-id="${next.id}">다음</button>` : ""}
        </div>
      </div>

      <section class="card chapter-hero">
        <div class="chapter-hero-inner">
          <div class="chapter-hero-text">
            <h2>${chapter.ic} ${chapter.lb}</h2>
            <p>${data.sum}</p>
            <small style="color:${scoreColor(data.s)}">${scoreLabel(data.s)}</small>
          </div>
          ${renderScoreDonut(data.s, 130)}
        </div>
      </section>

      ${renderChapterBody(state, data)}
    </section>
  `;
}
