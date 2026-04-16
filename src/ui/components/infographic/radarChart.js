import { scoreColor } from "../../../utils/score.js";

export function renderRadarChart(groups = [], brandColor = "var(--brand)") {
  const n = groups.length;
  if (n < 3) return "";

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 90;
  const levels = [25, 50, 75, 100];
  const angleStep = (Math.PI * 2) / n;

  const toXY = (angle, r) => ({
    x: cx + r * Math.sin(angle),
    y: cy - r * Math.cos(angle),
  });

  const gridLines = levels
    .map((lv) => {
      const pts = Array.from({ length: n }, (_, i) => {
        const p = toXY(i * angleStep, (lv / 100) * maxR);
        return `${p.x},${p.y}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="none" stroke="var(--line)" stroke-width="1" opacity=".5" />`;
    })
    .join("");

  const axes = Array.from({ length: n }, (_, i) => {
    const p = toXY(i * angleStep, maxR);
    return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="var(--line)" stroke-width="1" opacity=".3" />`;
  }).join("");

  const dataPts = groups
    .map((g, i) => {
      const p = toXY(i * angleStep, (g.score / 100) * maxR);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const dots = groups
    .map((g, i) => {
      const p = toXY(i * angleStep, (g.score / 100) * maxR);
      return `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${scoreColor(g.score)}" stroke="#fff" stroke-width="1.5" />`;
    })
    .join("");

  const labels = groups
    .map((g, i) => {
      const p = toXY(i * angleStep, maxR + 24);
      const anchor = p.x < cx - 10 ? "end" : p.x > cx + 10 ? "start" : "middle";
      const name = g.cat.replace(/^[^\s]+\s/, "");
      return `
        <text x="${p.x}" y="${p.y}" text-anchor="${anchor}" fill="var(--text)" font-size="11" font-weight="600">${name}</text>
        <text x="${p.x}" y="${p.y + 14}" text-anchor="${anchor}" fill="${scoreColor(g.score)}" font-size="12" font-weight="800">${g.score}</text>
      `;
    })
    .join("");

  return `
    <div class="radar-wrap">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="radar-svg">
        ${gridLines}
        ${axes}
        <polygon points="${dataPts}" fill="${brandColor}" fill-opacity=".12" stroke="${brandColor}" stroke-width="2" />
        ${dots}
        ${labels}
      </svg>
    </div>
  `;
}
