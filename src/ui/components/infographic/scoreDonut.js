import { scoreColor, scoreLabel } from "../../../utils/score.js";

export function renderScoreDonut(score, size = 120) {
  const r = (size - 12) / 2;
  const c = Math.PI * 2 * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  const cx = size / 2;

  return `
    <div class="donut-wrap" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--bar-bg)" stroke-width="10" />
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="10"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}"
          stroke-linecap="round" transform="rotate(-90 ${cx} ${cx})"
          style="transition:stroke-dashoffset .6s ease" />
      </svg>
      <div class="donut-label">
        <span class="donut-score" style="color:${color}">${score}</span>
        <span class="donut-status">${scoreLabel(score)}</span>
      </div>
    </div>
  `;
}
