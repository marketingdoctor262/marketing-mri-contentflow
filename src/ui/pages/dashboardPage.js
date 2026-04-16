import { CHAPTERS } from "../../data/chapters.js";
import { scoreColor, scoreLabel } from "../../utils/score.js";

export function renderDashboardPage(state, chapterMap) {
  const weak = CHAPTERS.slice()
    .sort((a, b) => chapterMap[a.id].s - chapterMap[b.id].s)
    .slice(0, 3);

  const enriched = state.ga4Snapshot || state.adsSnapshot;

  return `
    <section class="mri-shell">
      <header class="mri-page-head">
        <div>
          <h2>마케팅MRI 진단 결과</h2>
          <p class="mri-page-sub">챕터를 클릭해 상세 분석을 확인하세요.</p>
        </div>
        <div class="score-box" style="color:${scoreColor(state.overviewScore)}">${state.overviewScore}</div>
      </header>

      ${
        enriched
          ? `<section class="card success integration-banner-dash">
              <strong>GA4·광고 데이터 보정 적용</strong>
              <p>실제 지표를 반영해 관련 챕터 점수가 조정되었습니다. 숫자 옆 <span class="delta-pill">±</span> 는 기준 대비 보정값입니다.</p>
            </section>`
          : ""
      }

      <section class="card danger">
        <h4>즉시 개선 TOP3</h4>
        <div class="row wrap">
          ${weak
            .map(
              (c, i) =>
                `<button class="chip" data-action="open-chapter" data-id="${c.id}">#${i + 1} ${c.lb} ${chapterMap[c.id].s}</button>`
            )
            .join("")}
        </div>
      </section>

      <div class="grid two">
        ${CHAPTERS.map((c) => {
          const r = chapterMap[c.id];
          return `<article class="card card-clickable" data-action="open-chapter" data-id="${c.id}">
            <div class="row between">
              <strong>${c.ic} ${c.lb}</strong>
              <span class="row gap-sm">
                ${r._enriched ? `<span class="delta-pill" style="color:${r._scoreDelta > 0 ? "var(--ok)" : "var(--bad)"}">${r._scoreDelta > 0 ? "+" : ""}${r._scoreDelta}</span>` : ""}
                <span class="score" style="color:${scoreColor(r.s)}">${r.s}</span>
              </span>
            </div>
            <div class="bar"><span style="width:${r.s}%;background:${scoreColor(r.s)}"></span></div>
            <p>${r.sum}</p>
            <small style="color:${scoreColor(r.s)}">${scoreLabel(r.s)}</small>
          </article>`;
        }).join("")}
      </div>
    </section>
  `;
}
