import { buildKeywordLab, bucketByQuadrant, clusterKeywords, suggestContentForKeyword, INTENTS } from "../../services/keywordService.js";

export function renderCfKeywords(state) {
  const seed = state.kwSeed || "";
  const items = seed ? buildKeywordLab(seed, state.inputBrand || "") : [];
  const buckets = bucketByQuadrant(items);
  const clusters = clusterKeywords(items);

  return `
    <div class="kw-lab">
      <header class="kw-head">
        <div>
          <h4>🔍 키워드 랩</h4>
          <p class="muted">시드 키워드 → 100+ 확장 → 인텐트 분류 → 난이도×가치 매트릭스 → 콘텐츠 추천까지.</p>
        </div>
      </header>

      <div class="kw-input-row">
        <input id="kwSeedInput" type="text" placeholder="시드 키워드 입력 (쉼표로 구분, 예: 마케팅 진단, 소상공인 광고, 브랜딩)" value="${escapeAttr(seed)}" />
        <button class="primary" data-action="run-keyword-lab">🚀 분석 실행</button>
        <button class="secondary" data-action="seed-keyword-demo">🧪 데모 키워드로 보기</button>
        ${seed ? `<button class="ghost" data-action="clear-keyword-lab">초기화</button>` : ""}
      </div>

      ${!items.length ? renderEmpty() : `
        <div class="kw-stats-row">
          <div class="kw-stat"><div class="n">${items.length}</div><div class="l">총 확장 키워드</div></div>
          <div class="kw-stat"><div class="n">${buckets.gem.length}</div><div class="l">💎 쉬운 보석</div></div>
          <div class="kw-stat"><div class="n">${buckets.hardWin.length}</div><div class="l">🏔 어려운 대박</div></div>
          <div class="kw-stat"><div class="n">${clusters.length}</div><div class="l">📚 토픽 클러스터</div></div>
        </div>

        ${renderIntentBar(items)}
        ${renderQuadrant(buckets)}
        ${renderClusters(clusters)}
        ${renderTopTable(items.slice(0, 30), state.inputBrand || "")}
      `}
    </div>
  `;
}

function renderEmpty() {
  return `
    <div class="kw-empty">
      <div class="kw-empty-ic">🔍</div>
      <h5>시드 키워드를 입력하세요</h5>
      <p>예시: <code>마케팅 진단, 소상공인 광고, 브랜드 컨설팅</code></p>
      <p class="muted">한 번에 100개 이상 키워드를 자동 확장하고, 인텐트별 분류·난이도/가치 매트릭스·콘텐츠 추천까지 한 번에 생성합니다.</p>
    </div>
  `;
}

function renderIntentBar(items) {
  const counts = {};
  items.forEach((it) => { counts[it.intent.id] = (counts[it.intent.id] || 0) + 1; });
  const total = items.length || 1;
  const bars = INTENTS.map((p) => {
    const n = counts[p.id] || 0;
    const pct = Math.round((n / total) * 100);
    return `
      <div class="kw-intent">
        <div class="kw-intent-lb"><span class="kw-dot" style="background:${p.co}"></span>${p.lb} <small>${n}개 (${pct}%)</small></div>
        <div class="kw-intent-bar"><div style="width:${pct}%;background:${p.co}"></div></div>
      </div>
    `;
  }).join("");
  return `<section class="kw-block"><h5>🎯 인텐트 분포</h5>${bars}</section>`;
}

function renderQuadrant(buckets) {
  const dot = (it) => `<div class="kw-q-dot" style="left:${Math.min(95, Math.max(2, it.difficulty))}%; bottom:${Math.min(95, Math.max(2, it.value))}%; background:${it.intent.co}" title="${escapeAttr(it.kw)} · 난이도 ${it.difficulty} · 가치 ${it.value}"></div>`;
  const all = [...buckets.gem, ...buckets.hardWin, ...buckets.easyLow, ...buckets.avoid];
  return `
    <section class="kw-block">
      <h5>📊 난이도 × 가치 매트릭스</h5>
      <div class="kw-quad-wrap">
        <div class="kw-quad">
          <div class="kw-q-axis-y">가치 ↑</div>
          <div class="kw-q-axis-x">→ 난이도</div>
          <div class="kw-q-cell q-gem">💎 쉬운 보석<br><small>${buckets.gem.length}개</small></div>
          <div class="kw-q-cell q-hard">🏔 어려운 대박<br><small>${buckets.hardWin.length}개</small></div>
          <div class="kw-q-cell q-easy">🌱 쉬운 보조<br><small>${buckets.easyLow.length}개</small></div>
          <div class="kw-q-cell q-avoid">⛔ 회피<br><small>${buckets.avoid.length}개</small></div>
          ${all.map(dot).join("")}
        </div>
        <div class="kw-q-tip">
          <strong>💡 추천 전략</strong>
          <p>먼저 <b>💎 쉬운 보석</b> ${buckets.gem.length}개로 빠른 SEO 점수 확보 → 동시에 <b>🏔 어려운 대박</b>은 장기 시리즈 콘텐츠로 분배합니다.</p>
        </div>
      </div>
    </section>
  `;
}

function renderClusters(clusters) {
  if (!clusters.length) return "";
  const cards = clusters.map((c) => {
    const top = c.items.slice(0, 6).map((it) => `<span class="kw-chip" style="border-color:${it.intent.co}">${escapeText(it.kw)}</span>`).join("");
    return `
      <article class="kw-cluster">
        <div class="kw-cluster-head">
          <strong>📚 ${escapeText(c.head)}</strong>
          <small>${c.items.length}개 키워드 · 토픽 가치 ${c.totalValue}</small>
        </div>
        <div class="kw-chips">${top}</div>
        <p class="muted small">→ 이 클러스터는 <b>1편의 메인 블로그 + 3-5편의 서브 콘텐츠</b>로 묶기 좋습니다.</p>
      </article>
    `;
  }).join("");
  return `<section class="kw-block"><h5>🧩 롱테일 클러스터 (토픽 그룹)</h5><div class="kw-clusters">${cards}</div></section>`;
}

function renderTopTable(items, brand) {
  const rows = items.map((it) => {
    const sug = suggestContentForKeyword(it.kw, it.intent);
    return `
      <tr>
        <td>${escapeText(it.kw)}</td>
        <td><span class="kw-pill" style="background:${it.intent.co}22;color:${it.intent.co}">${it.intent.lb}</span></td>
        <td>${it.volume.toLocaleString()}</td>
        <td>${it.difficulty}</td>
        <td><b>${it.value}</b></td>
        <td class="kw-sug">${sug.slice(0, 2).map((s) => `<small>${s}</small>`).join("<br>")}</td>
      </tr>
    `;
  }).join("");
  return `
    <section class="kw-block">
      <h5>🏆 우선 공략 키워드 TOP ${items.length}</h5>
      <div class="kw-table-wrap">
        <table class="kw-table">
          <thead><tr><th>키워드</th><th>인텐트</th><th>월 검색량(추정)</th><th>난이도</th><th>가치</th><th>콘텐츠 추천</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }
function escapeText(s) { return String(s).replace(/[&<>]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c])); }
