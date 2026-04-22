import { scoreColor, scoreLabel } from "../../../utils/score.js";

const uid = () => `d${Math.random().toString(36).slice(2, 9)}`;

const lighten = (hex, amt = 0.25) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) + 255 * amt));
  const g = Math.min(255, Math.round(((n >> 8) & 255) + 255 * amt));
  const b = Math.min(255, Math.round((n & 255) + 255 * amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

export function renderScoreDonut(score, size = 140) {
  const stroke = 12;
  const r = (size - stroke - 8) / 2;
  const c = Math.PI * 2 * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  const light = lighten(color, 0.35);
  const cx = size / 2;
  const id = uid();

  return `
    <div class="donut-wrap" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="donut-svg">
        <defs>
          <linearGradient id="g-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${light}" />
            <stop offset="100%" stop-color="${color}" />
          </linearGradient>
          <radialGradient id="core-${id}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity=".10" />
            <stop offset="70%" stop-color="${color}" stop-opacity=".02" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
          </radialGradient>
          <filter id="shadow-${id}" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feOffset in="b" dx="0" dy="2" result="o" />
            <feComponentTransfer in="o" result="s"><feFuncA type="linear" slope=".25" /></feComponentTransfer>
            <feMerge><feMergeNode in="s" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-${id}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <circle cx="${cx}" cy="${cx}" r="${r - 2}" fill="url(#core-${id})" />
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-opacity=".08" filter="url(#glow-${id})" />
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--bar-bg, rgba(120,120,140,.15))" stroke-width="${stroke}" />
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="url(#g-${id})" stroke-width="${stroke}"
          stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 ${cx} ${cx})"
          filter="url(#shadow-${id})"
          style="transition:stroke-dashoffset .8s cubic-bezier(.4,.0,.2,1)" />
        <circle cx="${cx}" cy="${cx}" r="${r - stroke / 2 - 1}" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="1" />
      </svg>
      <div class="donut-label">
        <span class="donut-score" style="color:${color};text-shadow:0 2px 8px ${color}22">${score}</span>
        <span class="donut-status" style="background:${color}12;color:${color};border-color:${color}30">${scoreLabel(score)}</span>
      </div>
    </div>
  `;
}
