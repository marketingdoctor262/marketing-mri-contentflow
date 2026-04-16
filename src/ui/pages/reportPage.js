import { CHAPTERS } from "../../data/chapters.js";
import { scoreColor, scoreLabel } from "../../utils/score.js";
import { renderScoreDonut } from "../components/infographic/scoreDonut.js";
import { renderRadarChart } from "../components/infographic/radarChart.js";

const CHAPTER_TYPE = {
  brand: "radar",
  trust_buy: "radar",
  trust: "radar",
  sns: "channel",
  ads: "channel",
  viral: "channel",
  content: "channel",
  info: "channel",
  homepage: "gauge",
  keywords: "gauge",
  data_analytics: "gauge",
  detail: "checklist",
  sem: "checklist",
  retention: "checklist",
  competition: "checklist",
};

const CHAPTER_COLORS = {
  brand: "#a855f7",
  trust_buy: "#10b981",
  trust: "#f97316",
};

function renderMiniInfographic(chId, data) {
  const type = CHAPTER_TYPE[chId];

  if (type === "radar") {
    return `<div class="report-infographic">${renderRadarChart(data.groups, CHAPTER_COLORS[chId] || "var(--brand)")}</div>`;
  }

  if (type === "channel") {
    const sorted = [...data.groups].sort((a, b) => b.score - a.score);
    const bars = sorted
      .map(
        (g) => `
      <div class="report-ch-bar">
        <span class="report-ch-bar-name">${g.cat.replace(/^[^\s]+\s/, "")}</span>
        <div class="report-ch-bar-track">
          <div class="report-ch-bar-fill" style="width:${g.score}%;background:${scoreColor(g.score)}"></div>
        </div>
        <span class="score" style="color:${scoreColor(g.score)};font-size:12px">${g.score}</span>
      </div>`
      )
      .join("");
    return `<div class="report-infographic report-channel-mini">${bars}</div>`;
  }

  if (type === "gauge") {
    if (chId === "homepage" && data.spd) {
      return `<div class="report-infographic report-gauge-mini">
        ${renderMiniGauge(data.spd.mobile.s, "모바일")}
        ${renderMiniGauge(data.spd.desktop.s, "PC")}
        ${data.groups.slice(0, 2).map((g) => renderMiniGauge(g.score, g.cat.replace(/^[^\s]+\s/, ""))).join("")}
      </div>`;
    }
    return `<div class="report-infographic report-gauge-mini">
      ${data.groups.map((g) => renderMiniGauge(g.score, g.cat.replace(/^[^\s]+\s/, ""))).join("")}
    </div>`;
  }

  if (type === "checklist") {
    const allItems = data.groups.flatMap((g) => g.items);
    const done = allItems.filter((i) => i.s >= 70).length;
    const partial = allItems.filter((i) => i.s >= 40 && i.s < 70).length;
    const missing = allItems.filter((i) => i.s < 40).length;
    const pct = allItems.length ? Math.round((done / allItems.length) * 100) : 0;

    return `<div class="report-infographic report-checklist-mini">
      <div class="report-ck-progress">
        <div class="report-ck-bar"><div class="report-ck-fill" style="width:${pct}%;background:${scoreColor(pct)}"></div></div>
        <span style="color:${scoreColor(pct)};font-weight:800">${pct}%</span>
      </div>
      <div class="report-ck-stats">
        <span class="report-ck-stat" style="color:var(--ok)">✅ ${done}</span>
        <span class="report-ck-stat" style="color:var(--warn)">⚠️ ${partial}</span>
        <span class="report-ck-stat" style="color:var(--bad)">❌ ${missing}</span>
      </div>
      <div class="report-ck-items">
        ${allItems
          .filter((i) => i.s < 40)
          .slice(0, 3)
          .map((i) => `<span class="report-ck-item">❌ ${i.n} <strong style="color:${scoreColor(i.s)}">${i.s}</strong></span>`)
          .join("")}
      </div>
    </div>`;
  }

  return "";
}

function renderMiniGauge(score, label) {
  const size = 90;
  const r = (size - 12) / 2;
  const c = Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  const cx = size / 2;
  const cy = size / 2;

  return `
    <div class="report-mini-gauge">
      <svg viewBox="0 0 ${size} ${size * 0.55}" width="${size}" height="${size * 0.55}">
        <path d="M 6 ${cy} A ${r} ${r} 0 0 1 ${size - 6} ${cy}"
          fill="none" stroke="var(--bar-bg)" stroke-width="8" stroke-linecap="round" />
        <path d="M 6 ${cy} A ${r} ${r} 0 0 1 ${size - 6} ${cy}"
          fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}" />
      </svg>
      <span class="report-mini-gauge-score" style="color:${color}">${score}</span>
      <span class="report-mini-gauge-label">${label}</span>
    </div>
  `;
}

export function renderReportPage(state, chapterMap) {
  const scores = CHAPTERS.map((c) => chapterMap[c.id].s);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const gradeInfo = getGrade(avg);

  const chapterSections = CHAPTERS.map((ch) => {
    const data = chapterMap[ch.id];
    const type = CHAPTER_TYPE[ch.id];
    const typeLabel = { radar: "균형 분석", channel: "채널 비교", gauge: "측정 지표", checklist: "실행 체크" }[type] || "";

    const strengths = (data.str || []).map((s) => `<span class="report-tag success">✓ ${s}</span>`).join("");
    const weaknesses = (data.wk || []).map((w) => `<span class="report-tag danger">✕ ${w}</span>`).join("");
    const actions = (data.act || [])
      .map(
        (a, i) =>
          `<p class="report-action"><span class="tag">${["즉시", "1개월", "3개월"][i] || "계획"}</span> ${a}</p>`
      )
      .join("");

    return `
      <section class="card report-chapter" id="report-ch-${ch.id}">
        <header class="report-chapter-hd" data-action="open-chapter" data-id="${ch.id}">
          <div class="report-chapter-title">
            <span class="report-chapter-ic" aria-hidden="true">${ch.ic}</span>
            <div class="report-chapter-title-text">
              <h3>${ch.lb}</h3>
              <span class="report-type-badge">${typeLabel}</span>
            </div>
          </div>
          ${renderScoreDonut(data.s, 72)}
        </header>

        <p class="report-summary">${data.sum}</p>

        <div class="report-infographic-panel">
          ${renderMiniInfographic(ch.id, data)}
        </div>

        <div class="report-swot">
          <div class="report-swot-col report-swot-strengths">
            <h4 class="report-swot-hd">강점</h4>
            <div class="report-swot-tags">${strengths || `<span class="report-empty-hint">요약 없음</span>`}</div>
          </div>
          <div class="report-swot-col report-swot-weak">
            <h4 class="report-swot-hd">개선 포인트</h4>
            <div class="report-swot-tags">${weaknesses || `<span class="report-empty-hint">요약 없음</span>`}</div>
          </div>
        </div>

        ${
          actions
            ? `<div class="report-actions-block"><h4 class="report-actions-hd">실행 권고</h4><div class="report-actions">${actions}</div></div>`
            : ""
        }
      </section>
    `;
  }).join("");

  const tocChips = CHAPTERS.map(
    (ch) =>
      `<a class="report-toc-chip" href="#report-ch-${ch.id}" title="${ch.lb}">${ch.ic}</a>`
  ).join("");

  return `
    <section class="report-wrap mri-shell">
      <header class="card chapter-hero report-hero">
        <div class="chapter-hero-inner report-hero-inner">
          <div class="chapter-hero-text report-hero-text">
            <p class="report-hero-kicker">종합 결과 레포트</p>
            <h2>마케팅MRI 종합 보고서</h2>
            <p class="mri-page-sub report-hero-sub">
              ${state.inputBrand || "브랜드"} · 15개 챕터 정밀 진단 · 전체 평균 <strong style="color:${scoreColor(avg)}">${avg}</strong>점 (${scoreLabel(avg)})
            </p>
            <div class="report-hero-badges">
              <span class="report-grade-pill" style="background:${gradeInfo.bg};color:${gradeInfo.fg}">${gradeInfo.label}</span>
              <span class="report-hero-meta">클릭하여 챕터 상세로 이동할 수 있습니다.</span>
            </div>
          </div>
          <div class="report-hero-score">${renderScoreDonut(avg, 112)}</div>
        </div>
      </header>

      <section class="card report-overview-card">
        <div class="report-section-head">
          <h3>전체 진단 개요</h3>
          <p class="mri-page-sub">각 칸을 누르면 해당 챕터 상세 분석으로 이동합니다.</p>
        </div>
        <div class="report-overview-grid">
          ${CHAPTERS.map(
            (ch) => `
            <button type="button" class="report-mini-card" data-action="open-chapter" data-id="${ch.id}">
              <span class="report-mini-ic">${ch.ic}</span>
              <span class="report-mini-score" style="color:${scoreColor(chapterMap[ch.id].s)}">${chapterMap[ch.id].s}</span>
              <span class="report-mini-lb">${ch.lb}</span>
            </button>`
          ).join("")}
        </div>
      </section>

      <nav class="report-toc" aria-label="챕터 바로가기">
        <span class="report-toc-label">바로가기</span>
        <div class="report-toc-scroll">${tocChips}</div>
      </nav>

      <div class="report-chapter-stack">
        ${chapterSections}
      </div>

      ${
        !state.isPaid
          ? `<section class="report-paywall-banner">
              <h3>상세 진단 항목 및 개별 점수</h3>
              <p>PRO 멤버십으로 업그레이드하면 각 챕터의 세부 진단 항목, 개별 점수, 구체적인 개선 팁을 모두 확인할 수 있습니다.</p>
              <button class="primary" data-action="go-pricing">PRO 멤버십 시작하기 →</button>
            </section>`
          : ""
      }
    </section>
  `;
}

function getGrade(score) {
  if (score >= 80) return { label: "A 등급", bg: "rgba(22,163,74,.12)", fg: "#16a34a" };
  if (score >= 60) return { label: "B 등급", bg: "rgba(217,119,6,.12)", fg: "#d97706" };
  if (score >= 40) return { label: "C 등급", bg: "rgba(234,88,12,.12)", fg: "#ea580c" };
  return { label: "D 등급", bg: "rgba(220,38,38,.12)", fg: "#dc2626" };
}
