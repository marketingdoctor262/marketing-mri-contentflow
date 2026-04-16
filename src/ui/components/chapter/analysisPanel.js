import { scoreColor, scoreLabel } from "../../../utils/score.js";

export function renderAnalysisPanel(groups = []) {
  const allItems = groups.flatMap((g) => g.items);
  const totalCount = allItems.length;
  const weakItems = allItems.filter((i) => i.s < 40);
  const avgItems = allItems.filter((i) => i.s >= 40 && i.s < 70);
  const goodItems = allItems.filter((i) => i.s >= 70);

  const worstGroup = groups.reduce((a, b) => (a.score < b.score ? a : b), groups[0]);
  const bestGroup = groups.reduce((a, b) => (a.score > b.score ? a : b), groups[0]);

  const top3Weak = [...allItems].sort((a, b) => a.s - b.s).slice(0, 3);

  return `
    <section class="card analysis-panel">
      <h4>📊 진단 분석</h4>

      <div class="analysis-stats">
        <div class="analysis-stat">
          <span class="analysis-stat-num" style="color:var(--bad)">${weakItems.length}</span>
          <small>취약 항목</small>
        </div>
        <div class="analysis-stat">
          <span class="analysis-stat-num" style="color:var(--warn)">${avgItems.length}</span>
          <small>보통 항목</small>
        </div>
        <div class="analysis-stat">
          <span class="analysis-stat-num" style="color:var(--ok)">${goodItems.length}</span>
          <small>양호 항목</small>
        </div>
        <div class="analysis-stat">
          <span class="analysis-stat-num" style="color:var(--text)">${totalCount}</span>
          <small>전체 항목</small>
        </div>
      </div>

      <div class="analysis-insights">
        <div class="analysis-insight danger">
          <strong>가장 취약한 영역</strong>
          <p>${worstGroup.cat} <span class="score" style="color:${scoreColor(worstGroup.score)}">${worstGroup.score}점</span></p>
        </div>
        <div class="analysis-insight success">
          <strong>가장 우수한 영역</strong>
          <p>${bestGroup.cat} <span class="score" style="color:${scoreColor(bestGroup.score)}">${bestGroup.score}점</span></p>
        </div>
      </div>

      <div class="analysis-priority">
        <strong>우선 개선 항목 TOP3</strong>
        ${top3Weak
          .map(
            (item, i) => `
          <div class="analysis-priority-item">
            <span class="analysis-rank">${i + 1}</span>
            <div>
              <span>${item.n}</span>
              <span class="score" style="color:${scoreColor(item.s)};margin-left:6px">${item.s}점</span>
              <span class="pill" style="border-color:${scoreColor(item.s)};color:${scoreColor(item.s)};margin-left:4px">${scoreLabel(item.s)}</span>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </section>
  `;
}
