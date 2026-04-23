import { COPY_FRAMES, getFrame } from "../../data/copyTemplates.js";

function buildVars(state) {
  const v = state.tplVars || {};
  const brand = state.inputBrand || "마케팅MRI";
  const product = v.product?.trim() || brand;
  const problem = v.problem?.trim() || "광고비만 쓰고 매출은 그대로";
  const benefit = v.benefit?.trim() || "데이터 기반 매출 +37%";
  const audience = v.audience?.trim() || "월 매출 1억 이하 사장님";
  const outcome = v.outcome?.trim() || "월 매출 2배";
  const cta = v.cta?.trim() || "무료 진단 신청";

  return {
    product,
    brand,
    problem,
    benefit,
    consequence: `${problem} 상태가 지속되면 경쟁사에게 시장을 빼앗깁니다`,
    solution: `${product} 활용`,
    feature: product,
    advantage: `기존 방식 대비 빠르고 정확함`,
    audience,
    education: `${benefit}을 만드는 핵심 원리`,
    outcome,
    cta,
    topic: product,
    customer: audience,
    task: outcome,
    action: `${product}로 ${benefit} 달성`,
    result: `3개월만에 ${outcome}`,
    before: problem,
    after: benefit,
    bridge: `${product} 도입`,
  };
}

export function renderCfTemplates(state) {
  const activeId = state.tplActiveId || COPY_FRAMES[0].id;
  const viewAll = !!state.tplViewAll;
  const vars = buildVars(state);
  const v = state.tplVars || {};
  const isCustomized = Object.values(v).some((x) => String(x || "").trim());

  const inputForm = `
    <section class="tpl-vars">
      <div class="tpl-vars-head">
        <strong>✨ 우리 브랜드 변수 입력</strong>
        <small class="muted">5개 항목만 채우면 7개 프레임 × 4단계 = <b>28개 카피 초안</b>이 자동 생성됩니다</small>
      </div>
      <div class="tpl-vars-grid">
        <label>제품/주제 <input data-tpl-field="product" type="text" placeholder="예: 유기농 종갓집 김치" value="${esc(v.product)}" /></label>
        <label>타깃 고객 <input data-tpl-field="audience" type="text" placeholder="예: 건강 챙기는 30-40대 주부" value="${esc(v.audience)}" /></label>
        <label>핵심 문제 <input data-tpl-field="problem" type="text" placeholder="예: 마트 김치 화학첨가물 걱정" value="${esc(v.problem)}" /></label>
        <label>우리의 혜택 <input data-tpl-field="benefit" type="text" placeholder="예: 3대째 종갓집 비법, 무첨가" value="${esc(v.benefit)}" /></label>
        <label>기대 결과 <input data-tpl-field="outcome" type="text" placeholder="예: 온 가족이 안심하고 먹는 김치" value="${esc(v.outcome)}" /></label>
        <label>CTA 문구 <input data-tpl-field="cta" type="text" placeholder="예: 첫 주문 20% 할인 받기" value="${esc(v.cta)}" /></label>
      </div>
      <div class="tpl-vars-actions">
        <button class="primary" data-action="apply-tpl-vars">🚀 7개 프레임에 적용</button>
        <button class="secondary" data-action="seed-tpl-demo">🧪 데모 (유기농 김치)로 미리보기</button>
        ${isCustomized ? `<button class="ghost" data-action="clear-tpl-vars">초기화</button>` : ""}
        <button class="ghost" data-action="toggle-tpl-view-all">${viewAll ? "📑 탭 모드로 보기" : "📋 7개 모두 한 번에 보기"}</button>
      </div>
      ${isCustomized ? `<div class="tpl-vars-note">✅ 입력한 변수가 모든 프레임에 적용되었습니다.</div>` : `<div class="tpl-vars-note muted">💡 비워두면 마케팅MRI 기본 예시가 표시됩니다.</div>`}
    </section>
  `;

  if (viewAll) {
    return `
      <div class="tpl-wrap">
        ${renderHead()}
        ${inputForm}
        <div class="tpl-all-grid">
          ${COPY_FRAMES.map((f) => renderFrameCard(f, vars)).join("")}
        </div>
      </div>
    `;
  }

  const tabs = COPY_FRAMES.map((f) => `
    <button class="tpl-tab ${activeId === f.id ? "active" : ""}" data-action="set-copy-template" data-id="${f.id}">
      <strong>${f.name}</strong>
      <small>${f.fullName}</small>
    </button>
  `).join("");

  const active = getFrame(activeId);
  const filled = active.fill(vars);

  return `
    <div class="tpl-wrap">
      ${renderHead()}
      ${inputForm}

      <div class="tpl-tabs">${tabs}</div>

      <section class="tpl-detail">
        <div class="tpl-info">
          <h5>${active.name} <small style="font-weight:400;color:#64748b">— ${active.fullName}</small></h5>
          <p>${active.desc}</p>
          <div class="tpl-best">💡 <b>적합 용도:</b> ${active.bestFor.join(" · ")}</div>
        </div>

        <div class="tpl-cols">
          <article class="tpl-col">
            <h6>📐 프레임 가이드</h6>
            ${active.steps.map((s, i) => `
              <div class="tpl-step">
                <div class="tpl-step-n">${i + 1}</div>
                <div>
                  <div><b>${s.k}</b> <small>(${s.lb})</small></div>
                  <small class="muted">${s.guide}</small>
                </div>
              </div>
            `).join("")}
          </article>

          <article class="tpl-col">
            <h6>✨ ${isCustomized ? "내 입력으로 채워진 카피" : "기본 예시"}</h6>
            ${active.steps.map((s) => `
              <div class="tpl-fill">
                <div class="tpl-fill-k">${s.k} <small>(${s.lb})</small></div>
                <div class="tpl-fill-v">${esc(filled[s.k] || "")}</div>
              </div>
            `).join("")}
            <button class="ghost small" data-action="copy-template" data-id="${active.id}">📋 적용 예시 복사</button>
          </article>
        </div>
      </section>
    </div>
  `;
}

function renderHead() {
  return `
    <header class="tpl-head">
      <div>
        <h4>📚 카피 템플릿 라이브러리</h4>
        <p class="muted">검증된 카피라이팅 프레임 ${COPY_FRAMES.length}종 — 변수만 입력하면 28개 카피 초안 한 번에 생성</p>
      </div>
    </header>
  `;
}

function renderFrameCard(frame, vars) {
  const filled = frame.fill(vars);
  return `
    <article class="tpl-card">
      <header class="tpl-card-head">
        <div>
          <strong>${frame.name}</strong>
          <small class="muted"> — ${frame.fullName}</small>
        </div>
        <button class="ghost small" data-action="copy-frame-card" data-id="${frame.id}">📋 복사</button>
      </header>
      <p class="tpl-card-desc">${frame.desc}</p>
      <div class="tpl-card-best">💡 ${frame.bestFor.join(" · ")}</div>
      <div class="tpl-card-fills" data-frame="${frame.id}">
        ${frame.steps.map((s) => `
          <div class="tpl-fill">
            <div class="tpl-fill-k">${s.k} <small>(${s.lb})</small></div>
            <div class="tpl-fill-v">${esc(filled[s.k] || "")}</div>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" }[c]));
}
