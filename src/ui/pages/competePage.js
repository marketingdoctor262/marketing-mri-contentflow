import { getEnrichedChapterMap } from "../../state/chapterData.js";
import { COMPARABLE_CHAPTERS, EXCLUDED_CHAPTERS } from "../../services/competitorService.js";
import { CHAPTERS, MRI_DATA } from "../../data/chapters.js";
import { getCompetitorInsight } from "../../data/competitorInsights.js";
import { scoreColor, scoreLabel, averageScore } from "../../utils/score.js";

const escapeAttr = (v) => String(v ?? "").replace(/"/g, "&quot;");

function buildMyScores(state) {
  const map = getEnrichedChapterMap(state);
  const scores = {};
  COMPARABLE_CHAPTERS.forEach((c) => {
    scores[c.id] = map[c.id]?.s || 0;
  });
  const total = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / COMPARABLE_CHAPTERS.length
  );
  return { scores, total };
}

/**
 * 경쟁 레이더 차트 (내 브랜드 vs 경쟁사, 14각형)
 */
function renderCompareRadar(mine, comp) {
  const width = 680;
  const height = 560;
  const cx = width / 2;
  const cy = height / 2;
  const R = 170;
  const n = COMPARABLE_CHAPTERS.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolys = gridLevels
    .map(
      (lv) =>
        `<polygon points="${COMPARABLE_CHAPTERS.map((_, i) => {
          const r = R * lv;
          const x = cx + r * Math.cos(angle(i));
          const y = cy + r * Math.sin(angle(i));
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(" ")}" fill="none" stroke="#94a3b8" stroke-width="${lv === 1 ? 1.4 : 1}" opacity="${lv === 1 ? 0.75 : 0.55}" />`
    )
    .join("");

  const gridLabels = gridLevels
    .map((lv) => {
      const y = cy - R * lv;
      return `<text x="${cx + 3}" y="${y.toFixed(1)}" font-size="9" fill="#94a3b8" font-weight="600" dominant-baseline="middle">${Math.round(lv * 100)}</text>`;
    })
    .join("");

  const spokes = COMPARABLE_CHAPTERS.map((_, i) => {
    const x = cx + R * Math.cos(angle(i));
    const y = cy + R * Math.sin(angle(i));
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#94a3b8" stroke-width="1" opacity="0.55" stroke-dasharray="3,3" />`;
  }).join("");

  const labels = COMPARABLE_CHAPTERS.map((ch, i) => {
    const a = angle(i);
    const lx = cx + (R + 26) * Math.cos(a);
    const ly = cy + (R + 26) * Math.sin(a);
    const cos = Math.cos(a);
    // 좌/중/우 anchor 결정 (각도별)
    const anchor = cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle";
    const my = mine[ch.id] || 0;
    const cp = comp[ch.id] || 0;
    const winColor = my > cp ? "#0d9488" : my < cp ? "#ec4899" : "var(--muted)";
    return `
      <g class="compete-radar-label">
        <text x="${lx.toFixed(1)}" y="${(ly - 6).toFixed(1)}" text-anchor="${anchor}" font-size="14" font-weight="700">${ch.ic}</text>
        <text x="${lx.toFixed(1)}" y="${(ly + 8).toFixed(1)}" text-anchor="${anchor}" font-size="10.5" font-weight="700" fill="var(--text)">${ch.lb}</text>
        <text x="${lx.toFixed(1)}" y="${(ly + 21).toFixed(1)}" text-anchor="${anchor}" font-size="10" font-weight="800" fill="${winColor}">${my} vs ${cp}</text>
      </g>`;
  }).join("");

  const poly = (scoreMap, color, fillOpacity) => {
    const pts = COMPARABLE_CHAPTERS.map((ch, i) => {
      const s = scoreMap[ch.id] || 0;
      const r = R * (s / 100);
      const x = cx + r * Math.cos(angle(i));
      const y = cy + r * Math.sin(angle(i));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="2.5" />`;
  };

  return `
    <svg class="compete-radar" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="경쟁사 비교 레이더">
      ${gridPolys}
      ${spokes}
      ${gridLabels}
      ${poly(comp, "#ec4899", 0.18)}
      ${poly(mine, "#0d9488", 0.28)}
      ${labels}
    </svg>
  `;
}

function renderInputCard(state) {
  const loading = state.competeLoading;
  return `
    <section class="card compete-input-card">
      <header class="report-section-head">
        <h3>🆚 경쟁사 정보 입력</h3>
        <p class="mri-page-sub">경쟁사 브랜드명과 홈페이지 URL을 입력하면 ${COMPARABLE_CHAPTERS.length}개 챕터를 자동 진단한 뒤 내 브랜드와 비교합니다. (GA4 기반 "통계·데이터 분석" 챕터는 비공개 지표라 비교에서 제외됩니다)</p>
      </header>
      <div class="compete-input-form">
        <div class="compete-input-row">
          <label>경쟁사 브랜드명</label>
          <input id="competeBrandInput" value="${escapeAttr(state.competeBrand || "")}" placeholder="예: 블루보틀" />
        </div>
        <div class="compete-input-row">
          <label>경쟁사 홈페이지 URL</label>
          <input id="competeUrlInput" value="${escapeAttr(state.competeUrl || "")}" placeholder="https://example.com" />
        </div>
        <div class="row gap-sm wrap" style="margin-top:10px">
          <button class="primary" data-action="run-compete" ${loading ? "disabled" : ""}>
            ${loading ? "분석 중…" : "🔎 자동 분석 시작"}
          </button>
          ${state.competeSnapshot ? `<button class="secondary" data-action="clear-compete">분석 초기화</button>` : ""}
        </div>
        ${state.competeError ? `<p class="integration-err">${escapeAttr(state.competeError)}</p>` : ""}
      </div>
    </section>
  `;
}

function renderSummary(mine, comp, compName) {
  const diff = mine.total - comp.totalScore;
  const winning = Object.keys(mine.scores).filter((id) => mine.scores[id] > (comp.scores[id] || 0)).length;
  const losing = Object.keys(mine.scores).filter((id) => mine.scores[id] < (comp.scores[id] || 0)).length;
  const tie = COMPARABLE_CHAPTERS.length - winning - losing;
  const verdict = diff > 5 ? "우위" : diff < -5 ? "열세" : "백중세";
  const verdictColor = diff > 5 ? "var(--ok)" : diff < -5 ? "var(--bad)" : "var(--neutral)";

  return `
    <section class="card compete-summary">
      <div class="compete-summary-top">
        <div class="compete-team compete-team-mine">
          <span class="compete-team-lb">내 브랜드</span>
          <div class="compete-team-score" style="color:${scoreColor(mine.total)}">${mine.total}</div>
        </div>
        <div class="compete-vs">
          <span class="compete-vs-badge" style="background:${verdictColor}">${verdict}</span>
          <small>${diff > 0 ? "+" : ""}${diff}점</small>
        </div>
        <div class="compete-team compete-team-comp">
          <span class="compete-team-lb">${compName}</span>
          <div class="compete-team-score" style="color:${scoreColor(comp.totalScore)}">${comp.totalScore}</div>
        </div>
      </div>
      <div class="compete-summary-stats">
        <div class="compete-stat"><strong style="color:var(--ok)">${winning}</strong><span>우위 챕터</span></div>
        <div class="compete-stat"><strong style="color:var(--muted)">${tie}</strong><span>백중세</span></div>
        <div class="compete-stat"><strong style="color:var(--bad)">${losing}</strong><span>열세 챕터</span></div>
      </div>
      ${comp.notes?.length ? `<p class="compete-notes">📝 ${comp.notes.join(" · ")}</p>` : ""}
    </section>
  `;
}

function renderRadarCard(mine, comp, compName) {
  return `
    <section class="card compete-radar-card">
      <header class="report-section-head">
        <h3>📡 ${COMPARABLE_CHAPTERS.length}개 챕터 레이더 비교</h3>
        <p class="mri-page-sub">초록(내 브랜드) vs 분홍(경쟁사) — 다각형이 바깥쪽일수록 강점입니다.</p>
      </header>
      <div class="compete-radar-wrap">
        ${renderCompareRadar(mine.scores, comp.scores)}
      </div>
      <div class="compete-legend">
        <span><i class="compete-dot" style="background:#0d9488"></i>내 브랜드</span>
        <span><i class="compete-dot" style="background:#ec4899"></i>${compName}</span>
      </div>
    </section>
  `;
}

function renderLockedDetail() {
  return `
    <section class="card compete-locked">
      <span class="plan-locked-ic">🔒</span>
      <h4>상세 비교·액션 추천은 PRO 전용</h4>
      <p>챕터별 점수 차이 + 왜 이기고 왜 졌는지 + 우선 따라잡을 챕터 TOP 3 액션 플랜을 제공합니다.</p>
      <button class="primary" data-action="go-pricing">PRO 멤버십 시작하기 →</button>
    </section>
  `;
}

function buildGapNarrative(ch, my, cp, compName, myData, compInsight) {
  const d = my - cp;
  if (!compInsight) {
    return `경쟁사 점수 ${cp}점 대비 ${d > 0 ? "+" + d : d}점 차이입니다.`;
  }

  const myStr = (myData.str || []).slice(0, 2);
  const myWk = (myData.wk || []).slice(0, 2);
  const cpStr = compInsight.str.slice(0, 2);
  const cpWk = compInsight.wk.slice(0, 2);

  if (d >= 10) {
    return `
      <p><strong style="color:var(--ok)">✅ 내 브랜드가 ${d}점 앞섭니다.</strong> 이 챕터는 경쟁 우위 영역입니다.</p>
      <p><strong>내 브랜드 우위 포인트</strong></p>
      <ul>${myStr.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p><strong>경쟁사(${compName})가 부족한 부분</strong></p>
      <ul>${cpWk.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p class="compete-gap-tip">💡 이 강점을 콘텐츠·광고 크리에이티브에 적극 노출해 경쟁사 대비 선택 이유를 강화하세요.</p>
    `;
  }
  if (d > 0) {
    return `
      <p><strong style="color:var(--ok)">✅ 내 브랜드가 +${d}점 근소 우위.</strong> 격차가 좁아 방심하면 역전 위험.</p>
      <p><strong>내 브랜드의 강점 (유지·확장 필요)</strong></p>
      <ul>${myStr.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p><strong>경쟁사(${compName})의 강점 (경계 필요)</strong></p>
      <ul>${cpStr.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p class="compete-gap-tip">💡 우위는 있으나 격차가 좁습니다. 현재 강점을 놓치지 않으면서 경쟁사 강점도 빠르게 벤치마킹하세요.</p>
    `;
  }
  if (d === 0) {
    return `
      <p><strong style="color:var(--muted)">≈ 동점.</strong> 차별화 포인트가 없어 고객이 선택 기준을 찾기 어려운 상태.</p>
      <p><strong>양측의 공통 강점</strong></p>
      <ul>${myStr.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p><strong>양측의 공통 약점 (먼저 선점 기회)</strong></p>
      <ul>${myWk.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p class="compete-gap-tip">💡 공통 약점을 먼저 해결해 경쟁사 대비 독자적 우위를 선점하세요.</p>
    `;
  }
  if (d > -10) {
    return `
      <p><strong style="color:var(--bad)">⚠️ 내 브랜드가 ${d}점 뒤처짐.</strong> 단기 실행으로 3개월 내 동등화 목표 가능.</p>
      <p><strong>경쟁사(${compName})가 앞선 부분</strong></p>
      <ul>${cpStr.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p><strong>내 브랜드에서 보완이 필요한 부분</strong></p>
      <ul>${myWk.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p class="compete-gap-tip">💡 위 경쟁사의 강점 요소를 내 브랜드에도 구현하고, 약점을 우선 해소해 격차를 빠르게 좁히세요.</p>
    `;
  }
  return `
    <p><strong style="color:var(--bad)">🚨 내 브랜드가 ${d}점 큰 열세.</strong> 구조적 개편이 필요한 영역입니다.</p>
    <p><strong>경쟁사(${compName})가 확보한 핵심 요소</strong></p>
    <ul>${cpStr.map((s) => `<li>${s}</li>`).join("")}</ul>
    <p><strong>내 브랜드의 구조적 약점</strong></p>
    <ul>${myWk.map((s) => `<li>${s}</li>`).join("")}</ul>
    <p class="compete-gap-tip">💡 단발성 액션으로 극복 어려움. 중장기(3~6개월) 로드맵으로 구조적 개편을 추진하세요.</p>
  `;
}

function renderChapterDetail(ch, my, cp, compName) {
  const brandData = MRI_DATA[ch.id] || {};
  const strengths = (brandData.str || []).slice(0, 3);
  const weaknesses = (brandData.wk || []).slice(0, 3);
  const actions = (brandData.act || []).slice(0, 2);
  const compInsight = getCompetitorInsight(ch.id, cp);
  const diff = my - cp;
  const gapText =
    diff > 10
      ? `내 브랜드가 <strong>+${diff}점</strong> 앞섭니다. 해당 강점을 유지·확장하면서 약점 챕터에 자원을 재배치하세요.`
      : diff > 0
      ? `<strong>+${diff}점</strong> 차이로 근소한 우위. 격차가 좁아 안심할 수준은 아닙니다.`
      : diff === 0
      ? `동점. 차별화 포인트가 부족한 상태로 2~3개월 안에 역전될 위험이 있습니다.`
      : diff >= -10
      ? `<strong>${diff}점</strong> 뒤처지나 추격 가능한 범위. 단기 실행 액션으로 3개월 내 동등화 목표.`
      : `<strong>${diff}점</strong> 큰 열세. 구조적 원인 진단이 먼저 필요하며 중장기 플랜 수립이 필수.`;

  const myBar = Math.max(2, my);
  const cpBar = Math.max(2, cp);

  return `
    <div class="compete-detail-panel">
      <div class="compete-detail-bars">
        <div class="compete-detail-bar">
          <span class="compete-detail-lb">내 브랜드</span>
          <div class="compete-detail-track"><div class="compete-detail-fill" style="width:${myBar}%;background:#0d9488"></div></div>
          <strong style="color:${scoreColor(my)}">${my}</strong>
        </div>
        <div class="compete-detail-bar">
          <span class="compete-detail-lb">${compName}</span>
          <div class="compete-detail-track"><div class="compete-detail-fill" style="width:${cpBar}%;background:#ec4899"></div></div>
          <strong style="color:${scoreColor(cp)}">${cp}</strong>
        </div>
      </div>

      <p class="compete-detail-gap">${gapText}</p>

      <div class="compete-detail-cols">
        <div class="compete-detail-col compete-detail-mine">
          <h5>🏷 내 브랜드 진단 <small>${my}점 · ${scoreLabel(my)}</small></h5>
          ${brandData.sum ? `<p class="compete-detail-sum">${brandData.sum}</p>` : ""}
          ${strengths.length ? `<div><strong>강점</strong><ul>${strengths.map((s) => `<li>${s}</li>`).join("")}</ul></div>` : ""}
          ${weaknesses.length ? `<div><strong>약점</strong><ul>${weaknesses.map((s) => `<li>${s}</li>`).join("")}</ul></div>` : ""}
        </div>

        <div class="compete-detail-col compete-detail-comp">
          <h5>🆚 ${compName} 추정 진단 <small>${cp}점 · ${scoreLabel(cp)}</small></h5>
          ${compInsight
            ? `
              <p class="compete-detail-sum">${compInsight.sum}</p>
              <div><strong>추정 강점</strong><ul>${compInsight.str.map((s) => `<li>${s}</li>`).join("")}</ul></div>
              <div><strong>추정 약점</strong><ul>${compInsight.wk.map((s) => `<li>${s}</li>`).join("")}</ul></div>
              <p class="compete-detail-hint">📡 추정 근거: URL·HTML 휴리스틱 시그널${ch.id === "keywords" || ch.id === "sem" ? " + SEO 실측(PageSpeed) 40% 반영" : ""} · 같은 MRI 프레임으로 직접 비교 가능</p>
            `
            : `<p class="compete-detail-sum">경쟁사 점수: <strong>${cp}점</strong> (${scoreLabel(cp)})</p>`}
        </div>
      </div>

      <div class="compete-gap-box">
        <h5>📐 격차 분석 — 어디서 이기고 어디서 지는가</h5>
        ${buildGapNarrative(ch, my, cp, compName, brandData, compInsight)}
      </div>

      ${
        actions.length
          ? `<div class="compete-detail-actions">
              <h5>🎯 따라잡기 액션</h5>
              <ol>${actions.map((a) => `<li>${a}</li>`).join("")}</ol>
              <div class="row gap-sm wrap" style="margin-top:10px">
                <button class="secondary" data-action="open-chapter" data-id="${ch.id}">내 브랜드 ${ch.lb} 진단 상세</button>
                <button class="primary" data-action="go-plan">실행 플랜에서 확인</button>
              </div>
            </div>`
          : ""
      }
    </div>
  `;
}

function renderChapterTable(mine, comp, compName) {
  const rows = COMPARABLE_CHAPTERS.map((ch) => {
    const my = mine.scores[ch.id] || 0;
    const cp = comp.scores[ch.id] || 0;
    const d = my - cp;
    const winner = d > 0 ? "mine" : d < 0 ? "comp" : "tie";
    const winnerLabel = winner === "mine" ? "✅ 우위" : winner === "comp" ? "⚠️ 열세" : "≈ 백중";
    const winnerColor = winner === "mine" ? "var(--ok)" : winner === "comp" ? "var(--bad)" : "var(--muted)";
    return `
      <article class="compete-card compete-card-${winner}" data-ch-id="${ch.id}">
        <header class="compete-card-head" data-action="toggle-compete-detail" data-ch-id="${ch.id}">
          <div class="compete-card-title">
            <span class="compete-ch-ic">${ch.ic}</span>
            <strong>${ch.lb}</strong>
          </div>
          <div class="compete-card-scores">
            <span class="compete-card-score">
              <small>내 브랜드</small>
              <strong style="color:${scoreColor(my)}">${my}</strong>
            </span>
            <span class="compete-card-vs">vs</span>
            <span class="compete-card-score">
              <small>${compName}</small>
              <strong style="color:${scoreColor(cp)}">${cp}</strong>
            </span>
            <span class="compete-card-diff" style="color:${d >= 0 ? "var(--ok)" : "var(--bad)"}">${d > 0 ? "+" : ""}${d}</span>
            <span class="compete-card-verdict" style="background:${winnerColor}">${winnerLabel}</span>
            <span class="compete-card-chev">▾</span>
          </div>
        </header>
        <div class="compete-card-detail" hidden>
          ${renderChapterDetail(ch, my, cp, compName)}
        </div>
      </article>
    `;
  }).join("");

  return `
    <section class="card compete-table-card">
      <header class="report-section-head">
        <h3>📊 챕터별 상세 비교</h3>
        <p class="mri-page-sub">각 카드를 클릭하면 점수 비교 + 내 브랜드 진단 + 경쟁사 추정 진단 + 따라잡기 액션이 바로 펼쳐집니다.</p>
      </header>
      <div class="compete-card-list">${rows}</div>
    </section>
  `;
}

function renderActionPriority(mine, comp) {
  const gaps = COMPARABLE_CHAPTERS.map((ch) => ({
    ch,
    diff: (mine.scores[ch.id] || 0) - (comp.scores[ch.id] || 0),
  }))
    .filter((g) => g.diff < 0)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3);

  if (!gaps.length) {
    return `
      <section class="card compete-action-card">
        <h3>🏆 열세 챕터 없음</h3>
        <p>모든 챕터에서 내 브랜드가 앞서거나 대등합니다. 현재 포지션을 유지하며 약점 챕터를 한 단계 더 끌어올리세요.</p>
      </section>
    `;
  }

  return `
    <section class="card compete-action-card">
      <header class="report-section-head">
        <h3>🎯 우선 따라잡을 챕터 TOP ${gaps.length}</h3>
        <p class="mri-page-sub">경쟁사 대비 점수 격차가 가장 큰 챕터입니다. 마케팅 실행 플랜에서 해당 챕터의 액션을 우선 실행하세요.</p>
      </header>
      <div class="compete-action-list">
        ${gaps
          .map(
            (g, idx) => `
          <article class="compete-action-item">
            <div class="compete-action-rank">${idx + 1}</div>
            <div class="compete-action-body">
              <h4>${g.ch.ic} ${g.ch.lb}</h4>
              <p>경쟁사 대비 <strong style="color:var(--bad)">${g.diff}점</strong> 뒤처짐 — 이 챕터부터 실행 플랜을 우선 적용하세요.</p>
              <div class="row gap-sm wrap">
                <button class="secondary" data-action="open-chapter" data-id="${g.ch.id}">${g.ch.lb} 진단 상세</button>
                <button class="primary" data-action="go-plan">실행 플랜 이동</button>
              </div>
            </div>
          </article>`
          )
          .join("")}
      </div>
    </section>
  `;
}

export function renderCompetePage(state) {
  const mine = buildMyScores(state);
  const comp = state.competeSnapshot;
  const isPaid = !!state.isPaid;

  return `
    <section class="compete-wrap mri-shell">
      <header class="card chapter-hero compete-hero">
        <div class="chapter-hero-inner">
          <div class="chapter-hero-text">
            <p class="compete-hero-kicker">🆚 경쟁사 비교분석 <span class="ga4-pro-chip">PRO</span></p>
            <h2>내 브랜드 vs 경쟁사</h2>
            <p class="mri-page-sub">
              14개 챕터를 동일한 MRI 프레임으로 경쟁사도 자동 진단 → 어느 영역이 앞서고 뒤지는지 한눈에 비교합니다. (${EXCLUDED_CHAPTERS.length}개 챕터 제외: GA4 비공개 지표 기반)
            </p>
          </div>
        </div>
      </header>

      ${renderInputCard(state)}

      ${
        comp
          ? `
        ${renderSummary(mine, comp, comp.brand)}
        ${renderRadarCard(mine, comp, comp.brand)}
        ${isPaid ? renderChapterTable(mine, comp, comp.brand) : renderLockedDetail()}
        ${isPaid ? renderActionPriority(mine, comp) : ""}
      `
          : `<section class="card compete-empty">
              <p>🔎 경쟁사 브랜드명과 URL을 입력하고 "자동 분석 시작" 버튼을 눌러주세요.</p>
            </section>`
      }
    </section>
  `;
}
