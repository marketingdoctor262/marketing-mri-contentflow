// AI 초안 생성기 (템플릿 기반, 향후 LLM 연동 가능)
// - 블로그 / 인스타 캐러셀 / 숏폼 스크립트 / 상세페이지

const TONES = {
  friendly:  { lb: "친근체",     opening: "안녕하세요! ", closing: "오늘도 응원합니다 😊" },
  expert:    { lb: "전문가체",   opening: "본 글에서는 ",  closing: "참고가 되셨길 바랍니다." },
  story:     { lb: "스토리텔링", opening: "한 사장님이 계셨습니다. ", closing: "당신의 이야기도 이렇게 바뀔 수 있습니다." },
  data:      { lb: "데이터 중심", opening: "최근 데이터를 보면, ", closing: "수치는 거짓말하지 않습니다." },
  humor:     { lb: "유머러스",   opening: "솔직히 말해볼까요? ", closing: "오늘도 광고비, 잘 쓰셨길!" },
};

function pickTone(id) { return TONES[id] || TONES.friendly; }

// ───────── Blog: 풀 콘텐츠 생성 ─────────

function blogIntro(kw, brand, t) {
  return `${t.opening}오늘은 **${kw}**에 대해 한 번 깊게 파헤쳐보려고 합니다.

요즘 ${kw}에 관심을 가지는 분들이 정말 많아졌습니다. 검색량도 지난 12개월 동안 꾸준히 증가했고, 관련 커뮤니티에서도 거의 매주 새로운 질문이 올라옵니다. 그런데 정작 “${kw}가 정확히 무엇이고, 어떻게 시작해야 하느냐”에 대한 명확한 가이드는 의외로 찾기 어렵습니다.

이 글에서는 ${brand ? brand + "가 " : ""}현장에서 직접 부딪히며 정리한 ${kw}의 핵심을, 처음 접하는 분도 따라올 수 있도록 단계별로 풀어드리겠습니다. 끝까지 읽으시면 ① ${kw}의 정확한 개념 ② 실전 적용법 ③ 자주 빠지는 함정 세 가지를 모두 가져가실 수 있습니다.`;
}

function blogSectionWhy(kw) {
  return `많은 분들이 ${kw}를 단순한 ‘유행어’ 정도로 받아들입니다. 하지만 실제로 ${kw}는 매출, 브랜드 인지, 고객 충성도에 직접적인 영향을 주는 요소입니다.

특히 최근 2~3년 사이 검색·구매 행동 패턴이 빠르게 바뀌면서, ${kw}를 제대로 이해하지 못한 브랜드와 그렇지 않은 브랜드 간의 격차가 눈에 띄게 벌어지고 있습니다. 단순히 “하면 좋다”가 아니라 “하지 않으면 도태된다”에 가까운 영역이 된 것이죠.

**왜 지금 ${kw}가 중요한가?**
- ✅ 검색 알고리즘과 SNS 추천 알고리즘이 ${kw}와 관련된 신호를 강하게 반영합니다.
- ✅ 고객은 의사결정 전에 평균 7회 이상 ${kw} 관련 정보를 접합니다.
- ✅ 경쟁사는 이미 ${kw}에 인력·예산을 배분하기 시작했습니다.

> 💡 **인사이트** — ${kw}는 “트렌드”가 아니라 “기본기”로 자리 잡고 있습니다. 늦게 시작할수록 따라잡기 위한 비용이 기하급수적으로 늘어납니다.`;
}

function blogSectionMistakes(kw) {
  return `현장에서 가장 자주 보는 ${kw} 실수 3가지를 정리했습니다. 본인이 해당된다면 지금이 점검할 시점입니다.

**① 목표를 정의하지 않고 시작합니다.**
“일단 해보자”로 출발하면 3개월 뒤 “이게 효과가 있긴 한가?”라는 질문 앞에 멈춰서게 됩니다. ${kw}를 시작하기 전, “3개월 뒤 어떤 지표가 어떻게 바뀌어야 성공인가?”를 한 줄로 적어두세요.

**② 측정 가능한 KPI를 설정하지 않습니다.**
방문자 수, 저장 수, 클릭률, 전환율 — 어떤 숫자를 매주 볼 것인지 정하지 않으면 개선이 불가능합니다. 측정하지 않으면 운영하지 않는 것과 같습니다.

**③ 한두 번 해보고 포기합니다.**
${kw}는 단기 캠페인이 아니라 누적되는 자산입니다. 최소 12주는 일관된 패턴으로 운영해야 데이터가 의미를 갖습니다.`;
}

function blogSectionHowto(kw) {
  return `이제 실전입니다. ${kw}를 처음 시작하는 분들을 위한 4단계 로드맵입니다.

**STEP 1 · 진단** — 현재 상태를 객관적으로 점검합니다. 이미 ${kw} 관련 활동이 있다면 무엇이 잘되고 무엇이 막혀 있는지 데이터로 확인합니다.

**STEP 2 · 키워드 / 주제 발굴** — 우리 고객이 실제로 검색하는 단어, 궁금해하는 질문을 100개 이상 모읍니다. 의외로 “이 정도면 충분하지” 싶은 키워드 풀이 가장 큰 약점인 경우가 많습니다.

**STEP 3 · 콘텐츠/액션 제작** — 발굴한 주제를 기반으로 블로그·SNS·숏폼 등 채널별 형태로 변환합니다. 한 가지 주제를 3~5개 채널로 ‘리퍼퍼스’하면 효율이 훨씬 좋아집니다.

**STEP 4 · 측정 & 개선** — 매주 한 번, 정해진 KPI를 확인하고 잘된 것은 시리즈화, 안 된 것은 각도를 바꾸거나 폐기합니다. 이 루프가 12주 돌면 결과가 보입니다.`;
}

function blogSectionCase(kw, brand) {
  return `이론만으로는 와닿지 않으실 테니 실제 사례를 하나 보여드리겠습니다.

A 브랜드는 ${kw}에 대한 명확한 기준 없이 6개월간 광고만 집행하고 있었습니다. 월 광고비는 꾸준히 늘었지만 매출은 정체. 결국 ${brand ? brand + "와 함께 " : ""}진단을 받았고, 가장 큰 문제가 “${kw} 부재”였다는 사실이 드러났습니다.

이후 12주간 ${kw}를 중심으로 콘텐츠/광고/CRM을 재정렬했고, 결과는 다음과 같았습니다.
- 📈 자연 유입 트래픽 +63%
- 💬 인스타 저장 수 평균 +210%
- 💰 광고 ROAS 2.4배 → 4.1배

핵심은 **‘새로운 무언가를 시작’한 게 아니라 ‘${kw}라는 기준으로 기존 활동을 다시 정리’한 것**이었습니다.`;
}

function blogSectionFaq(kw) {
  return `**Q. ${kw}를 시작하기 좋은 시점은 언제인가요?**
오늘이 가장 좋습니다. ${kw}는 시간이 지날수록 효과가 누적되는 자산형 활동이라, 늦게 시작할수록 격차가 벌어집니다.

**Q. 1인 사장이라 시간이 없습니다. 그래도 가능할까요?**
네. 주 3시간만 일정하게 투입해도 12주 뒤 변화를 체감할 수 있습니다. ‘많이’보다 ‘꾸준히’가 핵심입니다.

**Q. 외주를 맡겨도 되나요?**
가능합니다. 단, 우리가 KPI와 방향을 명확히 정의해야 외주가 제대로 작동합니다. 방향 없이 맡기면 비용만 새어나갑니다.

**Q. 효과가 없으면 어떻게 하나요?**
대부분 ‘효과가 없는’ 게 아니라 ‘측정을 안 한’ 경우입니다. 진단 → 측정 → 개선 루프를 한 바퀴 돌려보면 거의 모든 경우 원인이 보입니다.`;
}

function blogSectionNext(kw, brand) {
  return `여기까지 읽으셨다면 ${kw}에 대한 큰 그림은 잡으셨습니다. 다음에 해야 할 행동을 한 가지만 추천드린다면:

**“오늘 30분만 시간을 내서 우리 브랜드의 ${kw} 현재 상태를 한 줄로 적어보세요.”**

“잘하고 있다 / 모르겠다 / 거의 안 한다” 셋 중 하나일 텐데, 어떤 답이든 그 자체가 다음 단계의 출발점이 됩니다. ${brand ? brand + "는 " : ""}이 30분짜리 점검을 자동화한 무료 진단을 운영하고 있으니, 시간이 부족하시다면 활용해보셔도 좋습니다.`;
}

export function generateBlogDraft({ topic, keyword = "", brand = "", tone = "friendly", length = "medium" } = {}) {
  const t = pickTone(tone);
  const kw = keyword || topic || "마케팅";
  const sections = length === "long" ? 6 : length === "short" ? 3 : 5;

  const all = [
    { h: `${kw}, 왜 지금 알아야 할까요?`,            body: blogSectionWhy(kw) },
    { h: `많은 분들이 놓치는 ${kw}의 실수 3가지`,    body: blogSectionMistakes(kw) },
    { h: `${kw} 실전 로드맵 — 4단계로 끝내기`,       body: blogSectionHowto(kw) },
    { h: `사례로 보는 ${kw} 효과`,                   body: blogSectionCase(kw, brand) },
    { h: `${kw} 자주 묻는 질문 (FAQ)`,                body: blogSectionFaq(kw) },
    { h: `${brand ? brand + "가 " : ""}추천하는 다음 액션`, body: blogSectionNext(kw, brand) },
  ].slice(0, sections);

  const body = all.map((s) => `## ${s.h}\n\n${s.body}`).join("\n\n");
  const fullBody = `${blogIntro(kw, brand, t)}\n\n${body}\n\n---\n\n${t.closing}`;

  const meta = {
    title: `${kw} 완벽 가이드 — 처음부터 끝까지 한 번에 정리`,
    description: `${kw}에 대해 알아야 할 모든 것을 ${all.length}단계로 정리했습니다. 실전 사례와 4단계 로드맵, FAQ까지 포함된 완전 가이드.`,
    keywords: [kw, `${kw} 방법`, `${kw} 가이드`, `${kw} 시작하기`, `${kw} 사례`].join(", "),
    slug: kw.replace(/\s+/g, "-").toLowerCase(),
  };

  const wordCount = fullBody.length;
  const minutes = Math.max(5, Math.round(wordCount / 500));

  return {
    type: "blog",
    tone: t.lb,
    meta,
    h1: meta.title,
    body: fullBody,
    cta: `👉 ${brand || "마케팅MRI"} 무료 진단 받아보기`,
    estimatedMinutes: minutes,
    wordCount,
  };
}

// ───────── Instagram: 캐러셀 + 이미지 ─────────

// Lorem Picsum — API 키 없이 항상 로드되는 무료 사진 CDN
// seed 값이 같으면 같은 사진을 반환 → 슬라이드마다 일관된 이미지
const PICSUM = "https://picsum.photos/seed";

const ROLE_VISUAL = {
  "훅":       { emoji: "🚨", concept: "alert warning megaphone",           colors: ["#ef4444", "#f97316"] },
  "문제 제기": { emoji: "😟", concept: "confused businessman question mark", colors: ["#6366f1", "#8b5cf6"] },
  "해결1":    { emoji: "🎯", concept: "target goal focus",                  colors: ["#06b6d4", "#3b82f6"] },
  "해결2":    { emoji: "📊", concept: "data chart dashboard analytics",     colors: ["#10b981", "#059669"] },
  "해결3":    { emoji: "💡", concept: "light bulb idea breakthrough",       colors: ["#f59e0b", "#eab308"] },
  "사례":     { emoji: "📈", concept: "growth chart success trophy",        colors: ["#22c55e", "#16a34a"] },
  "요약":     { emoji: "✅", concept: "checklist three steps completion",   colors: ["#8b5cf6", "#a855f7"] },
  "CTA":      { emoji: "👉", concept: "click button call to action",        colors: ["#ec4899", "#f43f5e"] },
};

function getRoleVisual(role) {
  return ROLE_VISUAL[role] || { emoji: "✨", concept: "marketing creative", colors: ["#6366f1", "#8b5cf6"] };
}

function buildImagePrompt(kw, role) {
  const v = getRoleVisual(role);
  // Picsum은 키워드 검색을 지원하지 않지만, seed 문자열로 사용해 슬라이드별 일관성 확보
  const seedStr = `${(kw || "marketing").replace(/\s+/g, "-")}-${v.concept.split(" ")[0]}-${role}`;
  return encodeURIComponent(seedStr);
}

export function generateImageUrl(promptOrSeedStr, seed = 1, size = 768) {
  // Lorem Picsum: /seed/{문자열}/{너비}/{높이} — 같은 seed면 같은 사진
  // 숫자 seed를 추가해 재생성(🔄) 시 다른 사진이 나오도록 보장
  const finalSeed = `${promptOrSeedStr}-${seed}`;
  return `${PICSUM}/${finalSeed}/${size}/${size}`;
}

// SVG 텍스트 줄바꿈 — 긴 줄을 maxChars 단위로 자름
function wrapLines(text, maxChars = 14) {
  const raw = String(text || "").replace(/[<>&]/g, "");
  const lines = [];
  raw.split("\n").forEach((line) => {
    const words = line.split(" ");
    let cur = "";
    words.forEach((w) => {
      if ((cur + " " + w).trim().length > maxChars) {
        if (cur) lines.push(cur.trim());
        cur = w;
      } else {
        cur = (cur + " " + w).trim();
      }
    });
    if (cur) lines.push(cur.trim());
  });
  return lines.slice(0, 5);
}

// SVG 데이터 URL 플레이스홀더 — 실제 슬라이드 메시지를 포함하는 완성형 이미지
export function generatePlaceholderImage(role, text = "", kw = "") {
  const v = getRoleVisual(role);
  const [c1, c2] = v.colors;
  const lines = wrapLines(text, 14);
  const fontSize = lines.length >= 4 ? 48 : lines.length === 3 ? 56 : 64;
  const lineHeight = fontSize * 1.25;
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = 520 - totalTextHeight / 2 + fontSize;
  const textEls = lines.map((ln, i) =>
    `<text x="400" y="${textStartY + i * lineHeight}" font-size="${fontSize}" font-weight="800" fill="white" text-anchor="middle" font-family="'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif" style="paint-order:stroke;stroke:rgba(0,0,0,0.25);stroke-width:3px">${ln}</text>`
  ).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <pattern id="dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <circle cx="24" cy="24" r="2" fill="rgba(255,255,255,0.13)"/>
      </pattern>
    </defs>
    <rect width="800" height="800" fill="url(#g)"/>
    <rect width="800" height="800" fill="url(#dots)"/>
    <rect x="40" y="40" width="120" height="42" rx="21" fill="rgba(0,0,0,0.35)"/>
    <text x="100" y="69" font-size="22" font-weight="700" fill="white" text-anchor="middle" font-family="sans-serif">${role}</text>
    <circle cx="400" cy="230" r="90" fill="rgba(255,255,255,0.22)"/>
    <text x="400" y="275" font-size="120" text-anchor="middle" font-family="sans-serif">${v.emoji}</text>
    ${textEls}
    ${kw ? `<text x="400" y="740" font-size="26" fill="rgba(255,255,255,0.88)" text-anchor="middle" font-family="sans-serif" font-weight="600">#${String(kw).replace(/\s+/g, "").slice(0, 24)}</text>` : ""}
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ───────── Canvas 합성: 이미지 + 오버레이 텍스트를 하나의 PNG로 ─────────

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Picsum / data URL 모두 지원
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// 슬라이드 → PNG Blob (텍스트 합성 포함)
// useAiImage 또는 customImage 모드에서는 사진 위에 오버레이를 그려서 PNG로 출력
// 기본(디자인 카드) 모드는 SVG에 텍스트가 이미 박혀있어 그대로 PNG로 변환
export async function composeSlideBlob(slide, kw = "") {
  const useAi = !!slide.useAiImage;
  const src = slide.customImage || (useAi ? slide.imageUrl : slide.placeholderUrl);
  const overlay = !!slide.customImage || useAi; // 디자인 카드는 이미 텍스트 박힘

  let img;
  try {
    img = await loadImage(src);
  } catch {
    // 원본 로드 실패 시 SVG 플레이스홀더로 폴백
    img = await loadImage(slide.placeholderUrl || generatePlaceholderImage(slide.role, slide.text, kw));
  }

  const size = 800;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // 이미지: cover fit
  const ratio = Math.max(size / img.width, size / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

  if (overlay) {
    // 어두운 그라디언트 (텍스트 가독성 확보)
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, "rgba(0,0,0,0.25)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // 역할 배지
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    roundRect(ctx, 40, 40, 200, 48, 24);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 22px 'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
    ctx.fillText(`${slide.n} · ${slide.role}`, 140, 64);

    // 메인 텍스트
    const lines = wrapLines(slide.text, 14);
    const fontSize = lines.length >= 4 ? 48 : lines.length === 3 ? 56 : 64;
    const lineH = fontSize * 1.25;
    const totalH = lines.length * lineH;
    const startY = (size - totalH) / 2 + fontSize;

    ctx.font = `800 ${fontSize}px 'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif`;
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    lines.forEach((ln, i) => ctx.fillText(ln, size / 2, startY + i * lineH));
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 해시태그
    if (kw) {
      ctx.font = "600 26px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(`#${String(kw).replace(/\s+/g, "").slice(0, 24)}`, size / 2, size - 50);
    }
  }

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function generateInstagramCarousel({ topic, keyword = "", brand = "", tone = "friendly" } = {}) {
  const t = pickTone(tone);
  const kw = keyword || topic || "마케팅";
  const seedBase = Math.abs(hashStr(kw)) % 100000;

  const slides = [
    { n: 1, role: "훅",       text: `🚨 ${kw}, 아직도 모르세요?\n3초만 보고 가세요` },
    { n: 2, role: "문제 제기", text: `대부분 사장님이 ${kw}에서\n매달 3가지 실수를 반복합니다` },
    { n: 3, role: "해결1",    text: `① ${kw} 핵심을\n먼저 파악하세요` },
    { n: 4, role: "해결2",    text: `② 데이터 기반으로\n매주 점검하세요` },
    { n: 5, role: "해결3",    text: `③ 실패 패턴을\n빠르게 끊어내세요` },
    { n: 6, role: "사례",     text: `📈 실제로 한 브랜드는\n2주만에 ${kw} 지표 +37%` },
    { n: 7, role: "요약",     text: `✅ 핵심 3가지\n① 진단 ② 측정 ③ 개선` },
    { n: 8, role: "CTA",      text: `${brand ? brand : "우리"} 무료 진단 →\n프로필 링크 확인 🔗` },
  ].map((s) => {
    const promptEnc = buildImagePrompt(kw, s.role);
    return {
      ...s,
      imagePrompt: promptEnc,
      imageUrl: generateImageUrl(promptEnc, seedBase + s.n),
      placeholderUrl: generatePlaceholderImage(s.role, s.text, kw),
      customImage: null,
    };
  });

  const caption = `${t.opening}${kw}에 대한 실전 팁을 정리했습니다.\n\n저장 🔖 해두고 매주 한 번씩 점검해보세요.\n\n${t.closing}\n\n#${kw.replace(/\s+/g, "")} #마케팅 #소상공인마케팅 #브랜딩 #콘텐츠마케팅`;
  return { type: "instagram", slides, caption, tone: t.lb, keyword: kw };
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

// ───────── Shortform / Detail (그대로) ─────────

export function generateShortformScript({ topic, keyword = "", duration = 30, tone = "friendly" } = {}) {
  const t = pickTone(tone);
  const kw = keyword || topic;
  const beats = duration <= 15
    ? [{ t: "0-3s", role: "훅",  line: `${kw}, 1초만에 정리해드립니다` }, { t: "3-12s", role: "본문", line: `핵심은 딱 하나 — '진단 먼저, 광고는 나중에'` }, { t: "12-15s", role: "CTA", line: `자세한 건 프로필 ↑` }]
    : duration <= 30
    ? [{ t: "0-3s",  role: "훅",     line: `${kw} 3초 정리 들어갑니다` },
       { t: "3-10s", role: "문제",    line: `매달 광고비는 쓰는데 매출은 그대로? 원인은 ${kw}` },
       { t: "10-22s",role: "해결",    line: `① 진단 ② 측정 ③ 개선 — 이 순서를 지키세요` },
       { t: "22-30s",role: "CTA",     line: `${t.closing} 프로필 링크 클릭 🔗` }]
    : [{ t: "0-5s",  role: "훅",     line: `${kw}, 60초만 투자하세요` },
       { t: "5-15s", role: "공감",    line: `${t.opening}저도 같은 고민이었습니다` },
       { t: "15-35s",role: "본문",    line: `1단계 — 진단\n2단계 — 키워드\n3단계 — 콘텐츠\n4단계 — 측정` },
       { t: "35-50s",role: "사례",    line: `한 브랜드는 이 4단계로 3개월만에 매출 2배` },
       { t: "50-60s",role: "CTA",     line: `지금 무료 진단 받기 → 프로필` }];
  return {
    type: "shortform",
    duration,
    tone: t.lb,
    beats,
    onScreenText: beats.map((b) => `[${b.t}] ${b.line}`).join("\n"),
    caption: `${kw} 실전 팁\n#${kw.replace(/\s+/g, "")} #쇼츠 #릴스 #마케팅팁`,
  };
}

export function generateDetailPage({ product = "", brand = "", benefit = "", tone = "expert" } = {}) {
  const t = pickTone(tone);
  const p = product || "우리 제품";
  return {
    type: "detail",
    tone: t.lb,
    sections: [
      { h: `🎯 핵심 베네핏`, body: `${t.opening}${p}는 ${benefit || "당신의 문제를 빠르게 해결"}합니다.\n- 효과 1 — 즉각적인 변화\n- 효과 2 — 검증된 데이터\n- 효과 3 — 안전한 사용` },
      { h: `❓ 왜 ${p}인가요?`, body: `시중 제품과 비교해 ${p}는 ① 차별화 포인트, ② 핵심 기술, ③ 검증된 후기로 차별화됩니다.` },
      { h: `📊 데이터로 증명`, body: `평균 만족도 4.8 / 5.0\n재구매율 67%\n누적 판매 12,000+` },
      { h: `🛡 보장`, body: `30일 환불 보장 · 무료 배송 · 평생 A/S 상담` },
      { h: `❔ FAQ`, body: `Q. 처음 사용자도 괜찮나요? → 네, 누구나 5분 안에 사용 가능합니다.\nQ. 효과가 없으면? → 30일 100% 환불.\nQ. 배송은? → 주문 후 1-2일 내 출고.` },
      { h: `🛒 지금 시작하세요`, body: `${brand ? brand + "에서" : ""} ${p}를 만나보세요.\n${t.closing}` },
    ],
    cta: `🛒 지금 ${p} 구매하기`,
  };
}

export const CONTENT_TONES = TONES;
