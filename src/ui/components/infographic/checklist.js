import { scoreColor } from "../../../utils/score.js";

export function renderChecklist(groups = []) {
  const allItems = groups.flatMap((g) => g.items);
  const done = allItems.filter((i) => i.s >= 70);
  const partial = allItems.filter((i) => i.s >= 40 && i.s < 70);
  const missing = allItems.filter((i) => i.s < 40);
  const pct = allItems.length ? Math.round((done.length / allItems.length) * 100) : 0;

  return `
    <section class="card checklist-panel">
      <h4>실행 체크리스트</h4>

      <div class="checklist-progress">
        <div class="checklist-progress-bar">
          <div class="checklist-progress-fill" style="width:${pct}%;background:${scoreColor(pct)}"></div>
        </div>
        <span class="checklist-pct" style="color:${scoreColor(pct)}">${pct}% 완료</span>
        <span class="checklist-count">${done.length}/${allItems.length}개 항목 양호</span>
      </div>

      <div class="checklist-items">
        ${done
          .map(
            (i) => `
          <div class="checklist-row done">
            <span class="checklist-icon">✅</span>
            <span class="checklist-name">${i.n}</span>
            <span class="checklist-score" style="color:${scoreColor(i.s)}">${i.s}</span>
          </div>`
          )
          .join("")}
        ${partial
          .map(
            (i) => `
          <div class="checklist-row partial">
            <span class="checklist-icon">⚠️</span>
            <span class="checklist-name">${i.n}</span>
            <span class="checklist-score" style="color:${scoreColor(i.s)}">${i.s}</span>
          </div>`
          )
          .join("")}
        ${missing
          .map(
            (i) => `
          <div class="checklist-row missing">
            <span class="checklist-icon">❌</span>
            <span class="checklist-name">${i.n}</span>
            <span class="checklist-score" style="color:${scoreColor(i.s)}">${i.s}</span>
          </div>`
          )
          .join("")}
      </div>
    </section>
  `;
}
