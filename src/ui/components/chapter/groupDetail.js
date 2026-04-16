import { scoreColor, statusColor } from "../../../utils/score.js";

export function renderGroupDetail(groups = [], isPaid = false) {
  if (!isPaid) return "";

  return groups
    .map(
      (group) => `
      <section class="card">
        <header class="section-hd">
          <strong>${group.cat}</strong>
          <span class="score" style="color:${scoreColor(group.score)}">${group.score}</span>
        </header>
        ${group.items
          .map(
            (item) => `
        <article class="item-row">
          <div>
            <div class="row gap-sm">
              <span class="pill" style="border-color:${statusColor(item.st)};color:${statusColor(item.st)}">${item.st}</span>
              <strong>${item.n}</strong>
            </div>
            <p>${item.tip}</p>
          </div>
          <div class="score-col">
            <span class="score" style="color:${scoreColor(item.s)}">${item.s}</span>
          </div>
        </article>`
          )
          .join("")}
      </section>
    `
    )
    .join("");
}
