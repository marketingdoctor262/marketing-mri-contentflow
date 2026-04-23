import { CHAPTERS } from "../../data/chapters.js";
import { scoreColor, scoreLabel } from "../../utils/score.js";
import {
  PHASE_RESOURCES,
  CHAPTER_GUIDES,
  extractSteps,
  buildWhyText,
} from "../../data/planGuides.js";

const PHASE_META = [
  {
    key: "now",
    label: "즉시 실행",
    subtitle: "0~2주 · 임팩트 크고 바로 가능",
    icon: "🔥",
    color: "#be123c",
    bg: "rgba(190,18,60,.08)",
    effort: "쉬움",
  },
  {
    key: "short",
    label: "단기 플랜",
    subtitle: "1개월 · 구조·콘텐츠 정비",
    icon: "⚡",
    color: "#ec4899",
    bg: "rgba(236,72,153,.08)",
    effort: "보통",
  },
  {
    key: "mid",
    label: "중장기 투자",
    subtitle: "3개월 · 시스템·자산 구축",
    icon: "🚀",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,.08)",
    effort: "어려움",
  },
];

function collectActions(chapterMap) {
  const sorted = [...CHAPTERS].sort((a, b) => chapterMap[a.id].s - chapterMap[b.id].s);
  const buckets = { now: [], short: [], mid: [] };
  const keys = ["now", "short", "mid"];

  sorted.forEach((ch) => {
    const data = chapterMap[ch.id];
    (data.act || []).forEach((act, i) => {
      if (i > 2) return;
      const cleaned = act.replace(/\s*\((즉시|1개월|3개월|단기|중장기)\)\s*$/g, "").trim();
      buckets[keys[i]].push({
        text: cleaned,
        raw: act,
        chId: ch.id,
        chLb: ch.lb,
        chIc: ch.ic,
        chScore: data.s,
        chData: data,
        ch,
        phase: keys[i],
      });
    });
  });
  return buckets;
}

function renderPaidDetail(action) {
  const guide = CHAPTER_GUIDES[action.chId] || { kpis: [], tools: [] };
  const resource = PHASE_RESOURCES[action.phase];
  const steps = extractSteps(action.text);
  const why = buildWhyText(action.ch, action.chData, action.text);

  return `
    <div class="plan-detail">
      <div class="plan-detail-block">
        <h4 class="plan-detail-hd">🎯 왜 필요한가</h4>
        <p class="plan-detail-text">${why}</p>
      </div>

      <div class="plan-detail-block">
        <h4 class="plan-detail-hd">📋 실행 단계</h4>
        <ol class="plan-detail-steps">
          ${steps.map((s) => `<li>${s}</li>`).join("")}
        </ol>
      </div>

      <div class="plan-detail-grid">
        <div class="plan-detail-block">
          <h4 class="plan-detail-hd">⏱ 예상 투입</h4>
          <dl class="plan-detail-meta">
            <dt>소요 시간</dt><dd>${resource.time}</dd>
            <dt>비용</dt><dd>${resource.cost}</dd>
            <dt>인력</dt><dd>${resource.people}</dd>
            <dt>난이도</dt><dd>${resource.difficulty}</dd>
          </dl>
        </div>

        <div class="plan-detail-block">
          <h4 class="plan-detail-hd">📏 성공 지표 (KPI)</h4>
          <ul class="plan-detail-list">
            ${guide.kpis.map((k) => `<li>${k}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="plan-detail-block">
        <h4 class="plan-detail-hd">🛠 도구·리소스</h4>
        <div class="plan-detail-tools">
          ${guide.tools.map((t) => `<span class="plan-tool-chip">${t}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderLockedDetail() {
  return `
    <div class="plan-detail plan-detail-locked">
      <div class="plan-locked-overlay">
        <div class="plan-locked-content">
          <span class="plan-locked-ic">🔒</span>
          <h4>PRO 전용 — 상세 실행 가이드</h4>
          <p>왜 필요한지, 단계별 실행 방법, 예상 투입 리소스, KPI, 추천 도구까지 모두 확인할 수 있습니다.</p>
          <button class="primary" data-action="go-pricing">PRO 멤버십 시작하기 →</button>
        </div>
      </div>
      <div class="plan-locked-preview" aria-hidden="true">
        <div class="plan-detail-block">
          <h4 class="plan-detail-hd">🎯 왜 필요한가</h4>
          <p class="plan-detail-text">현재 점수 분석과 구체적인 약점…</p>
        </div>
        <div class="plan-detail-block">
          <h4 class="plan-detail-hd">📋 실행 단계 (5단계)</h4>
          <ol class="plan-detail-steps">
            <li>현재 상태 점검</li>
            <li>실행 계획서 작성</li>
            <li>본격 실행</li>
          </ol>
        </div>
      </div>
    </div>
  `;
}

function renderActionCard(action, isPaid, idx, phaseKey) {
  const color = scoreColor(action.chScore);
  const cardId = `plan-card-${phaseKey}-${idx}`;
  return `
    <article class="plan-action" data-card-id="${cardId}">
      <header class="plan-action-head" data-action="toggle-plan-detail" data-card-id="${cardId}">
        <span class="plan-action-ch">
          <span class="plan-action-ic">${action.chIc}</span>
          <span class="plan-action-lb">${action.chLb}</span>
        </span>
        <div class="plan-action-meta">
          <span class="plan-action-score" style="background:${color}14;color:${color};border-color:${color}40">
            ${action.chScore}점 · ${scoreLabel(action.chScore)}
          </span>
          <span class="plan-action-lock" title="${isPaid ? "상세 가이드 보기" : "PRO 전용 — 잠금"}">
            ${isPaid ? "🔓" : "🔒"}
          </span>
          <span class="plan-action-chevron">▾</span>
        </div>
      </header>
      <p class="plan-action-text" data-action="toggle-plan-detail" data-card-id="${cardId}">${action.text}</p>
      <div class="plan-action-detail" hidden>
        ${isPaid ? renderPaidDetail(action) : renderLockedDetail()}
      </div>
    </article>
  `;
}

function renderPhase(phase, actions, isPaid) {
  return `
    <section class="plan-phase" style="border-color:${phase.color}30;background:${phase.bg}">
      <header class="plan-phase-hd">
        <div class="plan-phase-title">
          <span class="plan-phase-ic" style="background:${phase.color};color:#fff">${phase.icon}</span>
          <div>
            <h3>${phase.label}</h3>
            <p class="plan-phase-sub">${phase.subtitle}</p>
          </div>
        </div>
        <div class="plan-phase-meta">
          <span class="plan-phase-count" style="color:${phase.color}">${actions.length}개 액션</span>
          <span class="plan-phase-effort">난이도 ${phase.effort}</span>
        </div>
      </header>
      <div class="plan-phase-list">
        ${actions.length
          ? actions.map((a, i) => renderActionCard(a, isPaid, i, phase.key)).join("")
          : `<p class="plan-phase-empty">해당 단계에 액션이 없습니다.</p>`}
      </div>
    </section>
  `;
}

export function renderPlanPage(state, chapterMap) {
  const isPaid = !!state.isPaid;
  const scores = CHAPTERS.map((c) => chapterMap[c.id].s);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const buckets = collectActions(chapterMap);
  const totalActions = buckets.now.length + buckets.short.length + buckets.mid.length;

  const weakest = [...CHAPTERS]
    .map((c) => ({ ...c, score: chapterMap[c.id].s }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const phaseSections = PHASE_META.map((p) => renderPhase(p, buckets[p.key], isPaid)).join("");

  const paidBanner = isPaid
    ? ""
    : `<div class="plan-pro-banner">
        <span class="plan-pro-ic">💎</span>
        <div class="plan-pro-text">
          <strong>PRO 멤버십으로 상세 가이드 잠금 해제</strong>
          <p>각 액션의 왜·어떻게·KPI·도구를 전부 확인할 수 있습니다.</p>
        </div>
        <button class="primary" data-action="go-pricing">PRO 시작 →</button>
      </div>`;

  return `
    <section class="plan-wrap mri-shell">
      <header class="card chapter-hero plan-hero">
        <div class="chapter-hero-inner plan-hero-inner">
          <div class="chapter-hero-text">
            <p class="plan-hero-kicker">🎯 단계별 실행 로드맵</p>
            <h2>마케팅 실행 플랜</h2>
            <p class="mri-page-sub">
              진단 결과를 바탕으로 <strong>${totalActions}개 액션</strong>을 우선순위 순서로 배치했습니다.
              각 카드를 눌러 ${isPaid ? "상세 실행 가이드를" : "액션을"} 확인하세요.
            </p>
          </div>
          <div class="plan-hero-stats">
            <div class="plan-hero-stat">
              <span class="plan-hero-stat-num" style="color:${scoreColor(avg)}">${avg}</span>
              <span class="plan-hero-stat-lb">현재 평균</span>
            </div>
            <div class="plan-hero-stat">
              <span class="plan-hero-stat-num" style="color:var(--brand)">${totalActions}</span>
              <span class="plan-hero-stat-lb">총 액션</span>
            </div>
          </div>
        </div>
      </header>

      ${paidBanner}

      <section class="card plan-weakest">
        <header class="report-section-head">
          <h3>🚨 우선 개선 챕터 TOP 3</h3>
          <p class="mri-page-sub">점수가 가장 낮은 영역 — 즉시 실행 액션부터 공략하세요.</p>
        </header>
        <div class="plan-weakest-grid">
          ${weakest
            .map(
              (ch) => `
            <button type="button" class="plan-weakest-card" data-action="open-chapter" data-id="${ch.id}">
              <span class="plan-weakest-ic">${ch.ic}</span>
              <span class="plan-weakest-lb">${ch.lb}</span>
              <span class="plan-weakest-score" style="color:${scoreColor(ch.score)}">${ch.score}점</span>
            </button>`
            )
            .join("")}
        </div>
      </section>

      <div class="plan-roadmap">
        ${phaseSections}
      </div>

      <section class="plan-download card ${isPaid ? "" : "is-locked"}">
        <div class="plan-download-head">
          <span class="plan-download-ic">📄</span>
          <div>
            <h3>마케팅 실행 플랜 다운로드</h3>
            <p class="mri-page-sub">
              ${isPaid
                ? "상세 가이드가 모두 포함된 문서를 PDF 또는 HTML로 저장하세요. 클라이언트 공유·내부 회람에 활용할 수 있습니다."
                : "PRO 멤버십에서 PDF·HTML 다운로드를 제공합니다. 상세 가이드 전체를 한 문서에 담아 전달하세요."}
            </p>
          </div>
        </div>
        <div class="plan-download-actions">
          <button class="primary ${isPaid ? "" : "is-disabled"}" data-action="download-plan-pdf" ${isPaid ? "" : "disabled"}>
            ${isPaid ? "📄" : "🔒"} PDF로 저장
          </button>
          <button class="secondary ${isPaid ? "" : "is-disabled"}" data-action="download-plan-html" ${isPaid ? "" : "disabled"}>
            ${isPaid ? "🌐" : "🔒"} HTML로 저장
          </button>
          ${isPaid ? "" : `<button class="primary" data-action="go-pricing">PRO 시작하기 →</button>`}
        </div>
      </section>

      <section class="plan-cta card">
        <div class="plan-cta-text">
          <h3>콘텐츠 액션은 ContentFlow에서 실행하세요</h3>
          <p class="mri-page-sub">블로그·숏폼 등 콘텐츠 제작이 필요한 액션은 ContentFlow에서 자동 생성할 수 있습니다.</p>
        </div>
        <button class="primary" data-action="go-cf">🔄 ContentFlow로 이동 →</button>
      </section>

      <!-- 인쇄 전용 표지 (화면에서는 숨김) -->
      <div class="plan-print-cover" aria-hidden="true">
        <div class="plan-print-cover-inner">
          <p class="plan-print-kicker">마케팅MRI · 실행 플랜 보고서</p>
          <h1>${state.inputBrand || "브랜드"}</h1>
          <p class="plan-print-sub">진단 평균 <strong>${avg}점</strong> · 총 <strong>${totalActions}개</strong> 액션 · 3단계 로드맵</p>
          <p class="plan-print-date">발행일 ${new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>
    </section>
  `;
}
