import { scoreColor, scoreLabel } from "../../../utils/score.js";

const uid = () => `b${Math.random().toString(36).slice(2, 9)}`;

const lighten = (hex, amt = 0.3) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) + 255 * amt));
  const g = Math.min(255, Math.round(((n >> 8) & 255) + 255 * amt));
  const b = Math.min(255, Math.round((n & 255) + 255 * amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

export function renderScoreBadge(score) {
  const color = scoreColor(score);
  const light = lighten(color, 0.35);
  const label = scoreLabel(score);
  const id = uid();

  const w = 120;
  const h = 68;
  const cx = w / 2;
  const cy = h - 8;
  const r = 44;
  const stroke = 8;

  const totalArc = Math.PI * r;
  const progress = (score / 100) * totalArc;
  const offset = totalArc - progress;

  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;

  return `
    <div class="score-badge">
      <svg class="score-badge-gauge" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">
        <defs>
          <linearGradient id="sg-${id}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${light}" />
            <stop offset="100%" stop-color="${color}" />
          </linearGradient>
          <filter id="sh-${id}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feOffset in="b" dx="0" dy="1" result="o" />
            <feComponentTransfer in="o" result="s"><feFuncA type="linear" slope=".25" /></feComponentTransfer>
            <feMerge><feMergeNode in="s" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="${arcPath}" fill="none" stroke="var(--bar-bg, rgba(120,120,140,.18))" stroke-width="${stroke}" stroke-linecap="round" />
        <path d="${arcPath}" fill="none" stroke="url(#sg-${id})" stroke-width="${stroke}" stroke-linecap="round"
          stroke-dasharray="${totalArc.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
          filter="url(#sh-${id})"
          style="transition:stroke-dashoffset .8s cubic-bezier(.4,.0,.2,1)" />
      </svg>
      <div class="score-badge-text">
        <span class="score-badge-num" style="color:${color};text-shadow:0 2px 8px ${color}22">${score}</span>
        <span class="score-badge-unit">/100</span>
      </div>
      <span class="score-badge-pill" style="background:${color}14;color:${color};border-color:${color}40">${label}</span>
    </div>
  `;
}
