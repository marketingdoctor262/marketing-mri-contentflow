import { scoreColor, scoreLabel } from "../../../utils/score.js";

export function renderGauge(score, label = "", size = 140) {
  const r = (size - 16) / 2;
  const c = Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  const cx = size / 2;
  const cy = size / 2;

  return `
    <div class="gauge-item">
      <svg viewBox="0 0 ${size} ${size * 0.6}" width="${size}" height="${size * 0.6}">
        <path d="M 8 ${cy} A ${r} ${r} 0 0 1 ${size - 8} ${cy}"
          fill="none" stroke="var(--bar-bg)" stroke-width="12" stroke-linecap="round" />
        <path d="M 8 ${cy} A ${r} ${r} 0 0 1 ${size - 8} ${cy}"
          fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}"
          style="transition:stroke-dashoffset .6s ease" />
      </svg>
      <div class="gauge-label">
        <span class="gauge-score" style="color:${color}">${score}</span>
        <span class="gauge-status">${scoreLabel(score)}</span>
      </div>
      ${label ? `<span class="gauge-title">${label}</span>` : ""}
    </div>
  `;
}

export function renderGaugePanel(groups = []) {
  return `
    <section class="card gauge-panel">
      <h4>영역별 진단 게이지</h4>
      <div class="gauge-grid">
        ${groups.map((g) => renderGauge(g.score, g.cat.replace(/^[^\s]+\s/, ""))).join("")}
      </div>
    </section>
  `;
}

export function renderSpeedGauge(spd) {
  if (!spd) return "";
  return `
    <section class="card gauge-panel">
      <h4>⚡ PageSpeed Insights 속도 분석</h4>
      <p style="color:var(--muted);font-size:12px;margin-bottom:4px">Google PageSpeed Insights API · 자동 측정</p>
      <div class="gauge-grid">
        ${renderGauge(spd.mobile.s, "📱 모바일")}
        ${renderGauge(spd.desktop.s, "🖥 PC")}
      </div>
    </section>
  `;
}
