import { scoreColor, scoreLabel } from "../../../utils/score.js";

export function renderGroupBars(groups = []) {
  return `
    <div class="group-bars">
      ${groups
        .map(
          (g) => `
        <div class="group-bar-row">
          <span class="group-bar-label">${g.cat}</span>
          <div class="group-bar-track">
            <div class="group-bar-fill" style="width:${g.score}%;background:${scoreColor(g.score)}"></div>
          </div>
          <span class="group-bar-score" style="color:${scoreColor(g.score)}">${g.score}</span>
          <span class="group-bar-status pill" style="border-color:${scoreColor(g.score)};color:${scoreColor(g.score)}">${scoreLabel(g.score)}</span>
        </div>`
        )
        .join("")}
    </div>
  `;
}
