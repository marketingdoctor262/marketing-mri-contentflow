import { scoreColor, scoreLabel } from "../../../utils/score.js";

export function renderChannelBars(groups = []) {
  const sorted = [...groups].sort((a, b) => b.score - a.score);

  return `
    <section class="card channel-bars-card">
      <h4>채널별 성과 비교</h4>
      <div class="channel-bars">
        ${sorted
          .map(
            (g) => `
          <div class="channel-bar-item">
            <div class="channel-bar-hd">
              <span class="channel-bar-name">${g.cat}</span>
              <span class="channel-bar-score" style="color:${scoreColor(g.score)}">${g.score}점</span>
            </div>
            <div class="channel-bar-track">
              <div class="channel-bar-fill" style="width:${g.score}%;background:${scoreColor(g.score)}">
                <span class="channel-bar-pct">${scoreLabel(g.score)}</span>
              </div>
            </div>
            <div class="channel-bar-meta">
              <span>${g.items.length}개 항목</span>
              <span style="color:var(--bad)">${g.items.filter((i) => i.s < 40).length}개 취약</span>
            </div>
          </div>`
          )
          .join("")}
      </div>
      <div class="channel-legend">
        <span class="channel-legend-item"><span class="channel-dot" style="background:#dc2626"></span>위험 0~24</span>
        <span class="channel-legend-item"><span class="channel-dot" style="background:#ea580c"></span>취약 25~49</span>
        <span class="channel-legend-item"><span class="channel-dot" style="background:#d97706"></span>보통 50~74</span>
        <span class="channel-legend-item"><span class="channel-dot" style="background:#16a34a"></span>양호 75~100</span>
      </div>
    </section>
  `;
}
