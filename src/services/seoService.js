const CHECKS = [
  ["document-title", "페이지 타이틀"],
  ["meta-description", "메타 디스크립션"],
  ["canonical", "Canonical 태그"],
  ["robots-txt", "robots.txt"],
  ["image-alt", "이미지 ALT"],
  ["viewport", "모바일 뷰포트"],
  ["crawlable-anchors", "크롤링 가능 링크"],
  ["font-size", "텍스트 가독성"],
];

export async function fetchSeoScore(url) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=seo`
    );
    const data = await res.json();
    const lhr = data?.lighthouseResult;
    const score = Math.round((lhr?.categories?.seo?.score || 0) * 100);
    const audits = lhr?.audits || {};
    const checks = CHECKS.map(([key, lb]) => ({ key, lb, ok: audits[key]?.score === 1 }));

    return {
      ok: true,
      url,
      score,
      checks,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      url,
      score: 0,
      checks: [],
      error: "SEO 측정 실패",
    };
  }
}
