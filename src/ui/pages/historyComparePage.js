import { CHAPTERS } from "../../data/chapters.js";
import { getHistory, formatDate, daysBetween } from "../../services/historyService.js";
import { getHistoryInsight } from "../../data/historyInsights.js";
import { scoreColor, scoreLabel } from "../../utils/score.js";

const escapeAttr = (v) => String(v ?? "").replace(/"/g, "&quot;");

function renderEmptyState() {
  return `
    <section class="card history-empty">
      <span class="plan-locked-ic">📭</span>
      <h3>아직 저장된 진단 기록이 없습니다</h3>
      <p>현 시점 진단 결과를 첫 스냅샷으로 저장하세요. 다음 진단부터 변화 추이를 비교할 수 있습니다.</p>
      <div class="row gap-sm wrap" style="justify-content:center">
        <button class="primary" data-action="capture-snapshot">📸 현 시점 스냅샷 저장</button>
        <button class="secondary" data-action="seed-demo-history">🧪 데모 데이터로 미리보기 (6주치)</button>
      </div>
    </section>
  `;
}

function renderSingleSnapshot(snap) {
  return `
    <section class="card history-empty">
      <span class="plan-locked-ic">📊</span>
      <h3>첫 진단 스냅샷이 저장됐습니다 (${formatDate(snap.date)})</h3>
      <p>두 번째 진단부터 변화 추이 비교가 가능합니다. 일주일 후 다시 진단해 변화를 확인해보세요.</p>
      <div class="row gap-sm wrap" style="justify-content:center">
        <button class="primary" data-action="capture-snapshot">📸 새 스냅샷 저장하기</button>
        <button class="secondary" data-action="seed-demo-history">🧪 데모로 미리보기</button>
      </div>
    </section>
  `;
}

function renderHeaderCompare(prev, curr) {
  const diff = curr.totalScore - prev.totalScore;
  const days = daysBetween(prev.date, curr.date);
  const verdict = diff > 0 ? "상승" : diff < 0 ? "하락" : "동일";
  const verdictColor = diff > 0 ? "var(--ok)" : diff < 0 ? "var(--bad)" : "var(--muted)";

  return `
    <section class="card history-summary">
      <div class="history-summary-top">
        <div class="history-team">
          <span class="history-team-lb">📅 ${formatDate(prev.date)}</span>
          <small>${days}일 전</small>
          <div class="history-team-score" style="color:${scoreColor(prev.totalScore)}">${prev.totalScore}</div>
        </div>
        <div class="history-vs">
          <span class="history-vs-badge" style="background:${verdictColor}">${verdict}</span>
          <small>${diff > 0 ? "+" : ""}${diff}점</small>
        </div>
        <div class="history-team">
          <span class="history-team-lb">📅 ${formatDate(curr.date)}</span>
          <small>현재</small>
          <div class="history-team-score" style="color:${scoreColor(curr.totalScore)}">${curr.totalScore}</div>
        </div>
      </div>
    </section>
  `;
}

function renderSummaryStats(prev, curr) {
  let up = 0, down = 0, same = 0;
  CHAPTERS.forEach((ch) => {
    const p = prev.chapterScores[ch.id] || 0;
    const c = curr.chapterScores[ch.id] || 0;
    if (c > p) up++;
    else if (c < p) down++;
    else same++;
  });
  return `
    <section class="card history-stats-card">
      <div class="compete-summary-stats">
        <div class="compete-stat"><strong style="color:var(--ok)">▲ ${up}</strong><span>향상 챕터</span></div>
        <div class="compete-stat"><strong style="color:var(--muted)">≈ ${same}</strong><span>동일 챕터</span></div>
        <div class="compete-stat"><strong style="color:var(--bad)">▼ ${down}</strong><span>하락 챕터</span></div>
      </div>
    </section>
  `;
}

function renderRadarCompare(prev, curr) {
  const width = 680;
  const height = 560;
  const cx = width / 2;
  const cy = height / 2;
  const R = 170;
  const n = CHAPTERS.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolys = gridLevels
    .map(
      (lv) =>
        `<polygon points="${CHAPTERS.map((_, i) => {
          const r = R * lv;
          const x = cx + r * Math.cos(angle(i));
          const y = cy + r * Math.sin(angle(i));
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(" ")}" fill="none" stroke="#94a3b8" stroke-width="${lv === 1 ? 1.4 : 1}" opacity="${lv === 1 ? 0.75 : 0.55}" />`
    )
    .join("");

  const gridLabels = gridLevels
    .map((lv) => {
      const y = cy - R * lv;
      return `<text x="${cx + 3}" y="${y.toFixed(1)}" font-size="9" fill="#94a3b8" font-weight="600" dominant-baseline="middle">${Math.round(lv * 100)}</text>`;
    })
    .join("");

  const spokes = CHAPTERS.map((_, i) => {
    const x = cx + R * Math.cos(angle(i));
    const y = cy + R * Math.sin(angle(i));
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#94a3b8" stroke-width="1" opacity="0.55" stroke-dasharray="3,3" />`;
  }).join("");

  const labels = CHAPTERS.map((ch, i) => {
    const a = angle(i);
    const lx = cx + (R + 26) * Math.cos(a);
    const ly = cy + (R + 26) * Math.sin(a);
    const cos = Math.cos(a);
    const anchor = cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle";
    const p = prev.chapterScores[ch.id] || 0;
    const c = curr.chapterScores[ch.id] || 0;
    const d = c - p;
    const winColor = d > 0 ? "#0d9488" : d < 0 ? "#ec4899" : "var(--muted)";
    const arrow = d > 0 ? "▲" : d < 0 ? "▼" : "≈";
    return `
      <g class="compete-radar-label">
        <text x="${lx.toFixed(1)}" y="${(ly - 6).toFixed(1)}" text-anchor="${anchor}" font-size="14" font-weight="700">${ch.ic}</text>
        <text x="${lx.toFixed(1)}" y="${(ly + 8).toFixed(1)}" text-anchor="${anchor}" font-size="10.5" font-weight="700" fill="var(--text)">${ch.lb}</text>
        <text x="${lx.toFixed(1)}" y="${(ly + 21).toFixed(1)}" text-anchor="${anchor}" font-size="10" font-weight="800" fill="${winColor}">${arrow} ${d > 0 ? "+" : ""}${d}</text>
      </g>`;
  }).join("");

  const poly = (scoreMap, color, fillOpacity) => {
    const pts = CHAPTERS.map((ch, i) => {
      const s = scoreMap[ch.id] || 0;
      const r = R * (s / 100);
      const x = cx + r * Math.cos(angle(i));
      const y = cy + r * Math.sin(angle(i));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="2.5" />`;
  };

  return `
    <section class="card compete-radar-card">
      <header class="report-section-head">
        <h3>📡 ${CHAPTERS.length}개 챕터 변화 레이더</h3>
        <p class="mri-page-sub">회색(과거) vs 초록(현재) — 다각형이 바깥쪽으로 확장되었으면 향상.</p>
      </header>
      <div class="compete-radar-wrap">
        <svg class="compete-radar" viewBox="0 0 ${width} ${height}" width="100%" role="img">
          ${gridPolys}
          ${spokes}
          ${gridLabels}
          ${poly(prev.chapterScores, "#94a3b8", 0.18)}
          ${poly(curr.chapterScores, "#0d9488", 0.28)}
          ${labels}
        </svg>
      </div>
      <div class="compete-legend">
        <span><i class="compete-dot" style="background:#94a3b8"></i>과거 (${formatDate(prev.date)})</span>
        <span><i class="compete-dot" style="background:#0d9488"></i>현재 (${formatDate(curr.date)})</span>
      </div>
    </section>
  `;
}

function renderChapterDetail(ch, p, c, isPaid) {
  const diff = c - p;
  const insight = getHistoryInsight(ch.id, diff);
  if (!isPaid) {
    return `
      <div class="history-detail-panel">
        <div class="history-detail-locked">
          <span class="plan-locked-ic">🔒</span>
          <h5>상세 변화 분석 — PRO 전용</h5>
          <p>무엇이 좋아지고 무엇이 나빠졌는지, 원인 추정 + 권고 액션은 PRO 멤버에게만 제공됩니다.</p>
          <button class="primary" data-action="go-pricing">PRO 멤버십 시작 →</button>
        </div>
      </div>
    `;
  }

  const head =
    diff > 0
      ? `<p class="history-detail-gap"><strong style="color:var(--ok)">✅ +${diff}점 향상</strong> — 다음 영역에서 개선이 있었던 것으로 추정됩니다.</p>`
      : diff < 0
      ? `<p class="history-detail-gap"><strong style="color:var(--bad)">⚠️ ${diff}점 하락</strong> — 다음 영역에서 악화가 의심됩니다.</p>`
      : `<p class="history-detail-gap"><strong style="color:var(--muted)">≈ 동일</strong> — 변화 없음. 현재 수준 유지 중.</p>`;

  return `
    <div class="history-detail-panel">
      <div class="compete-detail-bars">
        <div class="compete-detail-bar">
          <span class="compete-detail-lb">과거</span>
          <div class="compete-detail-track"><div class="compete-detail-fill" style="width:${Math.max(2, p)}%;background:#94a3b8"></div></div>
          <strong style="color:${scoreColor(p)}">${p}</strong>
        </div>
        <div class="compete-detail-bar">
          <span class="compete-detail-lb">현재</span>
          <div class="compete-detail-track"><div class="compete-detail-fill" style="width:${Math.max(2, c)}%;background:#0d9488"></div></div>
          <strong style="color:${scoreColor(c)}">${c}</strong>
        </div>
      </div>

      ${head}

      ${insight
        ? `<div class="compete-gap-box">
            <h5>${diff > 0 ? "🟢 개선 추정 영역" : diff < 0 ? "🔴 악화 추정 영역" : "🔵 유지 권고"}</h5>
            <ul>${insight.text.map((t) => `<li>${t}</li>`).join("")}</ul>
            <p class="compete-gap-tip">💡 유지 전략: ${insight.keep}</p>
          </div>`
        : ""}

      <div class="row gap-sm wrap" style="margin-top:10px">
        <button class="secondary" data-action="open-chapter" data-id="${ch.id}">${ch.lb} 진단 상세</button>
        <button class="primary" data-action="go-plan">실행 플랜 이동</button>
      </div>
    </div>
  `;
}

function renderChapterList(prev, curr, isPaid) {
  const rows = CHAPTERS.map((ch) => {
    const p = prev.chapterScores[ch.id] || 0;
    const c = curr.chapterScores[ch.id] || 0;
    const d = c - p;
    const trend = d > 0 ? "up" : d < 0 ? "down" : "keep";
    const trendLabel = d > 0 ? `▲ +${d}` : d < 0 ? `▼ ${d}` : "≈ 0";
    const trendColor = d > 0 ? "var(--ok)" : d < 0 ? "var(--bad)" : "var(--muted)";
    return `
      <article class="compete-card compete-card-${trend === "up" ? "mine" : trend === "down" ? "comp" : "tie"} history-card" data-ch-id="${ch.id}">
        <header class="compete-card-head" data-action="toggle-history-detail" data-ch-id="${ch.id}">
          <div class="compete-card-title">
            <span class="compete-ch-ic">${ch.ic}</span>
            <strong>${ch.lb}</strong>
          </div>
          <div class="compete-card-scores">
            <span class="compete-card-score">
              <small>과거</small>
              <strong style="color:${scoreColor(p)}">${p}</strong>
            </span>
            <span class="compete-card-vs">→</span>
            <span class="compete-card-score">
              <small>현재</small>
              <strong style="color:${scoreColor(c)}">${c}</strong>
            </span>
            <span class="compete-card-diff" style="color:${trendColor}">${trendLabel}</span>
            ${!isPaid ? `<span class="history-lock-pill">🔒 PRO</span>` : ""}
            <span class="compete-card-chev">▾</span>
          </div>
        </header>
        <div class="compete-card-detail" hidden>
          ${renderChapterDetail(ch, p, c, isPaid)}
        </div>
      </article>
    `;
  }).join("");

  return `
    <section class="card compete-table-card">
      <header class="report-section-head">
        <h3>📊 챕터별 변화 ${isPaid ? "" : `<span class="ga4-pro-chip">상세는 PRO</span>`}</h3>
        <p class="mri-page-sub">${isPaid
          ? "각 카드를 클릭하면 점수 변화 + 개선/악화 추정 영역 + 권고 액션이 펼쳐집니다."
          : "FREE 회원은 점수 변화 숫자까지만 확인 가능. 상세 원인·액션은 PRO 멤버 전용."}</p>
      </header>
      <div class="compete-card-list">${rows}</div>
    </section>
  `;
}

function renderTimeSeriesChart(history) {
  if (history.length < 3) return "";
  const points = history.slice(-12);
  const W = 800;
  const H = 220;
  const padX = 40;
  const padY = 24;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const xStep = points.length > 1 ? innerW / (points.length - 1) : 0;
  const yScale = (s) => padY + innerH * (1 - s / 100);

  const linePts = points.map((p, i) => `${(padX + xStep * i).toFixed(1)},${yScale(p.totalScore).toFixed(1)}`).join(" ");
  const dots = points
    .map(
      (p, i) =>
        `<circle cx="${(padX + xStep * i).toFixed(1)}" cy="${yScale(p.totalScore).toFixed(1)}" r="4" fill="#0d9488" />`
    )
    .join("");
  const xLabels = points
    .map(
      (p, i) =>
        `<text x="${(padX + xStep * i).toFixed(1)}" y="${H - 6}" font-size="10" fill="var(--muted)" text-anchor="middle">${formatDate(p.date).slice(5)}</text>`
    )
    .join("");
  const yGrid = [0, 25, 50, 75, 100]
    .map(
      (v) =>
        `<line x1="${padX}" y1="${yScale(v).toFixed(1)}" x2="${W - padX}" y2="${yScale(v).toFixed(1)}" stroke="#e5e7eb" stroke-dasharray="2,3" />
         <text x="${padX - 6}" y="${yScale(v).toFixed(1)}" font-size="10" fill="var(--muted)" text-anchor="end" dominant-baseline="middle">${v}</text>`
    )
    .join("");

  return `
    <section class="card history-timeseries-card">
      <header class="report-section-head">
        <h3>📈 총점 추이 <span class="ga4-pro-chip">PRO</span></h3>
        <p class="mri-page-sub">최근 ${points.length}회 진단 총점 변화. 추세선이 우상향이면 마케팅 성숙도가 지속 성장 중.</p>
      </header>
      <svg viewBox="0 0 ${W} ${H}" width="100%" role="img">
        ${yGrid}
        <polyline points="${linePts}" fill="none" stroke="#0d9488" stroke-width="2.5" />
        ${dots}
        ${xLabels}
      </svg>
    </section>
  `;
}

function renderAutoDiagnoseCard(state, isPaid) {
  if (!isPaid) {
    return `
      <section class="card history-auto-locked">
        <h3>📬 매주 자동 진단 + 이메일 리포트 <span class="ga4-pro-chip">PRO</span></h3>
        <p>매주 월요일 오전 8시에 자동 진단 결과를 이메일로 받아보세요. PRO 회원만 활성화 가능합니다.</p>
        <button class="primary" data-action="go-pricing">PRO 멤버십 시작 →</button>
      </section>
    `;
  }
  const enabled = !!state.autoDiagnoseEnabled;
  return `
    <section class="card history-auto-card">
      <div class="row between" style="align-items:center;flex-wrap:wrap;gap:14px">
        <div>
          <h3 style="margin:0 0 4px">📬 매주 자동 진단 + 이메일 리포트</h3>
          <p class="mri-page-sub" style="margin:0">매주 월요일 오전 8시에 진단 결과를 이메일로 받아보세요.</p>
        </div>
        <button class="primary" data-action="toggle-auto-diagnose">
          ${enabled ? "🟢 활성화됨 (클릭해 비활성화)" : "⚪ 비활성화 (클릭해 활성화)"}
        </button>
      </div>
    </section>
  `;
}

function renderActionBar(state) {
  return `
    <section class="card history-action-bar">
      <div class="row gap-sm wrap" style="align-items:center">
        <strong>📸 새 진단 실행</strong>
        <span class="mri-page-sub" style="margin:0">현 시점 점수를 새 스냅샷으로 저장합니다.</span>
        <span style="flex:1"></span>
        <button class="primary" data-action="capture-snapshot">📸 현 시점 스냅샷 저장</button>
      </div>
    </section>
  `;
}

export function renderHistoryComparePage(state) {
  const history = getHistory();
  const isPaid = !!state.isPaid;

  if (history.length === 0) {
    return `
      <section class="compete-wrap mri-shell">
        <header class="card chapter-hero compete-hero">
          <div class="chapter-hero-inner">
            <div class="chapter-hero-text">
              <p class="compete-hero-kicker">📈 변화 추이 분석</p>
              <h2>과거 vs 현재 진단 비교</h2>
              <p class="mri-page-sub">진단 결과를 시점별로 저장하고 변화 추이를 추적합니다.</p>
            </div>
          </div>
        </header>
        ${renderEmptyState()}
      </section>
    `;
  }

  if (history.length === 1) {
    return `
      <section class="compete-wrap mri-shell">
        <header class="card chapter-hero compete-hero">
          <div class="chapter-hero-inner">
            <div class="chapter-hero-text">
              <p class="compete-hero-kicker">📈 변화 추이 분석</p>
              <h2>과거 vs 현재 진단 비교</h2>
              <p class="mri-page-sub">진단 결과를 시점별로 저장하고 변화 추이를 추적합니다.</p>
            </div>
          </div>
        </header>
        ${renderActionBar(state)}
        ${renderSingleSnapshot(history[0])}
      </section>
    `;
  }

  const prev = history[history.length - 2];
  const curr = history[history.length - 1];

  return `
    <section class="compete-wrap mri-shell">
      <header class="card chapter-hero compete-hero">
        <div class="chapter-hero-inner">
          <div class="chapter-hero-text">
            <p class="compete-hero-kicker">📈 변화 추이 분석 ${isPaid ? "" : `<span class="ga4-pro-chip">상세는 PRO</span>`}</p>
            <h2>과거 vs 현재 진단 비교</h2>
            <p class="mri-page-sub">
              총 ${history.length}회 진단 기록 · 비교 대상: <strong>${formatDate(prev.date)}</strong> → <strong>${formatDate(curr.date)}</strong>
            </p>
          </div>
        </div>
      </header>

      ${renderActionBar(state)}
      ${renderHeaderCompare(prev, curr)}
      ${renderSummaryStats(prev, curr)}
      ${renderRadarCompare(prev, curr)}
      ${renderChapterList(prev, curr, isPaid)}
      ${isPaid ? renderTimeSeriesChart(history) : ""}
      ${renderAutoDiagnoseCard(state, isPaid)}
    </section>
  `;
}
