import { CHAPTERS } from "../data/chapters.js";
import { fetchSeoScore } from "./seoService.js";

/**
 * 경쟁사 자동 분석 서비스
 * - data_analytics 챕터는 GA4 비공개 데이터라 분석 불가 → 제외
 * - 나머지 14개 챕터는 URL 기반 휴리스틱 + 실제 SEO 점수로 추정
 */

export const EXCLUDED_CHAPTERS = ["data_analytics"];

export const COMPARABLE_CHAPTERS = CHAPTERS.filter(
  (c) => !EXCLUDED_CHAPTERS.includes(c.id)
);

/**
 * URL 문자열로부터 결정적 해시 생성 (같은 URL → 같은 점수)
 */
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * 챕터별 휴리스틱 시드 점수 (40~90 범위)
 * URL + 챕터 id 기반 결정적 난수 + 도메인 특성 가중치
 */
function heuristicChapterScore(url, chapterId, html) {
  const seed = hashString(url + "::" + chapterId);
  const base = 40 + (seed % 51); // 40~90

  // HTML 본문 힌트 기반 보정
  if (!html) return base;
  const lower = html.toLowerCase();

  const boost = (cond, amount) => (cond ? amount : 0);

  switch (chapterId) {
    case "brand":
      return clamp(
        base +
          boost(/og:title|og:description|og:image/.test(lower), 6) +
          boost(/<title>[^<]{10,}<\/title>/.test(lower), 4)
      );
    case "keywords":
      return clamp(
        base +
          boost(/<meta\s+name=["']description["']/.test(lower), 8) +
          boost(/<h1[^>]*>/.test(lower), 5) -
          boost(!/<meta\s+name=["']keywords["']/.test(lower), 0)
      );
    case "content":
      return clamp(
        base +
          boost(/\/blog|\/magazine|\/story|\/news|\/guide/.test(lower), 10) +
          boost(/article|<main/.test(lower), 4)
      );
    case "sns": {
      let sns = 0;
      if (/instagram\.com/.test(lower)) sns += 5;
      if (/facebook\.com/.test(lower)) sns += 4;
      if (/youtube\.com|youtu\.be/.test(lower)) sns += 6;
      if (/tiktok\.com/.test(lower)) sns += 5;
      if (/twitter\.com|x\.com/.test(lower)) sns += 3;
      return clamp(base + sns);
    }
    case "homepage":
      return clamp(
        base +
          boost(/add.?to.?cart|장바구니|구매하기|cart|checkout/.test(lower), 10) +
          boost(/<form/.test(lower), 3)
      );
    case "trust_buy":
      return clamp(
        base +
          boost(/review|후기|평점|rating|별점/.test(lower), 8) +
          boost(/환불|교환|보증|warranty|return/.test(lower), 5)
      );
    case "trust":
      return clamp(
        base +
          boost(/story|about|브랜드\s*스토리|philosophy/.test(lower), 6) +
          boost(/award|수상|인증|certified/.test(lower), 5)
      );
    case "detail":
      return clamp(
        base +
          boost(/<img[^>]+alt=["'][^"']{5,}/.test(lower), 5) +
          boost((lower.match(/<img /g) || []).length > 10, 6)
      );
    case "sem":
      return clamp(
        base +
          boost(/utm_source=|utm_medium=|gclid|fbclid/.test(lower), 6) +
          boost(/<link\s+rel=["']canonical["']/.test(lower), 4)
      );
    case "ads":
      return clamp(
        base +
          boost(/googletagmanager|gtag\(/.test(lower), 8) +
          boost(/fbq\(|facebook\.net\/en_US\/fbevents/.test(lower), 6)
      );
    case "viral":
      return clamp(
        base +
          boost(/share|공유하기|카카오톡|kakao/.test(lower), 6) +
          boost(/event|이벤트|프로모션|쿠폰/.test(lower), 5)
      );
    case "info":
      return clamp(
        base +
          boost(/press|보도자료|news|방송|매체/.test(lower), 7) +
          boost(/youtube\.com\/embed|iframe.+youtube/.test(lower), 5)
      );
    case "retention":
      return clamp(
        base +
          boost(/member|회원|로그인|signup|가입/.test(lower), 6) +
          boost(/newsletter|구독|subscribe|멤버십|membership/.test(lower), 6)
      );
    case "competition":
      // URL 길이·https 여부 등 간접 지표
      return clamp(base + boost(url.startsWith("https://"), 4));
    default:
      return base;
  }
}

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * 경쟁사 HTML 간이 크롤링 (CORS 제한 고려, 실패 시 null)
 */
async function fetchHtml(url) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * 경쟁사 분석 수행
 * @returns {Promise<{brand, url, seoScore, scores: {[chId]: number}, totalScore, analyzedAt, notes: string[]}>}
 */
export async function analyzeCompetitor(brand, url) {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error("올바른 URL 형식이 아닙니다. (http:// 또는 https:// 로 시작)");
  }

  const notes = [];
  const [seoResult, html] = await Promise.all([
    fetchSeoScore(url).catch(() => null),
    fetchHtml(url),
  ]);

  const seoScore = seoResult?.ok ? seoResult.score : null;
  if (!html) notes.push("HTML 직접 크롤링 불가(CORS) — URL 휴리스틱으로만 추정");
  if (!seoScore) notes.push("SEO 실측 실패 — 휴리스틱만 반영");

  const scores = {};
  for (const ch of COMPARABLE_CHAPTERS) {
    let s = heuristicChapterScore(url, ch.id, html);
    // keywords/sem 챕터엔 실측 SEO를 0.4 비중으로 반영
    if (seoScore != null && (ch.id === "keywords" || ch.id === "sem")) {
      s = Math.round(s * 0.6 + seoScore * 0.4);
    }
    scores[ch.id] = clamp(s);
  }

  const total = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / COMPARABLE_CHAPTERS.length
  );

  return {
    brand: brand || new URL(url).hostname,
    url,
    seoScore,
    scores,
    totalScore: total,
    analyzedAt: Date.now(),
    notes,
  };
}
