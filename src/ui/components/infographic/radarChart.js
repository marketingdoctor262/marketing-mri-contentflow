import { scoreColor } from "../../../utils/score.js";

const uid = () => `r${Math.random().toString(36).slice(2, 9)}`;

const wrapLabel = (text, max = 7) => {
  const s = String(text).trim();
  if (s.length <= max) return [s];
  const mid = s.indexOf("·");
  if (mid > 0 && mid < s.length - 1) return [s.slice(0, mid), s.slice(mid + 1)];
  const space = s.lastIndexOf(" ", max);
  const cut = space > 2 ? space : max;
  return [s.slice(0, cut), s.slice(cut).trim()];
};

export function renderRadarChart(groups = [], brandColor = "var(--brand)") {
  const n = groups.length;
  if (n < 3) return "";

  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 108;
  const levels = [20, 40, 60, 80, 100];
  const angleStep = (Math.PI * 2) / n;
  const id = uid();

  const toXY = (angle, r) => ({
    x: cx + r * Math.sin(angle),
    y: cy - r * Math.cos(angle),
  });

  const ringFills = levels
    .slice()
    .reverse()
    .map((lv, idx) => {
      const pts = Array.from({ length: n }, (_, i) => {
        const p = toXY(i * angleStep, (lv / 100) * maxR);
        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      }).join(" ");
      const alpha = 0.05 + idx * 0.015;
      return `<polygon points="${pts}" fill="rgba(99,102,241,${alpha})" stroke="none" />`;
    })
    .join("");

  const gridLines = levels
    .map((lv, i) => {
      const pts = Array.from({ length: n }, (_, j) => {
        const p = toXY(j * angleStep, (lv / 100) * maxR);
        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      }).join(" ");
      const isOuter = i === levels.length - 1;
      const stroke = isOuter
        ? "rgba(99,102,241,.35)"
        : "rgba(120,120,140,.22)";
      const sw = isOuter ? 1.5 : 1;
      const dash = isOuter ? "" : `stroke-dasharray="3 3"`;
      return `<polygon points="${pts}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${dash} />`;
    })
    .join("");

  const scaleLabels = levels
    .map((lv) => {
      const p = toXY(0, (lv / 100) * maxR);
      return `<text x="${p.x + 4}" y="${p.y + 3}" fill="rgba(120,120,140,.55)" font-size="8.5" font-weight="500">${lv}</text>`;
    })
    .join("");

  const axes = Array.from({ length: n }, (_, i) => {
    const p = toXY(i * angleStep, maxR);
    return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(2)}" y2="${p.y.toFixed(2)}" stroke="rgba(120,120,140,.2)" stroke-width="1" stroke-dasharray="2 3" />`;
  }).join("");

  const dataPts = groups
    .map((g, i) => {
      const p = toXY(i * angleStep, (g.score / 100) * maxR);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(" ");

  const dots = groups
    .map((g, i) => {
      const p = toXY(i * angleStep, (g.score / 100) * maxR);
      const c = scoreColor(g.score);
      return `
        <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="7" fill="${c}" fill-opacity=".25" />
        <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="4.5" fill="${c}" stroke="#fff" stroke-width="2" filter="url(#dot-${id})" />
      `;
    })
    .join("");

  const labels = groups
    .map((g, i) => {
      const angle = i * angleStep;
      const p = toXY(angle, maxR + 28);
      const anchor = p.x < cx - 8 ? "end" : p.x > cx + 8 ? "start" : "middle";
      const name = g.cat.replace(/^[^\s]+\s/, "");
      const lines = wrapLabel(name, 9);
      const color = scoreColor(g.score);
      const nameY = lines.length > 1 ? p.y - 6 : p.y;
      const lineTags = lines
        .map(
          (ln, li) =>
            `<text x="${p.x.toFixed(2)}" y="${(nameY + li * 13).toFixed(
              2
            )}" text-anchor="${anchor}" fill="var(--text)" font-size="11" font-weight="700" letter-spacing=".2">${ln}</text>`
        )
        .join("");
      const scoreY = nameY + lines.length * 13 + 2;
      return `
        ${lineTags}
        <text x="${p.x.toFixed(2)}" y="${scoreY.toFixed(
          2
        )}" text-anchor="${anchor}" fill="${color}" font-size="13" font-weight="900">${g.score}</text>
      `;
    })
    .join("");

  return `
    <div class="radar-wrap">
      <svg viewBox="0 0 ${size} ${size}" width="100%" height="auto" class="radar-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="bg-${id}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(168,85,247,.08)" />
            <stop offset="70%" stop-color="rgba(99,102,241,.04)" />
            <stop offset="100%" stop-color="rgba(99,102,241,0)" />
          </radialGradient>
          <radialGradient id="fill-${id}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${brandColor}" stop-opacity=".45" />
            <stop offset="100%" stop-color="${brandColor}" stop-opacity=".08" />
          </radialGradient>
          <filter id="glow-${id}" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dot-${id}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="b" />
            <feOffset in="b" dx="0" dy="1" result="o" />
            <feComponentTransfer in="o" result="a"><feFuncA type="linear" slope=".35" /></feComponentTransfer>
            <feMerge>
              <feMergeNode in="a" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="${maxR + 16}" fill="url(#bg-${id})" />
        ${ringFills}
        ${gridLines}
        ${axes}
        ${scaleLabels}
        <polygon points="${dataPts}" fill="url(#fill-${id})" stroke="${brandColor}" stroke-width="2.5" stroke-linejoin="round" filter="url(#glow-${id})" />
        <polygon points="${dataPts}" fill="none" stroke="${brandColor}" stroke-width="1.2" stroke-linejoin="round" opacity=".9" />
        ${dots}
        ${labels}
      </svg>
    </div>
  `;
}
