import { scoreColor, scoreLabel } from "../../../utils/score.js";

export function renderGroupSummary(groups = []) {
  return `
    <div class="grid two">
      ${groups
        .map(
          (group) => `
        <section class="card soft">
          <div class="row between">
            <strong>${group.cat}</strong>
            <span class="score" style="color:${scoreColor(group.score)}">${group.score}</span>
          </div>
          <div class="bar"><span style="width:${group.score}%;background:${scoreColor(group.score)}"></span></div>
          <small>${scoreLabel(group.score)} · ${group.items.length}개 항목</small>
        </section>
      `
        )
        .join("")}
    </div>
  `;
}
