import { CONTENT_FLOW_MENU } from "../../data/contentFlow.js";
import { renderCfHome } from "./home.js";
import { renderCfGenerate } from "./generate.js";
import { renderCfShortform } from "./shortform.js";
import { renderCfCalendar } from "./calendar.js";
import { renderCfBlog } from "./blog.js";
import { renderCfArchive } from "./archive.js";
import { renderCfKeywords } from "./keywords.js";
import { renderCfTemplates } from "./templates.js";

export function renderContentFlowPage(state) {
  const tabs = CONTENT_FLOW_MENU.map(
    (menu) =>
      `<button class="tab ${state.cf === menu.id ? "active" : ""}" data-action="open-cf" data-id="${menu.id}">${menu.ic} ${menu.lb}</button>`
  ).join("");

  return `
    <section class="mri-shell">
      <header class="mri-page-head">
        <div>
          <h2>ContentFlow</h2>
          <p class="mri-page-sub">키워드 분석 → 캘린더 → AI 초안 → 카피 템플릿까지 마케팅 실행 전 과정.</p>
        </div>
      </header>
      <div class="row wrap">${tabs}</div>
      <section class="card">${renderCurrent(state)}</section>
    </section>
  `;
}

function renderCurrent(state) {
  const id = state.cf;
  if (id === "home") return renderCfHome();
  if (id === "keywords") return renderCfKeywords(state);
  if (id === "calendar") return renderCfCalendar(state);
  if (id === "generate") return renderCfGenerate(state);
  if (id === "templates") return renderCfTemplates(state);
  if (id === "shortform") return renderCfShortform();
  if (id === "blog") return renderCfBlog();
  return renderCfArchive();
}
