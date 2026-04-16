export const CHAPTERS = [
  { id: "brand", lb: "브랜드 아이덴티티", ic: "🏷", co: "#a855f7" },
  { id: "competition", lb: "경쟁 환경 분석", ic: "⚔", co: "#dc2626" },
  { id: "keywords", lb: "핵심 키워드·SEO", ic: "🔍", co: "#3b82f6" },
  { id: "trust_buy", lb: "이성적 구매신뢰포인트", ic: "✅", co: "#10b981" },
  { id: "homepage", lb: "구매플랫폼 분석", ic: "🛒", co: "#06b6d4" },
  { id: "trust", lb: "감성 신뢰포인트", ic: "💎", co: "#f97316" },
  { id: "detail", lb: "상세페이지 분석", ic: "📄", co: "#14b8a6" },
  { id: "content", lb: "콘텐츠 마케팅", ic: "✍", co: "#22c55e" },
  { id: "sem", lb: "검색엔진 마케팅", ic: "🔎", co: "#0ea5e9" },
  { id: "sns", lb: "SNS 채널 현황", ic: "📱", co: "#ec4899" },
  { id: "ads", lb: "광고 운영 현황", ic: "📢", co: "#f59e0b" },
  { id: "viral", lb: "홍보·바이럴", ic: "🔥", co: "#ef4444" },
  { id: "info", lb: "정보습득·매체광고", ic: "📺", co: "#06b6d4" },
  { id: "retention", lb: "리텐션 마케팅", ic: "🔄", co: "#8b5cf6" },
  { id: "data_analytics", lb: "통계·데이터 분석", ic: "📊", co: "#6366f1" },
];

const baseSwot = {
  str: ["기초 진단 데이터 확보", "영역별 점수 체계 정리", "개선 우선순위 도출 가능"],
  wk: ["콘텐츠·신뢰·전환 요소 보강 필요", "채널별 실행 일관성 부족", "측정 가능한 KPI 설계 미흡"],
  act: [
    "핵심 약점 1개 영역을 이번 주 즉시 개선",
    "1개월 내 운영 루틴과 지표 대시보드 정착",
    "3개월 내 채널별 확장 전략 및 자동화 적용",
  ],
};

export const createChapter = (score, sum, overrides = {}) => ({
  s: score,
  sum,
  groups: [
    {
      id: "core",
      cat: "핵심 진단 항목",
      score,
      items: [
        { n: "현황 정리 수준", s: score + 5 > 100 ? 100 : score + 5, st: "보통", tip: "현재 데이터를 기반으로 진단 가능" },
        { n: "실행 가능성", s: score, st: "취약", tip: "운영 루틴으로 연결할 구체 액션 필요" },
        { n: "측정 체계", s: score - 8 < 0 ? 0 : score - 8, st: "취약", tip: "정량 KPI와 추적 체계 정비 필요" },
      ],
    },
  ],
  ...baseSwot,
  ...overrides,
});

export const METRIC_INFO = {
  fcp: { l: "FCP", d: "첫 콘텐츠" },
  lcp: { l: "LCP", d: "최대 콘텐츠" },
  tbt: { l: "TBT", d: "총 차단" },
  cls: { l: "CLS", d: "레이아웃" },
  si: { l: "SI", d: "속도 지수" },
  tti: { l: "TTI", d: "완전 반응" },
  ttfb: { l: "TTFB", d: "서버 응답" },
};
