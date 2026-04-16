import { CHAPTERS } from "../../data/chapters.js";
import { CONTENT_FLOW_MENU } from "../../data/contentFlow.js";
import { scoreColor } from "../../utils/score.js";

export function renderAppShell(state, chapterMap, bodyHtml) {
  const chapterButtons = CHAPTERS.map((ch) => {
    const item = chapterMap[ch.id];
    const active = state.main === "mri" && state.ch === ch.id ? "active" : "";
    return `<button class="menu-btn ${active}" data-action="open-chapter" data-id="${ch.id}">
      <span>${ch.ic}</span><span>${ch.lb}</span>
      <small style="color:${scoreColor(item.s)}">${item.s}</small>
    </button>`;
  }).join("");

  const flowButtons = CONTENT_FLOW_MENU.map((menu) => {
    const active = state.main === "cf" && state.cf === menu.id ? "active" : "";
    return `<button class="menu-btn ${active}" data-action="open-cf" data-id="${menu.id}">
      <span>${menu.ic}</span><span>${menu.lb}</span>
    </button>`;
  }).join("");

  const paidLabel = state.isPaid ? "PRO" : "FREE";
  const paidClass = state.isPaid ? "badge-pro" : "badge-free";
  const paidBtnText = state.isPaid ? "PRO 모드 ON" : "PRO 멤버십 체험";

  return `
    <div class="app">
      <aside class="sidebar">
        <div class="brand">
          <div class="row between" style="align-items:center">
            <h1>마케팅MRI</h1>
            <span class="membership-badge ${paidClass}">${paidLabel}</span>
          </div>
          <p>${state.inputBrand || "브랜드 미입력"}</p>
        </div>
        <button class="menu-btn" data-action="go-input">🏠 새 진단 시작</button>
        <button class="menu-btn ${state.main === "mri" && !state.ch ? "active" : ""}" data-action="go-mri">📊 정밀진단 대시보드</button>
        <button class="menu-btn ${state.main === "report" ? "active" : ""}" data-action="go-report">📋 종합 보고서</button>
        <div class="menu-group">${chapterButtons}</div>
        <button class="menu-btn ${state.main === "cf" ? "active" : ""}" data-action="go-cf">🔄 ContentFlow</button>
        <div class="menu-group">${flowButtons}</div>
        <div class="sidebar-footer">
          <button class="menu-btn ${state.main === "pricing" ? "active" : ""}" data-action="go-pricing">💎 요금제 안내</button>
          <button class="paid-toggle-btn ${state.isPaid ? "is-pro" : ""}" data-action="toggle-paid">
            ${state.isPaid ? "🔓" : "🔒"} ${paidBtnText}
          </button>
          <button class="theme-toggle-btn" data-action="toggle-theme">
            ${state.theme === "light" ? "🌙 다크 모드" : "☀️ 라이트 모드"}
          </button>
        </div>
      </aside>
      <main class="content">${bodyHtml}</main>
    </div>
  `;
}
