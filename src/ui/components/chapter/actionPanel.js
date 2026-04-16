export function renderActionPanel(actions = []) {
  return `<section class="card">
    <h4>실행 권고</h4>
    ${actions.map((action, idx) => `<p><span class="tag">${["즉시", "1개월", "3개월"][idx] || "계획"}</span> ${action}</p>`).join("")}
  </section>`;
}
