// Keyword Lab service
// - Heuristic seed expansion (no external API)
// - Intent classification
// - Difficulty / value scoring → 4-quadrant matrix
// - Long-tail clustering

const INTENT_PATTERNS = [
  { id: "buy",       lb: "구매형", co: "#dc2626", kw: ["구매","주문","가격","할인","최저가","쿠폰","무료배송","후기","리뷰","비교","추천","순위","best","top"] },
  { id: "compare",   lb: "비교형", co: "#f59e0b", kw: ["vs","차이","비교","어떤","어느","뭐가","뭘","좋은","나은"] },
  { id: "info",      lb: "정보형", co: "#3b82f6", kw: ["방법","뜻","의미","원리","이유","종류","개념","가이드","튜토리얼","어떻게","why","how","what"] },
  { id: "brand",     lb: "브랜드형", co: "#8b5cf6", kw: [] }, // 동적: 브랜드명 포함 시
  { id: "review",    lb: "후기형", co: "#10b981", kw: ["후기","리뷰","사용기","경험","솔직","내돈내산","장단점"] },
];

const EXPANSION_MODIFIERS = {
  buy:     ["가격","할인","쿠폰","무료배송","최저가","구매처","어디서","주문","구입","사는법"],
  compare: ["vs","비교","차이","뭐가 좋아","순위","TOP5","어떤게 좋을까"],
  info:    ["방법","뜻","원리","종류","사용법","가이드","팁","주의사항","초보","기초"],
  review:  ["후기","리뷰","솔직후기","사용기","장단점","내돈내산","사용 후기"],
  long:    ["추천","2026","입문자","가성비","프리미엄","집에서","사장님","소상공인","30대","직장인","주부"],
  problem: ["안될때","문제","해결","오류","고장","수리","교체","대처법"],
  brand:   ["공식","정품","매장","오프라인","홈페이지","고객센터","문의"],
};

const STOPWORDS = new Set(["그리고","하지만","그러나","어떤","어느","제일","가장","정말","매우","바로","아주","좀더"]);

export function expandKeywords(seedRaw, brand = "", limit = 120) {
  const seeds = String(seedRaw || "")
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!seeds.length) return [];

  const out = new Map(); // key → { kw, src }
  const push = (kw, src) => {
    const k = kw.replace(/\s+/g, " ").trim();
    if (!k || k.length < 2) return;
    if (STOPWORDS.has(k)) return;
    if (!out.has(k)) out.set(k, { kw: k, src });
  };

  seeds.forEach((seed) => {
    push(seed, "seed");
    Object.entries(EXPANSION_MODIFIERS).forEach(([type, mods]) => {
      mods.forEach((m) => {
        push(`${seed} ${m}`, type);
        if (type === "buy" || type === "info") push(`${m} ${seed}`, type);
      });
    });
    if (brand) {
      push(`${brand} ${seed}`, "brand");
      push(`${seed} ${brand}`, "brand");
    }
  });

  return Array.from(out.values()).slice(0, limit);
}

export function classifyKeyword(kw, brand = "") {
  const lower = kw.toLowerCase();
  if (brand && lower.includes(brand.toLowerCase())) return INTENT_PATTERNS.find((i) => i.id === "brand");
  for (const p of INTENT_PATTERNS) {
    if (p.kw.some((k) => lower.includes(k))) return p;
  }
  return INTENT_PATTERNS.find((i) => i.id === "info");
}

// 가짜 검색량 / 경쟁도 (시드 기반 결정적 해시)
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function estimateMetrics(kw, intent) {
  const h = hash(kw);
  // 길수록 검색량 적게, 경쟁도 낮게
  const lenPenalty = Math.max(0.3, 1 - kw.length / 30);
  const baseVol = 100 + (h % 9900);
  const volume = Math.round(baseVol * lenPenalty);
  const difficulty = Math.min(95, Math.max(5, (h % 80) + Math.round(kw.length / 2)));
  // 구매/후기 인텐트 가치 가중
  const intentBoost = intent.id === "buy" ? 1.6 : intent.id === "review" ? 1.3 : intent.id === "compare" ? 1.2 : 1;
  const value = Math.round(Math.min(100, (volume / 100) * intentBoost + (100 - difficulty) * 0.4));
  return { volume, difficulty, value };
}

export function buildKeywordLab(seedRaw, brand = "") {
  const list = expandKeywords(seedRaw, brand);
  const enriched = list.map((row) => {
    const intent = classifyKeyword(row.kw, brand);
    const m = estimateMetrics(row.kw, intent);
    return { ...row, intent, ...m, score: m.value - m.difficulty * 0.3 };
  });
  enriched.sort((a, b) => b.score - a.score);
  return enriched;
}

export function bucketByQuadrant(items) {
  // 가로:난이도(낮을수록 좋음), 세로:가치(높을수록 좋음)
  const buckets = { gem: [], hardWin: [], easyLow: [], avoid: [] };
  items.forEach((it) => {
    const easy = it.difficulty <= 50;
    const valuable = it.value >= 50;
    if (easy && valuable) buckets.gem.push(it);
    else if (!easy && valuable) buckets.hardWin.push(it);
    else if (easy && !valuable) buckets.easyLow.push(it);
    else buckets.avoid.push(it);
  });
  return buckets;
}

export function clusterKeywords(items, maxClusters = 8) {
  // 단순 토큰 공유 기반 클러스터링
  const clusters = [];
  items.forEach((it) => {
    const tokens = it.kw.split(/\s+/).filter((t) => t.length >= 2);
    const head = tokens[0];
    let cluster = clusters.find((c) => c.head === head);
    if (!cluster) {
      cluster = { head, items: [], totalValue: 0 };
      clusters.push(cluster);
    }
    cluster.items.push(it);
    cluster.totalValue += it.value;
  });
  clusters.sort((a, b) => b.totalValue - a.totalValue);
  return clusters.slice(0, maxClusters);
}

export function suggestContentForKeyword(kw, intent) {
  const map = {
    buy:     ["💰 비교/구매 가이드 블로그", "📸 인스타 캐러셀(가격·할인 포인트 5장)", "🎬 60초 숏폼 — 구매 결정 포인트", "📧 장바구니 이탈 회복 메일"],
    compare: ["📊 vs 비교 표 블로그", "🎬 30초 숏폼 — A vs B 빠른 결론", "📸 인스타 카드뉴스 — 한장 비교표", "🧵 X(스레드) 토론 트윗"],
    info:    ["📚 정보형 블로그(SEO H2 5단)", "📺 유튜브 가이드 영상", "📸 인스타 캐러셀 10장 가이드", "📧 뉴스레터 시리즈"],
    review:  ["🌟 솔직 후기 블로그", "🎬 사용 후기 릴스", "📸 비포/애프터 인스타", "💬 Q&A 라이브"],
    brand:   ["🏠 브랜드 스토리 페이지", "📸 브랜드 인스타 그리드", "📰 보도자료/언론 노출", "📧 브랜드 뉴스레터"],
  };
  return map[intent.id] || map.info;
}

export const INTENTS = INTENT_PATTERNS;
