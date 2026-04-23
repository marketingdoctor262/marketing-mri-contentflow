import {
  generateBlogDraft,
  generateInstagramCarousel,
  generateShortformScript,
  generateDetailPage,
  CONTENT_TONES,
} from "../../services/contentDraftService.js";

const TYPES = [
  { id: "blog",       lb: "블로그 글",     ic: "📝" },
  { id: "instagram",  lb: "인스타 캐러셀", ic: "📸" },
  { id: "shortform",  lb: "숏폼 스크립트", ic: "🎬" },
  { id: "detail",     lb: "상세페이지",    ic: "🛒" },
];

export function renderCfGenerate(state) {
  const t = state.draftType || "blog";
  const draft = state.draftResult;

  const typeTabs = TYPES.map((tt) => `
    <button class="draft-tab ${t === tt.id ? "active" : ""}" data-action="set-draft-type" data-id="${tt.id}">${tt.ic} ${tt.lb}</button>
  `).join("");

  const toneOpts = Object.entries(CONTENT_TONES).map(([id, info]) => `
    <option value="${id}" ${state.draftTone === id ? "selected" : ""}>${info.lb}</option>
  `).join("");

  return `
    <div class="draft-wrap">
      <header class="draft-head">
        <div>
          <h4>✍ AI 콘텐츠 초안 생성기</h4>
          <p class="muted">주제 + 톤만 정하면 블로그/인스타/숏폼/상세페이지 초안을 즉시 생성합니다.</p>
        </div>
      </header>

      <div class="draft-tabs">${typeTabs}</div>

      <div class="draft-form">
        <input id="draftTopic" type="text" placeholder="주제 (예: 소상공인을 위한 마케팅 진단)" value="${escapeAttr(state.draftTopic || "")}" />
        <input id="draftKeyword" type="text" placeholder="핵심 키워드 (선택)" value="${escapeAttr(state.draftKeyword || "")}" />
        <select id="draftToneSelect">${toneOpts}</select>
        <button class="primary" data-action="run-draft">🚀 초안 생성</button>
        ${draft ? `<button class="ghost" data-action="copy-draft">📋 전체 복사</button>` : ""}
      </div>

      ${!draft ? renderEmpty() : renderDraft(draft)}
    </div>
  `;
}

function renderEmpty() {
  return `
    <div class="draft-empty">
      <div class="draft-empty-ic">✍</div>
      <h5>주제를 입력하고 생성을 눌러보세요</h5>
      <p class="muted">탬플릿 기반 초안 → 향후 LLM(Claude/GPT) 연동으로 업그레이드 가능</p>
    </div>
  `;
}

function renderDraft(d) {
  if (d.type === "blog") return renderBlog(d);
  if (d.type === "instagram") return renderInstagram(d);
  if (d.type === "shortform") return renderShortform(d);
  if (d.type === "detail") return renderDetail(d);
  return "";
}

function renderBlog(d) {
  return `
    <section class="draft-out">
      <div class="draft-meta">
        <div><b>📰 제목</b><br>${escapeText(d.meta.title)}</div>
        <div><b>📝 메타 디스크립션</b><br><small>${escapeText(d.meta.description)}</small></div>
        <div><b>🏷 키워드</b><br><small>${escapeText(d.meta.keywords)}</small></div>
        <div><b>🔗 슬러그</b><br><code>/${escapeText(d.meta.slug)}</code></div>
        <div><b>⏱ 예상 분량</b><br>${d.estimatedMinutes}분 읽기</div>
        <div><b>🎤 톤</b><br>${escapeText(d.tone)}</div>
      </div>
      <div class="draft-body"><pre>${escapeText(d.body)}</pre></div>
      <div class="draft-cta">${escapeText(d.cta)}</div>
    </section>
  `;
}

function renderInstagram(d) {
  const anyAi = d.slides.some((s) => s.useAiImage);
  return `
    <section class="draft-out">
      <div class="ig-toolbar">
        <h5 style="margin:0">📸 캐러셀 ${d.slides.length}장</h5>
        <div class="ig-toolbar-actions">
          <button class="ghost" data-action="ig-toggle-ai">${anyAi ? "🎨 디자인 카드로 전환" : "🤖 AI 사진으로 전환"}</button>
          ${anyAi ? `<button class="ghost" data-action="ig-regen-images">🔄 AI 사진 다시 생성</button>` : ""}
        </div>
      </div>

      <div class="ig-download-bar">
        <div>
          <strong>📦 모두 다운로드</strong>
          <small class="muted"> · 텍스트가 박힌 완성 PNG ${d.slides.length}장을 한 번에 저장합니다</small>
        </div>
        <button class="primary" data-action="ig-download-all">⬇ ${d.slides.length}장 모두 다운로드</button>
      </div>
      <div class="ig-slides">
        ${d.slides.map((s) => renderIgSlide(s)).join("")}
      </div>
      <h5>📝 캡션</h5>
      <div class="draft-body"><pre>${escapeText(d.caption)}</pre></div>
    </section>
  `;
}

function renderIgSlide(s) {
  // 기본은 placeholder SVG(텍스트가 그려진 완성 카드)를 바로 표시.
  // 사용자가 업로드한 이미지가 있으면 그걸 사용.
  // 우선순위: 사용자 업로드 > AI 사진(요청 시) > SVG 디자인 카드(기본)
  const useAiPhoto = !!s.useAiImage;
  const src = s.customImage || (useAiPhoto ? s.imageUrl : s.placeholderUrl);
  const fallback = (s.placeholderUrl || "").replace(/"/g, "&quot;");
  const isCustom = !!s.customImage;
  const isPhoto = !isCustom && useAiPhoto;
  return `
    <article class="ig-slide" data-slide-n="${s.n}">
      <div class="ig-slide-img-wrap">
        <img class="ig-slide-img" src="${escapeAttr(src)}" alt="${escapeAttr(s.role)}" loading="lazy"
             onerror="this.onerror=null; this.src='${fallback}'; this.dataset.fallback='1';" />
        ${(isCustom || isPhoto) ? `<div class="ig-slide-overlay"><div class="ig-slide-text">${escapeText(s.text)}</div></div>` : ""}
        <div class="ig-slide-badge">${s.n} · ${escapeText(s.role)}</div>
        ${isCustom ? `<span class="ig-slide-tag user">📷 내 이미지</span>` : isPhoto ? `<span class="ig-slide-tag ai">🤖 AI 사진</span>` : `<span class="ig-slide-tag design">🎨 자동 디자인</span>`}
      </div>
      <div class="ig-slide-caption"><pre>${escapeText(s.text)}</pre></div>
      <div class="ig-slide-controls">
        <label class="ig-upload-btn">
          📁 이미지 업로드
          <input type="file" accept="image/*" data-ig-upload="${s.n}" hidden />
        </label>
        ${s.customImage ? `<button class="ghost small" data-action="ig-reset-image" data-slide-n="${s.n}">↩ AI 이미지로 되돌리기</button>` : ""}
        <button class="ghost small" data-action="ig-download-image" data-slide-n="${s.n}">⬇ 다운로드</button>
      </div>
    </article>
  `;
}

function renderShortform(d) {
  return `
    <section class="draft-out">
      <h5>🎬 ${d.duration}초 숏폼 스크립트</h5>
      <div class="draft-beats">
        ${d.beats.map((b) => `
          <div class="draft-beat">
            <div class="draft-beat-t">${b.t}</div>
            <div class="draft-beat-role">${b.role}</div>
            <div class="draft-beat-line">${escapeText(b.line)}</div>
          </div>
        `).join("")}
      </div>
      <h5>🖼 화면 텍스트</h5>
      <div class="draft-body"><pre>${escapeText(d.onScreenText)}</pre></div>
      <h5>📝 캡션</h5>
      <div class="draft-body"><pre>${escapeText(d.caption)}</pre></div>
    </section>
  `;
}

function renderDetail(d) {
  return `
    <section class="draft-out">
      <h5>🛒 상세페이지 섹션 ${d.sections.length}개</h5>
      ${d.sections.map((s) => `
        <article class="draft-section">
          <h6>${escapeText(s.h)}</h6>
          <pre>${escapeText(s.body)}</pre>
        </article>
      `).join("")}
      <div class="draft-cta">${escapeText(d.cta)}</div>
    </section>
  `;
}

export function buildDraftFromState(state) {
  const opts = {
    topic: state.draftTopic || "마케팅 진단",
    keyword: state.draftKeyword || "",
    brand: state.inputBrand || "",
    tone: state.draftTone || "friendly",
  };
  const t = state.draftType || "blog";
  if (t === "blog") return generateBlogDraft({ ...opts, length: "medium" });
  if (t === "instagram") return generateInstagramCarousel(opts);
  if (t === "shortform") return generateShortformScript({ ...opts, duration: 30 });
  if (t === "detail") return generateDetailPage({ ...opts, product: opts.topic, benefit: opts.keyword });
  return null;
}

function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }
function escapeText(s) { return String(s).replace(/[&<>]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c])); }
