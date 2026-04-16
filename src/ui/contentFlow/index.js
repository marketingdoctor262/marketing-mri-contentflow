import { CONTENT_FLOW_MENU } from "../../data/contentFlow.js";
import { renderCfHome } from "./home.js";
import { renderCfGenerate } from "./generate.js";
import { renderCfShortform } from "./shortform.js";
import { renderCfCalendar } from "./calendar.js";
import { renderCfBlog } from "./blog.js";
import { renderCfArchive } from "./archive.js";

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
          <p class="mri-page-sub">콘텐츠 생성·숏폼·캘린더·블로그까지 한 화면에서 관리합니다.</p>
        </div>
      </header>
      <div class="row wrap">${tabs}</div>
      <section class="card">${renderCurrent(state.cf)}</section>
    </section>
  `;
}

function renderCurrent(id) {
  if (id === "home") return renderCfHome();
  if (id === "generate") return renderCfGenerate();
  if (id === "shortform") return renderCfShortform();
  if (id === "calendar") return renderCfCalendar();
  if (id === "blog") return renderCfBlog();
  return renderCfArchive();
}
