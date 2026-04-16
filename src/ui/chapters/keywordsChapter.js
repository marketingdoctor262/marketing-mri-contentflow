import { renderDefaultChapter } from "./defaultChapter.js";
import { renderGaugePanel } from "../components/infographic/gaugeChart.js";

export function renderKeywordsChapter(state, chapterData) {
  const infographic = renderSeoPanel(state) + renderGaugePanel(chapterData.groups);
  return renderDefaultChapter(chapterData, state.isPaid, infographic);
}

function renderSeoPanel(state) {
  if (state.seoLoading) {
    return `<section class="card soft"><h4>SEO 측정 중</h4><p>${state.seoUrl}</p></section>`;
  }
  if (state.seoData?.ok) {
    return `<section class="card soft">
      <div class="row between"><h4>SEO 점수</h4><strong>${state.seoData.score}</strong></div>
      <div class="grid two">${state.seoData.checks
        .map((c) => `<p>${c.ok ? "✅" : "❌"} ${c.lb}</p>`)
        .join("")}</div>
      <button class="tab" data-action="measure-seo">다시 측정</button>
    </section>`;
  }
  return `<section class="card soft">
    <h4>SEO 자동 측정</h4>
    <p>Google PageSpeed Insights API로 측정합니다.</p>
    <button class="tab" data-action="measure-seo">SEO 측정 시작</button>
  </section>`;
}
