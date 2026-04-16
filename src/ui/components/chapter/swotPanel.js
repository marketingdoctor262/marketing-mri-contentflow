export function renderSwotPanel(chapter) {
  return `<div class="grid two">
    <section class="card success">
      <h4>강점</h4>
      ${chapter.str.map((item) => `<p>• ${item}</p>`).join("")}
    </section>
    <section class="card danger">
      <h4>약점</h4>
      ${chapter.wk.map((item) => `<p>• ${item}</p>`).join("")}
    </section>
  </div>`;
}
