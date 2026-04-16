export function renderKeywordBlock(keywords = []) {
  if (!keywords.length) return "";
  return `<section class="card">
    <h4>핵심 키워드</h4>
    <div class="row wrap">
      ${keywords.map((keyword) => `<span class="chip">${keyword}</span>`).join("")}
    </div>
  </section>`;
}
